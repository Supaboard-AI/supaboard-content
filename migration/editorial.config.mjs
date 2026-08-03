/**
 * Authored editorial metadata for the 47 survivors.
 *
 * These are the fields no codemod can infer: the query a post owns, who it is
 * for, where it sits in the funnel, and what it claims. Kept as source so a
 * reviewer can argue with one line and regenerate.
 *
 * `targetQuery` must be unique across the corpus — that constraint is what
 * makes the cannibalisation that produced 145 URLs structurally impossible to
 * repeat, so these were chosen to be genuinely distinct search intents rather
 * than paraphrases of one another.
 *
 * Fields deliberately NOT set here: statsCount, which is measured from the body
 * rather than declared, because a declared statistic count is exactly the kind
 * of number this whole exercise exists to stop us inventing.
 */

const CASE = {
  jindal: "/case-study/jindal-healthcare",
  objection: "/case-study/objection.ai",
  gabriella: "/case-study/gabriella.pl",
  legend: "/case-study/legend-ehr",
};

/** [category, pillar, cluster, targetQuery, intent, audience, funnel, tldr[], caseStudies[]] */
export const EDITORIAL = {
  // ---------- company ----------
  "from-4-hours-to-2-minutes-rcm-analytics": {
    category: "company", pillar: "healthcare-rcm", cluster: "case-studies",
    targetQuery: "healthcare rcm analytics case study",
    intent: "commercial", audience: "ops-business", funnel: "bofu",
    caseStudies: [CASE.jindal],
    tldr: [
      "Jindal Healthcare cut per-client analysis from four hours to two minutes.",
      "All protected health information was masked before analytics touched it, so the platform never connected to an EHR.",
      "The change was not speed for its own sake but the cost of curiosity: cheap questions get asked, expensive ones get rationed.",
    ],
  },
  "analytics-without-a-data-team": {
    category: "company", pillar: "no-data-team", cluster: "self-service",
    targetQuery: "analytics without a data team",
    intent: "commercial", audience: "ops-business", funnel: "mofu",
    caseStudies: [CASE.objection, CASE.gabriella, CASE.legend],
    tldr: [
      "Companies without analysts do not have a tooling gap, they have a queue.",
      "Building a single source of truth is three steps: connect the sources, define the shared metrics, publish where people work.",
      "The middle step is the one teams skip, and skipping it distributes the ambiguity instead of removing the bottleneck.",
      "Objection.ai runs eleven unified data sources with zero data analysts on staff.",
    ],
  },

  // ---------- product: tools and comparisons ----------
  "best-ai-bi-tools": {
    category: "product", pillar: "choosing-ai-bi", cluster: "bi-tools",
    targetQuery: "best ai bi tools",
    intent: "commercial", audience: "both", funnel: "bofu",
    caseStudies: [CASE.jindal, CASE.gabriella],
    tldr: [
      "Judge a BI tool on whether the people with the questions can use it themselves.",
      "Per-seat pricing that works for five people is often the largest analytics line at fifty.",
      "Agentic means the tool can run a multi-step investigation, not that it has a chat box.",
      "Deployment choice is a data-governance decision wearing an infrastructure costume.",
    ],
  },
  "how-to-evaluate-ai-bi-tools": {
    category: "product", pillar: "choosing-ai-bi", cluster: "bi-tools",
    targetQuery: "how to evaluate ai bi tools",
    intent: "commercial", audience: "both", funnel: "bofu",
    caseStudies: [CASE.jindal],
    tldr: [
      "Most demos are rehearsed against data the vendor prepared in advance.",
      "Ask a question the demo did not anticipate, against a join the vendor did not choose.",
      "A tool that cannot show which query produced a number cannot be audited when someone doubts it.",
    ],
  },
  "metabase-alternatives": {
    category: "product", pillar: "choosing-ai-bi", cluster: "alternatives",
    targetQuery: "metabase alternatives",
    intent: "commercial", audience: "both", funnel: "bofu",
    caseStudies: [CASE.objection],
    tldr: [
      "Metabase is easy to start and gets awkward at white-labelling and per-tenant isolation.",
      "Embedding for staff and embedding for paying customers are different purchases.",
      "Per-seat pricing is hostile to embedded use because your seat count becomes your customer count.",
    ],
  },
  "sisense-alternatives": {
    category: "product", pillar: "choosing-ai-bi", cluster: "alternatives",
    targetQuery: "sisense alternatives",
    intent: "commercial", audience: "both", funnel: "bofu",
    caseStudies: [CASE.jindal],
    tldr: [
      "Sisense does not publish pricing, so quoted costs vary widely by deployment size.",
      "The alternatives differ most in who has to maintain the model, not in chart types.",
      "Compare on total cost at three times your current user count, not at today's headcount.",
    ],
  },
  "looker-alternatives": {
    category: "product", pillar: "choosing-ai-bi", cluster: "alternatives",
    targetQuery: "looker alternatives",
    intent: "commercial", audience: "data-team", funnel: "bofu",
    caseStudies: [CASE.objection],
    tldr: [
      "Looker's strength and its cost are the same thing: LookML modelling work.",
      "Alternatives split into those that keep a modelling layer and those that drop it.",
      "Dropping the model buys speed and costs you consistent metric definitions.",
    ],
  },
  "tableau-alternatives": {
    category: "product", pillar: "choosing-ai-bi", cluster: "alternatives",
    targetQuery: "tableau alternatives",
    intent: "commercial", audience: "both", funnel: "bofu",
    caseStudies: [CASE.gabriella],
    tldr: [
      "Tableau is strongest where a person's job is exploring data visually.",
      "Its per-seat cost is high from the start and predictable as you grow.",
      "If your problem is that business users cannot self-serve, a Tableau alternative may be the wrong category.",
    ],
  },
  "thoughtspot-alternatives": {
    category: "product", pillar: "choosing-ai-bi", cluster: "alternatives",
    targetQuery: "thoughtspot alternatives",
    intent: "commercial", audience: "both", funnel: "bofu",
    caseStudies: [CASE.objection],
    tldr: [
      "ThoughtSpot pioneered search-style analytics and prices for enterprise budgets.",
      "It works best on data that has already been modelled and cleaned.",
      "Alternatives differ mainly in how much preparation they demand before the first question.",
    ],
  },
  "apache-superset-alternatives": {
    category: "product", pillar: "choosing-ai-bi", cluster: "alternatives",
    targetQuery: "apache superset alternatives",
    intent: "commercial", audience: "data-team", funnel: "bofu",
    caseStudies: [CASE.objection],
    tldr: [
      "Superset is free to license and costs engineering time to run.",
      "The real comparison is self-hosted maintenance against a subscription.",
      "Teams usually leave Superset over governance and support, not over charting.",
    ],
  },
  "power-bi-vs-tableau": {
    category: "product", pillar: "choosing-ai-bi", cluster: "bi-tools",
    targetQuery: "power bi vs tableau",
    intent: "commercial", audience: "both", funnel: "mofu",
    caseStudies: [CASE.gabriella],
    tldr: [
      "If you are a Microsoft shop, Power BI wins on integration before price is discussed.",
      "Tableau suits people whose job is visual exploration; Power BI suits a modelling layer and DAX.",
      "Model both at three times your current user count, because the cost ranking often flips.",
      "Both are tools for building views, and the building is a specialist job.",
    ],
  },
  "agentic-analytics": {
    category: "product", pillar: "trustworthy-ai", cluster: "ai-bi",
    targetQuery: "agentic analytics",
    intent: "informational", audience: "both", funnel: "tofu",
    tldr: [
      "Agentic analytics decomposes a question into several queries instead of answering one.",
      "The difference shows on why-questions, which require investigation rather than retrieval.",
      "Test the claim by asking something requiring two joins and a comparison.",
    ],
  },
  "embedded-analytics": {
    category: "product", pillar: "choosing-ai-bi", cluster: "embedding",
    targetQuery: "embedded analytics",
    intent: "commercial", audience: "data-team", funnel: "mofu",
    caseStudies: [CASE.legend],
    tldr: [
      "Embedded describes where analytics appear; white label describes whose they look like.",
      "Internal users rarely care about branding, and paying customers care a great deal.",
      "Multi-tenancy enforced by filters rather than at the query layer is a breach waiting for a misconfiguration.",
    ],
  },
  "data-visualization-tools": {
    category: "product", pillar: "choosing-ai-bi", cluster: "visualisation",
    targetQuery: "data visualization tools",
    intent: "commercial", audience: "both", funnel: "mofu",
    caseStudies: [CASE.gabriella],
    tldr: [
      "Every graph is a chart, and the naming matters far less than the encoding.",
      "Bars for comparing categories, lines for continuous change, histograms for distribution.",
      "Avoid dual axes: they let you manufacture a visual relationship between any two series.",
    ],
  },

  // ---------- engineering ----------
  "what-is-a-semantic-layer": {
    category: "engineering", pillar: "metrics-sql", cluster: "semantic-layer",
    targetQuery: "what is a semantic layer",
    intent: "informational", audience: "data-team", funnel: "tofu",
    tldr: [
      "A semantic layer is the governed body of business meaning between raw data and whoever queries it.",
      "A semantic data model is the artefact; the layer is the system that governs, versions and serves it.",
      "It can be authored up front in a modelling language or emerge from curated rules and corrections.",
      "Ask a vendor who can change a definition and what happens downstream when they do.",
    ],
  },
  "is-ai-bi-just-text-to-sql": {
    category: "engineering", pillar: "trustworthy-ai", cluster: "ai-bi",
    targetQuery: "ai bi vs text to sql",
    intent: "informational", audience: "both", funnel: "mofu",
    caseStudies: [CASE.jindal],
    tldr: [
      "Text-to-SQL translates a question into a query against whatever the schema happens to contain.",
      "AI BI resolves the question against governed definitions before any SQL is written.",
      "The gap appears on why-questions, where computing the number is the easy half.",
    ],
  },
  "ai-data-analyst": {
    category: "engineering", pillar: "trustworthy-ai", cluster: "ai-bi",
    targetQuery: "ai data analyst",
    intent: "commercial", audience: "both", funnel: "mofu",
    caseStudies: [CASE.jindal, CASE.objection],
    tldr: [
      "Data preparation and baseline modelling automate reliably; framing the question does not.",
      "Deciding what counts as churn is a business decision that no model can make for you.",
      "A demo that goes from upload to recommendation without naming the question is showing you the easy part.",
    ],
  },
  "ai-analytics-governance": {
    category: "engineering", pillar: "trustworthy-ai", cluster: "governance",
    targetQuery: "ai analytics governance",
    intent: "informational", audience: "data-team", funnel: "mofu",
    caseStudies: [CASE.jindal],
    tldr: [
      "Contextual governance evaluates each request by role, data sensitivity and intent rather than one fixed rule.",
      "A broken pipeline fails loudly; a fabricated insight fails silently and looks identical to a sound one.",
      "Explainability is a governance control, because a human who cannot see the reasoning cannot overrule it.",
    ],
  },
  "will-ai-replace-data-analysts": {
    category: "engineering", pillar: "trustworthy-ai", cluster: "ai-bi",
    targetQuery: "will ai replace data analysts",
    intent: "informational", audience: "data-team", funnel: "tofu",
    tldr: [
      "AI automates retrieval and recurring reporting, not deciding what is worth reporting.",
      "Reporting splits into an assembly problem and a judgement problem; only the first generalises.",
      "The role that shrinks is report-writer; the one that grows decides what is true.",
    ],
  },
  "data-engineering": {
    category: "engineering", pillar: "metrics-sql", cluster: "data-platform",
    targetQuery: "data engineering",
    intent: "informational", audience: "data-team", funnel: "tofu",
    tldr: [
      "The hard part of data engineering was never writing the transformation code.",
      "Deciding whether a refunded order counts is a business decision surfacing as a schema decision.",
      "The engineers at risk are those whose job is translating a ticket into SQL.",
    ],
  },
  "data-connectivity": {
    category: "engineering", pillar: "metrics-sql", cluster: "data-platform",
    targetQuery: "data connectivity",
    intent: "informational", audience: "data-team", funnel: "tofu",
    caseStudies: [CASE.objection],
    tldr: [
      "Application integration moves events so systems can act; data integration consolidates records so people can analyse.",
      "Using application integration to build a reporting layer produces a system with no history.",
      "Ask what happens when it runs: a system does something, or a person can ask something.",
    ],
  },
  "what-is-data-modeling": {
    category: "engineering", pillar: "metrics-sql", cluster: "data-platform",
    targetQuery: "what is data modeling",
    intent: "informational", audience: "data-team", funnel: "tofu",
    tldr: [
      "Data modelling defines the entities, attributes and relationships a business runs on.",
      "The model decides which questions are cheap to answer and which are impossible.",
      "Conceptual, logical and physical models answer different questions for different audiences.",
    ],
  },
  "database-vs-data-warehouse-vs-data-lake": {
    category: "engineering", pillar: "metrics-sql", cluster: "data-platform",
    targetQuery: "database vs data warehouse vs data lake",
    intent: "informational", audience: "data-team", funnel: "tofu",
    tldr: [
      "A database serves transactions, a warehouse serves analysis, a lake stores raw data cheaply.",
      "Running analytics against a production database is the most common and most expensive shortcut.",
      "Schema-on-write versus schema-on-read decides who pays the modelling cost and when.",
    ],
  },
  "database-optimization": {
    category: "engineering", pillar: "metrics-sql", cluster: "data-platform",
    targetQuery: "database optimization",
    intent: "informational", audience: "data-team", funnel: "tofu",
    tldr: [
      "Most performance problems trace to query plans and indexing rather than to hardware.",
      "Adding indexes speeds reads and slows every write, so the trade-off has to be deliberate.",
      "Scaling infrastructure to fix an inefficient join buys time at permanent cost.",
    ],
  },
  "dbt": {
    category: "engineering", pillar: "metrics-sql", cluster: "data-platform",
    targetQuery: "dbt data build tool",
    intent: "informational", audience: "data-team", funnel: "tofu",
    tldr: [
      "dbt applies software engineering practice to SQL transformations: version control, tests, documentation.",
      "MetricFlow defines a metric once so every downstream query computes it identically.",
      "The value is less the tool than the discipline it makes cheap to follow.",
    ],
  },

  // ---------- data ----------
  "business-intelligence": {
    category: "data", pillar: "choosing-ai-bi", cluster: "bi-fundamentals",
    targetQuery: "business intelligence",
    intent: "informational", audience: "both", funnel: "tofu",
    tldr: [
      "Business intelligence turns operational data into decisions people actually make.",
      "The discipline predates the tooling and its core problem has never been storage.",
      "Most BI failures are definition failures, not technology failures.",
    ],
  },
  "enterprise-business-intelligence": {
    category: "data", pillar: "choosing-ai-bi", cluster: "bi-fundamentals",
    targetQuery: "enterprise business intelligence",
    intent: "commercial", audience: "data-team", funnel: "mofu",
    caseStudies: [CASE.jindal],
    tldr: [
      "Enterprise BI is defined by governance and access control as much as by analysis.",
      "The scaling problem is organisational: more teams means more contested definitions.",
      "Buying capability before agreeing definitions publishes the disagreement faster.",
    ],
  },
  "saas-business-intelligence": {
    category: "data", pillar: "choosing-ai-bi", cluster: "verticals",
    targetQuery: "saas business intelligence",
    intent: "commercial", audience: "ops-business", funnel: "mofu",
    caseStudies: [CASE.objection],
    tldr: [
      "SaaS metrics are interlocking: churn, expansion and CAC only mean something together.",
      "Product, billing and CRM data have to be joined before any of them answer a real question.",
      "Cohort logic is where most SaaS reporting quietly goes wrong.",
    ],
  },
  "retail-business-intelligence": {
    category: "data", pillar: "choosing-ai-bi", cluster: "verticals",
    targetQuery: "retail business intelligence",
    intent: "commercial", audience: "ops-business", funnel: "mofu",
    caseStudies: [CASE.gabriella],
    tldr: [
      "Retail KPIs work as four layers: sales, inventory, customer and margin.",
      "The same revenue decline means three different things depending on the lower layers.",
      "Chain-level averages hide the store-level variance that is actually fixable.",
    ],
  },
  "logistics-analytics": {
    category: "data", pillar: "choosing-ai-bi", cluster: "verticals",
    targetQuery: "logistics analytics",
    intent: "commercial", audience: "ops-business", funnel: "mofu",
    caseStudies: [CASE.legend],
    tldr: [
      "Logistics analytics is mostly about exceptions, not averages.",
      "On-time performance measured in aggregate conceals the lanes that are failing.",
      "The data usually exists across carrier, warehouse and order systems that do not reconcile.",
    ],
  },
  "manufacturing-analytics": {
    category: "data", pillar: "choosing-ai-bi", cluster: "verticals",
    targetQuery: "manufacturing analytics",
    intent: "commercial", audience: "ops-business", funnel: "mofu",
    caseStudies: [CASE.legend],
    tldr: [
      "Manufacturing analytics joins machine telemetry to commercial outcomes.",
      "Predictive maintenance pays back only where downtime has a measured cost.",
      "Quality data is usually the most complete and the least used.",
    ],
  },
  "healthcare-analytics": {
    category: "data", pillar: "healthcare-rcm", cluster: "verticals",
    targetQuery: "healthcare predictive analytics",
    intent: "commercial", audience: "ops-business", funnel: "mofu",
    caseStudies: [CASE.jindal],
    tldr: [
      "Healthcare analytics is constrained first by what data may legally move.",
      "Masking protected health information before analysis is an architectural decision, not a policy one.",
      "Predictive models in care settings need explainability to be actionable at all.",
    ],
  },
  "ecommerce-analytics": {
    category: "data", pillar: "choosing-ai-bi", cluster: "verticals",
    targetQuery: "ecommerce analytics",
    intent: "commercial", audience: "ops-business", funnel: "mofu",
    caseStudies: [CASE.gabriella],
    tldr: [
      "Cart abandonment is several problems that need different responses.",
      "Instrument the funnel steps, not just the outcome, or the diagnosis is guesswork.",
      "A meaningful share of apparent abandonment is failed payment authorisation.",
    ],
  },
  "spend-analytics": {
    category: "data", pillar: "choosing-ai-bi", cluster: "finance",
    targetQuery: "spend analytics",
    intent: "commercial", audience: "ops-business", funnel: "mofu",
    caseStudies: [CASE.jindal],
    tldr: [
      "Supplier consolidation and contract compliance pay back before the other use cases.",
      "Supplier normalisation is the unglamorous prerequisite for all of it.",
      "The constraint is rarely the software; it is agreeing what a supplier is.",
    ],
  },
  "financial-dashboard-examples": {
    category: "data", pillar: "choosing-ai-bi", cluster: "finance",
    targetQuery: "financial dashboard examples",
    intent: "commercial", audience: "ops-business", funnel: "mofu",
    caseStudies: [CASE.jindal],
    tldr: [
      "Start with a template and replace it once you know which numbers you argue about.",
      "Spreadsheet exports are the highest-signal indicator of where a dashboard failed.",
      "Agree definitions before building, or the dashboard just publishes the disagreement faster.",
    ],
  },
  "bi-dashboards": {
    category: "data", pillar: "choosing-ai-bi", cluster: "dashboards",
    targetQuery: "bi dashboard",
    intent: "informational", audience: "both", funnel: "tofu",
    tldr: [
      "A decision-making dashboard exists to trigger a specific action by a specific person.",
      "If you cannot name that action, the dashboard has no reason to exist.",
      "The test is not whether people like it but whether anything different happened.",
    ],
  },
  "self-service-bi": {
    category: "data", pillar: "no-data-team", cluster: "self-service",
    targetQuery: "self service bi vs traditional bi",
    intent: "informational", audience: "both", funnel: "tofu",
    tldr: [
      "Self-service moves the interaction layer closer to the people with the questions.",
      "Without shared definitions it trades a bottleneck for an ambiguity that is harder to notice.",
      "Governance work has to happen alongside access work, not after it.",
    ],
  },
  "natural-language-query-analytics": {
    category: "data", pillar: "no-data-team", cluster: "self-service",
    targetQuery: "natural language query analytics",
    intent: "informational", audience: "both", funnel: "tofu",
    caseStudies: [CASE.objection, CASE.gabriella],
    tldr: [
      "Natural-language querying removes the hop between the person asking and the person who can answer.",
      "Cross-system questions are where it earns its keep; single-source questions were never the bottleneck.",
      "Pointing a chat interface at disconnected databases produces disconnected answers in a confident tone.",
    ],
  },
  "what-is-an-ad-hoc-query": {
    category: "data", pillar: "no-data-team", cluster: "self-service",
    targetQuery: "what is an ad hoc query",
    intent: "informational", audience: "both", funnel: "tofu",
    tldr: [
      "An ad hoc query answers a specific unplanned question rather than a recurring one.",
      "Ad hoc requests pile up because they are the questions dashboards did not anticipate.",
      "Reduce them by making the common ones self-serviceable, not by refusing them.",
    ],
  },
  "real-time-analytics": {
    category: "data", pillar: "choosing-ai-bi", cluster: "bi-fundamentals",
    targetQuery: "real time analytics platform",
    intent: "commercial", audience: "both", funnel: "mofu",
    caseStudies: [CASE.legend],
    tldr: [
      "Real-time analytics narrows the gap between what is happening and what your team knows.",
      "Business activity monitoring watches processes; real-time analytics answers questions.",
      "Both depend on knowing what normal is, which is a metric definition.",
    ],
  },
  "types-of-analytics": {
    category: "data", pillar: "metrics-sql", cluster: "analytics-fundamentals",
    targetQuery: "types of analytics",
    intent: "informational", audience: "both", funnel: "tofu",
    tldr: [
      "Descriptive, diagnostic, predictive and prescriptive answer four different questions.",
      "Build descriptive first: a forecast inherits whatever ambiguity its inputs carry.",
      "The diagnostic layer holds most of the business value and is routinely skipped.",
    ],
  },
  "what-is-predictive-analytics": {
    category: "data", pillar: "metrics-sql", cluster: "analytics-fundamentals",
    targetQuery: "what is predictive analytics",
    intent: "informational", audience: "both", funnel: "tofu",
    tldr: [
      "Predictive analytics estimates future outcomes from historical patterns.",
      "Its accuracy is bounded by how unambiguously the target was defined.",
      "A precise forecast built on a contested definition carries authority it has not earned.",
    ],
  },
  "what-is-a-kpi": {
    category: "data", pillar: "metrics-sql", cluster: "analytics-fundamentals",
    targetQuery: "what is a kpi",
    intent: "informational", audience: "ops-business", funnel: "tofu",
    tldr: [
      "A KPI is a measure tied to a decision somebody actually makes.",
      "Most KPI sets fail because nobody agreed the formula, not because the metric was wrong.",
      "If a number would not change what you do, it is a statistic rather than a KPI.",
    ],
  },
  "bar-graph-vs-histogram": {
    category: "data", pillar: "metrics-sql", cluster: "visualisation",
    targetQuery: "bar graph vs histogram",
    intent: "informational", audience: "both", funnel: "tofu",
    tldr: [
      "A bar graph compares distinct categories; a histogram shows the distribution of continuous data.",
      "Bar graphs use gaps to signal independence; histogram bars touch because the scale is continuous.",
      "If reordering the bars destroys the chart, it is a histogram and comparison was never the point.",
    ],
  },
  "positive-vs-negative-correlation": {
    category: "data", pillar: "metrics-sql", cluster: "analytics-fundamentals",
    targetQuery: "positive vs negative correlation",
    intent: "informational", audience: "both", funnel: "tofu",
    tldr: [
      "Positive correlation means two variables move together; negative means they move apart.",
      "Correlation strength and direction are separate properties and are often conflated.",
      "A correlation that only appears on a dual axis is an artefact of the scales you chose.",
    ],
  },
  "data-science-vs-data-analytics": {
    category: "data", pillar: "metrics-sql", cluster: "analytics-fundamentals",
    targetQuery: "data science vs data analytics",
    intent: "informational", audience: "data-team", funnel: "tofu",
    tldr: [
      "Data analytics explains what happened; data science builds systems that predict what will.",
      "The tooling overlaps almost completely, which is why the titles blur.",
      "Most companies hiring a data scientist need an analyst and a clean warehouse.",
    ],
  },
  "generative-business-intelligence": {
    category: "data", pillar: "trustworthy-ai", cluster: "ai-bi",
    targetQuery: "generative business intelligence",
    intent: "informational", audience: "both", funnel: "tofu",
    tldr: [
      "Generative BI produces the narration around a number, not the number itself.",
      "Asked why something moved, a model will supply a reason because that is the shape of the response.",
      "Generation handles the draft; a human owns the claim.",
    ],
  },
};
