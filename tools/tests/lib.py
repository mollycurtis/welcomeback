import os
from playwright.sync_api import sync_playwright
SHOTS=os.environ.get('SHOT_DIR', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'screenshots')) + '/'
os.makedirs(SHOTS, exist_ok=True)

def boot(p, fast=True):
    if fast: p.add_init_script('window.__FINN_FAST__ = true')
    p.goto(os.environ.get('BASE_URL', 'http://localhost:4321/'), wait_until='networkidle'); p.wait_for_timeout(600)
    p.click('[aria-label="Power"]')
    for i in range(40):
        p.wait_for_timeout(800)
        if 'Owner' in p.inner_text('body'): break
    p.click('text=Owner'); p.wait_for_timeout(700)
    p.fill('input','x'); p.keyboard.press('Enter')
    p.wait_for_timeout(5000)
