/**
 * Render every post's cover and OG card on the 2026 hairline-grid design
 * system, instead of mirroring the old Framer illustrations.
 *
 *   node tools/covers.mjs --compare          sample every design side by side
 *   node tools/covers.mjs --design field     render all 47 in one design
 *   node tools/covers.mjs --only dbt         one post, for iterating
 *   node tools/covers.mjs --apply            upload to Spaces, rewrite posts
 *
 * Without `--apply` nothing leaves the machine and no Spaces credentials are
 * needed, so the whole set can be eyeballed before it goes anywhere.
 *
 * ── Why everything is centred ────────────────────────────────────────────
 * The landing site renders one cover into five boxes, all `object-cover`:
 *
 *   post page      760×420   1.81      featured card  432×243   1.78
 *   hover preview  300×169   1.78      grid, desktop  222×157   1.41
 *   grid, mobile   279×125   2.23
 *
 * Three of the five are 16:9, so that is the right source ratio — but no
 * single ratio survives 1.41 → 2.23 uncropped. A cover therefore has to be
 * built crop-safe: the narrowest box trims SAFE_X off each side, the widest
 * trims SAFE_Y off top and bottom, so every element that carries meaning
 * lives inside that inset and only decoration is ever cut.
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

import matter from "gray-matter";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const POSTS = new URL("../posts/", import.meta.url);
const OUT = new URL("../.covers/", import.meta.url);
const FONTS = new URL("../assets/fonts/", import.meta.url);

const COVER = { width: 1600, height: 900 };
const OG = { width: 1200, height: 630 };

const flag = (name) => process.argv.includes(`--${name}`);
const value = (name) => {
  const at = process.argv.indexOf(`--${name}`);
  return at === -1 ? null : process.argv[at + 1];
};

const apply = flag("apply");
const compare = flag("compare");
const only = value("only");

/* ── Tokens ──────────────────────────────────────────────────────────────
 * Transcribed from supaboard-landing/src/app/globals.css `@theme`. Kept as
 * literals rather than imported: this repo has no build step and no
 * dependency on the landing repo being checked out next door.
 */
const PAGE = "#fcfcfc";
const HAIR = "#e4e4e4";
const INK = "#1f2023";

/** Headline clamp. Anything longer fails the run instead of being truncated. */
const TITLE_LINES = 3;

/** Crop-safe inset, as a share of the canvas. See the header note. */
const SAFE_X = 0.108; // 1.41 crop keeps the middle 79% of the width
const SAFE_Y = 0.105; // 2.23 crop keeps the middle 80% of the height

/** The design system's categorical accent rotation, one per blog category. */
const ACCENT = {
  data: "#414dcf", // indigo
  engineering: "#dca04d", // gold
  product: "#11976d", // green
  company: "#c10e65", // magenta
};

/** Accent at `alpha` composited over `over` — satori has no blend modes. */
function tint(hex, alpha, over = PAGE) {
  const n = parseInt(hex.slice(1), 16);
  const bg = parseInt(over.slice(1), 16);
  const mix = (shift) => {
    const fg = (n >> shift) & 0xff;
    const back = (bg >> shift) & 0xff;
    return Math.round(fg * alpha + back * (1 - alpha));
  };
  return `rgb(${mix(16)}, ${mix(8)}, ${mix(0)})`;
}

/* ── Seeded randomness ───────────────────────────────────────────────────
 * xorshift32 off a sha256 of the slug, so a post's pixel board is stable
 * across runs. That matters more than it looks: the Spaces key is a hash of
 * the rendered bytes, so a wobbly PRNG would mint a fresh URL every run.
 */
function rng(slug) {
  let state = parseInt(createHash("sha256").update(slug).digest("hex").slice(0, 8), 16) || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) % 1000) / 1000;
  };
}

/* ── Motifs ──────────────────────────────────────────────────────────────
 * satori supports a subset of CSS — flexbox, borders, backgrounds, inline
 * SVG — so every motif is built from absolutely-positioned divs, which is
 * also how the real components do it.
 */
const box = (style, children) => ({ type: "div", props: { style, children } });

