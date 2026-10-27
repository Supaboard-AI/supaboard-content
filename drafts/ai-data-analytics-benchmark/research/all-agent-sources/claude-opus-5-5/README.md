# Claude Opus 5.5

**Data Analytics Index: 99.7** (35 of 39 points, accuracy 89.7%)

| Setup | |
|---|---|
| Model | Opus 5.5, effort Medium |
| Data access | Neon connector, owner access to the benchmark project only |
| How it was run | All questions in parallel, staggered by claude.ai's limit on concurrent replies |
| Timing source | Server timestamps |

## Scores

| # | Question | Answer given | Score | Time (s) |
|---|---|---|---|---|
| Q1 | MRR today | MRR $993,647 · 863 customers | 3 | 99 |
| Q2 | Net revenue retention | 97.4% | 3 | 130 |
| Q3 | The May cancellation spike | names the consolidation, 16 clinics, 15 May | 3 | 105 |
| Q4 | Recognized revenue, Q3 2026 | $2,568,267 | 3 | 144 |
| Q5 | Billings, 2024 against 2025 | 2024 $2,845,628 · 2025 $6,664,837 | 3 | 194 |
| Q6 | Overdue receivables | $305,557.25 | 3 | 140 |
| Q7 | Sales performance, H1 2026 | 6 reps exact; Marcus 25.5% as alternative | 3 | 107 |
| Q8 | Paying customers missing from the CRM | 214 customers · $59,658 | 3 | 162 |
| Q9 | ARR by industry | Healthcare · 31.0% | 3 | 128 |
| Q10 | Seat utilization | 57.4% | 2 | 199 |
| Q11 | Appointments trend | Sep 139,943 | 3 | 360 |
| Q12 | Enterprise support responsiveness | Median 106 min · 78.7% | 1 | 108 |
| Q13 | Customer count | 864 | 2 | 67 |

## Answers

Full answers as the agent gave them (customer email addresses redacted). Questions are shown by title only.

### Q1. MRR today

As of 30 September 2026, **MRR is $993,647** and you have **863 paying customers**.

| Currency | Customers | MRR (local) | MRR (USD) |
|---|---|---|---|
| USD | 477 | $503,527 | $503,527 |
| GBP | 130 | £146,201 | $188,634 |
| AUD | 145 | A$226,277 | $151,541 |
| EUR | 111 | €135,240 | $149,945 |
| **Total** | **863** | | **$993,647** |

Each customer has exactly one live subscription, so the count is the same whether you count subscriptions or customers.

**Exchange rate.** There is no rate in the table for 30 September. The latest is 29 September, so I used that: EUR 1.1087, GBP 1.2902 and USD/AUD 1.4932. The AUD rate is stored the other way round (USD to AUD), so I inverted it. If a 30 September rate arrives, the total will shift slightly.

**How I built the snapshot:**
- **Subscription history:** I took each subscription's state as of the end of 30 September from its history records. Some closing records are stored twice (exact copies), so I kept one per subscription to avoid double-counting 22 of them.
- **Annual contracts:** These appear under two labels, `year` and `annual`, depending on the plan generation. I treated both as annual and divided by 12.
- **Enterprise:** These plans have a list price of 0. I used each contract's negotiated annual amount ÷ 12. Recent invoices match this.
- **Discounts:** NONPROFIT20 and PARTNER15 are permanent, so I applied them. Every LAUNCH50 coupon on a current subscription is past its 3-month window, so none of those count.
- **Status:** I counted active and past-due only. Just 7 subscriptions are past due, all monthly Starter or Scale plans.

**Test and internal accounts.** I excluded 21 subscriptions that would otherwise have counted. The flags in the data are inconsistent, so I excluded an account if any of these was true:
- it is marked as a test account (24 test-mode customers);
- it carries the `internal` flag (5);
- it uses a @corvia.io email.

The email rule matters because one account, "Corvia Demo – Clinic 1", has a QA corvia.io email but no internal flag. Without that rule it would have been counted as a customer. You may want to fix the flag in billing.

### Q2. Net revenue retention

