/**
 * Phase 4 — generate the 301 map from disposition.csv and prove it is sane.
 *
 * Two properties are asserted before anything is written, because both fail
 * silently in production:
 *
 *   - no chains. A -> B -> C loses PageRank at every hop and is trivially
 *     avoidable when the whole map is generated at once.
 *   - no loops. A -> B -> A is an infinite redirect, a hard outage on that URL.
 *
 * Emits a portable JSON map plus a drop-in Next.js module, so whoever builds
 * the blog routes wires in a file rather than retyping 100 redirects.
 */
import { readFileSync, writeFileSync } from "node:fs";
import {
  COMPARISON_COMPETITORS,
  COMPARISON_ARTICLES,
  NAMED_REDIRECTS,
  EXTRA_410,
} from "../migration/routes.extra.mjs";

const ROOT = new URL("..", import.meta.url).pathname;

function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else if (c !== "\r") cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [header, ...body] = rows.filter((r) => r.length > 1);
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}

const rows = parseCsv(readFileSync(`${ROOT}migration/disposition.csv`, "utf8"));
const path = (url) => url.replace(/^https:\/\/supaboard\.ai/, "");

const redirects = []; // { source, destination, why }
const gone = [];

for (const r of rows) {
  const source = path(r.old_url);
  if (r.bucket === "KILL") {
    gone.push({ source, why: "KILL" });
  } else if (r.bucket === "MERGE") {
    const destination = path(r.canonical_target);
    // A member can share its URL with the canonical: the data-engineering
    // cluster keeps future-of-data-engineering under the older, stronger
    // /blog/data-engineering path. That URL still resolves — it now serves the
    // merged post — so it needs no redirect. Emitting one would be an infinite
    // loop on a live page.
    if (source !== destination) redirects.push({ source, destination, why: "merged" });
  } else if (r.bucket === "KEEP") {
    const dest = `/blog/${r.new_slug}`;
    if (source !== dest) redirects.push({ source, destination: dest, why: "renamed" });
  }
}

// The two competitor systems fold into /compare.
for (const [slug, competitor] of COMPARISON_COMPETITORS) {
  // An empty competitor means the vendor page was retired in the Aug-2026
  // consolidation, so the hub itself is the destination. Emitted without a
  // trailing slash: `/compare/` would be a second hop.
  const destination = competitor ? `/compare/${competitor}` : "/compare";
  redirects.push({ source: `/comparison/${slug}`, destination, why: "comparison system consolidated" });
  // /series/* currently 308s to /comparison/*. Left alone that becomes a
  // two-hop chain the moment /comparison/* moves, so it is flattened here.
  redirects.push({ source: `/series/${slug}`, destination, why: "series system consolidated (flattened, was chaining via /comparison)" });
}
for (const [slug, destination] of COMPARISON_ARTICLES) {
  redirects.push({ source: `/comparison/${slug}`, destination, why: "article misfiled under /comparison" });
}
for (const [source, destination] of NAMED_REDIRECTS) {
  redirects.push({ source, destination, why: "named in brief" });
}
for (const source of EXTRA_410) gone.push({ source, why: "never a real page" });

/**
 * Next.js matches `source` with path-to-regexp, where `(` opens a capture
 * group — so a literal slug like `…-(2026)` never matches and the URL 404s
 * instead of redirecting. Both of ours were dead in production. Escape the
 * parens, and emit the percent-encoded spelling too, since whether the
 * pathname arrives decoded depends on the proxy in front of the app.
 */
function nextSources(source) {
  if (!/[()]/.test(source)) return [source];
  const escaped = source.replace(/[()]/g, (c) => `\\${c}`);
  const encoded = source.replace(/\(/g, "%28").replace(/\)/g, "%29");
  return [escaped, encoded];
}

// --- assertions ----------------------------------------------------------
const problems = [];

