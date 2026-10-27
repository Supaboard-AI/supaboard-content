# Data Analytics Index

A benchmark of AI data agents on one realistic SaaS database. 

## The database

Corvia Systems is a fictional company that sells per-seat scheduling and dispatch software to clinics and field-service businesses in the US, UK, Europe and Australia. Its data sits in one Postgres database (on Neon) with six areas: billing, CRM, product usage, customer support, a legacy billing export and reference tables, about 20 tables in all. The data is realistic and deliberately messy, the way real company data is: the systems do not share clean keys, some records are duplicated or inconsistent, and definitions have to be worked out from the data. Agents had read access to the whole database and nothing else: no documentation, hints or semantic layer.

## The questions

Each agent answered the same questions, each in a fresh chat with the same short company introduction. Only the titles are published here, so that vendors cannot tune their agents to the test.

| # | Question |
|---|---|
| Q1 | MRR today |
| Q2 | Net revenue retention |
| Q3 | The May cancellation spike |
| Q4 | Recognized revenue, Q3 2026 |
| Q5 | Billings, 2024 against 2025 |
| Q6 | Overdue receivables |
| Q7 | Sales performance, H1 2026 |
| Q8 | Paying customers missing from the CRM |
| Q9 | ARR by industry |
| Q10 | Seat utilization |
| Q11 | Appointments trend |
| Q12 | Enterprise support responsiveness |
| Q13 | Customer count |

## Scoring

Each answer scores 0 to 3:

| Score | Rule |
|---|---|
| 3 | The exact figure from the answer key appears in the answer (as the headline, a stated alternative or a sensitivity table) |
| 2 | A figure within 5% of the answer key appears |
| 1 | The agent states its method, the method is a reasonable reading of the question, and its number is right for that method (checked against the database) |
| 0 | Anything else, or a figure the agent did not produce itself |

Exact means counts match and money or rates are within 0.1% or equal at the precision the agent wrote (for example $2.6M against $2,568,267). Thirteen questions × 3 points = 39 points.

**Data Analytics Index = 10 base points + accuracy %**, where accuracy % = points ÷ 39 × 100. Every agent receives the 10 base points; the maximum is 110.

## Data Analytics Index

| Rank | Agent | Points (of 39) | Accuracy | Data Analytics Index |
|---|---|---|---|---|
| 1 | [Claude Opus 5.5](claude-opus-5-5/README.md) | 35 | 89.7% | **99.7** |
| 1 | [Supaboard (Stella Pro)](supaboard-stella-pro/README.md) | 35 | 89.7% | **99.7** |
| 3 | [Claude Sonnet 5.5](claude-sonnet-5-5/README.md) | 31 | 79.5% | **89.5** |
| 4 | [Lightdash](lightdash/README.md) | 28 | 71.8% | **81.8** |
| 5 | [Basedash](basedash/README.md) | 27 | 69.2% | **79.2** |
| 6 | [ChatGPT (GPT-6)](chatgpt-gpt-6/README.md) | 26 | 66.7% | **76.7** |
| 7 | [Dot](dot/README.md) | 22 | 56.4% | **66.4** |
| 8 | [Hex](hex/README.md) | 19 | 48.7% | **58.7** |
| 9 | [Sigma](sigma/README.md) | 17 | 43.6% | **53.6** |
| 10 | [Metabase](metabase/README.md) | 0 | 0.0% | **10.0** |

## Which questions tripped agents up

Average score across the 10 agents (0 to 3), lowest first.