/**
 * A full-bleed field of squares. `weight(u, v)` takes normalised coordinates
 * (0–1 across the field) and returns fill strength: below 0.3 the cell stays
 * empty, above 0.72 it goes solid accent, between the two it takes a tint.
 * Every design supplies its own weight function, which is what makes the
 * board read as a deliberate motif rather than as scatter.
 */
function pixelField({ width, height, cell, gap, accent, next, weight, over = PAGE }) {
  const step = cell + gap;
  const cols = Math.ceil(width / step);
  const rows = Math.ceil(height / step);
  const squares = [];

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      // Jitter keeps the falloff from reading as a clean geometric edge.
      const w = weight(x / (cols - 1), y / (rows - 1)) * (0.72 + next() * 0.56);
      if (w < 0.3) continue;
      squares.push(
        box({
          position: "absolute",
          left: x * step,
          top: y * step,
          width: cell,
          height: cell,
          backgroundColor: w > 0.72 ? accent : tint(accent, 0.26, over),
        }),
      );
    }
  }

  return box({ position: "absolute", left: 0, top: 0, width, height, display: "flex" }, squares);
}

/** Faint dot texture — the `bg-dot-faint` rails and `DOT_BAND` spacer. */
function dots({ width, height, dot, gap, color = "#e2e2e2" }) {
  const cells = [];
  for (let r = 0; r < Math.ceil(height / gap); r += 1) {
    for (let c = 0; c < Math.ceil(width / gap); c += 1) {
      cells.push(
        box({
          position: "absolute",
          left: c * gap,
          top: r * gap,
          width: dot,
          height: dot,
          borderRadius: dot,
          backgroundColor: color,
        }),
      );
    }
  }
  return box({ position: "absolute", left: 0, top: 0, width, height, display: "flex" }, cells);
}

/**
 * The brand mark — four interlocking squares on a diagonal. Paths lifted
 * verbatim from `supaboard-landing/src/components/ui/logo.tsx`, with
 * `currentColor` resolved to a literal since satori has no cascade.
 */
const LOGO_PATHS = [
  "M7.87847 16.2546L7.66284 16.9419C7.63731 17.0233 7.62433 17.108 7.62433 17.1933V17.5412L7.62433 18.4942V20.4003L7.62433 23.2713C7.62433 23.7911 7.20296 24.2125 6.68317 24.2125H3.81216H0.941157C0.42137 24.2125 -9.39957e-08 23.7911 -9.39957e-08 23.2713L-9.39957e-08 17.5293C-9.39957e-08 17.0095 0.42137 16.5881 0.941157 16.5881H3.81216H5.71825H6.67129H7.01998C7.10421 16.5881 7.18747 16.57 7.2641 16.5351L7.87847 16.2546Z",
  "M16.0478 7.92731L15.8322 8.61466C15.8066 8.69601 15.7936 8.78077 15.7936 8.86603V9.21392V10.167L15.7936 12.073V15.3462C15.7936 15.3933 15.8068 15.4394 15.8317 15.4793L16.133 15.9637L15.3171 15.8852H11.9815L8.66606 15.8852C8.62641 15.8852 8.58732 15.8946 8.55198 15.9125L7.87847 16.2546L8.15131 15.5724C8.1632 15.5426 8.16932 15.5108 8.16932 15.4788L8.16932 9.20203C8.16932 8.68225 8.59069 8.26088 9.11047 8.26088H11.9815L13.8876 8.26088H14.8406H15.1893C15.2735 8.26088 15.3568 8.24277 15.4334 8.20779L16.0478 7.92731Z",
  "M16.0239 7.95799L16.2396 7.27065C16.2651 7.1893 16.2781 7.10453 16.2781 7.01927V6.67139V5.71835V3.81226L16.2781 0.941256C16.2781 0.42147 16.6994 9.91731e-05 17.2192 9.91731e-05L20.0902 9.91731e-05L22.9612 9.91731e-05C23.481 9.91731e-05 23.9024 0.421469 23.9024 0.941256V6.68327C23.9024 7.20306 23.481 7.62443 22.9612 7.62443L20.0902 7.62443H18.1842L17.2311 7.62443H16.8824C16.7982 7.62443 16.7149 7.64253 16.6383 7.67752L16.0239 7.95799Z",
  "M16.133 15.9637L16.3487 16.651C16.3742 16.7324 16.3872 16.8171 16.3872 16.9024V17.2503V18.2033V20.1094L16.3872 22.9804C16.3872 23.5002 16.8085 23.9216 17.3283 23.9216H20.1993H23.0703C23.5901 23.9216 24.0115 23.5002 24.0115 22.9804V17.2384C24.0115 16.7186 23.5901 16.2972 23.0703 16.2972H20.1993H18.2932H17.3402H16.9915C16.9073 16.2972 16.824 16.2791 16.7474 16.2442L16.133 15.9637Z",
];

