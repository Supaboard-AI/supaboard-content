# ChatGPT (GPT-6)

**Data Analytics Index: 76.7** (26 of 39 points, accuracy 66.7%)

| Setup | |
|---|---|
| Model | GPT-6, Thinking High |
| Data access | Neon plugin, owner access to the benchmark project only |
| How it was run | All questions in parallel |
| Timing source | Server timestamps minus SQL approval waits |

## Scores

| # | Question | Answer given | Score | Time (s) |
|---|---|---|---|---|
| Q1 | MRR today | MRR $993,647 · 863 customers | 3 | 212 |
| Q2 | Net revenue retention | 97.41% | 3 | 242 |
| Q3 | The May cancellation spike | names the consolidation, 16 clinics, 15 May | 3 | 232 |
| Q4 | Recognized revenue, Q3 2026 | $2,568,266.90 | 3 | 218 |
| Q5 | Billings, 2024 against 2025 | 2024 $2,845,627.70 · 2025 $6,664,837.30 | 3 | 257 |
| Q6 | Overdue receivables | $242,322.53 | 0 | 240 |
| Q7 | Sales performance, H1 2026 | 7 of 7 reps exact, 7 within 5% | 3 | 138 |
| Q8 | Paying customers missing from the CRM | 305 customers · $164,093.96 | 0 | 176 |
| Q9 | ARR by industry | Healthcare · 28.15% | 0 | 148 |
| Q10 | Seat utilization | 57.8% | 2 | 253 |
| Q11 | Appointments trend | Sep 142,389 | 2 | 144 |
| Q12 | Enterprise support responsiveness | Median 100.58 min · 78.3% | 2 | 186 |
| Q13 | Customer count | 867 | 2 | 104 |

## Answers

Full answers as the agent gave them (customer email addresses redacted). Questions are shown by title only.

### Q1. MRR today

## Corvia Systems — MRR snapshot

As of 30 September 2026, 23:59:59 UTC · USD

| Monthly recurring revenue | Paying customers |
|---|---|
| **$993,647** — After discounts, USD equivalent | **863** — Distinct billing customers |

The calculation includes active and past-due subscriptions, normalizes annual contracts to monthly revenue, and excludes trials, paused subscriptions, and internal/test customers.

## MRR by billing currency

| Currency | Paying customers | MRR (USD) |
|---|---:|---:|
| USD | 477 | $503,527 |
| GBP | 130 | $188,634 |
| AUD | 145 | $151,541 |
| EUR | 111 | $149,945 |
| **Total** | **863** | **$993,647** |

Amounts are rounded for presentation; individual currency totals use unrounded FX conversions.

## Calculation methodology

- **Subscription eligibility:** Selected each subscription's state at the end of 30 September 2026 using its validity timestamps, resolving overlapping history records.
- **Paying customers:** Counted distinct customer IDs with an eligible subscription, not users, seats, invoices, or historical subscribers.
- **Revenue:** Used contracted seat quantity × plan price, or the custom annual contract amount for Enterprise. Annual plans are divided by 12.
- **Discounts:** Applied ongoing 15% and 20% discounts; expired three-month promotional discounts no longer reduce MRR.
- **Exclusions:** Removed non-live customers and internal/demo/test accounts, including demo accounts incorrectly marked as live.
- **Taxes and payments:** Excluded tax, one-off charges, and credits. Past-due contracts remain in MRR.

## Exchange rates applied

The database has no FX observations for 30 September. I used the most recent available rates, dated **29 September 2026**, rather than inventing a 30 September rate.

| Currency | Conversion to USD |
|---|---:|
| USD | 1.000000 |
| GBP | 1.290235 |
| EUR | 1.108737 |
| AUD | 1 / 1.493174 |

## Reconciliation

Of the 863 paying customers, **856 are active and 7 are past due**. The past-due subscriptions contribute $2,704.97 to MRR. The total includes 322 annual subscriptions, including 60 Enterprise contracts.

Final unrounded-source calculation: $993,647.08 MRR across 863 paying customers.

Source: Corvia Systems' connected PostgreSQL database, including billing.subscriptions, billing.customers, billing.plans, billing.coupons, and billing.fx_rates. Read-only analysis; no database records changed.

