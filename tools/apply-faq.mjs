/**
 * Apply authored FAQ blocks, refusing to write anything out of spec.
 *
 * Checks before touching a file, so a badly-sized answer is a script failure
 * rather than a schema failure discovered later.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { basename } from "node:path";
import matter from "gray-matter";
import { FAQ } from "../migration/faq.config.mjs";

const ROOT = new URL("..", import.meta.url).pathname;
const POSTS = `${ROOT}posts/`;
const apply = process.argv.includes("--apply");

const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;
const slugs = new Set(readdirSync(POSTS).filter((f) => f.endsWith(".md")).map((f) => basename(f, ".md")));

const problems = [];
for (const [slug, items] of Object.entries(FAQ)) {
  if (!slugs.has(slug)) problems.push(`${slug}: no such post`);
  if (items.length < 6 || items.length > 10) problems.push(`${slug}: ${items.length} questions, need 6-10`);
  items.forEach((item, i) => {
    const w = words(item.a);
    if (w < 40 || w > 80) problems.push(`${slug}[${i}] "${item.q.slice(0, 44)}": ${w} words`);
    if (item.q.length < 10) problems.push(`${slug}[${i}]: question too short`);
  });
}

if (problems.length) {
  console.error(`${problems.length} problem(s):`);
  problems.forEach((p) => console.error(`  ${p}`));
  process.exit(1);
}

let n = 0;
for (const [slug, items] of Object.entries(FAQ)) {
  const file = `${POSTS}${slug}.md`;
  const parsed = matter(readFileSync(file, "utf8"));
  parsed.data.faq = items;
  if (apply) writeFileSync(file, matter.stringify(parsed.content, parsed.data));
  n++;
}

console.log(apply ? `applied FAQ to ${n} posts` : `${n} posts ready (dry run)`);
console.log(`all answers within 40-80 words, all blocks 6-10 questions`);
