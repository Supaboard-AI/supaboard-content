"""Render using the installed blog renderer, with honest author/publisher/draft metadata.

No checks are disabled. Sources, HTML body hashes, PDFs and preflight checks still
use the installed implementation. The adapter sets publisher metadata and draft labels for unpublished review copies.
"""
import importlib.util
import json
import re
from pathlib import Path

trusted = Path('/Users/ani/.codex/plugins/cache/agricidaniel-blog/claude-blog/2.3.1/scripts/blog_render.py')
spec = importlib.util.spec_from_file_location('installed_blog_renderer', trusted)
renderer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(renderer)
build = renderer._build_json_ld

def organization_json(fm, word_count, image_url):
    data = json.loads(build(fm, word_count, image_url))
    data['author'] = {'@type': 'Person', 'name': fm['author']}
    data['publisher'] = {'@type': 'Organization', 'name': 'Supaboard', 'url': 'https://supaboard.ai'}
    if isinstance(fm.get('tags'), str) and fm['tags'].startswith('['):
        data['keywords'] = json.loads(fm['tags'])
    return json.dumps(data, ensure_ascii=False).replace('</', '<\\/')

renderer._build_json_ld = organization_json
# Permit the non-executable image priority hint before body hashing.
renderer.ALLOWED_ATTRS["img"] = renderer.ALLOWED_ATTRS["img"] | frozenset({"fetchpriority"})
for name, value in list(vars(renderer).items()):
    if isinstance(value, str) and '<footer class="post-footer">' in value:
        value = re.sub(r'<footer class="post-footer">.*?</footer>', '', value, flags=re.S)
        value = re.sub(r'<figure class="hero">.*?</figure>', '', value, flags=re.S)
        value = value.replace('<p class="dek">{description_escaped}</p>', '')
        value = value.replace('<meta property="og:image:width" content="1200">', '<meta property="og:image:width" content="1732">')
        value = value.replace('<meta property="og:image:height" content="630">', '<meta property="og:image:height" content="908">')
        setattr(renderer, name, value)
renderer.CSS += '\n.byline{margin-bottom:1rem}.benchmark-disclosure{font-size:.9rem;line-height:1.5;border-left:3px solid var(--accent);padding:.75rem 1rem;margin:0 0 1.5rem;background:var(--surface)}.benchmark-disclosure p{margin:0}@media(max-width:480px){article{padding-top:1.5rem}}\n'
renderer.ALLOWED_ATTRS["div"] = renderer.ALLOWED_ATTRS.get("div", frozenset()) | frozenset({"tabindex"})
renderer.CSS += '\n.chart-scroll{overflow-x:auto;border-radius:16px}.chart-scroll img{margin:0}.chart-canvas{margin:0}.chart-caption{font-size:.8rem;color:var(--muted);line-height:1.6}.chart-swipe{display:none;font-size:.8rem;text-align:right;margin:.35rem 0 .75rem;color:var(--muted)}@media(max-width:600px){.chart-scroll img{width:720px;max-width:none}.chart-canvas{width:720px}.chart-swipe{display:block}.chart-swipe:before{content:"Swipe to explore"}}@media print{.chart-scroll{overflow:visible}.chart-canvas{width:100%}.chart-scroll img{width:100%;max-width:100%}.chart-swipe{display:none}}\n'
raise SystemExit(renderer.main())
