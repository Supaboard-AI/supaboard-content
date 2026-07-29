/**
 * Migrates a post from the live Framer build at supaboard.ai into this repo.
 *
 *   node tools/scrape.mjs <slug> [<slug> …]
 *   node tools/scrape.mjs --all            # every /blog/ URL in the sitemap
 *
 * Two rules drive the whole thing:
 *
 *  1. URLs are sacred. The output filename is the slug exactly as it appears
 *     in the sitemap, and the in-page section anchors keep Framer's
 *     `#content-1 … #content-8` ids so existing deep links survive.
 *  2. Prose is markdown. The HTML -> markdown conversion and the asset
 *     mirroring both live in convert.mjs, shared with comparisons.mjs.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import * as cheerio from "cheerio";

import {
  AVATAR_EDGE,
  ORIGIN,
  blockToMarkdown,
  decode,
  getText,
  mirrorImage,
  readJsonLd,
  storagePrefix,
  toIsoDate,
} from "./convert.mjs";
import { extractFaq } from "./faq.mjs";

/** Left over from one post and never updated; see `coverAlt` below. */
const STALE_COVER_ALT = "Visual guide showing when to use tables versus charts";
const REPO_ROOT = new URL("..", import.meta.url).pathname;
const POSTS_DIR = join(REPO_ROOT, "posts");

async function listSitemapSlugs() {
  const xml = await getText(`${ORIGIN}/sitemap.xml`);
  return [...xml.matchAll(/<loc>https:\/\/supaboard\.ai\/blog\/([^<]+)<\/loc>/g)].map(
    (m) => m[1],
  );
}

/* -------------------------------------------------------------------------- */
/* extraction                                                                  */
/* -------------------------------------------------------------------------- */

/** The eight rich-text blocks that make up a post body, in document order. */
function contentBlocks($) {
  const selector = 'div[data-framer-name="Content"][data-framer-component-type="RichTextContainer"]';
  const nodes = $(selector).toArray();
  if (!nodes.length) return { blocks: [], root: null };

  const chains = nodes.map((node) => $(node).parents().toArray().reverse());
  let root = null;
  for (let depth = 0; depth < chains[0].length; depth += 1) {
    const candidate = chains[0][depth];
    if (chains.every((chain) => chain[depth] === candidate)) root = candidate;
    else break;
  }

  // Each direct child of that root is one "Content N" wrapper.
  const blocks = $(root)
    .children()
    .toArray()
    .filter((el) => $(el).find(selector).length > 0);

  return { blocks, root };
}

/**
 * `status` and `featured` are editorial, not scraped. Re-running the migration
 * over a post an editor has since unpublished or promoted must not silently
 * undo that, so both are read back off the existing file.
 */
async function existingEditorialState(slug) {
  let raw;
  try {
    raw = await readFile(join(POSTS_DIR, `${slug}.md`), "utf8");
  } catch {
    return { status: "published", featured: { choice: false, trending: false } };
  }

  const frontmatter = raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  const status = frontmatter.match(/^status:\s*"?(\w+)"?/m)?.[1];
  const featured = frontmatter.match(/^featured:\n((?: {2}\w+: \S+\n)+)/m)?.[1] ?? "";
  const rank = (rail) => {
    const value = featured.match(new RegExp(`${rail}:\\s*(\\d+)`))?.[1];
    return value ? Number(value) : null;
  };

  return {
    status: ["published", "draft", "scheduled"].includes(status) ? status : "published",
    featured: { choice: rank("choice"), trending: rank("trending") },
  };
}

