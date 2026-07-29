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
 *  2. Prose is markdown. Framer's rich text is converted with turndown; every
 *     image it references is mirrored to Spaces so nothing points at
 *     framerusercontent.com once we cut over.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import * as cheerio from "cheerio";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

import { extractFaq } from "./faq.mjs";
import { extensionFor, uploadOnce } from "./spaces.mjs";

const ORIGIN = "https://supaboard.ai";
/** Left over from one post and never updated; see `coverAlt` below. */
const STALE_COVER_ALT = "Visual guide showing when to use tables versus charts";
const REPO_ROOT = new URL("..", import.meta.url).pathname;
const POSTS_DIR = join(REPO_ROOT, "posts");

/* -------------------------------------------------------------------------- */
/* fetching                                                                   */
/* -------------------------------------------------------------------------- */

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * A full migration is ~150 pages and several hundred assets, so a single
 * flaky response should not sink the run.
 */
async function fetchWithRetry(url, attempts = 4) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const res = await fetch(url, {
        headers: { "user-agent": "supaboard-content-migration" },
      });
      // 4xx other than 429 will not fix themselves — fail fast.
      if (!res.ok && res.status !== 429 && res.status < 500) {
        throw new Error(`GET ${url} -> ${res.status}`);
      }
      if (res.ok) return res;
      lastError = new Error(`GET ${url} -> ${res.status}`);
    } catch (error) {
      lastError = error;
      if (/-> 4\d\d$/.test(error.message)) throw error;
    }

    if (attempt < attempts) await sleep(attempt * 1000);
  }

  throw lastError;
}

async function getText(url) {
  return (await fetchWithRetry(url)).text();
}

async function listSitemapSlugs() {
  const xml = await getText(`${ORIGIN}/sitemap.xml`);
  return [...xml.matchAll(/<loc>https:\/\/supaboard\.ai\/blog\/([^<]+)<\/loc>/g)].map(
    (m) => m[1],
  );
}

/* -------------------------------------------------------------------------- */
/* images                                                                      */
/* -------------------------------------------------------------------------- */

const imageCache = new Map();

/**
 * Object keys stay in a conservative alphabet. Slugs may contain characters —
 * `(2026)` is the live one — that are legal in a URL but terminate a markdown
 * image target early.
 */
