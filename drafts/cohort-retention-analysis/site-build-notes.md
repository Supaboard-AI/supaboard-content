# Site integration

The approved draft has been adapted into `posts/cohort-retention-analysis.md` for the Supaboard blog. It is marked `published` for the site loader but has not been committed, pushed, or deployed.

- Preserved the first-person narrative, examples, data table, and four chart designs.
- Added site metadata, author role, section anchors, related articles, and source metadata. The nine detected numeric claims are explicitly illustrative examples and arithmetic, not measured customer outcomes.
- Added one short caption quote from Aritra's source video above the requested embed: “You need to follow the shape of the curve.” The source caption extraction places this at 06:17; no timestamp is shown in the article.
- Uploaded the cover and desktop/mobile chart WebPs through the existing content-addressed Spaces helper. Every uploaded file was independently downloaded and compared byte-for-byte; receipts are in `site-assets/manifest.json`.
- Updated the sibling landing site's Markdown renderer to recognize canonical privacy-enhanced YouTube embed URLs written with image syntax. Arbitrary iframe HTML remains blocked by the existing sanitizer.
- Added mobile art direction using a `mobile=<content-addressed filename>.webp` image query parameter. Mobile assets must remain in the original image folder. Existing posts keep their previous image rendering.

Validation:
- New post: schema passes; no unsourced numeric claims; section metadata matches the six section headings plus introduction.
- Content corpus: 57 existing failures across older posts (47 schema, eight unsourced-statistic, two quotation); none on this post.
- All 18 content guardrail tests pass.
- Three focused landing-site media tests pass.
- Landing-site TypeScript passes with `--allowImportingTsExtensions`, as needed by the existing Node test import conventions. The unmodified default TypeScript command encounters existing test-file import extension errors.
- Local Webpack preview serves the post with HTTP 200. Turbopack preview encountered a local worker-process launch error; no project configuration was changed to bypass it.
- Video iframe URL, title, dimensions, and fallback link verified. Actual YouTube playback has not been tested.

Local preview: http://localhost:4202/blog/cohort-retention-analysis
- Final visual check: all desktop images loaded, all four mobile chart sources selected and decoded, no horizontal overflow at 390px. Screenshots saved in `preview/site-desktop.png`, `preview/site-mobile.png`, and `preview/site-mobile-chart.png`.
