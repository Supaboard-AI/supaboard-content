/**
 * Phase 4 — prove no URL that returns 200 today returns a bare 404 after
 * cutover.
 *
 * Takes the live sitemap as the definition of "exists today" and checks each
 * URL against three ways of surviving: it still resolves to a post, it 301s,
 * or it 410s deliberately. Anything left over is a regression.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SITE = "https://supaboard.ai";

/** App routes that are not blog content and are expected to keep working. */
const STATIC_ROUTES = new Set([
  "/", "/blog", "/comparison", "/pricing", "/privacy-policy",
  "/terms-and-conditions", "/integrations", "/case-study",
  "/case-study/objection.ai", "/case-study/legend-ehr",
  "/case-study/jindal-healthcare", "/case-study/gabriella.pl",
]);

const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
const live = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => decodeURIComponent(m[1].trim().replace(SITE, "")));

const { redirects, gone } = JSON.parse(readFileSync(`${ROOT}migration/redirects.json`, "utf8"));
const redirectSources = new Map(redirects.map((r) => [r.source, r.destination]));
const goneSources = new Set(gone.map((g) => g.source));
const posts = new Set(
  readdirSync(`${ROOT}posts`).filter((f) => f.endsWith(".md")).map((f) => basename(f, ".md")),
);

const resolves = (p) =>
  STATIC_ROUTES.has(p) || (p.startsWith("/blog/") && posts.has(p.slice(6)));

const buckets = { resolves: [], redirects: [], gone: [], UNCOVERED: [] };
for (const p of live) {
  if (resolves(p)) buckets.resolves.push(p);
  else if (redirectSources.has(p)) buckets.redirects.push(p);
  else if (goneSources.has(p)) buckets.gone.push(p);
  else buckets.UNCOVERED.push(p);
}

// Every redirect destination must itself be a live thing, or the 301 is a 404.
const badDestinations = redirects.filter(
  (r) => !resolves(r.destination) && !r.destination.startsWith("/compare/") && !r.destination.includes(":"),
);

console.log(`live sitemap URLs: ${live.length}`);
console.log(`  still resolve : ${buckets.resolves.length}`);
console.log(`  301           : ${buckets.redirects.length}`);
console.log(`  410           : ${buckets.gone.length}`);
console.log(`  UNCOVERED     : ${buckets.UNCOVERED.length}`);

if (badDestinations.length) {
  console.error(`\n${badDestinations.length} redirect(s) pointing at something that will not exist:`);
  badDestinations.forEach((r) => console.error(`  ${r.source} -> ${r.destination}`));
}
if (buckets.UNCOVERED.length) {
  console.error(`\nUNCOVERED live URLs (these would 404):`);
  buckets.UNCOVERED.forEach((p) => console.error(`  ${p}`));
}

writeFileSync(
  `${ROOT}migration/coverage.json`,
  JSON.stringify({ liveCount: live.length, ...buckets, badDestinations }, null, 2) + "\n",
);

// /compare/* is a route the app repo still has to build; report it as owed
// work rather than silently passing.
const compareTargets = [...new Set(redirects.filter((r) => r.destination.startsWith("/compare/")).map((r) => r.destination))];
console.log(`\n/compare routes the app must provide: ${compareTargets.length}`);
compareTargets.sort().forEach((t) => console.log(`  ${t}`));

if (buckets.UNCOVERED.length || badDestinations.length) process.exit(1);
console.log(`\nno live URL falls through to a 404`);
