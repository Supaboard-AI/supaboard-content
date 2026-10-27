# Claude Sonnet 5.5

**Data Analytics Index: 89.5** (31 of 39 points, accuracy 79.5%)

| Setup | |
|---|---|
| Model | Sonnet 5.5, effort Medium |
| Data access | Neon connector, owner access to the benchmark project only |
| How it was run | All questions in parallel, staggered by claude.ai's limit on concurrent replies |
| Timing source | Server timestamps |

## Scores

| # | Question | Answer given | Score | Time (s) |
|---|---|---|---|---|
| Q1 | MRR today | MRR $993,600 · 863 customers | 3 | 87 |
| Q2 | Net revenue retention | 97.4% | 3 | 157 |
| Q3 | The May cancellation spike | names the consolidation, 16 clinics, 15 May | 3 | 96 |
| Q4 | Recognized revenue, Q3 2026 | $2,568,248 | 3 | 93 |
| Q5 | Billings, 2024 against 2025 | 2024 $2,845,628 · 2025 $6,664,837 | 3 | 125 |
| Q6 | Overdue receivables | $305,557.25 | 3 | 116 |
| Q7 | Sales performance, H1 2026 | 7 of 7 reps exact, 7 within 5% | 3 | 56 |
| Q8 | Paying customers missing from the CRM | 218 customers · $62,454 | 2 | 109 |
| Q9 | ARR by industry | Healthcare · 47.2% | 0 | 131 |
| Q10 | Seat utilization | 57.5% | 3 | 139 |
| Q11 | Appointments trend | Sep 142.4k (with bots) | 2 | 56 |
| Q12 | Enterprise support responsiveness | Median 101 min · 78.3% | 2 | 59 |
| Q13 | Customer count | 897 | 1 | 44 |

## Answers

Full answers as the agent gave them (customer email addresses redacted). Questions are shown by title only.

### Q1. MRR today

**MRR today (30 Sep 2026): about $993,600**, from **863 paying customers**.

That is 856 active and 7 past due, with one subscription per customer. The 7 past-due ones add about $2,700 of the total.

**How I calculated it**
- **Subscription state:** I took each subscription's version that was current at the end of 30 Sep, and counted it if the status was active or past due.
- **Price:** monthly plans are the unit price times seats. Annual plans are the same amount divided by 12. Enterprise subscriptions use their custom annual amount divided by 12, and I assumed that field is a total in minor units rather than per seat.
- **Discounts:** PARTNER15 (15%) and NONPROFIT20 (20%) run forever, so they apply. All active LAUNCH50 (50%, 3 months) coupons started in 2025 or earlier, so they have expired and those subscriptions count at full price. Discounts take about $9,000 off the list-price total of $1,002,659.
- **Currency:** I converted GBP, EUR and AUD to USD at the 29 Sep rates (GBP 1.290235, EUR 1.108737, USD/AUD 1.493174). The rates table has no 30 Sep row.

**What I excluded**
- Trialing, paused and canceled subscriptions.
- 24 non-live test customers ("Test Clinic…").
- 6 Corvia demo and QA accounts. Five are flagged internal in their metadata, but "Corvia Demo – Clinic 1" (customer 51509) is not flagged, so I excluded it by its @corvia.io email and name.

**Data quality issues**
- The subscriptions table contains exact duplicate rows for 12 subscriptions. I counted each subscription once. Summing raw rows would have overstated both figures.
- The billing interval is spelled "month", "year" and "annual" depending on the plan, and I treated "year" and "annual" the same.
- Open-ended subscription versions use either a null end date or 9999-12-31, and I handled both.

If you want the figure at the 30 Sep rate once it is loaded, the FX change would be small: the 28 and 29 Sep rates differ by under 0.3%.

### Q2. Net revenue retention

**Net revenue retention over the last 12 months was about 97.4%.**

| | Customers | MRR (USD) |
|---|---|---|
| Paying on 30 Sep 2025 (the cohort) | 507 | $550,571 |
| Same customers on 30 Sep 2026 | 407 still paying | $536,317 |

The movement within the cohort:
- **Churn:** 100 customers fully cancelled, a loss of $66,779 MRR.
- **Contraction:** downgrades cost $2,509.
- **Expansion:** extra seats and upgrades added $55,034.
- **Net:** $536,317 / $550,571 = 97.4%. Expansion nearly offsets churn, which is why the figure is close to 100%.

