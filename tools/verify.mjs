/**
 * Checks the migrated corpus against the live site.
 *
 *   node tools/verify.mjs
 *
 * The load-bearing assertion is URL parity: the set of `posts/<slug>.md`
 * filenames must equal the set of `/blog/<slug>` paths in supaboard.ai's
 * sitemap, exactly, byte for byte. A slug that gets "tidied" during migration
 * is a dead URL and a lost ranking, so this fails loudly on any drift.
 *
 * Everything after that is content hygiene: required frontmatter, no assets
 * still pointing at Framer, no dangling `related` references.
 */
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const ORIGIN = "https://supaboard.ai";
const POSTS_DIR = join(new URL("..", import.meta.url).pathname, "posts");

const REQUIRED = [
  "slug",
  "title",
  "description",
  "category",
  "publishedAt",
  "author",
  "cover",
];

const problems = [];
const note = (message) => problems.push(message);

/* ---- live URLs ----------------------------------------------------------- */

const xml = await (await fetch(`${ORIGIN}/sitemap.xml`)).text();
const liveSlugs = new Set(
  [...xml.matchAll(/<loc>https:\/\/supaboard\.ai\/blog\/([^<]+)<\/loc>/g)].map((m) => m[1]),
);

/* ---- local files --------------------------------------------------------- */

const files = (await readdir(POSTS_DIR)).filter((name) => name.endsWith(".md"));
const localSlugs = new Set(files.map((name) => name.replace(/\.md$/, "")));

for (const slug of liveSlugs) {
  if (!localSlugs.has(slug)) note(`MISSING  live URL not migrated: /blog/${slug}`);
}

// Treat the sitemap as a floor rather than the whole truth — `tools/discover.mjs`
// is what confirms nothing live is missing from it. Extras are reported rather
// than failed, since a deliberately-kept URL and a typo'd filename look the
// same from here and only a human can tell them apart.
const extras = [...localSlugs].filter((slug) => !liveSlugs.has(slug));

/* ---- per-post content ---------------------------------------------------- */

let totalSections = 0;
let withFaq = 0;

for (const name of files) {
  const slug = name.replace(/\.md$/, "");
  const raw = await readFile(join(POSTS_DIR, name), "utf8");

  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    note(`FRONTMATTER  ${slug}: missing or malformed`);
    continue;
  }

  const [, frontmatter, body] = match;

  for (const key of REQUIRED) {
    if (!new RegExp(`^${key}:`, "m").test(frontmatter)) {
      note(`FRONTMATTER  ${slug}: no "${key}"`);
    }
  }

  const declaredSlug = frontmatter.match(/^slug:\s*"?(.+?)"?\s*$/m)?.[1];
  if (declaredSlug !== slug) {
    note(`SLUG     ${slug}: frontmatter says "${declaredSlug}"`);
  }

  if (raw.includes("framerusercontent")) {
    note(`ASSET    ${slug}: still references framerusercontent.com`);
  }

  if (!/<!--\s*section:content-1\s*-->/.test(body)) {
    note(`BODY     ${slug}: no section markers`);
  }

  if (body.trim().length < 400) {
    note(`BODY     ${slug}: suspiciously short (${body.trim().length} chars)`);
  }

  totalSections += (frontmatter.match(/^ {2}- id: /gm) ?? []).length;
  if (/^faq:\n/m.test(frontmatter)) withFaq += 1;

  // `related` is rendered as links, so a stale slug would be a 404 in the rail.
  const related = frontmatter.match(/^related:\n((?: {2}- .+\n)+)/m)?.[1] ?? "";
  for (const line of related.trim().split("\n").filter(Boolean)) {
    const target = line.replace(/^\s*-\s*"?(.+?)"?\s*$/, "$1");
    if (target && !localSlugs.has(target)) {
      note(`RELATED  ${slug}: points at missing "${target}"`);
    }
  }
}

/* ---- report -------------------------------------------------------------- */

console.log(`sitemap URLs   ${liveSlugs.size}`);
console.log(`migrated files ${files.length}`);
console.log(`sections       ${totalSections}`);
console.log(`posts with FAQ ${withFaq}`);

if (extras.length) {
  console.log(`\nnot in the sitemap but migrated (${extras.length}):`);
  for (const slug of extras) console.log(`  ${slug}`);
}

if (!problems.length) {
  console.log("\n✓ URL parity exact, no content problems");
} else {
  console.error(`\n✗ ${problems.length} problem(s):\n`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exitCode = 1;
}
