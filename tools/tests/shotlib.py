import os
from PIL import Image
OUT=os.environ.get('SHOT_DIR', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'screenshots'))+'/'

def window_box(p):
    """Rect of the WorldWindow frame. Anchored on the address bar's title-bar sibling
    rather than 'first ancestor over 400px tall', because an open overlay changed which
    ancestor matched and silently produced badly offset crops."""
    return p.evaluate("""()=>{
      const inp=document.querySelector('input.bevel-in');
      let el=inp;
      while(el && !(el.previousElementSibling && /WorldWindow/.test(el.previousElementSibling.textContent||''))) el=el.parentElement;
      el = el ? el.parentElement : null;
      if(!el){ el=inp; while(el && el.getBoundingClientRect().height<400) el=el.parentElement; }
      const b=el.getBoundingClientRect();
      return {x:b.left,y:b.top,w:b.width,h:b.height};
    }""")

def grab(p, name, box=None):
    """Always re-measure at capture time: a box captured earlier can go stale."""
    import tempfile; tmp=os.path.join(tempfile.gettempdir(), f'_raw_{name}.png')
    p.screenshot(path=tmp)
    im=Image.open(tmp)
    b = window_box(p)
    if b and b['w']>300 and b['h']>300:
        im=im.crop((int(b['x']), int(b['y']), int(b['x']+b['w']), int(b['y']+b['h'])))
    os.makedirs(OUT, exist_ok=True); im.save(OUT+name+'.png')
    os.remove(tmp)
    return OUT+name+'.png'
