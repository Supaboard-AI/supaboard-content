---
slug: what-is-a-semantic-layer
status: published
title: What Is a Semantic Layer? The 2026 Field Guide
description: >-
  A founder's field guide to the semantic layer in 2026: what it is, why AI
  agents fail without one, and how dbt, Cube, AtScale, Looker, and Malloy
  compare.
category: engineering
tags:
  - Tech
publishedAt: '2026-06-16'
updatedAt: '2026-06-16'
readMinutes: 9
readLabel: 9 mins
author:
  name: Subhrajyoti Modak
  title: CoFounder and CTO
  avatar: >-
    https://supaboard-landing-content.fra1.digitaloceanspaces.com/blog/authors/0b5807dfc3694948.jpeg
cover:
  url: >-
    https://supaboard-landing-content.fra1.digitaloceanspaces.com/blog/what-is-a-semantic-layer/2794f7efb384c2a9.png
  alt: '"What Is a Semantic Layer? The 2026 Field Guide" — Supaboard blog cover'
  width: 1600
  height: 900
ogImage: >-
  https://supaboard-landing-content.fra1.digitaloceanspaces.com/blog/og/2701f17191106716.png
sections:
  - id: content-1
    heading: What a semantic layer actually is
  - id: content-9
    heading: Is a semantic data model the same thing as a semantic layer?
  - id: content-2
    heading: Why 2026 is the year it stops being optional
  - id: content-3
    heading: 'Where the semantic layer came from: a short history'
  - id: content-4
    heading: 'What is inside a semantic layer, and what is not'
  - id: content-5
    heading: 'The 2026 semantic layer landscape, tool by tool'
  - id: content-6
    heading: The "semantic layer in name only" problem
  - id: content-7
    heading: How to evaluate a semantic layer for your stack
  - id: content-10
    heading: Where the category goes in 2027
  - id: content-11
    heading: 'Where Supaboard sits, honestly'
  - id: content-8
    heading: FAQ
featured:
  choice: null
  trending: null
related:
  - positive-vs-negative-correlation
  - ai-analytics-governance
faq:
  - q: What is a semantic layer?
    a: >-
      A semantic layer is the governed body of business meaning — the metrics,
      entities, relationships and verified logic — sitting between raw data and
      whoever or whatever queries it, so questions resolve to shared definitions
      instead of guesswork. It can be authored up front in a modelling language
      or emerge from curated rules and corrections.
  - q: Is a semantic data model the same as a semantic layer?
    a: >-
      No. A semantic data model is the artefact: entities, attributes and named
      relationships, often expressed as subject-predicate-object triples. The
      semantic layer is the system that governs, versions, permissions and
      serves that model to every query. A model can live in one dashboard tool
      and be forgotten; a layer is owned infrastructure.
  - q: Do I actually need a semantic layer?
    a: >-
      If a human reads every number before it drives a decision, you can survive
      without an explicit one, though you will still pay for inconsistent
      metrics. If AI agents answer questions directly, you need one, because no
      human is in the loop to catch an undefined metric before it gets cited.
  - q: What is the difference between the dbt Semantic Layer and Cube?
    a: >-
      Both let you define a metric once and reuse it. dbt couples the semantic
      layer to transformation, so metrics live in code beside your models and
      compile through MetricFlow, which suits teams already running dbt. Cube is
      headless and decoupled, exposing one governed model to any BI tool,
      embedded app or agent.
  - q: Is the semantic layer obsolete now that models write good SQL?
    a: >-
      No. Models did get dramatically better at SQL, but better text-to-SQL
      raises the floor rather than removing the need to govern what a metric
      means. Deterministic generation from a governed definition cannot be
      subtly wrong in the way an inferred query can, and subtle wrongness is the
      expensive failure.
  - q: How is a semantic layer different from a data catalog?
    a: >-
      A data catalog tells you what data exists and who owns it. A knowledge
      graph maps how entities relate. A semantic layer tells you what the
      numbers mean and how to compute them correctly. They overlap increasingly,
      but the semantic layer's defining job is governed computation rather than
      discovery.
  - q: Is a semantic layer the same as a metrics layer?
    a: >-
      A metrics layer, defining named measures such as net revenue once, is the
      heart of a semantic layer but not the whole of it. A full semantic layer
      also carries entities, dimensions, relationships, join logic and
      governance. Every semantic layer contains a metrics layer; not every
      metrics layer is complete.
source:
  url: 'https://supaboard.ai/blog/what-is-a-semantic-layer-the-2026-field-guide'
  migratedAt: '2026-07-29'
absorbed:
  - 'https://supaboard.ai/blog/what-is-a-semantic-data-model'
internalLinks:
  - ai-analytics-governance
  - bar-graph-vs-histogram
  - positive-vs-negative-correlation