**Net revenue retention for the 12 months to 30 September 2026 was 97.4%.**

The 507 customers who were paying on 30 September 2025 had $550,571 of MRR then. The same customers have $536,317 today, a net loss of $14,254. Both figures use the latest exchange rates.

| Movement | Customers | MRR (USD) |
|---|---|---|
| Starting MRR, 30 Sep 2025 | 507 | 550,571 |
| + Expansion | | +55,034 |
| − Contraction | | −2,509 |
| − Churn | 100 | −66,779 |
| **MRR today, 30 Sep 2026** | | **536,317** |

Churn is what pulls NRR below 100%. About a fifth of the cohort left, taking 12% of starting MRR with them. Expansion, which includes the Growth price increase from July 2025 reaching renewals, made up most of that loss but not all of it.

**How I worked it out:**
- **Point in time:** I took each subscription as it stood at the end of each day (UTC), using its validity history.
- **Duplicates:** the subscription history has some exact duplicate rows, about 14 at the 2025 date and 22 at the 2026 date. I kept one copy of each so they weren't counted twice.
- **What counts as paying:** subscriptions marked active or past due. Trialing, paused and canceled ones count as zero, so a cohort customer who is paused today shows up as churned.
- **Converting to monthly:** monthly plans are price × seats. Annual plans are price × seats ÷ 12. Enterprise contracts are the custom annual amount ÷ 12.
- **Discounts:** I subtracted coupons. The permanent ones (NONPROFIT20 and PARTNER15) always apply. LAUNCH50 only applies during its three-month window, which matches what the invoices show.
- **Excluded accounts:** test-mode customers, and the six "Corvia Demo" accounts on @corvia.io addresses (five of them are tagged internal).
- **Exchange rates:** the latest rates in the table are from 29 September 2026, since there is no row for the 30th. That gives £1 = $1.2902, €1 = $1.1087 and A$1 = $0.6697. I applied them to both dates.
- **Grouping:** NRR is calculated per billing customer. A customer who cancelled one subscription and started another counts as retained.

### Q3. The May cancellation spike

The May jump wasn't real churn. It was a contract consolidation: Meridian Health moved 16 separate clinic subscriptions onto one enterprise contract on the same day, and the billing system recorded the 16 old subscriptions as cancellations.

**What happened**

On 15 May 2026, all 16 "Meridian Health – [X] Clinic LLC" subscriptions were cancelled at the same timestamp. They all carry cancel reason code 4, which doesn't exist in `ref.cancel_reasons` and appears in no other month. That same day, a new customer, Meridian Health Group LLC (created 2 May), started an ENT_ANNUAL_USD subscription. The CRM has a matching Closed Won opportunity dated 15 May whose note reads "Consolidating 16 Meridian clinic subscriptions into one group contract."

The money went up, not down:

| | Before (16 clinic subs) | After (group contract) |
|---|---|---|
| Seats | 270 | 310 |
| Plan | Monthly Growth ($29 legacy / $35 v2) | Annual Enterprise |
| Recurring revenue | $8,220 MRR (~$98.6k/yr) | $123,690/yr (~$10,308 MRR) |

That's about **+$2,090 MRR of expansion**, plus a $2,000 onboarding fee. The group invoice for $125,690 was paid on 15 May. The clinics' last invoices were on 15 April, so there's no double billing or gap.

**May without Meridian looks normal**

| Month (2026) | All cancellations | Trial non-conversions | Paid cancellations (live) | Paid MRR lost |
|---|---|---|---|---|
| Jan | 29 | 16 | 13 | $9.2k |
| Feb | 26 | 15 | 11 | $11.9k |
| Mar | 19 | 13 | 6 | $2.4k |
| Apr | 34 | 23 | 11 | $28.8k |
| **May** | **48** | 14 | **32** | **$18.9k** |
| May excl. Meridian | 32 | 14 | 16 | $10.6k |
| Jun | 34 | 20 | 14 | $29.8k |
| Jul | 32 | 13 | 19 | $18.3k |
| Aug | 27 | 21 | 6 | $0.8k |
| Sep | 40 | 18 | 21 | $45.8k |

