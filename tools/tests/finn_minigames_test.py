import os
import sys, re, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from lib import boot, SHOTS
from finn_helpers import BASE, open_finn, scene_state, clear_lines, pouch_item, fresh_page
S=os.path.join(SHOTS, 'minigames') + '/'; os.makedirs(S, exist_ok=True)
def stars(p): return p.evaluate("() => { const s=JSON.parse(sessionStorage.getItem('welcome-back/finn')).state; return [s.seaStars, s.flags.filter(f=>/^won-|map-seen/.test(f))] }")
def start_game(p, who):
    p.click('[aria-label="%s"]' % who); p.wait_for_timeout(2500)
    for _ in range(8):
        if p.query_selector("button:has-text('play')"): break
        if p.locator('[data-dialogue]').count(): p.locator('[data-dialogue]').click(); p.wait_for_timeout(350)
    p.locator("button:has-text('play')").first.click(); p.wait_for_timeout(900)
with sync_playwright() as pw:
    b=pw.chromium.launch(); p=fresh_page(b); boot(p, fast=True); p.wait_for_timeout(1000); open_finn(p, fresh=True)
    base=BASE+['knows-current','got-pearl-garden','gate-open','map-seen']
    scene_state(p,'bubble-bay-market',base,['current-map']); p.reload(); boot(p, fast=True); p.wait_for_timeout(900); open_finn(p); clear_lines(p); p.wait_for_timeout(600)
    start_game(p,'Coco'); p.locator('#window-layer > div').last.screenshot(path=S+'1_shells_ready.png')
    p.click("button:has-text('Ready!')"); p.wait_for_timeout(1600); p.locator('#window-layer > div').last.screenshot(path=S+'2_shells_moving.png'); p.wait_for_timeout(3200)
    p.locator('[data-pearl="yes"]').click(); p.wait_for_timeout(1300); p.locator('#window-layer > div').last.screenshot(path=S+'3_shells_win.png')
    print('after shells:', stars(p)); p.click('[aria-label="Close game"]'); p.wait_for_timeout(400)
    scene_state(p,'moonlight-festival',base+['got-pearl-garden','got-pearl-ruby','got-pearl-moon','got-pearl-ocean','got-pearl-sun'],['current-map']); p.reload(); boot(p, fast=True); p.wait_for_timeout(900); open_finn(p); clear_lines(p); p.wait_for_timeout(600)
    start_game(p,'Kelp'); p.locator('#window-layer > div').last.screenshot(path=S+'4_count_round1.png')
    for r in range(3):
        if r==2: p.locator('#window-layer > div').last.screenshot(path=S+'5_count_round3.png')
        p.locator('[data-answer="yes"]').click(); p.wait_for_timeout(1600)
    p.wait_for_timeout(400); p.locator('#window-layer > div').last.screenshot(path=S+'6_count_win.png'); print('after count:', stars(p)); p.click('[aria-label="Close game"]'); p.wait_for_timeout(400)
    scene_state(p,'deep-cave',base,['current-map']); p.reload(); boot(p, fast=True); p.wait_for_timeout(900); open_finn(p); clear_lines(p); p.wait_for_timeout(600)
    start_game(p,'Professor Bubble'); p.locator('#window-layer > div').last.screenshot(path=S+'7_quiz_q1.png')
    p.locator('[data-correct="no"]').first.click(); p.wait_for_timeout(250); p.locator('#window-layer > div').last.screenshot(path=S+'8_quiz_wrong.png'); p.wait_for_timeout(500)
    for q in range(5):
        p.locator('[data-correct="yes"]').click(); p.wait_for_timeout(1600)
    p.wait_for_timeout(400); p.locator('#window-layer > div').last.screenshot(path=S+'9_quiz_win.png'); print('after quiz:', stars(p)); p.click('[aria-label="Close game"]'); p.wait_for_timeout(400)
    fl=[f for f in base if f!='map-seen']+['got-pearl-ruby']
    scene_state(p,'deep-cave',fl,['current-map','pearl-garden','pearl-ruby']); p.reload(); boot(p, fast=True); p.wait_for_timeout(900); open_finn(p); p.wait_for_timeout(1500)
    for _ in range(10):
        if p.query_selector('[aria-label="Close map"]'): break
        if p.locator('[data-dialogue]').count(): p.locator('[data-dialogue]').click()
        p.wait_for_timeout(350)
    print('map opened by itself:', bool(p.query_selector('[aria-label="Close map"]'))); p.wait_for_timeout(600); p.locator('#window-layer > div').last.screenshot(path=S+'10_map.png')
    b.close()
