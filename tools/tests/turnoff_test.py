import os
import re, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from lib import boot, SHOTS
S=os.path.join(SHOTS, 'turnoff') + '/'; os.makedirs(S, exist_ok=True); R={}
def scr(p): return p.locator('[data-screen]').bounding_box()
def body(p): return p.inner_text('body')
with sync_playwright() as pw:
    b=pw.chromium.launch(); p=b.new_page(viewport={'width':1905,'height':910}); errs=[]
    p.on('pageerror', lambda e: errs.append(str(e)[:200]))
    boot(p, fast=True); p.wait_for_timeout(1500)
    p.locator('[aria-label="Step back from the computer"]').click(); p.wait_for_timeout(1600)
    p.click('[aria-label="Power"]'); p.wait_for_timeout(1900)
    R['dialog_from_power']=p.locator('[role="dialog"][aria-label="Turn off computer"]').count()==1
    p.screenshot(path=S+'1_turnoff.png', clip=scr(p))
    p.locator('[role="dialog"] button', has_text='Cancel').click(); p.wait_for_timeout(600)
    R['cancel_closes']=p.locator('[role="dialog"][aria-label="Turn off computer"]').count()==0
    p.locator('button:has-text("start")').first.click(); p.wait_for_timeout(500); p.get_by_text('Shut Down').first.click(); p.wait_for_timeout(900)
    R['dialog_from_start']=p.locator('[role="dialog"][aria-label="Turn off computer"]').count()==1
    p.locator('[aria-label="Stand By"]').click(); p.wait_for_timeout(1400); p.screenshot(path=S+'2_standby.png', clip=scr(p))
    R['standby_dark']=p.evaluate("() => { const d=[...document.querySelectorAll('div.bg-black')].find(x=>x.style.zIndex==='99995'); return d ? getComputedStyle(d).opacity : null }")
    p.wait_for_timeout(600); bx=scr(p); p.mouse.move(bx['x']+300,bx['y']+300); p.mouse.move(bx['x']+340,bx['y']+320); p.wait_for_timeout(800)
    R['woke']=p.evaluate("() => ![...document.querySelectorAll('div.bg-black')].some(x=>x.style.zIndex==='99995')")
    p.locator('button:has-text("start")').first.click(); p.wait_for_timeout(500); p.get_by_text('Shut Down').first.click(); p.wait_for_timeout(800)
    p.locator('[aria-label="Restart"]').click(); t0=time.time()
    p.wait_for_timeout(2500); p.screenshot(path=S+'3_restarting.png', clip=scr(p))
    for i in range(40):
        if 'To begin, click your user name' in body(p): break
        p.wait_for_timeout(700)
    R['restart_back_to_login_s']=round(time.time()-t0,1) if 'To begin, click your user name' in body(p) else None
    p.screenshot(path=S+'4_after_restart.png', clip=scr(p))
    p.get_by_text('Turn off computer').first.click(); p.wait_for_timeout(900)
    R['dialog_from_login']=p.locator('[role="dialog"][aria-label="Turn off computer"]').count()==1
    p.screenshot(path=S+'5_login_turnoff.png', clip=scr(p))
    p.locator('[aria-label="Turn Off"]').click(); p.wait_for_timeout(6500)
    R['off_power_label']=p.locator('[aria-label="Power"]').count()
    pb=p.locator('[aria-label="Power"]').bounding_box()
    p.screenshot(path=S+'6_off_room.png')
    R['errors']=errs
    b.close()
for k,v in R.items(): print(k,'::',v)
