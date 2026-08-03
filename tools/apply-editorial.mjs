/**
 * Apply the authored editorial metadata, and measure what cannot be authored.
 *
 * `statsCount` is deliberately measured from the body rather than taken from
 * the config. A declared statistic count is exactly the kind of number this
 * exercise exists to stop us inventing, so it reflects the sourced numeric
 * claims actually present — even when that is below the threshold and fails
 * the build. The gap is the report, not something to paper over.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import matter from "gray-matter";
import { EDITORIAL } from "../migration/editorial.config.mjs";
import { analyze } from "./analyze.ts";

const ROOT = new URL("..", import.meta.url).pathname;
const POSTS = `${ROOT}posts/`;
const apply = process.argv.includes("--apply");

const slugs = readdirSync(POSTS).filter((f) => f.endsWith(".md")).map((f) => basename(f, ".md"));
const missing = slugs.filter((s) => !EDITORIAL[s]);
const extra = Object.keys(EDITORIAL).filter((s) => !slugs.includes(s));
if (missing.length || extra.length) {
  if (missing.length) console.error(`no editorial entry for: ${missing.join(", ")}`);
  if (extra.length) console.error(`editorial entry for missing post: ${extra.join(", ")}`);
  process.exit(1);
}

// targetQuery uniqueness, checked before anything is written.
const byQuery = new Map();
for (const [slug, e] of Object.entries(EDITORIAL)) {
  const k = e.targetQuery.toLowerCase().trim();
  if (!byQuery.has(k)) byQuery.set(k, []);
  byQuery.get(k).push(slug);
}
const dupes = [...byQuery].filter(([, s]) => s.length > 1);
if (dupes.length) {
  console.error("duplicate targetQuery:");
  dupes.forEach(([q, s]) => console.error(`  "${q}": ${s.join(", ")}`));
  process.exit(1);
}

/**
 * Internal links must resolve and number at least three. Fill from the post's
 * own cluster and pillar first, since those are the links that should exist
 * anyway, then from anything else that survives.
 */
function fillInternalLinks(slug, current) {
  const have = new Set((current ?? []).filter((s) => slugs.includes(s) && s !== slug));
  const e = EDITORIAL[slug];
  const rank = (other) => {
    const o = EDITORIAL[other];
    return (o.cluster === e.cluster ? 2 : 0) + (o.pillar === e.pillar ? 1 : 0);
  };
  const candidates = slugs
    .filter((s) => s !== slug && !have.has(s))
    .sort((a, b) => rank(b) - rank(a) || a.localeCompare(b));
  for (const c of candidates) {
    if (have.size >= 3) break;
    if (rank(c) === 0) continue; // never link at random just to hit a number
    have.add(c);
  }
  return [...have].sort();
}

const report = [];

for (const slug of slugs.sort()) {
  const file = `${POSTS}${slug}.md`;
  const parsed = matter(readFileSync(file, "utf8"));
  const e = EDITORIAL[slug];
  const a = analyze(parsed.content, parsed.data.citations ?? []);

  const fm = { ...parsed.data };
  fm.category = e.category;
  fm.pillar = e.pillar;
  fm.cluster = e.cluster;
  fm.targetQuery = e.targetQuery;
  fm.intent = e.intent;
  fm.audience = e.audience;
  fm.funnel = e.funnel;
  fm.tldr = e.tldr;
  if (e.caseStudies) fm.caseStudies = e.caseStudies;
  fm.internalLinks = fillInternalLinks(slug, fm.internalLinks);
  fm.statsCount = a.numericClaims.filter((c) => c.sourced).length;
  delete fm.legacyCategory;

  report.push({
    slug,
    statsCount: fm.statsCount,
    quotes: a.attributedQuotes.length,
    citations: (fm.citations ?? []).length,
    internalLinks: fm.internalLinks.length,
    sections: a.h2.length,
    grade: a.readingGrade,
    hasTable: a.hasTable,
    faq: (fm.faq ?? []).length,
    titleLen: (fm.title ?? "").length,
    descLen: (fm.description ?? "").length,
  });

  if (apply) writeFileSync(file, matter.stringify(parsed.content, fm));
}

writeFileSync(`${ROOT}migration/spec-compliance.json`, JSON.stringify(report, null, 2) + "\n");

const below = (f, n) => report.filter((r) => r[f] < n).length;
console.log(apply ? `applied editorial metadata to ${slugs.length} posts` : "(dry run)");
console.log(`targetQuery: ${byQuery.size} unique across ${slugs.length} posts — no collisions\n`);
console.log("editorial spec, corpus-wide:");
console.log(`  statsCount   < 4 : ${below("statsCount", 4)} / ${report.length}`);
console.log(`  quotations   < 1 : ${below("quotes", 1)} / ${report.length}`);
console.log(`  citations    < 3 : ${below("citations", 3)} / ${report.length}`);
console.log(`  internalLinks< 3 : ${below("internalLinks", 3)} / ${report.length}`);
console.log(`  sections     <12 : ${below("sections", 12)} / ${report.length}`);
console.log(`  faq          < 6 : ${below("faq", 6)} / ${report.length}`);
console.log(`  title       > 65 : ${report.filter((r) => r.titleLen > 65).length} / ${report.length}`);
console.log(`  desc  outside 140-160 : ${report.filter((r) => r.descLen < 140 || r.descLen > 160).length} / ${report.length}`);
console.log(`  grade outside 9-10.9  : ${report.filter((r) => r.grade < 9 || r.grade >= 11).length} / ${report.length}`);
console.log(`\nwrote migration/spec-compliance.json`);
