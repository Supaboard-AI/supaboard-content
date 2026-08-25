/**
 * Render the body figures a post's argument actually needs, on the same
 * hairline-grid tokens as tools/covers.mjs.
 *
 *   node tools/figures.mjs                 render every figure into .covers/
 *   node tools/figures.mjs --only bar      one figure, for iterating
 *   node tools/figures.mjs --apply         upload to Spaces and rewrite posts
 *
 * Without `--apply` nothing leaves the machine and no Spaces credentials are
 * needed, so the whole set can be eyeballed first — same contract as covers.
 *
 * Charts are emitted as raw SVG and rasterised by resvg. covers.mjs goes
 * through satori because it lays out prose in flexbox; a plot is absolute
 * coordinates, and satori has no concept of one.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

import matter from "gray-matter";
import { Resvg } from "@resvg/resvg-js";

const POSTS = new URL("../posts/", import.meta.url);
const OUT = new URL("../.covers/", import.meta.url);
const FONTS = new URL("../assets/fonts/", import.meta.url);

const PAGE = "#fcfcfc";
const HAIR = "#e4e4e4";
const INK = "#1f2023";
const MUTE = "#6b6d72";
const INDIGO = "#414dcf"; // data
const GOLD = "#dca04d"; // engineering

const FONT_FILES = ["Geist-Regular.ttf", "Geist-Medium.ttf"].map((f) => new URL(f, FONTS).pathname);

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const text = (s, x, y, { size = 20, fill = INK, weight = 400, anchor = "start" } = {}) =>
  `<text x="${x}" y="${y}" font-family="Geist" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`;

/* ── Data ────────────────────────────────────────────────────────────────── */

/**
 * Deterministic jitter. Math.random would make the content hash — and so the
 * Spaces key and the published URL — change on every run.
 */
