/**
 * Framer rich text -> markdown, plus the asset mirroring that goes with it.
 *
 * Shared by every migration in this repo: blog posts (`scrape.mjs`) and the
 * comparison pages (`comparisons.mjs`). They differ only in where the output
 * lands, so the conversion rules — all of which exist because Framer's HTML
 * has a quirk markdown cannot express — live here once.
 */
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

import { extensionFor, uploadOnce } from "./spaces.mjs";

export const ORIGIN = "https://supaboard.ai";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* -------------------------------------------------------------------------- */
/* fetching                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * A full migration is ~150 pages and several hundred assets, so a single
 * flaky response should not sink the run.
 */
export async function fetchWithRetry(url, attempts = 4) {
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

export async function getText(url) {
  return (await fetchWithRetry(url)).text();
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
export function storagePrefix(kind, slug) {
  const clean = slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${kind}/${clean}`;
}

/**
 * Largest sensible edge for a mirrored asset.
 *
 * Framer's originals go up to 5498×3791 / 5 MB, which is far past anything the
 * site renders and past what `next/image` will process — the optimizer returns
 * a 500 rather than a resized image. Framer's CDN will scale on request, so
 * take the capped variant instead of the raw file.
 */
const MAX_EDGE = 2048;

function sourceAssetUrl(src) {
  const url = new URL(src, ORIGIN);
  const width = Number(url.searchParams.get("width") ?? 0);
  const height = Number(url.searchParams.get("height") ?? 0);
  const oversized = Math.max(width, height) > MAX_EDGE;

  url.search = "";
  // Without the declared dimensions there is nothing to judge by, so the
  // original stands — those are the small ones in practice.
  if (oversized) url.searchParams.set("scale-down-to", String(MAX_EDGE));

  return url.toString();
}

export async function mirrorImage(src, prefix) {
  if (!src) return null;
  const source = sourceAssetUrl(src);
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

/** Markdown code spans are literal, so emphasis inside one is just noise. */
function insideCode(node) {
  for (let el = node.parentNode; el; el = el.parentNode) {
    if (el.nodeName === "CODE" || el.nodeName === "PRE") return true;
  }
  return false;
}

/**
 * Emphasis delimiters have to hug their content, and must not collide with a
 * literal asterisk at the edge of it.
 *
 * Framer puts `<br>` and trailing whitespace inside `<strong>`, which turndown
 * renders faithfully as `**Heading \n**Body` — and CommonMark does not read
 * that as bold at all, so the asterisks show up on the page. Separately,
 * `<strong>SELECT *</strong>` becomes `**SELECT ***`, where the third asterisk
 * is ambiguous and the run fails to parse.
 */
function emphasis(delimiter) {
  return (content, node) => {
    if (insideCode(node)) return content;

    const [, lead, inner, trail] = content.match(/^(\s*)([\s\S]*?)(\s*)$/);
    if (!inner) return content;

    const text = inner
      // A line break inside emphasis cannot survive; outside it, it can.
      .replace(/\s*\n\s*/g, " ")
      .replace(/^\*/, "\\*")
      .replace(/\*$/, "\\*");

    return `${lead}${delimiter}${text}${delimiter}${trail}`;
  };
}

turndown.addRule("strongHuggingDelimiters", {
  filter: ["strong", "b"],
  replacement: emphasis("**"),
});

turndown.addRule("emHuggingDelimiters", {
  filter: ["em", "i"],
  replacement: emphasis("_"),
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
export function normaliseHref(href, pageUrl) {
  if (!href) return href;
  if (/^(mailto:|tel:|#)/.test(href)) return href;

  let resolved;
  try {
    resolved = new URL(href, pageUrl);
  } catch {
    return href;
  }

  return resolved.origin === ORIGIN
    ? resolved.pathname + resolved.search + resolved.hash
    : resolved.toString();
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
 * Several pages use row headers instead — a key/value layout where each row is
 * `<th>Company</th><td>…</td>` — which has no markdown equivalent at all.
 *
 * Rather than fabricate a header row and misstate the structure, those tables
 * stay as HTML. They are stripped down to plain structural markup first, and
 * the `th` cells get `scope="row"` so the relationship the layout implies is
 * actually announced.
 */
function markTables($, $scope, label) {
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
    console.log(`    table kept as html (row headers) in ${label}`);
  });
}

/**
 * Turns one Framer rich-text block into markdown, mirroring any images it
 * contains along the way.
 */
export async function blockToMarkdown($, block, { pageUrl, label, prefix }) {
  const $block = $(block);

  $block.find("a[href]").each((_, el) => {
    $(el).attr("href", normaliseHref($(el).attr("href"), pageUrl));
  });

  flattenTableCells($, $block);
  markTables($, $block, label);

  // Framer paints images as CSS backgrounds behind an <img>; the surrounding
  // absolutely-positioned wrapper carries no meaning once we are in markdown.
  const images = $block.find("img").toArray();
  for (const img of images) {
    const $img = $(img);
    const mirrored = await mirrorImage($img.attr("src"), prefix);
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

/* -------------------------------------------------------------------------- */
/* small shared helpers                                                        */
/* -------------------------------------------------------------------------- */

export const decode = (value) =>
  (value ?? "")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");

export function toIsoDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date.toISOString().slice(0, 10);
}

/** Every JSON-LD entity on a page, flattened out of any `@graph` wrappers. */
export function readJsonLd($) {
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
