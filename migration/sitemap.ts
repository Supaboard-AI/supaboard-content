import type { MetadataRoute } from "next";
import { allPosts } from "@/lib/content";

/**
 * Generated shape — regenerate with `npm run sitemap` in supaboard-content.
 *
 * lastmod is driven by each post's updatedAt, the same value rendered on the
 * page, so the sitemap cannot advertise a freshness the page contradicts.
 * /old-home-2 and /404 are excluded deliberately; the legacy sitemap listed
 * routes that were never real entries.
 */
const NEVER_INCLUDE = ["/old-home-2","/404"];

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = allPosts();
  const newest = posts.map((p) => p.updatedAt).sort().at(-1)!;
  const categories = [...new Set(posts.map((p) => p.category))].sort();

  return [
    { url: "/", lastModified: newest },
    { url: "/blog", lastModified: newest },
    ...categories.map((c) => ({
      url: `/blog/${c}`,
      lastModified: posts.filter((p) => p.category === c).map((p) => p.updatedAt).sort().at(-1)!,
    })),
    ...posts.map((p) => ({ url: `/blog/${p.slug}`, lastModified: p.updatedAt })),
    ["/","/compare","/compare/thoughtspot","/compare/basedash","/compare/qlik","/compare/domo","/compare/apache-superset","/compare/metabase","/compare/power-bi","/compare/tableau","/case-study","/case-study/jindal-healthcare","/case-study/objection.ai","/case-study/gabriella.pl","/case-study/legend-ehr","/pricing","/integrations","/privacy-policy","/terms-and-conditions"].map((url) => ({ url, lastModified: newest })),
  ]
    .flat()
    .filter((e) => !NEVER_INCLUDE.includes(e.url))
    .map((e) => ({ ...e, url: `https://supaboard.ai${e.url}` }));
}