Without Meridian, May had 16 paid cancellations and $10.6k of lost MRR, which is within the normal range. The remaining reasons ("Too expensive", "Other", etc.) look like any other month.

**Things to fix**

- **Churn reporting.** Code 4 needs a label in `ref.cancel_reasons`, something like "Migrated/consolidated". Churn reports should then exclude it, or net it against the replacement subscription, so customer moves don't count as lost customers.
- **Duplicate rows.** `billing.subscriptions` has duplicate cancelled rows, and `valid_to` uses both NULL and 9999-12-31 for "current". I counted distinct subscriptions using the first cancelled row; a naive row count would overstate cancellations.
- **September.** If you're watching churn, September is the month that deserves a look. It had $45.8k of paid MRR cancelled, the highest in the year, with 9 cancellations marked "Business closed."

On method: MRR uses each subscription's plan price before cancellation, ignores coupons, and converts EUR, GBP and AUD to dollars at the rate on the cancellation date. Two May cancellations were on test-mode customers and are excluded from the paid figures.

### Q4. Recognized revenue, Q3 2026

Corvia recognized about **$2,568,267** in revenue in Q3 2026 (1 July – 30 September), net of credit notes.

| Component | USD |
|---|---|
| Subscription charges (spread) | 2,708,710 |
| Proration charges (spread) | 24,349 |
| Discounts (spread) | −25,931 |
| Setup fees (on invoice date) | 23,029 |
| Credit notes (on issue date) | −161,889 |
| **Total** | **2,568,267** |

By invoice currency, before credit notes: USD $1.40M, GBP $0.47M, EUR $0.42M and AUD $0.44M.

**One credit note distorts the quarter.** On 19 September a €116,466 (~$127k) "duplicate" credit note was issued against customer 50278's annual renewal invoice from 14 September, which covers September 2026 to September 2027. That customer has only one renewal invoice in the data, so it isn't clear what it duplicates. Under your rule the full credit lands in Q3, although only about 17 days of that invoice fall in the quarter. Without it, Q3 would be roughly $2.70M. Someone in billing should confirm whether that credit is correct.

**How I handled the data:**
- **Units:** the `invoice_lines.amount` column is labelled as cents, but it's actually in whole currency units. It matches every invoice subtotal exactly once multiplied by 100, so I treated it that way.
- **Spreading:** subscription, proration and discount lines are spread daily over their service period, treating the period end date as exclusive.
- **Currency conversion:**
  - The rate table only has weekdays and stops at 29 September, so I used the latest rate on or before each invoice or credit-note date.
  - Each invoice is converted at its issue-date rate, even for the part recognized later in the quarter.
  - AUD rates are stored as AUD per USD, so AUD amounts were divided rather than multiplied.
- **Test and internal accounts excluded:**
  - Test-mode customers.
  - Customers flagged internal.
  - Customer 51509, "Corvia Demo – Clinic 1", which has a [email redacted] email but is missing the internal flag.
  - Credit notes against any of these accounts.
- **Included:** open and uncollectible invoices count as recognized revenue, with bad debt treated as a separate expense. Exclude uncollectible invoices if you'd rather.
- **Tax:** excluded throughout. Credit-note amounts are already net of tax.

### Q5. Billings, 2024 against 2025

Billings were **$2,845,628 in 2024** and **$6,664,837 in 2025**. That is an increase of **$3,819,210, or about 134%** (2025 was roughly 2.34× 2024).

| | 2024 | 2025 |
|---|---|---|
| Invoiced (ex-tax, non-void) | $2,848,120 | $6,727,653 |
| Credit notes | −$2,492 | −$62,815 |
| **Net billings** | **$2,845,628** | **$6,664,837** |

The monthly figures run continuously across the system cutover: December 2024 was about $304k and January 2025 about $327k. So the jump comes from steady growth during 2025 (customers billed per month went from about 210 to 410), not from a data gap or a change in how invoices were recorded.

**How I calculated it**