/** Mark plus wordmark, the site header lockup. */
function logo({ size, color }) {
  return box({ display: "flex", alignItems: "center" }, [
    {
      type: "svg",
      props: {
        width: size,
        height: size,
        viewBox: "0 0 24.0239 24.2182",
        fill: color,
        children: LOGO_PATHS.map((d) => ({ type: "path", props: { d } })),
      },
    },
    box(
      {
        marginLeft: size * 0.38,
        fontSize: size * 0.82,
        fontWeight: 500,
        letterSpacing: size * 0.82 * -0.03,
        color,
      },
      "Supaboard",
    ),
  ]);
}

/** Numbered mono uppercase label — the redesign's kicker, replacing eyebrows. */
function kicker({ text, size, color }) {
  return box(
    {
      display: "flex",
      fontFamily: "Geist Mono",
      fontSize: size,
      letterSpacing: size * 0.04,
      textTransform: "uppercase",
      color,
    },
    text,
  );
}

/** Headline. `display: block` — satori ignores `lineClamp` on flex text. */
function headline({ text, size, color, align = "left", width }) {
  return box(
    {
      display: "block",
      width,
      textAlign: align,
      fontSize: size,
      fontWeight: 500,
      lineHeight: 1.08,
      letterSpacing: size * -0.028,
      color,
      lineClamp: TITLE_LINES,
    },
    text,
  );
}

/* ── Designs ─────────────────────────────────────────────────────────────
 * Each declares `titleWidth`/`titleSize` so the overflow check measures the
 * same box the design actually renders, and a `build` that returns the card.
 */
