import sys, os, re, json, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from lib import boot, SHOTS
import numpy as np
from PIL import Image
SH=SHOTS; R=[]
def ok(name, cond, extra=''):
    R.append((bool(cond), name, str(extra))); print(('  ok   ' if cond else '  FAIL ')+name, extra, flush=True)
def sharp(path, box):
    im=np.asarray(Image.open(path).convert('L').crop(box)).astype(float)
    lap=im[1:-1,1:-1]*4-im[:-2,1:-1]-im[2:,1:-1]-im[1:-1,:-2]-im[1:-1,2:]
    return float(lap.var())
def icon(p,label): return p.locator('.dicon').filter(has=p.locator('.lbl', has_text=re.compile('^'+re.escape(label)+'$')))
def close_all(p):
    for _ in range(12):
        b=p.locator('#window-layer .titlebtn.close')
        if b.count()==0: break
        try: b.last.click(timeout=2000)
        except Exception: break
        p.wait_for_timeout(150)
def dialog_btn(p, text):
    b=p.locator('button.btn3d', has_text=re.compile('^'+text+'$'))
    if b.count(): b.last.click(); p.wait_for_timeout(250); return True
    return False
def addr(p):
    return p.evaluate("() => { const i=[...document.querySelectorAll('input')].find(x=>/^(www\\.|search:|answers\\.|forums\\.|history|favorites|suggest|webring|quiz|geocities|freewebs)/.test(x.value)); return i? i.value : null }")

