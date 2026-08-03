/**
 * Titles (<= 65 chars) and meta descriptions (140-160 chars).
 *
 * Only the posts that failed the schema appear here; the rest already comply
 * and are left alone. Years are kept in titles deliberately — the slug rules
 * ban them from URLs, not from the headline, where they signal freshness and
 * can be updated without a redirect.
 */
export const TITLES = {
  "agentic-analytics": "Agentic Analytics vs Traditional BI: What Changes",
  "ai-analytics-governance": "AI Contextual Governance for Analytics Teams",
  "bar-graph-vs-histogram": "Bar Graph vs Histogram: Differences and When to Use",
  "best-ai-bi-tools": "Best AI BI Tools in 2026: Features, Pricing, Comparison",
  "data-visualization-tools": "Data Visualization Tools: A 2026 Buyer's Guide",
  "database-optimization": "Database Optimization: Performance and Scaling",
  "ecommerce-analytics": "Ecommerce Analytics: Metrics That Change Decisions",
  "embedded-analytics": "Embedded Analytics: How It Works and What It Costs",
  "enterprise-business-intelligence": "Enterprise Business Intelligence: Use Cases and Tools",
  "from-4-hours-to-2-minutes-rcm-analytics": "From 4 Hours to 2 Minutes: An RCM Analytics Rebuild",
  "healthcare-analytics": "AI Predictive Analytics in Healthcare: A Practical Guide",
  "how-to-evaluate-ai-bi-tools": "How to Evaluate AI BI Tools: 12 Questions for Demos",
  "logistics-analytics": "Logistics Analytics: Turning Supply Chain Data Into Action",
  "metabase-alternatives": "Metabase Alternatives Compared for 2026",
  "natural-language-query-analytics": "Natural Language Query Analytics: A 2026 Guide",
  "positive-vs-negative-correlation": "Positive vs Negative Correlation, With Examples",
  "retail-business-intelligence": "Retail Business Intelligence: KPIs, Tools and Pitfalls",
  "tableau-alternatives": "Tableau Alternatives: Top BI Tools Compared in 2026",
  "types-of-analytics": "The Four Types of Analytics, and Which to Build First",
  "what-is-data-modeling": "What Is Data Modeling? Types, Tools and Examples",
};