const DESIGNS = {
  /**
   * Editorial — everything stacked on the vertical axis inside the safe box,
   * over a pixel field that thickens toward the edges. The crop eats only the
   * outer decoration, and the centre stays clean at every ratio.
   */
  editorial: {
    label: "Editorial — centred stack, pixel vignette",
    titleWidth: (w) => Math.round(w * 0.66),
    titleSize: (w) => Math.round(w * 0.0385),
    build({ title, accent, ordinal, category, next, width, height }) {
      const s = width / COVER.width;
      return box(
        {
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width,
          height,
          backgroundColor: PAGE,
          border: `1px solid ${HAIR}`,
          fontFamily: "Geist",
        },
        [
          pixelField({
            width,
            height,
            cell: Math.round(30 * s),
            gap: Math.round(10 * s),
            accent,
            next,
            // Clear in the middle, thickening outward — a pixel vignette.
            weight: (u, v) => {
              const d = Math.hypot((u - 0.5) * 2, (v - 0.5) * 2);
              return Math.min(0.66, Math.max(0, (d - 0.82) * 1.15));
            },
          }),
          box(
            {
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: Math.round(width * (1 - SAFE_X * 2)),
            },
            [
              kicker({ text: `${ordinal}. ${category}`, size: Math.round(21 * s), color: accent }),
              box({ display: "flex", height: Math.round(34 * s) }),
              headline({
                text: title,
                size: DESIGNS.editorial.titleSize(width),
                color: INK,
                align: "center",
                width: DESIGNS.editorial.titleWidth(width),
              }),
              box({ display: "flex", height: Math.round(38 * s) }),
              box({ display: "flex", width: Math.round(56 * s), height: 2, backgroundColor: accent }),
              box({ display: "flex", height: Math.round(38 * s) }),
              logo({ size: Math.round(28 * s), color: INK }),
            ],
          ),
        ],
      );
    },
  },

  /**
   * Field — the pixel board becomes the whole ground and a hairline plate
   * floats on top of it, which is the site's core "box on the page" move.
   * Densest of the three, and the plate keeps the type legible at any crop.
   */
  field: {
    label: "Field — pixel ground, hairline plate",
    titleWidth: (w) => Math.round(w * 0.6),
    titleSize: (w) => Math.round(w * 0.0355),
    build({ title, accent, ordinal, category, next, width, height }) {
      const s = width / COVER.width;
      const plateW = Math.round(width * (1 - SAFE_X * 2));
      const plateH = Math.round(height * 0.64);
      return box(
        {
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width,
          height,
          backgroundColor: PAGE,
          border: `1px solid ${HAIR}`,
          fontFamily: "Geist",
        },
        [
          pixelField({
            width,
            height,
            cell: Math.round(22 * s),
            gap: Math.round(8 * s),
            accent,
            next,
            // Even field, thinning slightly at the very edges so the crop
            // never slices a hard boundary.
            weight: (u, v) => {
              // Low base, so jitter drops most cells and the field reads as
              // texture rather than as a lattice.
              const edge = Math.min(u, 1 - u, v, 1 - v);
              return 0.34 - Math.min(edge, 0.22) * 0.5;
            },
          }),
          box(
            {
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: Math.round(40 * s),
              width: plateW,
              height: plateH,
              padding: Math.round(56 * s),
              backgroundColor: PAGE,
              border: `1px solid ${HAIR}`,
            },
            [
              kicker({ text: `${ordinal}. ${category}`, size: Math.round(20 * s), color: accent }),
              headline({
                text: title,
                size: DESIGNS.field.titleSize(width),
                color: INK,
                width: DESIGNS.field.titleWidth(width),
              }),
              logo({ size: Math.round(26 * s), color: INK }),
            ],
          ),
        ],
      );
    },
  },

  /**
   * Panel — a solid accent block with the headline reversed out of it, on a
   * dotted page. The boldest of the three and by far the most legible at the
   * 222px grid-card size, where the other two rely on fine hairlines.
   */
  panel: {
    label: "Panel — accent block, reversed type",
    titleWidth: (w) => Math.round(w * 0.62),
    titleSize: (w) => Math.round(w * 0.0365),
    build({ title, accent, ordinal, category, next, width, height }) {
      const s = width / COVER.width;
      const panelW = Math.round(width * (1 - SAFE_X * 2));
      const panelH = Math.round(height * 0.64);
      return box(
        {
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width,
          height,
          backgroundColor: PAGE,
          border: `1px solid ${HAIR}`,
          fontFamily: "Geist",
        },
        [
          dots({ width, height, dot: Math.max(2, Math.round(3 * s)), gap: Math.round(16 * s) }),
          // A few accent squares breaking out of the panel's top-left, so the
          // block reads as part of the board rather than as a plain rectangle.
          pixelField({
            width,
            height,
            cell: Math.round(28 * s),
            gap: Math.round(10 * s),
            accent,
            next,
            weight: (u, v) => {
              const inPanel = u > SAFE_X && u < 1 - SAFE_X && v > 0.18 && v < 0.82;
              if (inPanel) return 0;
              const d = Math.hypot((u - 0.5) * 2, (v - 0.5) * 2);
              return Math.min(0.6, Math.max(0, (d - 0.72) * 1.25));
            },
          }),
          box(
            {
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: Math.round(40 * s),
              width: panelW,
              height: panelH,
              padding: Math.round(60 * s),
              backgroundColor: accent,
            },
            [
              kicker({
                text: `${ordinal}. ${category}`,
                size: Math.round(20 * s),
                color: "rgba(255,255,255,0.72)",
              }),
              headline({
                text: title,
                size: DESIGNS.panel.titleSize(width),
                color: "#ffffff",
                width: DESIGNS.panel.titleWidth(width),
              }),
              logo({ size: Math.round(26 * s), color: "#ffffff" }),
            ],
          ),
        ],
      );
    },
  },
};

