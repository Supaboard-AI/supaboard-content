/**
 * Close the gaps in each post's heading hierarchy.
 *
 * `AUTHORING-PROMPT.md` §5: `##` is the top level, never skip a level, never use
 * `#####`. Seventeen posts broke it — mostly a `##` followed directly by a
 * `#####`, which the Framer export produced whenever a designer wanted smaller
 * text. A skipped level is not cosmetic: assistive technology reads the heading
 * tree as the document outline, and a jump from h2 to h5 reads as three missing
 * sections.
 *
 * Each heading is pulled up to at most one level below the heading before it.
 * Nothing is pushed down and nothing rises above `##`, so a heading can only
 * ever move closer to its parent — the anchor id comes from the heading text,
 * not its level, so no deep link changes.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import assert from "node:assert/strict";
import matter from "gray-matter";

const ROOT = new URL("..", import.meta.url).pathname;
const POSTS = `${ROOT}posts/`;

/** Headings inside a fenced code block are code, not structure. */
const outsideFences = (body) => {
  const lines = body.split("\n");
  let fenced = false;
  return lines.map((line) => {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
    return fenced;
  });
};

export function repair(body) {
  const fenced = outsideFences(body);
  const lines = body.split("\n");
  /** Open ancestors as `{ from, to }` — the level written, and the level emitted. */
  const stack = [];
  let fixed = 0;

  const out = lines.map((line, i) => {
    const m = fenced[i] ? null : line.match(/^(#{1,6}) (.*)$/);
    if (!m) return line;
    const from = m[1].length;

    // Anything at or below this level is a sibling or an aunt, not a parent.
    while (stack.length && stack[stack.length - 1].from >= from) stack.pop();
    const to = Math.min(6, stack.length ? stack[stack.length - 1].to + 1 : 2);
    stack.push({ from, to });

    if (to === from) return line;
    fixed++;
    return `${"#".repeat(to)} ${m[2]}`;
  });

  return { body: out.join("\n"), fixed };
}

function selfCheck() {
  assert.equal(repair("## A\n\n##### B\n").body, "## A\n\n### B\n");
  assert.equal(repair("## A\n\n### B\n\n#### C\n").fixed, 0, "a legal tree is left alone");
  assert.equal(repair("# A\n").body, "## A\n", "nothing rises above ##");
  assert.equal(repair("## A\n\n```\n##### not a heading\n```\n").fixed, 0, "fences are code");
  // Siblings stay siblings: two h5s under one h2 both become h3, not h3 then h4.
  assert.equal(repair("## A\n\n##### B\n\n##### C\n").body, "## A\n\n### B\n\n### C\n");
  console.log("self-check ok");
}

if (process.argv.includes("--check")) {
  selfCheck();
  process.exit(0);
}

const apply = process.argv.includes("--apply");
let changed = 0;

for (const file of readdirSync(POSTS).filter((f) => f.endsWith(".md")).sort()) {
  const parsed = matter(readFileSync(POSTS + file, "utf8"));
  const { body, fixed } = repair(parsed.content);
  if (!fixed) continue;
  changed++;
  console.log(`${basename(file, ".md").padEnd(42)} ${fixed} heading(s)`);
  if (apply) writeFileSync(POSTS + file, matter.stringify(body, parsed.data));
}

console.log(apply ? `\nrepaired ${changed} posts` : `\n${changed} posts would change (dry run)`);