[Transcribed from the rendered chat; the KPI cards are shown as a two-cell table. The API also holds a second end-of-turn message that repeats the methodology / FX / reconciliation sections; the page renders them once.]

### Q2. Net revenue retention

CORVIA SYSTEMS · 12-MONTH RETENTION

## 97.41% net revenue retention

For the 12 months ending **30 September 2026**, Corvia Systems retained **97.41% of its starting monthly recurring revenue**, including expansion, contraction, and churn among customers who were paying on 30 September 2025.

| Starting MRR | Ending MRR | MRR change |
|---|---|---|
| $551,528 (30 Sep 2025) | $537,216 (30 Sep 2026) | −2.59% (−$14,312/month) |

The starting cohort contains **508 paying customers**. New customers acquired after 30 September 2025 are excluded.

### Revenue retention breakdown

| | |
|---|---:|
| Starting cohort MRR | $551,527.69 |
| Expansion | +$55,034.33 |
| Contraction | −$2,566.80 |
| Customer churn | −$66,779.11 |
| **Ending cohort MRR** | **$537,216.11** |

NRR = $537,216.11 / $551,527.69 × 100 = **97.41%**

The biggest drag was customer churn: **100 of the 508 starting customers** had no remaining paying MRR at year-end. Expansion among retained customers offset most, but not all, of that loss.

### Calculation methodology

- **Cohort:** Live, paying billing customers with positive MRR at the end of 30 September 2025. Active and past-due subscriptions are included; trials, paused and canceled subscriptions are excluded.
- **MRR:** Subscription seat count × contracted price, divided by 12 for annual billing. Enterprise annual contracts are also divided by 12.
- **Discounts:** Applicable recurring and time-limited coupons are reflected in MRR.
- **Churn:** Customers who stopped paying contribute $0 at the ending date. Customer expansions and contractions are netted across subscriptions.
- **Currency:** Both snapshots use the same USD conversion rates. The latest FX rates in the database are dated **29 September 2026**, so those are used as the closing-rate proxy.

| Currency | USD conversion rate |
|---|---:|
| USD | 1.000000 |
| GBP | 1.290235 |
| EUR | 1.108737 |
| AUD | 0.669714 |

This is constant-currency NRR, so changes in exchange rates between September 2025 and September 2026 do not affect the retention result.

**Bottom line:** Corvia's existing customer base generated approximately $14.3K less MRR per month than a year earlier, despite substantial expansion revenue. The priority is reducing customer churn, which outweighed the combined benefit of expansions and contractions.

Source: Corvia Systems connected Postgres database — billing.subscriptions, billing.customers, billing.plans, billing.coupons and billing.fx_rates. Dates evaluated at end-of-day UTC. Figures rounded for presentation.

[Transcribed from the rendered chat; KPI cards and the breakdown widget are shown as tables.]

### Q3. The May cancellation spike

## Why cancellations jumped in May 2026

`Root cause identified`

**The May cancellation spike was primarily caused by a successful enterprise contract consolidation—not a sudden deterioration in customer retention.**

On **15 May 2026**, Meridian Health Group consolidated 16 separate US clinic subscriptions into one enterprise contract. The billing system recorded all 16 clinic subscriptions as canceled, even though the customer relationship continued under a larger group agreement.

| May reported cancellations | Meridian consolidations | May excluding Meridian |
|---|---|---|
| 48 (+41% vs April) | 16 (33% of May total) | 32 (−6% vs April) |

### What happened

[Chart: Cancellation-status records, 2026 — "May's 16 Meridian cancellations explain the entire April-to-May increase." Stacked bars: Other cancellations / Meridian consolidation]

| Month | Other cancellations | Meridian consolidation |
|---|---:|---:|
| Jan | 29 | 0 |
| Feb | 27 | 0 |
| Mar | 19 | 0 |
| Apr | 34 | 0 |
| May | 32 | 16 |
| Jun | 35 | 0 |
| Jul | 32 | 0 |
| Aug | 28 | 0 |
| Sep | 41 | 0 |

The database provides a clear audit trail:

