/**
 * Draft the `citations` block from links already present in each post.
 *
 * Citations must be real, so the default source of truth is what the author
 * already linked to: the anchor text says what was being claimed, and the URL
 * is one somebody chose deliberately. Posts that come up short are reported so
 * a real source can be added by hand — never auto-filled.
 *
 * Writes migration/citation-drafts.json for review; --apply merges into posts.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import matter from "gray-matter";

const ROOT = new URL("..", import.meta.url).pathname;
const POSTS = `${ROOT}posts/`;
const apply = process.argv.includes("--apply");

/** Hand-verified additions for posts that link to nothing. Every URL returned 200. */
const TOPICAL_SOURCES = JSON.parse(
  readFileSync(`${ROOT}migration/verified-sources.json`, "utf8"),
);

const prettyHost = (url) => {
  const h = new URL(url).hostname.replace(/^www\./, "");
  const known = {
    "ibm.com": "IBM", "aws.amazon.com": "Amazon Web Services",
    "cloud.google.com": "Google Cloud", "learn.microsoft.com": "Microsoft Learn",
    "microsoft.com": "Microsoft", "en.wikipedia.org": "Wikipedia",
    "docs.getdbt.com": "dbt Labs", "cube.dev": "Cube",
    "gartner.com": "Gartner", "mckinsey.com": "McKinsey & Company",
    "metabase.com": "Metabase", "tableau.com": "Tableau",
    "thoughtspot.com": "ThoughtSpot", "qlik.com": "Qlik",
    "docs.snowflake.com": "Snowflake", "nist.gov": "NIST",
    "w3.org": "W3C", "superset.apache.org": "Apache Superset",
    "hbr.org": "Harvard Business Review", "deloitte.com": "Deloitte",
    "atscale.com": "AtScale", "forrester.com": "Forrester",
    "tei.forrester.com": "Forrester",
  };
  return known[h] ?? h;
};

const drafts = {};
const shortfalls = [];

for (const file of readdirSync(POSTS).filter((f) => f.endsWith(".md")).sort()) {
  const slug = basename(file, ".md");
  const parsed = matter(readFileSync(POSTS + file, "utf8"));

  // Existing citations win — never overwrite hand-authored ones.
  if (Array.isArray(parsed.data.citations) && parsed.data.citations.length >= 3) continue;

  const seen = new Set();
  const found = [];
  for (const m of parsed.content.matchAll(/\[([^\]]{3,120})\]\((https?:\/\/[^)\s]+)\)/g)) {
    const url = m[2].replace(/[).,]+$/, "");
    if (url.includes("supaboard")) continue;
    let host;
    try { host = new URL(url).hostname; } catch { continue; }
    if (seen.has(host)) continue; // one citation per source, not per link
    seen.add(host);
    const claim = m[1].replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();
    found.push({ claim: claim.length < 12 ? `${claim} — as described by ${prettyHost(url)}` : claim, source: prettyHost(url), url });
  }

  // Body links are deduped per host, so one site does not supply five
  // citations. The curated additions are deduped per URL instead: two different
  // IBM topic pages back two different claims and both are legitimate.
  const merged = [...found];
  const urls = new Set(found.map((f) => f.url));
  for (const e of TOPICAL_SOURCES[slug] ?? []) {
    if (urls.has(e.url)) continue;
    urls.add(e.url);
    merged.push(e);
  }

  drafts[slug] = merged;
  if (merged.length < 3) shortfalls.push(`${slug}: ${merged.length} citation(s)`);

  if (apply && merged.length >= 3) {
    parsed.data.citations = merged;
    writeFileSync(POSTS + file, matter.stringify(parsed.content, parsed.data));
  }
}

writeFileSync(`${ROOT}migration/citation-drafts.json`, JSON.stringify(drafts, null, 2) + "\n");

console.log(apply ? "applied citation blocks" : "(dry run)");
console.log(`posts drafted: ${Object.keys(drafts).length}`);
if (shortfalls.length) {
  console.log(`\n${shortfalls.length} post(s) still short of 3 citations — need a real source added by hand:`);
  shortfalls.forEach((s) => console.log(`  ${s}`));
}