**How I calculated it**
- **Paying:** a subscription with status `active` or `past_due` at 23:59 UTC on each date. Trialing, paused and canceled subscriptions don't count.
- **MRR:** monthly plans are price × seats. Annual plans are price × seats ÷ 12. Enterprise uses its custom annual contract amount ÷ 12.
- **Discounts:** MRR is net of active coupons, so a 50% launch discount that expires during the year shows up as expansion.
- **Currency:** EUR, GBP and AUD are converted at the latest rate in the table, 29 Sep 2026, for both dates. There is no 30 Sep rate. The AUD rate is stored as USD→AUD, so I inverted it.
- **Exclusions:** I left out 24 test-mode customers and 6 internal "Corvia Demo" accounts.
- **Data fixes:** I removed exact duplicate subscription rows. I also treated a NULL `valid_to` as "still current". About 1,100 rows use NULL that way, and my first pass dropped them, which produced a false NRR of about 35%.

**Sensitivity:** the answer holds under other reasonable definitions. Counting active only gives 97.2%, and using list prices with no coupons gives 97.35%.

I also checked whether any of the 100 churned customers reappeared under a new customer ID, matching on name, email and legacy ID. None did, so the churn isn't an artifact of account migrations.

### Q3. The May cancellation spike

**The May jump is almost entirely one customer, Meridian Health, consolidating its accounts. It isn't a real loss of revenue.**

**What the data shows**
- May 2026 has 46 cancellations on live (non-test) customers, against about 27 a month in January–April.
- 16 of those 46 were cancelled at exactly 00:00 UTC on 15 May. They are the only subscriptions in the database with cancel reason code 4, which has no entry in `ref.cancel_reasons`. That is why they show as "unlabeled" in any reason breakdown.
- All 16 are locations of Meridian Health: US clinics, each set up as its own billing customer. Together they had 270 seats on the monthly Growth plan, worth $8,220 MRR (about $98.6k a year).
- Without them, May had 30 cancellations, which is in line with the run rate.

**Why it's a migration, not churn**
- On 2 May, Meridian Health Group LLC was created as a new billing customer, and CRM lists it as an active customer.
- At 00:00 UTC on 15 May, the group took out one annual enterprise subscription of 310 seats at $123,690 a year. The invoice was paid in full on 15 May.
- The invoice also includes a one-off $2,000 onboarding fee, so $125,690 was billed in total.
- Compared with the 16 old subscriptions, that is +40 seats and about +$25k in annual recurring revenue (+25%). MRR equivalent goes from $8,220 to about $10,310.
- Support tickets from the group's domain continue through September, so the customer is still active.

**Data issues to fix**
- Reason code 4 needs a label such as "Account consolidation / migrated to group contract". Any churn dashboard will show a spike in May until it is fixed.
- The 16 child accounts are marked "Former Customer" in CRM, so CRM-based churn reports will also overstate May.
- Two further May cancellations were on test (non-live) customers, and I excluded them. I counted each subscription once, because some have duplicate canceled rows.

**The underlying trend**
- Most cancellations, 14 of the 30 in May, are "Trial not converted", and that is true every month.
- Cancellations from paying customers, with trials and Meridian excluded, were 16 in May. That is a bit above the January–April average of about 10, but it is within normal month-to-month variation (July was 19).
- I wouldn't call May a churn problem. If you want, I can look at paid-only churn and net revenue retention by month to check whether anything is drifting underneath.

### Q4. Recognized revenue, Q3 2026

**Revenue recognized in Q3 2026: about $2,568,248 USD.**

| Component | USD |
|---|---|
| Subscription charges (spread over their service periods) | 2,708,710 |
| Proration charges (spread over their periods) | 24,349 |
| Discounts (spread over their periods) | −25,931 |
| One-off setup fees (counted on invoice date) | 23,029 |
| **Gross recognized** | **2,730,156** |
| Credit notes issued in Q3 | −161,908 |
| **Net recognized** | **2,568,248** |

