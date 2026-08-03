/**
 * Phase 2 — emit migration/disposition.csv from disposition.config.mjs.
 *
 * Refuses to write unless every post in the inventory is classified exactly
 * once. Double-classification and omission are both silent failures otherwise:
 * a post in two buckets gets a redirect *and* a 410, and a post in none simply
 * disappears from the migration.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { KILL, CLUSTERS, KEEP } from "../migration/disposition.config.mjs";

const INVENTORY = new URL("../migration/inventory.json", import.meta.url).pathname;
const OUT = new URL("../migration/disposition.csv", import.meta.url).pathname;
const SITE = "https://supaboard.ai";

const inventory = JSON.parse(readFileSync(INVENTORY, "utf8"));
const known = new Set(inventory.posts.map((p) => p.fileSlug));

const rows = [];
const seen = new Map(); // slug -> bucket, to catch double classification

function add(slug, bucket, newSlug, canonicalTarget, reason) {
  if (seen.has(slug)) {
    throw new Error(`${slug} classified twice: ${seen.get(slug)} and ${bucket}`);
  }
  seen.set(slug, bucket);
  rows.push({
    old_url: `${SITE}/blog/${slug}`,
    file_path: `posts/${slug}.md`,
    bucket,
    new_slug: newSlug ?? "",
    canonical_target: canonicalTarget ?? "",
    reason,
  });
}

for (const [slug, reason] of KILL) add(slug, "KILL", "", "410", reason);

for (const cluster of CLUSTERS) {
  const toCompare = cluster.canonical === "__COMPARE_ROUTE__";
  if (!toCompare) {
    const from = cluster.canonicalFrom;
    add(
      from,
      "KEEP",
      cluster.canonical,
      "",
      `Cluster canonical (${cluster.id}): ${cluster.reason}`,
    );
  }
  for (const m of cluster.members) {
    const target = toCompare
      ? `${SITE}/compare/${competitorOf(m)}`
      : `${SITE}/blog/${cluster.canonical}`;
    add(m, "MERGE", "", target, `Absorbed into ${cluster.id}: ${cluster.reason}`);
  }
}

for (const [slug, newSlug, reason] of KEEP) add(slug, "KEEP", newSlug ?? slug, "", reason);

/** Competitor name out of a supaboard-vs-X slug, for the /compare route. */
function competitorOf(slug) {
  const m = slug.match(/^supaboard-vs-([a-z0-9-]+?)(?:-(?:a|the|smarter|new|rethinking|which)\b.*)?$/);
  const raw = (m ? m[1] : slug.replace(/^supaboard-vs-/, "")).split("-");
  const KNOWN = ["alteryx", "amazon-quicksight", "domo", "looker", "oracle-analytics",
    "power-bi", "sas-viya", "sisense", "tableau", "thoughtspot", "metabase"];
  const joined = raw.join("-");
  return KNOWN.find((k) => joined.startsWith(k)) ?? raw[0];
}

// --- Coverage assertions -------------------------------------------------
const classified = new Set(seen.keys());
const missing = [...known].filter((s) => !classified.has(s)).sort();
const unknown = [...classified].filter((s) => !known.has(s)).sort();

if (missing.length) {
  console.error(`\n${missing.length} post(s) in the inventory with no disposition:`);
  missing.forEach((s) => console.error(`  ${s}`));
}
if (unknown.length) {
  console.error(`\n${unknown.length} disposition entr(ies) naming a post that does not exist:`);
  unknown.forEach((s) => console.error(`  ${s}`));
}
if (missing.length || unknown.length) process.exit(1);

// Every MERGE must land on a slug that survives, or the redirect is a 404.
const survivors = new Set(
  rows.filter((r) => r.bucket === "KEEP").map((r) => r.new_slug || r.old_url.split("/").pop()),
);
const danglingMerges = rows.filter(
  (r) =>
    r.bucket === "MERGE" &&
    r.canonical_target.startsWith(`${SITE}/blog/`) &&
    !survivors.has(r.canonical_target.slice(`${SITE}/blog/`.length)),
);
if (danglingMerges.length) {
  console.error("\nMERGE rows pointing at a non-surviving canonical:");
  danglingMerges.forEach((r) => console.error(`  ${r.old_url} -> ${r.canonical_target}`));
  process.exit(1);
}

const csvCell = (v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
const header = ["old_url", "file_path", "bucket", "new_slug", "canonical_target", "reason"];
rows.sort((a, b) => a.old_url.localeCompare(b.old_url));
writeFileSync(
  OUT,
  [header.join(","), ...rows.map((r) => header.map((h) => csvCell(r[h])).join(","))].join("\n") + "\n",
);

const count = (b) => rows.filter((r) => r.bucket === b).length;
console.log(`disposition.csv: ${rows.length} rows (inventory: ${known.size})`);
console.log(`  KILL  ${count("KILL")}`);
console.log(`  MERGE ${count("MERGE")}`);
console.log(`  KEEP  ${count("KEEP")}`);
console.log(`  renames among KEEP: ${rows.filter((r) => r.bucket === "KEEP" && r.new_slug !== r.old_url.split("/").pop()).length}`);
