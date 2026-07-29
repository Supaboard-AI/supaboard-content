/**
 * Migrates the /comparison pages into hardcoded TypeScript in the site repo.
 *
 *   node tools/comparisons.mjs [--out <dir>]
 *
 * Unlike blog posts these are low-churn, engineer-edited pages, so they live in
 * `src/content/` as typed data rather than in this repo as markdown — the split
 * `docs/ARCHITECTURE.md` already draws. The body still travels as a markdown
 * string, because the site renders it with exactly the same pipeline as a post.
 *
 * URLs are taken from the live sitemap verbatim and become the filenames, so
 * `/comparison/<slug>` is preserved to the character.
 *
 * Framer ships no Article markup at all on these pages — only Organization and
 * WebSite — so everything a rich result needs (author, dates, section, cover,
 * FAQ) is extracted here and emitted as typed fields for the page to mark up.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import * as cheerio from "cheerio";

import {
  AVATAR_EDGE,
  ORIGIN,
  blockToMarkdown,
  decode,
  getText,
  mirrorImage,
  storagePrefix,
  toIsoDate,
} from "./convert.mjs";
import { extractFaq } from "./faq.mjs";

const outFlag = process.argv.indexOf("--out");
const OUT_DIR =
  outFlag !== -1
    ? process.argv[outFlag + 1]
    : new URL("../../supa-landing/src/content/comparisons/", import.meta.url).pathname;

/* -------------------------------------------------------------------------- */
/* discovery                                                                   */
/* -------------------------------------------------------------------------- */

async function listSlugs() {
  const xml = await getText(`${ORIGIN}/sitemap.xml`);
  return [
    ...xml.matchAll(/<loc>https:\/\/supaboard\.ai\/comparison\/([^<]+)<\/loc>/g),
  ].map((m) => m[1]);
}

/** The order the live index lists them in, so the ported grid matches. */
async function indexOrder() {
  const $ = cheerio.load(await getText(`${ORIGIN}/comparison`));
  const seen = [];

  $('a[href^="./"]').each((_, el) => {
    const slug = ($(el).attr("href") ?? "")
      .replace(/^\.\/(comparison\/)?/, "")
      .split("#")[0];
    if (slug && !slug.includes("/") && !seen.includes(slug)) seen.push(slug);
  });

  return seen;
}

/* -------------------------------------------------------------------------- */
/* extraction                                                                  */
/* -------------------------------------------------------------------------- */

/** `supaboard-vs-power-bi` -> `Power BI`, matching the page's own wording. */
function competitorFrom(title, slug) {
  if (!slug.startsWith("supaboard-vs-")) return null;
  const match = title.match(/^Supaboard\s+vs\.?\s+([^:?]+)/i);
  return match ? match[1].trim() : null;
}

