# Why Supaboard uses backticks instead of generated HTML

A rich AI answer should not need a new piece of interactive software every time you ask a question.

If you ask why revenue changed, the answer might need a headline number, a trend chart, a regional breakdown, and a table of supporting records. Those visuals should work together and use the capabilities of the product you are already in.

At Supaboard, we use backticked strings to assemble that experience. Short markers connect the written answer to reusable visualisations and other supported blocks. The answer describes what to show; Supaboard supplies the presentation and behaviour.

For analytics inside a product, that gives us a practical advantage over generating a complete HTML experience for every response: **richer capabilities with less repeated presentation code.**

## HTML makes a compelling starting point

In [*Using Claude Code: The unreasonable effectiveness of HTML*](https://claude.dev/blog/using-claude-code-the-unreasonable-effectiveness-of-html/), Anthropic’s Thariq Shihipar argues that HTML makes AI outputs more readable, expressive, and shareable. A document can include diagrams, navigation, and interactive controls rather than relying on a long wall of text.

We agree with the goal. The question for Supaboard is what each new answer needs to generate to achieve it.

A self-contained HTML answer can carry its own layout, styling, charts, and JavaScript. That flexibility is useful for a custom explainer. In an analytics product, however, many of those capabilities already exist. Recreating them in each answer repeats work that the product can provide once.

## One answer can combine many visualisation options

A chart, a table, and a KPI are different ways of understanding data. A chart reveals a pattern. A table lets you inspect detail. A KPI makes an important value easy to find.

Our backticked format gives these different outputs a common way to appear in an answer. A finding can be followed by its chart, then a supporting table, a recommendation, or an infographic. Each part uses an established visual format while fitting into the same narrative.

The answer references the underlying result rather than embedding a separate copy of the data inside a custom visual. That keeps the connection between the explanation and its evidence explicit.

Separating the result from its presentation also makes reuse possible. In Supaboard’s query workspace, for example, you can inspect a result as a table and switch to a chart or KPI when that representation fits the data. Changing how you look at a result does not require turning it into a completely separate HTML document.

This is the interoperability we care about: different visualisation options can participate in the same answer and draw on the same result structure.

## A visual brings more than its appearance

Drawing a chart is only part of the job. Readers may want to inspect a value, explore a breakdown, or see the records behind a number.

In Supaboard dashboards, charts and tables can offer records inspection and drill-through where the query supports it. Configured table interactions can apply a value to a matching dashboard filter. These behaviours belong to the product’s visualisation system.

A conventional HTML string does not provide those capabilities by itself. They need JavaScript and connections to the application’s data and controls. If each generated answer builds its own version, it also carries more code to check, maintain, and keep consistent.

With reusable blocks, an answer can use a supported visual without redefining its behaviour. The product supplies the interactions appropriate to the surface where it appears.

That matters because a useful analytical answer should remain connected to the tools people use to investigate it.

## Blocks can extend beyond charts and tables

An AI conversation sometimes needs to do more than display information. It may need to ask for clarification, present something for approval, or offer a card that opens a generated report or dashboard.

HTML has buttons and forms, but a button alone does not know which action it represents, what needs approval, or which artifact to open. That behaviour requires application logic.

A supported block can package that meaning and behaviour together. Supaboard’s answer format can accommodate these specialised blocks alongside insights and visualisations, using the application’s existing handling rather than a fresh script written for each answer.

Adding a new block still requires product work. The advantage is that we implement support once. Subsequent answers can use it through the same compact format.

This makes the format extensible without making every answer responsible for implementing every capability it uses.

## The efficiency comes from what we reuse

Backticks themselves are just markers. Their value comes from the reusable capabilities behind them.

The answer can point to a result without copying all its rows into the prose. It can request a supported visual without carrying the code that draws it. It can include a specialised block without rebuilding the interaction around it.

There is less presentation code to repeat, and improvements to the product’s visualisations can benefit answers that use them. Readers also get consistent controls instead of a different interaction design for every response.

The same answer structure can serve conversations, dashboard chat, and exported reports, with presentation adapted to each surface. Interoperability does not mean a PDF behaves like a dashboard; it means the underlying answer does not need to be rewritten from scratch for each destination.

## Why we prefer this approach for analytics

HTML can also use shared libraries and application components. Once it does, it adopts the same useful principle: reuse the product’s capabilities instead of generating them all over again.

Our backticked format makes that principle the default. It trades the freedom to invent any page layout for a compact way to combine supported insights, visualisations, and interactions.

For Supaboard, that is the stronger choice. Every new question can draw on the product’s accumulated capabilities, while the answer stays focused on the analysis and the evidence that supports it.
