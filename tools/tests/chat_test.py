import os
import sys, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from lib import boot
from PIL import Image
def say(p, text):
    p.locator('input[placeholder="Type a message"], textarea').last.fill(text); p.keyboard.press('Enter'); p.wait_for_timeout(3800)
    return p.evaluate("() => { const rows=[...document.querySelectorAll('#window-layer div')].map(d=>d.innerText).filter(t=>t&&t.split('\\n').length<3); return rows.slice(-1)[0]||'' }")
with sync_playwright() as pw:
    b=pw.chromium.launch(); p=b.new_page(viewport={'width':1905,'height':910})
    p.clock.install()
    boot(p, fast=True); p.wait_for_timeout(1500)
    badge=p.evaluate("() => { const l=[...document.querySelectorAll('.dicon')].find(d=>/Chatterbox/.test(d.innerText)); return l? l.innerText.replace(/\\s+/g,' ') : '' }")
    print('chatterbox icon text (badge first):', badge)
    p.locator('.dicon').filter(has=p.locator('.lbl', has_text=re.compile('^Chatterbox$'))).dblclick(force=True); p.wait_for_timeout(900)
    dots=p.evaluate("() => [...document.querySelectorAll('#window-layer span')].filter(s=>s.style.background==='rgb(208, 52, 44)').map(s=>s.parentElement.innerText.trim())")
    print('buddies with a red dot:', dots)
    def chat(name, lines):
        p.get_by_text(name, exact=True).first.click(); p.wait_for_timeout(500)
        for t in lines:
            p.locator('input').last.fill(t); p.keyboard.press('Enter'); p.clock.run_for(4000); p.wait_for_timeout(300)
        txt=p.locator('#window-layer').inner_text()
        tail=[l for l in txt.split('\n') if ':' in l][-2*len(lines):]
        print('---', name); print('\n'.join(tail))
    chat('dad', ['hi dad i miss you','wyd','huh','mmm no'])
    chat('maddie_bug53353', ['hi','swimming','i went to the pool'])
    chat('grandma', ['hi grandma','okay bye'])
    p.locator('[aria-label="Close"]').last.click(); p.wait_for_timeout(400)
    p.clock.run_for(5*60*1000+2000); p.wait_for_timeout(1200)
    head=p.locator('#window-layer').inner_text()
    print('after 5 min, Maddie chat open:', 'r u on yourworld' in head)
    p.locator('[aria-label="Step back from the computer"]').click(); p.wait_for_timeout(1500)
    p.evaluate("() => document.querySelector('[data-screen]').setAttribute('data-probe','1')")
    p.set_viewport_size({'width':800,'height':560}); p.wait_for_timeout(800)
    small_text=p.locator('body').inner_text()
    print('small screen says:', [l for l in small_text.split('\n') if 'screen' in l.lower()][:2])
    p.set_viewport_size({'width':1905,'height':910}); p.wait_for_timeout(900)
    print('same screen kept (no power-on replay):', p.evaluate("() => !!document.querySelector('[data-screen][data-probe]')"))
    b.close()
