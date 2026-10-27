# Supaboard (Stella Pro)

**Data Analytics Index: 99.7** (35 of 39 points, accuracy 89.7%)

| Setup | |
|---|---|
| Model | Pro |
| Data access | Read-only Postgres role, 6 data sources (20 tables) |
| How it was run | All questions in parallel |
| Timing source | Server timestamps |

## Scores

| # | Question | Answer given | Score | Time (s) |
|---|---|---|---|---|
| Q1 | MRR today | MRR $993.6K · 863 customers | 3 | 229 |
| Q2 | Net revenue retention | 97.4% | 3 | 175 |
| Q3 | The May cancellation spike | names the consolidation, 16 clinics, 15 May | 3 | 164 |
| Q4 | Recognized revenue, Q3 2026 | $2.6M | 3 | 151 |
| Q5 | Billings, 2024 against 2025 | 2024 2,845,627.71 · 2025 6,664,837.3 | 3 | 285 |
| Q6 | Overdue receivables | $305.6K (first run) | 3 | 312 |
| Q7 | Sales performance, H1 2026 | 7 of 7 reps exact, 7 within 5% | 3 | 112 |
| Q8 | Paying customers missing from the CRM | 214 customers · 59,658.33 | 3 | 201 |
| Q9 | ARR by industry | Healthcare · 29.16% | 1 | 204 |
| Q10 | Seat utilization | 57.52% (sensitivity table) | 3 | 233 |
| Q11 | Appointments trend | Sep 142,668 (all, in table) | 2 | 90 |
| Q12 | Enterprise support responsiveness | Median 101.33 minutes · 78.27% | 2 | 127 |
| Q13 | Customer count | 863 | 3 | 219 |

## Answers

Full answers as the agent gave them (customer email addresses redacted). Questions are shown by title only.

### Q1. MRR today

[Stella · Worked for 3m 49s · 19 queries]
MRR on 30 September 2026 is about $993.6K from 863 paying customers, with each customer on one subscription.

Our MRR is $993.6K, from 863 paying customers. That counts one current subscription per customer, in active or past-due status. Annual contracts are counted at one-twelfth, and amounts are after discounts and converted to USD. Trials, paused and canceled subscriptions are left out, and so are internal and test accounts.

MRR (USD) and paying customers by billing currency and term, 30 Sep 2026
Ccy | Customers | MRR Local | MRR Usd | Term
AUD | 60 | 146,624 | $98,196 | annual
AUD | 85 | 79,653 | $53,345 | monthly
EUR | 39 | 78,661 | $87,214 | annual
EUR | 72 | 56,579 | $62,731 | monthly
GBP | 47 | 92,973 | $119,956 | annual
GBP | 83 | 53,229 | $68,677 | monthly
USD | 176 | 284,826 | $284,826 | annual
USD | 301 | 218,701 | $218,701 | monthly

USD-billed customers account for 50.7% of MRR and 55.3% of paying customers. Annual contracts are 59.4% of MRR but only 37.3% of customers, so monthly plans are the larger customer group by count and annual contracts are the larger revenue group.

Additional query result: FX rates
Additional query result: Subscription profile
Additional query result: Customer domains
Additional query result: Sub histories
Additional query result: Rows per sub
Additional query result: Coupons
Additional query result: Test flag overlap
Additional query result: Plans
Additional query result: Dup current rows
Additional query result: Plans 129+
Additional query result: Currency check
Additional query result: Custom and coupon subs
Additional query result: Edge cases
Additional query result: Latest FX rates per pair
Additional query result: MRR by currency and term (USD, 30 Sep 2026)
Additional query result: Exclusion and duplicate validation

Assumed: (1) current means the open version of each subscription at end of day 30 Sep 2026 UTC, with identical duplicate rows collapsed to one per subscription. (2) FX uses the latest rates on file, dated 29 Sep 2026, because there is no 30 Sep rate (EUR 1.1087 and GBP 1.2902 in USD, AUD 1.4932 per USD). (3) Excluded accounts are non-live, flagged internal, @example.com or @corvia.io emails, and names starting 'Test' or 'Corvia Demo' (21 otherwise-qualifying accounts removed). (4) Enterprise custom annual amounts are read as total annual contract value in minor currency units. (5) The 3-month LAUNCH50 coupon has expired on every current subscription, while NONPROFIT20 (20%) and PARTNER15 (15%) are applied. (6) Past-due subscriptions are included as you specified.

### Q2. Net revenue retention

[Stella · Worked for 2m 55s · 13 queries]
Net revenue retention over the last 12 months was 97.4%: the cohort paying on 30 Sep 2025 now generates slightly less MRR than a year ago.

The 508 customers paying on 30 September 2025 had $551.5K of MRR. The same customers (including any new subscriptions they added) generate $537.2K on 30 September 2026. That gives NRR of 97.4%, so the cohort is slightly smaller in revenue terms than a year ago. Everything is in USD at the latest exchange rates (29 Sep 2026) for both dates, so currency moves are excluded.

NRR 30 Sep 2025 to 30 Sep 2026
Churned Custs | Churned MRR | Cohort Customers | Contracted Custs | Contraction | Expanded Custs | Expansion | Grr | MRR Now | MRR Then | Nrr | Nrr List Price
100 | $66,779 | 508 | 40 | $2,567 | 197 | $55,034 | 87.4% | $537,216 | $551,528 | 97.4% | 97.3%

Churn is almost fully offset by expansion. 100 customers cancelled and took $66.8K of MRR with them. 40 customers shrank, losing $2.6K. 197 customers expanded, adding $55K. Gross retention, which ignores expansion, was 87.4%, so most of the headline resilience comes from upsell, seats and price changes on surviving accounts.

The result holds up under alternative definitions, but depends on a few large accounts. Counting only strictly 'active' subscriptions (excluding past-due) gives 97.2%, and using list prices instead of coupon-discounted prices gives 97.3%. Removing the five accounts with the largest MRR gain drops NRR to 94.6%. Those five account for 22.7% of all expansion.

NRR sensitivity
Ent Now | Ent Then | Non Ent Now | Non Ent Then | Nrr Active Only | Nrr Ex Top5 | Top5 Share Of Expansion
262,031.55233959 | 259,732.66453973128 | 275,184.5552875731 | 291,795.02541478514 | 97.2% | 94.6% | 22.7%
Additional query result: Subs profile
Additional query result: Plans
Additional query result: FX
Additional query result: Customers quality
Additional query result: Coupons
Additional query result: Remaining plans
Additional query result: Versions per sub
Additional query result: Chain integrity
Additional query result: As-of overlaps
Additional query result: Consistency checks

RECOMMENDATION: Report NRR together with gross retention, so that expansion on surviving accounts is not read as healthy retention. Next, split the expansion into seat growth versus price and plan migration to see whether it is repeatable.

Definitions I used: 'paying' means an active or past-due subscription (trials, paused and cancelled excluded). MRR is monthly-equivalent (annual divided by 12), seats times price, with enterprise using the custom annual amount and coupon discounts applied while valid. Test accounts (livemode off) are excluded. When subscription versions overlap, the latest one is used. FX rates exist only up to 29 Sep 2026, so that day's rate stands in for 'today'. The expansion mix (seats vs price migration) was not split out.

### Q3. The May cancellation spike

[Stella · Worked for 2m 44s · 13 queries]
May's jump was one customer, not churn: 16 Meridian Health clinics were consolidated into a single enterprise contract on 15 May, and the remaining cancellations were in line with April.

May 2026 recorded 48 cancelled subscriptions, and 16 of them were Meridian Health clinic subscriptions. All 16 were cancelled on 15 May 2026, within minutes of each other. They are all US growth-tier monthly plans, with 270 seats in total, and they carry cancellation reason code 4. That code is missing from the cancellation-reason reference table, so it shows up as unlabelled. Without that batch, May had 32 cancellations against 34 in April. The underlying rate did not change.

[Chart: Monthly cancellations: Meridian consolidation vs all other — series: All other cancellations; Meridian clinics (15 May)]