- Sixteen clinic subscriptions ended together on 15 May at 00:00 UTC, all belonging to Meridian Health Group and all carrying cancellation reason code 4.
- CRM records show a closed-won enterprise deal on the same date, with the note: “Consolidating 16 Meridian clinic subscriptions into one group contract.”
- A new active annual subscription began for Meridian Health Group on 15 May, covering 310 seats rather than the previous 270.
- The cancellation-reasons reference table has no entry for code 4, so ordinary reason-based reporting displays these records as unclassified cancellations.

This means May's increase of 14 cancellation records was more than fully explained by 16 subscriptions moving into a consolidated contract.

### Revenue impact of the Meridian consolidation

| Previous 16 subscriptions | New enterprise contract |
|---|---|
| $98,640 — Annualized value at listed prices | $123,690 — Contracted annual value |

Annualized contract-value increase (Before discounts, taxes and other adjustments): **+$25,050**
Seats: 270 → 310 (+14.8%)

Rather than losing Meridian, Corvia expanded the relationship. These cancellations should therefore be excluded from customer-churn calculations and represented as an internal consolidation, with the replacement subscription linked to the original contracts.

### But there is an underlying churn warning

Removing the consolidation doesn't mean every retention metric improved.

| Cancellation category | April | May |
|---|---:|---:|
| Meridian consolidation | 0 | 16 |
| Trials not converted | 23 | 14 |
| Other reasons (potential paid churn) | 11 | 18 |
| Total | 34 | 48 |

Although ordinary cancellations fell from 34 to 32 after adjusting for Meridian, cancellations for reasons other than trial failure or consolidation rose from 11 to 18.

This is a 64% increase in the subset most relevant to paid-customer churn. It's a potential concern, although payment history and subscription transitions should be verified before treating all 18 as genuine lost paying customers.

### What I recommend

The immediate priorities are to:

1. **Fix reporting:** Map cancellation code 4 and distinguish contract consolidation from genuine customer churn.
2. **Reconcile revenue:** Match the 16 old Meridian subscriptions with the new enterprise agreement, ensuring no double-counting of losses or expansion.
3. **Investigate the remaining 18 cases:** Focus on price objections, missing features and other cancellation reasons to determine whether this reflects a meaningful worsening of paid retention.

**Bottom line:** May's headline spike was primarily a measurement problem arising from a successful enterprise consolidation. But beneath that event, there was also a smaller, potentially real increase in paid-customer cancellations that deserves investigation.

Source: Corvia Postgres — billing.subscriptions, billing.plans, billing.customers, ref.cancel_reasons, crm.accts and crm.opps. Cutoff: 30 September 2026, 23:59:59 UTC. Cancellation counts use the first day of the canceled-status record (valid_from); monetary figures are in USD.

