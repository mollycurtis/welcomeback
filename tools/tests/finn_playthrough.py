import os, sys; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from lib import boot
from shotlib import grab, window_box
def adv(p,n=16):
    for _ in range(n):
        c=p.query_selector('[data-dialogue]')
        if c: c.click(); p.wait_for_timeout(130)
        else: break
def dismiss(p):
    b=p.query_selector("button:has-text('Maybe later')")
    if b: b.click(); p.wait_for_timeout(200)

    m=p.query_selector('[aria-label="Close map"]')
    if m: m.click(); p.wait_for_timeout(200)
def go(p,lbl,shot=None,W=None):
    g=p.query_selector("button:has-text('Goodbye for now.')")
    if g: g.click(); p.wait_for_timeout(200)
    adv(p)
    el=p.query_selector('[aria-label="%s"]' % lbl)
    if not el: print('  MISSING',lbl); return False
    try: el.click(timeout=5000)
    except Exception: print('  BLOCKED',lbl); return False
    p.wait_for_timeout(300); adv(p); dismiss(p)
    if shot: grab(p,shot,W)
    return True
def reply(p,txt):
    adv(p)
    el=p.query_selector('text=%s' % txt)
    if el: el.click(); p.wait_for_timeout(280); adv(p); return True
    return False

def hold(p,item):
    if not p.query_selector('[aria-label="%s"]' % item):
        go(p,'Open your pouch')
    return go(p,item)
with sync_playwright() as pw:
    b=pw.chromium.launch(**({'executable_path': os.environ['CHROME_PATH']} if os.environ.get('CHROME_PATH') else {}))
    p=b.new_page(viewport={'width':1440,'height':900})
    errs=[]; p.on('pageerror', lambda e: errs.append(str(e)))
    p.on('dialog', lambda d: d.accept())
    boot(p); p.dblclick('text=Finn the Fish'); p.wait_for_timeout(2500)
    W=window_box(p)
    p.click('[aria-label="New Game"]'); p.wait_for_timeout(1500)
    if p.query_selector('text=/Let.s go!/'): p.click('text=/Let.s go!/'); p.wait_for_timeout(500)
    adv(p)
    n=[0,0]
    def ok(name,v):
        n[1]+=1
        if v: n[0]+=1
        print(('  ok   ' if v else '  FAIL ')+name)
    ok('Pearlina', go(p,'Pearlina')); reply(p,'Who had it last?')
    ok('gardens', go(p,'Coral Gardens')); ok('Gus', go(p,'Gus')); reply(p,'Where are your glasses?')
    ok('tool', go(p,'Anemone')); ok('hold tool', hold(p,'Shell Opener'))
    ok('shell', go(p,"Gus's old shell")); ok('specs', hold(p,"Gus\u2019s Glasses"))
    ok('BLUE', go(p,'Gus'))
    ok('market', go(p,'Bubble Bay')); ok('Coco', go(p,'Coco'))
    ok('festival', go(p,'Festival Grounds')); ok('Pip', go(p,'Pip'))
    ok('pouch found', go(p,'Stacked crates')); ok('Dug', go(p,'Foreman Dug'))
    ok('market', go(p,'Bubble Bay Market')); ok('docks', go(p,'The Docks'))
    ok('Captain', go(p,'Captain Barnacle')); ok('handle', go(p,'Under the boat'))
    ok('kelp', go(p,'Kelp Forest')); ok('rope', go(p,'Coiled seaweed'))
    for l in ['Flower Garden','Hidden Grotto','Trench Edge']: go(p,l)
    ok('Bubbles', go(p,'Bubbles')); ok('hold rope', hold(p,'Seaweed Rope'))
    ok('head', go(p,'The first ledge'))
    ok('hold handle', hold(p,'Wrench Handle')); ok('combine', go(p,'Wrench Head'))
    for l in ['Hidden Grotto','Flower Garden','Kelp Forest','The Docks','Bubble Bay Market',"Marina's Repair Shop"]: go(p,l)
    ok('hold wrench', hold(p,'Wrench')); ok('GATE OPEN', go(p,'Marina'))
    for l in ['Bubble Bay Market','The Docks','Kelp Forest','Flower Garden','Hidden Grotto','Trench Edge','Abandoned Tunnel']: go(p,l)
    ok('lantern', go(p,'Old lantern'))
    ok('deep cave', go(p,'Deep Cave'))
    ok('hold pouch', hold(p,'Blue Pouch'))
    ok('PROFESSOR reveal', go(p,'Professor Bubble'))
    grab(p,'finn-EA-seam-reveal',W)
    ok('gate', go(p,'The Reef Gate')); ok('reef', go(p,'Ancient Reef')); ok('shrine', go(p,'Pearl Shrine'))
    ok('pearl moon', go(p,'The altar'))
    ok('ship', go(p,'The Sunken Ship')); ok('pearl ocean', go(p,'In the sand')); ok('cargo', go(p,'Cargo Hold'))
    ok('crowbar', go(p,'Among the crates'))
    ok('treasure', go(p,'Treasure Room')); ok('hold crowbar', hold(p,'Crowbar'))
    ok('pearl sun', go(p,'A shut chest'))
    ok('cargo', go(p,'Cargo Hold')); ok('cabin', go(p,"The Captain's Cabin"))
    for l in ['Cargo Hold','The Sunken Ship','Pearl Shrine','Ancient Reef','The Reef Gate','Deep Cave','Abandoned Tunnel','Trench Edge','Hidden Grotto']: go(p,l)
    ok('hold lantern', hold(p,'Lantern')); ok('light the pot', go(p,'An old clay pot')); ok('pearl ruby', go(p,'The Red Pearl'))
    ok('flowers', go(p,'Flower Garden')); ok('pearl garden', go(p,'In the flowerbed'))
    inv=p.evaluate("()=>JSON.parse(sessionStorage.getItem('welcome-back/finn')).state.inventory")
    print('  inventory:', inv)
    for l in ['Hidden Grotto','Trench Edge','Abandoned Tunnel','Deep Cave','The Reef Gate','Ancient Reef','Pearl Shrine','The Sunken Ship','Cargo Hold',"The Captain's Cabin",'Moonlight Island','Moon Shell Chamber']: go(p,l)
    ok('in chamber', 'Moon Shell Chamber' in p.inner_text('body'))
    ok('THE END', go(p,'The Moon Shell'))
    adv(p); p.wait_for_timeout(700)
    grab(p,'finn-EB-the-end',W)
    ok('ending card shown', 'The Moonlight Festival' in p.inner_text('body'))
    flags=p.evaluate("()=>JSON.parse(sessionStorage.getItem('welcome-back/finn')).state.flags")
    ok('finished flag', 'finished' in flags)
    print('\nPASS %d / %d' % (n[0], n[1]))
    print('errs', errs)
    b.close()
