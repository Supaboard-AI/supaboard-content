/**
 * Phase 2 — the editorial call on every one of the 145 migrated posts.
 *
 * This file is the argument; `migration/disposition.csv` is its output. It is
 * kept as source rather than hand-edited CSV so a reviewer can object to one
 * line, change it here, and regenerate the whole map deterministically.
 *
 * Three buckets, and the difference between two of them matters:
 *
 *   KILL  — delete the file, return 410 Gone. Reserved for content that
 *           actively damages topical authority or E-E-A-T. A 410 throws away
 *           whatever link equity the URL had, which is the point: we do not
 *           want Google to keep associating this domain with the topic.
 *   MERGE — delete the file, 301 to a canonical. For content that is thin,
 *           duplicated or cannibalising but *on topic*. The equity is worth
 *           keeping, so it is redirected rather than discarded.
 *   KEEP  — survives, brought up to the Phase 3 schema.
 *
 * Thin-but-on-topic is deliberately MERGE, never KILL. A 559-word promo post
 * cannot meet the editorial spec, but 410ing it would discard real inbound
 * links for no authority gain.
 */

/** Delete + 410. Each entry states what makes it a liability, not just weak. */
export const KILL = [
  // --- Named in the brief ---
  ["top-white-label-ride-hailing-platform-providers",
   "Off-topic ride-hailing content carrying outbound links to app-clone farms (Uberclone.co, Appdupe, Elluminati). For a vendor selling trustworthy analytics this is an active E-E-A-T liability. Highest priority."],
  ["quantum-computing-in-2025-hype-vs-reality",
   "Quantum computing has no relationship to BI, analytics or the product. Dilutes topical authority."],
  ["quantum-computing-playbook-how-it-works-and-why-it-matters-now",
   "Second of three quantum posts. Off-topic."],
  ["what-is-quantum-computing-a-beginner-s-guide-to-the-future-of-tech",
   "Third of three quantum posts. Off-topic."],
  ["cloud-wars-2025-shocking-new-moves-from-aws-azure-google-cloud",
   "Cloud-vendor horse-race commentary. Off-topic, and dated within months of publication."],
  ["the-end-of-traditional-coding-low-code-s-takeover-in-2025",
   "Low-code/no-code development trends. Off-topic."],
  ["learning-and-development-trends",
   "Corporate L&D. No relationship to data, analytics, BI or the company."],
  ["tms-software-guide",
   "Transport management software. Off-topic; competes for queries the company has no business owning."],
  ["is-it-analyzing-or-analysing",
   "English spelling question. Draws traffic with zero commercial or topical relevance."],
  ["ai-tools-for-business-that-actually-work",
   "General AI-tool listicle spanning content and automation. Not a data or BI post despite its length."],
  ["top-ai-tools-to-boost-your-productivity-in-2026",
   "AI productivity listicle covering writing, meetings and research. Unrelated to data or BI."],
  ["building-a-7-figure-startup-in-2025-7-ai-tools-you-can-t-ignore",
   "AI-tools-for-startups listicle covering marketing and operations. Unrelated to data or BI."],
  ["the-ai-advantage-7-tools-powering-the-fastest-growing-startups-in-2026",
   "AI-tools-for-startups listicle covering content, design and video. Unrelated to data or BI."],
  ["supaboard-ai-3",
   "Product Hunt launch recap presented as a third-party review — an E-E-A-T problem, and the slug is meaningless. Content belongs on a /changelog route, not the blog."],

  // --- Added under the brief's instruction to search for the same pattern ---
  ["server-based-computing-guide",
   "ADDED: server/thin-client IT infrastructure. Nothing to do with data, analytics, BI or the company."],
  ["ai-in-the-workplace-how-ai-is-transforming-jobs-teams-leadership-in-2026",
   "ADDED: workplace and leadership commentary. HR territory, not analytics."],
  ["ai-native-apps-the-future-every-startup-must-prepare-for-in-2025",
   "ADDED: startup product-architecture advice. Off-topic."],
  ["the-hidden-costs-of-adding-ai-to-your-saas-product",
   "ADDED: SaaS product economics for teams shipping AI features. Wrong audience entirely."],
  ["revenge-of-the-backend-why-infrastructure-matters-more-in-the-age-of-ai",
   "ADDED: AI infrastructure and networking commentary. Off-topic."],
  ["the-rise-of-ai-coworkers-designing-interfaces-for-human-ai-collaboration",
   "ADDED: interface-design essay. A Supaboard mention does not make it a data post."],
  ["build-vs-buy-in-the-age-of-ai-how-ctos-are-making-platform-decisions-in-2025",
   "ADDED: generic platform build-vs-buy advice, not scoped to analytics."],
  ["beyond-chatbots-real-use-cases-of-llms-in-enterprise-software",
   "ADDED: enterprise LLM use cases across support and ops. Not a BI post."],
  ["looking-ahead-how-ai-is-changing-business-understanding",
   "ADDED: 653 words of unfalsifiable AI-and-business filler with no target query of its own and zero inbound links."],
  ["bringing-ai-in-business-data-analysis",
   "ADDED: 861-word 2024 post superseded on every point by the author's own 2026 work. Keeping it weakens a byline that is otherwise the strongest on the site."],
];