**How I calculated it**
- **Subscription, proration and discount lines:** each line is spread evenly by day over its own service period, and I counted only the days that fall in 1 Jul to 30 Sep. This includes the part of earlier annual or monthly invoices that runs into Q3. I treated each period's end date as exclusive, which matches the 28 to 31 day monthly and 365-day annual periods.
- **Setup fees:** the 2,000.00 flat fee, counted in full when the invoice date falls in Q3.
- **Exclusions:** void and draft invoices, and test or internal accounts.
  - The test accounts are customers or invoices flagged as not live (24 "Test Clinic" accounts).
  - The internal accounts are the "Corvia Demo" customers with [email redacted] emails (6 accounts).
- **Credit notes:** I subtracted the net amount (excluding tax) on the day issued, including credits against invoices from before Q3.
- **Currency conversion:** each invoice or credit note is converted at the rate on its own date. GBP and EUR use the GBP/USD and EUR/USD rates directly. For AUD I divided by the USD/AUD rate, which is AUD per USD.

**Judgment calls to confirm**
- **Open and uncollectible invoices:** I included them, since you only asked to exclude tax, void and draft invoices. Collectibility isn't part of your recognition rule. If you want uncollectible invoices out, say so and I'll rerun it.
- **Missing exchange rates:** the rates table has no rows for weekends, a few other days, or 30 Sep. For those dates I used the most recent earlier rate.
- **Invoice dates:** I used UTC dates throughout.
- **Replaced invoices:** the void invoices were replaced by separate invoices, so excluding the voids avoids double counting.

### Q5. Billings, 2024 against 2025

**Billings were about $2.85M in 2024 and $6.66M in 2025, up roughly 134%.**

| | 2024 | 2025 |
|---|---|---|
| Gross invoiced, ex-tax, ex-void | $2,848,120 | $6,727,653 |
| Credit notes | –$2,492 | –$62,815 |
| **Net billings (USD)** | **$2,845,628** | **$6,664,837** |

Growth is $3,819,210, or **+134.2%** (about 2.34x).

**How I built it**
- **2024 comes from `legacy.invoices_2024`.** It holds 1,415 invoices, already in USD, with credits entered as negative rows. `billing.invoices` has no 2024 invoices except 29 migrated copies of legacy ones, so I skipped those to avoid double counting.
- **2025 comes from `billing.invoices`.** I used `subtotal`, which excludes tax, and counted open and uncollectible invoices because they were still invoiced. I excluded void invoices and the 25 drafts, which have no issue date. I took year boundaries in UTC.
- **Currency conversion.** I converted EUR, GBP and AUD to USD using the latest rate in `billing.fx_rates` on or before the invoice date. The table has gaps, so that is not always the same day. AUD is stored as USD→AUD, so I divided by that rate.
- **Credit notes.** The `billing.credit_notes` amounts exclude tax and none touch void invoices. I counted them in the year they were issued, converted at the credit note date.
- **Test and internal accounts.** I excluded 30 billing customers: non-live, flagged internal, or named "Corvia Demo" or "Test Clinic". I also excluded the 14 legacy customers marked `internal`. One demo customer (51509, "Corvia Demo - Clinic 1") carries no flag at all. I caught it by name and email pattern.

**Judgment calls**
- If credit notes are netted against the year of the invoice they relate to instead, 2025 becomes $6,663,535. Growth is still +134.2%.
- Legacy "written off" invoices ($1,250 across 6) are included, since they were invoiced.
- Legacy statuses for the 29 migrated invoices are stale (all "OPEN"). That doesn't affect the totals, because none of them are void.

### Q6. Overdue receivables

**$305,557.25 is overdue by more than 30 days as of 30 September 2026.** That is 83 open invoices.

The five customers who owe the most:

| # | Customer | Country | Overdue (USD) |
|---|---|---|---|
| 1 | South Tidewater Freight B.V. | NL | $135,649.00 |
| 2 | Old Juniper Urgent Care Ltd | GB | $111,288.96 |
| 3 | East Woodvale Smile Studio Ltd | GB | $3,683.36 |
| 4 | Valley View Home Cleaning Ltd | IE | $3,375.27 |
| 5 | Summit Same-Day Delivery GmbH | DE | $3,313.01 |

The first two together are about 81% of the total, and each is a single annual invoice from 2025:
- **South Tidewater Freight:** €122,345.52, issued 24 May 2025 and never paid.
- **Old Juniper Urgent Care:** £86,254.80, due 10 June 2025 and never paid.

Both customers were billed again for the following year, and those renewal invoices are marked paid. It is worth checking whether the 2025 invoices were really left unpaid or just never closed out. If they were closed in error, the total drops to roughly $58,600.