- **2024 comes from a different table.** 2024 invoices live in `legacy.invoices_2024`, which stores amounts already in USD and excluding tax. The new `billing.invoices` table also holds 29 copies of 2024 legacy invoices, marked with `migrated_from`. I left those copies out so nothing is counted twice. Converting them with the FX table gives exactly the legacy USD amounts, which confirms the two sources agree.
- **Void invoices** are excluded. This includes the legacy "VOID"/"Void" statuses and the new system's `void` status. Every voided invoice in the new system has a paid replacement, and the replacement is counted. Draft invoices are excluded too.
- **Credit notes** are subtracted, excluding tax. In 2024 they are the negative "CR-" rows in the legacy table. In 2025 they come from `billing.credit_notes`, whose amounts I confirmed are before tax. Each credit counts in the year it was issued.
- **Test and internal accounts** are excluded:
  - In the legacy data, the 14 accounts with `acct_type = 'internal'` ("Test Clinic" and "Corvia Demo" accounts).
  - In the new system, test-mode customers and invoices (`livemode = false`), and the six "Corvia Demo" accounts. Five of these are flagged internal. The sixth, "Corvia Demo – Clinic 1", isn't flagged but has a corvia.io QA email address, so I treated it as internal too.
- **Currency conversion:** GBP, EUR and AUD invoices are converted at the most recent rate on or before the issue date. This is the same method the legacy data used.

**Choices that affect the numbers**

- Invoices later written off as uncollectible are included, because they were invoiced. They add about $259k to 2025 and about $4k to 2024 (the legacy "WRITTEN OFF" status). Leaving them out would reduce growth slightly.
- Five credit notes issued in 2026 relate to 2025 invoices. They don't affect these figures, but they would lower 2025 if you count credits by the date of the original invoice.

### Q6. Overdue receivables

**$305,557.25 is overdue by more than 30 days**, across 83 open invoices. Two customers make up about 81% of it.

| # | Customer | Country / currency | Overdue (USD) | Detail |
|---|---|---|---|---|
| 1 | South Tidewater Freight B.V. | EUR | **$135,649.00** | One annual invoice (CORV-2025-001324), €122,345.52, 494 days overdue |
| 2 | Old Juniper Urgent Care Ltd | GBP | **$111,288.96** | One annual invoice (CORV-2025-001035), £86,254.80, 477 days overdue |
| 3 | East Woodvale Smile Studio Ltd | GBP | **$3,683.36** | £2,854.80, 252 days overdue |
| 4 | Valley View Home Cleaning Ltd | EUR | **$3,375.27** | €3,044.25, 260 days overdue |
| 5 | Summit Same-Day Delivery GmbH | EUR | **$3,313.01** | €2,988.09 after a credit note, 156 days overdue |

The top two are both unpaid enterprise annual invoices from spring 2025. Both customers have paid their 2026 renewals in full, so the old invoices may have been missed rather than disputed. They're worth checking with collections first.

**How I calculated it**

- **Amount owed:** invoice total including tax, minus amount paid, minus credit notes (credit amount plus credit tax). If credits and payments add up to more than the invoice, I counted it as zero.
- **Which invoices:** only invoices with status "open".
  - I left out drafts and voided invoices.
  - I left out test-mode customers, such as the "Test Clinic" accounts with about $2.1k open.
  - Internal "Corvia Demo" accounts had nothing open.
- **Due date:** the invoice's due date. About 60% of open invoices have no due date. All of those belong to customers on due-on-receipt or card terms, so I used the issue date.
- **More than 30 days:** more than 30 calendar days before 30 Sep 2026, so due on or before 30 Aug. One invoice due 31 Aug (West Stonebridge Fire & Safety, $308.91) is exactly 30 days overdue, so it's just outside.
- **Currency:** converted to USD at the latest rate in the database, from 29 Sep 2026. The rates were EUR 1.1087, GBP 1.2902, and 1.4932 AUD per USD.

**Not included:** invoices already marked uncollectible (written off). Another **$343,561.44** across 84 such invoices is also more than 30 days past due. If you count those as still owed, the total would be about **$649k**.

### Q7. Sales performance, H1 2026

