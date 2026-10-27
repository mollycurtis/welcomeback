import fs from 'fs';
const src = fs.readFileSync('lib/finn/content.ts','utf8');
const grab = (name) => {
  const i = src.indexOf(`export const ${name}`);
  const a = src.indexOf('[', i); const b = src.indexOf('\n];', i);
  return eval(src.slice(a, b+2));
};
const SCENES=grab('SCENES'), CHARACTERS=grab('CHARACTERS'), ITEMS=grab('ITEMS'),
      NOTEBOOK=grab('NOTEBOOK'), WONDERS=grab('WONDERS');
const ex = p => fs.existsSync('public'+p);
let bad=0; const fail=(m)=>{console.log('  ✗ '+m); bad++;};

console.log(`SCENES ${SCENES.length} | CHARACTERS ${CHARACTERS.length} | ITEMS ${ITEMS.length} | NOTEBOOK ${NOTEBOOK.length} | WONDERS ${WONDERS.length}`);

console.log('\n-- assets --');
SCENES.forEach(s=>{ if(!ex(s.background)) fail(`scene ${s.id} missing ${s.background}`); });
CHARACTERS.forEach(c=>{ if(!ex(c.sprite)) fail(`char ${c.id} missing ${c.sprite}`);
  if(c.spriteTalk && !ex(c.spriteTalk)) fail(`char ${c.id} missing talk ${c.spriteTalk}`); });
ITEMS.forEach(i=>{ if(!ex(i.icon)) fail(`item ${i.id} missing ${i.icon}`); });
console.log(bad?'':'  all asset paths resolve');

console.log('\n-- geometry (band 0.078-0.922, corners clear) --');
const b4=bad;
const boxes=[];
SCENES.forEach(s=>{
  (s.hotspots||[]).forEach(h=>boxes.push([s.id,'hotspot',h.label,h]));
  (s.exits||[]).forEach(e=>boxes.push([s.id,'exit',e.label,e]));
});
CHARACTERS.forEach(c=>boxes.push(['(character)','char',c.name,c]));
boxes.forEach(([sid,kind,label,b])=>{
  const cx=b.x+b.w/2, cy=b.y+b.h/2;
  if(cy<0.078||cy>0.922) fail(`${sid} ${kind} "${label}" centre y ${cy.toFixed(3)} outside band`);
  if(kind!=='char'){
    if(cx<0.20&&cy>0.82) fail(`${sid} ${kind} "${label}" in pouch corner`);
    if(cx>0.70&&cy>0.82) fail(`${sid} ${kind} "${label}" in Notebook/Menu corner`);
  }
  if(b.x<-0.001||b.y<-0.001||b.x+b.w>1.001||b.y+b.h>1.001) fail(`${sid} ${kind} "${label}" box off image`);
});
if(bad===b4) console.log(`  ${boxes.length} boxes, all inside the safe band`);

console.log('\n-- map connectivity --');
const ids=new Set(SCENES.map(s=>s.id)); const b5=bad;
SCENES.forEach(s=>(s.exits||[]).forEach(e=>{ if(!ids.has(e.to)) fail(`${s.id} -> missing scene ${e.to}`); }));
const adj={}; SCENES.forEach(s=>adj[s.id]=(s.exits||[]).map(e=>e.to));
let seen=new Set(['moon-shell-plaza']),q=['moon-shell-plaza'];
while(q.length){const n=q.pop();(adj[n]||[]).forEach(t=>{if(!seen.has(t)){seen.add(t);q.push(t);}});}
SCENES.filter(s=>!seen.has(s.id)).forEach(s=>fail(`unreachable scene ${s.id}`));
if(bad===b5) console.log(`  all ${SCENES.length} scenes reachable, no dangling exits`);

console.log('\n-- characters placed --');
const placed=new Set(); SCENES.forEach(s=>(s.characters||[]).forEach(c=>placed.add(c)));
CHARACTERS.forEach(c=>{ if(!placed.has(c.id)) console.log(`  · ${c.name} (${c.id}) has art and dialogue but is in no scene`); });
[...placed].forEach(id=>{ if(!CHARACTERS.find(c=>c.id===id)) fail(`scene references unknown character ${id}`); });
console.log(`  ${placed.size} of ${CHARACTERS.length} characters placed`);

console.log('\n-- flags, items, notebook, wonders referenced but never produced --');
const setF=new Set(), needF=new Set(), give=new Set(), needI=new Set(), nb=new Set(), wo=new Set(), res=new Set();
const fx=(f)=>{ if(!f) return; (f.setFlags||[]).forEach(x=>setF.add(x)); (f.giveItems||[]).forEach(x=>give.add(x));
  (f.takeItems||[]).forEach(x=>needI.add(x)); (f.notebook||[]).forEach(x=>nb.add(x));
  (f.wonder||[]).forEach(x=>wo.add(x)); (f.resolveWonder||[]).forEach(x=>res.add(x)); };
const req=(r)=>{ if(!r) return; (r.flags||[]).forEach(x=>needF.add(x)); (r.notFlags||[]).forEach(x=>needF.add(x));
  (r.items||[]).forEach(x=>needI.add(x)); (r.notItems||[]).forEach(x=>needI.add(x)); };
SCENES.forEach(s=>{ fx(s.onEnter);
  (s.hotspots||[]).forEach(h=>{ req(h.requires); fx(h.onClick); Object.entries(h.onUse||{}).forEach(([k,v])=>{needI.add(k); fx(v);}); });
  (s.exits||[]).forEach(e=>req(e.requires)); });
CHARACTERS.forEach(c=>{ (c.dialogue||[]).forEach(d=>{ req(d.requires); fx(d.effects);
    (d.replies||[]).forEach(r=>{ req(r.requires); fx(r.effects); }); });
  Object.entries(c.onGive||{}).forEach(([k,v])=>{ needI.add(k); fx(v); }); });
[...needF].filter(f=>!setF.has(f)).forEach(f=>fail(`flag "${f}" is required but never set`));
[...needI].filter(i=>!give.has(i)).forEach(i=>{
  const combined = ITEMS.some(it=>Object.values(it.combine||{}).some(c=>c.into===i));
  if(!combined) fail(`item "${i}" is used but never given`);
});
[...nb].filter(n=>!NOTEBOOK.find(x=>x.id===n)).forEach(n=>fail(`notebook entry "${n}" referenced but not defined`));
[...wo,...res].filter(w=>!WONDERS.find(x=>x.id===w)).forEach(w=>fail(`wonder "${w}" referenced but not defined`));
ITEMS.forEach(i=>{ if(!give.has(i.id) && !ITEMS.some(x=>Object.values(x.combine||{}).some(c=>c.into===i.id)))
  console.log(`  · item "${i.id}" has art but is not obtainable yet`); });
NOTEBOOK.forEach(n=>{ if(!nb.has(n.id)) fail(`notebook entry "${n.id}" defined but never awarded`); });
WONDERS.forEach(w=>{ if(!wo.has(w.id)) fail(`wonder "${w.id}" defined but never raised`); });

console.log(`\nPROBLEMS: ${bad}`);