citations:
  - claim: dbt on the Semantic Layer and MetricFlow
    source: dbt Labs
    url: 'https://docs.getdbt.com/blog/semantic-layer-vs-text-to-sql-2026'
  - claim: Cube's universal semantic layer
    source: Cube
    url: 'https://cube.dev/'
  - claim: Google's description of LookML as a semantic modeling layer
    source: Google Cloud
    url: >-
      https://cloud.google.com/blog/products/business-intelligence/looker-updates-for-agentic-bi-at-next26/
  - claim: AtScale's framing of the semantic layer as governed business context
    source: AtScale
    url: 'https://www.atscale.com/use-cases/universal-semantic-layer/'
  - claim: Wikipedia's semantic data model entry
    source: Wikipedia
    url: 'https://en.wikipedia.org/wiki/Semantic_data_model'
  - claim: Fivetran and dbt Labs described the combined company
    source: fivetran.com
    url: >-
      https://www.fivetran.com/press/fivetran-dbt-labs-complete-merger-to-create-the-data-infrastructure-for-trusted-ai-agents
  - claim: Reference on malloy from github.com
    source: github.com
    url: 'https://github.com/malloydata/malloy'
  - claim: Drill to Detail podcast
    source: podscripts.co
    url: >-
      https://podscripts.co/podcasts/drill-to-detail/drill-to-detail-ep110-building-a-sequel-to-sql-with-malloy-featuring-special-guests-lloyd-tabb-and-carlin-eng
  - claim: Reference on bilt rewards from getdbt.com
    source: getdbt.com
    url: 'https://www.getdbt.com/case-studies/bilt-rewards'
  - claim: Reference on siliconangle from siliconangle.com
    source: siliconangle.com
    url: >-
      https://siliconangle.com/2025/06/02/semantic-data-layer-startup-cube-automates-analytics-ai-agents/
  - claim: Reference on denodo's testing from datamanagementblog.com
    source: datamanagementblog.com
    url: >-
      https://www.datamanagementblog.com/improving-the-accuracy-of-llm-based-text-to-sql-generation-with-a-semantic-layer-in-the-denodo-platform/
  - claim: Wren AI's analysis
    source: getwren.ai
    url: >-
      https://www.getwren.ai/post/why-the-semantic-layer-is-essential-for-reliable-text-to-sql-and-how-wren-ai-brings-it-to-life
  - claim: Snowflake's Cortex Analyst engineering work
    source: snowflake.com
    url: >-
      https://www.snowflake.com/en/blog/engineering/agentic-semantic-model-text-to-sql/
  - claim: RDF formalises subject-predicate-object triples underlying semantic models
    source: W3C
    url: 'https://www.w3.org/TR/rdf11-concepts/'
pillar: metrics-sql
cluster: semantic-layer
targetQuery: what is a semantic layer
intent: informational
audience: data-team
funnel: tofu
tldr:
  - >-
    A semantic layer is the governed body of business meaning between raw data
    and whoever queries it.
  - >-
    A semantic data model is the artefact; the layer is the system that governs,
    versions and serves it.
  - >-
    It can be authored up front in a modelling language or emerge from curated
    rules and corrections.
  - >-
    Ask a vendor who can change a definition and what happens downstream when
    they do.
statsCount: 0
---

<!-- section:content-1 -->

**TLDR:** A semantic layer is the governed body of business meaning, the metrics, entities, relationships, and verified logic, that sits between raw data and the people or AI agents querying it, so every question is answered from shared definitions instead of guesswork. For a decade it was a quiet convenience inside BI tools. In 2026 it became load-bearing infrastructure, because AI agents amplify the cost of an undefined metric: a dashboard with a wrong number gets caught in review, but an agent confidently citing the same number ships it straight into a decision. This guide defines the layer precisely, traces its history from LookML to the agentic era, maps the 2026 vendors (dbt, now Fivetran + dbt Labs; Cube; AtScale; Looker; Malloy; and our own approach at Supaboard), separates real semantic layers from prompt wrappers, and gives you a seven-question framework to choose one. The category is crowded, and we are one player in it, not the only answer.

## What a semantic layer actually is

Start with one sentence, because the rest of the post hangs off it.

A semantic layer is the governed body of business meaning, the metrics, entities, relationships, and verified logic, that sits between raw data and the people or AI agents querying it, so that every question is answered from shared definitions instead of guesswork.

Notice what that definition does not say. It does not say "a YAML file." It does not say "a compiler." It says _governed body of business meaning_. That phrasing is deliberate, and I defend it through the whole piece, because the most common mistake in this category is to confuse the semantic layer with one particular way of implementing it.

A raw warehouse table knows that a column called `amt` contains numbers. It does not know that `amt` means net revenue, that net revenue excludes refunds and internal test accounts, that it is recognized monthly rather than at invoice, or that finance and growth have agreed to disagree about whether trials count. All of that meaning lives in people's heads, in tribal knowledge, in a Slack thread from eight months ago. The semantic layer is where that meaning stops being tribal and becomes governed: written down, owned, versioned, and reused by every query.

There are two honest ways to build that governed meaning, and the rest of this post depends on you holding both at once. One way is to **author** it up front: an engineer writes metric and dimension definitions in a modeling language before anyone asks a question, and the tool compiles those definitions into queries. dbt, Cube, AtScale, and Looker all work this way. The other way is to let it **emerge**: the layer assembles itself from curated rules, verified examples, and human corrections captured as people actually use the system. Both produce a governed body of meaning. They differ in who writes it, when, and how. A great deal of confused vendor marketing in 2026 comes from one camp pretending the other is not doing the real thing.