Across the 256 new-business deals won or lost between 1 January and 30 June 2026, the overall win rate was **29.3%** (75 won, 181 lost). The median sales cycle was **45.5 days**, measured from the date the opportunity was created to its close date.

| Rep | Won | Lost | Win rate | Median cycle, all closed (days) | Median cycle, won only (days) |
|---|---|---|---|---|---|
| Sofia Marin | 6 | 6 | 50.0% | 64 | 42 |
| Dana Whitfield | 12 | 21 | 36.4% | 41 | 53 |
| Priya Raman | 14 | 30 | 31.8% | 37.5 | 26.5 |
| Tom Okoye | 13 | 31 | 29.5% | 34 | 36 |
| Ana Pereira | 7 | 21 | 25.0% | 51 | 57 |
| Liam Carter | 12 | 37 | 24.5% | 47 | 46.5 |
| Marcus Bell | 11 | 35 | 23.9% | 50 | 57 |
| **All reps** | **75** | **181** | **29.3%** | **45.5** | **45** |

The main figure is the cycle across all closed deals. The won-only column shows how long successful deals took. Sofia's numbers come from only 12 deals, so read them with caution.

**Decisions that change the numbers:**

- **Duplicate deals removed.** A Q1 2026 data import added 50 copies of deals that were already in the CRM, identical in every field. I counted only the originals; leaving the copies in would have counted about 40 deals in this window twice.
- **Dana Whitfield's two records merged.** She has two CRM user records with the same name and region, one of them inactive. Together they cover 33 deals: 27 under the active record and 6 under the old one.
- **Meridian Health Group excluded.** This $123.7k deal is labelled New Business, but its note says it consolidates 16 existing Meridian clinic subscriptions into one group contract. That makes it existing business rather than a new customer. Including it would raise Marcus Bell's record to 12 won and 35 lost, a 25.5% win rate.

Deals marked as deleted in the CRM are left out. The four different spellings used for "new business" and the various won/lost stage names are all included. Disqualified deals are excluded, as you asked.

### Q8. Paying customers missing from the CRM

**214 paying customers have no CRM account, representing about $59,658 of MRR** (roughly 6% of total MRR of about $993,600 across 863 paying customers).

Here's how I counted it:

- **Paying customer:** a live-mode billing customer whose current subscription is active or past-due. I left out trialing, paused and canceled subscriptions, Stripe test-mode customers, and six internal "Corvia Demo" QA accounts that are flagged as live mode.
- **Current subscription:** the subscription table marks the current row in two ways, `valid_to` NULL or 9999-12-31, so I used both. I also removed 22 subscriptions whose current row is duplicated exactly.
- **MRR:** seats × per-seat price, with annual plans divided by 12. Enterprise uses its custom annual amount divided by 12. I applied any discount coupon still in effect. Non-USD amounts are converted at the latest FX rates (29 Sep 2026). The AUD rate is stored as USD→AUD, so I inverted it.
- **Matching to the CRM:** I matched the CRM account's Stripe ID to the billing customer. About 90 CRM IDs had stray spaces or uppercase, so I ignored those differences. I also counted Stripe IDs stored in the CRM's `ext_ids` field.

Two things affect the number:

- **43 customers (~$38,600 MRR)** are linked only through a deleted duplicate CRM account that was merged into a surviving account. I counted these as having an account, because the surviving account exists. However, the survivor doesn't carry their Stripe ID, so anything joining on that field alone will miss them. If you treat them as unlinked too, the gap becomes **257 customers and ~$98,300 MRR**.
- **The 214 can't be found by name either.** I checked them against CRM account names after removing suffixes like "LLC" and "Ltd" and found no matches. They look like customers that were never set up in the CRM, not accounts that are just missing a link.

### Q9. ARR by industry

Healthcare brings in the most ARR: about $3.69M of $11.93M total, or 31.0%.

| Industry | ARR (USD) | Share |
|---|---|---|
| **Healthcare** | **$3,694,245** | **31.0%** |
| Field Services | $1,845,099 | 15.5% |
| Home Services | $1,709,781 | 14.3% |
| Dental | $1,701,834 | 14.3% |
| Logistics | $898,172 | 7.5% |
| Veterinary | $743,674 | 6.2% |
| Other | $615,060 | 5.2% |
| No industry on record | $718,840 | 6.0% |