async function scrapeComparison(slug) {
  const pageUrl = `${ORIGIN}/comparison/${slug}`;
  console.log(`\n▸ ${slug}`);

  const $ = cheerio.load(await getText(pageUrl));
  const title = decode($("h1").first().text().trim());
  const description = decode($('meta[name="description"]').attr("content") ?? "");

  /* ---- byline ---------------------------------------------------------- */
  const authorName = decode(
    $('div[data-framer-name="Author"]').first().find("p").first().text().trim(),
  );
  const authorRole = decode(
    $('div[data-framer-name="Author"]')
      .first()
      .find("p")
      .filter((_, el) => /writer|founder|cto|editor/i.test($(el).text()))
      .first()
      .text()
      .trim(),
  );
  const authorAvatar = await mirrorImage(
    $('div[data-framer-name="Profile Image"]').first().find("img").attr("src"),
    "comparison/authors",
    { maxEdge: AVATAR_EDGE },
  );

  /* ---- pills ----------------------------------------------------------- */
  // The byline carries exactly three pills — series, date, read time — as
  // `Text Container` boxes. Framer emits each three times for its breakpoint
  // variants, so read the first paragraph inside rather than the text content.
  // Classifying by pattern rather than position keeps this working if the
  // series pill is ever dropped from a page.
  const pills = $('div[data-border="true"][data-framer-name="Text Container"]')
    .toArray()
    .map((el) => decode($(el).find("p").first().text().trim()))
    .filter(Boolean);

  const dateLabel = pills.find((text) => /^[A-Z][a-z]{2} \d{1,2}, \d{4}$/.test(text)) ?? null;
  const readLabel = pills.find((text) => /^\d+\s*(mins?|min read)$/i.test(text)) ?? null;
  const series =
    pills.find((text) => text !== dateLabel && text !== readLabel) ?? null;

  /* ---- body ------------------------------------------------------------ */
  const selector =
    'div[data-framer-name="Content"][data-framer-component-type="RichTextContainer"]';
  const block = $(selector).first();
  if (!block.length) throw new Error("no rich-text body found");

  const prefix = storagePrefix("comparison", slug);
  const body = await blockToMarkdown($, block, { pageUrl, label: slug, prefix });

  /* ---- cover ----------------------------------------------------------- */
  // Framer names the hero container "Banner". Picking by position or size
  // instead grabs whichever large image the page happens to preload first,
  // which is not always this page's own artwork.
  const coverSrc =
    $('div[data-framer-name="Banner"]').first().find("img").first().attr("src") ?? "";
  if (!coverSrc) throw new Error("no banner image found");
  const size = coverSrc.match(/width=(\d+)&(?:amp;)?height=(\d+)/);
  const cover = await mirrorImage(coverSrc, prefix, {
    width: size?.[1],
    height: size?.[2],
  });

  return {
    slug,
    title,
    description,
    series,
    competitor: competitorFrom(title, slug),
    author: { name: authorName, role: authorRole, avatar: authorAvatar },
    publishedAt: toIsoDate(dateLabel),
    readLabel,
    readMinutes: readLabel ? Number.parseInt(readLabel, 10) : null,
    cover: {
      url: cover,
      // Framer reuses one stale alt across these covers; the title is both
      // accurate and better for the image search it currently forfeits.
      alt: title,
      width: size ? Number(size[1]) : null,
      height: size ? Number(size[2]) : null,
    },
    faq: extractFaq(body),
    body,
  };
}

/* -------------------------------------------------------------------------- */
/* typescript output                                                           */
/* -------------------------------------------------------------------------- */

const str = (value) => (value === null || value === undefined ? "null" : JSON.stringify(value));

/** A template literal, with the two sequences that could break out escaped. */
function templateLiteral(value) {
  const escaped = value
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
  return `\`${escaped}\``;
}

function renderModule(entry) {
  const faq = entry.faq.length
    ? `[\n${entry.faq
        .map(
          (f) =>
            `    { question: ${str(f.question)}, answer: ${str(f.answer)} },`,
        )
        .join("\n")}\n  ]`
    : "[]";

  return `import type { Comparison } from "../comparisons";

/**
 * Migrated from ${ORIGIN}/comparison/${entry.slug}.
 * Regenerate with \`node tools/comparisons.mjs\` in the supaboard-content repo.
 */
export const comparison: Comparison = {
  slug: ${str(entry.slug)},
  title: ${str(entry.title)},
  description: ${str(entry.description)},
  series: ${str(entry.series)},
  competitor: ${str(entry.competitor)},
  author: {
    name: ${str(entry.author.name)},
    role: ${str(entry.author.role)},
    avatar: ${str(entry.author.avatar)},
  },
  publishedAt: ${str(entry.publishedAt)},
  readLabel: ${str(entry.readLabel)},
  readMinutes: ${entry.readMinutes ?? "null"},
  cover: {
    url: ${str(entry.cover.url)},
    alt: ${str(entry.cover.alt)},
    width: ${entry.cover.width ?? "null"},
    height: ${entry.cover.height ?? "null"},
  },
  faq: ${faq},
  body: ${templateLiteral(entry.body)},
};
`;
}

