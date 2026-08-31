/**
 * Render each post's visible FAQ from its frontmatter `faq:` block.
 *
 * Two problems, one cause. The visible FAQ and the frontmatter disagreed in 28
 * of 49 posts — different questions, different counts, sometimes a different
 * topic — and the frontmatter is what becomes FAQPage JSON-LD, so those pages
 * were advertising structured data that is not on the page. And the questions
 * themselves were marked up five different ways (H3, H4, H5, plain bold, and
 * mixed levels inside a single post) under twelve spellings of the heading,
 * three of them typos.
 *
 * The frontmatter wins because it is the side with a schema: 6-10 questions,
 * every answer 40-80 words (`schema/frontmatter.ts`). The body is rendered from
 * it, so the two cannot drift again.
 *
 * It also enforces the other half of the rule: nothing may follow the FAQ.
 * Twelve posts had a section bolted on behind it — mostly single snippet-bait
 * questions that belong in the FAQ, not after it — which is what broke snippet
 * extraction the first time. Those sections are moved above the FAQ, marker and
 * all, so their anchors keep resolving.
 *
 * And the mirror of that: nine posts put their conclusion *above* the FAQ, so
 * the page ended on the Q&A with the verdict buried. The rulebook wants the FAQ
 * second to last, which is also where extraction wants it, so those conclusions
 * are lowered below it.
 *
 * Span detection is `faqSection()` from `faq.mjs` — the same parser the site
 * uses to read these blocks, so this writes what that reads.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import assert from "node:assert/strict";
import matter from "gray-matter";

const ROOT = new URL("..", import.meta.url).pathname;
const POSTS = `${ROOT}posts/`;

/** The one heading, and the one level for a question. */
const HEADING = "## Frequently Asked Questions";
const FAQ_HEADING = /^(#{2,4})\s*(?:FAQs?\b|Frequently Asked Questions?)/im;
const SECTION_MARKER = /^<!--\s*section:[\w-]+\s*-->$/gm;

/** A heading that legitimately closes a post, so may follow the FAQ. */
const CONCLUSION =
  /^(Conclusion|Final (Thoughts|Verdict|Word|Perspective|Takeaway)|The Bottom Line|Bottom Line|Wrapping Up|Closing Thoughts|The Road Ahead)\b/i;
// Deliberately not "Key Takeaways": in retail-business-intelligence that is the
// opening section, and treating it as a conclusion would move the summary to the
// bottom of the page.

/**
 * A conclusion sitting above the FAQ, moved below it. The block runs from its
 * `<!-- section:ID -->` marker to the next marker, so the anchor travels too.
 */
export function lowerConclusionBelowFaq(body, span) {
  const before = body.slice(0, span.start);
  const markers = [...before.matchAll(SECTION_MARKER)].map((m) => m.index);
  if (markers.length < 2) return null;

  // The FAQ owns the last marker before its heading; the conclusion, if it is
  // misplaced, owns one of the others.
  const faqMarker = markers[markers.length - 1];
  for (let i = 0; i < markers.length - 1; i++) {
    const blockEnd = markers[i + 1];
    const block = body.slice(markers[i], blockEnd);
    const heading = block.match(/^#{2,3} (.+)$/m)?.[1]?.trim();
    if (!heading || !CONCLUSION.test(heading)) continue;

    const rest = body.slice(0, markers[i]) + body.slice(blockEnd, span.end);
    return {
      heading,
      body: rest.replace(/\n*$/, "\n\n") + block.replace(/\n*$/, "\n") + body.slice(span.end),
    };
  }
  return null;
}

/**
 * Sections sitting after the FAQ, moved to just before it. Each block keeps its
 * `<!-- section:ID -->` marker, so the anchor travels with its content and
 * inbound deep links still resolve.
 */
export function liftSectionsAboveFaq(body, span) {
  const before = body.slice(0, span.start);
  const markers = [...before.matchAll(SECTION_MARKER)];
  if (!markers.length) return null;
  const insertAt = markers[markers.length - 1].index;

  const tail = body.slice(span.end);
  const starts = [...tail.matchAll(SECTION_MARKER)].map((m) => m.index);
  if (!starts.length) return null;

  const move = [];
  const keep = [];
  for (let i = 0; i < starts.length; i++) {
    const block = tail.slice(starts[i], starts[i + 1] ?? tail.length);
    const heading = block.match(/^#{2,5} (.+)$/m)?.[1]?.trim() ?? "";
    (CONCLUSION.test(heading) ? keep : move).push({ block, heading });
  }
  if (!move.length) return null;

  return {
    headings: move.map((m) => m.heading),
    body:
      body.slice(0, insertAt) +
      move.map((m) => m.block.replace(/\n*$/, "\n\n")).join("") +
      body.slice(insertAt, span.end) +
      tail.slice(0, starts[0]) +
      keep.map((k) => k.block).join(""),
  };
}

/**
 * The FAQ block's exact character span: its heading through to the next heading
 * at the same or a higher level. Mirrors `faqSection()` in faq.mjs, but returns
 * offsets rather than lines so the surrounding body can be preserved byte for
 * byte.
 */
export function faqSpan(body) {
  const match = body.match(FAQ_HEADING);
  if (!match) return null;

  const level = match[1].length;
  const start = match.index;
  const rest = body.slice(start);
  const lines = rest.split("\n");

  let offset = lines[0].length + 1;
  for (const line of lines.slice(1)) {
    const heading = line.match(/^(#{1,6})\s/);
    // A `<!-- section:ID -->` marker ends the block as surely as a heading does:
    // it is the anchor the next section deep-links to, and the Framer ids it
    // carries are not regenerable (README.md:24-26). Swallowing one silently
    // breaks every inbound link to that anchor.
    if (/^<!--\s*section:/.test(line)) return { start, end: start + offset };
    if (heading && heading[1].length <= level) return { start, end: start + offset };
    offset += line.length + 1;
  }
  return { start, end: body.length };
}

export const render = (faq) =>
  `${HEADING}\n\n` + faq.map(({ q, a }) => `### ${q}\n\n${a}\n`).join("\n");

function selfCheck() {
  const body = [
    "## Intro", "", "text", "",
    "### FAQs About Things", "", "#### Old question?", "", "Old answer.", "",
    "## Conclusion", "", "the end", "",
  ].join("\n");
  const span = faqSpan(body);
  assert.ok(span, "must find an H3 FAQ heading");
  assert.equal(body.slice(span.start, span.end).includes("Old answer."), true);
  assert.equal(body.slice(span.end).startsWith("## Conclusion"), true, "must stop at the conclusion");

  const out = body.slice(0, span.start) + render([{ q: "New?", a: "New answer." }]) + body.slice(span.end);
  assert.match(out, /^## Frequently Asked Questions$/m);
  assert.match(out, /^### New\?$/m);
  assert.ok(!out.includes("Old question?"), "old block must be gone");
  assert.ok(out.includes("## Conclusion"), "the conclusion must survive");
  assert.ok(out.includes("## Intro"), "content above must survive");
  assert.equal(faqSpan("## Nothing here\n\ntext\n"), null);

  // A section marker between the last answer and the next heading must survive.
  const marked = "## FAQ\n\n#### Q?\n\nA.\n\n<!-- section:content-7 -->\n\n## Conclusion\n";
  const ms = faqSpan(marked);
  const rebuilt = marked.slice(0, ms.start) + render([{ q: "New?", a: "New." }]) + marked.slice(ms.end);
  assert.ok(rebuilt.includes("<!-- section:content-7 -->"), "the section marker must survive");
  assert.ok(!rebuilt.includes("#### Q?"), "the old question must not");
  console.log("self-check ok");
}

if (process.argv.includes("--check")) {
  selfCheck();
  process.exit(0);
}

// Importable: the sweep only runs when this file is the entry point.
if (import.meta.filename !== process.argv[1]) {
  // eslint-disable-next-line no-undef
} else await main();

async function main() {
const apply = process.argv.includes("--apply");
let changed = 0;
const problems = [];

for (const file of readdirSync(POSTS).filter((f) => f.endsWith(".md")).sort()) {
  const slug = basename(file, ".md");
  const raw = readFileSync(POSTS + file, "utf8");
  const parsed = matter(raw);
  const faq = parsed.data.faq;

  if (!Array.isArray(faq) || !faq.length) {
    problems.push(`${slug}: no frontmatter faq — skipped`);
    continue;
  }
  const span = faqSpan(parsed.content);
  if (!span) {
    problems.push(`${slug}: no FAQ section found in the body — skipped`);
    continue;
  }

  const before = parsed.content.slice(span.start, span.end);
  const after = render(faq);
  // Keep whatever blank-line padding the original had after the block.
  const trailing = before.match(/\n*$/)[0];
  let next =
    parsed.content.slice(0, span.start) + after.replace(/\n+$/, "") + trailing + parsed.content.slice(span.end);

  // Re-find the span in the rewritten body before lifting: the rendered block is
  // a different length from the one it replaced.
  const lifted = liftSectionsAboveFaq(next, faqSpan(next));
  if (lifted) next = lifted.body;

  const lowered = lowerConclusionBelowFaq(next, faqSpan(next));
  if (lowered) next = lowered.body;

  if (next === parsed.content) continue;

  changed++;
  const heading = before.split("\n")[0];
  const note =
    (lifted ? `  lifted above the FAQ: ${lifted.headings.map((h) => JSON.stringify(h)).join(", ")}` : "") +
    (lowered ? `  lowered below the FAQ: ${JSON.stringify(lowered.heading)}` : "");
  console.log(`${slug.padEnd(42)} ${JSON.stringify(heading)} -> ${faq.length} questions${note}`);

  if (apply) writeFileSync(POSTS + file, matter.stringify(next, parsed.data));
}

console.log(apply ? `\nrewrote the FAQ in ${changed} posts` : `\n${changed} posts would change (dry run)`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  problems.forEach((p) => console.log(`  ${p}`));
}
}
