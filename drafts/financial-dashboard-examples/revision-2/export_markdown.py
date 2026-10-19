from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
import re,json,hashlib,zipfile,yaml
root=Path(__file__).resolve().parent
out=root/'markdown'; (out/'images').mkdir(parents=True,exist_ok=True)
_,frontmatter,body=(root/'financial-dashboard-examples.md').read_text().split('---',2)
meta=yaml.safe_load(frontmatter)
assets=[
 ('performance','performance-figure','01-profitability-dashboard','Supaboard-style profitability dashboard: revenue $600,000 and margin 38%, with numbered callouts for missing payment timing and overdue receivables.'),
 ('aging','aging-figure','02-accounts-receivable-dashboard','Accounts receivable dashboard comparing August and September aging: total overdue doubles to $160,000 and balances over 30 days late triple to $90,000.'),
 ('invoices','invoice-figure','03-collection-records','Customer A collection records showing three overdue invoices totaling $45,000, different action owners and a missing follow-up date.'),
 ('review','review-figure','04-combined-finance-dashboard','Combined finance dashboard showing revenue, gross margin, overdue receivables and the missing reconciliation of actual cash movements.')]
manifest=[];blocks=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/Users/ani/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell')
 page=browser.new_page(viewport={'width':1280,'height':1000},device_scale_factor=2,color_scheme='light')
 page.goto((root/'financial-dashboard-examples.html').as_uri())
 for key,selector,filename,alt in assets:
  fig=page.locator('.'+selector)
  image_path=out/'images'/(filename+'.png')
  fig.locator('.sb-app').screenshot(path=str(image_path))
  assert fig.locator('.ui-icon').count()>15
  assert not re.search('[◫▦↥✧✦▢◇⌄▤☰＋↑]',fig.inner_text())
  notes=[]
  for note in fig.locator('.failure-note').all():
   n=note.locator('.note-number').inner_text()
   label=note.locator('b').inner_text()
   text=note.locator('span').last.inner_text()
   notes.append(f'**{n}. {label}**{text[len(label):]}')
  caption=fig.locator('figcaption').inner_text()
  embed=f'![{alt}](images/{filename}.png)\n\n'+ '\n\n'.join(notes)+f'\n\n*{caption}*'
  body=body.replace(f'<!-- FIGURE: {key} -->',embed)
  blocks.append('## '+fig.locator('.sb-title').inner_text()+'\n\n'+embed)
  with Image.open(image_path) as im:
   assert im.width>=1500 and im.height>=500
   im.verify()
  with Image.open(image_path) as im:
   manifest.append({'filename':str(image_path.relative_to(out)),'width':im.width,'height':im.height,'bytes':image_path.stat().st_size,'sha256':hashlib.sha256(image_path.read_bytes()).hexdigest(),'callouts':[x.locator('.note-number').inner_text() for x in fig.locator('.failure-note').all()]})
 browser.close()
assert '<!-- FIGURE:' not in body
article='# '+meta['title']+'\n\n'+body.strip()+'\n'
(out/'financial-dashboard-examples.md').write_text(article)
(out/'dashboard-images.md').write_text('# Financial dashboard images\n\n'+ '\n\n'.join(blocks)+'\n')
for image_ref in re.findall(r'!\[[^\]]*\]\(([^)]+)\)',article):assert (out/image_ref).is_file()
(out/'export-manifest.json').write_text(json.dumps(manifest,indent=2))
with zipfile.ZipFile(root/'financial-dashboard-markdown.zip','w',zipfile.ZIP_DEFLATED) as z:
 for f in sorted(out.rglob('*')):
  if f.is_file():z.write(f,f.relative_to(out))
print(json.dumps({'markdown':str(out/'financial-dashboard-examples.md'),'zip':str(root/'financial-dashboard-markdown.zip'),'images':manifest},indent=2))
