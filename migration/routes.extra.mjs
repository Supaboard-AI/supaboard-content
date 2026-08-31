/**
 * Live URLs that are not `/blog/*` posts, and so are not in the inventory,
 * but still return 200 today. The acceptance bar is that no URL currently
 * returning 200 may return a bare 404 after cutover, so each one is given a
 * destination here.
 */

/**
 * The eight competitor pages under the /comparison system.
 *
 * Five of the eight used to point at a /compare/<vendor> page that has since
 * been retired. They go straight to the hub instead: a 301 into a 301 loses
 * PageRank at every hop, and the generator refuses to emit one anyway.
 *
 * `""` means the hub. Only the four surviving head-to-heads name a vendor.
 */
export const COMPARISON_COMPETITORS = [
  ["supaboard-vs-thoughtspot", "thoughtspot"],
  ["supaboard-vs-metabase", "metabase"],
  ["supaboard-vs-power-bi", "power-bi"],
  ["supaboard-vs-basedash", ""],
  ["supaboard-vs-qlik-business-intelligence", ""],
  ["supaboard-vs-domo", ""],
  ["supaboard-vs-apache-superset", ""],
  ["supaboard-vs-tableau", ""],
];

/**
 * The ten /compare/<vendor> pages retired in the August 2026 consolidation.
 *
 * Each was one of two things: a page whose competitor column was entirely "not
 * verified" because the vendor blocks automated access, or a head-to-head
 * nobody searches for — "Supaboard vs X" has near-zero volume when the reader
 * has not heard of Supaboard. The demand is in "X alternatives", which the blog
 * already targets, so keeping both was cannibalisation as well as thin content.
 *
 * The hub keeps all fourteen in its matrix. These are URLs, not rows.
 */
export const RETIRED_COMPARISONS = [
  "tableau",
  "domo",
  "oracle-analytics",
  "sas-viya",
  "alteryx",
  "apache-superset",
  "basedash",
  "amazon-quicksight",
  "qlik",
  "sisense",
];

/**
 * Nine marketing articles that were filed under /comparison despite not
 * comparing anything. They are on-topic, so each 301s to the surviving post
 * that actually answers it rather than to the hub — a redirect to a hub is
 * the soft-404 signal the brief is trying to avoid.
 */
export const COMPARISON_ARTICLES = [
  ["sustaining-success-advanced-ai-data-management-tips", "/blog/data-connectivity"],
  ["turning-insights-into-impact-actionable-recommendations", "/blog/bi-dashboards"],
  ["ai-powered-business-dashboards-transforming-data-into-visual-stories", "/blog/bi-dashboards"],
  ["conversational-ai-for-business-simplifying-data-insights-with-natural-language-queries",
   "/blog/natural-language-query-analytics"],
  ["escape-the-data-trap-how-ai-data-automation-unifies-your-business", "/blog/data-connectivity"],
  ["why-waiting-for-data-is-costing-your-business-money", "/blog/analytics-without-a-data-team"],
  ["decision-making-dashboards-why-managers-need-a-data-cockpit", "/blog/bi-dashboards"],
  ["from-spreadsheet-hell-to-dashboard-heaven-boost-business-accuracy-and-speed",
   "/blog/analytics-without-a-data-team"],
  ["the-death-of-the-data-request-ticket-how-self-service-bi-empowers-faster-decisions",
   "/blog/self-service-bi"],
];

/** One-off route corrections named in the brief. */
export const NAMED_REDIRECTS = [
  // The retired head-to-heads, and the bare /comparison hub — which is live and
  // taking traffic at a 100% bounce rate against a route that no longer exists.
  ...RETIRED_COMPARISONS.map((slug) => [`/compare/${slug}`, "/compare"]),
  ["/comparison", "/compare"],

  // /case-studies 404s today and the plural is the more natural guess. Routed
  // to the existing singular; making the plural canonical is a separate call
  // that has to be made in the app repo where the route lives.
  ["/case-studies", "/case-study"],
  ["/case-studies/:slug", "/case-study/:slug"],

  // Parenthesised slugs that Phase 1 checked and cleared as "paren-free"
  // (PHASE-1-INVENTORY.md rows 45-46). The conclusion was drawn from the
  // sitemap, which lists the paren-free spelling — but Google indexed the
  // parenthesised one and still sends traffic to it. Both 404 today; the
  // top-10 URL shows up in analytics with a 100% bounce rate for that reason.
  // Same destinations as their paren-free twins.
  ["/blog/top-10-(business-intelligence)-bi-tools-in-2026-an-overview",
   "/blog/best-ai-bi-tools"],
  ["/blog/is-ai-bi-just-text-to-sql-the-honest-difference-(with-examples)",
   "/blog/is-ai-bi-just-text-to-sql"],
];

/**
 * URLs that must return 410 rather than redirect.
 *
 * /comparison/:qOhqaUNS9 is not a real page and never was: qOhqaUNS9 is a
 * Framer CMS field identifier on collection OXaKOnIE_ that leaked into a
 * detail-page route pattern. It has no content and no equity, so it is gone,
 * not moved. There is no source file in this repo or the app repo to fix —
 * the defect lives in the Framer project, and disappears at cutover.
 */
export const EXTRA_410 = ["/comparison/:qOhqaUNS9"];
