/**
 * The content model. This file is the mechanism that stops the old mess
 * re-accumulating, so it is deliberately strict: it is easier to argue a post
 * into KILL or MERGE than to argue this schema looser.
 *
 * Two rules do the real work:
 *
 *   - `targetQuery` must be unique across the corpus. Cannibalisation is the
 *     thing that produced 131 URLs for ~15 topics; uniqueness makes repeating
 *     it a build failure rather than an editorial oversight. Enforced in
 *     `validateCorpus`, not here, because it is a property of the set.
 *   - `citations` and `statsCount` cannot be inferred from a legacy export.
 *     A post that cannot supply them is telling you it belongs in KILL or
 *     MERGE.
 */
import { z } from "zod";

export const CATEGORIES = ["company", "data", "product", "engineering"] as const;
export const INTENTS = ["informational", "commercial", "transactional", "navigational"] as const;
export const AUDIENCES = ["ops-business", "data-team", "both"] as const;
export const FUNNELS = ["tofu", "mofu", "bofu"] as const;

/** Contraction fragments left behind when an apostrophe is hyphenated away. */
const MANGLED_CONTRACTIONS = new Set(["t", "s", "re", "ll", "ve", "d", "m"]);

export interface SlugProblem {
  rule: string;
  detail: string;
}

/**
 * Every slug rule in one place, returning all violations rather than the first
 * so a rename only has to be thought about once.
 */
export function slugProblems(slug: string): SlugProblem[] {
  const problems: SlugProblem[] = [];

  if (!/^[a-z0-9-]+$/.test(slug)) {
    problems.push({
      rule: "charset",
      detail: "only lowercase letters, digits and hyphens are allowed",
    });
  }
  if (/[()]/.test(slug)) {
    problems.push({ rule: "no-parentheses", detail: "contains a parenthesis" });
  }
  if (slug.length >= 60) {
    problems.push({ rule: "length", detail: `${slug.length} chars, must be under 60` });
  }
  if (/(^-|-$|--)/.test(slug)) {
    problems.push({ rule: "hyphens", detail: "leading, trailing or doubled hyphen" });
  }
  if (/(?:^|-)(?:19|20)\d{2}(?:-|$)/.test(slug)) {
    problems.push({
      rule: "no-years",
      detail: "contains a year — years belong in the title, never the slug",
    });
  }

  const tokens = slug.split("-");
  const mangled = tokens.filter((t) => MANGLED_CONTRACTIONS.has(t));
  if (mangled.length) {
    problems.push({
      rule: "no-mangled-apostrophes",
      detail: `contraction fragment(s) [${mangled.join(", ")}] — write "cant", not "can-t"`,
    });
  }
  if (/^\d+$/.test(tokens[tokens.length - 1]) && tokens.length <= 3) {
    problems.push({
      rule: "meaningful",
      detail: "ends in a bare number with no descriptive tokens (e.g. supaboard-ai-3)",
    });
  }
  return problems;
}

const slugField = z.string().superRefine((val, ctx) => {
  for (const p of slugProblems(val)) {
    ctx.addIssue({ code: "custom", message: `slug ${p.rule}: ${p.detail}` });
  }
});

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "must be an ISO date (YYYY-MM-DD)")
  .refine((d) => !Number.isNaN(Date.parse(d)), "not a real date");

const countWords = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

export const authorSchema = z.object({
  name: z.string().min(2),
  title: z.string().min(2, "a real job title — the byline has to belong to a real person"),
  url: z.string().url().optional(),
  /** Rendered in the byline pill; not part of the editorial contract. */
  avatar: z.string().url().optional(),
});

export const citationSchema = z.object({
  claim: z.string().min(10, "state the claim the source backs, not just a label"),
  source: z.string().min(2, "the publication or organisation"),
  url: z.string().url(),
});

export const faqSchema = z
  .object({
    q: z.string().min(10),
    a: z.string(),
  })
  .superRefine((val, ctx) => {
    const w = countWords(val.a);
    if (w < 40 || w > 80) {
      ctx.addIssue({
        code: "custom",
        path: ["a"],
        message: `answer is ${w} words, must be 40–80 (the extraction unit models quote)`,
      });
    }
  });