function lcg(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

/** n points on y = a + b·x plus noise, in 0..1 space. */
function series(seed, slope, noise, n = 26) {
  const r = lcg(seed);
  return Array.from({ length: n }, (_, i) => {
    const x = (i + 0.5) / n;
    const y = 0.5 + slope * (x - 0.5) + (r() - 0.5) * noise;
    return { x, y: Math.min(0.97, Math.max(0.03, y)) };
  });
}

/** Pearson's r, so the caption reports the panel's real correlation. */
function pearson(pts) {
  const n = pts.length;
  const mx = pts.reduce((a, p) => a + p.x, 0) / n;
  const my = pts.reduce((a, p) => a + p.y, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (const p of pts) {
    sxy += (p.x - mx) * (p.y - my);
    sxx += (p.x - mx) ** 2;
    syy += (p.y - my) ** 2;
  }
  return sxy / Math.sqrt(sxx * syy);
}

/* ── Figures ─────────────────────────────────────────────────────────────── */

/** One scatter panel with its axes, points and a fitted line. */
function panel(x0, y0, w, h, pts, { title, xLabel, yLabel, colour }) {
  const px = (p) => x0 + p.x * w;
  const py = (p) => y0 + h - p.y * h;
  const r = pearson(pts);

  const n = pts.length;
  const mx = pts.reduce((a, p) => a + p.x, 0) / n;
  const my = pts.reduce((a, p) => a + p.y, 0) / n;
  let sxy = 0, sxx = 0;
  for (const p of pts) { sxy += (p.x - mx) * (p.y - my); sxx += (p.x - mx) ** 2; }
  const b = sxy / sxx;
  const fit = (x) => my + b * (x - mx);

  const grid = [0.25, 0.5, 0.75]
    .map((t) => `<line x1="${x0}" y1="${y0 + t * h}" x2="${x0 + w}" y2="${y0 + t * h}" stroke="${HAIR}" stroke-width="1"/>`)
    .join("");

  return `
    ${text(title, x0, y0 - 34, { size: 23, weight: 500 })}
    ${text(`r = ${r.toFixed(2)}`, x0, y0 - 10, { size: 18, fill: MUTE })}
    ${grid}
    <line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 + h}" stroke="${INK}" stroke-width="1.5"/>
    <line x1="${x0}" y1="${y0 + h}" x2="${x0 + w}" y2="${y0 + h}" stroke="${INK}" stroke-width="1.5"/>
    <line x1="${x0}" y1="${y0 + h - fit(0) * h}" x2="${x0 + w}" y2="${y0 + h - fit(1) * h}"
          stroke="${colour}" stroke-width="2.5" stroke-dasharray="7 5" opacity="0.75"/>
    ${pts.map((p) => `<circle cx="${px(p).toFixed(1)}" cy="${py(p).toFixed(1)}" r="5" fill="${colour}" opacity="0.8"/>`).join("")}
    ${text(xLabel, x0 + w / 2, y0 + h + 32, { size: 18, fill: MUTE, anchor: "middle" })}
    <g transform="translate(${x0 - 22},${y0 + h / 2}) rotate(-90)">${text(yLabel, 0, 0, { size: 18, fill: MUTE, anchor: "middle" })}</g>`;
}

function scatterplots() {
  const W = 1600, H = 700, w = 396, h = 360, y0 = 236;
  // seed 7 lands at r = 0.002 — a panel captioned "no correlation" has to
  // actually show none, or the figure teaches the wrong thing.
  const panels = [
    { pts: series(11, 0.72, 0.22), title: "Positive correlation", xLabel: "Ad spend", yLabel: "Revenue", colour: INDIGO },
    { pts: series(23, -0.72, 0.22), title: "Negative correlation", xLabel: "Churn rate", yLabel: "NPS", colour: "#c10e65" },
    { pts: series(7, 0, 0.75), title: "No correlation", xLabel: "Support tickets", yLabel: "Headcount", colour: MUTE },
  ];
  return {
    width: W,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <rect width="${W}" height="${H}" fill="${PAGE}"/>
      ${text("Three shapes of correlation, same axes", 90, 78, { size: 34, weight: 500 })}
      ${text("Direction is what the scatter plot shows first; strength is how tightly the points hug the line.", 90, 114, { size: 20, fill: MUTE })}
      ${panels.map((p, i) => panel(120 + i * (w + 88), y0, w, h, p.pts, p)).join("")}
    </svg>`,
  };
}

function coefficientScale() {
  const W = 1600, H = 400, x0 = 130, w = 1340, y = 210;
  const at = (v) => x0 + ((v + 1) / 2) * w;
  const ticks = [-1, -0.7, -0.3, 0, 0.3, 0.7, 1];
  const bands = [
    [-1, -0.7, "Strong negative", "#c10e65"],
    [-0.7, -0.3, "Moderate negative", "#d8639b"],
    [-0.3, 0.3, "Weak or none", MUTE],
    [0.3, 0.7, "Moderate positive", "#7a83dd"],
    [0.7, 1, "Strong positive", INDIGO],
  ];
  return {
    width: W,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <rect width="${W}" height="${H}" fill="${PAGE}"/>
      ${text("Reading the correlation coefficient", 90, 78, { size: 34, weight: 500 })}
      ${text("The sign is the direction. The distance from zero is the strength.", 90, 112, { size: 20, fill: MUTE })}
      ${bands.map(([a, b, , c]) => `<rect x="${at(a)}" y="${y - 26}" width="${at(b) - at(a)}" height="52" fill="${c}" opacity="0.9"/>`).join("")}
      ${bands.map(([a, b, label]) => text(label, (at(a) + at(b)) / 2, y + 6, { size: 17, fill: "#ffffff", anchor: "middle", weight: 500 })).join("")}
      ${ticks.map((t) => `<line x1="${at(t)}" y1="${y + 26}" x2="${at(t)}" y2="${y + 42}" stroke="${INK}" stroke-width="1.5"/>${text(t.toFixed(1), at(t), y + 72, { size: 19, anchor: "middle" })}`).join("")}
      ${text("Perfect inverse", at(-1), y + 112, { size: 17, fill: MUTE, anchor: "start" })}
      ${text("No relationship", at(0), y + 112, { size: 17, fill: MUTE, anchor: "middle" })}
      ${text("Perfect direct", at(1), y + 112, { size: 17, fill: MUTE, anchor: "end" })}
    </svg>`,
  };
}

/** The same 60 order values, once as a category bar chart and once binned. */
function barVsHistogram() {
  const r = lcg(7);
  const orders = Array.from({ length: 60 }, () => 20 + Math.round((r() + r() + r()) * 40));

  // Round-robin across regions averages the totals out and the bar chart reads
  // flat, which teaches nothing. Weight the split so the comparison has a point.
  const regions = ["North", "South", "East", "West", "Central"];
  const weights = [0.30, 0.24, 0.18, 0.16, 0.12];
  const bounds = weights.reduce((a, w) => [...a, a[a.length - 1] + w], [0]);
  const totals = regions.map((_, i) =>
    orders
      .filter((_, k) => k / orders.length >= bounds[i] && k / orders.length < bounds[i + 1])
      .reduce((a, v) => a + v, 0),
  );

  const bins = [[20, 40], [40, 60], [60, 80], [80, 100], [100, 120], [120, 140]];
  const counts = bins.map(([lo, hi]) => orders.filter((v) => v >= lo && v < hi).length);

  const W = 1600, H = 720, h = 360, y0 = 230;
  const bw = 560;

  const barChart = (x0, values, labels, colour, gap) => {
    const max = Math.max(...values) * 1.15;
    const slot = bw / values.length;
    const width = slot - gap;
    return values
      .map((v, i) => {
        const bh = (v / max) * h;
        const x = x0 + i * slot + gap / 2;
        return `<rect x="${x.toFixed(1)}" y="${(y0 + h - bh).toFixed(1)}" width="${width.toFixed(1)}" height="${bh.toFixed(1)}" fill="${colour}" opacity="0.85"/>
                ${text(labels[i], x + width / 2, y0 + h + 30, { size: 16, fill: MUTE, anchor: "middle" })}`;
      })
      .join("");
  };

  const axes = (x0) =>
    `<line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 + h}" stroke="${INK}" stroke-width="1.5"/>
     <line x1="${x0}" y1="${y0 + h}" x2="${x0 + bw}" y2="${y0 + h}" stroke="${INK}" stroke-width="1.5"/>`;

  return {
    width: W,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <rect width="${W}" height="${H}" fill="${PAGE}"/>
      ${text("One dataset, two charts", 90, 76, { size: 34, weight: 500 })}
      ${text("60 order values. The bar graph compares five named regions; the histogram bins the same values by size.", 90, 110, { size: 20, fill: MUTE })}
      <line x1="800" y1="150" x2="800" y2="${y0 + h + 90}" stroke="${HAIR}" stroke-width="1"/>

      ${text("Bar graph — comparing categories", 130, 178, { size: 23, weight: 500 })}
      ${text("Separate categories, so the bars have gaps", 130, 204, { size: 17, fill: MUTE })}
      ${axes(130)}${barChart(130, totals, regions, INDIGO, 26)}
      ${text("Region", 130 + bw / 2, y0 + h + 62, { size: 18, fill: MUTE, anchor: "middle" })}

      ${text("Histogram — showing distribution", 860, 178, { size: 23, weight: 500 })}
      ${text("A continuous range, so the bars touch", 860, 204, { size: 17, fill: MUTE })}
      ${axes(860)}${barChart(860, counts, bins.map(([lo, hi]) => `${lo}–${hi}`), GOLD, 0)}
      ${text("Order value ($)", 860 + bw / 2, y0 + h + 62, { size: 18, fill: MUTE, anchor: "middle" })}
    </svg>`,
  };
}

/* ── Wiring ──────────────────────────────────────────────────────────────── */

const FIGURES = [
  {
    key: "correlation-scatterplots",
    slug: "positive-vs-negative-correlation",
    build: scatterplots,
    alt: "Scatter plots showing positive, negative and no correlation between two business metrics",
    anchor: "## Positive vs Negative Correlation: Side-by-Side Comparison",
  },
  {
    key: "correlation-coefficient-scale",
    slug: "positive-vs-negative-correlation",
    build: coefficientScale,
    alt: "Correlation coefficient scale from minus one to plus one, banded from strong negative to strong positive",
    anchor: "## Understanding the Correlation Coefficient",
  },
  {
    key: "bar-vs-histogram",
    slug: "bar-graph-vs-histogram",
    build: barVsHistogram,
    alt: "The same dataset shown as a bar graph comparing regions and a histogram showing the distribution of order values",
    anchor: "## Histogram vs Bar Graph: Key Differences",
  },
];

const argv = process.argv.slice(2);
const apply = argv.includes("--apply");
const only = argv[argv.indexOf("--only") + 1];

mkdirSync(OUT, { recursive: true });

const selected = only && only !== "--apply" ? FIGURES.filter((f) => f.key.includes(only)) : FIGURES;
if (!selected.length) {
  console.error(`No figure matches "${only}". Keys: ${FIGURES.map((f) => f.key).join(", ")}`);
  process.exit(1);
}

const rendered = selected.map((fig) => {
  const { svg, width } = fig.build();
  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
    font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: "Geist" },
  })
    .render()
    .asPng();
  writeFileSync(new URL(`${fig.key}.png`, OUT), png);
  console.log(`rendered .covers/${fig.key}.png  ${(png.length / 1024).toFixed(0)}kb`);
  return { fig, png };
});

if (!apply) {
  console.log(`\n${rendered.length} figure(s) rendered locally. Nothing uploaded — re-run with --apply.`);
  process.exit(0);
}

const { uploadOnce } = await import("./spaces.mjs");

for (const { fig, png } of rendered) {
  const { url, skipped } = await uploadOnce(`blog/${fig.slug}`, png, { ext: ".png", contentType: "image/png" });
  const file = new URL(`${fig.slug}.md`, POSTS);
  const raw = readFileSync(file, "utf8");
  const parsed = matter(raw);
  const image = `![${fig.alt}](${url})`;

  if (parsed.content.includes(url)) {
    console.log(`${fig.key}: already in ${fig.slug}.md`);
    continue;
  }
  if (!parsed.content.includes(fig.anchor)) {
    console.error(`${fig.key}: anchor not found in ${fig.slug}.md — place it by hand:\n  ${image}`);
    continue;
  }
  // After the heading, not before it: a figure between the section marker and
  // its own H2 reads as an orphan and pushes the heading below the fold.
  const body = parsed.content.replace(fig.anchor, `${fig.anchor}\n\n${image}`);
  writeFileSync(file, matter.stringify(body, parsed.data));
  console.log(`${fig.key}: ${skipped ? "already in Spaces" : "uploaded"}, placed in ${fig.slug}.md`);
}