/**
 * Consolidation clusters. `canonical` is the surviving slug; `members` are
 * deleted and 301'd into it. `canonicalFrom` names the file the canonical is
 * built on when the surviving slug is a rename.
 */
export const CLUSTERS = [
  {
    id: "bi-tool-listicles",
    canonical: "best-ai-bi-tools",
    canonicalFrom: "best-ai-bi-tools",
    reason: "Six listicles competing for one commercial query.",
    members: [
      "best-business-intelligence-tools",
      "best-ai-powered-business-intelligence",
      "bi-tools",
      "top-10-business-intelligence-bi-tools-in-2026-an-overview",
      "best-data-analytics-tools-for-business",
      "top-self-service-bi-tools-for-2025",
      "top-ai-analytics-tools-transforming-data-analysis-in-2025-2026",
      // A three-way vs post, so /compare/[competitor] would discard two thirds
      // of its subject. The merged listicle is the closest equivalent page.
      "supaboard-vs-tableau-power-bi-metabase-(2025)-best-bi-tool-for-fast-business-insights",
    ],
  },
  {
    id: "metabase",
    canonical: "metabase-alternatives",
    canonicalFrom: "metabase-alternatives",
    reason: "Five posts on Metabase alternatives, including one 90-character stop-word-padded slug.",
    members: [
      "top-5-metabase-alternatives-for-seamless-embedded-analytics-in-2025",
      "the-best-metabase-alternative-a-smarter-bi-option-to-supercharge-supaboard-dashboards",
      "why-consider-a-metabase-alternative-exploring-the-best-bi-tools-compared",
      "supaboard-vs-metabase-in-2025-which-bi-tool-is-best-for-your-team",
    ],
  },
  {
    id: "power-bi-tableau",
    canonical: "power-bi-vs-tableau",
    canonicalFrom: "power-bi-vs-tableau",
    reason: "The same comparison under both orderings. The kept slug has 18 inbound links to the other's 2.",
    members: ["tableau-vs-power-bi"],
  },
  {
    id: "bar-graph-histogram",
    canonical: "bar-graph-vs-histogram",
    canonicalFrom: "bar-graph-vs-histogram",
    reason: "Identical down to the example numbers (45% electronics, $450K revenue, 60% of orders under $50).",
    members: ["histogram-vs-bar-graph"],
  },
  {
    id: "ad-hoc-query",
    canonical: "what-is-an-ad-hoc-query",
    canonicalFrom: "what-is-an-ad-hoc-query",
    reason: "The shorter post links to the longer one with the anchor 'ad hoc queries', conceding the ranking itself. Also absorbs the two adjacent query posts.",
    members: [
      "ad-hoc-query",
      "how-to-reduce-ad-hoc-data-requests-to-the-analytics-team-a-practical-guide",
      "data-querying",
    ],
  },
  {
    id: "spend-analytics",
    canonical: "spend-analytics",
    canonicalFrom: "spend-analytics",
    reason: "Published the same day with the same 4-step + 8-use-case structure.",
    members: ["spend-analytics-guide"],
  },
  {
    id: "semantic-layer",
    canonical: "what-is-a-semantic-layer",
    canonicalFrom: "what-is-a-semantic-layer-the-2026-field-guide",
    reason: "The 6,640-word field guide absorbs the 1,102-word data-model post. Also fixes the equity inversion: the thin post holds 38 inbound links to the guide's 16.",
    members: ["what-is-a-semantic-data-model"],
  },
  {
    id: "financial-dashboards",
    canonical: "financial-dashboard-examples",
    canonicalFrom: "financial-dashboard-examples",
    reason: "Stronger of the two by length and structure (2,678w vs 1,758w); also absorbs the finance-performance post covering the same metrics.",
    members: ["financial-dashboards-guide", "finance-and-performance"],
  },
  {
    id: "competitor-comparisons",
    canonical: "__COMPARE_ROUTE__",
    canonicalFrom: null,
    reason: "Comparison content runs as two parallel systems (12 /blog/supaboard-vs-X posts and 8 /comparison/supaboard-vs-X pages). Consolidating on /compare/[competitor] as a first-class route; these blog posts 301 there.",
    members: [
      "supaboard-vs-alteryx-a-new-business-intelligence-chapter",
      "supaboard-vs-amazon-quicksight-the-new-bi-battle",
      "supaboard-vs-domo-smarter-business-intelligence-redefined-for-today-s-times",
      "supaboard-vs-looker-a-smarter-choice-for-the-future-of-data-intelligence",
      "supaboard-vs-oracle-analytics-new-age-vs-enterprise-legacy-in-an-era-of-war",
      "supaboard-vs-power-bi-a-2025-modern-business-intelligence-showdown",
      "supaboard-vs-sas-viya-the-future-of-data-analytics-name-has-come",
      "supaboard-vs-sisense-the-smarter-business-intelligence-war",
      "supaboard-vs-tableau-the-easier-road-to-smarter-analytics",
      "supaboard-vs-thoughtspot-rethinking-smart-insights-for-today-s-business-enterprise",
    ],
  },
  {
    id: "self-service-bi",
    canonical: "self-service-bi",
    canonicalFrom: "self-service-bi-vs-traditional-business-intelligence",
    reason: "Three overlapping self-service BI explainers; the kept one has 20 inbound links.",
    members: [
      "self-service-bi-explained",
      "self-service-analytics-empowering-business-with-easy-data-exploration-and-trusted-insights",
    ],
  },
  {
    id: "real-time-analytics",
    canonical: "real-time-analytics",
    canonicalFrom: "real-time-analytics-platform",
    reason: "Three real-time posts plus the operationally identical business-activity-monitoring guide.",
    members: [
      "what-is-real-time-analytics-definition-benefits-examples",
      "real-time-profitability-tracking-why-it-matters-more-than-ever",
      "business-activity-monitoring",
    ],
  },
  {
    id: "analytics-types",
    canonical: "types-of-analytics",
    canonicalFrom: "types-of-analytics",
    reason: "Descriptive, predictive and the vs-comparison all restate the same four-type taxonomy.",
    members: [
      "descriptive-analytics-guide",
      "predictive-analytics-vs-descriptive-analytics-what-you-need-to-know",
    ],
  },
  {
    id: "natural-language-query",
    canonical: "natural-language-query-analytics",
    canonicalFrom: "natural-language-query-analytics",
    reason: "Six posts on asking data questions in English. The canonical carries 42 inbound links, the most on the site.",
    members: [
      "how-ai-query-assistants-are-redefining-data-analytics-in-2025",
      "how-can-ai-chatbots-help-you-analyze-company-data-faster",
      "gpt-snowflake-conversational-analytics",
      "unlocking-cross-database-analysis-without-sql-a-complete-guide",
      "revolutionizing-communication-the-rise-of-conversational-ai-and-nlp-interfaces",
    ],
  },
  {
    id: "data-engineering",
    canonical: "data-engineering",
    canonicalFrom: "future-of-data-engineering",
    reason: "Three data-engineering posts; the future-facing one is the longest and becomes the canonical under the year-free slug.",
    members: ["data-engineering", "will-we-still-need-data-engineers-in-2026"],
  },
  {
    id: "ai-replacing-analysts",
    canonical: "will-ai-replace-data-analysts",
    canonicalFrom: "will-data-analysts-be-replaced-by-ai-the-truth-behind-the-fear",
    reason: "Four posts asking whether AI replaces analysts, dashboards or reporting. One question, one answer.",
    members: [
      "how-generative-ai-is-changing-the-role-of-the-data-analyst",
      "will-ai-automate-bi-reporting-in-2026",
      "can-ai-replace-the-data-dashboard-new-approaches-to-business-intelligence",
    ],
  },
  {
    id: "bi-dashboards",
    canonical: "bi-dashboards",
    canonicalFrom: "bi-dashboard-guide",
    reason: "Four general dashboard explainers competing for the same head term.",
    members: [
      "ai-dashboard-explained",
      "what-is-a-decision-making-dashboard-importance-benefits-and-how-to-build-one",
      "5-ways-saas-startups-use-no-code-dashboards-to-win-investors",
    ],
  },
  {
    id: "ecommerce-analytics",
    canonical: "ecommerce-analytics",
    canonicalFrom: "the-modern-ecommerce-dashboard-insights-you-can-act-on",
    reason: "Four thin e-commerce analytics posts, three of them under 850 words.",
    members: [
      "how-e-commerce-businesses-can-use-analytics-to-improve-customer-experience",
      "how-to-use-marketing-insights-to-boost-your-ecommerce-sales",
      "ai-agents-in-ecommerce-automate-campaign-analysis-budgeting-insights",
    ],
  },
  {
    id: "retail-analytics",
    canonical: "retail-business-intelligence",
    canonicalFrom: "all-about-retail-business-intelligence",
    reason: "Retail BI and retail KPIs are one buyer question.",
    members: ["retail-metrics-kpis-store-performance"],
  },
  {
    id: "ai-governance",
    canonical: "ai-analytics-governance",
    canonicalFrom: "ai-contextual-governance-framework",
    reason: "Five posts on trusting AI output — governance, ethics, explainability and human-in-the-loop. This is the trustworthy-ai pillar and should be one authoritative page.",
    members: [
      "ai-transformation-problem-of-governance",
      "the-ethics-of-generative-bi-when-insights-are-fabricated",
      "explainable-ai-xai-in-analytics-building-trust-in-business-intelligence",
      "human-in-the-loop-ai",
    ],
  },
  {
    id: "data-connectivity",
    canonical: "data-connectivity",
    canonicalFrom: "data-connectivity",
    reason: "Connectivity, integration-vs-integration and warehouse-to-LLM plumbing are the same subject.",
    members: [
      "application-integration-vs-data-integration",
      "bridging-data-warehousing-and-ai-from-snowflake-to-gpt",
    ],
  },
  {
    id: "no-data-team",
    canonical: "analytics-without-a-data-team",
    canonicalFrom: "how-supaboard-democratizes-data-analytics-no-more-tech-team-dependence",
    reason: "Eight thin promotional posts (536–1,406 words) all arguing that non-technical teams can self-serve. Merged into the no-data-team pillar rather than killed, because the subject is on-topic and the URLs carry links.",
    members: [
      "unlock-the-power-of-data-meet-supaboard",
      "unlocking-faster-decisions-ai-powered-bi-supaboard",
      "why-more-data-isn-t-always-better-how-simple-workspaces-bring-real-clarity",
      "unlocking-business-success-with-ai-data-analytics",
      "revolutionizing-small-business-analytics-how-ai-tools-save-time-simplify-data-and-drive-growth",
      "manual-reporting-data-teams",
      "how-do-we-create-a-single-source-of-truth-for-our-business-data",
    ],
  },
  {
    id: "generative-bi",
    canonical: "generative-business-intelligence",
    canonicalFrom: "generative-business-intelligence-guide",
    reason: "Generative BI, the generative AI primer and the data-storytelling post overlap almost entirely.",
    members: [
      "generative-ai-guide",
      "ai-meets-data-viz-how-generative-ai-tools-are-transforming-data-storytelling",
    ],
  },
  {
    id: "agentic-analytics",
    canonical: "agentic-analytics",
    canonicalFrom: "agentic-analytics-vs-traditional-bi-tools",
    reason: "Agentic and AI-native BI are the same category argument under two names.",
    members: ["ai-native-business-intelligence-tools"],
  },
  {
    id: "ai-data-analyst",
    canonical: "ai-data-analyst",
    canonicalFrom: "ai-data-analyst-how-it-works-and-best-tools-(2026)",
    reason: "Drops the parenthesised year from a CTO-authored keeper and absorbs the AutoML post covering the same automate-what question.",
    members: ["automl-for-analysts-what-you-can-automate-and-what-you-can-t"],
  },
  {
    id: "embedded-analytics",
    canonical: "embedded-analytics",
    canonicalFrom: "embedded-analytics-in-2025-how-it-works-benefits-ai-role-and-business-impact",
    reason: "Embedded and white-label analytics are one buyer question; also drops the year from the slug.",
    members: ["white-label-analytics"],
  },
  {
    id: "data-visualization",
    canonical: "data-visualization-tools",
    canonicalFrom: "data-visualization-tools",
    reason: "The chart-types explainer is the informational half of the same topic.",
    members: ["graphs-and-charts"],
  },
];

