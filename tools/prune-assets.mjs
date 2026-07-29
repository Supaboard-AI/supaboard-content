/**
 * Finds Spaces objects no page references any more.
 *
 *   node tools/prune-assets.mjs            # report only
 *   node tools/prune-assets.mjs --delete   # actually remove them
 *
 * Upload keys are content-addressed, so re-running a migration after changing
 * how an image is fetched — a different scale, a corrected cover — uploads a
 * new object and silently strands the old one. Nothing breaks, but the bucket
 * accumulates. This diffs what is stored against what is referenced, across
 * both the markdown in this repo and the generated comparison modules in the
 * site repo.
 *
 * Deleting is opt-in, and only ever touches keys that nothing links to.
 */
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

import { DeleteObjectsCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";

import { publicBase, spaces } from "./spaces.mjs";

const shouldDelete = process.argv.includes("--delete");

const REPO_ROOT = new URL("..", import.meta.url).pathname;
const SOURCES = [
  join(REPO_ROOT, "posts"),
  new URL("../../supa-landing/src/content/comparisons/", import.meta.url).pathname,
];

const s3 = new S3Client({
  endpoint: spaces.endpoint,
  region: spaces.region,
  credentials: {
    accessKeyId: spaces.accessKeyId,
    secretAccessKey: spaces.secretAccessKey,
  },
});

/* ---- what is referenced ---------------------------------------------------- */

const referenced = new Set();

for (const dir of SOURCES) {
  let names;
  try {
    names = await readdir(dir);
  } catch {
    console.warn(`  ! skipped (not found): ${dir}`);
    continue;
  }

  for (const name of names) {
    if (!/\.(md|ts)$/.test(name)) continue;
    const text = await readFile(join(dir, name), "utf8");
    for (const match of text.matchAll(/https:\/\/[^\s"')]+digitaloceanspaces\.com\/([^\s"')?]+)/g)) {
      referenced.add(decodeURIComponent(match[1]));
    }
  }
}

/* ---- what is stored -------------------------------------------------------- */

const stored = [];
let token;

do {
  const page = await s3.send(
    new ListObjectsV2Command({
      Bucket: spaces.bucket,
      ContinuationToken: token,
    }),
  );
  for (const object of page.Contents ?? []) {
    stored.push({ key: object.Key, size: object.Size ?? 0 });
  }
  token = page.IsTruncated ? page.NextContinuationToken : undefined;
} while (token);

/* ---- diff ------------------------------------------------------------------ */

const orphans = stored.filter((object) => !referenced.has(object.key));
const bytes = orphans.reduce((total, object) => total + object.size, 0);

console.log(`referenced ${referenced.size}`);
console.log(`stored     ${stored.length}`);
console.log(`orphaned   ${orphans.length} (${(bytes / 1024 / 1024).toFixed(1)} MB)\n`);

for (const object of orphans) {
  console.log(`  ${object.key}  ${(object.size / 1024).toFixed(0)} KB`);
}

if (!orphans.length) {
  console.log("nothing to prune");
} else if (!shouldDelete) {
  console.log(`\n${publicBase}/… — pass --delete to remove these`);
} else {
  // DeleteObjects caps at 1000 keys per call.
  for (let i = 0; i < orphans.length; i += 1000) {
    const batch = orphans.slice(i, i + 1000);
    await s3.send(
      new DeleteObjectsCommand({
        Bucket: spaces.bucket,
        Delete: { Objects: batch.map((object) => ({ Key: object.key })) },
      }),
    );
  }
  console.log(`\ndeleted ${orphans.length} object(s)`);
}
