/**
 * Rewrite in-body internal links through the redirect map.
 *
 * The codemod fixed the `internalLinks` frontmatter, but prose links were left
 * pointing at slugs that no longer exist. Serving a 301 to your own reader on
 * every internal click is wasteful; linking into a 410 is worse.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const POSTS = `${ROOT}posts/`;
const apply = process.argv.includes("--apply");

const { redirects, gone } = JSON.parse(readFileSync(`${ROOT}migration/redirects.json`, "utf8"));
const map = new Map(redirects.map((r) => [r.source, r.destination]));
const goneSet = new Set(gone.map((g) => g.source));
const live = new Set(readdirSync(POSTS).filter((f) => f.endsWith(".md")).map((f) => basename(f, ".md")));

let rewritten = 0;
const dead = [];

for (const file of readdirSync(POSTS).filter((f) => f.endsWith(".md")).sort()) {
  const slug = basename(file, ".md");
  const original = readFileSync(POSTS + file, "utf8");

  // Matches the whole [anchor](url) so a link into a 410 can be unwrapped to
  // plain text rather than left pointing at a dead end. Backslashes are kept in
  // the character class: the Framer export escaped parentheses inside URLs.
  const next = original.replace(
    /\[([^\]]*)\]\((?:https:\/\/supaboard\.ai)?(\/blog\/[^)\s#]+)((?:#[^)\s]*)?)\)/g,
    (whole, anchor, path, hash) => {
      const raw = decodeURIComponent(path).slice("/blog/".length);
      // Un-escape the export's `\(` / `\)` and try the paren-free spelling too:
      // several body links point at a parenthesised URL that never existed.
      const unescaped = raw.replace(/\\/g, "");
      const candidates = [raw, unescaped, unescaped.replace(/[()]/g, "")];

      for (const c of candidates) {
        if (live.has(c)) return c === raw ? whole : `[${anchor}](/blog/${c}${hash})`;
      }
      for (const c of candidates) {
        const dest = map.get(`/blog/${c}`);
        if (dest) {
          rewritten++;
          return `[${anchor}](${dest}${hash})`;
        }
      }
      for (const c of candidates) {
        if (goneSet.has(`/blog/${c}`)) {
          dead.push({ from: slug, to: c, why: "410 — link unwrapped to plain text" });
          return anchor; // the sentence survives; the dead link does not
        }
      }
      dead.push({ from: slug, to: unescaped, why: "unknown slug" });
      return whole;
    },
  );

  if (apply && next !== original) writeFileSync(POSTS + file, next);
}

console.log(apply ? `rewrote ${rewritten} body links` : `${rewritten} body links would be rewritten (dry run)`);
if (dead.length) {
  console.log(`\n${dead.length} link(s) that cannot be rewritten — they point at deleted content:`);
  for (const d of dead) console.log(`  [${d.from}] -> /blog/${d.to} (${d.why})`);
  console.log(`\nThese must be re-pointed or removed by hand; a link into a 410 is a dead end.`);
}
