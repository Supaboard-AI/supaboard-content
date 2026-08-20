/**
 * Rebuild the `sections` frontmatter from the body.
 *
 * `sections` is derived data — it builds the on-page table of contents — but it
 * was being hand-maintained, so inserting a section left the TOC in the wrong
 * order. Deriving it from the document removes the chance of disagreement
 * between what the page contains and what its contents list claims.
 *
 * A section is a `<!-- section:ID -->` marker plus the first heading beneath it,
 * which is the convention the Framer export established and the renderer relies
 * on for anchors.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import matter from "gray-matter";

const ROOT = new URL("..", import.meta.url).pathname;
const POSTS = `${ROOT}posts/`;
const apply = process.argv.includes("--apply");

let changed = 0;
const problems = [];

for (const file of readdirSync(POSTS).filter((f) => f.endsWith(".md")).sort()) {
  const slug = basename(file, ".md");
  const parsed = matter(readFileSync(POSTS + file, "utf8"));
  const body = parsed.content;

  // Split on the markers, then take the first heading inside each block. A
  // marker may be followed by intro prose before its heading, and some intro
  // sections have no heading at all — those are content, not TOC entries.
  const parts = body.split(/<!--\s*section:([\w-]+)\s*-->/);
  const sections = [];
  for (let i = 1; i < parts.length; i += 2) {
    const id = parts[i];
    const block = parts[i + 1] ?? "";
    const heading = block.match(/^#{2,3} +(.+?)\s*$/m)?.[1];
    if (!heading) {
      problems.push(`${slug}: section ${id} has no heading — omitted from the TOC`);
      continue;
    }
    // Strip the inline markdown that only makes sense in the body: bold
    // wrappers, and the backslashes that stop `1.` becoming an ordered list.
    const label = heading.replace(/\*\*/g, "").replace(/\\(?=[^\w\s])/g, "").trim();
    sections.push({ id, heading: label });
  }

  if (!sections.length) {
    problems.push(`${slug}: no section markers found`);
    continue;
  }

  const before = JSON.stringify(parsed.data.sections ?? []);
  const after = JSON.stringify(sections);
  if (before === after) continue;

  changed++;
  if (apply) {
    parsed.data.sections = sections;
    writeFileSync(POSTS + file, matter.stringify(body, parsed.data));
  } else {
    console.log(`${slug}: ${JSON.parse(before).length} -> ${sections.length} entries`);
  }
}

console.log(apply ? `rewrote sections in ${changed} posts` : `${changed} posts would change (dry run)`);
if (problems.length) {
  console.log(`\n${problems.length} marker problem(s):`);
  problems.forEach((p) => console.log(`  ${p}`));
}