The no-industry row is 215 subscriptions whose billing customer has no matching CRM account. If I guess their industry from the company name ("…Urgent Care", "…Home Cleaning"), Healthcare's share rises to about 32.5%. Either way, Healthcare is roughly twice the size of any other industry.

How I calculated it:

- **Which subscriptions count:** each subscription's state at the end of 30 Sep 2026, counting active and past-due ones. I left out trialing, paused and canceled subscriptions, test-mode customers, and five internal "Corvia Demo" accounts.
- **Duplicate records:** the subscription history had some exact duplicate rows, and I counted each subscription once.
- **MRR:**
  - Monthly plans: seats × price per seat.
  - Annual plans: the yearly amount divided by 12.
  - Enterprise: the custom annual contract amount divided by 12.
  - Discounts: permanent discounts (NONPROFIT20, PARTNER15) are taken off. The 3-month launch discounts have all expired, so none apply.
- **Currency:** converted to US dollars at the latest exchange rate in the database, which is from 29 Sep. Note that the Australian dollar rate is stored the other way round (AUD per USD), so it has to be inverted.
- **Industry:** taken from the CRM account linked to each billing customer. The CRM uses many spellings for the same industry, so I grouped them using the company's industry mapping table. Eight common labels were missing from that table, so I added them myself, e.g. "HC" and "Medical Practice" → Healthcare, "Animal Health" → Veterinary, "FSM" → Field Services.

### Q10. Seat utilization

**About 57% of paid seats were used in September 2026: 16,251 of 28,311 seats.**

The paid seats are the seat counts on 863 subscriptions that were active or past due at the end of 30 September. I counted a seat as used for each distinct real person who did anything in that customer's workspace during September (UTC). This includes logins, viewing the schedule, creating appointments, changing settings and exporting reports. If a customer had more active people than seats, I counted only up to their seat count. That affected 21 customers and only 33 seats.

Usage is similar across plans:

| Plan | Subscriptions | Paid seats | Used seats | Share used |
|---|---|---|---|---|
| Starter | 304 | 1,580 | 886 | 56.1% |
| Growth | 314 | 5,473 | 3,302 | 60.3% |
| Scale | 185 | 7,423 | 4,252 | 57.3% |
| Enterprise | 60 | 13,835 | 7,811 | 56.5% |
| **Total** | **863** | **28,311** | **16,251** | **57.4%** |

Enterprise is almost half of all paid seats, so its 56.5% pulls the total down. 30 paying customers had no human activity at all in September; 22 of them are on Starter.

**What I counted and left out**

- **Paying customers:** subscriptions active or past due on 30 September. I left out trials, paused and canceled subscriptions, the 24 test customers, and the 6 "Corvia Demo" internal accounts.
- **Not real people:** users flagged as bots, [email redacted] accounts and Zapier hook users. The last two aren't flagged as bots in the data, so I identified them by their email addresses.
- **Corvia staff:** `support_admin` users and anyone with a corvia.io email, including the "Corvia Internal" workspace.
- **Sandbox workspaces:** activity there doesn't count. Including it would raise usage to 58.3%.
- **Data cleanup:** the subscription history has 61 exact duplicate rows, which I removed. About a third of workspaces store their billing ID in a different field, so I matched both fields. Without this, many Enterprise customers would have appeared to have no users.

**Alternative way to measure:** I also counted every subscription that was paid at any point in September, including ones canceled mid-month, using each one's highest seat count. That gives 16,436 of 28,679 seats, or 57.3%. So the result holds at about 57% either way.

### Q11. Appointments trend

Customers created about **125,000 appointments in June, rising to about 140,000 in September**: a steady climb of roughly 12% over the quarter, with most of the gain in September.

| Month | Appointments | Per day | Change vs prior month | Active workspaces |
|---|---|---|---|---|
| June | 125,081 | 4,169 | — | 774 |
| July | 128,135 | 4,133 | +2.4% | 799 |
| August | 131,258 | 4,234 | +2.4% | 829 |
| September | 139,943 | 4,665 | +6.6% | 864 |

