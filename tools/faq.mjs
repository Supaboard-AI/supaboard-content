/**
 * Pulls the Q&A pairs out of a post body so they can be emitted as `FAQPage`
 * JSON-LD.
 *
 * Framer's own FAQPage block shipped unrendered `{{section1}}` template
 * placeholders on every post — markup worse than none, since it advertises
 * structured data that says nothing. These posts do have real FAQs; they are
 * just written as prose, in two different shapes depending on who wrote them:
 *
 *   ## Frequently Asked Questions        ## FAQ
 *   ##### Does it scale?                 **Does it scale?** Yes, because …
 *   Yes, because …
 *
 *   ### FAQs About X                     ## FAQ
 *   1.  #### Does it scale?              **Does it scale?**
 *       Yes, because …                   Yes, because …
 *
 * All four are handled by one pass: a line is either a question or part of the
 * answer to the last one. Anything outside a recognised FAQ section is ignored
 * — a bold lead-in mid-article is not a question.
 */

/** Matches the section heading itself, in all the forms the corpus uses. */
const FAQ_HEADING = /^(#{2,4})\s*(?:FAQs?\b|Frequently Asked Questions?)/im;

/** Strips markdown down to the plain text schema.org expects. */
export function toPlainText(value) {
  return value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/(?<!\w)_([^_]+)_(?!\w)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s*(?:[-*]|\d+[.)])\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** The FAQ section's lines, from its heading to the next same-or-higher one. */
function faqSection(body) {
  const match = body.match(FAQ_HEADING);
  if (!match) return null;

  const level = match[1].length;
  const lines = body.slice(match.index).split("\n");
  const out = [lines[0]];

  for (const line of lines.slice(1)) {
    const heading = line.match(/^(#{1,6})\s/);
    if (heading && heading[1].length <= level) break;
    out.push(line);
  }

  // Some posts wrap the question in bold but put the closing `**` at the start
  // of the next line — `**Is my data safe?\n**Yes, …`. Pull it back up so the
  // pair sits on one line like every other variant.
  return out
    .join("\n")
    .replace(/\*\*([^*\n]+?)\s*\n\s*\*\*/g, "**$1** ")
    .split("\n");
}

/**
 * Reads one line as either the start of a question or more of the current
 * answer. Returns `{ question, inlineAnswer }` for the former, `null` for the
 * latter.
 *
 * Inside an FAQ section a heading is always a question, so no `?` is required
 * — some are phrased as statements. A bold line has to earn it, because a bold
 * lead-in like `**Where it is going.**` is a label, not a question.
 */
function asQuestion(line) {
  // `#### Q` — optionally wrapped in an ordered-list item and indented.
  const heading = line.match(/^\s*(?:\d+[.)]\s+)?#{1,6}\s+(.+?)\s*$/);
  if (heading) return { question: toPlainText(heading[1]), inlineAnswer: "" };

  // `**Q?** A`, or `**Q?**` with the answer on the following line.
  const bold = line.match(/^\s*(?:\d+[.)]\s+)?\*\*(.+?)\*\*:?\s*(.*)$/);
  if (bold) {
    const question = toPlainText(bold[1]);
    if (question.endsWith("?")) {
      return { question, inlineAnswer: bold[2].trim() };
    }
  }

  return null;
}

export function extractFaq(body) {
  const lines = faqSection(body);
  if (!lines) return [];

  const entries = [];
  let question = null;
  let answer = [];

  const flush = () => {
    const text = toPlainText(answer.join(" "));
    if (question && text.length >= 20) entries.push({ question, answer: text });
    question = null;
    answer = [];
  };

  // `slice(1)` skips the section heading itself.
  for (const line of lines.slice(1)) {
    const next = asQuestion(line);
    if (next) {
      flush();
      question = next.question;
      if (next.inlineAnswer) answer.push(next.inlineAnswer);
      continue;
    }
    if (question && line.trim()) answer.push(line.trim());
  }
  flush();

  return entries;
}
