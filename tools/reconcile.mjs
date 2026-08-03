/**
 * Phase 1 — reconcile the live sitemap against posts/*.md.
 *
 * The sitemap is a claim about what exists; a HEAD request is the fact. Where
 * they disagree the live response wins, so every candidate discrepancy is
 * probed rather than reported on the sitemap's word alone.
 */
import { readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, basename } from "node:path";

const POSTS_DIR = new URL("../posts/", import.meta.url).pathname;
const OUT_DIR = new URL("../migration/", import.meta.url).pathname;
const SITEMAP = "https://supaboard.ai/sitemap.xml";
const SITE = "https://supaboard.ai";

const CONCURRENCY = 8;

/** Follows nothing — we want the first response, redirect included. */
async function probe(url) {
  try {
    const res = await fetch(url, { method: "GET", redirect: "manual" });
    return {
      url,
      status: res.status,
      location: res.headers.get("location") ?? null,
    };
  } catch (err) {
    return { url, status: 0, error: String(err.message ?? err) };
  }
}

async function probeAll(urls) {
  const out = [];
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    out.push(...(await Promise.all(urls.slice(i, i + CONCURRENCY).map(probe))));
    process.stdout.write(`\r  probed ${Math.min(i + CONCURRENCY, urls.length)}/${urls.length}`);
  }
  process.stdout.write("\n");
  return out;
}

const xml = await (await fetch(SITEMAP)).text();
const sitemapUrls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
const hasLastmod = /<lastmod>/.test(xml);

const sitemapBlog = sitemapUrls
  .filter((u) => u.startsWith(`${SITE}/blog/`))
  .map((u) => decodeURIComponent(u.slice(`${SITE}/blog/`.length)));
const sitemapOther = sitemapUrls.filter((u) => !u.startsWith(`${SITE}/blog/`));

const repoSlugs = readdirSync(POSTS_DIR)
  .filter((f) => f.endsWith(".md"))
  .map((f) => basename(f, ".md"))
  .sort();

const repoSet = new Set(repoSlugs);
const sitemapSet = new Set(sitemapBlog);

// List 1 — in the sitemap, not in the repo. These 404 at cutover unless routed.
const liveNotInRepo = sitemapBlog.filter((s) => !repoSet.has(s)).sort();
// List 2 — in the repo, not in the sitemap. New or renamed during migration.
const repoNotLive = repoSlugs.filter((s) => !sitemapSet.has(s)).sort();

/**
 * List 3 — slug mismatches. A sitemap slug and a repo slug that differ only in
 * punctuation are the same post under two spellings, which is precisely the
 * parenthesis noise the brief warns about.
 */
const normalise = (s) => s.replace(/[()'’]/g, "").replace(/-+/g, "-").toLowerCase();
const repoByNorm = new Map(repoSlugs.map((s) => [normalise(s), s]));
const mismatches = [];
for (const s of liveNotInRepo) {
  const hit = repoByNorm.get(normalise(s));
  if (hit) mismatches.push({ sitemapSlug: s, repoSlug: hit, kind: "punctuation" });
}
const mismatchedSitemapSlugs = new Set(mismatches.map((m) => m.sitemapSlug));
const mismatchedRepoSlugs = new Set(mismatches.map((m) => m.repoSlug));

console.log("probing sitemap-only blog URLs…");
const probedLiveOnly = await probeAll(liveNotInRepo.map((s) => `${SITE}/blog/${s}`));

console.log("probing repo-only slugs against the live site…");
const probedRepoOnly = await probeAll(repoNotLive.map((s) => `${SITE}/blog/${s}`));

// Specific routes the brief calls out, verified rather than assumed.
console.log("probing brief-specified routes…");
const namedRoutes = await probeAll([
  `${SITE}/case-studies`,
  `${SITE}/case-study`,
  `${SITE}/comparison`,
  `${SITE}/comparison/:qOhqaUNS9`,
  `${SITE}/old-home-2`,
  `${SITE}/series/supaboard-vs-metabase`,
  `${SITE}/blog/page/2`,
]);

const report = {
  sitemap: {
    url: SITEMAP,
    totalUrls: sitemapUrls.length,
    blogUrls: sitemapBlog.length,
    nonBlogUrls: sitemapOther.length,
    hasLastmod,
    nonBlogUrlList: sitemapOther,
    parenthesisedUrls: sitemapUrls.filter((u) => /[()]/.test(u)),
    listsOldHome2: sitemapUrls.some((u) => u.includes("old-home-2")),
    lists404: sitemapUrls.some((u) => /\/404\b/.test(u)),
    listsSeriesRoutes: sitemapUrls.some((u) => u.includes("/series/")),
  },
  repo: { postCount: repoSlugs.length },
  list1_liveNotInRepo: probedLiveOnly.map((p) => ({
    ...p,
    slug: decodeURIComponent(p.url.slice(`${SITE}/blog/`.length)),
    explainedByPunctuationMismatch: mismatchedSitemapSlugs.has(
      decodeURIComponent(p.url.slice(`${SITE}/blog/`.length)),
    ),
  })),
  list2_repoNotLive: probedRepoOnly.map((p) => ({
    ...p,
    slug: decodeURIComponent(p.url.slice(`${SITE}/blog/`.length)),
    explainedByPunctuationMismatch: mismatchedRepoSlugs.has(
      decodeURIComponent(p.url.slice(`${SITE}/blog/`.length)),
    ),
  })),
  list3_slugMismatches: mismatches,
  namedRoutes,
};

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, "reconciliation.json"), JSON.stringify(report, null, 2) + "\n");

console.log("\n--- RECONCILIATION ---");
console.log(`sitemap URLs total       : ${sitemapUrls.length}`);
console.log(`sitemap /blog/ URLs      : ${sitemapBlog.length}`);
console.log(`repo posts               : ${repoSlugs.length}`);
console.log(`1. live, no repo file    : ${liveNotInRepo.length}`);
console.log(`2. repo file, not in map : ${repoNotLive.length}`);
console.log(`3. slug mismatches       : ${mismatches.length}`);
console.log(`sitemap has lastmod      : ${hasLastmod}`);
