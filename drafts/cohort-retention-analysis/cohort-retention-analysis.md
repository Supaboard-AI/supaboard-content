---
title: "Cohort retention: a good first week can hide a bad trend"
description: "A strong first week can hide declining retention. Learn what cohort curves reveal about recurring value, product improvements, and sustainable SaaS growth."
date: "2026-10-14"
author: "Aritra Ghosh"
canonical: "https://supaboard.ai/blog/cohort-retention-analysis"
slug: "cohort-retention-analysis"
site_name: "Supaboard"
lang: "en"
status: "draft"
tags: ["Product analytics", "User retention"]
kicker: "Product analytics"
og_image_alt: "Illustrative retention curves: cohort A starts at 75% in week one but reaches zero by week four; cohort B starts at 32% and remains near 30%."
---

# Cohort retention: a good first week can hide a bad trend

Most SaaS founders think they understand retention. They have their percentages and can see how many people come back to use their product.

What those percentages don't tell them on their own is whether those people keep coming back.

I was one of those founders, until [a lesson from David Lieb at Y Combinator](https://www.youtube.com/watch?v=VNxBZ7ka5J0) changed the way I read those numbers. I stopped looking at benchmarks to tell me the product was doing well and started asking, “Are the cohorts stabilising?”

That question changes what you look for. A promising first week can give way to a cohort with nobody returning. A less impressive first week can leave you with people who return because the product has become useful to them. If you judge both groups too early, you can mistake the first for success and the second for failure.

> **Key takeaways**
>
> - A retention percentage needs a history: follow what happens to the same starting group over time.
> - A sustained plateau suggests recurring use. Its duration, cohort size, and underlying behaviour determine how much confidence it deserves.
> - Compare cohorts at the same age, then investigate why some users return and others don't.

## The stronger start does not always last

Imagine two groups of people trying your product. After the first week, one appears much more likely to return. It would be tempting to build on that experience.

Give both groups more time, and the picture changes.

<figure class="inline-chart editorial-chart" id="early-versus-lasting" role="img" aria-label="Illustrative cohort A: 100,75,50,35,0 percent; B: 100,32,32,32,30 percent at weeks zero to four. A starts stronger, but B retains a returning group.">
<div class="chart-head"><p class="chart-kicker">Two illustrative cohorts</p><p class="chart-heading"><strong>The early lead disappears</strong></p><div class="chart-legend"><span class="chart-key"><span class="key-line series-a"></span>Cohort A<span class="key-value">0% at week 4</span></span><span class="chart-key"><span class="key-line series-b"></span>Cohort B<span class="key-value">30% at week 4</span></span></div></div>
<div class="chart-measure">Returning users</div><div class="plot-grid"><div class="y-ticks"><span>100%</span><span>50%</span><span>0%</span></div><svg viewBox="0 0 640 240" preserveAspectRatio="none" role="presentation" aria-hidden="true"><line class="chart-grid" x1="8" y1="12.0" x2="632" y2="12.0"></line><line class="chart-grid" x1="8" y1="120.0" x2="632" y2="120.0"></line><line class="chart-grid" x1="8" y1="228.0" x2="632" y2="228.0"></line><polyline class="chart-series series-a" points="8.00,12.00 164.00,66.00 320.00,120.00 476.00,152.40 632.00,228.00"></polyline><circle class="chart-dot series-a" cx="632.0" cy="228.0" r="3.2"></circle><polyline class="chart-series series-b" points="8.00,12.00 164.00,158.88 320.00,158.88 476.00,158.88 632.00,163.20" stroke-dasharray="6 5"></polyline><circle class="chart-dot series-b" cx="632.0" cy="163.20000000000002" r="3.2"></circle></svg></div><div class="x-ticks"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span></div><div class="chart-axis-label">Weeks since first action</div>
<figcaption>A stronger first week does not guarantee a returning group. Illustrative data.</figcaption>
</figure>

The early leader keeps losing returning users. The other group settles into a much flatter pattern. That doesn't establish that anyone will stay forever, but it changes which experience deserves a closer look.

This is what cohort retention makes visible. A cohort is a group that starts with the same qualifying action during the same period. Following that group over time lets you see whether people continue to use the product after their initial encounter. Every curve starts at week zero, so you compare time since starting even when the groups joined on different dates.

A single percentage hides that history. The same rate can sit on a flattening curve or a declining one. Those situations call for different decisions.

A benchmark can still provide context. It cannot tell you which of those two situations you're in.

## What are people returning to do?

The lines above count people repeating an action. What that action is determines whether the pattern tells you anything useful about your product.

Someone can log in, fail to find what they need, and leave. If that counts as a successful return, the chart may improve while the experience stays disappointing. The action you measure should be close enough to the product's value that repeating it means something.

At Supaboard, I use asking the AI a question about your business. People come to [understand their business data](https://supaboard.ai/product/ask-analysts), so asking a question is more meaningful for this analysis than opening the app. It is still a proxy: a question that receives an unhelpful answer does not demonstrate value delivered. The curve tells us who repeats the behaviour; those users can tell us why.

The same reasoning applies to timing. Business figures change, and users may have new questions the following week. Weekly measurement makes sense for this example. A news product might expect daily returns; a travel product may wait months for someone to need another booking. Measuring too soon can make a useful product look unsuccessful simply because its users don't need it yet.

Those choices define the people you are actually studying. A cohort of first-question users is different from a cohort of website visitors or signups. If people never reach that first question, this particular retention chart won't explain their experience. You need to examine that part of the journey separately.

## A dashboard is useful when it makes the comparison fair

The practical value of a retention dashboard is that it keeps these definitions visible while you look for a pattern.

I used [Datasites](https://supaboard.ai/product/datasites) to put the retention triangle and curves in one place, using three inputs:

> **Action:** asking the AI a business question.  
> **Interval:** weekly cohorts.  
> **History:** the last six complete weeks.

With the data connected, I could return to the same view as more observations became available. A chart you see once can show a promising pause; a view you revisit can show whether it lasts.

The example below follows six weekly cohorts. These dashboard values illustrate how to read retention; they are not benchmarks for your product.

<table>
<thead><tr><th>Cohort starts</th><th>Users</th><th>Week 0</th><th>Week 1</th><th>Week 2</th><th>Week 3</th><th>Week 4</th><th>Week 5</th></tr></thead>
<tbody>
<tr><td>31 Aug</td><td>128</td><td>100%</td><td>44%</td><td>23%</td><td>16%</td><td>13%</td><td>12%</td></tr>
<tr><td>7 Sep</td><td>137</td><td>100%</td><td>46%</td><td>26%</td><td>18%</td><td>15%</td><td>—</td></tr>
<tr><td>14 Sep</td><td>145</td><td>100%</td><td>48%</td><td>28%</td><td>19%</td><td>—</td><td>—</td></tr>
<tr><td>21 Sep</td><td>152</td><td>100%</td><td>50%</td><td>30%</td><td>—</td><td>—</td><td>—</td></tr>
<tr><td>28 Sep</td><td>169</td><td>100%</td><td>53%</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>
<tr><td>5 Oct</td><td>176</td><td>100%</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>
</tbody>
</table>

*A dash means the cohort has not reached that week yet.*

<figure class="inline-chart editorial-chart" id="recorded-cohort-curves" role="img" aria-label="Six recorded example cohorts aligned at week zero. 31 Aug: 100,44,23,16,13,12 percent; 7 Sep: 100,46,26,18,15 percent; 14 Sep: 100,48,28,19 percent; 21 Sep: 100,50,30 percent; 28 Sep: 100,53 percent; 5 Oct: 100 percent. Missing periods are not plotted.">
<div class="chart-head"><p class="chart-kicker">Example dashboard</p><p class="chart-heading"><strong>A longer history tells a different story</strong></p><div class="chart-legend"><span class="chart-key"><span class="key-line series-a"></span>31 Aug · oldest cohort</span><span class="chart-key"><span class="key-line series-context"></span>Newer cohorts</span></div></div>
<div class="chart-measure">Returning users</div><div class="plot-grid"><div class="y-ticks"><span>100%</span><span>50%</span><span>0%</span></div><svg viewBox="0 0 640 240" preserveAspectRatio="none" role="presentation" aria-hidden="true"><line class="chart-grid" x1="8" y1="12.0" x2="632" y2="12.0"></line><line class="chart-grid" x1="8" y1="120.0" x2="632" y2="120.0"></line><line class="chart-grid" x1="8" y1="228.0" x2="632" y2="228.0"></line><circle class="chart-dot series-context" cx="8.0" cy="12.0" r="3.2"></circle><polyline class="chart-series series-context" points="8.00,12.00 132.80,113.52" stroke-dasharray="5 5"></polyline><circle class="chart-dot series-context" cx="132.8" cy="113.52000000000001" r="3.2"></circle><polyline class="chart-series series-context" points="8.00,12.00 132.80,120.00 257.60,163.20" stroke-dasharray="5 5"></polyline><circle class="chart-dot series-context" cx="257.6" cy="163.20000000000002" r="3.2"></circle><polyline class="chart-series series-context" points="8.00,12.00 132.80,124.32 257.60,167.52 382.40,186.96" stroke-dasharray="5 5"></polyline><circle class="chart-dot series-context" cx="382.4" cy="186.96" r="3.2"></circle><polyline class="chart-series series-context" points="8.00,12.00 132.80,128.64 257.60,171.84 382.40,189.12 507.20,195.60" stroke-dasharray="5 5"></polyline><circle class="chart-dot series-context" cx="507.2" cy="195.60000000000002" r="3.2"></circle><polyline class="chart-series series-a" points="8.00,12.00 132.80,132.96 257.60,178.32 382.40,193.44 507.20,199.92 632.00,202.08"></polyline><circle class="chart-dot series-a" cx="632.0" cy="202.08" r="3.2"></circle></svg></div><div class="x-ticks"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></div><div class="chart-axis-label">Weeks since first action</div>
<figcaption>The oldest cohort is still declining. Shorter lines belong to newer cohorts with less history.</figcaption>
</figure>

The longer history is still falling. Now hold the age constant and compare how each cohort did in its first week.

<figure class="inline-chart editorial-chart" id="same-age-comparison" role="img" aria-label="Week one retention by cohort: August31 44%, September7 46%, September14 48%, September21 50%, September28 53%. The latest cohort has not completed week one.">
<div class="chart-head"><p class="chart-kicker">Compare the same cohort age</p><p class="chart-heading"><strong>The first week is getting stronger</strong></p><div class="chart-legend"></div></div>
<div class="bar-list"><div class="bar-row"><span class="bar-name">31 Aug</span><span class="bar-track"><span class="bar-fill value-44"></span></span><span class="bar-value">44%</span></div><div class="bar-row"><span class="bar-name">7 Sep</span><span class="bar-track"><span class="bar-fill value-46"></span></span><span class="bar-value">46%</span></div><div class="bar-row"><span class="bar-name">14 Sep</span><span class="bar-track"><span class="bar-fill value-48"></span></span><span class="bar-value">48%</span></div><div class="bar-row"><span class="bar-name">21 Sep</span><span class="bar-track"><span class="bar-fill value-50"></span></span><span class="bar-value">50%</span></div><div class="bar-row"><span class="bar-name">28 Sep</span><span class="bar-track"><span class="bar-fill value-53"></span></span><span class="bar-value">53%</span></div></div><div class="bar-scale"><span>0%</span><span>50%</span><span>100%</span></div>
<figcaption>Each bar shows the same point in a cohort’s life. The latest cohort is not old enough to compare yet.</figcaption>
</figure>

These charts reveal two things at once: early retention is stronger in newer cohorts, while lasting retention remains an open question. The encouraging bars do not cancel out the declining curve.

The definitions underneath it matter just as much as the visible numbers. Each percentage uses the original cohort size as its denominator and counts distinct returning people. Twenty questions from one person still count as one returning user. Someone can skip a week and come back later, so a cohort's percentage can rise as well as fall. Week zero is 100% because the qualifying action is how people enter the cohort.

The missing cells matter, too. Turning them into zeroes would make newer cohorts appear to have failed before they had the chance to return.

In this example, a week runs Monday to Sunday. That differs from a rolling seven-day window starting with each person's first action, a distinction [Amplitude explains in its retention documentation](https://amplitude.com/docs/analytics/charts/retention-analysis/retention-analysis-time). The dashboard also identifies first questions from the history available to it. If earlier activity is missing, “first recorded use” may not be someone's first-ever use. Those are limits on the conclusion, even when the chart looks convincing.

## A plateau gives you people to learn from

<figure class="inline-chart editorial-chart" id="plateau-signal" role="img" aria-label="Illustrative cohort B returns: 100,32,32,32,30 percent from week zero through week four. The short flat segment is highlighted. No future values are projected.">
<div class="chart-head"><p class="chart-kicker">A short segment, not a forecast</p><p class="chart-heading"><strong>A returning group begins to emerge</strong></p><div class="chart-legend"><span class="chart-key"><span class="key-line series-b"></span>Cohort B</span></div></div>
<div class="chart-measure">Returning users</div><div class="plot-grid"><div class="y-ticks"><span>100%</span><span>50%</span><span>0%</span></div><svg viewBox="0 0 640 240" preserveAspectRatio="none" role="presentation" aria-hidden="true"><rect class="plateau-band" x="156" y="148" width="480" height="24" rx="4"></rect><line class="chart-grid" x1="8" y1="12.0" x2="632" y2="12.0"></line><line class="chart-grid" x1="8" y1="120.0" x2="632" y2="120.0"></line><line class="chart-grid" x1="8" y1="228.0" x2="632" y2="228.0"></line><polyline class="chart-series series-b" points="8.00,12.00 164.00,158.88 320.00,158.88 476.00,158.88 632.00,163.20"></polyline><circle class="chart-dot series-b" cx="632.0" cy="163.20000000000002" r="3.2"></circle></svg></div><div class="x-ticks"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span></div><div class="chart-axis-label">Weeks since first action</div>
<figcaption>The flatter stretch is a signal to investigate. Keep watching whether it holds.</figcaption>
</figure>

A curve that settles around a similar level above zero for a sustained period suggests that some group has found a recurring use for the product. That is worth understanding before you turn the percentage into a target for everyone else.

What are those users trying to accomplish? Does the product fit a recurring task? Did they find something during onboarding that others missed? Are they arriving with a need the rest of the audience doesn't share?

The curve cannot answer those questions. It helps you find the people who can.

This is also why a couple of flat points deserve patience. A short pause in a decline is not enough to establish a durable pattern. Older cohorts have had more time to reveal whether the product continues to matter, which makes them especially useful when investigating stability.

Once you make changes, newer cohorts can help you assess whether more people are reaching that value. But compare them at the same age. If an older cohort retained 20% at week four and a newer one retains 30% at week four, that hypothetical improvement is worth investigating. Comparing the newer group's week one with the older group's week four would mix product experience with elapsed time.

Even a fair comparison doesn't establish the cause. Better onboarding is one possible explanation; attracting users with a stronger need is another. The next question is what changed between the groups and whether you have evidence connecting that change to their behaviour.

Keep the people count beside the rate while you investigate. Thirty percent of 10 users is three people. Thirty percent of 1,000 is 300. One person's return moves the smaller cohort sharply, so identical percentages can give you very different levels of confidence.

## A retained group changes the growth equation

There is a commercial reason to care about the people who keep returning: new customers can add to an existing customer base when earlier customers stay. When they don't, part of acquisition goes toward replacing what the business has lost.

The scale can be smaller than the phrase “million-dollar business” suggests. At a hypothetical price of $1,000 per month, 83 paying customers represent $996,000 in annual recurring revenue. That is roughly $1 million ARR from a relatively small number of customers.

The arithmetic is simple. The assumptions are the work.

Those customers must pay that price and remain subscribed. Returning to use a feature doesn't establish either condition, and several active users may belong to one paying account. A product-retention curve needs to connect to paid conversion and subscription retention before it can support a revenue projection.

In the same hypothetical scenario, adding 10 retained paying customers each week for eight weeks gives 80 customers and $960,000 ARR, assuming all remain subscribed. It doesn't promise that acquisition pace, establish paid conversion, or mean the business collected $960,000 during those eight weeks.

The useful insight is that a modest group can matter enormously when the product continues to serve them. Understanding why they stay gives you something concrete to improve for the next group.

## The question I want a retention review to answer

I want to leave a retention review knowing more about the product, not just whether its latest percentage looks respectable.

The curves show whether the same groups keep returning. The triangle helps distinguish stronger early retention from lasting retention. The people behind those patterns can explain which parts of the product have become useful and which obstacles are keeping others from getting there.

That gives the next product decision a basis: a specific group to understand, a possible explanation to test, and later cohorts to watch. Building the dashboard makes those questions easier to revisit. The value comes from what you learn when you do.

Are users getting enough value to return? And are we getting better at helping them find it?

<figure class="video-embed" id="cohort-video">
<p class="video-heading">Watch the cohort analysis</p>
<iframe title="Cohort retention analysis with Aritra Ghosh" src="https://www.youtube-nocookie.com/embed/_UqhH1qvdLA" srcdoc="&lt;!doctype html&gt;&lt;html&gt;&lt;head&gt;&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1&quot;&gt;&lt;style&gt;*{box-sizing:border-box}html,body{margin:0;height:100%;background:#161b18}a{display:block;height:100%;color:#fff;text-decoration:none;font:14px system-ui}img{width:100%;height:100%;object-fit:cover;opacity:.78}span{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}b{display:flex;align-items:center;justify-content:center;width:66px;height:48px;border-radius:12px;background:#171e1b;box-shadow:0 3px 20px #0005;font-size:22px;font-weight:400}a:focus-visible{outline:3px solid #81aa97;outline-offset:-3px}&lt;/style&gt;&lt;/head&gt;&lt;body&gt;&lt;a href=&quot;https://www.youtube-nocookie.com/embed/_UqhH1qvdLA?autoplay=1&quot; aria-label=&quot;Play the cohort retention video&quot;&gt;&lt;img src=&quot;hero.png&quot; alt=&quot;Cohort retention video&quot;&gt;&lt;span&gt;&lt;b&gt;&amp;#9654;&lt;/b&gt;&lt;/span&gt;&lt;/a&gt;&lt;/body&gt;&lt;/html&gt;" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen="true"></iframe>
<figcaption><a href="https://www.youtube.com/watch?v=_UqhH1qvdLA">Watch on YouTube</a></figcaption>
</figure>
