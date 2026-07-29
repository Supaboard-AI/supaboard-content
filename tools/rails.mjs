/**
 * Mirrors the editorial rails on supaboard.ai/blog into frontmatter.
 *
 *   node tools/rails.mjs [--dry]
 *
 * "Supaboard Choice" and "Trending" are hand-picked in Framer's CMS and appear
 * nowhere in a post's own page — the only place they exist is the index. This
 * reads that page and writes `featured.choice` / `featured.trending` onto the
 * matching files, so the ported index shows the same picks in the same order.
 *
 * Position is stored, not a boolean: the lead card in "Supaboard Choice" is
 * twice the size of the other two, so which post is first is a visible
 * editorial decision that a flag cannot express. `null` means not featured;
 * `1` is the first slot.
 *
 * Every post gets a `featured` block, so the schema stays uniform and an admin
 * console can set a slot without inventing the key first.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import * as cheerio from "cheerio";

const ORIGIN = "https://supaboard.ai";
const POSTS_DIR = join(new URL("..", import.meta.url).pathname, "posts");
const dryRun = process.argv.includes("--dry");

/**
 * Walks up from the rail's heading until an ancestor contains post links —
 * the heading and the list are siblings several wrappers apart in Framer's
 * output, and the exact depth differs between the two rails.
 */
function railSlugs($, label) {
  const heading = $("*")
    .filter((_, el) => $(el).children().length === 0 && $(el).text().trim() === label)
    .first();

  let node = heading;
  for (let depth = 0; depth < 8 && node.length; depth += 1) {
    const slugs = [
      ...new Set(
        node
          .find('a[href^="./blog/"]')
          .map((_, a) => $(a).attr("href").replace(/^\.\/blog\//, "").split("#")[0])
          .get()
          .filter(Boolean),
      ),
    ];
    if (slugs.length >= 3) return slugs;
    node = node.parent();
  }

  return [];
}

const html = await (await fetch(`${ORIGIN}/blog`)).text();
const $ = cheerio.load(html);

const choice = railSlugs($, "Supaboard Choice");
const trending = railSlugs($, "Trending");

if (!choice.length || !trending.length) {
  console.error("Could not read the rails off /blog — the markup has changed.");
  process.exit(1);
}

console.log(`Supaboard Choice (${choice.length}):`);
for (const slug of choice) console.log(`  ${slug}`);
console.log(`Trending (${trending.length}):`);
for (const slug of trending) console.log(`  ${slug}`);

/* ---- write --------------------------------------------------------------- */

const files = (await readdir(POSTS_DIR)).filter((name) => name.endsWith(".md"));
const known = new Set(files.map((name) => name.replace(/\.md$/, "")));

for (const slug of [...choice, ...trending]) {
  if (!known.has(slug)) console.error(`  ! rail references un-migrated post: ${slug}`);
}

let changed = 0;

for (const name of files) {
  const slug = name.replace(/\.md$/, "");
  const path = join(POSTS_DIR, name);
  const raw = await readFile(path, "utf8");

  const rank = (rail) => {
    const index = rail.indexOf(slug);
    return index === -1 ? "null" : String(index + 1);
  };

  const block = [
    "featured:",
    `  choice: ${rank(choice)}`,
    `  trending: ${rank(trending)}`,
    "",
  ].join("\n");

  let next;
  if (/^featured:\n(?: {2}\w+: \S+\n)+/m.test(raw)) {
    next = raw.replace(/^featured:\n(?: {2}\w+: \S+\n)+/m, block);
  } else if (/^related:/m.test(raw)) {
    // Sits between the derived `sections` and the derived `related`, matching
    // the order the scraper emits.
    next = raw.replace(/^related:/m, `${block}related:`);
  } else {
    console.error(`  ! ${slug}: no anchor to insert "featured" before`);
    continue;
  }

  if (next === raw) continue;
  changed += 1;
  if (!dryRun) await writeFile(path, next, "utf8");
}

console.log(`\n${dryRun ? "would update" : "updated"} ${changed}/${files.length} files`);
