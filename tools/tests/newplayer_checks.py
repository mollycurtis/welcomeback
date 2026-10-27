import re, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from lib import boot, SHOTS
S=os.path.join(SHOTS, 'newplayer') + '/'; os.makedirs(S, exist_ok=True)
R={}
def icon(p, name): return p.locator('.dicon').filter(has=p.locator('.lbl', has_text=re.compile('^%s$' % re.escape(name))))
def scr(p): return p.locator('[data-screen]').bounding_box()
def closew(p):
    for _ in range(3):
        c=p.locator('#window-layer [aria-label="Close"]')
        if not c.count(): break
        c.last.click(); p.wait_for_timeout(350)
def addr(p): return p.locator('#window-layer input').first.input_value()
with sync_playwright() as pw:
    b=pw.chromium.launch(); p=b.new_page(viewport={'width':1905,'height':910}); errs=[]
    p.on('pageerror', lambda e: errs.append(str(e)[:200]))
    p.goto('http://localhost:4321/', wait_until='networkidle'); p.wait_for_timeout(1200)
    pb=p.locator('[aria-label="Power"]').bounding_box(); pad=60
    p.screenshot(path=S+'ring_off.png', clip={'x':pb['x']-pad,'y':pb['y']-pad,'width':pb['width']+2*pad,'height':pb['height']+2*pad})
    p.click('[aria-label="Power"]')
    for i in range(30):
        p.wait_for_timeout(700)
        if 'Owner' in p.inner_text('body'): break
    p.click('text=Owner'); p.wait_for_timeout(700); p.keyboard.type('pizza'); p.keyboard.press('Enter'); p.wait_for_timeout(5500)
    p.locator('[aria-label="Step back from the computer"]').click(); p.wait_for_timeout(1600)
    pb=p.locator('[aria-label="Power"]').bounding_box()
    p.screenshot(path=S+'ring_on.png', clip={'x':pb['x']-pad,'y':pb['y']-pad,'width':pb['width']+2*pad,'height':pb['height']+2*pad})
    p.locator('[data-screen]').click(force=True); p.wait_for_timeout(1600)
    icon(p,'Notepad').first.dblclick(force=True); p.wait_for_timeout(1200); p.keyboard.type('typed with no click')
    R['notepad']=p.locator('#window-layer textarea').first.input_value(); closew(p)
    for _ in range(2):
        d=p.locator('button', has_text=re.compile("^(No|Don.t Save)$"))
        if d.count(): d.first.click(); p.wait_for_timeout(300)
    icon(p,'TypeRight').first.dblclick(force=True); p.wait_for_timeout(1200); p.keyboard.type('The quick')
    R['typeright']=p.locator('#window-layer input').last.input_value(); closew(p)
    icon(p,'Chatterbox').first.dblclick(force=True); p.wait_for_timeout(1200)
    p.locator('#window-layer').get_by_text('xXsarahXx97').first.click(); p.wait_for_timeout(600)
    p.keyboard.type('almost done'); p.keyboard.press('Enter'); p.wait_for_timeout(4500)
    R['chat']=p.locator('#window-layer > div').last.inner_text()[-160:]
    p.locator('#window-layer > div').last.screenshot(path=S+'chat.png'); closew(p)
    icon(p,'iFind').first.dblclick(force=True); p.wait_for_timeout(3000)
    p.locator('[aria-label="Start exploring"]').first.click(); p.wait_for_timeout(1200)
    p.locator('#window-layer button', has_text='The Bedroom').first.click(); p.wait_for_timeout(1500)
    p.locator('#window-layer > div').last.screenshot(path=S+'ifind_card.png'); closew(p)
    icon(p,'WorldWindow').first.dblclick(force=True); p.wait_for_timeout(1800)
    p.locator('#window-layer').get_by_text('Remember a game? Tell me about it').first.click(); p.wait_for_timeout(1200); R['suggest_addr']=addr(p)
    p.locator('#window-layer button', has_text='Home').first.click(); p.wait_for_timeout(1000)
    p.locator('#window-layer input[placeholder*="search"]').first.fill('Dinosaurs'); p.keyboard.press('Enter'); p.wait_for_timeout(1500)
    R['search_addr']=addr(p); R['search_page']=p.locator('#window-layer > div').last.inner_text()[200:420]
    p.locator('#window-layer button', has_text='History').first.click(); p.wait_for_timeout(1000)
    R['history_has_dogsit']='how to dog sit' in p.locator('#window-layer > div').last.inner_text(); R['history_has_tucker']='tucker birthday' in p.locator('#window-layer > div').last.inner_text()
    p.locator('#window-layer').get_by_text('how to dog sit').first.click(); p.wait_for_timeout(1500)
    R['dogsit_addr']=addr(p); R['dogsit_page']=p.locator('#window-layer > div').last.inner_text()[200:500]
    p.locator('#window-layer button', has_text='Home').first.click(); p.wait_for_timeout(800)
    p.locator('#window-layer input').first.fill('www.askbeeves.com/search?q=homework+help'); p.keyboard.press('Enter'); p.wait_for_timeout(1300)
    R['homework_addr']=addr(p); R['homework_ok']='Homework Help HQ' in p.locator('#window-layer > div').last.inner_text()
    closew(p)
    p.locator('button:has-text("start")').first.click(); p.wait_for_timeout(500); p.get_by_text('Log Off Owner').first.click(); p.wait_for_timeout(900)
    p.screenshot(path=S+'logoff.png', clip=scr(p)); R['logoff_dialog']='Are you sure you want to log off?' in p.inner_text('body')
    p.locator('button', has_text='Cancel').last.click(); p.wait_for_timeout(700); R['after_cancel_desktop']='Recycle Bin' in p.inner_text('body') and 'To begin, click your user name' not in p.inner_text('body')
    p.locator('button:has-text("start")').first.click(); p.wait_for_timeout(500); p.get_by_text('Log Off Owner').first.click(); p.wait_for_timeout(800)
    p.locator('button', has_text='Log Off').last.click(); p.wait_for_timeout(1800); R['after_logoff_login']='To begin, click your user name' in p.inner_text('body')
    R['errors']=errs
    b.close()
for k,v in R.items(): print(k, '::', v if not isinstance(v,str) else ' | '.join(v.split('\n'))[:260])
