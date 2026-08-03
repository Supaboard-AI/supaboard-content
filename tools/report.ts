/**
 * Phase 6 — `npm run content:report`. Corpus health at a glance.
 *
 * Read-only and never fails the build; the gate is tools/ci.ts. This is the
 * thing you look at before deciding what to write next.
 */
import { readdirSync, readFileSync } from "node:fs";
import { basename } from "node:path";
import matter from "gray-matter";
import { analyze } from "./analyze.ts";

const ROOT = new URL("..", import.meta.url).pathname;
const POSTS = `${ROOT}posts/`;
const MONTHS_STALE = 12;

const docs = readdirSync(POSTS)
  .filter((f) => f.endsWith(".md"))
  .sort()
  .map((f) => {
    const parsed = matter(readFileSync(POSTS + f, "utf8"));
    return {
      slug: basename(f, ".md"),
      fm: parsed.data as Record<string, any>,
      analysis: analyze(parsed.content, parsed.data.citations ?? []),
    };
  });

const pad = (s: string | number, n: number) => String(s).padEnd(n);
const rpad = (s: string | number, n: number) => String(s).padStart(n);

console.log(`\nCORPUS HEALTH — ${docs.length} posts\n${"=".repeat(60)}`);

// --- by category ---
const byCategory = new Map<string, number>();
for (const d of docs) byCategory.set(d.fm.category ?? "(unset)", (byCategory.get(d.fm.category ?? "(unset)") ?? 0) + 1);
console.log("\nposts by category");
for (const [c, n] of [...byCategory].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${pad(c, 14)} ${rpad(n, 3)}`);
}

// --- pillar coverage ---
const byPillar = new Map<string, string[]>();
for (const d of docs) {
  const p = d.fm.pillar ?? "(none)";
  if (!byPillar.has(p)) byPillar.set(p, []);
  byPillar.get(p)!.push(d.slug);
}
console.log("\npillar coverage");
for (const [p, slugs] of [...byPillar].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${pad(p, 20)} ${rpad(slugs.length, 3)}`);
}

// --- orphans: nothing links to them ---
const inbound = new Map<string, number>(docs.map((d) => [d.slug, 0]));
for (const d of docs) {
  for (const t of d.fm.internalLinks ?? []) {
    if (inbound.has(t)) inbound.set(t, inbound.get(t)! + 1);
  }
}
const orphans = [...inbound].filter(([, n]) => n === 0).map(([s]) => s);
console.log(`\norphan pages (no inbound internal link): ${orphans.length}`);
orphans.forEach((s) => console.log(`  ${s}`));

// --- statistics ---
const stats = docs.map((d) => d.fm.statsCount ?? 0);
const avg = stats.reduce((a, b) => a + b, 0) / (docs.length || 1);
const unsourced = docs.flatMap((d) =>
  d.analysis.numericClaims.filter((c) => !c.sourced).map(() => d.slug),
);
console.log(`\naverage statistics per post: ${avg.toFixed(1)}`);
console.log(`unsourced numeric claims in bodies: ${unsourced.length}`);

// --- staleness ---
const cutoff = new Date();
cutoff.setMonth(cutoff.getMonth() - MONTHS_STALE);
const stale = docs
  .filter((d) => d.fm.updatedAt && new Date(d.fm.updatedAt) < cutoff)
  .sort((a, b) => String(a.fm.updatedAt).localeCompare(String(b.fm.updatedAt)));
console.log(`\nupdatedAt older than ${MONTHS_STALE} months: ${stale.length}`);
stale.forEach((d) => console.log(`  ${d.fm.updatedAt}  ${d.slug}`));

// --- editorial spec, at a glance ---
console.log(`\neditorial spec (thresholds: 4 stats / 1 quote / 3 cites / 3 links / ~12 sections / grade 9-10)`);
console.log(
  `  ${pad("slug", 42)} ${rpad("stat", 4)} ${rpad("quo", 4)} ${rpad("cite", 5)} ${rpad("link", 5)} ${rpad("sect", 5)} ${rpad("grade", 6)} tbl`,
);
for (const d of docs) {
  const a = d.analysis;
  console.log(
    `  ${pad(d.slug.slice(0, 40), 42)} ${rpad(d.fm.statsCount ?? 0, 4)} ${rpad(a.attributedQuotes.length, 4)} ${rpad(
      (d.fm.citations ?? []).length,
      5,
    )} ${rpad((d.fm.internalLinks ?? []).length, 5)} ${rpad(a.h2.length, 5)} ${rpad(a.readingGrade, 6)} ${a.hasTable ? "y" : "-"}`,
  );
}
console.log("");
