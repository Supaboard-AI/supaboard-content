from pathlib import Path
import json,html,re,shutil
b=Path('/Users/ani/Projects/fyipen-projects/supaboard/supaboard-content/drafts/ai-data-analytics-benchmark')
backup=b/'research/before-index-charts'
for folder in ['website','substack']:
 (backup/folder).mkdir(parents=True,exist_ok=True)
 for p in (b/folder).iterdir():
  if p.suffix in ['.md','.svg','.png'] and not (backup/folder/p.name).exists():shutil.copy2(p,backup/folder/p.name)
p=b/'research/leaderboard-chart-data.json';doc=json.loads(p.read_text())
doc['chart_metric']='Data Analytics Index = points / 39 * 100 + 10; maximum 110; not a percentage.'
for d in doc['data']:d['index']=round(d['points']/39*100+10,1)
p.write_text(json.dumps(doc,indent=2)+'\n');data=doc['data']
colors=['#414DCF','#1D6B69','#DB9D48','#1C7A5B','#EA5640','#8B93A7','#6BAC96','#4088FD','#A7ACB6']
ink='#1C1C1E';muted='#5C6370';grid='#E6E9EE';bg='#FFFFFF'
def text(x,y,s,size=20,color=ink,weight=400,anchor='start'):
 return f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}" font-weight="{weight}" text-anchor="{anchor}">{html.escape(str(s))}</text>'
def rect(x,y,w,h,c,rx=0,stroke='none'):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{c}" stroke="{stroke}"/>'
def line(x,y,xx,yy,c=grid):return f'<line x1="{x}" y1="{y}" x2="{xx}" y2="{yy}" stroke="{c}" stroke-width="1"/>'
def start(h,title,note=''):
 return [f'<svg xmlns="http://www.w3.org/2000/svg" width="840" height="{h}" viewBox="0 0 840 {h}" role="img" aria-label="{title}" font-family="Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif">',f'<title>{title}</title>',rect(1,1,838,h-2,bg,18,'#E6E9EE'),text(36,57,title,23,ink,600),text(802,56,note,13,muted,500,'end')]
def save(name,a):
 for f in ['website','substack']:(b/f/(name+'.svg')).write_text('\n'.join(a+['</svg>']))
# Reference-inspired vertical bars; 0–110 scale is shared by every agent.
a=start(560,'Data Analytics Index by tool','HIGHER IS BETTER')
x0=80;step=80;base=456;scale=3.05
for v in [0,25,50,75,100]:
 yy=base-v*scale;a += [line(80,yy,802,yy),text(65,yy+6,str(v),17,muted,400,'end')]
for i,(d,c) in enumerate(zip(data,colors)):
 xx=89+i*step;hh=d['index']*scale
 a += [rect(xx,base-hh,64,hh,c),text(xx+32,base-hh-15,f"{d['index']:.1f}",21,ink,600,'middle'),text(xx+32,489,d['agent'],15,muted,500,'middle')]
save('accuracy-by-agent',a)
# Color matches the bar chart; no featured-score footer or sample-size subtitle.
a=start(590,'Time vs. Data Analytics Index')
x=lambda v:80+v/250*690
y=lambda v:478-v/110*340
for v in [0,25,50,75,100]:a += [line(80,y(v),770,y(v)),text(65,y(v)+6,str(v),17,muted,400,'end')]
for v in range(0,251,50):a += [text(x(v),510,str(v),17,muted,400,'middle')]
a += [text(80,110,'Data Analytics Index',17,muted),text(425,554,'Mean response time (seconds)',19,muted,400,'middle')]
labels={'Supaboard':(-18,-20,'end'),'claude':(-18,-16,'end'),'Lightdash':(-18,-12,'end'),'Basedash':(-18,7,'end'),'ChatGPT':(18,25,'start'),'Dot':(18,7,'start'),'Hex':(-18,7,'end'),'Sigma':(-18,32,'end'),'Metabase':(18,7,'start')}
for d,c in zip(data,colors):
 xx=x(d['mean_seconds']);yy=y(d['index']);dx,dy,anchor=labels[d['agent']]
 a += [f'<circle cx="{xx}" cy="{yy}" r="8" fill="{c}"/>',text(xx+dx,yy+dy,d['agent'],21,ink,500,anchor)]
save('time-vs-accuracy',a)
a=start(570,'Which questions were hardest?','FULL CREDIT · OUT OF 9')
for i,(label,count) in enumerate([('Cancellation spike',8),('Annual billings',8),('Net retention',7),('Missing from CRM',1),('ARR by industry',0),('Enterprise support',0)]):
 yy=120+i*67
 a += [text(36,yy,label,21,ink,500),text(802,yy,f'{count} / 9',21,ink,600,'end'),rect(36,yy+15,766,12,'#F2F4F6',2)]
 if count:a += [rect(36,yy+15,766*count/9,12,colors[i],2)]
save('question-difficulty',a)
# Only update chart-related prose; preserve sources and all reported point totals.
scatter_alt='Time versus Data Analytics Index for nine configurations. '+ '; '.join(f"{d['agent']}: {d['mean_seconds']} seconds and {d['index']:.1f}" for d in data)+'.'
bar_alt='Data Analytics Index by tool: '+', '.join(f"{d['agent']} {d['index']:.1f}" for d in data)+'. Maximum index: 110.'
for folder,slug in [('website','ai-data-analytics-benchmark'),('substack','ten-ai-agents-one-database')]:
 p=b/folder/(slug+'.md');s=p.read_text()
 for name,h,alt in [('time-vs-accuracy',590,scatter_alt),('accuracy-by-agent',560,bar_alt),('question-difficulty',570,None)]:
  s=re.sub(r'(<img src="'+name+r'.png" width=")\d+(" height=")\d+',r'\g<1>840\g<2>'+str(h),s)
  if alt:s=re.sub(r'(<img src="'+name+r'.png"[^>]* alt=")[^"]*',lambda m:m[1]+alt,s)
 s=s.replace('Time is the reported mean in seconds; accuracy is the percentage of available rubric points, including partial credit.','Time is the reported mean in seconds. The Data Analytics Index is the percentage of available rubric points plus ten, on a scale with a maximum of 110.')
 s=s.replace('Reported accuracy for the nine configurations covered here. The rubric awards partial credit, so this is not the percentage of questions answered exactly.','Data Analytics Index for the nine configurations covered here. It includes partial credit and is an index, not a percentage of questions answered exactly.')
 s=s.replace('Accuracy is the share of available rubric points.','The charts use the Data Analytics Index: the percentage of available rubric points plus ten.')
 p.write_text(s)
print('Brand-matched white charts generated with index values:',[(d['agent'],d['index']) for d in data])
