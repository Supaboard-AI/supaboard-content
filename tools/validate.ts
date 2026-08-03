/**
 * Validate every post against the content model.
 *
 * Exit 1 on any issue — this is the build gate. `--report` writes a
 * machine-readable breakdown for the Phase 3 backfill instead of failing.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import matter from "gray-matter";
import { validateCorpus, type CorpusIssue } from "../schema/frontmatter.ts";

const POSTS = new URL("../posts/", import.meta.url).pathname;
const reportMode = process.argv.includes("--report");

const docs = readdirSync(POSTS)
  .filter((f) => f.endsWith(".md"))
  .sort()
  .map((f) => ({
    slug: basename(f, ".md"),
    data: matter(readFileSync(POSTS + f, "utf8")).data,
  }));

const { issues, valid } = validateCorpus(docs);

const bySlug = new Map<string, CorpusIssue[]>();
for (const i of issues) {
  if (!bySlug.has(i.slug)) bySlug.set(i.slug, []);
  bySlug.get(i.slug)!.push(i);
}

const byField = new Map<string, number>();
for (const i of issues) {
  const field = i.path.split(".")[0];
  byField.set(field, (byField.get(field) ?? 0) + 1);
}

console.log(`posts:   ${docs.length}`);
console.log(`passing: ${docs.length - bySlug.size}`);
console.log(`failing: ${bySlug.size}`);
console.log(`issues:  ${issues.length}\n`);

console.log("issues by field:");
for (const [field, n] of [...byField].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}  ${field}`);
}

if (reportMode) {
  const out = new URL("../migration/schema-gaps.json", import.meta.url).pathname;
  writeFileSync(
    out,
    JSON.stringify(
      {
        postCount: docs.length,
        passing: docs.length - bySlug.size,
        failing: bySlug.size,
        byField: Object.fromEntries([...byField].sort((a, b) => b[1] - a[1])),
        posts: Object.fromEntries(
          [...bySlug].map(([slug, list]) => [slug, list.map((i) => `${i.path}: ${i.message}`)]),
        ),
      },
      null,
      2,
    ) + "\n",
  );
  console.log(`\nwrote migration/schema-gaps.json`);
  process.exit(0);
}

if (issues.length) {
  console.log("\nfailures:");
  for (const [slug, list] of bySlug) {
    console.log(`\n  ${slug}`);
    for (const i of list) console.log(`    ${i.path}: ${i.message}`);
  }
  process.exit(1);
}
console.log(`\nall ${valid.length} posts valid`);