May 2026 cancels detail
Billing Interval | Cancels | Country Code | Earliest Cust Created | First Cancel | Is Legacy | Last Cancel | Latest Cust Created | Reason Code | Seats | Tier
month | 12 | US | Jan 01, 2024, 12:00 AM | May 15, 2026, 12:00 AM | ✓ | May 15, 2026, 12:00 AM | Apr 01, 2025, 12:00 AM | 4 | 205 | growth
month | 4 | US | Apr 17, 2026, 12:00 AM | May 01, 2026, 12:00 AM | ✕ | May 18, 2026, 12:00 AM | May 04, 2026, 12:00 AM | 7 | 19 | starter
month | 4 | US | Jul 01, 2025, 12:00 AM | May 15, 2026, 12:00 AM | ✕ | May 15, 2026, 12:00 AM | Oct 01, 2025, 12:00 AM | 4 | 65 | growth
month | 2 | US | Apr 26, 2026, 12:00 AM | May 10, 2026, 12:00 AM | ✕ | May 16, 2026, 12:00 AM | May 02, 2026, 12:00 AM | 7 | 18 | growth
month | 2 | US | May 03, 2026, 12:00 AM | May 17, 2026, 12:00 AM | ✕ | May 21, 2026, 12:00 AM | May 07, 2026, 12:00 AM | 7 | 115 | scale
month | 2 | GB | Jan 06, 2025, 12:00 AM | May 14, 2026, 12:00 AM | ✕ | May 19, 2026, 12:00 AM | Feb 05, 2026, 12:00 AM | 1 | 9 | starter
month | 1 | US | Sep 23, 2025, 12:00 AM | May 07, 2026, 12:00 AM | ✕ | May 07, 2026, 12:00 AM | Sep 23, 2025, 12:00 AM | 3 | 7 | scale
month | 1 | US | Jun 30, 2024, 12:00 AM | May 14, 2026, 12:00 AM | ✕ | May 14, 2026, 12:00 AM | Jun 30, 2024, 12:00 AM | 5 | 5 | starter
month | 1 | GB | Mar 31, 2026, 12:00 AM | May 14, 2026, 12:00 AM | ✕ | May 14, 2026, 12:00 AM | Mar 31, 2026, 12:00 AM | 6 | 8 | starter
month | 1 | US | Sep 16, 2025, 12:00 AM | May 30, 2026, 12:00 AM | ✕ | May 30, 2026, 12:00 AM | Sep 16, 2025, 12:00 AM | 6 | 92 | scale
month | 1 | US | Jul 18, 2025, 12:00 AM | May 01, 2026, 12:00 AM | ✕ | May 01, 2026, 12:00 AM | Jul 18, 2025, 12:00 AM | 6 | 6 | starter
year | 1 | US | May 07, 2025, 12:00 AM | May 21, 2026, 12:00 AM | ✕ | May 21, 2026, 12:00 AM | May 07, 2025, 12:00 AM | 6 | 6 | starter
month | 1 | AU | May 14, 2026, 12:00 AM | May 28, 2026, 12:00 AM | ✕ | May 28, 2026, 12:00 AM | May 14, 2026, 12:00 AM | 7 | 2 | starter
month | 1 | DE | May 08, 2026, 12:00 AM | May 22, 2026, 12:00 AM | ✕ | May 22, 2026, 12:00 AM | May 08, 2026, 12:00 AM | 7 | 16 | growth
month | 1 | GB | Apr 20, 2026, 12:00 AM | May 04, 2026, 12:00 AM | ✕ | May 04, 2026, 12:00 AM | Apr 20, 2026, 12:00 AM | 7 | 20 | growth
annual | 1 | IE | May 12, 2026, 12:00 AM | May 26, 2026, 12:00 AM | ✕ | May 26, 2026, 12:00 AM | May 12, 2026, 12:00 AM | 7 | 17 | growth
year | 1 | IE | May 15, 2026, 12:00 AM | May 29, 2026, 12:00 AM | ✕ | May 29, 2026, 12:00 AM | May 15, 2026, 12:00 AM | 7 | 5 | starter
year | 1 | US | Apr 17, 2026, 12:00 AM | May 01, 2026, 12:00 AM | ✕ | May 01, 2026, 12:00 AM | Apr 17, 2026, 12:00 AM | 7 | 3 | starter
year | 1 | AU | May 09, 2025, 12:00 AM | May 23, 2026, 12:00 AM | ✓ | May 23, 2026, 12:00 AM | May 09, 2025, 12:00 AM | 1 | 28 | growth
month | 1 | US | Aug 21, 2024, 12:00 AM | May 20, 2026, 12:00 AM | ✓ | May 20, 2026, 12:00 AM | Aug 21, 2024, 12:00 AM | 1 | 13 | growth
month | 1 | US | Jul 04, 2024, 12:00 AM | May 03, 2026, 12:00 AM | ✓ | May 03, 2026, 12:00 AM | Jul 04, 2024, 12:00 AM | 3 | 19 | growth
year | 1 | US | May 15, 2025, 12:00 AM | May 29, 2026, 12:00 AM | ✓ | May 29, 2026, 12:00 AM | May 15, 2025, 12:00 AM | 5 | 28 | growth
month | 1 | US | May 10, 2025, 12:00 AM | May 24, 2026, 12:00 AM | ✓ | May 24, 2026, 12:00 AM | May 10, 2025, 12:00 AM | 6 | 28 | growth
year | 1 | US | May 01, 2025, 12:00 AM | May 15, 2026, 12:00 AM | ✕ | May 15, 2026, 12:00 AM | May 01, 2025, 12:00 AM | 1 | 8 | starter
month | 1 | AU | Mar 16, 2025, 12:00 AM | May 30, 2026, 12:00 AM | ✕ | May 30, 2026, 12:00 AM | Mar 16, 2025, 12:00 AM | 2 | 3 | starter
month | 1 | GB | Aug 22, 2025, 12:00 AM | May 05, 2026, 12:00 AM | ✕ | May 05, 2026, 12:00 AM | Aug 22, 2025, 12:00 AM | 2 | 50 | scale
year | 1 | US | Apr 26, 2024, 12:00 AM | May 10, 2026, 12:00 AM | ✕ | May 10, 2026, 12:00 AM | Apr 26, 2024, 12:00 AM | 2 | 2 | starter
month | 1 | DE | Sep 29, 2025, 12:00 AM | May 13, 2026, 12:00 AM | ✕ | May 13, 2026, 12:00 AM | Sep 29, 2025, 12:00 AM | 3 | 14 | growth

Reason-code-4 cancellations (Email column redacted in this record)
Cancel Reason Code | Country Code | Currency | Cust Created | Cust ID | Email | Legal Name | Livemode | Metadata | Plan Code | Plan ID | Quantity | Sub ID | Terms | Unit Amount | Updated At | Valid From
4 | US | USD | Jan 01, 2024, 12:00 AM | 51,540 | [email redacted] | Meridian Health - Ashford Clinic LLC | ✓ | {"segment": "growth"} | growth_m_usd_2024 | 109 | 21 | sub_i1ez9jc3hb6hv8 | card | 2,900 | May 15, 2026, 12:05 AM | May 15, 2026, 12:00 AM
4 | US | USD | Apr 01, 2024, 12:00 AM | 51,541 | [email redacted] | Meridian Health - Brookside Clinic LLC | ✓ | {"segment": "growth"} | growth_m_usd_2024 | 109 | 20 | sub_za2nog9dyixnsy | due_on_receipt | 2,900 | May 15, 2026, 12:00 AM | May 15, 2026, 12:00 AM
4 | US | USD | Jul 01, 2024, 12:00 AM | 51,542 | [email redacted] | Meridian Health - Cedar Ridge Clinic LLC | ✓ | {"segment": "growth"} | growth_m_usd_2024 | 109 | 15 | sub_pb6uasm7qfsxra | due_on_receipt | 2,900 | May 15, 2026, 12:03 AM | May 15, 2026, 12:00 AM
4 | US | USD | Oct 01, 2024, 12:00 AM | 51,543 | [email redacted] | Meridian Health - Clearwater Clinic LLC | ✓ | {"segment": "growth"} | growth_m_usd_2024 | 109 | 13 | sub_1aeq4im95q9l47 | Due on receipt | 2,900 | May 15, 2026, 12:04 AM | May 15, 2026, 12:00 AM
4 | US | USD | Jan 01, 2024, 12:00 AM | 51,544 | [email redacted] | Meridian Health - Danbury Clinic LLC | ✓ | {"segment": "growth"} | growth_m_usd_2024 | 109 | 21 | sub_lbrgq6h7qyr5vj | due_on_receipt | 2,900 | May 15, 2026, 12:00 AM | May 15, 2026, 12:00 AM
4 | US | USD | Apr 01, 2024, 12:00 AM | 51,545 | [email redacted] | Meridian Health - Eastgate Clinic LLC | ✓ | {"segment": "growth"} | growth_m_usd_2024 | 109 | 15 | sub_cv6vyjb06eup3f | due_on_receipt | 2,900 | May 15, 2026, 12:04 AM | May 15, 2026, 12:00 AM
4 | US | USD | Jul 01, 2024, 12:00 AM | 51,546 | [email redacted] | Meridian Health - Fairview Clinic LLC | ✓ | {"segment": "growth"} | growth_m_usd_2024 | 109 | 25 | sub_xwyzf9yu7burhd | Due on receipt | 2,900 | May 15, 2026, 12:04 AM | May 15, 2026, 12:00 AM
4 | US | USD | Oct 01, 2024, 12:00 AM | 51,547 | [email redacted] | Meridian Health - Glenwood Clinic LLC | ✓ | {"segment": "growth"} | growth_m_usd_2024 | 109 | 13 | sub_w1ixufp0b7pgu5 | due_on_receipt | 2,900 | May 15, 2026, 12:05 AM | May 15, 2026, 12:00 AM
4 | US | USD | Jan 01, 2025, 12:00 AM | 51,548 | [email redacted] | Meridian Health - Harborview Clinic LLC | ✓ | {"segment": "growth"} | growth_m_usd_2024 | 109 | 10 | sub_dgbvwqpc5jg5hm | card | 2,900 | May 15, 2026, 12:01 AM | May 15, 2026, 12:00 AM
4 | US | USD | Apr 01, 2025, 12:00 AM | 51,549 | [email redacted] | Meridian Health - Highland Clinic LLC | ✓ | {"segment": "growth"} | growth_m_usd_2024 | 109 | 15 | sub_yu2vbv8cmmtbe6 | due_on_receipt | 2,900 | May 15, 2026, 12:02 AM | May 15, 2026, 12:00 AM
4 | US | USD | Jul 01, 2025, 12:00 AM | 51,550 | [email redacted] | Meridian Health - Ironwood Clinic LLC | ✓ | {"segment": "growth"} | GROWTH-MONTHLY-USD-V2 | 117 | 21 | sub_gryriak52zose1 | Due on receipt | 3,500 | May 15, 2026, 12:02 AM | May 15, 2026, 12:00 AM
4 | US | USD | Oct 01, 2025, 12:00 AM | 51,551 | [email redacted] | Meridian Health - Juniper Clinic LLC | ✓ | {"segment": "growth"} | GROWTH-MONTHLY-USD-V2 | 117 | 18 | sub_16qh7g2a9hbk9d | card | 3,500 | May 15, 2026, 12:04 AM | May 15, 2026, 12:00 AM
4 | US | USD | Jan 01, 2025, 12:00 AM | 51,552 | [email redacted] | Meridian Health - Kingsley Clinic LLC | ✓ | {"segment": "growth"} | growth_m_usd_2024 | 109 | 12 | sub_9wh3lqsc5haj8q | card | 2,900 | May 15, 2026, 12:03 AM | May 15, 2026, 12:00 AM
4 | US | USD | Apr 01, 2025, 12:00 AM | 51,553 | [email redacted] | Meridian Health - Lakeside Clinic LLC | ✓ | {"segment": "growth"} | growth_m_usd_2024 | 109 | 25 | sub_4o62el4udwxnhf | due_on_receipt | 2,900 | May 15, 2026, 12:02 AM | May 15, 2026, 12:00 AM
4 | US | USD | Jul 01, 2025, 12:00 AM | 51,554 | [email redacted] | Meridian Health - Maple Grove Clinic LLC | ✓ | {"segment": "growth"} | GROWTH-MONTHLY-USD-V2 | 117 | 14 | sub_h9pklcwkwltvmr | due_on_receipt | 3,500 | May 15, 2026, 12:00 AM | May 15, 2026, 12:00 AM
4 | US | USD | Oct 01, 2025, 12:00 AM | 51,555 | [email redacted] | Meridian Health - Northfield Clinic LLC | ✓ | {"segment": "growth"} | GROWTH-MONTHLY-USD-V2 | 117 | 12 | sub_ervevupf8uc3kd | due_on_receipt | 3,500 | May 15, 2026, 12:05 AM | May 15, 2026, 12:00 AM