For the canonical framings, read the primary sources directly: [dbt on the Semantic Layer and MetricFlow](https://docs.getdbt.com/blog/semantic-layer-vs-text-to-sql-2026), [Cube's universal semantic layer](https://cube.dev/), [Google's description of LookML as a semantic modeling layer](https://cloud.google.com/blog/products/business-intelligence/looker-updates-for-agentic-bi-at-next26/), and [AtScale's framing of the semantic layer as governed business context](https://www.atscale.com/use-cases/universal-semantic-layer/). Reading four vendors describe the same concept in four vocabularies is the fastest way to see what is essential versus what is branding.

<!-- section:content-9 -->

## Is a semantic data model the same thing as a semantic layer?

No. A semantic data model is the artefact; the semantic layer is the system that governs and serves it. People use the two interchangeably and it causes real confusion in tool evaluations, so it is worth ten paragraphs of precision.

A **semantic data model** is a representation of data that captures meaning, not just structure. It names three things explicitly:

-   **Entities** — the real-world objects: Customer, Product, Patient, Claim
-   **Attributes** — their properties: Name, Net Revenue, Diagnosis Date
-   **Relationships** — stated in business language: Customer _places_ Order, Patient _receives_ Treatment

Written out, those become triples — subject, predicate, object — which is what makes them legible to a human reading a glossary and to a machine planning a query. [Wikipedia's semantic data model entry](https://en.wikipedia.org/wiki/Semantic_data_model) is a decent primer on the formal lineage, which runs from the U.S. Air Force's ICAM programme and IDEF1X in the 1970s through RDF and OWL to what analytics vendors ship today.

The useful analogy: a semantic data model is a company org chart merged with a business glossary. It shows what exists and how things connect, without anyone writing a JOIN.

Here is the distinction that matters when you are comparing tools:

| | Relational data model | Semantic data model |
| --- | --- | --- |
| Optimises for | Storage efficiency and integrity | Meaning and business context |
| Relationships | Foreign keys, expressed as JOINs | Named business relationships |
| Who can use it | People who write SQL | People who ask questions |
| Built for | Transactions (OLTP) | Analytics, reporting, AI agents |
| Where semantics live | In documentation, if anywhere | Embedded in the model itself |

So why does the terminology drift? Because Microsoft made a naming decision that stuck: what Power BI calls a **semantic model** is the dataset-plus-definitions artefact, not a governed layer serving many tools. A semantic model in that sense can live inside one BI product and never be reusable outside it.

That is the whole difference. A semantic data model can exist in a notebook, a spreadsheet, or a single dashboard tool, and be forgotten a quarter later. A semantic layer is what happens when that model is written down, owned, versioned, access-controlled, and served to every query — human or agent — from one place. The model is the content; the layer is the governance, distribution and lifecycle around it.

Which means the question to ask a vendor is not "do you have a semantic model." Almost everyone does. It is "who can change a definition, what happens to every downstream answer when they do, and can anything outside your product read it."

<!-- section:content-2 -->

## Why 2026 is the year it stops being optional

For years you could run a perfectly good analytics practice without ever using the phrase "semantic layer." You modeled some tables, built some dashboards, and when two dashboards disagreed about revenue, a human noticed in a meeting and someone got assigned to reconcile them. The cost of an undefined metric was real but bounded, because a human sat between the data and the decision.

AI removes that human. That is the whole story of 2026 in one sentence.

When an AI agent answers a business question, there is no review meeting between the query and the decision, so an undefined metric does not get caught. It gets cited. An agent that pipes your raw schema into a language model and asks it to write SQL will produce an answer that is fluent, confident, formatted, and wrong in ways nobody notices until a quarter later. It will pick the wrong revenue column. It will forget the refund exclusion. It will join two tables on a key that looks right and is not. And because the output reads like an analyst wrote it, the failure is invisible at exactly the moment it matters.

The vendors converging on this point in 2026 is not a coincidence. It is the market discovering the same constraint from every direction. Google now markets LookML as the way to ground your AI in truth and frames the whole release as the arrival of ["Agentic BI."](https://cloud.google.com/blog/products/business-intelligence/looker-updates-for-agentic-bi-at-next26/) When the two largest players in data movement and transformation merged, [Fivetran and dbt Labs described the combined company](https://www.fivetran.com/press/fivetran-dbt-labs-complete-merger-to-create-the-data-infrastructure-for-trusted-ai-agents) as the infrastructure layer that makes agents trustworthy. AtScale ran an entire [Semantic Layer Summit](https://www.atscale.com/resource/2026-semantic-layer-summit-on-demand-sessions/) in 2026 on the premise that business context is now critical infrastructure for enterprise AI. The framing has converged because the underlying problem is real.

There is a number worth sitting with. In Fivetran's [2026 Agentic AI Readiness Index](https://www.fivetran.com/resources/reports/the-2026-agentic-ai-readiness-index), nearly 60 percent of enterprises reported investing millions in agentic AI, yet only 15 percent had a data foundation ready to support those workloads safely. That leaves 85 percent that did not. The bottleneck for enterprise AI in 2026 is not model quality. It is whether the data underneath the model has governed meaning the model can rely on. That gap, between AI ambition and AI-ready data, is the entire reason the semantic layer stopped being a nice-to-have.

I will state my position plainly, since this is the part of the post where opinion belongs. I believe the semantic layer is the new database. Not because databases are going away, but because the thing your AI actually queries, the thing that determines whether the answer is right, is no longer the raw store of rows. It is the layer of meaning on top of it. The teams that win with AI on their data in 2026 are the ones that treat that layer as infrastructure rather than as an afterthought.

<!-- section:content-3 -->

## Where the semantic layer came from: a short history

The idea is older than the buzzword. Business Objects and OLAP cubes were selling "a business-friendly layer over the database" in the 1990s. But the modern lineage, the one that matters for 2026, starts with Looker.

Looker was founded in 2012 by Lloyd Tabb and Ben Porterfield, building on a modeling language Tabb had started writing the year before. Its central bet was that language, LookML, a way to define metrics and relationships once and reuse them everywhere. LookML let teams define data relationships outside of SQL and reuse them in ways raw SQL could not, which gave organizations a consistency they had never had. This is the moment the semantic layer became a discrete, ownable artifact rather than a property buried inside a BI tool's report definitions. Google announced its acquisition of Looker in 2019, the $2.6 billion deal closing in early 2020, and LookML quietly became one of the defining components of what people started calling the modern data stack.

Then the center of gravity moved to transformation. dbt made SQL-based modeling a discipline with version control, testing, and documentation, and in doing so it created the natural home for metric definitions to live next to the models that produce them. The dbt Semantic Layer, built on MetricFlow, turned "define your metric once in code" into standard practice for a generation of data engineers. Around the same time, Cube took a different architectural angle, separating the semantic layer from any single BI tool and exposing it as an API, an approach the market started calling headless BI. AtScale carried the enterprise OLAP tradition forward, keeping Excel and MDX alive while bolting modern interfaces onto the same governed model.

So why did the phrase suddenly get cool again? Because the AI era turned the old quiet benefit, consistency, into a hard requirement. A human analyst could compensate for a fuzzy metric definition by knowing what was meant. A language model cannot. The semantic layer went from being the thing that made your dashboards agree to being the thing that makes your AI correct. Lloyd Tabb, the same person who built LookML, has spent recent years on [Malloy](https://github.com/malloydata/malloy), an open-source modeling and query language that tries to rethink how we describe data relationships from scratch. His diagnosis of why SQL needed a successor is the same one that justifies the whole category: "SQL is 50 years old. It has no reusability. If you define a calculation in one SQL query, you're going to be redefining it in another one," he told the [Drill to Detail podcast](https://podscripts.co/podcasts/drill-to-detail/drill-to-detail-ep110-building-a-sequel-to-sql-with-malloy-featuring-special-guests-lloyd-tabb-and-carlin-eng) in 2023. The lineage runs in a straight line from 2011 to now, and the destination is AI.

<!-- section:content-4 -->

## What is inside a semantic layer, and what is not

Strip away the vocabulary differences and a semantic layer contains a small number of things.

It contains **entities**: the nouns of your business, customer, order, subscription, account, and how they relate. It contains **metrics**: named, defined measures like net revenue, active users, or gross margin, each with the exact logic for how it is computed and what it excludes. It contains **dimensions**: the ways you slice those metrics, by time, by region, by plan. It contains **relationships and join logic**, so that "revenue by customer" resolves to the correct path through your tables rather than a plausible-looking wrong one. And increasingly it contains **governance and verification**: who owns a definition, who can change it, and some mechanism for asserting that an answer is correct rather than merely well-formed.

What is _not_ in a semantic layer matters just as much. It does not contain the raw data itself. The rows live in the warehouse and stay there, which is why AtScale emphasizes querying data in place rather than copying it. It is not a data catalog: a catalog tells you a table exists and who owns it, while a semantic layer tells you what the numbers in that table _mean_ and how to compute with them. It is not a knowledge graph, though the two are converging, since Looker's 2026 work turns metadata into a semantic graph through its Knowledge Catalog and the boundary is genuinely blurry. And it is not, by itself, a BI tool. The whole headless premise is that the layer should outlive any particular dashboard product.

![Diagram contrasting two ways an AI agent reaches data. On the left, the wrapper path: an AI agent is pointed straight at the raw warehouse, sees only raw column names, guesses which column is revenue and forgets the refund rule, and returns a fluent but wrong answer. On the right, the semantic layer path: BI dashboards, AI agents, and spreadsheets all query one governed model over MCP, SQL, REST, and GraphQL that holds entities, metrics, dimensions, relationships, and governance and verification, which resolves to one verified query. Both paths read the same underlying warehouse.](https://supaboard-landing-content.fra1.digitaloceanspaces.com/blog/what-is-a-semantic-layer-the-2026-field-guide/f84f814ac3969b93.svg?w=480&h=320)

_Same warehouse, two paths. A wrapper lets the agent guess from raw schema and ship a confident wrong answer. The semantic layer, reachable over MCP, gives every consumer one governed, verified definition of the number._

This inventory matters because it gives you a test. When a vendor says "we have a semantic layer," ask which of these things they actually have. Do metric definitions exist somewhere durable, or are they reconstructed on the fly from column names? Is there join logic, or is the model guessing the path? Is there any verification, or does whatever the system produces simply ship? Most disagreement in this category dissolves once you ask those questions concretely.

<!-- section:content-5 -->

## The 2026 semantic layer landscape, tool by tool

A note on fairness before the tour. Every tool below is solving a real problem for real customers. I have tried to describe each the way its own team would, then say honestly where it strains. I compete with some of these. I have learned from all of them. Treat the criticism as the kind you would give a respected rival, not a competitor you are trying to bury.

### dbt, now Fivetran + dbt Labs (MetricFlow)

**Architecture.** Metrics are defined in code alongside dbt models and compiled deterministically by MetricFlow into SQL, then served through the dbt Semantic Layer API. The defining trait is that the semantic layer is tightly coupled to the transformation layer, so your metrics live next to the models that build them.

**Who it is for.** Teams already running dbt who want metric definitions to live in the same version-controlled, tested, reviewed workflow as the rest of their transformations. [Bilt Rewards](https://www.getdbt.com/case-studies/bilt-rewards) is a clean example: it centralizes its entity relationships in the dbt Semantic Layer and serves governed metrics into customer-facing embedded analytics through dbt's GraphQL endpoint, which let it move off a per-seat BI embed and cut analytics costs by around 80 percent.

**What it does well.** dbt made metric definitions an engineering discipline, and that is its enduring strength. Its [2026 benchmark](https://docs.getdbt.com/blog/semantic-layer-vs-text-to-sql-2026) comparing the semantic layer against raw text-to-SQL is admirably honest: it concedes that models have gotten dramatically better at writing SQL, and still finds that for queries covered by a well-modeled semantic layer, accuracy approaches or hits 100 percent (98 to 100 percent in its runs, versus 84 to 90 percent for raw text-to-SQL) because deterministic generation cannot produce a subtly wrong result. The sharper point underneath the numbers is that text-to-SQL fails _silently_ with a plausible wrong answer, while the semantic layer either returns the right answer or errors out. That is the single most useful fair-minded data point in the category.

**What it does not.** dbt's coverage is bounded by what you have modeled. The benefit is real only where the modeling work has been done, and that work is ongoing labor. It is also, by design, most natural inside the dbt ecosystem.

**Where it is going.** Bigger. The Fivetran and dbt Labs merger [completed on June 1, 2026](https://www.getdbt.com/blog/fivetran-dbt-labs-complete-merger-to-create-the-data-infrastructure-for-trusted-ai-agents), with George Fraser as CEO and Tristan Handy as President, and the explicit positioning is data infrastructure for trusted AI agents, alongside the new Rust-based Fusion engine, whose runtime dbt has open-sourced as dbt Core v2.0 (still early). Handy framed the bet directly: "The companies that deploy AI successfully over the next decade will be the ones whose agents can be trusted to act. Trust is built at the infrastructure layer, on high-quality tooling and on open standards." Nasdaq is an early proof point for that thesis, having [built a governed intelligence layer on dbt and Databricks](https://www.getdbt.com/blog/how-nasdaq-built-a-governed-intelligence-layer-with-dbt-and-databricks) so its agents query governed metric definitions instead of inferring them.

### Cube

**Architecture.** Cube is a headless, universal semantic layer. You define measures and dimensions once, and Cube serves them as a governed model over SQL, REST, GraphQL, and increasingly MCP, so that BI tools, embedded apps, and AI agents all query the same definitions rather than the raw tables.

**Who it is for.** Engineering-led teams building data applications and embedded analytics, and anyone who wants the semantic layer decoupled from any single BI front end. [Webflow](https://cube.dev/case-studies/webflow-delivers-internal-and-external-embedded-analytics-with-cube-cloud) runs Cube Cloud as a universal semantic layer over ClickHouse for both internal and customer-facing analytics, and [Brex](https://cube.dev/case-studies/brex-embedded-ai-financial-analyst) built an embedded AI financial analyst on Cube. The Brex example is worth dwelling on for a fair-minded reader: its team evaluated Cube against the dbt Semantic Layer and LookML and chose Cube for that embedded, agent-facing use case, which is a concrete illustration that these tools win different jobs rather than one being universally best.

**What it does well.** The headless approach is genuinely well-suited to the agentic moment, because an agent can hit a governed metrics API instead of being handed raw schema. Cube co-founder Artyom Keydunov put the thesis cleanly to [SiliconANGLE](https://siliconangle.com/2025/06/02/semantic-data-layer-startup-cube-automates-analytics-ai-agents/): "LLMs are smart, but they can't operate without context, especially in the data domain. Every company defines metrics like revenue or active customers in a unique way. The semantic layer is a way to structure that knowledge and provide it to LLMs so they have that crucial context." Cube's 2026 positioning leans into being an agentic analytics platform built on its open-source core, and it invested early in MCP so agents query governed metrics by default.

**What it does not.** It is developer-first. Someone has to author and maintain the model in code, which means business users are consumers of the layer, not authors of it. For teams without engineering capacity to build the model, that is a real cost.

**Where it is going.** Deeper into agentic analytics, with AI-facing features layered on the same governed core, and broader interface support so any agent can reach the model.

### AtScale

**Architecture.** AtScale is an enterprise universal semantic layer with deep OLAP heritage. It queries data in place, supports MDX and DAX so existing Excel and Power BI workbooks keep working, and uses autonomous aggregates to stay fast on very large fact tables. It now exposes its model to agents through an MCP server and authors models in SML, an open YAML-based modeling language it created and open-sourced.

**Who it is for.** Large enterprises with significant Excel, Power BI, and legacy OLAP investment that want one governed definition across the entire BI estate, often while migrating off SQL Server Analysis Services or Cognos onto a cloud warehouse. [Tyson Foods](https://www.atscale.com/resource/cs-tyson-foods/) is the archetype: it used AtScale's semantic layer to deliver governed, self-service BI to roughly 144,000 employees through Excel, Tableau, and Power BI while migrating its data platform onto Google BigQuery.

**What it does well.** Enterprise governance, OLAP-style analysis at scale, and keeping a decade of existing spreadsheets alive while the data underneath modernizes. Its [open-sourcing of SML](https://www.atscale.com/press/atscale-announces-the-open-source-release-of-semantic-modeling-language/) is a serious bet on semantic models becoming portable rather than locked in. On the agent question, AtScale's Cort Johnson [framed the stakes](https://www.atscale.com/press/atscale-databricks-mcp-marketplace-semantic-layer/) the way enterprises actually feel them: "Agents can respond, but can those responses be trusted? Our MCP integration makes the semantic layer callable as an action service, so organizations can deploy agents that execute governed business logic."

**What it does not.** It is proprietary and enterprise-priced, frequently a six-figure annual commitment, and it is heaviest where there is OLAP-cube heritage to carry forward. For a smaller or greenfield team it can solve a problem they do not yet have.

**Where it is going.** Toward open standards and agent access, positioning the mature enterprise semantic layer as the governed context that AI agents inherit.

### Looker and LookML

**Architecture.** LookML is Google's version-controlled semantic modeling language, the original modern semantic layer, now wired directly into Gemini. Google describes LookML as the foundation of AI accuracy: the governed model that anchors the language model so its answers are grounded rather than guessed.

**Who it is for.** Organizations on Google Cloud and BigQuery that want a governed BI semantic layer and are comfortable in that ecosystem. The Southeast Asian marketplace [Carousell](https://cloud.google.com/customers/looker-carousell) runs its departments on Looker, standardizes its business metrics in LookML, and is building on that governed layer to roll out Conversational Analytics, which is a representative path for a Looker-native shop moving toward agentic BI.

**What it does well.** LookML pioneered governed, reusable definitions, and Looker has executed cleanly on bringing AI on top of that governance, with a LookML AI agent, Conversational Analytics, and a Knowledge Catalog that turns metadata into a semantic graph for agents. The governance story is mature.

**What it does not.** It carries the classic governed-layer tradeoff in its sharpest form. You must model in LookML before anyone gets a first answer, which is a multi-week to multi-month bottleneck, and questions outside the modeled explores return nothing. It is also deeply bound to Google Cloud. Some 2026 comparison guides increasingly suggest keeping Looker for governed KPIs and adding a separate runtime layer for unmodeled questions, which tells you where the friction is.

**Where it is going.** Into agentic BI, with Gemini grounded on LookML and the Knowledge Catalog feeding agents the context they need to act.

### Malloy

**Architecture.** Malloy is an open-source semantic data modeling and query language created by Lloyd Tabb, the lead inventor of LookML. It is language-first: rather than compile a model behind a UI, Malloy aims to be used everywhere you would write a SQL SELECT, with reusable calculations, joins, and queries composed like functions.

**Who it is for.** Data practitioners and language enthusiasts who feel SQL is the wrong abstraction for exploratory analysis and want reuse built into the query language itself.

**What it does well.** It is the most intellectually ambitious attempt in the category to fix modeling at the language level. Its core insight, that you never write just one query so reuse compounds, is genuinely powerful for exploration, and it follows directly from Tabb's assembly-to-C analogy for SQL: the language works, but it lacks the reusability abstractions a modern workflow needs.

**What it does not.** It is still maturing. Its own docs describe it as a work in progress, closer to a modeling language and open-source project than a turnkey enterprise platform, and it has no major named production adopters and a smaller ecosystem than the commercial layers. That is not a knock so much as an accurate status report.

**Where it is going.** As a language and an idea, Malloy is influential well beyond its direct adoption, and its DNA shows up in how the broader category thinks about composable semantic models.

### Supaboard (our approach)

I will describe our own architecture with the same plain honesty I tried to apply to everyone else, including where the tradeoff cuts against us.

**Architecture.** Supaboard does not ship a compiled semantic layer in the dbt or Cube sense, and we should not pretend otherwise. What we ship is a curated context layer that constrains a language model: a master ruleset of hard business constraints, per-table documentation that reconciles when schemas drift, human-approved verified queries kept as canonical examples, schema snapshots, and an uploaded knowledge base. That context is injected into the model, which emits SQL that runs against your warehouse. So it is a semantic layer authored _for the model_ and _from use_, rather than one that compiles queries deterministically up front.

**Who it is for.** Teams that need AI on their data before they have built, or will ever build, a full hand-authored model, and who want domain users to shape the layer conversationally rather than through engineering pull requests.

**What it does well.** Coverage and adaptability. The agent can answer questions nobody pre-modeled, and it gets better through correction: a thumbs-down with a fix becomes a durable instruction, a thumbs-up promotes a query into the verified set, and evals score the agent over time. That correction-to-governance loop is the part that compounds.

**What it does not.** Because the SQL is generated rather than compiled, a wrong answer is possible in a way it is not for a modeled metric in Cube or dbt. I am honest that this is the tradeoff, and the verified queries, corrections, and evals exist precisely to drive that error rate down. We are buying lower activation energy and paying for it with feedback loops.

**How a high-stakes number gets verified.** The honest answer to "a wrong answer is possible" is that the numbers which can actually hurt you do not ride on free generation. When a metric matters, net revenue, churn, anything headed for a board deck or an external agent, it gets pinned to a verified query: a human-approved canonical SQL that the agent replays deterministically instead of writing fresh each time. For that metric the agent behaves like a compiled definition, because it is no longer generating SQL, it is returning a query a person already signed off on. Around the questions nobody has pinned yet, generation still happens, but inside guardrails. Every generated query is checked against the master ruleset before it runs, so a hard constraint like "always exclude test accounts" cannot be skipped, and against the current schema snapshot, so it fails closed if a column moved rather than silently returning a wrong join. Execution is read-only, so the worst case is a bad read, never a write. And every answer carries its provenance: which tables it touched, which rules applied, and whether it matched a verified query or was generated fresh, so a decision-maker sees a "verified" or "exploratory" status rather than a bare number, and an external-facing agent can be restricted to the verified path and refuse to ship anything else. Then the loop closes: a wrong exploratory answer gets a thumbs-down with a fix that becomes a durable rule or a new verified query, and the eval suite replays the verified set on every change to catch regressions before they reach anyone. The error rate is not zero on day one. The point is that it is bounded, observable, and falling, and that the high-stakes numbers are the first ones promoted out of generation entirely.

**Where it is going.** Toward the convergence I describe below: a mature agent's accumulated rules and verified queries are, in effect, an emergent semantic layer, authored by feedback rather than by engineers up front.

### The landscape at a glance

| Tool | Core architecture | Who it is for | What it does well | What it strains on | Where it is going |
| --- | --- | --- | --- | --- | --- |
| **dbt (Fivetran + dbt Labs)** | Code-defined metrics compiled by MetricFlow, coupled to transformation | dbt-native data teams (e.g. Bilt Rewards, Nasdaq) | Metric definitions as engineering discipline; deterministic accuracy | Bounded by what is modeled; ecosystem-centric | Bundled data infrastructure for trusted agents |
| **Cube** | Headless universal layer over SQL/REST/GraphQL/MCP | Engineering-led app and embedded analytics teams (e.g. Brex, Webflow) | Decoupled, agent-ready governed metrics API | Developer-first; business users consume, not author | Deeper agentic analytics on an open core |
| **AtScale** | Enterprise OLAP layer, queries in place, MDX/DAX, MCP, SML | Large enterprises with OLAP/Excel heritage (e.g. Tyson Foods) | Governance and scale; keeps legacy interfaces alive | Proprietary, six-figure, cube-heritage heavy | Open standards and agent access |
| **Looker (LookML)** | Version-controlled BI-native model, Gemini-grounded | Google Cloud and BigQuery organizations (e.g. Carousell) | Mature governance; clean AI-on-top execution | Model-before-first-answer; GCP lock-in | Agentic BI on a semantic graph |
| **Malloy** | Open-source, language-first modeling and query language | Practitioners who want reuse in the language | Most ambitious rethink of modeling | Still maturing; no named production adopters | Influential as a language and idea |
| **Supaboard** | Curated context layer steering an LLM, authored from use | Teams needing AI before a model exists | Coverage, adaptability, correction-driven learning | Generated SQL can be wrong; relies on verification | Emergent semantic layer from feedback |

<!-- section:content-6 -->

## The "semantic layer in name only" problem

Here is where I have to be careful, because the easy version of this section is a hit list, and the easy version is worthless. If a founder spends a section calling competitors fake, every reader rightly discounts the whole post. So I will do something more useful: give you a test, and apply it to a pattern rather than to a list of names.

The test has three questions. A real semantic layer captures business meaning durably, learns from correction, and verifies before it answers. A wrapper does none of these. It hands raw schema to a model and ships whatever comes back.

One: **is business meaning captured somewhere durable and governed**, or reconstructed from column names on every request? Two: **when the system gets an answer wrong, is there a mechanism that makes it permanently right**, a verified-query promotion, a correction memory, a metric definition someone edits? Three: **is there verification before the answer ships**, evals, governed definitions, a human-approved canonical example, anything? A real semantic layer answers yes to all three, whether it authored its meaning up front like Cube and dbt or learned it from use like Supaboard. A wrapper answers no to all three. To be fair about my own side of this: an emergent layer's "yes" on the first question is softer than a compiled definition's, since injected context is more durable than nothing but less durable than a versioned metric. The verified-query loop is what hardens it over time.

Now the honest part about what wrappers actually are. The most common shape in 2026 is not a villain with a logo. It is a default pattern: point a general-purpose model at your database and ask. That includes a plain ChatGPT or Claude connection pointed at a warehouse, a text-to-SQL box bolted onto an existing dashboard tool, and a class of "connect your data and just ask" products that ship raw schema into a model with no correction loop and no verification. The honest text-to-SQL libraries in this space, the ones that describe themselves as text-to-SQL rather than as a semantic layer, are not the problem, because they are not claiming something they lack. The problem is anything marketed as "AI that understands your business" that, under the hood, is a model guessing from column names.

Why it matters for accuracy is not a matter of opinion. [Denodo's testing](https://www.datamanagementblog.com/improving-the-accuracy-of-llm-based-text-to-sql-generation-with-a-semantic-layer-in-the-denodo-platform/), [Wren AI's analysis](https://www.getwren.ai/post/why-the-semantic-layer-is-essential-for-reliable-text-to-sql-and-how-wren-ai-brings-it-to-life), [Snowflake's Cortex Analyst engineering work](https://www.snowflake.com/en/blog/engineering/agentic-semantic-model-text-to-sql/), and [dbt's own benchmark](https://docs.getdbt.com/blog/semantic-layer-vs-text-to-sql-2026) all point the same direction: adding governed semantics measurably raises text-to-SQL accuracy, and Snowflake reports roughly a twenty-point average lift, from about 57 percent to 78 percent, from a proper semantic model over an LLM alone. The wrapper is not a cheaper semantic layer. It is the absence of one, sold as the presence of one.

<!-- section:content-7 -->

## How to evaluate a semantic layer for your stack

If you are choosing one this year, here is the framework I would actually use, written as questions to ask a vendor and yourself.

**1\. Authored or emergent: which fits your reality?** Do you have data engineers who will build and maintain a model before anyone asks a question, or do you need answers before that model exists? This is the first fork, and it eliminates half the options immediately. Looker, dbt, and Cube assume the former. Tools like ours assume the latter.

**2\. Where do metric definitions live, and can they travel?** A definition trapped inside one BI tool re-creates the inconsistency you were trying to fix the moment you add a second tool. Ask whether the layer is exposed over open interfaces and whether the model is portable. The [Open Semantic Interchange](https://www.snowflake.com/en/news/press-releases/snowflake-salesforce-dbt-labs-and-more-revolutionize-data-readiness-for-ai-with-open-semantic-interchange-initiative/) effort, launched in 2025 by Snowflake, Salesforce, dbt Labs, and others, exists precisely because lock-in is the failure mode here.

**3\. What happens to a wrong answer?** This is the question that separates a toy from infrastructure. Is there a correction mechanism, a verified-query loop, a way for a fix to become permanent? A system that cannot learn from its mistakes will make the same one forever.

**4\. Deterministic compilation or generated SQL, and what is your tolerance?** Compiled metrics cannot be subtly wrong but cannot answer what was not modeled. Generated SQL can answer anything but can be wrong. Neither is universally correct. Match the tradeoff to how much a wrong number costs you in your specific context.

**5\. Who authors and edits the layer?** Engineers in YAML through pull requests, or domain experts conversationally? This determines who actually maintains your business logic and how fast it stays current as the business changes.

**6\. How does it expose meaning to agents?** In 2026 this means asking, concretely, whether it speaks SQL, REST, GraphQL, and MCP. MCP in particular is becoming the way agents reach governed metrics instead of raw tables, and a layer with no agent interface is already behind.

**7\. What is the total cost and time to first answer?** An enterprise OLAP layer at six figures with a multi-month modeling phase is the right answer for some organizations and absurd overkill for others. Be honest about which you are before you fall in love with a demo.

<!-- section:content-10 -->

## Where the category goes in 2027

Predictions are cheap, so each of these comes with a reason and a name you can check it against.

**Prediction one: the semantic layer becomes an interoperability standard, not a product feature.** By 2027 the competitive question shifts from "whose semantic layer is best" to "whose semantic definitions travel," driven by the Open Semantic Interchange initiative and the standardization of MCP as the way agents reach metrics. The reason is structural: every vendor now agrees agents need governed context, and the only way to avoid a dozen incompatible context formats is an open interchange. Cube and the warehouse vendors are backing OSI, AtScale is pushing its own open SML, and everyone is moving the same way.

**Prediction two: authored and emergent semantic layers converge.** The governance-first tools are adding feedback and agentic authoring, and the adoption-first tools are hardening into governed models, so by 2027 the distinction between "modeled up front" and "learned from use" will be a spectrum rather than a wall. Watch the signals: Looker's Knowledge Catalog turning metadata into a semantic graph, Snowflake's agentic system that improves the semantic model itself, Cube's AI-facing layer, and emergent approaches like ours hardening verified queries into governed definitions. The honest counter is that convergence could swallow the emergent-only players instead of validating them. If incumbents add adaptability and keep determinism, the unique value of "emergent from use" shrinks. My bet is that the modeling burden, not the technology, is what most teams never overcome.

**Prediction three: better text-to-SQL does not kill the semantic layer, it relocates the value to governance.** As models get better at writing SQL, the differentiator stops being "can it generate a query" and becomes "can it prove the number is right," which is exactly what a semantic layer provides and a raw model does not. dbt's own 2026 benchmark is the tell: even as it documents how much better models have gotten at SQL, its recommendation still routes accuracy-critical enterprise work through the semantic layer.

**Prediction four: consolidation accelerates, and the semantic layer gets absorbed into AI-data-infrastructure platforms.** The Fivetran and dbt Labs merger is the leading indicator, bundling movement, transformation, and semantics into one stack pitched at agents, while warehouse-native layers from Snowflake and Databricks pull semantics closer to the data. Standalone layers will not disappear, but more of them will be features of larger platforms by 2027.

<!-- section:content-11 -->

## Where Supaboard sits, honestly

We are one player in a crowded landscape, and I would rather you believe the rest of this post than oversell our corner of it.

Supaboard makes AI useful on your data before a hand-built model exists. Cube and dbt and Looker make AI safe by narrowing it to a model someone authored first, and that is the right choice when you have the engineering capacity and the tolerance for a modeling phase. We took the other side of the tradeoff on purpose: we let domain users build the layer from corrections, verified queries, and rules as they actually use the system, which means a wrong answer is possible, and the verified-query loop, the correction memory, and the evals exist to drive that rate down over time. We are governance-arrived-at, not governance-up-front.

Here is the honest closing thought, and it is also why I do not think this is a zero-sum fight. A mature Supaboard agent's accumulated ruleset and verified queries are an emergent semantic layer, authored by feedback rather than by engineers, which is why I believe most teams will end up with a governed layer whether or not they ever sat down to build one. The bet is not that we model better than Cube. It is that most organizations will never hand-build the Cube model, so the layer has to assemble itself from use. If your team has the engineers and the patience, build the authored layer and you will get correctness by construction. If you do not, the layer can still emerge, and that is the gap we exist to fill. Either way, the conclusion I opened with holds: the semantic layer is the new database, and in 2026 it stopped being optional.

If you want to see the emergent-layer approach concretely, [docs.supaboard.ai/agents](https://docs.supaboard.ai/agents) walks through how corrections and verified queries become governed business logic.

<!-- section:content-8 -->

## FAQ

**What is a semantic layer?** A semantic layer is the governed body of business meaning, the metrics, entities, relationships, and verified logic, that sits between raw data and whoever or whatever is querying it, so questions resolve to shared definitions instead of guesswork. It can be authored up front in a modeling language or emerge from curated rules and corrections, but in both cases it is the layer that tells you what the numbers mean.

**Do I need a semantic layer?** If humans read every number before it drives a decision, you can survive without an explicit one, though you will still pay for inconsistent metrics. If AI agents answer questions directly, you need one, because there is no human in the loop to catch an undefined metric before it gets cited. The more your data feeds AI, the less optional it is.

**dbt Semantic Layer vs Cube: what is the difference?** Both let you define a metric once and reuse it, but dbt couples the semantic layer to transformation, so metrics live in code next to your dbt models and compile through MetricFlow, which is ideal if you already run dbt. Cube is headless and decoupled, exposing one governed model over SQL, REST, GraphQL, and MCP to any BI tool, embedded app, or agent, which suits teams that want the layer independent of any front end. dbt is transformation-native, Cube is interface-agnostic, and companies like Brex have chosen Cube specifically for embedded, agent-facing analytics.

**Is the semantic layer dead now that LLMs can write SQL?** No, and the best evidence comes from people who measured it. Models did get dramatically better at SQL, but dbt's 2026 benchmark still finds the semantic layer wins on enterprise accuracy because deterministic generation cannot be subtly wrong. Better text-to-SQL raises the floor, it does not remove the need to govern what a metric means.

**Do AI BI tools need a semantic layer?** Yes, in substance even if not always in name. An AI BI tool without governed meaning is guessing from column names, which is exactly how confident wrong answers happen. The governed meaning can be a compiled model or an emergent context layer of rules and verified queries, but something has to carry the business logic, or the AI is improvising.

**What is the difference between a semantic layer and a data catalog or knowledge graph?** A data catalog tells you what data exists and who owns it. A knowledge graph maps how entities relate. A semantic layer tells you what the numbers _mean_ and how to compute metrics correctly. They overlap and are converging, since Looker's Knowledge Catalog now builds a semantic graph, but the semantic layer's defining job is governed computation, not just discovery or relationships.

**Can a semantic layer improve text-to-SQL accuracy?** Yes, measurably. Denodo and Snowflake have both reported double-digit accuracy gains from adding governed semantics, with Snowflake's Cortex Analyst work showing roughly a twenty-point lift over an LLM alone, and analyses from Wren AI and dbt point the same way. Semantics give the model the business context it cannot infer from schema.

**Is a semantic layer the same as a metrics layer?** A metrics layer, defining named measures like net revenue once, is the heart of a semantic layer, but a full semantic layer is broader: it also carries entities, dimensions, relationships and join logic, and governance. Every semantic layer contains a metrics layer, but not every metrics layer is a complete semantic layer.
