/**
 * Phase 6 — the build gate.
 *
 * Every check here corresponds to a way the corpus decayed the first time.
 * Exit 1 on any violation; there are no warnings, because a warning is how
 * 131 URLs for 15 topics happens.
 *
 *   --skip-network   omit the sitemap 200 assertion (for offline runs)
 */
import { readdirSync, readFileSync } from "node:fs";
import { basename } from "node:path";
import matter from "gray-matter";
import { validateCorpus, type Frontmatter } from "../schema/frontmatter.ts";
import { analyze } from "./analyze.ts";

const ROOT = new URL("..", import.meta.url).pathname;
const POSTS = `${ROOT}posts/`;
const skipNetwork = process.argv.includes("--skip-network");

interface Failure { slug: string; check: string; detail: string }
const failures: Failure[] = [];
const fail = (slug: string, check: string, detail: string) =>
  failures.push({ slug, check, detail });

const files = readdirSync(POSTS).filter((f) => f.endsWith(".md")).sort();
const docs = files.map((f) => {
  const parsed = matter(readFileSync(POSTS + f, "utf8"));
  return { slug: basename(f, ".md"), data: parsed.data, body: parsed.content };
});

// --- 1-3, 6-7: schema, targetQuery uniqueness, slug rules, caseStudies,
//               internal links resolving. All expressed in the schema.
const { issues, valid } = validateCorpus(docs.map(({ slug, data }) => ({ slug, data })));
for (const i of issues) fail(i.slug, "schema", `${i.path}: ${i.message}`);

const validBySlug = new Map(valid.map((v) => [v.slug, v.data as Frontmatter]));

/**
 * --- 9: phrases that were each a real production defect.
 *
 * Deliberately outside the loop below, which skips any doc that already failed
 * the schema — a post with a bad statsCount can still be claiming a feature we
 * do not have, and that is the more expensive error.
 */
const BANNED: [RegExp, string][] = [
  [/dashboards[ -]as[ -]code/i, "Supaboard has no such feature"],
  [/600\+\s*data sources/i, "the connector count is 700+"],
  [/\bStarter, Pro\b/, "the plans are Individual, Business and Enterprise"],
  [/Not verified —/, "editorial placeholder left in the body"],
];

/**
 * --- 10: an internal body link that 301s or 410s.
 *
 * `relink.mjs` only rewrites /blog/ links, so nineteen /compare/* links
 * survived the August 2026 consolidation pointing at retired head-to-heads.
 * Hard ban #9 says a link that redirects is a defect; this is what enforces it.
 */
const { redirects, gone } = JSON.parse(
  readFileSync(`${ROOT}migration/redirects.json`, "utf8"),
) as { redirects: { source: string }[]; gone: { source: string }[] };
const DEAD = new Map<string, string>([
  ...redirects.map((r) => [r.source, "301"] as [string, string]),
  ...gone.map((g) => [g.source, "410"] as [string, string]),
]);

/**
 * --- 11: a case study declared in frontmatter but never linked in the body.
 *
 * The schema requires commercial posts to name one; nothing checked that the
 * reader could ever click it, so thirteen posts shipped the metadata alone.
 */
for (const doc of docs) {
  for (const [re, why] of BANNED) {
    const hit = doc.body.match(re);
    if (hit) fail(doc.slug, "banned-phrase", `"${hit[0]}" — ${why}`);
  }

  for (const [, path] of doc.body.matchAll(/\]\((\/[^)\s#]+)/g)) {
    const status = DEAD.get(path);
    if (status) fail(doc.slug, "link-not-200", `${path} ${status}s`);
  }

  // --- 12: an image with no alt text, or a URL used as one. Both shipped.
  // markdown.tsx renders `alt={alt ?? ""}`, so a missing alt is silently
  // decorative on the page — there is nothing downstream to notice it.
  for (const [whole, alt] of doc.body.matchAll(/!\[([^\]]*)\]\(/g)) {
    if (!alt.trim()) fail(doc.slug, "image-alt", `empty alt: ${whole}(…`);
    else if (/^https?:\/\//i.test(alt.trim())) fail(doc.slug, "image-alt", `URL as alt: ${alt}`);
  }

  for (const path of (doc.data as { caseStudies?: string[] }).caseStudies ?? []) {
    if (!doc.body.includes(path)) {
      fail(doc.slug, "case-study-not-linked", `${path} declared but never linked in the body`);
    }
  }
}

// --- 4-5: body-level editorial floors.
for (const doc of docs) {
  const fm = validBySlug.get(doc.slug);
  if (!fm) continue; // already failed the schema; don't pile on
  const a = analyze(doc.body, fm.citations);

  for (const claim of a.numericClaims) {
    if (!claim.sourced) {
      fail(doc.slug, "unsourced-statistic", claim.text);
    }
  }
  if (fm.statsCount < 4) fail(doc.slug, "statistics", `statsCount ${fm.statsCount}, need >= 4`);
  if (a.attributedQuotes.length < 1) {
    fail(doc.slug, "quotation", "no named, attributed quotation found in the body");
  }
  if (fm.citations.length < 3) {
    fail(doc.slug, "citations", `${fm.citations.length} citations, need >= 3`);
  }
  if (fm.internalLinks.length < 3) {
    fail(doc.slug, "internal-links", `${fm.internalLinks.length} internal links, need >= 3`);
  }
}

// --- 8: every sitemap entry returns 200.
if (!skipNetwork) {
  try {
    const xml = await (await fetch("https://supaboard.ai/sitemap.xml")).text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    const bad: string[] = [];
    for (let i = 0; i < urls.length; i += 8) {
      const batch = await Promise.all(
        urls.slice(i, i + 8).map(async (u) => {
          try {
            const r = await fetch(u, { method: "HEAD", redirect: "manual" });
            return r.status === 200 ? null : `${u} -> ${r.status}`;
          } catch {
            return `${u} -> unreachable`;
          }
        }),
      );
      bad.push(...batch.filter((b): b is string => b !== null));
    }
    for (const b of bad) fail("(sitemap)", "sitemap-non-200", b);
  } catch (err) {
    fail("(sitemap)", "sitemap-fetch", String(err));
  }
}

// --- report ---------------------------------------------------------------
const byCheck = new Map<string, number>();
for (const f of failures) byCheck.set(f.check, (byCheck.get(f.check) ?? 0) + 1);

console.log(`posts checked: ${docs.length}`);
if (!failures.length) {
  console.log("all content checks passed");
  process.exit(0);
}

console.log(`\n${failures.length} failure(s):\n`);
for (const [check, n] of [...byCheck].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}  ${check}`);
}

const bySlug = new Map<string, Failure[]>();
for (const f of failures) {
  if (!bySlug.has(f.slug)) bySlug.set(f.slug, []);
  bySlug.get(f.slug)!.push(f);
}
console.log("");
for (const [slug, list] of bySlug) {
  console.log(`  ${slug}`);
  for (const f of list.slice(0, 6)) console.log(`    [${f.check}] ${f.detail}`);
  if (list.length > 6) console.log(`    … and ${list.length - 6} more`);
}
process.exit(1);