This looks like an account consolidation, not customers leaving. A new customer record, Meridian Health Group LLC, was created on 2 May. On 15 May, the same day as the clinic cancellations, it started an annual enterprise subscription for 310 seats. The 16 clinics had 270 seats. The enterprise contract's annualised value is 1.25x of the old clinics' annualised value, about $10.3K a month against $8.2K. Its invoice for 125,690 was issued 15 May and is marked paid. The business kept this revenue and moved to a larger contract. Recurring revenue from this group rose, but the cancellation count rose with it. This is inferred from matching names, dates and seats. No record states the reason outright.

Meridian recurring revenue before vs after
Annualised Usd | Item | Monthly Usd | Seats | Subs
$98,640 | Old: 16 clinic subscriptions (monthly) | $8,220 | 270 | 16
$123,690 | New: Meridian Health Group enterprise (annual) | $10,308 | 310 | 1

Meridian Group invoices
Currency | Invoice ID | Issued At | Period End | Period Start | Status | Subtotal Usd | Total Usd
USD | in_gnhofdc6yq68j0jb | May 15, 2026, 12:00 AM | May 15, 2027, 12:00 AM | May 15, 2026, 12:00 AM | paid | 125,690 | 125,690

Treat September as a separate question. Excluding the Meridian batch, monthly cancellations in September were 2.11x times those in March, the low point. Reason code 7, trial not converted, is the largest single category in the data. I did not test whether the September rise comes from trial conversion, a specific plan or a cohort, so it remains unexplained.

Additional query result: Cancel reasons
Additional query result: Subscription table profile
Additional query result: Cancellation rows by month
Additional query result: Cancellations by segment
Additional query result: Cancellation reason codes by month
Additional query result: Plans
Additional query result: Meridian Health accounts

RECOMMENDATION: Report May cancellations with the Meridian consolidation excluded or flagged, so the churn trend isn't misread. Add reason code 4 to the cancellation-reason table, for example as a consolidation or upgrade category. Then look into the rise in September cancellations excluding Meridian, starting with trial non-conversion by plan and signup month.

Counts are cancelled subscription records by the month they were cancelled (UTC), through 30 Sep 2026. A few customers have more than one cancel record, so records and distinct subscriptions differ by about 10 over the whole history. The Meridian dollar figures are all USD. The invoice total is $2,000 above the contract's annual amount, and I did not reconcile that. The CRM tables could not be queried, so the consolidation was not checked against sales records.

Should I look into the September rise in cancellations (excluding Meridian) by plan, signup cohort and reason?

### Q4. Recognized revenue, Q3 2026

[Stella · Worked for 2m 30s · 11 queries]
Corvia recognized about $2.6M of net revenue in Q3 2026 (1 July–30 September), in US dollars.

Net recognized revenue is the sum of subscription charges spread over their service periods ($2.7M), proration ($24.3K), one-off setup fees on the invoice date ($23K) and discount lines (-$25.9K), less credit notes on the day issued (-$129.7K). Subscription charges are the large majority of this, so the result depends mostly on correctly spreading annual and monthly charges over the days they cover. Part of Q3 revenue comes from annual invoices issued before July.

Q3 2026 recognized revenue components (USD)
Component | N | Usd
credit_notes | 47 | -$129,687
discount | 228 | -$25,931
proration | 144 | $24,349
setup_fee | 11 | $23,029
subscription | 2,435 | $2,708,710

Credit notes cut gross recognized revenue by -$129.7K. Those 47 credit notes were issued in the quarter against live-customer invoices, taken ex-tax and converted at the rate for their issue date.

Invoices in 'uncollectible' status are included, because the rules exclude only void and draft invoices. They make up roughly 1.2% of the subscription revenue (an approximate re-computation with rounded FX rates), so excluding them would not change the answer materially.

Revenue by invoice status (approximate) and FX fallback share
Approx Usd Sub | Invoices | Share Inv Fx Fallback | Status
77,825.15906631152 | 147 | 0.16049382716049382 | open
2,586,876.305629659 | 8,422 | 0.14815611224599506 | paid
32,103.242369863015 | 94 | 0.12871287128712872 | uncollectible
Additional query result: FX rates overview
Additional query result: Invoice profile
Additional query result: Customer sample
Additional query result: Currency alignment
Additional query result: Test and internal customers
Additional query result: Line vs subtotal reconciliation
Additional query result: Credit note profile
Additional query result: Line type profile
Additional query result: Migrated invoices

Definitions used: invoice date = issued_at (UTC); line period end is exclusive, so a charge is spread evenly across days from period_start up to period_end. Excluded: draft and void invoices, tax, all 24 non-live test customers and the 6 live customers flagged internal (Corvia Demo accounts with @corvia.io emails). Invoice line amounts are in major currency units and credit notes are in cents; I netted tax out of each credit note. FX: EUR and GBP convert at their USD rate; AUD converts at 1 / the USD→AUD rate. The rate table has gaps and ends 29 Sep 2026, so about 15% of non-USD invoices (and any 30 Sep items) use the latest earlier rate, not an exact same-day rate. Open and uncollectible invoices are counted as recognized.

### Q5. Billings, 2024 against 2025

[Stella · Worked for 4m 45s · 17 queries]
Billings grew +134.2% from 2,845,627.71 in 2024 to 6,664,837.3 in 2025 (USD, ex-tax, net of void invoices and credit notes, excluding test/internal accounts).

2025 billings were 6,664,837.3, against 2,845,627.71 in 2024, a change of +134.2%. The 2025 figure is 6,727,652.59 of invoices issued less 62,815.29 of credit notes. The 2024 figure is 2,848,120.09 of invoices less 2,492.38 of credits. Credit notes are small in both years, so the growth comes from invoicing volume, not from netting.

Billings 2024 vs 2025 (USD, ex-tax, net of void and credits)
Billings Usd | Credit Notes Usd | Gross Invoiced Usd | Invoices | Test Internal Excluded Usd | Void Excluded Usd | Year
2,845,627.71 | 2,492.38 | 2,848,120.09 | 1,305 | 43,055.3 | 32,915.35 | 2024
6,664,837.3 | 62,815.29 | 6,727,652.59 | 3,854 | 121,814.87 | 45,689.1 | 2025

Two data-handling steps affect the 2024 figure. The billing system holds only a few dozen 2024 invoices, all migrated from the legacy system. The legacy system holds the full year, so 2024 uses legacy invoices and counts each migrated invoice once. Legacy amounts are already in USD and match the billing system's converted amounts for the overlapping invoices. Separately, 2025 invoices are stored in cents and converted to USD at the issue-date FX rate. Excluded from 2025 were 45,689.1 of void invoices and 121,814.87 of test, demo and internal-account invoices. The equivalent 2024 exclusions were 32,915.35 and 43,055.3.

Additional query result: Invoice sample
Additional query result: FX sample
Additional query result: Legacy profile
Additional query result: Invoice profile
Additional query result: Quality checks
Additional query result: Legacy vs billing overlap
Additional query result: Duplicate invoice number
Additional query result: Suspect customers
Additional query result: Credit notes profile
Additional query result: Legacy acct types
Additional query result: Billings build-up with FX and overlaps
Additional query result: Header vs lines reconciliation
Additional query result: Credit notes in USD
Additional query result: Header vs line items (minor units)

Definitions used: invoices dated by issue date in UTC; draft invoices excluded as not yet issued; uncollectible and written-off invoices stay in billings because they were invoiced and not voided; credit notes are deducted in the year they were issued (ex-tax amounts), and attributing them to the invoice's year instead changes the 2025 total by about $1.3K and leaves growth essentially unchanged; FX uses the latest rate on or before the issue date; test/internal accounts are identified by non-live flag, internal metadata, corvia.io or example.com emails, 'Corvia Demo'/'Test' names and legacy internal account types.

### Q6. Overdue receivables

**Rerun (counted)**

**Turn 1 (only turn) — Stella, "Worked for 5m 12s · 15 queries"**

About $307.5K is overdue by more than 30 days. South Tidewater alone is 44.1% of it and Old Juniper is 36.2%.

As of 30 September 2026, unpaid balances overdue by more than 30 days total $307.5K across 88 open invoices. Each balance is the invoice total including tax, less payments and credit notes, converted to US dollars at the latest available rate (29 September). If the cut-off moves to 30 days or more, the total is almost unchanged ($307.8K). So the answer is not sensitive to where the 30-day line is drawn.

Table: Overdue >30 days by customer (USD) — 86 rows in the query result (the UI pages them 50 per page; all rows from the server payload shown here)