/** `supaboard-vs-power-bi` -> `supaboardVsPowerBi`, a valid identifier. */
function identifier(slug) {
  const camel = slug
    .replace(/[^a-zA-Z0-9]+(.)?/g, (_, chr) => (chr ? chr.toUpperCase() : ""))
    .replace(/^(\d)/, "_$1");
  return camel.charAt(0).toLowerCase() + camel.slice(1);
}

function renderIndex(entries) {
  const imports = entries
    .map((e) => `import { comparison as ${identifier(e.slug)} } from "./comparisons/${e.slug}";`)
    .join("\n");

  const list = entries.map((e) => `  ${identifier(e.slug)},`).join("\n");

  return `${imports}

/**
 * Head-to-head comparisons and the surrounding editorial series, ported from
 * the Framer build. Low churn and engineer-edited, so these are typed data in
 * the repo rather than markdown in the content repo — see docs/ARCHITECTURE.md.
 *
 * The body is markdown and renders through the same pipeline as a blog post.
 * Regenerate with \`node tools/comparisons.mjs\` in the supaboard-content repo;
 * everything here is derived from the live pages.
 */

export type ComparisonFaq = {
  question: string;
  answer: string;
};

export type Comparison = {
  /** Equals the filename, and the URL: /comparison/<slug>. */
  slug: string;
  title: string;
  description: string;
  /** Editorial series shown as the first byline pill, e.g. "The BI Comparison Series". */
  series: string | null;
  /** The tool being compared against, or null for the essay-style entries. */
  competitor: string | null;
  author: { name: string; role: string; avatar: string | null };
  publishedAt: string;
  /** Rendered verbatim in the byline — the live pages mix "5 min"/"6 Min Read". */
  readLabel: string | null;
  readMinutes: number | null;
  cover: { url: string; alt: string; width: number | null; height: number | null };
  /** Parsed out of the body prose; becomes FAQPage JSON-LD. */
  faq: ComparisonFaq[];
  /** Markdown, rendered with the same components as a blog post. */
  body: string;
};

/** Index order, matching the live /comparison grid. */
export const comparisons: Comparison[] = [
${list}
];

export function getComparison(slug: string): Comparison | undefined {
  return comparisons.find((entry) => entry.slug === slug);
}
`;
}

/* -------------------------------------------------------------------------- */
/* entry point                                                                 */
/* -------------------------------------------------------------------------- */

const slugs = await listSlugs();
const order = await indexOrder();

// Anything the index lists comes first, in its order; the rest keep sitemap order.
const ordered = [
  ...order.filter((slug) => slugs.includes(slug)),
  ...slugs.filter((slug) => !order.includes(slug)),
];

console.log(`${slugs.length} comparison URL(s); ${order.length} listed on the index`);

await mkdir(OUT_DIR, { recursive: true });

const entries = [];
const failures = [];

for (const [index, slug] of ordered.entries()) {
  console.log(`\n[${index + 1}/${ordered.length}]`);
  try {
    const entry = await scrapeComparison(slug);
    await writeFile(join(OUT_DIR, `${slug}.ts`), renderModule(entry), "utf8");
    entries.push(entry);
    console.log(`  ✓ ${slug}.ts (${entry.body.length} chars, ${entry.faq.length} FAQ)`);
  } catch (error) {
    console.error(`  ✗ ${slug}: ${error.message}`);
    failures.push(slug);
  }
}

await writeFile(join(OUT_DIR, "..", "comparisons.ts"), renderIndex(entries), "utf8");

console.log(`\n─── ${entries.length}/${ordered.length} migrated ───`);
if (failures.length) {
  console.error("failed:", failures.join(", "));
  process.exitCode = 1;
}
