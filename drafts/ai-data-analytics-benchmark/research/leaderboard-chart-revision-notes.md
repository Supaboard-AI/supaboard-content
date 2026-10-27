# Leaderboard chart revision

User requested two charts in place of the leaderboard table, complete removal of the What changes at 33 points section, and the heading How the scoring works? Applied to website and Substack. Cross-references to the removed section were also removed.

Charts use the same nine published points totals and mean times. Accuracy is points divided by 39 and rounded to one decimal, including partial credit. The scatter plots mean time in seconds on X and accuracy on Y. The bar chart sorts reported accuracy descending, starting its scale at zero. Neither chart constitutes a regrade.

Source dataset: leaderboard-chart-data.json. Editable vector assets and 2x PNG exports are supplied for both versions. All chart label bounds and pairwise text overlaps were checked before export. The source evidence and separate correction proposal were retained for auditability; only the article section was removed.

## Visual redesign
All three charts now share a rounded card, slate typography, teal accent, larger direct labels and consistent spacing. Supaboard is the display name in both articles and chart data. Accuracy remains points / 39, with a zero baseline. Scatter coordinates and all nine timings are unchanged. Question difficulty uses nine equal cells to show the denominator. SVG text bounds and overlaps checked before PNG export.

## Index metric and reference layout
Both leaderboard charts now plot Data Analytics Index (points / 39 × 100 + 10), maximum 110, with zero-based axes. Mean response times are unchanged. Bar chart is vertical, using the supplied screenshot as layout reference; backgrounds remain white per the user's correction. Colors sampled from live supaboard.ai CSS: indigo #414dcf, teal #1d6b69, gold #db9d48, green #1c7a5b, coral #ea5640, muted #8b93a7, mint #6bac96, blue #4088fd, gray #a7acb6. Text #1c1c1e, secondary #5c6370, dividers #e6e9ee. Same tool colors in scatter and bar charts. No invented logos. Removed scatter footer and sample-size subtitle. Captions/alt text updated; Metabase's zero points correspond to index 10.

## Final control cleanup
Removed the 110 tick and gridline from both leaderboard charts without changing their plotted coordinates or the index definition. Removed all chart-opening links and clickable image wrappers from website, Substack and repository post. Mobile previews retain scrolling with a generated swipe hint. Updated hosted chart files were independently hash-verified and the repository change was pushed as ef4f92d.