[Transcribed from the rendered chat; KPI cards shown as tables, chart data taken from the chart's own accessible data labels.]

### Q4. Recognized revenue, Q3 2026

## Q3 2026 recognized revenue — Corvia Systems

RECOGNITION PERIOD · JUL 1 – SEP 30, 2026 (UTC)

**$2,568,266.90**

Net recognized revenue, USD · before tax, after discounts and credit notes

Revenue is calculated using the billing records in Corvia Systems' connected PostgreSQL database, allocating subscription and proration charges across their service periods and recording one-off setup fees and credit notes on their respective issue dates.

### Monthly breakdown

| Month | Net revenue (USD) |
|---|---:|
| July 2026 | $851,214.64 |
| August 2026 | $891,598.91 |
| September 2026 | $825,453.35 |
| **Q3 total** | **$2,568,266.90** |

[Bar chart: Net revenue, USD — Jul $851.2K, Aug $891.6K, Sep $825.5K]

### Revenue reconciliation

| Component | Amount (USD) |
|---|---:|
| Subscription charges | $2,708,709.60 |
| Proration charges | +$24,348.90 |
| Setup fees | +$23,028.59 |
| Discounts | −$25,931.07 |
| Credit notes | −$161,889.12 |
| **Net recognized revenue** | **$2,568,266.90** |

### Calculation methodology

1. **Subscriptions and prorations:** Recognized evenly by calendar day across each invoice line's service period, allocating only the days falling within Q3. Discounts follow their corresponding service periods.
2. **One-off fees:** Setup fees recognized on the invoice issue date.
3. **Credit notes:** Subtracted in full on their UTC issuance dates, excluding tax.
4. **Exclusions:** Removed draft and void invoices, non-live transactions, test customers, and identifiable internal/demo accounts.
5. **Foreign exchange:** Used each invoice's own issuance-date FX rate and each credit note's issuance-date rate. Where no rate existed for that date, used the latest preceding available rate. GBP and EUR were converted directly to USD; AUD was converted using the inverse USD/AUD rate.

All monetary figures are tax-exclusive, and the calculation includes valid open and uncollectible invoices rather than restricting recognition to cash received.

**Notable finding:** September's recognized revenue fell below August's largely because of $129,672.96 in credit notes, compared with $25,931.50 in August.

The calculation found no missing exchange rates among the included revenue events. This is a billing-rule-based revenue calculation, rather than a reconciliation to the general ledger or a full assessment under ASC 606.

[Transcribed from the rendered chat.]

### Q5. Billings, 2024 against 2025

## Corvia Systems — Annual Billings

FY2024 vs FY2025 | USD | Excluding tax

| 2024 billings | 2025 billings |
|---|---|
| $2.85M ($2,845,627.70) | $6.66M ($6,664,837.30) |

**+134.2%** Year-over-year growth

**+$3,819,209.60** in additional annual billings.

[Bar chart: Full calendar years, USD millions — 2024: Net billings $2.8M; 2025: Net billings $6.7M]

### Calculation

| Metric | 2024 | 2025 |
|---|---:|---:|
| Invoiced, excluding tax and voids | $2,845,627.70* | $6,727,652.59 |
| Credit notes deducted | Included* | −$62,815.29 |
| **Net billings** | **$2,845,627.70** | **$6,664,837.30** |

*The 2024 legacy ledger includes credit entries as negative invoice amounts, so they are already reflected in the net figure.

### Methodology

I queried Corvia's connected PostgreSQL database and applied these rules:

- **2024:** Used `legacy.invoices_2024`, excluding void invoices and internal accounts. Avoided double-counting invoices migrated into the newer system.
- **2025:** Used `billing.invoices` and `billing.credit_notes`, excluding voids, test-mode invoices, internal accounts and identified demo accounts.
- **Currency:** Used the stored USD amounts for 2024 and historical exchange rates from `billing.fx_rates` for 2025, including inverse AUD conversion.
- **Timing:** Used calendar-year document dates, with invoices and credit notes attributed to their issue years. Included issued but unpaid invoices, including written-off/uncollectible invoices, since billings are not collections.

An additional $1,302.43 in credits issued during 2026 against 2025 invoices was not deducted from 2025, because those credits belong to the 2026 billing period.

**Bottom line:** Corvia more than doubled its annual billings in 2025, growing **134.2%**, or approximately **2.34×** its 2024 level.

[Transcribed from the rendered chat.]

### Q6. Overdue receivables

As of **30 September 2026, 23:59 UTC**, Corvia Systems has:

Total more than 30 days overdue, including uncollectible balances

**$242,322.53**

22 unpaid invoices, net of payments and credit notes, including tax.

| Open invoices | Marked uncollectible |
|---|---|
| $142,448.80 (13 invoices) | $99,873.73 (9 invoices) |

### Five customers owing the most

These rankings include both open and uncollectible unpaid invoices.

| Rank | Customer | Overdue (USD) | Status |
|---|---|---:|---|
| 1 | Old Juniper Urgent Care Ltd | $111,288.96 | Open |
| 2 | North Cedar Ridge Pest Control Ltd | $45,412.76 | Uncollectible |
| 3 | Eastgate Smile Studio LLC | $35,294.00 | Uncollectible |
| 4 | Greater Lakeside Home Cleaning LLC | $5,409.19 | Uncollectible |
| 5 | Greater Harborview Medical Group B.V. | $4,829.66 | Uncollectible |
| | Top five combined | $202,234.57 | |

The five customers represent approximately **83.5% of all overdue unpaid balances**.

### Calculation methodology

- **Overdue threshold:** Invoice due date on or before 30 August 2026, representing more than 30 calendar days overdue.
- **Remaining balance:** `MAX(0, invoice total − amount paid − credit note amount − credit note tax)`.
- **Invoice total:** Includes tax.
- **Excluded:** Draft, void, paid and test-mode invoices.
- **Currency conversion:** Used the latest available database exchange rates, dated 29 September 2026, converting all amounts into USD.

**Important accounting distinction:** If you want only outstanding open invoices for an active collections report, the relevant total is **$142,448.80**, not $242,322.53.

Under that narrower definition, the five largest debtors are Old Juniper Urgent Care Ltd ($111,288.96), East Woodvale Smile Studio Ltd ($3,683.36), Valley View Home Cleaning Ltd ($3,375.27), Summit Same-Day Delivery GmbH ($3,313.01), and East Queensbury Vets LLC ($3,038.00).

For operational collections reporting, I recommend using the open-invoice total and showing uncollectible balances separately, so written-off or doubtful debts do not inflate the actionable collections queue.

[Transcribed from the rendered chat.]

### Q7. Sales performance, H1 2026

## New-business sales performance — H1 2026

**Period:** 1 January – 30 June 2026 (inclusive)
**Source:** Corvia Systems PostgreSQL (`crm.opps`, `crm.users`)

| Overall win rate | Closed deals | Won / Lost |
|---|---|---|
| 29.6% | 257 | 76 / 181 |

### Results by sales rep

| Sales rep | Won | Lost | Win rate | Median cycle (days) |
|---|---:|---:|---:|---:|
| Sofia Marin | 6 | 6 | 50.0% | 64 |
| Dana Whitfield | 12 | 21 | 36.4% | 41 |
| Priya Raman | 14 | 30 | 31.8% | 37.5 |
| Tom Okoye | 13 | 31 | 29.5% | 34 |
| Marcus Bell | 12 | 35 | 25.5% | 50 |
| Ana Pereira | 7 | 21 | 25.0% | 51 |
| Liam Carter | 12 | 37 | 24.5% | 47 |

Sorted by win rate, highest first. Median sales cycle includes both won and lost deals.

### Key findings

- **Highest win rate:** Sofia Marin at 50.0%, although her sample is relatively small (12 deals).
- **Most wins:** Priya Raman with 14, followed by Tom Okoye with 13.
- **Shortest median sales cycle:** Tom Okoye at 34 days.
- **Highest closed-deal volume:** Liam Carter with 49 deals, but the lowest win rate at 24.5%.

### Calculation methodology

- **Win rate** = Won deals ÷ (Won deals + Lost deals) × 100.
- **Median sales cycle** = Median of (`close_dt − created_dt`) in calendar days, across won and lost deals.

To ensure accurate results, I:

- Included all new-business type variations (New Business, New Biz, NB, new_business).
- Normalized the different won/lost stage labels.
- Excluded disqualified, open and soft-deleted opportunities.
- Removed 50 duplicate imported opportunities that matched existing CRM records.
- Combined Dana Whitfield's two CRM user IDs into one rep-level result.

**Bottom line:** Sofia Marin leads on win rate, while Tom Okoye has the shortest median sales cycle. Priya Raman delivers the most wins. These comparisons should be interpreted alongside deal volume, particularly for Sofia's smaller sample.

[Transcribed from the rendered chat.]

### Q8. Paying customers missing from the CRM

## Paying customers missing from CRM

As of 30 September 2026, 23:59:59 UTC · USD

| Without an active CRM account | MRR represented |
|---|---|
| **305** Paying customers | **$164,093.96** USD per month |

The breakdown is important:

| CRM status | Paying customers | USD MRR |
|---|---:|---:|
| No CRM account record at all | 263 | $125,208.94 |
| Only deleted CRM account records | 42 | $38,885.02 |
| **Total without an active CRM account** | **305** | **$164,093.96** |

If you mean **strictly no record whatsoever in CRM**, the answer is **263 customers representing $125,208.94 MRR**.

### How I calculated this

- **Paying:** 860 distinct live billing customers with active subscriptions at the reporting cutoff. Excluded trials, paused, canceled and past-due subscriptions.
- **CRM matching:** Matched billing customer references against `crm.accts.billing_cust_ref` and `crm.accts.ext_ids`.
- **MRR:** Monthly-normalized subscription value, including seat quantities, annual billing, Enterprise contract amounts and applicable discounts.
- **Currency conversion:** Converted GBP, EUR and AUD to USD using the latest available FX rates, dated 29 September 2026.

**Recommended action:** Prioritize the 263 customers with no CRM record, then review the 42 whose only matching accounts are deleted or merged. This is both a CRM data-quality issue and a potential customer-management visibility gap.

Source: Corvia Systems PostgreSQL — `billing.customers`, `billing.subscriptions`, `billing.plans`, `billing.coupons`, `billing.fx_rates`, and `crm.accts`.

[Transcribed from the rendered chat.]

### Q9. ARR by industry

**Healthcare brings in the most ARR**, contributing **$3,357,164 (28.15%)** of Corvia Systems’ total ARR as of 30 September 2026.

| Healthcare ARR | Share of total ARR | Total company ARR | Healthcare MRR |
|---|---|---|---|
| $3.36M | 28.15% | $11.92M | $279,764 |

### ARR by industry

[Bar chart: ARR by industry — Healthcare $3.4M; Unclassified $2.2M; Field Services $1.7M; Home Services $1.6M; Dental $1.2M; Logistics $0.7M; Other $0.6M; Veterinary $0.6M]

As of 30 September 2026 · USD millions. Unclassified represents customers without a linked CRM industry.

### Calculation methodology

I calculated ARR as **MRR × 12**, using the subscription state at the end of 30 September 2026 (UTC).

The calculation includes active, live subscriptions; normalizes annual billing to monthly amounts; accounts for applicable discounts and enterprise contract prices; and converts revenue into USD using the latest available FX rates (29 September 2026).

Industry names were standardized, including Medical Practice, Health Care and HC under Healthcare.

**Data-quality caveat:** $2.24M (18.82%) of total ARR is unclassified because those subscriptions lack a linked CRM industry. Healthcare leads among the classified industries, but the missing classifications mean the company-wide industry ranking is not fully certain.

**Bottom line:** Healthcare is Corvia's largest identifiable ARR contributor, representing **28.15% of total company ARR**.

[Transcribed from the rendered chat; chart values from the chart's accessible data labels.]

### Q10. Seat utilization

In September 2026, **57.8% of Corvia Systems’ paid seats were used**, based on distinct real customer users who performed at least one product activity during the month.

SEPTEMBER 2026 · PAID-SEAT UTILIZATION

**57.8%**

16,371 active people ÷ 28,312 paid seats

| Paid seats | Active people | Paying customers |
|---|---|---|
| 28,312 | 16,371 | 860 |

### Utilization by plan

| Plan | Paid seats | Active people | Utilization |
|---|---:|---:|---:|
| Starter | 1,558 | 928 | 59.6% |
| Growth | 5,512 | 3,356 | 60.9% |
| Scale | 7,407 | 4,267 | 57.6% |
| Enterprise | 13,835 | 7,820 | 56.5% |
| **Total** | **28,312** | **16,371** | **57.8%** |

### How I calculated it

I queried Corvia’s PostgreSQL database using `billing.subscriptions`, `billing.customers`, `app.workspaces`, `app.users`, and `app.events`.

- **Paid seats:** September 30, 2026, 23:59:59 UTC subscription quantities, restricted to active, live customer subscriptions.
- **Used seats:** Distinct real customer users with at least one event between September 1, 00:00 UTC and October 1, 00:00 UTC.
- **Excluded:** Trials, canceled or paused subscriptions, sandbox and internal workspaces, bots, API integrations, support administrators, and [email redacted] staff.

### One important distinction

At 29 customer accounts, active people slightly exceeded purchased seats, producing 46 additional active users.

If utilization is capped at each customer's purchased seat quantity, the result is **57.7%** (16,325 of 28,312 seats), rather than 57.8%.

**Bottom line:** Approximately **42% of purchased seat capacity was not used** in September. Enterprise customers accounted for the largest number of unused seats, making that segment a useful starting point for adoption analysis.

The denominator is a September 30 paid-seat snapshot, not a daily average across the month.

[Transcribed from the rendered chat.]

### Q11. Appointments trend

From **June through September 2026, Corvia customers created 534,955 appointments**, with monthly volume increasing steadily and growth accelerating in September.

### Monthly appointments created

[Bar chart: Appointments created by month — Production customer appointments, June–September 2026 (UTC). Jun 127,589; Jul 130,916; Aug 134,061; Sep 142,389]

| Month (2026) | Appointments | MoM growth |
|---|---:|---:|
| June | 127,589 | — |
| July | 130,916 | +2.61% |
| August | 134,061 | +2.40% |
| September | 142,389 | +6.21% |
| **Total** | **534,955** | |

### What the trend shows

| June–September growth | September MoM growth |
|---|---|
| +11.6% (14,800 more appointments per month) | +6.21% (Up from 2.40% in August) |

- **Consistent growth:** Appointment creation increased every month.
- **September acceleration:** Growth jumped to 6.21%, versus approximately 2.5% in July and August.
- **Higher daily usage:** Average daily appointments rose from approximately 4,253 in June to 4,746 in September, so the improvement isn't simply due to month length.

**Interpretation:** Customer scheduling activity is growing, with meaningful acceleration in September. This is a positive product-usage signal, although these figures alone cannot distinguish increased activity among existing customers from growth in the customer base.

### Calculation methodology

I queried the connected PostgreSQL database using `app.events`, joined to `app.workspaces`, and:

- Included both `appointment_created` and `appointment.created` event names to account for the naming change.
- Counted distinct `event_id` values to avoid duplicate event deliveries.
- Excluded sandbox workspaces.
- Grouped by `occurred_at` in UTC, covering 1 June through 30 September 2026 inclusive.

**Bottom line:** Corvia ended September at approximately **142,400 appointments per month**, up 11.6% since June, with September delivering the strongest monthly growth in the period.

[Transcribed from the rendered chat.]

### Q12. Enterprise support responsiveness

For Enterprise support tickets opened in Q3 2026, **the median time to first human reply was 1 hour 41 minutes, and 78.3% received a human reply within 4 hours.**

| Median first human reply | Within 4 hours |
|---|---|
| 1h 41m (100.58 minutes) | 78.3% (701 of 895 tickets) |

### Ticket breakdown

[Stacked bar: 4-hour first-reply target — 895 tickets. Within target: 701 · Late: 137 · No reply: 57]

| Metric | Result |
|---|---:|
| Enterprise tickets opened | 895 |
| Received a human reply | 838 |
| Replied within 4 hours | 701 |
| Replied after 4 hours | 137 |
| No human reply by cutoff | 57 |
| Missed 4-hour target (including unanswered) | 194 |
| 4-hour target miss rate | 21.7% |

### Methodology

- **Period:** July 1–September 30, 2026, inclusive, UTC.
- **Enterprise classification:** Matched ticket requesters to customer workspaces and billing customer records, using the Enterprise customer segment.
- **Human reply:** First public support-agent response after ticket creation. Automated system responses and internal notes were excluded.
- **Median:** Calculated across the 838 tickets with recorded human replies by the September 30 cutoff.
- **4-hour rate:** Calculated across all 895 tickets, counting the 57 tickets without a human reply as failures.

**Bottom line:** Enterprise support met the 4-hour first-human-reply target for roughly 4 out of every 5 tickets. The remaining 21.7% either received a late reply or remained unanswered at the reporting cutoff.

Source: Corvia Systems PostgreSQL — `support.tickets`, `support.ticket_events`, `app.users`, `app.workspaces`, and `billing.customers`.

[Transcribed from the rendered chat.]

### Q13. Customer count

As of **30 September 2026, 23:59 UTC**, Corvia Systems has:

## 867 customers

Current billable customer accounts, including those with overdue payments

| Customer status | Accounts |
|---|---:|
| Active | 860 |
| Past due | 7 |
| **Total current customers** | **867** |
| Trialing | 25 |
| Paused | 5 |
| Canceled | 634 |
| **Total production customer records** | **1,531** |

**How I counted:** I used `billing.customers` and `billing.subscriptions`, identified each customer's latest subscription status as of the cutoff, and excluded test-mode accounts. Each customer is counted once, even if they have multiple subscriptions.

If you want the stricter definition of customers with an *active* subscription and no overdue status, the answer is **860**.

[Transcribed from the rendered chat.]

