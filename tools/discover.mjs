/**
 * Finds live blog URLs that supaboard.ai's own sitemap does not list.
 *
 *   node tools/discover.mjs
 *
 * A sitemap-driven migration is only as complete as the sitemap. This is the
 * independent check on that: it crawls outward from what is already migrated,
 * following every `/blog/<slug>` reference, and reports any that resolve to a
 * real page but have no file.
 *
 * As of the initial migration it finds nothing — Framer's sitemap, its two
 * search indexes and the link graph all agree on the same 145 posts. Re-run it
 * after any content change; a post that gets unlisted upstream would otherwise
 * disappear silently.
 *
 * A Framer 404 is easy to tell apart from a real page: it answers 200 but
 * canonicalises to `/404` and is marked `noindex`.
 */
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const ORIGIN = "https://supaboard.ai";
const POSTS_DIR = join(new URL("..", import.meta.url).pathname, "posts");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Every post slug referenced by a chunk of markdown or live HTML.
 *
 * Three forms are in play: `/blog/<slug>` in migrated markdown, `./<slug>`
 * between sibling posts and `./blog/<slug>` from the index in Framer's HTML,
 * and the `related:` list in frontmatter.
 */
function referencedSlugs(text) {
  const found = new Set();

  const add = (raw) => {
    let slug = raw
      // Markdown escapes parentheses in link targets, and an unescaped `)`
      // ends the target early — both mangle slugs like `…-tools-(2026)`.
      .replace(/\\([()])/g, "$1")
      .replace(/[.,;:]+$/, "")
      .split("#")[0]
      .split("?")[0]
      .trim();

    const unbalanced =
      (slug.match(/\(/g) ?? []).length - (slug.match(/\)/g) ?? []).length;
    if (unbalanced > 0) slug += ")".repeat(unbalanced);

    // A slug is one path segment. Anything deeper is a mirrored asset —
    // `/blog/<slug>/<sha>.png` — not a page.
    if (!slug || slug.includes("/")) return;
    if (/\.(png|jpe?g|webp|avif|gif|svg|xml|json)$/i.test(slug)) return;
    found.add(slug);
  };

  for (const match of text.matchAll(/\/blog\/([^\s"')\]<>]+)/g)) add(match[1]);
  for (const match of text.matchAll(/href="\.\/(?:blog\/)?([^"]+)"/g)) add(match[1]);

  const related = text.match(/^related:\n((?:\s{2}- .+\n)+)/m)?.[1] ?? "";
  for (const line of related.split("\n")) {
    if (line.trim()) add(line.replace(/^\s*-\s*"?(.*?)"?\s*$/, "$1"));
  }

  return found;
}

/** A real post, or Framer's 200-with-a-404-page? */
async function inspect(slug) {
  const url = `${ORIGIN}/blog/${encodeURI(slug)}`;
  const res = await fetch(url, { headers: { "user-agent": "supaboard-content-migration" } });
  if (!res.ok) return { ok: false, reason: `HTTP ${res.status}` };

  const html = await res.text();
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? "";
  const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? "";

  if (canonical.endsWith("/404")) return { ok: false, reason: "soft 404" };
  if (robots.includes("noindex")) return { ok: false, reason: "noindex" };

  const title = html.match(/<title>(.*?)<\/title>/s)?.[1]?.trim() ?? "";
  return { ok: true, title, links: referencedSlugs(html) };
}

/* ---- seed ---------------------------------------------------------------- */

const files = (await readdir(POSTS_DIR)).filter((name) => name.endsWith(".md"));
const migrated = new Set(files.map((name) => name.replace(/\.md$/, "")));

const xml = await (await fetch(`${ORIGIN}/sitemap.xml`)).text();
const listed = new Set(
  [...xml.matchAll(/<loc>https:\/\/supaboard\.ai\/blog\/([^<]+)<\/loc>/g)].map((m) => m[1]),
);

const seen = new Set([...migrated, ...listed]);
const queue = [];

for (const name of files) {
  const raw = await readFile(join(POSTS_DIR, name), "utf8");
  for (const slug of referencedSlugs(raw)) {
    if (!seen.has(slug)) {
      seen.add(slug);
      queue.push(slug);
    }
  }
}

/* ---- crawl --------------------------------------------------------------- */

const unlisted = [];
const rejected = [];

console.log(`seeded from ${files.length} files + ${listed.size} sitemap URLs`);
console.log(`${queue.length} candidate(s) to check\n`);

while (queue.length) {
  const slug = queue.shift();
  const result = await inspect(slug);

  if (!result.ok) {
    rejected.push({ slug, reason: result.reason });
    console.log(`  ✗ ${slug} — ${result.reason}`);
    continue;
  }

  unlisted.push(slug);
  console.log(`  ✓ ${slug} — ${result.title}`);

  // An unlisted post can link to further unlisted posts.
  for (const next of result.links) {
    if (!seen.has(next)) {
      seen.add(next);
      queue.push(next);
    }
  }

  await sleep(200);
}

/* ---- report -------------------------------------------------------------- */

console.log(`\n─── ${unlisted.length} live post(s) missing from the sitemap ───`);
if (unlisted.length) {
  console.log("\nMigrate them with:\n");
  console.log(`  node tools/scrape.mjs ${unlisted.map((s) => `'${s}'`).join(" ")}\n`);
}
if (rejected.length) {
  console.log(`(${rejected.length} candidate(s) were not real posts)`);
}