const design = value("design") ?? "editorial";
if (!DESIGNS[design]) {
  console.error(`Unknown design "${design}". Options: ${Object.keys(DESIGNS).join(", ")}`);
  process.exit(1);
}

/* ── Render ──────────────────────────────────────────────────────────────── */

/** Paths, for Resvg — it loads fonts from disk rather than from buffers. */
const FONT_FILES = ["Geist-Regular.ttf", "Geist-Medium.ttf", "GeistMono-Regular.ttf"].map(
  (f) => new URL(f, FONTS).pathname,
);

const fonts = [
  { name: "Geist", data: readFileSync(new URL("Geist-Regular.ttf", FONTS)), weight: 400, style: "normal" },
  { name: "Geist", data: readFileSync(new URL("Geist-Medium.ttf", FONTS)), weight: 500, style: "normal" },
  { name: "Geist Mono", data: readFileSync(new URL("GeistMono-Regular.ttf", FONTS)), weight: 400, style: "normal" },
];

/**
 * How many lines the title wraps to in a given design at a given width.
 *
 * The clamp stops a runaway title from wrecking the layout, but a truncated
 * headline is still a broken cover, so the caller asserts on this and fails
 * the run. Titles are content and keep changing — this is the failure mode
 * worth catching automatically.
 *
 * Lays the title out alone with `embedFont` off so satori emits real `<text>`
 * nodes; each line shares a `y`, so distinct `y` values are the line count. A
 * normal render flattens every glyph to a path, where that count is lost.
 */
async function titleLineCount({ title, which, width }) {
  const d = DESIGNS[which];
  const svg = await satori(
    box(
      {
        display: "block",
        width: d.titleWidth(width),
        fontFamily: "Geist",
        fontSize: d.titleSize(width),
        fontWeight: 500,
        lineHeight: 1.08,
        letterSpacing: d.titleSize(width) * -0.028,
      },
      title,
    ),
    { width, height: 900, fonts, embedFont: false },
  );
  return new Set([...svg.matchAll(/<text [^>]*\sy="([\d.]+)"/g)].map((m) => m[1])).size;
}

async function render({ which, size, ...spec }) {
  const tree = DESIGNS[which].build({ ...spec, ...size });
  const svg = await satori(tree, { ...size, fonts });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: size.width } }).render().asPng();

  // Cheap guard against a silently blank or malformed render.
  if (png.length < 2000) throw new Error(`suspiciously small PNG (${png.length}b)`);
  const w = png.readUInt32BE(16);
  const h = png.readUInt32BE(20);
  if (w !== size.width || h !== size.height) {
    throw new Error(`expected ${size.width}x${size.height}, got ${w}x${h}`);
  }
  return png;
}

/* ── Posts ───────────────────────────────────────────────────────────────── */

const posts = readdirSync(POSTS)
  .filter((f) => f.endsWith(".md"))
  .map((file) => {
    const path = new URL(file, POSTS);
    const parsed = matter(readFileSync(path, "utf8"));
    return { file, path, parsed, slug: parsed.data.slug ?? basename(file, ".md") };
  });

/**
 * The kicker's number: the post's position within its category, oldest first.
 * Deterministic for a fixed corpus, and new posts append rather than reshuffle
 * everything that came before.
 */
const ordinals = new Map();
for (const category of new Set(posts.map((p) => p.parsed.data.category))) {
  posts
    .filter((p) => p.parsed.data.category === category)
    .sort((a, b) => String(a.parsed.data.publishedAt).localeCompare(String(b.parsed.data.publishedAt)))
    .forEach((p, i) => ordinals.set(p.slug, String(i + 1).padStart(2, "0")));
}

/** Every field a design needs, minus the canvas size. */
const specFor = (post, which) => ({
  which,
  title: post.parsed.data.title,
  category: post.parsed.data.category,
  accent: ACCENT[post.parsed.data.category] ?? ACCENT.data,
  ordinal: ordinals.get(post.slug),
  // A fresh generator per render: the same slug must always draw the same board.
  next: rng(post.slug),
});

