---
slug: why-we-changed-how-supaboard-ai-works
status: published
title: Why we changed how Supaboard’s AI works
description: >-
  Why we rebuilt Supaboard’s AI around one conversation: a founder’s account of
  carrying context from an investigation into dashboards and recurring reports.
category: company
format: founder-story
tags:
  - SaaS
  - Analytics
publishedAt: '2026-10-13'
updatedAt: '2026-10-13'
readMinutes: 3
readLabel: 3 Min Read
author:
  name: Subhrajyoti Modak
  title: Co-Founder & CTO
  role: Co-Founder & CTO
  avatar: >-
    https://supaboard-landing-content.fra1.digitaloceanspaces.com/blog/authors/0b5807dfc3694948.jpeg
cover:
  url: >-
    https://supaboard-landing-content.fra1.digitaloceanspaces.com/blog/why-we-changed-how-supaboard-ai-works/43c5f6a2ce5e6b19.jpg
  alt: >-
    Supaboard founder story: one conversation connects a question, investigation
    and ongoing monitoring.
  width: 1672
  height: 941
ogImage: >-
  https://supaboard-landing-content.fra1.digitaloceanspaces.com/blog/why-we-changed-how-supaboard-ai-works/43c5f6a2ce5e6b19.jpg
sections:
  - id: content-2
    heading: The investigation determined what people wanted to track
  - id: content-3
    heading: We tested a workflow built around the conversation
  - id: content-4
    heading: 'One conversation, from investigation to monitoring'
featured:
  choice: null
  trending: null
related:
  - agentic-analytics
  - ai-dashboard-explained
  - self-service-bi
pillar: no-data-team
cluster: ai-bi
targetQuery: why we changed how Supaboard AI works
intent: informational
audience: both
funnel: mofu
tldr:
  - >-
    Users decided what to monitor while investigating a problem through
    conversation.
  - >-
    Supaboard tested carrying that context into dashboards and recurring
    reports.
  - Customer feedback guided iterations of the centralised AI system.
internalLinks:
  - agentic-analytics
  - ai-dashboard-explained
  - self-service-bi
citations: []
statsCount: 0
---
<!-- section:content-1 -->

We changed how Supaboard’s AI works because people were using it to follow a problem from investigation through to monitoring. Our product was organised around separate features, and that structure didn’t reflect the workflow we were seeing.

When we started building Supaboard, dashboards had their place, automations had theirs, and AI was another feature you could open when you needed it. That layout made sense to us. Each part had a clear job, and we knew where everything belonged.

<!-- section:content-2 -->

## The investigation determined what people wanted to track

People would come to the AI with a problem in their data and ask follow-up questions to understand it. As the investigation became more specific, they would start deciding what needed to be monitored.

Consider a revenue drop as an example. Someone starts by asking what changed, then works through the answer until the investigation narrows to a particular customer segment. At that point, they might want a live dashboard tracking that segment or a weekly report explaining what has changed.

They didn’t necessarily arrive knowing they needed a dashboard or report. They figured that out through the conversation.

By then, they had also established context that mattered to the next step: the segment they were interested in, the question they wanted answered, and what they wanted to keep watching. The monitoring was a continuation of the investigation.

Our layout placed analysis, dashboards and automations in separate parts of the product. Watching that sequence made us question the boundary between them. We needed to think about how the understanding built during an investigation could remain useful when someone decided to track the finding.

<!-- section:content-3 -->

## We tested a workflow built around the conversation

Our hypothesis was that the AI could carry the question and its context through the whole workflow, from understanding a problem to setting up a way to monitor it.

We talked to founders, enterprise users and data analysts, then piloted the idea with a startup that was already a client. The pilot gave us somewhere to test the hypothesis while we worked through what it meant for the product.

Getting it to work required us to rethink how the different parts of Supaboard worked together. The conversation needed to connect the investigation to the dashboard or recurring report that came out of it. That meant considering what context should carry forward and what the user would still need to decide.

We went through iterations, brought the changes back to customers, and used their feedback to revise the next version.

<!-- section:content-4 -->

## One conversation, from investigation to monitoring

That work became the centralised AI system. The conversation could now carry someone from understanding a problem to creating a [live dashboard](https://supaboard.ai/product/dashboards) or setting up a [recurring report](https://supaboard.ai/product/automations) about it.

![A business investigation carries its question, customer segment and monitoring focus into a live dashboard or recurring report.](https://supaboard-landing-content.fra1.digitaloceanspaces.com/blog/why-we-changed-how-supaboard-ai-works/09fcc5345a82a3d5.png)

For the revenue example, the person could investigate a customer segment, decide it needed ongoing attention, and continue towards tracking it through the same conversation. The question they had worked through could inform what they created next.

Looking back, we were comfortable with the original layout because we understood the features and knew where each one belonged. Watching people use the product gave us a reason to question that comfort.

Try it with a question you’re already working on. [Start with Supaboard’s AI](https://supaboard.ai/), investigate the answer, then turn what needs tracking into a dashboard or recurring report.