function storagePrefix(slug) {
  return `blog/${slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

/** Framer serves resized variants; we want the untouched original. */
function originalAssetUrl(src) {
  const url = new URL(src, ORIGIN);
  url.search = "";
  return url.toString();
}

async function mirrorImage(src, prefix) {
  if (!src) return null;
  const source = originalAssetUrl(src);
  if (imageCache.has(source)) return imageCache.get(source);

  const res = await fetchWithRetry(source);
  const contentType = res.headers.get("content-type") ?? "image/png";
  const buffer = Buffer.from(await res.arrayBuffer());

  const { url, skipped } = await uploadOnce(prefix, buffer, {
    ext: extensionFor(source, contentType),
    contentType,
  });
  console.log(`    ${skipped ? "cached" : "upload"} ${url}`);

  imageCache.set(source, url);
  return url;
}

/* -------------------------------------------------------------------------- */
/* html -> markdown                                                            */
/* -------------------------------------------------------------------------- */

const turndown = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  emDelimiter: "_",
  linkStyle: "inlined",
});
turndown.use(gfm);

// Framer emits `<br class="trailing-break">` as a spacer inside otherwise empty
// paragraphs. In markdown that is just noise.
turndown.addRule("dropTrailingBreak", {
  filter: (node) => node.nodeName === "BR" && node.className.includes("trailing-break"),
  replacement: () => "",
});

// A hard break inside a table cell has to stay HTML: a real newline would end
// the row and break the table.
turndown.addRule("breakInsideTableCell", {
  filter: (node) =>
    node.nodeName === "BR" && ["TD", "TH"].includes(node.parentNode?.nodeName),
  replacement: () => "<br>",
});

// Tables `markTables` flagged as inexpressible in GFM pass through as the
// cleaned HTML. Without this, turndown's own fallback would emit the original
// Framer markup — class attributes and all.
turndown.addRule("rowHeaderTable", {
  filter: (node) => node.nodeName === "TABLE" && node.getAttribute("data-raw") === "true",
  replacement: (_content, node) => {
    node.removeAttribute("data-raw");
    return `\n\n${node.outerHTML}\n\n`;
  },
});

/** `./other-post` -> `/blog/other-post`, `../pricing` -> `/pricing`. */
function normaliseHref(href, pageUrl) {
  if (!href) return href;
  if (/^(mailto:|tel:|#)/.test(href)) return href;
  let resolved;
  try {
    resolved = new URL(href, pageUrl);
  } catch {
    return href;
  }
  return resolved.origin === ORIGIN ? resolved.pathname + resolved.search + resolved.hash : resolved.toString();
}

/**
 * Turns one Framer "Content N" block into markdown, mirroring any images it
 * contains along the way.
 */
async function blockToMarkdown($, block, { pageUrl, slug }) {
  const $block = $(block);

  $block.find("a[href]").each((_, el) => {
    $(el).attr("href", normaliseHref($(el).attr("href"), pageUrl));
  });

  flattenTableCells($, $block);
  markTables($, $block, slug);

  // Framer paints images as CSS backgrounds behind an <img>; the surrounding
  // absolutely-positioned wrapper carries no meaning once we are in markdown.
  const images = $block.find("img").toArray();
  for (const img of images) {
    const $img = $(img);
    const mirrored = await mirrorImage($img.attr("src"), storagePrefix(slug));
    const alt = ($img.attr("alt") ?? "").trim();
    // Markdown has nowhere to put intrinsic dimensions, and the renderer needs
    // them to reserve space. Spaces ignores the extra query params.
    const width = $img.attr("width");
    const height = $img.attr("height");
    const src = width && height ? `${mirrored}?w=${width}&h=${height}` : mirrored;
    $img.replaceWith(`<img src="${src}" alt="${escapeAttr(alt)}">`);
  }

  // `srcset`/`sizes` would survive into the markdown as stray attributes.
  $block.find("img").removeAttr("srcset").removeAttr("sizes").removeAttr("style");

  return turndown
    .turndown($block.html() ?? "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function escapeAttr(value) {
  return value.replace(/"/g, "&quot;");
}

/**
 * Framer nests every table cell's text in its own paragraph. Left alone those
 * become block-level newlines inside a GFM row, which shreds the table — so
 * collapse each cell down to a single line of inline content first.
 */
function flattenTableCells($, $scope) {
  $scope.find("th, td").each((_, cell) => {
    const $cell = $(cell);
    const paragraphs = $cell
      .find("p")
      .toArray()
      .map((p) => ($(p).html() ?? "").trim())
      .filter(Boolean);

    const inline = (paragraphs.length ? paragraphs.join("<br>") : $cell.html() ?? "")
      .replace(/\s*\n\s*/g, " ")
      .trim();

    $cell.html(inline);
  });
}

/** Structural attributes worth keeping when a table stays as HTML. */
const TABLE_KEEP_ATTRS = new Set(["colspan", "rowspan", "scope", "href"]);

/**
 * GFM can only describe a table whose first row is entirely header cells.
 * Several posts use row headers instead — a key/value layout where each row is
 * `<th>Company</th><td>…</td>` — which has no markdown equivalent at all.
 *
 * Rather than fabricate a header row and misstate the structure, those tables
 * stay as HTML inside the markdown. They are stripped down to plain structural
 * markup first, and the `th` cells get `scope="row"` so the relationship the
 * layout implies is actually announced.
 */
function markTables($, $scope, slug) {
  $scope.find("table").each((_, table) => {
    const $table = $(table);
    const cells = $table.find("tr").first().children().toArray();
    const gfmCompatible = cells.length > 0 && cells.every((cell) => cell.tagName === "th");
    if (gfmCompatible) return;

    $table
      .find("*")
      .addBack()
      .each((_, node) => {
        for (const name of Object.keys(node.attribs ?? {})) {
          if (!TABLE_KEEP_ATTRS.has(name)) $(node).removeAttr(name);
        }
      });

    $table.find("th").attr("scope", "row");
    $table.attr("data-raw", "true");
    console.log(`    table kept as html (row headers) in ${slug}`);
  });
}

/* -------------------------------------------------------------------------- */
/* extraction                                                                  */
/* -------------------------------------------------------------------------- */

function readJsonLd($) {
  const nodes = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const parsed = JSON.parse($(el).text());
      nodes.push(...(parsed["@graph"] ?? [parsed]));
    } catch {
      // A malformed block is not worth failing the whole migration over.
    }
  });
  return nodes;
}

const decode = (value) =>
  (value ?? "")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");

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

function toIsoDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date.toISOString().slice(0, 10);
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
  const cover = await mirrorImage(coverSource, storagePrefix(slug));
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
    const markdown = await blockToMarkdown($, block, { pageUrl, slug });
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
