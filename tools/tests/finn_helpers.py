import os, sys, re, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from lib import boot
BASE=['seen-intro','met-pearlina','knows-gus','met-gus','knows-shell','got-tool','opened-shell','gus-remembers']
def open_finn(p, fresh=False):
    p.locator('.dicon').filter(has=p.locator('.lbl', has_text=re.compile('^Finn the Fish$'))).dblclick(force=True); p.wait_for_timeout(2600)
    if fresh: p.click('[aria-label="New Game"]')
    else: p.locator('[aria-label^="Play"]').first.click()
    p.wait_for_timeout(1800)
    for t in ['Let\u2019s go!']:
        if p.locator('text='+t).count(): p.click('text='+t); p.wait_for_timeout(400)
def scene_state(p, scene, flags, inv):
    p.evaluate("""([scene,flags,inv]) => { const s=JSON.parse(sessionStorage.getItem('welcome-back/finn'));
      const st=s.state; const key=Object.keys(st).find(k=>typeof st[k]==='string' && /plaza|cove|scene/i.test(k+st[k]));
      st[key]=scene; st.flags=flags; st.inventory=inv; st.visited=[...(st.visited||[]), scene];
      sessionStorage.setItem('welcome-back/finn', JSON.stringify(s)); return key }""",[scene,flags,inv])
def clear_lines(p, n=8):
    for _ in range(n):
        if p.locator('[data-dialogue]').count()==0: break
        p.locator('[data-dialogue]').click(); p.wait_for_timeout(250)
def pouch_item(p, name):
    loc=p.locator('[aria-label="%s"]' % name)
    if not loc.count() or not loc.first.is_visible():
        p.locator('[aria-label*="ouch"]').first.click(); p.wait_for_timeout(500)
    p.locator('[aria-label="%s"]' % name).first.click(); p.wait_for_timeout(300)
def fresh_page(b):
    p=b.new_page(viewport={'width':1440,'height':900}); p.on('dialog', lambda d: d.accept()); return p