**The trend.** Growth was modest through the summer and then sped up in September. September is a 30-day month, so its daily rate jumped about 10%. July's daily rate was actually slightly below June's, because July has one more day. The growth comes from more customers using the product, not from heavier use per customer. Active workspaces grew 774 → 864 (+12%), while appointments per workspace stayed flat at about 158–162 a month.

**Who creates them.** About 53% of appointments arrive through automated channels: the Corvia Integration bot, customers' own "API Sync" accounts, and Zapier. The other 47% are created by people. Both groups grew at the same pace (about 12% from June to September), so the split hasn't shifted. I counted both, because these are real appointments in customer workspaces. If you want only appointments entered by people, the figures are 59,001 / 60,362 / 62,707 / 66,066.

**How I counted.**
- **The event was renamed on 1 August.** It was logged as `appointment_created` until 31 July and as `appointment.created` from then on. I combined both names. A query on either name alone would show the metric dropping to zero halfway through the period.
- **Duplicates:** about 3% of events were logged twice with the same event ID. I kept one copy of each.
- **Non-customer activity excluded:** sandbox workspaces, the "Test Clinic" workspaces, Corvia Demo workspaces, the Corvia Internal workspace, and Corvia staff and QA accounts. These add up to roughly 2,000–3,000 events a month.
- **Months are in UTC,** based on when each appointment was created.

### Q12. Enterprise support responsiveness

For the 901 support tickets that Enterprise customers opened in Q3 2026, the **median time to the first human reply was about 1 hour 46 minutes**. **78.7% (709 of 901) got a human reply within 4 hours.**

How I counted it:

- **Enterprise customers:** a ticket counts if the customer was on an Enterprise plan when the ticket was opened. I matched tickets to customers by email domain; every ticket matched exactly one customer. Test accounts are excluded.
- **Q3 2026:** tickets opened from 1 July to 30 September 2026 (UTC). I left out 34 tickets that were merged into other tickets as duplicates, so they aren't double-counted.
- **First human reply:** the first public message from a support agent. The automatic "we've received your request" message and agents' internal notes don't count.
- **4-hour target:** measured in clock hours, not business hours. The 55 tickets with no human reply by the end of 30 September count as misses. Each of them had been open for more than 4 hours, so none was simply too recent to judge.
- **Median:** it includes the unanswered tickets. They have waited longer than the median, so they still affect where it falls. Counting only the 846 tickets that got a reply, the median is about 1 hour 41 minutes.

One judgment call affects the figures slightly. Six new Enterprise customers opened 10 tickets in the days just before their subscription started, probably during onboarding. I left them out because the customer wasn't yet on an Enterprise plan. Including them gives 911 tickets, a median of about 1 hour 47 minutes, and 78.3% within 4 hours.

### Q13. Customer count

**Corvia has 864 paying customers as of 30 September 2026.**

That's the number of real (live-mode, non-internal) billing accounts with a current subscription that is either active (857) or past due (7). I counted past-due accounts because they're still subscribed and being billed. Each of these customers has exactly one current subscription, and I checked for duplicate company names and emails and found none.

Several other figures could be mistaken for the customer count, so here is why I didn't use them:

- **1,555 billing customer records:** this total includes about 660 accounts whose subscriptions are cancelled, plus test-mode accounts.
- **Accounts on the edge of the definition:**
  - 25 accounts are on a free trial and haven't converted yet.
  - 5 accounts have paused subscriptions.
  - If you count these as customers, the total is 894.
- **Excluded entirely:**
  - 17 test-mode accounts that show an "active" status.
  - 3 accounts flagged as internal.
- **About 690 CRM accounts tagged as customers:** the CRM labels this inconsistently ("Customer", "customer", "Active Customer") and doesn't match billing, so I relied on billing.

A technical note: the subscriptions table keeps a history of each subscription, with each row valid for a period of time. Some open-ended rows end in 9999-12-31 and others are blank, and 15 subscriptions had more than one open row. I took the most recent valid row for each subscription.

