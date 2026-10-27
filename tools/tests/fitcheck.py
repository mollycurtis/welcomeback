import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from lib import boot

SIZES = [(1905, 910), (1440, 900), (1366, 768), (1920, 1080), (2560, 1080), (3440, 1440), (3840, 2160), (5120, 1440)]
JS = """() => { const i=[...document.images].find(x=>/room[.](png|webp)/.test(x.getAttribute('src')||'')); const b=i.getBoundingClientRect();
  const s=document.querySelector('[data-screen]').getBoundingClientRect(); const pw=document.querySelector('[aria-label="Power"]').getBoundingClientRect();
  return {b:[b.left,b.top,b.right,b.bottom], s:[s.left,s.top,s.right,s.bottom], p:[pw.top,pw.bottom]} }"""
R = []
with sync_playwright() as pw:
    b = pw.chromium.launch(); p = b.new_page(viewport={'width': 1905, 'height': 910})
    boot(p, fast=True); p.wait_for_timeout(1200)
    p.locator('[aria-label="Step back from the computer"]').click(); p.wait_for_timeout(1500)
    for vw, vh in SIZES:
        p.set_viewport_size({'width': vw, 'height': vh}); p.wait_for_timeout(800)
        r = p.evaluate(JS)
        bl, bt, br, bb = r['b']
        shown_w = max(0, min(br, vw) - max(bl, 0)) / (br - bl)
        shown_h = max(0, min(bb, vh) - max(bt, 0)) / (bb - bt)
        screen_ok = r['s'][0] >= 0 and r['s'][1] >= 0 and r['s'][2] <= vw and r['s'][3] <= vh
        power_ok = r['p'][0] >= 0 and r['p'][1] <= vh
        ok = shown_w > 0.995 and shown_h > 0.995 and screen_ok and power_ok
        R.append(ok)
        print('%s %dx%d  room shown %.0f%% x %.0f%%  screen in view %s  power in view %s' % ('ok  ' if ok else 'FAIL', vw, vh, 100 * shown_w, 100 * shown_h, screen_ok, power_ok))
    b.close()
print('PASS %d / %d' % (sum(R), len(R)))