export const frontmatterSchema = z
  .object({
    title: z.string().min(10).max(65, "titles must be 65 characters or fewer"),
    slug: slugField,
    category: z.enum(CATEGORIES),
    pillar: z.string().min(2).optional(),
    cluster: z.string().min(2).optional(),
    targetQuery: z.string().min(3, "the one query this post owns"),
    intent: z.enum(INTENTS),
    audience: z.enum(AUDIENCES),
    funnel: z.enum(FUNNELS),
    author: authorSchema,
    publishedAt: isoDate,
    updatedAt: isoDate,
    description: z
      .string()
      .min(140, "meta descriptions must be 140–160 characters")
      .max(160, "meta descriptions must be 140–160 characters"),
    tldr: z
      .array(z.string())
      .min(3, "3–5 bullets")
      .max(5, "3–5 bullets"),
    faq: z.array(faqSchema).min(6, "6–10 questions").max(10, "6–10 questions").optional(),
    internalLinks: z.array(z.string()).min(3, "at least 3 internal links"),
    caseStudies: z.array(z.string()).optional(),
    absorbed: z.array(z.string()).optional(),
    citations: z.array(citationSchema).min(3, "at least 3 external credible citations"),
    statsCount: z.number().int().min(4, "at least 4 verifiable statistics"),

    // --- Rendering fields the site already depends on -------------------
    status: z.enum(["published", "draft", "scheduled"]),
    readMinutes: z.number().int().positive(),
    readLabel: z.string().optional(),
    cover: z.object({
      url: z.string().url(),
      alt: z.string().min(5, "cover images need real alt text"),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
    }),
    ogImage: z.string().url(),
    tags: z.array(z.string()).optional(),
    sections: z.array(z.object({ id: z.string(), heading: z.string() })).optional(),
    related: z.array(z.string()).optional(),
    featured: z
      .object({
        choice: z.number().int().positive().nullable(),
        trending: z.number().int().positive().nullable(),
      })
      .optional(),
    source: z.object({ url: z.string().url(), migratedAt: z.string() }).optional(),
  })
  .superRefine((val, ctx) => {
    // A commercial post with no case study is the cheapest conversion fix on
    // the site left undone.
    if (val.intent === "commercial" && !val.caseStudies?.length) {
      ctx.addIssue({
        code: "custom",
        path: ["caseStudies"],
        message: "commercial-intent posts must cite at least one case study",
      });
    }
    if (Date.parse(val.updatedAt) < Date.parse(val.publishedAt)) {
      ctx.addIssue({
        code: "custom",
        path: ["updatedAt"],
        message: "updatedAt is before publishedAt",
      });
    }
    // Every statistic needs a source. Sources can be shared, so this is a
    // floor rather than an equality.
    if (val.statsCount > 0 && val.citations.length < 3) {
      ctx.addIssue({
        code: "custom",
        path: ["citations"],
        message: "statistics present but fewer than 3 citations to support them",
      });
    }
    val.tldr.forEach((t, i) => {
      if (countWords(t) < 8) {
        ctx.addIssue({
          code: "custom",
          path: ["tldr", i],
          message: "each TL;DR bullet must be a complete extractable statement",
        });
      }
    });
  });

export type Frontmatter = z.infer<typeof frontmatterSchema>;

export interface CorpusIssue {
  slug: string;
  path: string;
  message: string;
}

/**
 * Set-level rules. `targetQuery` uniqueness cannot be expressed per-document,
 * and it is the single most important constraint here: it is what makes the
 * cannibalisation structurally impossible to repeat.
 */
export function validateCorpus(
  docs: { slug: string; data: unknown }[],
): { issues: CorpusIssue[]; valid: { slug: string; data: Frontmatter }[] } {
  const issues: CorpusIssue[] = [];
  const valid: { slug: string; data: Frontmatter }[] = [];

  for (const doc of docs) {
    const parsed = frontmatterSchema.safeParse(doc.data);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        issues.push({
          slug: doc.slug,
          path: issue.path.join(".") || "(root)",
          message: issue.message,
        });
      }
      continue;
    }
    valid.push({ slug: doc.slug, data: parsed.data });
  }

  const byQuery = new Map<string, string[]>();
  for (const { slug, data } of valid) {
    const key = data.targetQuery.trim().toLowerCase();
    if (!byQuery.has(key)) byQuery.set(key, []);
    byQuery.get(key)!.push(slug);
  }
  for (const [query, slugs] of byQuery) {
    if (slugs.length > 1) {
      for (const slug of slugs) {
        issues.push({
          slug,
          path: "targetQuery",
          message: `duplicate targetQuery "${query}" — also claimed by ${slugs
            .filter((s) => s !== slug)
            .join(", ")}`,
        });
      }
    }
  }

  // Filename/slug agreement — the README's "URLs are the contract" rule.
  for (const { slug, data } of valid) {
    if (data.slug !== slug) {
      issues.push({
        slug,
        path: "slug",
        message: `frontmatter slug "${data.slug}" does not match filename "${slug}"`,
      });
    }
  }

  // Internal links must resolve to a post that exists.
  const present = new Set(valid.map((v) => v.slug));
  for (const { slug, data } of valid) {
    for (const target of data.internalLinks) {
      if (!present.has(target)) {
        issues.push({
          slug,
          path: "internalLinks",
          message: `internal link "${target}" resolves to no post`,
        });
      }
    }
  }

  return { issues, valid };
}