| Cust ID | Legal Name | Overdue Invoices | Overdue USD |
|---|---|---|---|
| 50150 | South Tidewater Freight B.V. | 1 | $135,649.00 |
| 50113 | Old Juniper Urgent Care Ltd | 1 | $111,288.96 |
| 50836 | East Woodvale Smile Studio Ltd | 1 | $3,683.36 |
| 50478 | Valley View Home Cleaning Ltd | 1 | $3,375.27 |
| 50749 | Summit Same-Day Delivery GmbH | 1 | $3,371.78 |
| 50722 | East Queensbury Vets LLC | 1 | $3,038.00 |
| 51250 | West Southport Medical Group LLC | 1 | $2,891.00 |
| 50787 | Greater Tidewater Urgent Care LLC | 1 | $2,811.37 |
| 50232 | Tidewater Urgent Care Ltd | 1 | $2,717.23 |
| 50970 | North Newhaven HVAC Pty Ltd | 1 | $2,696.00 |
| 50221 | Greater Foxhall Family Medicine LLC | 1 | $2,695.00 |
| 50603 | Silverlake Smile Studio Ltd | 1 | $2,596.47 |
| 50488 | West Ironwood Couriers Pty Ltd | 1 | $2,022.00 |
| 50054 | North Parkside Learning Centre LLC | 1 | $1,911.00 |
| 50106 | Ironwood HVAC LLC | 3 | $1,844.40 |
| 51068 | Thornbury Medical Group SARL | 1 | $1,616.54 |
| 51221 | Old Larkspur Urgent Care GmbH | 1 | $1,432.49 |
| 50896 | Old Danbury Elevator Services Ltd | 1 | $1,400.89 |
| 50193 | Riverside Fire & Safety LLC | 1 | $1,176.00 |
| 50354 | South Fairview Plumbing & Heating Pty Ltd | 1 | $1,099.99 |
| 50366 | East Ironwood Family Medicine LLC | 1 | $1,078.00 |
| 50677 | Thornbury Urgent Care LLC | 1 | $980.00 |
| 50443 | Brightwater Couriers B.V. | 1 | $978.01 |
| 50651 | Greater Brightwater Electrical LLC | 1 | $812.00 |
| 50606 | West Crestview Smile Studio LLC | 1 | $783.00 |
| 50584 | Greater Orchard Park Home Cleaning LLC | 1 | $750.00 |
| 51024 | South Cedar Ridge Smile Studio Ltd | 1 | $699.30 |
| 50094 | Old Elmhurst Plumbing & Heating LLC | 1 | $661.50 |
| 51180 | Upland Facilities LLC | 1 | $630.00 |
| 50721 | Greater Queensbury Dental Pty Ltd | 1 | $624.71 |
| 50725 | Greater Elmhurst Same-Day Delivery LLC | 1 | $588.87 |
| 50686 | North Cedar Ridge Elevator Services LLC | 1 | $490.00 |
| 51540 | Meridian Health - Ashford Clinic LLC | 1 | $456.75 |
| 51229 | Harborview HVAC LLC | 1 | $455.00 |
| 50170 | Kestrel Urgent Care LLC | 1 | $435.00 |
| 51541 | Meridian Health - Brookside Clinic LLC | 1 | $435.00 |
| 51056 | Greater Granite Bay Home Cleaning Pty Ltd | 1 | $424.22 |
| 50497 | South Kingsley Vets GmbH | 1 | $358.93 |
| 51210 | Hillcrest Fire & Safety LLC | 1 | $350.00 |
| 51017 | Danbury Medical Group GmbH | 1 | $347.82 |
| 51116 | East Orchard Park Home Cleaning Ltd | 1 | $343.20 |
| 51545 | Meridian Health - Eastgate Clinic LLC | 1 | $326.25 |
| 50404 | Driftwood Electrical Ltd | 1 | $315.75 |
| 50899 | Greater Kestrel Electrical LLC | 1 | $315.00 |
| 50717 | Sandown Medical Group Ltd | 1 | $308.88 |
| 50544 | East Stonebridge Electrical Ltd | 1 | $304.45 |
| 50175 | West Westbrook Facilities LLC | 1 | $291.52 |
| 51548 | Meridian Health - Harborview Clinic LLC | 1 | $290.00 |
| 50155 | West Queensbury Dental LLC | 1 | $261.00 |
| 50890 | North Juniper Home Cleaning Pty Ltd | 1 | $245.99 |
| 50657 | West Driftwood Freight LLC | 1 | $221.85 |
| 50210 | Old Queensbury Electrical LLC | 1 | $217.50 |
| 51115 | Old Lakeside Urgent Care LLC | 1 | $189.00 |
| 51052 | South Southport Pet Clinic Pty Ltd | 1 | $187.41 |
| 50126 | Old Oakmont Orthodontics LLC | 1 | $146.25 |
| 50706 | North Highland Health Clinic Ltd | 1 | $130.06 |
| 50299 | South Orchard Park Family Medicine Pty Ltd | 1 | $118.61 |
| 50197 | South Ironwood Orthodontics Ltd | 1 | $117.67 |
| 50026 | Old Summit Vets Pty Ltd | 1 | $106.08 |
| 51552 | Meridian Health - Kingsley Clinic LLC | 1 | $103.91 |
| 50271 | Cedar Ridge Electrical LLC | 1 | $96.74 |
| 51089 | Ambleside Electrical Ltd | 1 | $92.90 |
| 50797 | Old Bayside Dental Ltd | 1 | $92.90 |
| 50866 | East Stonebridge Facilities GmbH | 1 | $84.60 |
| 50835 | Greater Elmhurst Smile Studio LLC | 1 | $84.00 |
| 50465 | Westbrook Electrical Pty Ltd | 1 | $82.51 |
| 50608 | South Bayside Dental Pty Ltd | 1 | $78.56 |
| 50916 | West Silverlake Salon LLC | 1 | $75.00 |
| 50448 | East Larkspur Health Clinic LLC | 1 | $75.00 |
| 50767 | North Ambleside Orthodontics Ltd | 1 | $74.32 |
| 50427 | East Queensbury Medical Group LLC | 1 | $60.00 |
| 50457 | Highland Fitness GmbH | 1 | $58.36 |
| 50510 | South Driftwood Family Medicine LLC | 1 | $55.84 |
| 50877 | North Orchard Park Elevator Services Pty Ltd | 1 | $52.37 |
| 50528 | Greater Lakeside Same-Day Delivery Pty Ltd | 1 | $50.83 |
| 50801 | Greater Riverside Orthodontics LLC | 1 | $45.00 |
| 50380 | Willow Creek Smile Studio LLC | 1 | $30.00 |
| 50572 | West Harborview Fire & Safety LLC | 1 | $30.00 |
| 51272 | North Cedar Ridge Urgent Care Pty Ltd | 1 | $27.11 |
| 50047 | South Yorkton Smile Studio Ltd | 1 | $18.58 |
| 51134 | Upland Physiotherapy Ltd | 1 | $18.58 |
| 50282 | Old Northfield Orthodontics Ltd | 1 | $15.39 |
| 50173 | Kestrel Couriers LLC | 1 | $15.00 |
| 50135 | Millbrook Facilities LLC | 1 | $11.25 |
| 50461 | North Ambleside Health Clinic B.V. | 1 | $7.83 |
| 50420 | North Woodvale Pest Control SARL | 1 | $7.45 |

Table: Overdue total under alternative definitions

| Measure | N | USD |
|---|---|---|
| headline: open, clean, >30d, floored at 0 | 88 | $307,535 |
| net of overpayments (no floor) | 91 | $307,434 |
| overdue >=30 days (boundary) | 89 | $307,844 |
| overdue >30d ignoring credit notes | 91 | $321,675 |
| uncollectible (excluded), >30d | 85 | $343,586 |
| test/internal open >30d (excluded) | 3 | $1,857 |
| open, not yet >30d overdue (excluded) | 56 | $174,825 |

The five customers owing the most are South Tidewater Freight B.V., Old Juniper Urgent Care Ltd, East Woodvale Smile Studio Ltd, Valley View Home Cleaning Ltd and Summit Same-Day Delivery GmbH. The first two dominate. South Tidewater owes $135.6K on a single invoice issued in May 2025 and still unpaid, which is 44.1% of the overall overdue total. Old Juniper owes $111.3K on a single invoice due in June 2025, which is 36.2% of the total. The third to fifth customers owe only about $3.7K down to $3.4K each. Their order is a close contest, but the top two decide the headline.

Chart: Top 5 customers by balance overdue >30 days, 30 Sep 2026 (USD) — South Tidewater Freight B.V. 135,649.00; Old Juniper Urgent Care Ltd 111,288.96; East Woodvale Smile Studio Ltd 3,683.36; Valley View Home Cleaning Ltd 3,375.27; Summit Same-Day Delivery GmbH 3,371.78

The total depends on a few judgement calls. Invoices marked uncollectible are a separate pool of $343.6K that is also more than 30 days past due. I left them out of the headline because they have been written off as unlikely to be paid. Open invoices that are not yet 30 days past due add another $174.8K, which is not counted as overdue by more than 30 days. I also excluded $1.9K of overdue balances on Corvia demo and test-mode accounts. Credit notes lower the total by about $14.1K. Drafts and voided invoices are not counted.

Additional query results (collapsed): FX rates summary; Invoice profile; Open/uncollectible/migrated invoices; Credit notes by invoice status; Due date vs terms; Test / internal / duplicate customers; Line vs subtotal reconciliation; Legacy invoices profile; Units check; Legacy open invoices vs billing; Meridian group and top invoices

RECOMMENDATION: Start with the two large invoices, South Tidewater Freight and Old Juniper Urgent Care. Together they make up most of the overdue balance and have been unpaid for well over a year. Confirm with the account owners that the invoices are valid and still collectible. Decide separately whether the uncollectible pool should count as overdue receivables.

Amounts are stored in minor units (cents) in the invoice's own currency. I confirmed this because invoice line amounts times 100 equal every invoice subtotal. AUD, EUR and GBP were converted with the 29 September fx_rates row, the last one in the table. A rate at invoice date would change the figures slightly but not the top-five order. Where due_at is blank (due-on-receipt or card terms) I used the issue date. Legacy 2024 invoices were not added, because their open statuses are stale snapshots; billing shows nearly all of them as paid.

Should I check the South Tidewater and Old Juniper invoices against subscription and support history, to see whether they are real disputes or billing errors?

