/**
 * Recompute `readMinutes` / `readLabel` from the body.
 *
 * These were scraped off the Framer pill and never recomputed, so they drifted
 * as posts were rewritten: only 6 of 49 landed within 15% of the truth, and
 * `what-is-a-semantic-layer` promised a 9-minute read on 7,000 words. A reader
 * who clicks expecting nine minutes and finds thirty leaves, which is a direct
 * bounce contributor.
 *
 * Word count comes from `analyze()` so the number agrees with every other
 * measurement in this repo rather than being a second opinion.
 *
 * Frontmatter is spliced line-by-line rather than re-serialized, so a post
 * whose read time was already correct stays byte-identical.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import assert from "node:assert/strict";
import matter from "gray-matter";
import { analyze } from "./analyze.ts";

const ROOT = new URL("..", import.meta.url).pathname;
const POSTS = `${ROOT}posts/`;
const WPM = 225;

/** The one format. Five were in use, including a zero-padded "04 Min Read". */
export const label = (minutes) => `${minutes} Min Read`;
export const minutes = (words) => Math.max(1, Math.round(words / WPM));

/**
 * Replace a top-level scalar in the frontmatter block only. Anchored to the
 * start of a line so a `readMinutes:` appearing inside a body code fence or a
 * nested mapping is left alone.
 */
function spliceField(raw, key, value) {
  const end = raw.indexOf("\n---", 4);
  if (!raw.startsWith("---\n") || end === -1) return null;
  const head = raw.slice(0, end);
  const tail = raw.slice(end);
  const re = new RegExp(`^${key}:.*$`, "m");
  if (!re.test(head)) return null;
  return head.replace(re, `${key}: ${value}`) + tail;
}

function selfCheck() {
  assert.equal(minutes(0), 1, "an empty post still takes a moment");
  assert.equal(minutes(225), 1);
  assert.equal(minutes(7135), 32);
  assert.equal(label(7), "7 Min Read");
  const doc = "---\ntitle: x\nreadMinutes: 6\nreadLabel: 6 mins\n---\n\nreadMinutes: 9 in the body\n";
  const out = spliceField(spliceField(doc, "readMinutes", 32), "readLabel", label(32));
  assert.match(out, /^readMinutes: 32$/m);
  assert.match(out, /^readLabel: 32 Min Read$/m);
  assert.ok(out.includes("readMinutes: 9 in the body"), "body must not be touched");
  console.log("self-check ok");
}

if (process.argv.includes("--check")) {
  selfCheck();
  process.exit(0);
}

const apply = process.argv.includes("--apply");
let changed = 0;
const problems = [];

for (const file of readdirSync(POSTS).filter((f) => f.endsWith(".md")).sort()) {
  const slug = basename(file, ".md");
  const raw = readFileSync(POSTS + file, "utf8");
  const parsed = matter(raw);
  const words = analyze(parsed.content).wordCount;
  const mins = minutes(words);

  if (parsed.data.readMinutes === mins && parsed.data.readLabel === label(mins)) continue;

  changed++;
  const ratio = (mins / parsed.data.readMinutes).toFixed(2);
  console.log(
    `${slug.padEnd(42)} ${String(words).padStart(5)}w  ` +
      `${parsed.data.readMinutes} -> ${mins}  (${ratio}x)  ` +
      `"${parsed.data.readLabel}" -> "${label(mins)}"`,
  );

  if (!apply) continue;
  const next = spliceField(spliceField(raw, "readMinutes", mins) ?? raw, "readLabel", label(mins));
  if (!next) {
    problems.push(`${slug}: could not splice frontmatter — left untouched`);
    continue;
  }
  writeFileSync(POSTS + file, next);
}

console.log(
  apply ? `\nrewrote read time in ${changed} posts` : `\n${changed} posts would change (dry run)`,
);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  problems.forEach((p) => console.log(`  ${p}`));
  process.exit(1);
}