const bySource = new Map();
for (const r of redirects) {
  if (bySource.has(r.source)) {
    problems.push(`duplicate source ${r.source} -> ${bySource.get(r.source).destination} and ${r.destination}`);
  }
  bySource.set(r.source, r);
}

const goneSources = new Set(gone.map((g) => g.source));
for (const r of redirects) {
  if (goneSources.has(r.source)) problems.push(`${r.source} is both redirected and 410`);
}

for (const r of redirects) {
  // A destination that is itself a source is a chain.
  if (bySource.has(r.destination)) {
    problems.push(`chain: ${r.source} -> ${r.destination} -> ${bySource.get(r.destination).destination}`);
  }
  if (goneSources.has(r.destination)) {
    problems.push(`${r.source} redirects to ${r.destination}, which is 410`);
  }
  if (r.source === r.destination) problems.push(`self-loop: ${r.source}`);
}

// Full cycle detection, in case a chain closes over more than two hops.
for (const start of bySource.keys()) {
  const seen = new Set([start]);
  let cur = bySource.get(start).destination;
  let hops = 1;
  while (bySource.has(cur)) {
    if (seen.has(cur)) { problems.push(`loop through ${start}`); break; }
    seen.add(cur);
    cur = bySource.get(cur).destination;
    if (++hops > 10) { problems.push(`runaway chain from ${start}`); break; }
  }
}

if (problems.length) {
  console.error(`${problems.length} redirect problem(s):`);
  [...new Set(problems)].forEach((p) => console.error(`  ${p}`));
  process.exit(1);
}

// --- emit ----------------------------------------------------------------
redirects.sort((a, b) => a.source.localeCompare(b.source));
gone.sort((a, b) => a.source.localeCompare(b.source));

writeFileSync(
  `${ROOT}migration/redirects.json`,
  JSON.stringify({ redirects, gone }, null, 2) + "\n",
);

const nextModule = `/**
 * Generated by tools/redirects.mjs from migration/disposition.csv.
 * Do not hand-edit — change the disposition and regenerate.
 *
 * ${redirects.length} permanent redirects, ${gone.length} URLs that must return 410.
 *
 * Next.js has no built-in 410, so \`gone\` is exported separately: match these
 * in middleware (or a route handler) and respond 410 with a real page. A 301
 * to the homepage or a category hub would be a soft-404 signal and waste
 * crawl budget, which is exactly what these URLs must not do.
 */
export const redirects = ${JSON.stringify(
  redirects.flatMap(({ source, destination }) => nextSources(source).map((s) => ({ source: s, destination, permanent: true }))),
  null,
  2,
)};

export const gone = ${JSON.stringify(gone.map((g) => g.source), null, 2)};
`;
writeFileSync(`${ROOT}migration/redirects.next.mjs`, nextModule);

/**
 * The same list as plain URLs, for anyone auditing by hand or pasting into
 * Search Console. It claimed to be generated from disposition.csv and was not,
 * so it drifted: in September 2026 it still listed a URL that had been moved to
 * a 301. Generated for real now.
 *
 * The rule in the header holds by default. `server-based-computing-guide` is
 * the one deliberate exception on record — off-topic, so a KILL by the rule,
 * but ranking #1-2 for a 22,200/month term and carrying the inbound links that
 * come with it. It was moved to a 301 in September 2026 with the topical
 * mismatch accepted; see the comment in disposition.config.mjs.
 */
writeFileSync(
  `${ROOT}migration/410-gone.txt`,
  [
    "# URLs that must return 410 Gone. Generated by tools/redirects.mjs.",
    "# Do not 301 these — a 301 to an irrelevant destination is a soft-404 signal.",
    ...gone.map((g) => `https://supaboard.ai${g.source}`),
  ].join("\n") + "\n",
);

console.log(`redirects: ${redirects.length}`);
console.log(`410 gone:  ${gone.length}`);
console.log(`no chains, no loops, no duplicate sources`);
console.log(`wrote migration/redirects.json, redirects.next.mjs and 410-gone.txt`);