export const DESCRIPTIONS = {
  "ai-data-analyst":
    "An AI data analyst answers questions against governed definitions instead of raw schema. How it works, what it automates, and what it cannot.",
  "business-intelligence":
    "Business intelligence turns operational data into decisions people actually make. What it covers, how it evolved, and why most BI failures are definitional.",
  "data-connectivity":
    "Data connectivity lets systems share data so questions can span them. How it works, and how it differs from application and data integration.",
  "data-science-vs-data-analytics":
    "Data analytics explains what happened; data science predicts what will. Where the roles overlap, where they do not, and which one you probably need.",
  "database-vs-data-warehouse-vs-data-lake":
    "Databases serve transactions, warehouses serve analysis, lakes store raw data. How they differ and which one your question actually belongs in.",
  "how-to-evaluate-ai-bi-tools":
    "Most AI BI demos are rehearsed against prepared data. Twelve questions that separate a working product from a well-practised sales presentation.",
  "what-is-an-ad-hoc-query":
    "An ad hoc query answers a specific unplanned question. What makes one ad hoc, how teams use them, and how to cut the requests reaching your analysts.",
  "agentic-analytics":
    "Traditional BI tells you what happened. Agentic analytics runs the investigation. How the two differ, and three demo tests that separate them.",
  "ai-analytics-governance":
    "Static AI rules either over-restrict or over-expose. How contextual governance scores each request, and why fabricated insights fail silently.",
  "apache-superset-alternatives":
    "Apache Superset is free to license and costs real engineering time to run. How the alternatives compare on governance, support and total cost of ownership.",
  "bar-graph-vs-histogram":
    "Bar graphs compare categories, histograms show distribution. The differences, worked examples, and the reorder test that settles which you need.",
  "bi-dashboards":
    "A dashboard exists to trigger a decision by a named person. How to build one that does, which metrics belong on it, and when you should delete it again.",
  "data-engineering":
    "What data engineers actually do now that pipelines became a commodity, which parts of the job automate away, and which judgement calls never will.",
  "data-visualization-tools":
    "Which data visualization tool fits your team, how they price at scale, and the chart choices that decide whether anybody reads the result at all.",
  "database-optimization":
    "Most database performance problems are query plans, not hardware. How to find them, what indexing really costs you, and when to scale up instead.",
  "dbt":
    "dbt brings version control, testing and documentation to SQL transformations. What it does, where MetricFlow fits in, and when it is simply overkill.",
  "ecommerce-analytics":
    "Cart abandonment is several problems, not one. How to instrument the funnel, segment before concluding, and find failed payments hiding in it.",
  "embedded-analytics":
    "Embedded analytics puts insight inside your own product. How it works, what white labelling adds, and why per-seat pricing breaks down badly at scale.",
  "enterprise-business-intelligence":
    "Enterprise BI is defined by governance as much as by analysis. The use cases, the tools, and why definitions matter far more than the dashboards do.",
  "from-4-hours-to-2-minutes-rcm-analytics":
    "A revenue cycle management company cut per-client analysis from four hours to two minutes, with every piece of patient data masked before it ever moved.",
  "healthcare-analytics":
    "Healthcare analytics is constrained first by what data may legally move. How masking, prediction and explainability fit together in practice.",
  "logistics-analytics":
    "Logistics analytics is about exceptions, not averages. Which signals matter, why aggregate on-time rates mislead, and how to join the systems.",
  "manufacturing-analytics":
    "Manufacturing analytics joins machine telemetry to commercial outcomes. Where predictive maintenance pays back, and where it quietly does not at all.",
  "metabase-alternatives":
    "Metabase is easy to start with and awkward to white label. How the alternatives compare on embedding, multi-tenancy, support and on pricing shape.",
  "natural-language-query-analytics":
    "Ask a data question in plain English and get a real answer back. How NLQ works, where it earns its keep, and the prerequisite that vendors gloss over.",
  "positive-vs-negative-correlation":
    "Positive correlation means variables move together, negative means apart. How to read strength and direction, and how to avoid the dual-axis trap.",
  "real-time-analytics":
    "Real-time analytics narrows the gap between what happens and what you know. How it differs from business activity monitoring, and when to buy.",
  "retail-business-intelligence":
    "Retail KPIs work in four layers: sales, inventory, customer, margin. How to read them together so that a revenue drop always gets the right response.",
  "saas-business-intelligence":
    "SaaS metrics only ever mean something together. How to join product, billing and CRM data, and where cohort logic most quietly goes wrong on you.",
  "self-service-bi":
    "Self-service BI moves questions closer to the people asking them. What it changes, what it costs in governance, and when traditional BI wins.",
  "spend-analytics":
    "Spend analytics turns scattered procurement data into savings you can act on, and the use cases that reliably pay back before all the others do.",
  "tableau-alternatives":
    "Tableau is strong for visual exploration and priced accordingly. How the alternatives compare, and when the whole category is wrong for you.",
  "thoughtspot-alternatives":
    "ThoughtSpot pioneered search-style analytics at enterprise prices. How alternatives compare on setup cost, modelling and time to first answer.",
  "types-of-analytics":
    "Descriptive, diagnostic, predictive and prescriptive analytics explained, and why building them out of order produces forecasts nobody trusts.",
  "what-is-a-kpi":
    "A KPI is a measure tied to a decision somebody makes. How to choose them, define them so teams agree, and tell them from ordinary statistics.",
  "what-is-data-modeling":
    "Data modeling defines the entities and relationships a business runs on. The types, the tools, and how the model decides what you are able to ask.",
  "what-is-predictive-analytics":
    "Predictive analytics estimates outcomes from historical patterns. How it works, what bounds its accuracy, and when a forecast is worth trusting.",
};
