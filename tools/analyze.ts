/**
 * Body-level measurements shared by the CI gate and the health report.
 *
 * Frontmatter can be validated by a schema; these are the properties that only
 * exist in the prose — whether a statistic is actually sourced, whether a
 * quotation is actually attributed, how the sections are sized.
 */

export interface Analysis {
  wordCount: number;
  h2: string[];
  sectionWordCounts: number[];
  numericClaims: { text: string; sourced: boolean; reason: string }[];
  attributedQuotes: string[];
  externalLinks: string[];
  internalLinks: string[];
  hasTable: boolean;
  readingGrade: number;
  questionOrClaimH2: { heading: string; ok: boolean }[];
}

/** Strip fenced code and HTML comments before measuring prose. */
function prose(body: string): string {
  return body.replace(/```[\s\S]*?```/g, " ").replace(/<!--[\s\S]*?-->/g, " ");
}

function words(s: string): string[] {
  return s.split(/\s+/).filter(Boolean);
}

/** Rough syllable count — good enough for a grade-level trend, not phonetics. */
function syllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const groups = w
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "")
    .replace(/^y/, "")
    .match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
}

/** Flesch–Kincaid grade level. The spec targets 9–10. */
function fleschKincaid(text: string): number {
  const sentences = text.split(/[.!?]+(?:\s|$)/).filter((s) => words(s).length > 2);
  const ws = words(text.replace(/[^\w\s.'-]/g, " "));
  if (!sentences.length || !ws.length) return 0;
  const syl = ws.reduce((a, w) => a + syllables(w), 0);
  return 0.39 * (ws.length / sentences.length) + 11.8 * (syl / ws.length) - 15.59;
}

/**
 * A sentence carrying a number that reads as a factual claim. Bare list
 * numbering, step counts and standalone years are not claims.
 */
const CLAIM_RE =
  /\d+(?:\.\d+)?\s?%|\$\s?\d|\d+(?:\.\d+)?\s?x\b|\b\d{2,}\s?(?:hours?|minutes?|days?|weeks?|months?|connectors?|sources?|companies|customers|users|respondents)\b/i;

export function analyze(body: string, citations: { claim: string; url: string }[] = []): Analysis {
  const text = prose(body);

  const h2 = [...text.matchAll(/^## +(.+?)\s*$/gm)].map((m) => m[1].trim());

  // Section sizes, measured between H2 boundaries.
  const parts = text.split(/^## +.+$/gm).slice(1);
  const sectionWordCounts = parts.map((p) => words(p.replace(/[#>*_`~|-]/g, " ")).length);

  const linkRe = /\[([^\]]*)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g;
  const externalLinks: string[] = [];
  const internalLinks: string[] = [];
  for (const m of text.matchAll(linkRe)) {
    const url = m[2];
    if (url.startsWith("/") || url.includes("supaboard.ai")) internalLinks.push(url);
    else externalLinks.push(url);
  }

  // A numeric claim counts as sourced when the sentence carries an outbound
  // link, or when the same figure appears in a declared citation.
  const citationText = citations.map((c) => c.claim).join(" ");
  const sentences = text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const numericClaims = sentences
    .filter((s) => CLAIM_RE.test(s))
    .map((s) => {
      const hasInlineLink = /\]\(https?:\/\//.test(s);
      const figures = s.match(/\d+(?:\.\d+)?/g) ?? [];
      const inCitations = figures.some((f) => citationText.includes(f));
      return {
        text: s.replace(/\s+/g, " ").slice(0, 240),
        sourced: hasInlineLink || inCitations,
        reason: hasInlineLink ? "inline link" : inCitations ? "figure appears in citations" : "no source",
      };
    });

  // A quotation only counts if a person is named next to it.
  const ATTRIB = /[—–-]\s*[A-Z][\w.'-]+(?:\s+[A-Z][\w.'-]+)+\s*,\s*.{3,}/;
  const attributedQuotes: string[] = [];
  for (const m of text.matchAll(/^>\s?(.+(?:\n>.*)*)/gm)) {
    const block = m[0];
    if (ATTRIB.test(block)) attributedQuotes.push(block.slice(0, 160));
  }
  for (const m of text.matchAll(/["“][^"”]{25,}["”]\s*[—–-]\s*[A-Z][\w.'-]+(?:\s+[A-Z][\w.'-]+)+/g)) {
    attributedQuotes.push(m[0].slice(0, 160));
  }

  // An H2 that is a question or a claim — not a noun phrase like "Introduction".
  const questionOrClaimH2 = h2.map((heading) => ({
    heading,
    ok:
      /\?$/.test(heading) ||
      // a claim needs a verb; a bare label like "Final Thoughts" does not have one
      /\b(is|are|was|were|does|do|can|will|should|has|have|means|beats|costs|works|needs|matters|wins|fails|breaks|makes|takes|gives|shows)\b/i.test(
        heading,
      ),
  }));

  return {
    wordCount: words(text.replace(/[#>*_`~|-]/g, " ")).length,
    h2,
    sectionWordCounts,
    numericClaims,
    attributedQuotes,
    externalLinks,
    internalLinks,
    hasTable: /^\s*\|.+\|\s*$/m.test(text) && /^\s*\|[\s:|-]+\|\s*$/m.test(text),
    readingGrade: Math.round(fleschKincaid(text) * 10) / 10,
    questionOrClaimH2,
  };
}