| Question | Average | Agents exact (3) |
|---|---|---|
| Q9 ARR by industry | 0.60 | 1 of 10 |
| Q8 Paying customers missing from the CRM | 1.00 | 2 of 10 |
| Q6 Overdue receivables | 1.40 | 4 of 10 |
| Q13 Customer count | 1.40 | 1 of 10 |
| Q11 Appointments trend | 1.60 | 1 of 10 |
| Q12 Enterprise support responsiveness | 1.70 | 0 of 10 |
| Q1 MRR today | 1.80 | 4 of 10 |
| Q7 Sales performance, H1 2026 | 2.10 | 7 of 10 |
| Q10 Seat utilization | 2.10 | 3 of 10 |
| Q4 Recognized revenue, Q3 2026 | 2.30 | 7 of 10 |
| Q2 Net revenue retention | 2.60 | 8 of 10 |
| Q3 The May cancellation spike | 2.70 | 9 of 10 |
| Q5 Billings, 2024 against 2025 | 2.70 | 9 of 10 |

## Average time to answer

Seconds from the question reaching the agent to its finished answer, from each platform’s own server timestamps where available, otherwise its own timer. Time spent waiting for a human (SQL approval clicks, replies) is not counted where the platform records it separately.

| Agent | Average (s) | Median (s) |
|---|---|---|
| Basedash | 68 | 68 |
| Hex | 75 | 74 |
| Claude Sonnet 5.5 | 98 | 96 |
| Claude Opus 5.5 | 149 | 130 |
| Dot | 152 | 122 |
| Lightdash | 173 | 182 |
| Metabase | 180 | 147 |
| Supaboard (Stella Pro) | 192 | 201 |
| ChatGPT (GPT-6) | 196 | 212 |
| Sigma | 225 | 168 |

## Results by question

For each question: the answer-key figure, what each agent gave, the error against the key, the score and the time taken.

### Q1. MRR today

Answer key: MRR $993,647 · 863 customers

| Agent | Answer given | Error | Score | Time (s) |
|---|---|---|---|---|
| Claude Opus 5.5 | MRR $993,647 · 863 customers | -0.0% | 3 | 99 |
| Supaboard (Stella Pro) | MRR $993.6K · 863 customers | -0.0% | 3 | 229 |
| Claude Sonnet 5.5 | MRR $993,600 · 863 customers | -0.0% | 3 | 87 |
| Lightdash | MRR $245,489 · 250 customers | -75.3% | 0 | 101 |
| Basedash | MRR $993,892.08 · 864 customers | +0.0% | 2 | 61 |
| ChatGPT (GPT-6) | MRR $993,647 · 863 customers | -0.0% | 3 | 212 |
| Dot | MRR $993,892 · 864 customers | +0.0% | 2 | 122 |
| Hex | MRR $748,158.50 · 613 customers | -24.7% | 0 | 82 |
| Sigma | MRR $993,892 · 864 customers | +0.0% | 2 | 270 |
| Metabase | SQL only, not run by the agent | – | 0 | 117 |

### Q2. Net revenue retention

Answer key: NRR 97.4%

| Agent | Answer given | Error | Score | Time (s) |
|---|---|---|---|---|
| Claude Opus 5.5 | 97.4% | -0.0% | 3 | 130 |
| Supaboard (Stella Pro) | 97.4% | -0.0% | 3 | 175 |
| Claude Sonnet 5.5 | 97.4% | -0.0% | 3 | 157 |
| Lightdash | 97.4% | -0.0% | 3 | 242 |
| Basedash | 97.41% | -0.0% | 3 | 79 |
| ChatGPT (GPT-6) | 97.41% | -0.0% | 3 | 242 |
| Dot | 97.4% | -0.0% | 3 | 146 |
| Hex | 97.4% | -0.0% | 3 | 56 |
| Sigma | 96.5% | -0.9% | 2 | 168 |
| Metabase | SQL only, not run by the agent | – | 0 | 301 |

### Q3. The May cancellation spike

Answer key: Meridian Health consolidation: 16 clinics, 15 May