async function scrapePost(slug) {
  const pageUrl = `${ORIGIN}/blog/${slug}`;
  console.log(`\n▸ ${slug}`);
  const html = await getText(pageUrl);
  const $ = cheerio.load(html);

  const graph = readJsonLd($);
  const posting = graph.find((n) => n["@type"] === "BlogPosting") ?? {};
  const person = graph.find((n) => n["@type"] === "Person") ?? {};

  const title = decode($("h1").first().text().trim() || posting.headline);
  const description = decode(
    $('meta[name="description"]').attr("content") ?? posting.description ?? "",
  );

  /* ---- author ---------------------------------------------------------- */
  const authorImg = $('div[data-framer-name="Profile Image"]').first().find("img").first();
  const authorName = decode(person.name ?? "");
  const authorRole = decode(person.jobTitle ?? "");
  const authorAvatar = await mirrorImage(
    authorImg.attr("src") ?? person.image,
    "blog/authors",
    { maxEdge: AVATAR_EDGE },
  );

  /* ---- dates + read time ----------------------------------------------- */
  let readLabel = null;
  let dateLabel = null;
  $("p").each((_, el) => {
    const text = $(el).text().trim();
    if (!readLabel && /^\d+\s*(mins?|min read)$/i.test(text)) readLabel = text;
    if (!dateLabel && /^[A-Z][a-z]{2} \d{1,2}, \d{4}$/.test(text)) dateLabel = text;
  });

  /* ---- imagery --------------------------------------------------------- */
  const rawCover = Array.isArray(posting.image) ? posting.image[0] : posting.image;
  const coverSource = decode(rawCover ?? "");
  const sourceCoverAlt = decode(
    $("img")
      .toArray()
      .map((el) => $(el))
      .find(($img) => {
        const src = $img.attr("src") ?? "";
        return coverSource && src.split("?")[0] === coverSource.split("?")[0];
      })
      ?.attr("alt") ?? "",
  );
  // Framer serves the same stale alt on every post's cover. Copying that
  // across 145 pages would be a real accessibility and SEO regression, so the
  // title stands in wherever the placeholder shows up.
  const coverAlt =
    !sourceCoverAlt || sourceCoverAlt === STALE_COVER_ALT ? title : sourceCoverAlt;
  const coverSize = coverSource.match(/width=(\d+)&(?:amp;)?height=(\d+)/);
  const cover = await mirrorImage(coverSource, storagePrefix("blog", slug));
  const ogImage = await mirrorImage(
    $('meta[property="og:image"]').attr("content"),
    "blog/og",
  );

  /* ---- body ------------------------------------------------------------ */
  const { blocks } = contentBlocks($);
  const sections = [];
  const parts = [];

  for (const [index, block] of blocks.entries()) {
    const id = `content-${index + 1}`;
    const markdown = await blockToMarkdown($, block, {
      pageUrl,
      label: slug,
      prefix: storagePrefix("blog", slug),
    });
    if (!markdown) continue;
    const heading = $(block).find("h2").first().text().trim();
    if (heading) sections.push({ id, heading });
    parts.push(`<!-- section:${id} -->\n\n${markdown}`);
  }

  const body = parts.join("\n\n");

  /* ---- relations ------------------------------------------------------- */
  const related = [];
  $('a[href^="./"]').each((_, el) => {
    const href = $(el).attr("href") ?? "";
    const target = href.replace(/^\.\//, "").split("#")[0];
    const label = $(el).text().trim();
    // `‹ …` / `… ›` are the previous/next pager, not editorial relations.
    if (!target || target === slug || /^[‹›]|[‹›]$/.test(label)) return;
    if (!related.includes(target)) related.push(target);
  });

  const editorial = await existingEditorialState(slug);

  return {
    frontmatter: {
      slug,
      // Everything migrated is already live. A future admin console flips this
      // to "draft" or "scheduled"; the site only renders "published".
      status: editorial.status,
      title,
      description,
      category: decode(posting.articleSection ?? "General"),
      tags: decode(posting.keywords ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      publishedAt: toIsoDate(posting.datePublished) ?? toIsoDate(dateLabel),
      updatedAt: toIsoDate(posting.dateModified) ?? toIsoDate(posting.datePublished),
      readMinutes: readLabel ? Number.parseInt(readLabel, 10) : null,
      readLabel,
      author: { name: authorName, role: authorRole, avatar: authorAvatar },
      cover: {
        url: cover,
        alt: coverAlt,
        width: coverSize ? Number(coverSize[1]) : null,
        height: coverSize ? Number(coverSize[2]) : null,
      },
      ogImage,
      sections,
      featured: editorial.featured,
      related: related.slice(0, 4),
      faq: extractFaq(body),
      source: { url: pageUrl, migratedAt: new Date().toISOString().slice(0, 10) },
    },
    body,
  };
}

/* -------------------------------------------------------------------------- */
/* yaml output                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * A tiny serialiser rather than a yaml dependency: the shape is fixed and
 * known, and hand-rolling it keeps the emitted files stable and diff-friendly.
 */
function toYaml(value, indent = 0) {
  const pad = "  ".repeat(indent);

  if (Array.isArray(value)) {
    if (!value.length) return "[]";
    return `\n${value
      .map((item) => {
        if (item !== null && typeof item === "object") {
          return `${pad}- ${toYaml(item, indent + 1).trimStart()}`;
        }
        return `${pad}- ${scalar(item)}`;
      })
      .join("\n")}`;
  }

  if (value !== null && typeof value === "object") {
    const lines = Object.entries(value)
      .filter(([, v]) => v !== undefined)
      .map(([key, v]) => {
        const rendered = toYaml(v, indent + 1);
        return rendered.startsWith("\n")
          ? `${pad}${key}:${rendered}`
          : `${pad}${key}: ${rendered}`;
      });
    return `\n${lines.join("\n")}`;
  }

  return scalar(value);
}

function scalar(value) {
  if (value === null) return "null";
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  const text = String(value);
  return /^[\w./:-]+$/.test(text) && !/^\d{4}-\d{2}-\d{2}$/.test(text)
    ? text
    : JSON.stringify(text);
}

function renderFile({ frontmatter, body }) {
  const yaml = Object.entries(frontmatter)
    .map(([key, value]) => {
      const rendered = toYaml(value, 1);
      return rendered.startsWith("\n") ? `${key}:${rendered}` : `${key}: ${rendered}`;
    })
    .join("\n");

  return `---\n${yaml}\n---\n\n${body}\n`;
}

/* -------------------------------------------------------------------------- */
/* entry point                                                                 */
/* -------------------------------------------------------------------------- */

const args = process.argv.slice(2);
const slugs = args.includes("--all") ? await listSitemapSlugs() : args;

if (!slugs.length) {
  console.error("usage: node tools/scrape.mjs <slug> [<slug> …] | --all");
  process.exit(1);
}

await mkdir(POSTS_DIR, { recursive: true });

const failures = [];

for (const [index, slug] of slugs.entries()) {
  console.log(`\n[${index + 1}/${slugs.length}] ${slug}`);
  try {
    const post = await scrapePost(slug);
    // The filename is the URL. Never normalise it — `…-best-tools-(2026)` is a
    // live, ranking path and the parentheses are part of it.
    const file = join(POSTS_DIR, `${slug}.md`);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, renderFile(post), "utf8");
    console.log(`  ✓ posts/${slug}.md (${post.frontmatter.sections.length} sections)`);
  } catch (error) {
    console.error(`  ✗ ${slug}: ${error.message}`);
    failures.push({ slug, message: error.message });
  }
}

console.log(`\n─── ${slugs.length - failures.length}/${slugs.length} migrated ───`);
if (failures.length) {
  console.error("failed:");
  for (const failure of failures) console.error(`  ${failure.slug}: ${failure.message}`);
  process.exitCode = 1;
}