(This closing line is Stella's suggested follow-up — server field followup.kind = "question"; the composer pre-filled "Yes, check the South Tidewater and Old Juniper invoices…". Treated as an offer of further analysis, not a clarifying question; no reply sent.)

**First run**

[First response — Stella · Worked for 2m 33s · 9 queries]
About $305.6K is overdue by more than 30 days, and two customers account for most of it.

As of 30 September 2026, $305.6K is overdue by more than 30 days. That is the unpaid balance after payments and credit notes, tax included, on 83 open invoices from live customers, converted to US dollars. For comparison, live open invoices that are not yet 30 days overdue come to $174.8K.

Overdue total under alternative definitions (USD)
N | Scenario | Usd
83 | base: open, live, >30d | $305,557
84 | >=30 days | $305,866
167 | plus uncollectible | $649,119
86 | plus test-mode | $307,414
88 | credit notes ex-tax only | $307,535
91 | no credit notes | $305,557
70 | due date derived from terms (subset of base) | $163,108
56 | live open, not yet >30d overdue | $174,825

The five customers who owe the most are South Tidewater Freight B.V. ($135.6K, 494 days overdue), Old Juniper Urgent Care Ltd ($111.3K, 477 days), East Woodvale Smile Studio Ltd ($3.7K), Valley View Home Cleaning Ltd ($3.4K) and Summit Same-Day Delivery GmbH ($3.3K). Each has a single overdue invoice. Within the ten largest balances, South Tidewater holds 50.0% and Old Juniper 41.0%. The two of them are the bulk of the overall total, and the third-ranked customer owes only a few thousand dollars. The total is therefore driven by two large unpaid invoices, not by broad non-payment.

Top customers by overdue >30 days balance (USD)
Cust ID | Legal Name | Max Days | Min Days | N Customers | Overdue Invoices | Owed Usd | Total Invoices | Total Owed Usd
50,150 | South Tidewater Freight B.V. | 494 | 494 | 81 | 1 | $135,649 | 83 | $305,557
50,113 | Old Juniper Urgent Care Ltd | 477 | 477 | 81 | 1 | $111,289 | 83 | $305,557
50,836 | East Woodvale Smile Studio Ltd | 252 | 252 | 81 | 1 | $3,683 | 83 | $305,557
50,478 | Valley View Home Cleaning Ltd | 260 | 260 | 81 | 1 | $3,375 | 83 | $305,557
50,749 | Summit Same-Day Delivery GmbH | 156 | 156 | 81 | 1 | $3,313 | 83 | $305,557
50,722 | East Queensbury Vets LLC | 226 | 226 | 81 | 1 | $3,038 | 83 | $305,557
51,250 | West Southport Medical Group LLC | 66 | 66 | 81 | 1 | $2,891 | 83 | $305,557
50,787 | Greater Tidewater Urgent Care LLC | 320 | 320 | 81 | 1 | $2,811 | 83 | $305,557
50,232 | Tidewater Urgent Care Ltd | 636 | 636 | 81 | 1 | $2,717 | 83 | $305,557
50,221 | Greater Foxhall Family Medicine LLC | 286 | 286 | 81 | 1 | $2,695 | 83 | $305,557

The total depends on a few definitions. Counting uncollectible invoices as overdue would raise it to $649.1K. Including test-mode records would raise it only to $307.4K. Most invoices have no stored due date, so I derived it from the customer's payment terms. Invoices with a derived due date account for $163.1K of the total. Using an exact 30-day cutoff instead of more than 30 days moves the total only to $305.9K.

Additional query result: Invoice data profile
Additional query result: FX rates profile
Additional query result: Invoice segments
Additional query result: Credit notes by invoice status
Additional query result: Open invoices detail

RECOMMENDATION: Start with South Tidewater Freight and Old Juniper Urgent Care. Collecting on those two invoices addresses most of the overdue amount. Then decide whether the uncollectible invoices should be reported as a separate write-off line.

Assumed: open invoices only; test-mode customers and invoices excluded; draft, void and uncollectible excluded. Where due_at is blank, due date = issue date + terms (net 30/45, otherwise on receipt). Credit notes counted as amount plus tax. AUD, EUR and GBP converted at the latest available rate (29 Sep 2026). Invoice amounts are assumed to be in minor units (cents).

Should uncollectible invoices count as overdue in this report? That would roughly double the total.

[Scripted reply sent 18:16:42Z: "Use your best judgement and tell me what you assumed."]

[Final response — Stella · Worked for 1m 36s · 3 queries]
Counting uncollectible invoices, $649.1K is overdue by more than 30 days, and East Foxhall Fitness joins the top five. Open invoices alone are 305,557.25.

I counted uncollectible invoices as overdue. The question asks for the amount still unpaid after payments and credit notes, and an uncollectible invoice is still unpaid and past due. It is a bad-debt flag, not a payment. As of 30 September 2026 the total is $649.1K across 146 live customers. Of that, 305,557.25 sits on open invoices and 343,561.44 on uncollectible ones. The uncollectible portion is therefore slightly larger than the open portion, and my earlier answer left it out.

Top 10 customers by overdue >30 days (open + uncollectible, USD)
Cust ID | Legal Name | Max Days Overdue | N Customers | Open Usd | Overdue Invoices | Owed Usd | Total Open Usd | Total Owed Usd | Total Unc Usd | Unc Usd
50,038 | East Foxhall Fitness LLC | 602 | 146 | $0 | 1 | $175,838 | 305,557.24812419194 | $649,119 | 343,561.4388812976 | $175,838
50,150 | South Tidewater Freight B.V. | 494 | 146 | $135,649 | 1 | $135,649 | 305,557.24812419194 | $649,119 | 343,561.4388812976 | $0
50,113 | Old Juniper Urgent Care Ltd | 477 | 146 | $111,289 | 1 | $111,289 | 305,557.24812419194 | $649,119 | 343,561.4388812976 | $0
50,987 | North Cedar Ridge Pest Control Ltd | 220 | 146 | $0 | 1 | $45,413 | 305,557.24812419194 | $649,119 | 343,561.4388812976 | $45,413
50,543 | Bellmont Medical Group LLC | 153 | 146 | $0 | 1 | $39,373 | 305,557.24812419194 | $649,119 | 343,561.4388812976 | $39,373
50,459 | Eastgate Smile Studio LLC | 561 | 146 | $0 | 1 | $35,294 | 305,557.24812419194 | $649,119 | 343,561.4388812976 | $35,294
50,658 | Greater Lakeside Home Cleaning LLC | 442 | 146 | $0 | 2 | $5,409 | 305,557.24812419194 | $649,119 | 343,561.4388812976 | $5,409
50,946 | Greater Harborview Medical Group B.V. | 67 | 146 | $0 | 1 | $4,830 | 305,557.24812419194 | $649,119 | 343,561.4388812976 | $4,830
50,127 | North Highland HVAC Pty Ltd | 173 | 146 | $0 | 1 | $4,525 | 305,557.24812419194 | $649,119 | 343,561.4388812976 | $4,525
50,836 | East Woodvale Smile Studio Ltd | 252 | 146 | $3,683 | 1 | $3,683 | 305,557.24812419194 | $649,119 | 343,561.4388812976 | $0

The five customers who owe the most are East Foxhall Fitness LLC ($175.8K, one uncollectible invoice, 602 days overdue), South Tidewater Freight B.V. ($135.6K, open), Old Juniper Urgent Care Ltd ($111.3K, open), North Cedar Ridge Pest Control Ltd ($45.4K, uncollectible) and Bellmont Medical Group LLC ($39.4K, uncollectible). Each has one overdue invoice. The balance is concentrated in a few large invoices rather than spread across many customers. Collections effort should go to these accounts first. For the three uncollectible ones, the write-off decision comes before any chase.

The result is robust to the other judgement calls I made. Live uncollectible invoices come to $343.6K on 84 invoices. Test-mode customers or invoices, which I excluded, would add only $1.9K. I checked that migrated and replaced records do not double-count anything: the migrated open invoices come to $3.2K for live customers, and none of the overdue invoices is flagged as replaced. The big swing factor remains the uncollectible treatment, not data quality.

Overdue >30d balance by status and customer type (USD)
Customers | Live | Max Days Overdue | Migrated | N | Replaced | Status | Usd
2 | ✕ | 497 | ✕ | 2 | ✕ | open | $1,074
1 | ✕ | 642 | ✓ | 1 | ✕ | open | $783
79 | ✓ | 593 | ✕ | 81 | ✕ | open | $302,405
2 | ✓ | 641 | ✓ | 2 | ✕ | open | $3,152
72 | ✓ | 602 | ✕ | 84 | ✕ | uncollectible | $343,561

RECOMMENDATION: Send the open invoices from South Tidewater and Old Juniper to active collections. Have finance confirm whether the uncollectible invoices, led by East Foxhall, should stay on the receivables report or move to a separate bad-debt line. Report the two figures side by side until that is settled.

Assumed: (1) uncollectible invoices count as overdue, so the total is open plus uncollectible, and both figures are shown. (2) Draft, void and paid invoices are excluded. (3) Test-mode customers and invoices are excluded. (4) Where due_at is blank, the due date is issue date plus terms (net 30 or net 45 add 30 or 45 days; due on receipt and card add 0). (5) Overdue means more than 30 days past due on 30 September 2026. (6) Unpaid balance is the invoice total, which includes tax, minus payments and credit notes (amount plus tax). It is floored at zero per invoice. (7) AUD, EUR and GBP are converted at the 29 September 2026 rate. (8) Invoice amounts are read as minor units (cents). Rule applied: money reported in US dollars.

Does finance treat uncollectible invoices as written off? If so, I'll rerun the report with them as a separate bad-debt line.

### Q7. Sales performance, H1 2026

[Stella · Worked for 1m 51s · 7 queries]
New-business win rates for Jan–Jun 2026 run from 24.5% to 50.0%. The top figure is Sofia Marin's, and it rests on only 12 deals.

Across the 257 won-or-lost new-business deals, 76 were won. Win rates range from 24.5% for Liam Carter, the lowest, to 50.0% for Sofia Marin, the highest. Liam also carries the biggest book, with 49 decided deals. Sofia decided only 12, so her lead is directional and shouldn't be used to rank her. Among reps with a full book, Dana Whitfield is best at 36.4%, followed by Priya Raman at 31.8%. Ana Pereira (25.0%), Marcus Bell (25.5%) and Liam are all near a quarter.

New-business win rate and median sales cycle by rep, Jan–Jun 2026
Deals Decided | Lost Deals | Median Cycle Days | Rep | Win Rate | Won Deals
28 | 21 | 51.0 | Ana Pereira | 25.0% | 7
33 | 21 | 41.0 | Dana Whitfield | 36.4% | 12
49 | 37 | 47.0 | Liam Carter | 24.5% | 12
47 | 35 | 50.0 | Marcus Bell | 25.5% | 12
44 | 30 | 37.5 | Priya Raman | 31.8% | 14
12 | 6 | 64.0 | Sofia Marin | 50.0% | 6
44 | 31 | 34.0 | Tom Okoye | 29.5% | 13

Median sales cycle (created to close) runs from 34 days for Tom Okoye to 64 days for Sofia Marin, again on a small sample. Tom, Priya Raman (37.5 days) and Dana Whitfield (41 days) close fastest. Marcus Bell (50 days) and Ana Pereira (51 days) are slowest among reps with a full book, and Liam Carter sits at 47 days. Speed doesn't track winning. Tom closes quickest but converts about 29.5%, while Sofia is slowest and converts most.

Additional query result: Opp profile
Additional query result: Users
Additional query result: Import overlap
Additional query result: Dup check
Additional query result: Dup/notes

RECOMMENDATION: Treat the rep-to-rep gaps among the six reps with full books (Ana, Dana, Liam, Marcus, Priya, Tom) as the meaningful comparison. Sofia's numbers need more closed deals before they inform any decision. To settle the Meridian question, confirm with Sales Ops whether consolidation deals count as new business.

Population: opportunities from the Salesforce feed with a close date from 1 Jan to 30 Jun 2026 and a won or lost outcome, with disqualified and soft-deleted records excluded. I kept 'new business' to the four spellings used for it (NB, New Biz, New Business, new_business). Stage labels were normalised (Won, closed_won, Closed Won, 06 - Closed Won; and the lost equivalents). All 50 rows in the Q1 import are exact copies of Salesforce records (same account, owner, dates and amount), so I excluded them to avoid double counting. Dana Whitfield appears under two user IDs (one inactive, one active), and I combined them into one rep. Cycle = close date minus created date. Win rate is by deal count, so no currency conversion was needed. One large Marcus Bell win (Meridian Health Group, tagged NB) is a consolidation of 16 existing clinic subscriptions into a group contract, which arguably isn't new logo business. It counts as one deal here, but excluding it would lower his win rate slightly.

### Q8. Paying customers missing from the CRM

[Stella · Worked for 3m 21s · 15 queries]
214 paying customers have no CRM account, representing about 59,658.33 of MRR (USD, net of discounts) at 30 Sep 2026.

Of 866 paying customers worth 995,544.08 of MRR in total, 214 cannot be found in the CRM, carrying 59,658.33 of MRR. Those 214 customers are therefore invisible to account owners and to sales or success reporting. Before discounts the same group is 60,610.33.

Missing-from-CRM customers after demo and name-match checks
Cust ID | Demo MRR | Demo N | Email | Final Gross | Final MRR | Final N | MRR | Name | Namematch MRR | Namematch N | Nocrm Ref MRR | Nocrm Ref N | Paying MRR | Paying N | Section
— | 1,897 | 3 | — | 60,610.33 | 59,658.33 | 214 | — | — | 0 | 0 | 61,555.33 | 217 | 995,544.08 | 866 | summary
51,509 | — | — | [email redacted] | — | — | — | 245 | Corvia Demo - Clinic 1 LLC | — | — | — | — | — | — | demo_or_test_like
51,513 | — | — | [email redacted] | — | — | — | 1,372 | Corvia Demo - Dental 5 LLC | — | — | — | — | — | — | demo_or_test_like
51,510 | — | — | [email redacted] | — | — | — | 280 | Corvia Demo - Clinic 2 LLC | — | — | — | — | — | — | demo_or_test_like

Three more live billing records, named "Corvia Demo" with internal [email redacted] emails, also lack a CRM account and add 1,897 of MRR. I treated them as internal test accounts and left them out of the answer. If you count them, the totals become 217 customers and 61,555.33.

The match is robust, so the gap is not a formatting artefact. I trimmed whitespace and ignored case on the CRM billing reference. I also read the Stripe ID in each account's external-ID field. Deleted duplicate accounts that were merged into a surviving account still count as the customer being in the CRM. A name-based check found 0 of the unmatched customers in the CRM under a different reference. Most unmatched customers really have no CRM record.

Additional query result: Billing customers sample
Additional query result: Plans
Additional query result: CRM billing ref samples
Additional query result: FX coverage
Additional query result: Sample subs
Additional query result: ext_ids
Additional query result: Subscription history shape
Additional query result: Coupons
Additional query result: Latest subs profile
Additional query result: Billing customer integrity
Additional query result: Paying customers with no CRM account and their MRR

RECOMMENDATION: Hand the unmatched-customer list to RevOps to create or link CRM accounts, starting with the largest MRR accounts. Also find out which step creates billing customers without a CRM record.

Assumed: paying means the latest subscription status is active or past_due. Trialing, paused and canceled are excluded. Test-mode customers, the internal accounts flagged in the legacy table and the Corvia demo accounts are excluded. MRR is per-seat price × seats, or the custom annual amount ÷ 12. It is net of coupons active on 30 Sep 2026. It is converted to USD at the 29 Sep 2026 FX rate, the latest in the table. Two of the unmatched customers are past_due only.

Do you want the full list of the unmatched customers, ranked by MRR, to hand to RevOps?

### Q9. ARR by industry

[Stella · Worked for 3m 23s · 15 queries]
Healthcare brings in the most ARR: 0.29 of 11,923,764.9 total ARR (3,476,926.84 as of 30 Sep 2026), well ahead of the next industry.

Healthcare leads with ARR of 3,476,926.84 (today's MRR × 12, in USD), which is 0.29 of the 11,923,764.9 total ARR from live customers. Field Services is second at 1,844,541.15 (0.15 of total), so Healthcare is nearly twice the next industry. Healthcare here combines clinics, medical practices and hospitals. Dental is counted separately at 1,497,082.64; if you grouped it with Healthcare, the combined share would be higher.

ARR by industry (USD)
ARR Usd | ARR Without Merge Follow | Industry | Share Of Total
3,476,926.84 | 3,476,926.84 | Healthcare | 0.2915963936169811
1,844,541.15 | 1,844,541.15 | Field Services | 0.15469452479050455
1,665,944.12 | 1,665,944.12 | Home Services | 0.1397162837255385
1,497,082.64 | 1,497,082.64 | Dental | 0.12555452506061773
1,482,115.51 | 1,482,115.51 | No CRM account | 0.12429929006602969
770,121.41 | 770,121.41 | Logistics | 0.06458710145747555
607,180.96 | 607,180.96 | Other | 0.050921916401095876
579,852.27 | 579,852.27 | Veterinary | 0.04862996488175714
11,923,764.9 | — | TOTAL live customers | 1
261,156 | — | EXCLUDED test/internal ARR | —
0 | — | plan vs customer currency mismatches | —
863 | — | paying subs counted | —
0 | — | MRR by status {'canceled': 349986, 'active': 1012705, 'paused': 3359, 'past_due': 2705, 'trialing': 17761} | —
0 | — | fx {'USD': 1.0, 'EUR': 1.108737, 'GBP': 1.290235, 'AUD': 0.669714313268246} | —

The ranking does not depend on the data gaps I had to work around. 1,482,115.51 of ARR sits with billing customers that have no CRM account, so they have no industry. If every dollar of that landed in Field Services, it would still total less than Healthcare. I also left out 261,156 of ARR from test, demo and internal accounts. Those would otherwise have inflated the total.

Additional query result: Industry map
Additional query result: Subscription profile
Additional query result: Plans
Additional query result: Industry map and CRM sample
Additional query result: Coupons
Additional query result: FX coverage
Additional query result: Subscription versions sample
Additional query result: Test-like customers
Additional query result: Customer profile
Additional query result: Data checks for ARR build
Additional query result: Overlap and CRM link checks

ARR definition: current subscription version as of end of 30 Sep 2026. It counts active and past-due subscriptions only; trialing, paused and canceled are excluded. Price is seats × plan price, or the custom annual amount where set, less any coupon still running. Annual plans are divided by 12. AUD, EUR and GBP convert to USD at the 29 Sep 2026 rate, the latest available. Industry comes from the CRM via the billing customer reference. I mapped 8 raw labels the reference table lacks (e.g. 'Medical Practice' to Healthcare, 'Vet clinic' to Veterinary). Share uses total ARR including the unclassified customers as the denominator. Excluding them, Healthcare's share would be higher.

### Q10. Seat utilization

[Stella · Worked for 3m 52s · 18 queries]
In September 2026, 0.57 of the seats paying customers pay for were used by a real person, so over 40% of paid seats sat idle.

At the end of September, 860 paying customers were billed for 28,312 seats in total. Real people used 16,205 of those seats, a utilization of 0.57. I counted a seat as used when a real person in that customer's workspace logged any event in September, and capped each customer at the seats it pays for. Without the cap the share is 0.57. Over-use is therefore negligible, and idle seats are the whole story.

Seat utilization scenarios
Customers | Detail | Multiws | N | Nolink Custs | Nolink Seats | Same Qty Status | Scenario | Seats Linked | Share | Share Capped | Used | Used Capped
— | [(269, 'canceled', 35, '2024-05-05T15:00:00Z', '9999-12-31T00:00:00Z', '2024-05-05T15:01:00Z'), (270, 'canceled', 35, '2024-05-05T15:00:00Z', '9999-12-31T00:00:00Z', '2024-05-05T15:01:00Z')] cust 51522 | — | — | — | — | — | overlap_example | — | — | — | — | —
— | [(805, 'canceled', 3, '2024-11-01T14:19:00Z', '9999-12-31T00:00:00Z', '2024-11-01T14:20:00Z'), (806, 'canceled', 3, '2024-11-01T14:19:00Z', '9999-12-31T00:00:00Z', '2024-11-01T14:20:00Z')] cust 50134 | — | — | — | — | — | overlap_example | — | — | — | — | —
— | [(1239, 'canceled', 4, '2025-02-25T18:06:00Z', 'None', '2025-02-25T18:09:00Z'), (1240, 'canceled', 4, '2025-02-25T18:06:00Z', 'None', '2025-02-25T18:09:00Z')] cust 50253 | — | — | — | — | — | overlap_example | — | — | — | — | —
— | [(1425, 'canceled', 7, '2025-04-05T18:29:00Z', 'None', '2025-04-05T18:34:00Z'), (1426, 'canceled', 7, '2025-04-05T18:29:00Z', 'None', '2025-04-05T18:34:00Z')] cust 50209 | — | — | — | — | — | overlap_example | — | — | — | — | —
— | [(1545, 'active', 6, '2025-04-29T02:58:00Z', '9999-12-31T00:00:00Z', '2025-04-29T03:00:00Z'), (1546, 'active', 6, '2025-04-29T02:58:00Z', '9999-12-31T00:00:00Z', '2025-04-29T03:00:00Z')] cust 50566 | — | — | — | — | — | overlap_example | — | — | — | — | —
— | [(2077, 'active', 22, '2025-08-12T09:01:31.301119Z', 'None', '2025-08-12T09:06:31.301119Z'), (2078, 'active', 22, '2025-08-12T09:01:31.301119Z', 'None', '2025-08-12T09:06:31.301119Z')] cust 50285 | — | — | — | — | — | overlap_example | — | — | — | — | —
— | — | — | 22 | — | — | 22 | overlap_count | — | — | — | — | —
860 | — | 0 | — | 0 | 0 | — | 2026-09-30 active | 28,312 | 0.5735024018084205 | 0.5723721390223226 | 16,237 | 16,205
867 | — | 0 | — | 0 | 0 | — | 2026-09-30 active+past_due | 28,383 | 0.5737237078532924 | 0.5725610400591904 | 16,284 | 16,251
839 | — | 0 | — | 0 | 0 | — | 2026-09-01 active | 26,947 | 0.5772813300181838 | 0.5759082643708019 | 15,556 | 15,519
847 | — | 0 | — | 0 | 0 | — | 2026-09-01 active+past_due | 26,984 | 0.5772309516750667 | 0.5757856507560035 | 15,576 | 15,537
844 | — | 0 | — | 0 | 0 | — | 2026-09-15 active | 27,622 | 0.5752298892187386 | 0.5738903772355369 | 15,889 | 15,852
850 | — | 0 | — | 0 | 0 | — | 2026-09-15 active+past_due | 27,700 | 0.5754151624548737 | 0.574043321299639 | 15,939 | 15,901

The answer does not depend on how I define the paying base or the snapshot date. Adding past-due subscriptions gives 0.57. Taking seats as of 1 September gives 0.58, and mid-month gives 0.57. All of these sit within about a percentage point, so the figure is a stable 57%.

Additional query result: Customers sample
Additional query result: Workspaces sample
Additional query result: Subscription profile
Additional query result: Event profile
Additional query result: User profile
Additional query result: Plans
Additional query result: Multi-version subs
Additional query result: Subs per customer
Additional query result: Final-day subscription rows
Additional query result: Seat utilization diagnostics
Additional query result: Workspace link variants
Additional query result: User classification diagnostics

RECOMMENDATION: Treat 57% as the baseline. The data shows how many seats are idle but not why. The first diagnostic is to split utilization by customer size and plan tier to see whether idle seats are concentrated in a few over-provisioned accounts or spread evenly.

Assumed: paying means an active subscription in a live (non-test) billing account, taken as of the end of 30 Sep 2026. Seats are the subscription quantity. Trialing, paused, canceled and past-due subscriptions are excluded from the headline. Users are matched to billing customers through the workspace's Stripe customer ID, which appears in two metadata formats, and sandbox and internal workspaces are excluded. Excluded as not real people: bot and integration users (is_bot flag, api role, Zapier and api-sync accounts) and Corvia staff (corvia.io addresses, support_admin role, corviademo* demo domains). 22 subscriptions had exact duplicate rows, which I counted once. Every active customer linked to exactly one workspace. This is a utilization share, not a cost or revenue figure, so no currency applies.

How does seat utilization differ by plan tier and customer size, and which customers hold the most idle seats?

### Q11. Appointments trend

**Rerun (counted)**

**Turn 1 (only turn) — Stella, "Worked for 1m 29s · 5 queries"**

Customer-created appointments rose every month from June to September 2026, from 71,830 to 80,467 (+12.0%).

Counting only appointments created by real customer users (excluding API/bot integrations and sandbox workspaces, unique events), volume went from 71,830 in June to 73,233 in July, 75,833 in August and 80,467 in September. September was up +6.1% on August, and the June-to-September gain is +12.0%. The trend is a steady climb with no dip, and September is the highest month.

Chart: Customer-created appointments per month (Jun–Sep 2026) (series customer_appointments, api_bot_appointments, sandbox_appointments, all_unique_events; values from the server payload)

| Month | customer_appointments | api_bot_appointments | sandbox_appointments | all_unique_events |
|---|---|---|---|---|
| 2026-06 | 71,830 | 55,759 | 237 | 127,826 |
| 2026-07 | 73,233 | 57,683 | 261 | 131,177 |
| 2026-08 | 75,833 | 58,228 | 244 | 134,305 |
| 2026-09 | 80,467 | 61,922 | 279 | 142,668 |

A naive count would overstate customer activity. Across the four months, API/bot accounts (automation users and Zapier hooks) created 233,592 appointments against 301,363 from customer users. The API/bot volume grew at about the same pace as customer volume (September API/bot up +6.3% on August), so excluding it changes the level far more than the trend.

Data hygiene: the event name changes mid-window. It is logged as appointment_created in June and July and as appointment.created in August and September, with no overlap, so counting only one name would show appointments dropping to zero at the switch. Duplicate event IDs also exist: 552,270 raw rows against 535,976 unique IDs, so the monthly figures use unique IDs.

Table: Event data quality

| Distinct Ids | Late Over 1d | Null User | Null Ws | Received Before Occurred | Rows Total |
|---|---|---|---|---|---|
| 535,976 | 0 | 0 | 0 | 0 | 552,270 |

Additional query results (collapsed): Appointment events by user/workspace type; Appointment events by name and month; Users by role, bot flag, domain

RECOMMENDATION: Standardise on one appointment event name in the tracking pipeline and dedupe by event ID in reporting. Confirm with product whether Zapier-driven appointments count as customer-created.

Assumed: 'customers' means non-API, non-bot users in non-sandbox workspaces; month is by event time (UTC); both event names counted, by unique event ID. About 14% of API-role events come from Zapier hooks whose users have an unset bot flag; I treated them as integrations, so include them if you count them as customer activity. All four months are complete.

**First run**

[First response — Stella · Worked for 1m 17s · 4 queries]
Customer-created appointments rose every month, from 71,830 in June to 80,467 in September (+12.0% overall).

Counting appointments created by real customer users (duplicates removed; bots, API/automation accounts and sandbox workspaces excluded), volume was 71,830 in June, 73,233 in July, 75,833 in August and 80,467 in September 2026. Growth was +2.0% June to July, +3.6% July to August and +6.1% August to September, so the trend is a steady climb without a clear acceleration or stall.

Appointments created by customers per month (deduplicated, excl. bots/API/sandbox)
customer_appointments
api_automation
support_admin
sandbox_human
all_deduped
[chart]

A naive count of raw appointment events would overstate customer activity: it gives 552,270 events across the four months against 301,363 customer appointments. Bot-flagged users account for 36.1% of raw events, API/Zapier accounts add more, and 16,294 rows are exact duplicate copies of an event ID. Automation alone created 61,922 appointments in September, so it is a large part of platform activity, but it is not customers creating appointments.

Appointment events by name, month, bot and sandbox
Distinct Ids | Event Name | Events | Is Bot | Is Sandbox | Month | No User
81,382 | appointment_created | 83,829 | ✕ | ✕ | Jun 01, 2026, 12:00 AM | ✕
237 | appointment_created | 239 | ✕ | ✓ | Jun 01, 2026, 12:00 AM | ✕
46,207 | appointment_created | 47,605 | ✓ | ✕ | Jun 01, 2026, 12:00 AM | ✕
83,303 | appointment_created | 85,844 | ✕ | ✕ | Jul 01, 2026, 12:00 AM | ✕
261 | appointment_created | 267 | ✕ | ✓ | Jul 01, 2026, 12:00 AM | ✕
47,613 | appointment_created | 49,052 | ✓ | ✕ | Jul 01, 2026, 12:00 AM | ✕
86,078 | appointment.created | 88,758 | ✕ | ✕ | Aug 01, 2026, 12:00 AM | ✕
244 | appointment.created | 251 | ✕ | ✓ | Aug 01, 2026, 12:00 AM | ✕
47,983 | appointment.created | 49,447 | ✓ | ✕ | Aug 01, 2026, 12:00 AM | ✕
90,926 | appointment.created | 93,642 | ✕ | ✕ | Sep 01, 2026, 12:00 AM | ✕
279 | appointment.created | 288 | ✕ | ✓ | Sep 01, 2026, 12:00 AM | ✕
51,463 | appointment.created | 53,048 | ✓ | ✕ | Sep 01, 2026, 12:00 AM | ✕
Duplicate and timing checks
Dup Ids | Dups Differing | Extra Rows | Late Over 1d | Max Occ | Min Occ | Recv Before Occ
16,294 | 0 | 16,294 | 0 | Sep 30, 2026, 11:59 PM | Jun 01, 2026, 12:00 AM | 0

The event name changed partway through the window: 'appointment_created' (underscore) is the only name used in June and July, and 'appointment.created' (dot) is the only name in August and September. Filtering on just one spelling would show a false collapse or jump at the July/August boundary. Counting both names gives a continuous series, so I treat them as the same event.

Additional query result: Appointment events by user role and email domain

RECOMMENDATION: Use the cleaned series (unique events, both event names, humans only) as the standard definition for appointment-creation reporting, and ask engineering to confirm the event rename and the duplicate event IDs so dashboards don't silently break.

Definition: unique event_id, both event-name spellings, human users only (excludes is_bot, role 'api' incl. Zapier webhook accounts, and sandbox workspaces); UTC calendar months, all four fully covered through 30 Sep 2026. Zapier/API-created appointments are in a separate column of the chart data if you want them counted.

Should Zapier/API-created appointments count as customer-created? Including them would raise the monthly totals substantially.

[Scripted reply sent 18:04:38Z: "Use your best judgement and tell me what you assumed."]

[Final response — Stella · Worked for 1m 45s · 4 queries]
Counting Zapier as customer activity but not Corvia's own integration bots, human-logged appointments still grew +12.0% June to September, and Zapier adds a separate stream.

Judgement call: Zapier webhook accounts (not bot-flagged, one per customer workspace) are customers' own automations, so their appointments are counted as customer-originated but reported apart from people. Human users logged 71,830 appointments in June and 80,467 in September; Zapier webhooks logged 9,552 in June and 10,459 in September. Zapier grew +9.5% over the same span versus +12.0% for humans, so it doesn't change the upward trend. Across the four months that is 301,363 human appointments and 40,326 Zapier appointments.

Customer-created appointments per month, Jun–Sep 2026 (humans vs Zapier; excl. Corvia bots and sandbox)
human_users
zapier_webhooks
[chart]

Judgement call: Corvia's own 'Corvia Integration' accounts (bots.corvia.app, flagged as bots) are left out. They sit in 409 workspaces and account for 193,266 appointments over the four months, 82.7% of all API-role appointments. They look platform-generated rather than customer-initiated, and counting them would more than double the totals. The API-role group in total accounts for 233,592 appointments across 497 accounts.

API-role accounts creating appointments
Appts | Domain | Is Bot | Is Sandbox | Role | Sample Email | Sample Name | Users | Workspaces
193,266 | bots.corvia.app | ✓ | ✕ | api | [email redacted] | Corvia Integration | 409 | 409
40,326 | hooks.zapier.com | ✕ | ✕ | api | [email redacted] | Zapier | 88 | 88

Duplicate event IDs were removed and both event-name spellings were counted, as in the earlier answer. Sandbox workspaces are left out; they hold 1,021 appointments, 0.2% of the deduplicated total.

Appointments by role, bot flag and sandbox
Appts | Is Bot | Is Sandbox | Role | Users
193,266 | ✓ | ✕ | api | 409
154,201 | ✕ | ✕ | member | 13,913
97,701 | ✕ | ✕ | admin | 4,610
49,461 | ✕ | ✕ | dispatcher | 4,540
40,326 | ✕ | ✕ | api | 88
591 | ✕ | ✓ | member | 207
234 | ✕ | ✓ | dispatcher | 75
196 | ✕ | ✓ | admin | 63

RECOMMENDATION: Use human-logged appointments as the headline customer-activity metric and show Zapier as a separate 'customer automation' line, so nothing hides if either stream moves. Ask product or engineering whether the Corvia Integration bots represent a feature customers use, such as online booking. If so, they might belong in a platform-activity metric, though not in 'customers creating appointments'.

Assumed: Zapier counts as customer-originated and is shown separately; Corvia Integration bots, other bot-flagged users and sandbox workspaces are left out; unique event IDs, both event-name spellings, UTC months June–September 2026. Nothing in the data confirms who set up the Zapier hooks or what the bots do, so both calls are judgement.

Do the Corvia Integration bot accounts represent a customer-facing feature, such as online booking, that should count as customer-originated?

### Q12. Enterprise support responsiveness

[Stella · Worked for 2m 6s · 5 queries]
Enterprise customers' first human reply took a median of 101.33 minutes in Q3 2026, and 0.78 of tickets got one within 4 hours.

Of 911 Enterprise tickets opened in Q3 2026, 713 got a human reply within 4 hours, which is 0.78. The median time to first human reply was 101.33 minutes (about 1.7 hours), measured on the 855 tickets that were answered. 56 tickets had no reply yet and count as misses, so the share is out of all 911 tickets. The 90th-percentile reply took 310.1 minutes, so the median looks healthy but roughly one in five Enterprise tickets sits outside the 4-hour target.

Enterprise Q3 first human reply
Max Min | Mean Min | Median H | Median Min | Min Min | Ndom | Negative | No Reply | P90 Min | Set | Share Of All Tickets | Tickets | With Reply | Within4h
1,165.4168151652018 | 146.1294316134568 | 1.685368350830078 | 101.12210104980468 | 10.448917915852865 | 62 | 0 | 60 | 305.0634352010091 | enterprise_all | 0.783068783068783 | 945 | 885 | 740
1,165.4168151652018 | 147.0593540667593 | 1.6887994211154513 | 101.32796526692708 | 10.63218175048828 | 62 | 0 | 56 | 310.09852996826174 | enterprise_excl_merged | 0.7826564215148188 | 911 | 855 | 713
8,674.398251216635 | 325.1097683131569 | 2.9329855117797847 | 175.9791307067871 | 10.63218175048828 | 62 | 0 | 121 | 715.8346731160482 | all_cust_excl_merged | 0.5794344473007712 | 1,945 | 1,824 | 1,127

Enterprise is answered faster than the customer base as a whole. Across all customers in the same quarter, the median first human reply was 175.98 minutes and only 0.58 of tickets were answered within 4 hours. Enterprise tickets get replies sooner, and a larger share lands inside the target. This is a descriptive comparison. The data doesn't show whether it comes from deliberate prioritisation.

Additional query result: Profile tickets, events, customers
Additional query result: Enterprise identification check
Additional query result: Ticket matching diagnostics

Assumed: Enterprise means billing customers whose segment is enterprise (62 live accounts, all on the Enterprise plan tier). Tickets were matched to them by requester email domain, trimmed and case-insensitive, and every Q3 ticket matched a customer. Q3 runs 1 Jul to 30 Sep 2026 UTC, by ticket creation time. A first human reply is the earliest public agent message, so automatic acknowledgements and internal notes are ignored. I excluded 34 tickets marked as merged into another ticket, to avoid double counting. Including them gives 945 tickets, a 101.1-minute median and 78.3% within 4 hours, so the conclusion doesn't change. The median covers answered tickets only. The 4-hour share counts no-reply tickets as misses, per your rule. Money isn't involved, so the US-dollar rule doesn't apply.

### Q13. Customer count

**First run (counted)**

[First response — Stella · Worked for 2m 27s · 11 queries]
We have 863 current paying customers; 1,525 real accounts have ever been created, and most of the difference is cancelled accounts.

The headline answer is 863 customers: real accounts with at least one subscription that is active or past due as of 30 Sep 2026. Of those, 856 have an active subscription and the rest are past due only. I counted past-due accounts because they have not cancelled. If you want only fully paid-up customers, use 856.

Customer count after cleanup
All | Excl Demo Live | Excl Legacy Internal Live | Excl Notlive | Real | Real Canceled Only | Real Paused Only | Real Paying | Real Paying Active Only | Real Trial Only | Test Excluded
1,555 | 6 | 0 | 24 | 1,525 | 632 | 5 | 863 | 856 | 25 | 30

The billing customer table holds 1,555 records, one per customer, with no duplicate emails, billing references or company names. That total is not a customer count. It includes 24 test-mode records and 6 live-mode Corvia demo or QA accounts, leaving 1,525 real accounts. Of those, 632 have only cancelled subscriptions, 25 are trialing only and 5 are paused only. These accounts exist but are not paying customers today.

Additional query result: CRM accounts profile
Additional query result: Billing customers profile
Additional query result: Subscriptions status profile
Additional query result: Subscription versions per sub
Additional query result: Customers by subscription state
Additional query result: Customer duplicate/test checks
Additional query result: Customers by latest subscription status
Additional query result: Test-like live customers
Additional query result: Legacy vs billing overlap

RECOMMENDATION: Use the paying-customer figure for reporting. Exclude test-mode and demo accounts everywhere, since the 6 demo accounts are flagged as live in billing and would otherwise inflate customer counts.

Customer = a billing customer record, excluding test-mode records and Corvia demo/QA accounts (identified by name and email). Status uses the latest version of each subscription in the subscription history. CRM and legacy tables were not used for the count because they are partial or overlapping views of the same accounts. CRM also holds many prospects and merged or deleted records.

Should trialing-only and paused-only accounts count as customers in your reporting? That would raise the figure from 863 to as much as 893.

[Scripted reply sent 18:09:54Z: "Use your best judgement and tell me what you assumed."]

[Final response — Stella · Worked for 1m 11s · 2 queries]
Using my own judgement, Corvia has 863 paying customers as of 30 Sep 2026. That's active or past-due accounts, with trials, paused and cancelled accounts left out.

I kept 863 as the headline, which is unchanged from my last answer. That is real accounts with at least one subscription that is active or past due. Of these, 856 are fully active and the rest are past due. A past-due customer hasn't cancelled and still owes money, so it still counts. For a strict paid-up-only figure, use 856.

Customer count by definition
A Paying Active Only | B Paying Active Or Past Due | Billing Records | C Plus Trialing | D Plus Paused | Demo Or Internal Live | Never Paying Or Cancelled | Real Accounts Ever | Test Mode
856 | 863 | 1,555 | 888 | 893 | 6 | 632 | 1,525 | 24

I left trialing and paused accounts out. Adding trial-only accounts would make it 888, and adding paused-only accounts as well would make it 893. Trial accounts aren't paying yet and paused accounts aren't being billed, so counting them would overstate the paying base. They can be reported as a separate line.

Removing non-customers matters. The billing table has 1,555 records. Excluding 24 test-mode records and 6 live-mode Corvia demo or internal accounts leaves 1,525 real accounts on record. Of those, 632 have only cancelled subscriptions, so they are former customers, not current ones.

I re-checked last turn's figure because one earlier check gave a much lower count. The subscription history marks a version as open-ended in two ways: a far-future end date, and a blank end date. A filter on the far-future date alone misses the blank ones, which is why that check came out low. Reading each subscription's latest version avoids the problem, so 863 stands.

Additional query result: Latest subscription version: status vs whether it is still open

RECOMMENDATION: Report the active-or-past-due figure as the paying-customer count and show trialing and paused accounts as a separate line. Fix the mixed open-ended date convention in the subscription history, because it will trip up any 'as of date' query.

Assumed: "customer" = a real billing account with an active or past-due subscription at 30 Sep 2026 (the end of the data window). Test-mode records and Corvia demo or QA accounts are excluded, and I identified them by name, email and legacy 'internal' type, so a few unusual accounts could be missed. Status uses each subscription's latest version. I used billing data only and did not use CRM or legacy data. The question involves no money, so no currency applies.

**Rerun sent by mistake (disregarded)**

**Turn 1 (only turn) — Stella, "Worked for 2m 6s · 8 queries"**

We have 868 current customers: billing accounts holding an active, past-due or paused subscription as of 30 Sep 2026.

The billing system lists 1,555 customer records, but 30 are test or internal accounts. These are sandbox (non-live) accounts or ones with test, demo or company-domain names, and they match the 14 internal accounts in the legacy table. Excluding them leaves 1,525 genuine customers who have ever signed up. No duplicate legal names or emails remain among them.

Table: Billing customer profile

| Distinct Cust ID | Distinct Email | Distinct Ext Ref | Distinct Legacy | Last Created | Not Live | Rows Total | Testlike |
|---|---|---|---|---|---|---|---|
| 1,555 | 1,555 | 1,555 | 436 | Sep 29, 2026, 02:17 PM | 24 | 1,555 | 30 |

Table: Customer robustness checks

| Canceled Only | Clean Customers | Customers With Multiple Sub Ids | Distinct Legal Names | Names Shared By Multiple | No Sub | Paying Or Held | Trial Only |
|---|---|---|---|---|---|---|---|
| 632 | 1,525 | 24 | 1,525 | 0 | 0 | 868 | 25 |

Of those 1,525 genuine customers, 868 currently hold a live subscription (active, past due or paused). A further 25 are on a trial only, and 632 have canceled and have no live subscription. If you count trials as customers the figure is higher, but those accounts haven't paid yet. Counting everyone who ever signed up overstates the base, because canceled accounts are a large share of it.

Additional query results (collapsed): Subscription state profile; CRM and legacy counts; Legacy customers; Customers by latest subscription status and test flags

RECOMMENDATION: Report the current-customer figure as the headline. Show trials and canceled accounts separately, and exclude sandbox and internal accounts wherever customers are counted.

Source is billing customers and subscriptions, using each subscription's latest status up to the end of 30 Sep 2026 (UTC). Test accounts were identified by the live-mode flag, test/demo/company-domain names and the legacy internal flag, so it's a rule-based filter. I did not use the CRM account labels because their spelling and status values are inconsistent. The legacy table duplicates billing customers and was not added.

