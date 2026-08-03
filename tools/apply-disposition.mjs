/**
 * Phase 2 execution — delete MERGE members and rename KEEP survivors.
 *
 * Reads migration/disposition.csv so the files on disk and the redirect map
 * can never disagree: both come from the same row.
 *
 * Uses `git mv` / `git rm` so history follows the rename. Dry by default.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const ROOT = new URL("..", import.meta.url).pathname;
const apply = process.argv.includes("--apply");

/** Minimal RFC4180 reader — reasons contain commas and quoted quotes. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
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

const git = (...args) => execFileSync("git", args, { cwd: ROOT, stdio: "pipe" });

const deletes = [];
const renames = [];

/**
 * A slug can be both a MERGE member and a canonical's rename target — the
 * data-engineering cluster keeps `future-of-data-engineering` under the old
 * `data-engineering` URL. Once the rename has happened, the file at that path
 * is the survivor, so it must never be swept up by the delete pass.
 */
const renameTargets = new Set(
  rows.filter((r) => r.bucket === "KEEP" && r.new_slug).map((r) => `posts/${r.new_slug}.md`),
);

for (const r of rows) {
  if (r.bucket === "MERGE") {
    const stillTheMember =
      existsSync(`${ROOT}${r.file_path}`) && !renameTargets.has(r.file_path);
    if (stillTheMember) deletes.push(r.file_path);
  } else if (r.bucket === "KEEP") {
    const current = r.file_path;
    const target = `posts/${r.new_slug}.md`;
    if (current !== target && existsSync(`${ROOT}${current}`)) {
      renames.push([current, target]);
    }
  }
}

// Deletes run first so a member can vacate a path a rename is about to claim,
// but only for members that have not already been superseded above.


console.log(`MERGE members to delete: ${deletes.length}`);
console.log(`KEEP files to rename:    ${renames.length}`);

if (!apply) {
  console.log("\n(dry run — pass --apply to execute)");
  renames.slice(0, 5).forEach(([a, b]) => console.log(`  ${a} -> ${b}`));
  if (renames.length > 5) console.log(`  … and ${renames.length - 5} more`);
  process.exit(0);
}

for (const f of deletes) git("rm", "-q", f);
for (const [from, to] of renames) git("mv", from, to);

console.log(`\ndeleted ${deletes.length}, renamed ${renames.length}`);