mkdirSync(OUT, { recursive: true });

/* ── Compare mode ────────────────────────────────────────────────────────── */

if (compare) {
  // One post per category, so every accent shows up in the comparison.
  const samples = [...new Set(posts.map((p) => p.parsed.data.category))]
    .map((c) => posts.find((p) => p.parsed.data.category === c))
    .filter(Boolean);

  const cells = [];
  for (const which of Object.keys(DESIGNS)) {
    for (const post of samples) {
      const png = await render({ ...specFor(post, which), size: COVER });
      const name = `compare-${which}-${post.slug}.png`;
      writeFileSync(new URL(name, OUT), png);
      cells.push({ which, name, post });
    }
    console.log(`  ${which}: ${samples.length} samples`);
  }

  // A single reviewable PNG per design: the full cover, then the same file
  // through the two boxes that actually crop it. `xMidYMid slice` is exactly
  // what `object-cover` does, so these are true previews, not approximations.
  for (const which of Object.keys(DESIGNS)) {
    const shots = cells.filter((c) => c.which === which);
    const hero = readFileSync(new URL(shots[0].name, OUT)).toString("base64");
    const others = shots.slice(1).map((c) => readFileSync(new URL(c.name, OUT)).toString("base64"));

    const img = (b64, x, y, w, h) =>
      `<image href="data:image/png;base64,${b64}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/>
       <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${HAIR}"/>`;
    const label = (t, x, y) =>
      `<text x="${x}" y="${y}" font-family="Geist Mono" font-size="20" fill="#8b93a7">${t}</text>`;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="1320" viewBox="0 0 1440 1320">
      <rect width="1440" height="1320" fill="${PAGE}"/>
      <text x="80" y="66" font-family="Geist" font-size="30" fill="${INK}">${DESIGNS[which].label}</text>
      ${img(hero, 80, 100, 1280, 720)}
      ${label("GRID CARD 222×157", 80, 880)}
      ${img(hero, 80, 900, 444, 314)}
      ${label("MOBILE CARD 279×125", 560, 880)}
      ${img(hero, 560, 900, 558, 250)}
      ${label("OTHER ACCENTS", 1150, 880)}
      ${others.map((b, i) => img(b, 1150, 900 + i * 112, 190, 107)).join("\n")}
    </svg>`;

    const png = new Resvg(svg, {
      font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: "Geist" },
    })
      .render()
      .asPng();
    writeFileSync(new URL(`design-${which}.png`, OUT), png);
  }

  const groups = Object.entries(DESIGNS)
    .map(
      ([key, d]) => `<section>
    <h2>${d.label}</h2>
    <div class="row">${cells
      .filter((c) => c.which === key)
      .map(
        (c) => `<figure>
        <img class="full" src="${c.name}" alt="">
        <div class="crops">
          <span class="crop grid" style="background-image:url(${c.name})"></span>
          <span class="crop mob" style="background-image:url(${c.name})"></span>
        </div>
        <figcaption>${c.post.parsed.data.category}</figcaption>
      </figure>`,
      )
      .join("")}</div>
  </section>`,
    )
    .join("\n  ");

  writeFileSync(
    new URL("compare.html", OUT),
    `<!doctype html><meta charset="utf-8"><title>Cover designs</title>
<style>
  body{background:#fcfcfc;font:14px system-ui;margin:40px;color:#1f2023}
  h1,h2{font-weight:500;letter-spacing:-0.028em}
  h2{margin:48px 0 12px;font-size:20px}
  .row{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
  .full{width:100%;border:1px solid #e4e4e4}
  .crops{display:flex;gap:8px;margin-top:8px}
  /* The two boxes that actually crop: grid card 222x157, mobile 279x125. */
  .crop{display:block;background-size:cover;background-position:center;border:1px solid #e4e4e4}
  .grid{width:222px;height:157px}
  .mob{width:279px;height:125px}
  figcaption{color:#8b93a7;margin-top:6px}
</style>
<h1>Cover designs — full render, then the two cropping boxes</h1>
  ${groups}
`,
  );

  console.log(`\nCompare sheet → ${OUT.pathname}compare.html`);
  process.exit(0);
}

/* ── Full run ────────────────────────────────────────────────────────────── */

const selected = only ? posts.filter((p) => p.slug === only) : posts;
if (!selected.length) {
  console.error(only ? `No post with slug "${only}".` : "No posts found.");
  process.exit(1);
}

let uploadOnce;
let storagePrefix;
if (apply) {
  // Imported lazily: tools/env.mjs throws at import time without credentials,
  // and a render-only run must work on a machine that has none.
  ({ uploadOnce } = await import("./spaces.mjs"));
  ({ storagePrefix } = await import("./convert.mjs"));
}

const sheet = [];
const failures = [];

for (const post of selected) {
  const { data } = post.parsed;

  try {
    for (const { width } of [COVER, OG]) {
      const used = await titleLineCount({ title: data.title, which: design, width });
      if (used > TITLE_LINES) {
        throw new Error(`title wraps to ${used} lines at ${width}px, clamp is ${TITLE_LINES}`);
      }
    }

    const cover = await render({ ...specFor(post, design), size: COVER });
    const og = await render({ ...specFor(post, design), size: OG });

    writeFileSync(new URL(`${post.slug}.png`, OUT), cover);
    writeFileSync(new URL(`${post.slug}.og.png`, OUT), og);
    sheet.push({ slug: post.slug, category: data.category });

    if (apply) {
      const up = await uploadOnce(storagePrefix("blog", post.slug), cover, {
        ext: ".png",
        contentType: "image/png",
      });
      const upOg = await uploadOnce("blog/og", og, { ext: ".png", contentType: "image/png" });

      data.cover = {
        url: up.url,
        // The old alt described the Framer illustration and is now false. The
        // title is rendered in the image, so quoting it is accurate.
        alt: `"${data.title}" — Supaboard blog cover`,
        width: COVER.width,
        height: COVER.height,
      };
      data.ogImage = upOg.url;
      writeFileSync(post.path, matter.stringify(post.parsed.content, data));
      console.log(`  ${up.skipped ? "cached" : "upload"} ${post.slug}`);
    } else {
      console.log(`  render ${post.slug}`);
    }
  } catch (error) {
    failures.push(`${post.slug}: ${error.message}`);
    console.error(`  FAIL   ${post.slug}: ${error.message}`);
  }
}

// Contact sheet — every cover plus the two boxes that crop it.
writeFileSync(
  new URL("index.html", OUT),
  `<!doctype html><meta charset="utf-8"><title>Blog covers</title>
<style>
  body{background:#fcfcfc;font:14px system-ui;margin:40px;color:#1f2023}
  h1{font-weight:500;letter-spacing:-0.028em}
  .row{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
  img{width:100%;border:1px solid #e4e4e4}
  .crops{display:flex;gap:8px;margin-top:8px}
  .crop{display:block;background-size:cover;background-position:center;border:1px solid #e4e4e4}
  .grid{width:222px;height:157px}
  .mob{width:279px;height:125px}
  figcaption{color:#8b93a7;margin-top:6px}
  figure{margin:0 0 32px}
</style>
<h1>${sheet.length} covers · ${DESIGNS[design].label}</h1>
<div class="row">${sheet
    .map(
      (p) => `<figure>
  <img src="${p.slug}.png" alt="">
  <div class="crops">
    <span class="crop grid" style="background-image:url(${p.slug}.png)"></span>
    <span class="crop mob" style="background-image:url(${p.slug}.png)"></span>
  </div>
  <figcaption>${p.category} · ${p.slug}</figcaption>
</figure>`,
    )
    .join("")}</div>
`,
);

console.log(`\n${sheet.length} rendered → ${OUT.pathname}index.html`);
if (failures.length) {
  console.error(`\n${failures.length} failed:\n${failures.map((f) => `  ${f}`).join("\n")}`);
  process.exit(1);
}