**How I calculated it**
- **Amount owed:** invoice total (including tax) minus the amount paid minus credit notes (credit amount plus its tax). There is no separate payments table, so I used the `amount_paid` column on each invoice.
- **Invoices counted:** status "open" only. I left out drafts, voided invoices, and test-mode customers and invoices.
- **Uncollectible invoices:** I excluded these because they look written off. If you want them counted, say so and I'll add them.
- **Overdue test:** more than 30 days past the due date. About 60% of open invoices have no due date (due-on-receipt and card terms), so I treated their issue date as the due date.
- **Currency:** balances were converted to USD at the latest rate on or before 30 Sep. That is the 29 Sep rate, since there is no 30 Sep rate. The rate table has no AUD-to-USD pair, so I inverted the USD-to-AUD rate.
- **Over-credited invoices:** two open invoices have credits plus payments above their total, which would mean a refund is owed. I counted each as zero owed rather than netting the excess against other invoices. The effect on the total is negligible.

### Q7. Sales performance, H1 2026

Here are the win rates and median sales cycles for new-business deals closed 1 January to 30 June 2026, counting only won and lost deals (257 in total).

| Rep | Won | Lost | Win rate | Median cycle, all deals (days) | Median cycle, won deals only (days) |
|---|---|---|---|---|---|
| Sofia Marin | 6 | 6 | 50.0% | 64 | 42 |
| Dana Whitfield | 12 | 21 | 36.4% | 41 | 53 |
| Priya Raman | 14 | 30 | 31.8% | 37.5 | 26.5 |
| Tom Okoye | 13 | 31 | 29.5% | 34 | 36 |
| Marcus Bell | 12 | 35 | 25.5% | 50 | 54 |
| Ana Pereira | 7 | 21 | 25.0% | 51 | 57 |
| Liam Carter | 12 | 37 | 24.5% | 47 | 46.5 |

Win rate is won ÷ (won + lost). Sales cycle is close date minus created date. I didn't say which cycle you meant, so I've shown it two ways: across all won and lost deals, and for won deals only.

**How I cleaned the data:**
- **Stage labels:** The CRM uses many spellings. I grouped "Closed Won", "06 - Closed Won", "Won" and "closed_won" as won, and the equivalent lost variants as lost. I dropped the three disqualified labels ("Disqualified", "DQ" and "00 - Disqualified"), along with any deals still open.
- **Deal type:** I counted "New Business", "NB", "New Biz" and "new_business" as new business, and excluded expansion and upsell deals.
- **Deleted deals:** I excluded the rows flagged as deleted.
- **Duplicate import:** 50 rows from `import_2026q1` are exact copies of existing deals (each points back to the original through `legacy_opp_id`). I excluded them, since counting them would have double-counted those deals.
- **Dana Whitfield:** She has two user records (U03, inactive, and U09, active) with different email addresses. I treated them as one person and combined her deals.

**Caveats:**
- **Sofia Marin** has only 12 decided deals, so her 50% win rate could easily shift.
- **Currency:** The question didn't involve deal values, so no currency conversion was needed.
- **Meridian Health Group:** One won deal (Meridian Health Group) is a consolidation of 16 clinic subscriptions into one group contract. I counted it as a single win.

### Q8. Paying customers missing from the CRM

**218 paying customers have no CRM account, representing about $62,454 in MRR** (as of 30 September 2026, in USD).

**How I defined it**
- **Paying customer:** a live-mode billing customer whose subscription was in `active` or `past_due` status at the end of 30 September. I excluded trialing, paused and canceled subscriptions, and the 24 test-mode customers (17 of them would otherwise have counted).
- **CRM account:** a customer counts as having one if any CRM account carries its Stripe reference, either in `billing_cust_ref` or in `ext_ids.stripe`. Matching ignores case and whitespace, which matters because 92 CRM references differ from billing only that way. It also counts accounts that were merged away as duplicates, since their surviving account is in the CRM.
- **MRR:** monthly plans use price × seats. Annual plans use price × seats ÷ 12. Enterprise plans use `custom_annual_amount` ÷ 12. Coupons are applied while still valid (for example, LAUNCH50 only for its first 3 months). GBP, EUR and AUD are converted at the 29 September rates, the latest available.
- **Duplicate rows:** I used each subscription's version valid at the cutoff. A few have duplicate canceled rows, which I deduplicated.