with sync_playwright() as pw:
    b=pw.chromium.launch()
    p=b.new_page(viewport={'width':1905,'height':910})
    errs=[]; p.on('pageerror', lambda e: errs.append(str(e)))
    p.on('dialog', lambda d: d.accept())
    boot(p, fast=True); p.wait_for_timeout(1800)
    p.screenshot(path=SH+'desk_zoomed.png')
    icon(p,'My Documents').dblclick(); p.wait_for_timeout(700)
    p.locator('#window-layer span.truncate', has_text=re.compile('^summer plans!!\\.txt$')).first.dblclick(); p.wait_for_timeout(900)
    tb=p.locator('#window-layer .titlebar', has_text=re.compile('Notepad')).last.bounding_box() if p.locator('#window-layer .titlebar', has_text=re.compile('Notepad')).count() else None
    if tb is None:
        t=p.locator('#window-layer', has_text=re.compile('Notepad')).get_by_text(re.compile('Notepad')).last.bounding_box()
        tb={'x':t['x']-4,'y':t['y']-3,'width':t['width']+8,'height':t['height']+6}
    box=(int(tb['x']),int(tb['y']),int(tb['x']+min(tb['width'],420)),int(tb['y']+tb['height']))
    p.screenshot(path=SH+'before_select.png'); s0=sharp(SH+'before_select.png',box)
    ta=p.locator('textarea').last; ta.click(click_count=3); p.wait_for_timeout(600)
    p.screenshot(path=SH+'after_select.png')
    s1=sharp(SH+'after_select.png',box)
    ok('text stays sharp after selecting in Notepad', s1 > s0*0.8, 'sharpness %.0f -> %.0f' % (s0,s1))
    close_all(p)
    labels=p.evaluate("() => [...document.querySelectorAll('.dicon .lbl')].map(x=>x.textContent)")
    print('icons:', labels)
    for lab in labels:
        if lab in ('Petville','Penguin Cove','Finn the Fish','Maple Grove','iFind'): continue
        n0=len(errs)
        try:
            icon(p,lab).dblclick(); p.wait_for_timeout(900)
            dialog_btn(p,'OK')
            wins=p.locator('#window-layer .titlebtn.close').count()
            ok('opens: '+lab, wins>0 and len(errs)==n0, '' if len(errs)==n0 else errs[-1][:120])
        except Exception as e: ok('opens: '+lab, False, str(e)[:120])
        close_all(p)
    icon(p,'My Documents').dblclick(); p.wait_for_timeout(600)
    def rows(): return p.evaluate("() => [...document.querySelectorAll('#window-layer .grid.cursor-default span.truncate')].map(x=>x.textContent)")
    root=rows(); print('root:', root)
    ok('removed docs are gone', not any(x in root for x in ['vacation ideas.txt','read this.txt']) and 'report card.txt' in root, root)
    folders=['school','recipes (mom)','Downloads']
    allfiles=[]
    for f in [''] + folders:
        if f:
            p.locator('#window-layer span.truncate', has_text=re.compile('^'+re.escape(f)+'$')).dblclick(); p.wait_for_timeout(400)
        names=[x for x in rows() if x not in folders]
        for nm in names:
            if nm.endswith('.exe') or nm.endswith('.mp3') or nm.endswith('.scr'): continue
            p.locator('#window-layer span.truncate', has_text=re.compile('^'+re.escape(nm)+'$')).first.dblclick(); p.wait_for_timeout(450)
            if p.locator('input[type=password]').count():
                p.locator('input[type=password]').last.fill('x'); p.keyboard.press('Enter'); p.wait_for_timeout(400)
            t=p.locator('textarea').last.input_value() if p.locator('textarea').count() else ''
            bad=[l for a,l in zip(t.split('\n'),t.split('\n')[1:]) if a.strip() and l.strip() and a.rstrip()[-1:].isalpha() and l[:1].islower() and not re.match(r'^[-\d\[]',l)]
            allfiles.append((f or 'root',nm,len(t),bad[:2]))
            p.locator('#window-layer .titlebtn.close').last.click(); p.wait_for_timeout(200)
        if f:
            p.locator('#window-layer button', has_text='Back').first.click(); p.wait_for_timeout(300)
    ok('every document opens with text', all(n>0 for f,nm,n,bad in allfiles), [(f,nm) for f,nm,n,bad in allfiles if n==0])
    p.locator('#window-layer span.truncate', has_text=re.compile('^grocery list \\(mom\\)\\.txt$')).click()
    p.keyboard.press('Delete'); p.wait_for_timeout(300); dialog_btn(p,'Yes')
    ok('Delete key sends a file to the bin', 'grocery list (mom).txt' not in rows())
    p.locator('#window-layer span.truncate', has_text=re.compile('^school$')).click()
    p.locator('#window-layer button', has_text=re.compile('^Delete$')).click(); p.wait_for_timeout(300); dialog_btn(p,'Yes')
    ok('Delete button sends a folder to the bin', 'school' not in rows())
    close_all(p)
    ok('bin icon shows full', icon(p,'Recycle Bin').locator('svg, img').count()>0)
    icon(p,'Recycle Bin').dblclick(); p.wait_for_timeout(600)
    bintext=p.locator('#window-layer').inner_text()
    ok('bin lists both with where they came from', 'grocery list (mom).txt' in bintext and 'school' in bintext and 'C:\\My Documents' in bintext, bintext[-200:].replace('\n',' | '))
    p.locator('#window-layer span.truncate', has_text=re.compile('^school$')).click()
    p.locator('#window-layer button', has_text=re.compile('^Restore$')).click(); p.wait_for_timeout(300)
    empty_btn=p.locator('#window-layer button', has_text='Empty Recycle Bin')
    ok('Empty enabled while something is in the bin', empty_btn.is_enabled())
    empty_btn.click(); p.wait_for_timeout(300); dialog_btn(p,'Yes')
    ok('bin empty after emptying, Empty disabled', 'The Recycle Bin is empty.' in p.locator('#window-layer').inner_text() and not empty_btn.is_enabled())
    close_all(p)
    icon(p,'My Documents').dblclick(); p.wait_for_timeout(500)
    r2=rows(); ok('restored folder is back, emptied file is gone', 'school' in r2 and 'grocery list (mom).txt' not in r2, r2)
    close_all(p)
    p.mouse.click(700,500, button='right'); p.wait_for_timeout(300)
    p.locator('.menu-pop button', has_text='New Folder').click(); p.wait_for_timeout(400)
    ok('New Folder appears', icon(p,'New Folder').count()==1)
    icon(p,'New Folder').click(button='right'); p.wait_for_timeout(300)
    p.locator('.menu-pop button', has_text='Rename').click(); p.wait_for_timeout(300)
    p.locator('input').last.fill('stuff'); p.keyboard.press('Enter'); p.wait_for_timeout(400)
    ok('rename a desktop folder', icon(p,'stuff').count()==1)
    sb=icon(p,'stuff').bounding_box(); bb=icon(p,'Recycle Bin').bounding_box()
    p.mouse.move(sb['x']+sb['width']/2, sb['y']+10); p.mouse.down(); p.mouse.move(bb['x']+bb['width']/2, bb['y']+bb['height']/2, steps=12); p.mouse.up(); p.wait_for_timeout(400)
    dialog_btn(p,'Yes')
    ok('drag a folder onto the bin deletes it', icon(p,'stuff').count()==0)
    icon(p,'Finn the Fish').click(); p.keyboard.press('Delete'); p.wait_for_timeout(300)
    ok('programs stay protected', 'protected by an administrator' in p.inner_text('body')); dialog_btn(p,'OK')
    icon(p,'Calendar').dblclick(); p.wait_for_timeout(500)
    cal=p.locator('#window-layer')
    texts={}
    for m in range(5): p.locator('#window-layer button', has_text=re.compile('^<$')).click(); p.wait_for_timeout(80)
    for m in range(12):
        texts[m]=cal.inner_text()
        if m < 11: p.locator('#window-layer button', has_text=re.compile('^>$')).click(); p.wait_for_timeout(80)
    allcal=' '.join(texts.values())
    for t in ['Daytona 500','GRANDMA\u2019S BIRTHDAY','GRANDPA\u2019S BIRTHDAY','MARI\u2019S BIRTHDAY','ALEX\u2019S BIRTHDAY','BREISHEN\u2019S BIRTHDAY','Christmas light show','make red velvet cupcakes','Father Daughter Dance']:
        ok('calendar has '+t, t in allcal)
    for t in ['bike ride','donuts','Race day','popsicle','Farkle till','Tucker\n']:
        ok('calendar no longer has '+t.strip(), t not in allcal)
    close_all(p)
    icon(p,'WelcomeMail').dblclick(); p.wait_for_timeout(500)
    mt=p.locator('#window-layer').inner_text()
    ok('9 messages, newest first', '9 messages' in mt and mt.index('Reminder: 2 movies') < mt.index('Lefse at Grandma') < mt.index('Father Daughter Dance'), '')
    close_all(p)
    ok('no page errors', not errs, errs[:3])
    json.dump(R, open(SH+'qa1.json','w'))
    b.close()
print('PASS %d / %d' % (sum(1 for r in R if r[0]), len(R)))
