/**
 * Show a merge cluster: the canonical's structure alongside every member it
 * absorbed, pulled out of git history.
 *
 * The members were deleted in 7ce3cf0 (KILL) and 0f3ba7e (MERGE), so their last
 * live content is at the commit before the MERGE deletion.
 *
 *   node tools/cluster.mjs <cluster-id>            structure only
 *   node tools/cluster.mjs <cluster-id> --section "heading"   full text of one section
 *   node tools/cluster.mjs --list
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import matter from "gray-matter";
import { CLUSTERS } from "../migration/disposition.config.mjs";

const ROOT = new URL("..", import.meta.url).pathname;
const PRE_DELETE = "0f3ba7e^";

const args = process.argv.slice(2);
if (args.includes("--list") || !args.length) {
  for (const c of CLUSTERS) {
    console.log(`${c.id.padEnd(28)} ${String(c.members.length).padStart(2)} members -> ${c.canonical}`);
  }
  process.exit(0);
}

const id = args[0];
const sectionQuery = args.includes("--section") ? args[args.indexOf("--section") + 1] : null;
const cluster = CLUSTERS.find((c) => c.id === id);
if (!cluster) {
  console.error(`no cluster "${id}". Run --list.`);
  process.exit(1);
}

const fromGit = (slug) => {
  try {
    return execFileSync("git", ["show", `${PRE_DELETE}:posts/${slug}.md`], {
      cwd: ROOT,
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
    });
  } catch {
    return null;
  }
};

const h2sOf = (body) =>
  [...body.replace(/```[\s\S]*?```/g, "").matchAll(/^## +(.+?)\s*$/gm)].map((m) => m[1].trim());

const words = (s) => s.split(/\s+/).filter(Boolean).length;

if (sectionQuery) {
  // Print the full text of any section whose heading matches, across members.
  for (const slug of [cluster.canonicalFrom, ...cluster.members].filter(Boolean)) {
    const raw = slug === cluster.canonicalFrom
      ? readFileSync(`${ROOT}posts/${cluster.canonical}.md`, "utf8")
      : fromGit(slug);
    if (!raw) continue;
    const body = matter(raw).content;
    const parts = body.split(/^(## +.+)$/gm);
    for (let i = 1; i < parts.length; i += 2) {
      if (parts[i].toLowerCase().includes(sectionQuery.toLowerCase())) {
        console.log(`\n${"=".repeat(70)}\n${slug}\n${parts[i]}\n${"=".repeat(70)}`);
        console.log(parts[i + 1].trim());
      }
    }
  }
  process.exit(0);
}

console.log(`\ncluster: ${cluster.id}`);
console.log(`reason:  ${cluster.reason}\n`);

const canonicalRaw = readFileSync(`${ROOT}posts/${cluster.canonical}.md`, "utf8");
const canonicalBody = matter(canonicalRaw).content;
console.log(`CANONICAL  ${cluster.canonical}  (${words(canonicalBody)}w)`);
h2sOf(canonicalBody).forEach((h) => console.log(`    ${h}`));

const canonicalH2 = new Set(h2sOf(canonicalBody).map((h) => h.toLowerCase()));

for (const slug of cluster.members) {
  const raw = fromGit(slug);
  if (!raw) {
    console.log(`\n  MEMBER ${slug} — not recoverable`);
    continue;
  }
  const body = matter(raw).content;
  const h2 = h2sOf(body);
  console.log(`\n  MEMBER  ${slug}  (${words(body)}w)`);
  for (const h of h2) {
    const dup = canonicalH2.has(h.toLowerCase());
    console.log(`    ${dup ? " " : "+"} ${h}`);
  }
}
console.log(`\n  '+' marks a heading the canonical does not already have.\n`);
