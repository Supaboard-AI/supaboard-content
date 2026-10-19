from pathlib import Path
import json,re,hashlib
from playwright.sync_api import sync_playwright
root=Path('/Users/ani/Projects/fyipen-projects/supaboard/supaboard-content/drafts/financial-dashboard-examples/revision-2')
(root/'preview').mkdir(exist_ok=True)
report={'format':'HTML only; PDF intentionally omitted by user request','checks':[]}
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/Users/ani/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell')
 for width,height,theme in [(1280,900,'light'),(768,1024,'light'),(375,812,'light'),(1280,900,'dark')]:
  ctx=browser.new_context(viewport={'width':width,'height':height},color_scheme=theme)
  page=ctx.new_page(); errors=[]
  page.on('pageerror',lambda error: errors.append(str(error)))
  page.goto((root/'financial-dashboard-examples.html').as_uri())
  checks=page.evaluate('''() => ({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,headings:[...document.querySelectorAll('h1,h2,h3')].map(x=>({level:x.tagName,text:x.textContent})),missingTargets:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.getAttribute('href').slice(1))).map(a=>a.href),emptyLinks:[...document.querySelectorAll('a')].filter(a=>!a.textContent.trim()).length,links:[...document.querySelectorAll('article a[href^="https:"]')].map(a=>({href:a.href,anchor:a.textContent})),tables:document.querySelectorAll('table').length,tableHeaders:document.querySelectorAll('th[scope="col"]').length,schema:JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent),bodyBackground:getComputedStyle(document.body).backgroundColor,sourceHash:document.querySelector('meta[name="article-source-sha256"]').content})''')
  assert checks['scrollWidth']<=width,checks
  assert checks['h1']==1 and not checks['missingTargets'] and not checks['emptyLinks'] and not errors
  assert checks['tables']==1 and checks['tableHeaders']==4
  assert page.locator('figure').count()==4
  assert page.locator('.bar').count()==6
  assert page.locator('.invoice-row').count()==3
  assert page.locator('.failure-pin').all_text_contents()==['1','2','3','4','5','6']
  assert page.locator('.note-number').all_text_contents()==['1','2','3','4','5','6']
  assert page.locator('.sb-app').count()==4
  assert 800<=checks['schema']['wordCount']<=1200
  assert checks['sourceHash']==hashlib.sha256((root/'financial-dashboard-examples.md').read_bytes()).hexdigest()
  assert not any(key in checks['schema'] for key in ['author','publisher','datePublished'])
  assert len(checks['links'])==6
  page.screenshot(path=str(root/'preview'/f'{theme}-{width}.png'),full_page=True)
  if width==1280 and theme=='light':page.screenshot(path=str(root/'preview'/'desktop-top.png'))
  if width==375:page.screenshot(path=str(root/'preview'/'mobile-top.png'))
  for name in ['performance-figure','aging-figure','invoice-figure','review-figure']:
   page.locator('.'+name).screenshot(path=str(root/'preview'/f'{name}-{theme}-{width}.png'))
  report['checks'].append({'viewport':width,'theme':theme,'pass':True,'consoleErrors':errors,**checks})
  ctx.close()
 browser.close()
assert report['checks'][0]['bodyBackground']!=report['checks'][-1]['bodyBackground']
assert not list(root.glob('*.pdf'))
(root/'validation.json').write_text(json.dumps(report,indent=2))
print('PASS: HTML at desktop, tablet, mobile and dark mode; heading structure, table headers, 800–1,200-word body, navigation, source consistency, six links and no PDF.')