| Agent | Answer given | Error | Score | Time (s) |
|---|---|---|---|---|
| Claude Opus 5.5 | names the consolidation, 16 clinics, 15 May | – | 3 | 105 |
| Supaboard (Stella Pro) | names the consolidation, 16 clinics, 15 May | – | 3 | 164 |
| Claude Sonnet 5.5 | names the consolidation, 16 clinics, 15 May | – | 3 | 96 |
| Lightdash | names the consolidation, 16 clinics, 15 May | – | 3 | 48 |
| Basedash | names the consolidation, 16 clinics, 15 May | – | 3 | 100 |
| ChatGPT (GPT-6) | names the consolidation, 16 clinics, 15 May | – | 3 | 232 |
| Dot | names the consolidation, 16 clinics, 15 May | – | 3 | 573 |
| Hex | names the consolidation, 16 clinics, 15 May | – | 3 | 85 |
| Sigma | names the consolidation, 16 clinics, 15 May | – | 3 | 144 |
| Metabase | does not name it | – | 0 | 114 |

### Q4. Recognized revenue, Q3 2026

Answer key: $2,568,266.89

| Agent | Answer given | Error | Score | Time (s) |
|---|---|---|---|---|
| Claude Opus 5.5 | $2,568,267 | +0.0% | 3 | 144 |
| Supaboard (Stella Pro) | $2.6M | +1.2% | 3 | 151 |
| Claude Sonnet 5.5 | $2,568,248 | -0.0% | 3 | 93 |
| Lightdash | $2,568,266.89 | +0.0% | 3 | 191 |
| Basedash | $2,569,001.89 | +0.0% | 3 | 70 |
| ChatGPT (GPT-6) | $2,568,266.90 | +0.0% | 3 | 218 |
| Dot | $2,567,133 | -0.0% | 3 | 188 |
| Hex | $2,601,203.52 | +1.3% | 2 | 76 |
| Sigma | –$134,580.21 | -94.8% | 0 | 444 |
| Metabase | SQL only, not run by the agent | – | 0 | 414 |

### Q5. Billings, 2024 against 2025

Answer key: 2024 $2,845,627.70 · 2025 $6,664,837.30

| Agent | Answer given | Error | Score | Time (s) |
|---|---|---|---|---|
| Claude Opus 5.5 | 2024 $2,845,628 · 2025 $6,664,837 | -0.0% | 3 | 194 |
| Supaboard (Stella Pro) | 2024 2,845,627.71 · 2025 6,664,837.3 | +0.0% | 3 | 285 |
| Claude Sonnet 5.5 | 2024 $2,845,628 · 2025 $6,664,837 | -0.0% | 3 | 125 |
| Lightdash | 2024 $2,845,628 · 2025 $6,664,837 | -0.0% | 3 | 199 |
| Basedash | 2024 $2,845,627.70 · 2025 $6,665,229.30 | +0.0% | 3 | 62 |
| ChatGPT (GPT-6) | 2024 $2,845,627.70 · 2025 $6,664,837.30 | +0.0% | 3 | 257 |
| Dot | 2024 $2,845,628 · 2025 $6,663,927 | -0.0% | 3 | 193 |
| Hex | 2024 $2,845,628 · 2025 $6,665,229 | +0.0% | 3 | 72 |
| Sigma | 2024 $2,845,628 · 2025 $6,665,229 | +0.0% | 3 | 402 |
| Metabase | SQL only, not run by the agent | – | 0 | 411 |

### Q6. Overdue receivables

Answer key: $305,557.25 (open invoices), top 5 debtors

| Agent | Answer given | Error | Score | Time (s) |
|---|---|---|---|---|
| Claude Opus 5.5 | $305,557.25 | +0.0% | 3 | 140 |
| Supaboard (Stella Pro) | $305.6K (first run) | +0.0% | 3 | 312 |
| Claude Sonnet 5.5 | $305,557.25 | +0.0% | 3 | 116 |
| Lightdash | $305,557.25 | +0.0% | 3 | 225 |
| Basedash | $305,557.25 open (headline $649,118.69) | +0.0% | 2 | 49 |
| ChatGPT (GPT-6) | $242,322.53 | -20.7% | 0 | 240 |
| Dot | $242,323 | -20.7% | 0 | 54 |
| Hex | $142,449 | -53.4% | 0 | 47 |
| Sigma | $242,322.53 | -20.7% | 0 | 114 |
| Metabase | SQL only, not run by the agent | – | 0 | 147 |

