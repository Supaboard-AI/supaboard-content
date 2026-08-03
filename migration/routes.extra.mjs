/**
 * Live URLs that are not `/blog/*` posts, and so are not in the inventory,
 * but still return 200 today. The acceptance bar is that no URL currently
 * returning 200 may return a bare 404 after cutover, so each one is given a
 * destination here.
 */

/** The eight competitor pages under the /comparison system. */
export const COMPARISON_COMPETITORS = [
  ["supaboard-vs-thoughtspot", "thoughtspot"],
  ["supaboard-vs-basedash", "basedash"],
  ["supaboard-vs-qlik-business-intelligence", "qlik"],
  ["supaboard-vs-domo", "domo"],
  ["supaboard-vs-apache-superset", "apache-superset"],
  ["supaboard-vs-metabase", "metabase"],
  ["supaboard-vs-power-bi", "power-bi"],
  ["supaboard-vs-tableau", "tableau"],
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
  // /case-studies 404s today and the plural is the more natural guess. Routed
  // to the existing singular; making the plural canonical is a separate call
  // that has to be made in the app repo where the route lives.
  ["/case-studies", "/case-study"],
  ["/case-studies/:slug", "/case-study/:slug"],
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
