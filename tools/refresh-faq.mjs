/**
 * Re-derives the `faq:` frontmatter block from each post's own prose.
 *
 *   node tools/refresh-faq.mjs [--dry]
 *
 * `faq` is derived data, and the derivation lives in `faq.mjs`. Whenever that
 * parser learns a new shape, this replays it over the corpus — no network, no
 * re-scrape, no risk of disturbing anything else in the file.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { extractFaq } from "./faq.mjs";

const POSTS_DIR = join(new URL("..", import.meta.url).pathname, "posts");
const dryRun = process.argv.includes("--dry");

/** Mirrors the scraper's YAML style so files stay diff-stable. */
function renderFaq(entries) {
  if (!entries.length) return "faq: []\n";

  return `faq:\n${entries
    .map(
      (entry) =>
        `  - question: ${JSON.stringify(entry.question)}\n` +
        `    answer: ${JSON.stringify(entry.answer)}\n`,
    )
    .join("")}`;
}

const files = (await readdir(POSTS_DIR)).filter((name) => name.endsWith(".md"));

let changed = 0;
let withFaq = 0;
let questions = 0;

for (const name of files) {
  const path = join(POSTS_DIR, name);
  const raw = await readFile(path, "utf8");

  const parsed = raw.match(/^(---\n)([\s\S]*?)(\n---\n)([\s\S]*)$/);
  if (!parsed) {
    console.error(`  ! ${name}: malformed frontmatter`);
    continue;
  }

  const [, open, frontmatter, close, body] = parsed;
  const entries = extractFaq(body);
  if (entries.length) {
    withFaq += 1;
    questions += entries.length;
  }

  // `faq:` runs from its key to the next top-level key — either the empty-list
  // form on one line, or a block of indented entries.
  const next = `${frontmatter}\n`.replace(
    /^faq:(?: \[\]\n|\n(?:(?: {2,}| *- ).*\n)*)/m,
    renderFaq(entries),
  );

  const rebuilt = `${open}${next.replace(/\n$/, "")}${close}${body}`;
  if (rebuilt === raw) continue;

  changed += 1;
  if (!dryRun) await writeFile(path, rebuilt, "utf8");
}

console.log(`${files.length} posts — ${withFaq} with an FAQ, ${questions} questions total`);
console.log(`${dryRun ? "would update" : "updated"} ${changed} file(s)`);
