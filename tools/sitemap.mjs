/**
 * Phase 4 — generate the sitemap from the content collection.
 *
 * `lastmod` comes from each post's `updatedAt`, which the schema requires and
 * the page renders visibly, so the sitemap cannot claim a freshness the page
 * contradicts. The legacy sitemap had no lastmod at all.
 *
 * Emits both a static XML (for inspection) and a Next.js `sitemap.ts` module
 * for the app repo, which is where it has to run at build time.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import matter from "gray-matter";
import { COMPARISON_COMPETITORS } from "../migration/routes.extra.mjs";

const ROOT = new URL("..", import.meta.url).pathname;
const SITE = "https://supaboard.ai";

/** Listed by the legacy sitemap but never legitimate entries. */
const NEVER_INCLUDE = ["/old-home-2", "/404"];

const posts = readdirSync(`${ROOT}posts`)
  .filter((f) => f.endsWith(".md"))
  .sort()
  .map((f) => {
    const fm = matter(readFileSync(`${ROOT}posts/${f}`, "utf8")).data;
    return {
      slug: basename(f, ".md"),
      updatedAt: fm.updatedAt ?? fm.publishedAt,
      category: fm.category,
    };
  });

const missingLastmod = posts.filter((p) => !p.updatedAt);
if (missingLastmod.length) {
  console.error("posts with no updatedAt, so no lastmod:");
  missingLastmod.forEach((p) => console.error(`  ${p.slug}`));
  process.exit(1);
}

const newest = posts.map((p) => p.updatedAt).sort().at(-1);
const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))].sort();

const entries = [
  { loc: "/", lastmod: newest },
  { loc: "/blog", lastmod: newest },
  ...categories.map((c) => ({
    loc: `/blog/${c}`,
    lastmod: posts.filter((p) => p.category === c).map((p) => p.updatedAt).sort().at(-1),
  })),
  ...posts.map((p) => ({ loc: `/blog/${p.slug}`, lastmod: p.updatedAt })),
  { loc: "/compare", lastmod: newest },
  ...COMPARISON_COMPETITORS.map(([, competitor]) => ({
    loc: `/compare/${competitor}`,
    lastmod: newest,
  })),
  { loc: "/case-study", lastmod: newest },
  ...["jindal-healthcare", "objection.ai", "gabriella.pl", "legend-ehr"].map((s) => ({
    loc: `/case-study/${s}`,
    lastmod: newest,
  })),
  { loc: "/pricing", lastmod: newest },
  { loc: "/integrations", lastmod: newest },
  { loc: "/privacy-policy", lastmod: newest },
  { loc: "/terms-and-conditions", lastmod: newest },
].filter((e) => !NEVER_INCLUDE.includes(e.loc));

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  entries
    .map((e) => `<url><loc>${SITE}${e.loc}</loc><lastmod>${e.lastmod}</lastmod></url>`)
    .join("\n") +
  `\n</urlset>\n`;

writeFileSync(`${ROOT}migration/sitemap.xml`, xml);

const tsModule = `import type { MetadataRoute } from "next";
import { allPosts } from "@/lib/content";

/**
 * Generated shape — regenerate with \`npm run sitemap\` in supaboard-content.
 *
 * lastmod is driven by each post's updatedAt, the same value rendered on the
 * page, so the sitemap cannot advertise a freshness the page contradicts.
 * /old-home-2 and /404 are excluded deliberately; the legacy sitemap listed
 * routes that were never real entries.
 */
const NEVER_INCLUDE = ${JSON.stringify(NEVER_INCLUDE)};

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = allPosts();
  const newest = posts.map((p) => p.updatedAt).sort().at(-1)!;
  const categories = [...new Set(posts.map((p) => p.category))].sort();

  return [
    { url: "/", lastModified: newest },
    { url: "/blog", lastModified: newest },
    ...categories.map((c) => ({
      url: \`/blog/\${c}\`,
      lastModified: posts.filter((p) => p.category === c).map((p) => p.updatedAt).sort().at(-1)!,
    })),
    ...posts.map((p) => ({ url: \`/blog/\${p.slug}\`, lastModified: p.updatedAt })),
    ${JSON.stringify(
      entries.filter((e) => !e.loc.startsWith("/blog")).map((e) => e.loc),
    )}.map((url) => ({ url, lastModified: newest })),
  ]
    .flat()
    .filter((e) => !NEVER_INCLUDE.includes(e.url))
    .map((e) => ({ ...e, url: \`${SITE}\${e.url}\` }));
}
`;
writeFileSync(`${ROOT}migration/sitemap.ts`, tsModule);

console.log(`sitemap: ${entries.length} entries, all with lastmod`);
console.log(`  posts ${posts.length}, categories ${categories.length}`);
console.log(`  excluded: ${NEVER_INCLUDE.join(", ")}`);
console.log(`wrote migration/sitemap.xml and migration/sitemap.ts`);