/**
 * Survivors that are not a cluster canonical. `null` means the slug already
 * complies with the Phase 3 rules; a string is the compliant rename.
 */
export const KEEP = [
  ["is-ai-bi-just-text-to-sql-the-honest-difference-with-examples", "is-ai-bi-just-text-to-sql",
   "CTO-authored. Owns the text-to-SQL distinction, the sharpest differentiation argument the company has. Shortened from 61 chars to meet the slug rule."],
  ["from-4-hours-to-2-minutes-how-an-rcm-company-rebuilt-its-analytics", "from-4-hours-to-2-minutes-rcm-analytics",
   "CTO-authored. The Jindal Healthcare story with hard numbers; anchors the healthcare-rcm pillar. Shortened from 66 chars, keeping the memorable hook."],
  ["how-to-evaluate-ai-bi-tools-the-12-questions-most-demos-can-t-survive",
   "how-to-evaluate-ai-bi-tools", "CTO-authored buyer's guide. Slug shortened and the mangled apostrophe removed."],
  ["sisense-alternatives-7-bi-tools-compared-in-2026", "sisense-alternatives",
   "CTO-authored comparison. Year dropped from the slug."],
  ["best-looker-alternatives", "looker-alternatives",
   "Distinct competitor query with commercial intent. Stop-word prefix dropped."],
  ["best-tableau-alternative", "tableau-alternatives",
   "Distinct competitor query. Normalised to the plural used across the alternatives set."],
  ["thoughtspot-alternative", "thoughtspot-alternatives",
   "Distinct competitor query. Normalised to plural."],
  ["omni-alternative-to-apache-superset", "apache-superset-alternatives",
   "Distinct competitor query, reframed from a single-vendor pitch to the category the buyer searches."],
  ["business-intelligence", null, "Head-term pillar page."],
  ["enterprise-business-intelligence", null, "Distinct enterprise buyer query."],
  ["saas-business-intelligence", null, "Distinct vertical query."],
  ["logistics-analytics", null, "Distinct vertical query."],
  ["manufacturing-analytics", null, "Distinct vertical query."],
  ["ai-predictive-analytics-in-healthcare-how-data-is-transforming-patient-care",
   "healthcare-analytics", "Supports the healthcare-rcm pillar alongside the Jindal story. Slug shortened."],
  ["what-is-a-kpi-guide", "what-is-a-kpi", "Distinct definitional query; -guide suffix is padding."],
  ["what-is-predictive-analytics-simple-guide", "what-is-predictive-analytics",
   "Distinct definitional query; -simple-guide is padding."],
  ["what-is-data-modeling-guide", "what-is-data-modeling", "Distinct definitional query; -guide is padding."],
  ["database-vs-data-warehouse-vs-data-lake-guide", "database-vs-data-warehouse-vs-data-lake",
   "Distinct comparison query; -guide is padding."],
  ["database-optimization", null, "Distinct engineering query."],
  ["dbt-guide", "dbt", "Distinct tool query; -guide is padding."],
  ["data-science-vs-data-analytics-what-you-need-to-know", "data-science-vs-data-analytics",
   "Distinct comparison query; trailing clause is padding."],
  ["positive-vs-negative-correlation", null, "Distinct statistical query with 16 inbound links."],
];
