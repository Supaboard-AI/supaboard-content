/**
 * Phase 1 — build migration/inventory.json from posts/*.md.
 *
 * Pure read. Records what each post *is* today, before any editorial call is
 * made, so the disposition in Phase 2 can be argued against a fixed record.
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, basename } from "node:path";
import matter from "gray-matter";

const POSTS_DIR = new URL("../posts/", import.meta.url).pathname;
const OUT_DIR = new URL("../migration/", import.meta.url).pathname;
const SITE = "https://supaboard.ai";

const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md")).sort();

/** Body minus frontmatter, minus fenced code, for prose measurements. */
function proseOf(body) {
  return body.replace(/```[\s\S]*?```/g, " ");
}

function wordCount(body) {
  const text = proseOf(body)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> anchor text
    .replace(/<!--[\s\S]*?-->/g, " ") // section markers
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`~|-]/g, " ");
  const words = text.split(/\s+/).filter(Boolean);
  return words.length;
}

/** H2s only — the structural spine the editorial spec cares about. */
function headings(body, level) {
  const re = new RegExp(`^${"#".repeat(level)} +(.+?)\\s*$`, "gm");
  return [...proseOf(body).matchAll(re)].map((m) => m[1].trim());
}

/**
 * Every markdown link in the body, split by destination. Internal means it
 * lands back on supaboard.ai (absolute or root-relative); everything else is
 * outbound and is what the citation count in Phase 5 draws on.
 */
function links(body) {
  const out = [];
  const internal = [];
  const re = /\[([^\]]*)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g;
  for (const m of proseOf(body).matchAll(re)) {
    const anchor = m[1].trim();
    const url = m[2];
    const isInternal = url.startsWith("/") || url.startsWith(SITE);
    (isInternal ? internal : out).push({ anchor, url });
  }
  return { outbound: out, internalLinks: internal };
}

/** Slug a /blog/<slug> link points at, or null. */
function blogSlugOf(url) {
  const m = url.match(/^(?:https:\/\/supaboard\.ai)?\/blog\/([^/?#]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

/** Numeric claims — the raw feed for the Phase 5a statistics audit. */
function numericClaims(body) {
  const claims = [];
  const sentences = proseOf(body)
    .replace(/<!--[\s\S]*?-->/g, " ")
    .split(/(?<=[.!?])\s+|\n/);
  for (const s of sentences) {
    const t = s.trim();
    if (!t) continue;
    // A digit that carries meaning: percentage, money, multiplier, or a
    // magnitude with a unit. Bare list numbers and years alone don't count.
    if (/\d+(\.\d+)?\s?%|\$\s?\d|\d+(\.\d+)?\s?x\b|\b\d{2,}\s?(hours?|minutes?|days?|weeks?|months?|connectors?|sources?|companies|customers|users)\b/i.test(t)) {
      claims.push(t.replace(/\s+/g, " ").slice(0, 300));
    }
  }
  return claims;
}

/**
 * The query the post appears to target. Inferred, never authoritative — it is
 * a clustering signal for Phase 2, not the authored `targetQuery` of Phase 3.
 * Derived from the slug because the slug is what actually competes in search.
 */
function inferTargetQuery(slug, title) {
  const cleaned = slug
    .replace(/[()]/g, "")
    .replace(/-+/g, " ")
    .replace(/\b(in|for|a|the|an|to|of|and|s)\b/g, " ")
    .replace(/\b20\d\d\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return { inferred: cleaned, fromTitle: (title ?? "").toLowerCase().trim() };
}

const posts = [];
const inboundCount = new Map(); // slug -> [{from, anchor}]
const relatedInbound = new Map();

for (const file of files) {
  const path = join(POSTS_DIR, file);
  const raw = readFileSync(path, "utf8");
  const { data: fm, content: body } = matter(raw);
  const slug = fm.slug ?? basename(file, ".md");
  const { outbound, internalLinks } = links(body);

  posts.push({
    filePath: `posts/${file}`,
    slug,
    fileSlug: basename(file, ".md"),
    slugMatchesFilename: slug === basename(file, ".md"),
    liveUrl: `${SITE}/blog/${basename(file, ".md")}`,
    title: fm.title ?? null,
    titleLength: (fm.title ?? "").length,
    description: fm.description ?? null,
    descriptionLength: (fm.description ?? "").length,
    author: fm.author?.name ?? null,
    authorRole: fm.author?.role ?? null,
    status: fm.status ?? null,
    publishedAt: fm.publishedAt ?? null,
    updatedAt: fm.updatedAt ?? null,
    legacyCategory: fm.category ?? null,
    tags: fm.tags ?? [],
    readMinutes: fm.readMinutes ?? null,
    wordCount: wordCount(body),
    h2: headings(body, 2),
    h2Count: headings(body, 2).length,
    h3Count: headings(body, 3).length,
    outboundLinks: outbound,
    outboundCount: outbound.length,
    internalLinksInBody: internalLinks,
    internalBodyCount: internalLinks.length,
    relatedFrontmatter: fm.related ?? [],
    faqCount: Array.isArray(fm.faq) ? fm.faq.length : 0,
    numericClaims: numericClaims(body),
    numericClaimCount: numericClaims(body).length,
    frontmatterFields: Object.keys(fm).sort(),
    featured: fm.featured ?? null,
    inferredTargetQuery: inferTargetQuery(basename(file, ".md"), fm.title),
    source: fm.source ?? null,
  });

  for (const l of internalLinks) {
    const target = blogSlugOf(l.url);
    if (!target) continue;
    if (!inboundCount.has(target)) inboundCount.set(target, []);
    inboundCount.get(target).push({ from: basename(file, ".md"), anchor: l.anchor });
  }
  for (const r of fm.related ?? []) {
    if (!relatedInbound.has(r)) relatedInbound.set(r, []);
    relatedInbound.get(r).push(basename(file, ".md"));
  }
}

// Second pass: inbound links can only be known once every post has been read.
for (const p of posts) {
  p.inboundBodyLinks = inboundCount.get(p.fileSlug) ?? [];
  p.inboundBodyCount = p.inboundBodyLinks.length;
  p.inboundRelatedRail = relatedInbound.get(p.fileSlug) ?? [];
  p.inboundTotal = p.inboundBodyCount + p.inboundRelatedRail.length;
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(
  join(OUT_DIR, "inventory.json"),
  JSON.stringify(
    {
      generatedFrom: "posts/*.md",
      postCount: posts.length,
      posts,
    },
    null,
    2,
  ) + "\n",
);

console.log(`inventory.json: ${posts.length} posts`);
console.log(`orphans (zero inbound): ${posts.filter((p) => p.inboundTotal === 0).length}`);
console.log(`slug!=filename: ${posts.filter((p) => !p.slugMatchesFilename).length}`);