**Result**

| Group | Customers | MRR (USD) |
|---|---|---|
| Active subscription, no CRM account | 216 | $61,933 |
| Only past-due subscriptions, no CRM account | 2 | $521 |
| **Total** | **218** | **$62,454** |

If you only count `active` subscriptions as paying, the figures are 216 customers and $61,933.

As a sanity check, none of the 218 matches a CRM account by company name, even after stripping suffixes like LLC and Pty Ltd, so they don't look like unlinked duplicates of existing accounts. They are also small accounts: about $286 MRR each on average, against about $1,450 for paying customers that are in the CRM. Their total is roughly 6% of the MRR of all paying customers.

### Q9. ARR by industry

**Healthcare brings in the most ARR: about $1.48M, or roughly 47% of total ARR** (as of 30 September 2026, in USD). The next largest, Field Services, is about $434K (14%).

| Industry | ARR (USD) | Share |
|---|---|---|
| **Healthcare** | **$1,475,843** | **47.2%** |
| Field Services | $434,420 | 13.9% |
| Dental | $327,379 | 10.5% |
| Home Services | $283,467 | 9.1% |
| Logistics | $281,568 | 9.0% |
| Veterinary | $243,370 | 7.8% |
| Other | $83,268 | 2.7% |
| **Total** | **≈ $3.13M** | 100% |

**How I calculated it**
- **Subscriptions:** I took each subscription's latest version as of the end of 30 Sep 2026. The history table had exact duplicate rows for some subscriptions, which I removed.
- **Which subscriptions count:** Only `active` ones. Trialing, paused and canceled are excluded.
- **MRR per subscription:** Seats × the plan price, with annual plans divided by 12. Enterprise contracts use their custom annual amount instead. Percentage coupons apply while they are in force (LAUNCH50 only for its 3 months).
- **Currency:** GBP, EUR and AUD were converted at the 29 Sep rates. That is the latest available, since rates are only recorded on weekdays.
- **Test accounts:** Non-live (test) customers are excluded.
- **Industry labels:** The CRM industry field is messy, with variants like "HC", "Medical Practice" and "Vet clinic". The reference mapping table doesn't cover those, so I extended it. I also followed merged duplicate accounts to the surviving account.

**Judgment calls to be aware of**
- **Customers with no CRM link:** About 60 live active customers (around $0.4M of ARR) have no matching CRM account. I assigned their industry from the business type in their name, such as "Urgent Care", "Smile Studio" or "HVAC". That is an inference, not recorded data.
- **Healthcare's lead holds either way:** Even if every unlinked customer went to the second-place industry, Healthcare would still be well ahead. Without the inferred ones, its share would be somewhat different but still the largest.
- **Past-due subscriptions:** Including `past_due` as well changes little. Healthcare would be $1.48M at 46.8%.

### Q10. Seat utilization

**About 57.5% of paid seats were used in September 2026.** That is 16,278 real people active, against 28,312 seats paid for, across 860 paying customers.

**How I defined it**
- **Paying customers:** live (non-test) billing customers whose subscription was `active` on 30 Sep 2026. I excluded trialing, paused, past_due and canceled subscriptions, and counted each subscription once, since the table keeps version history and some rows are duplicated.
- **Seats paid for:** the `quantity` on each of those subscriptions.
- **Seat used:** a distinct user with at least one event in the app with a UTC timestamp in September 2026. Any event counts, including a login.
- **Exclusions from "real person":**
  - Bots and integrations: `is_bot = true`, the `api` role, and the 108 "API Sync" users whose `is_bot` flag is blank.
  - Corvia staff: [email redacted] emails and the `support_admin` role.
  - Sandbox workspaces: 159 of the paying customers also have one, and I left their activity out.
- **Linking billing to the app:** workspaces point to the billing customer in one of two metadata formats, and I handled both. About half of the workspaces use the second format, and reading only the first would have dropped them.

**Caveats**
- 21 customers had more active people than paid seats, 35 seats in total. Capping each customer at the seats they pay for gives 16,243 used, or 57.4%, so the answer barely moves.
- 30 of the 860 paying customers had no real-person activity at all in September.
- I counted seats as of the end of September. A customer that canceled partway through the month is out of both the numerator and the denominator.
- Counting past_due customers as paying would add only 71 seats.

### Q11. Appointments trend

