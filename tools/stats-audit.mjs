/**
 * Phase 5a — extract every numeric claim in the surviving corpus.
 *
 * The classification matters more than the count. A tutorial that says "45% of
 * sales were electronics" while teaching someone to read a bar chart is not
 * making a claim about the world, and treating it as an unsourced statistic
 * would bury the handful of claims that genuinely are invented. So each claim
 * is typed, and only the types that assert something about reality need a
 * source.
 *
 * Types:
 *   SOURCED        already carries an inline link, or its figure appears in a
 *                  declared citation
 *   ILLUSTRATIVE   a worked example or hypothetical — no source required
 *   PRODUCT_FACT   a claim about Supaboard, checkable against supaboard.ai
 *   PRICING        a competitor price — true only until the vendor changes it
 *   VENDOR_CLAIM   "our clients typically see …" with no named customer
 *   EXTERNAL_STAT  cites a survey, study or market that is not named
 *   UNCLASSIFIED   needs a human read
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import matter from "gray-matter";
import { analyze } from "./analyze.ts";

const ROOT = new URL("..", import.meta.url).pathname;
const POSTS = `${ROOT}posts/`;

const ILLUSTRATIVE =
  /\b(for example|for instance|e\.g\.|imagine|suppose|say that|let's say|sample|hypothetical|example:)/i;
const VENDOR_CLAIM =
  /\b(our clients?|our customers?|we(?:'ve| have) seen|we typically|customers? (?:typically |usually )?(?:see|report)|clients? typically)\b/i;
const EXTERNAL_STAT =
  /\b(a (?:20\d\d )?(?:survey|study|report|poll)|surveys? (?:show|found)|studies show|research (?:shows|found)|according to (?:a|an|one)\b|analysts? (?:say|estimate)|% of (?:companies|businesses|organi[sz]ations|executives|teams|respondents))/i;
const PRODUCT_FACT = /\bsupaboard\b/i;
const PRICING = /\$\s?\d+(?:\.\d+)?\s?(?:\/|per\b|a\b)?\s*(?:user|seat|month|mo\b|year|yr\b|annually)/i;

/**
 * The most damaging pattern in this corpus: a results claim attributed to a
 * company that is never named. "A SaaS company reduced CAC by 22%" is
 * unfalsifiable and unverifiable, and four real named case studies exist that
 * could have carried the same point.
 */
const UNNAMED_CASE_STUDY =
  /\b(?:a|one|an)\s+(?:mid-?sized?\s+|multinational\s+|large\s+|global\s+|leading\s+|fast-growing\s+|major\s+|US\s+)*(?:saas|retail|fashion|manufacturing|healthcare|logistics|e-?commerce|financial|enterprise|company|firm|business|retailer|chain|organi[sz]ation|hospital|startup)\b[^.]{0,90}\b(?:reduced|increased|improved|cut|grew|dropped|saved|achieved|reported|boosted|raised|lowered)\b/i;

/** First-person expertise from a byline that did not do the work. */
const FIRST_PERSON_EXPERIENCE =
  /\b(?:in our (?:work|experience)|from our experience|we(?:'ve| have) (?:seen|found|helped|tested)|i(?:'ve| have) (?:seen|tested|found)|when we help)\b/i;

const rows = [];

for (const file of readdirSync(POSTS).filter((f) => f.endsWith(".md")).sort()) {
  const slug = basename(file, ".md");
  const parsed = matter(readFileSync(POSTS + file, "utf8"));
  const citations = parsed.data.citations ?? [];
  const { numericClaims } = analyze(parsed.content, citations);

  for (const claim of numericClaims) {
    let type;
    // Order matters: an unnamed case study that also happens to carry a link
    // is still an unnamed case study.
    if (UNNAMED_CASE_STUDY.test(claim.text)) type = "UNNAMED_CASE_STUDY";
    else if (FIRST_PERSON_EXPERIENCE.test(claim.text)) type = "FIRST_PERSON_UNEARNED";
    else if (claim.sourced) type = "SOURCED";
    else if (ILLUSTRATIVE.test(claim.text)) type = "ILLUSTRATIVE";
    else if (VENDOR_CLAIM.test(claim.text)) type = "VENDOR_CLAIM";
    else if (EXTERNAL_STAT.test(claim.text)) type = "EXTERNAL_STAT";
    else if (PRICING.test(claim.text)) type = "PRICING";
    else if (PRODUCT_FACT.test(claim.text)) type = "PRODUCT_FACT";
    else type = "UNCLASSIFIED";

    // The only two verdicts the brief allows for an unsourced world-claim.
    const verdict =
      type === "SOURCED" ? "keep — sourced"
      : type === "ILLUSTRATIVE" ? "keep — worked example, asserts nothing about the world"
      : type === "PRODUCT_FACT" ? "verify against supaboard.ai, then cite"
      : type === "PRICING" ? "verify against vendor pricing page, then cite with an as-of date"
      : type === "VENDOR_CLAIM" ? "DELETE or attribute to a named case study"
      : type === "EXTERNAL_STAT" ? "DELETE or replace with a real, linked source"
      : type === "UNNAMED_CASE_STUDY" ? "DELETE — unverifiable result claimed for a company that is never named"
      : type === "FIRST_PERSON_UNEARNED" ? "DELETE or reattribute — first-person experience under a byline that did not do the work"
      : "read and decide";

    const inlineUrl = (claim.text.match(/\]\((https?:\/\/[^)\s]+)\)/) ?? [])[1] ?? "";
    rows.push({
      slug,
      claim: claim.text,
      has_source: claim.sourced ? "yes" : "no",
      source_url: inlineUrl,
      type,
      verdict,
    });
  }
}

const cell = (v) => (/[",\n]/.test(v) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
const header = ["slug", "claim", "has_source", "source_url", "type", "verdict"];
writeFileSync(
  `${ROOT}migration/stats-audit.csv`,
  [header.join(","), ...rows.map((r) => header.map((h) => cell(r[h])).join(","))].join("\n") + "\n",
);

const byType = rows.reduce((a, r) => ((a[r.type] = (a[r.type] ?? 0) + 1), a), {});
console.log(`stats-audit.csv: ${rows.length} numeric claims across the surviving corpus\n`);
for (const [t, n] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}  ${t}`);
}
const mustFix = rows.filter((r) => r.verdict.startsWith("DELETE"));
console.log(`\nmust be sourced or deleted: ${mustFix.length}`);
for (const r of mustFix) console.log(`  [${r.slug}] ${r.claim.slice(0, 120)}`);