### Q7. Sales performance, H1 2026

Answer key: Win rate per rep, 7 reps (e.g. Sofia Marin 50.0%)

| Agent | Answer given | Error | Score | Time (s) |
|---|---|---|---|---|
| Claude Opus 5.5 | 6 reps exact; Marcus 25.5% as alternative | – | 3 | 107 |
| Supaboard (Stella Pro) | 7 of 7 reps exact, 7 within 5% | – | 3 | 112 |
| Claude Sonnet 5.5 | 7 of 7 reps exact, 7 within 5% | – | 3 | 56 |
| Lightdash | 7 of 7 reps exact, 7 within 5% | – | 3 | 182 |
| Basedash | 7 of 7 reps exact, 7 within 5% | – | 3 | 82 |
| ChatGPT (GPT-6) | 7 of 7 reps exact, 7 within 5% | – | 3 | 138 |
| Dot | 0 of 7 reps exact, 3 within 5% | – | 0 | 46 |
| Hex | 7 of 7 reps exact, 7 within 5% | – | 3 | 48 |
| Sigma | 0 of 7 reps exact, 4 within 5% | – | 0 | 55 |
| Metabase | SQL only, not run by the agent | – | 0 | 85 |

### Q8. Paying customers missing from the CRM

Answer key: 214 customers · $59,658.33 MRR

| Agent | Answer given | Error | Score | Time (s) |
|---|---|---|---|---|
| Claude Opus 5.5 | 214 customers · $59,658 | +0.0% | 3 | 162 |
| Supaboard (Stella Pro) | 214 customers · 59,658.33 | +0.0% | 3 | 201 |
| Claude Sonnet 5.5 | 218 customers · $62,454 | +1.9% | 2 | 109 |
| Lightdash | 216 customers · $61.9K | +0.9% | 2 | 166 |
| Basedash | 263 customers · $123,223.91 | +22.9% | 0 | 62 |
| ChatGPT (GPT-6) | 305 customers · $164,093.96 | +42.5% | 0 | 176 |
| Dot | 306 customers · $162,217 | +43.0% | 0 | 124 |
| Hex | 191 customers · $73.5K | -10.7% | 0 | 53 |
| Sigma | 412 customers · $514,419 | +92.5% | 0 | 138 |
| Metabase | SQL only, not run by the agent | – | 0 | 203 |

### Q9. ARR by industry

Answer key: Healthcare · 31.0%

| Agent | Answer given | Error | Score | Time (s) |
|---|---|---|---|---|
| Claude Opus 5.5 | Healthcare · 31.0% | +0.1% | 3 | 128 |
| Supaboard (Stella Pro) | Healthcare · 29.16% | -5.9% | 1 | 204 |
| Claude Sonnet 5.5 | Healthcare · 47.2% | +52.3% | 0 | 131 |
| Lightdash | Healthcare · 36.5% | +17.8% | 0 | 251 |
| Basedash | Healthcare · 14.15% | -54.3% | 0 | 68 |
| ChatGPT (GPT-6) | Healthcare · 28.15% | -9.1% | 0 | 148 |
| Dot | Healthcare · 29.5% | -4.8% | 2 | 202 |
| Hex | Healthcare · 26.2% | -15.4% | 0 | 74 |
| Sigma | Healthcare · 27.1% | -12.5% | 0 | 474 |
| Metabase | SQL only, not run by the agent | – | 0 | 156 |

### Q10. Seat utilization

Answer key: 57.5%

| Agent | Answer given | Error | Score | Time (s) |
|---|---|---|---|---|
| Claude Opus 5.5 | 57.4% | -0.2% | 2 | 199 |
| Supaboard (Stella Pro) | 57.52% (sensitivity table) | +0.0% | 3 | 233 |
| Claude Sonnet 5.5 | 57.5% | -0.0% | 3 | 139 |
| Lightdash | 57.5% uncapped (first run) | -0.0% | 3 | 254 |
| Basedash | 56.6% | -1.6% | 2 | 80 |
| ChatGPT (GPT-6) | 57.8% | +0.5% | 2 | 253 |
| Dot | 57.3% | -0.4% | 2 | 121 |
| Hex | 57.3% | -0.4% | 2 | 96 |
| Sigma | 59.8% | +4.0% | 2 | 282 |
| Metabase | SQL only, not run by the agent | – | 0 | 243 |