**Customer-created appointments rose every month from June to September 2026, and the increase sped up in September.**

| Month | Appointments | Change vs prior month | Per day |
|---|---|---|---|
| Jun 2026 | 81,260 | n/a | 2,709 |
| Jul 2026 | 83,221 | +2.4% | 2,685 |
| Aug 2026 | 85,951 | +3.3% | 2,773 |
| Sep 2026 | 90,801 | +5.6% | 3,027 |

- **Overall:** volume is up 11.7% from June to September.
- **Daily rate:** the monthly totals are flattered by month length (September has 30 days, August has 31). Per day, July was flat to slightly down (-0.9%), August rose 3.3% and September rose 9.2%. So growth is real and picking up, and the September jump is the biggest.

**How I counted**
- **Event rename:** the app logged `appointment_created` through 31 July and `appointment.created` from 1 August. I combined both; counting only one name would have shown a false collapse or surge at the month boundary.
- **Duplicates:** about 3% of events share an `event_id` (probably retries). I kept one row per `event_id`.
- **Customers only:** I excluded sandbox workspaces and Corvia's own support staff, which is only a few hundred rows a month. I counted both people at customer workspaces (about 75% of the total) and customer-side integrations such as Zapier and API syncs, which have a null `is_bot` flag.
- **Corvia Integration bots:** I left out the [email redacted] accounts, because I couldn't tell whether they create appointments on customers' behalf or are platform automation. They add 46k–51k a month. If you count them, totals are 127.6k, 130.9k, 134.1k and 142.4k, a rise of 11.6% from June to September, so the trend is the same.
- **Time zone:** months are cut at UTC.

Tell me if the Corvia Integration bots should count as customer activity and I'll switch the headline figures.

### Q12. Enterprise support responsiveness

Enterprise tickets opened in Q3 2026 had a median first human reply time of about 1.7 hours (1 h 41 min). 78.3% of them got a reply within 4 hours.

| | Tickets |
|---|---|
| Enterprise tickets opened 1 Jul – 30 Sep 2026 | 911 |
| Got a human reply | 855 |
| Replied within 4 hours | 713 |
| No reply yet (counted as missing the target) | 56 |

The 78.3% is 713 of all 911 tickets. The median covers only the 855 tickets that have a reply, since tickets without one have no reply time. The 56 unreplied tickets are all still open.

How I defined things:
- **Enterprise customer:** a customer with an Enterprise-tier subscription in billing. That gives 62 customers, matching the Enterprise segment tag exactly, and none of them ever changed tier.
- **Linking tickets to customers:** support tickets carry only a requester email, so I matched on the email domain, ignoring case and stray spaces. Every ticket matched exactly one customer.
- **Q3:** ticket creation time in UTC, 1 July to 30 September 2026.
- **First human reply:** the first public message from a support agent, measured from when the ticket was created. I ignored the automatic "we've received your request" message and internal notes.
- **Merged tickets:** I excluded 34 tickets that were merged into another ticket, since they are duplicates. Including them barely changes the result: median 1.69 h, 78.3% within 4 hours across 945 tickets.

Time is measured in elapsed hours, not business hours, so tickets opened overnight or at weekends count against the 4-hour target.

### Q13. Customer count

**We have 897 current customers** as of 30 September 2026. That means live accounts with at least one subscription that isn't canceled.

Of those, 872 are paying (active, past due or paused) and 25 are still on a trial. If you only count paying customers, the number is 872.

How I got there:
- **Source:** `billing.customers` has 1,555 rows in total, with no duplicate IDs or emails. I excluded 24 test accounts (`livemode = false`), which leaves 1,531 live customers ever created.
- **Current status:** `billing.subscriptions` keeps a row per version of each subscription (`valid_from` / `valid_to`), so I only looked at rows in effect at the end of 30 September. That's why the raw status counts (about 4,900 rows) are much higher than the customer count.
- **Churned:** The other 634 live customers have only canceled subscriptions and count as former customers.
- **Overlapping rows:** About 90 customers have more than one subscription row in effect at the same time. I counted each customer once, and counted them as current if any of their rows isn't canceled.

I didn't use `crm.accts` (2,303 rows), `app.workspaces` (1,715) or `legacy.customers_v1` (436). Those look like prospects, product workspaces and an older system rather than billed customers. Tell me if you want one of them used as the definition instead.