### Q11. Appointments trend

Answer key: Sep 139,943 (all) or 66,066 (people only)

| Agent | Answer given | Error | Score | Time (s) |
|---|---|---|---|---|
| Claude Opus 5.5 | Sep 139,943 | +0.0% | 3 | 360 |
| Supaboard (Stella Pro) | Sep 142,668 (all, in table) | +1.9% | 2 | 90 |
| Claude Sonnet 5.5 | Sep 142.4k (with bots) | +1.8% | 2 | 56 |
| Lightdash | Sep 142,668 (all) | +1.9% | 2 | 133 |
| Basedash | Sep 140,577 | +0.5% | 2 | 73 |
| ChatGPT (GPT-6) | Sep 142,389 | +1.7% | 2 | 144 |
| Dot | Sep 81,928 | +24.0% | 0 | 71 |
| Hex | Sep 90,926 | +37.6% | 1 | 95 |
| Sigma | Sep 142668 | +1.9% | 2 | 54 |
| Metabase | Sep 146,978 | +5.0% | 0 | 35 |

### Q12. Enterprise support responsiveness

Answer key: Median 1.67 h · 78.5% within 4 h

| Agent | Answer given | Error | Score | Time (s) |
|---|---|---|---|---|
| Claude Opus 5.5 | Median 106 min · 78.7% | +0.3% | 1 | 108 |
| Supaboard (Stella Pro) | Median 101.33 minutes · 78.27% | -0.3% | 2 | 127 |
| Claude Sonnet 5.5 | Median 101 min · 78.3% | -0.3% | 2 | 59 |
| Lightdash | Median 1.68 h · 78.7% | +0.3% | 2 | 180 |
| Basedash | Median 100 min · 78.58% | +0.1% | 2 | 59 |
| ChatGPT (GPT-6) | Median 100.58 min · 78.3% | -0.3% | 2 | 186 |
| Dot | Median 1.68 h · 78.7% | +0.3% | 2 | 113 |
| Hex | Median 1.68 h · 78.7% | +0.3% | 2 | 133 |
| Sigma | Median 1.69 h · 79.0% | +0.6% | 2 | 258 |
| Metabase | SQL only, not run by the agent | – | 0 | 78 |

### Q13. Customer count

Answer key: 863 paying customers

| Agent | Answer given | Error | Score | Time (s) |
|---|---|---|---|---|
| Claude Opus 5.5 | 864 | +0.1% | 2 | 67 |
| Supaboard (Stella Pro) | 863 | +0.0% | 3 | 219 |
| Claude Sonnet 5.5 | 897 | +3.9% | 1 | 44 |
| Lightdash | 897 | +3.9% | 1 | 71 |
| Basedash | 864 | +0.1% | 2 | 43 |
| ChatGPT (GPT-6) | 867 | +0.5% | 2 | 104 |
| Dot | 864 | +0.1% | 2 | 26 |
| Hex | 617 | -28.5% | 0 | 53 |
| Sigma | 1,531 | +77.4% | 1 | 126 |
| Metabase | 1,526 | +76.8% | 0 | 31 |

## Notes

- The test was designed and run by Claude (Anthropic) on behalf of Supaboard, one of the agents tested. Claude Opus and Claude Sonnet are also tested.
- Claude (claude.ai) and ChatGPT reached the database through their Neon connectors with owner access to the benchmark project only; every other agent used the same read-only database role. No agent wrote to the database.
- Full question texts, the answer key and the database are available to the reviewer on request; they are not published here.
- Each agent’s folder has its score per question and its full answers.