'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from 'react';
import { MG, MGButton, MGPanel, Coin, TicketIcon } from '../ui';
import { Scene, useToast } from '../SetPieces';
import { Hotspot } from '../Backdrop';

import { ResidentSprites, useTalk } from '../Residents';
import { sounds } from '@/lib/sounds';
import { useMaple } from '@/store/maplegrove';
import { currentSeason } from '@/lib/maplegrove/season';

export const FISH_ART: Record<string, string> = { f_bluegill: 'bluegill', f_perch: 'perch', f_bass: 'bass', f_walleye: 'walleye', f_gold: 'sunfish', f_boot: 'boot' };
const FISH = [
  { id: 'f_bluegill', name: 'Bluegill', rarity: 'common', bucks: 8, w: 0.45 },
  { id: 'f_perch', name: 'Yellow Perch', rarity: 'common', bucks: 10, w: 0.25 },
  { id: 'f_bass', name: 'Largemouth Bass', rarity: 'uncommon', bucks: 22, w: 0.16 },
  { id: 'f_walleye', name: 'Walleye', rarity: 'rare', bucks: 40, w: 0.09 },
  { id: 'f_gold', name: 'Golden Sunfish', rarity: 'epic', bucks: 90, w: 0.04 },
  { id: 'f_boot', name: 'Old Boot', rarity: 'common', bucks: 1, w: 0.01 },
] as const;

export function Lakeville() {
  const { flash, node } = useToast(); const { talk, panel } = useTalk();
  const addBucks = useMaple((st) => st.addBucks); const catchFish = useMaple((st) => st.catchFish); const fish = useMaple((st) => st.fish); const recordActivity = useMaple((st) => st.recordActivity);
  const [state, setState] = useState<'idle' | 'waiting' | 'bite' | 'result'>('idle');
  const [result, setResult] = useState<typeof FISH[number] | null>(null);
  const dailies = useMaple((st) => st.dailies);
  const doDaily = useMaple((st) => st.doDaily);
  const today = (() => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; })();
  const casts = Array.from({ length: 8 }, (_, i) => `fish_cast_${i + 1}`).filter((k) => dailies[k] === today).length;
  const timer = useRef(0);
  const cast = () => { if (casts >= 8) { flash('The fish are done for today. Come back tomorrow.'); return; } doDaily(`fish_cast_${casts + 1}`); setState('waiting'); setResult(null); timer.current = window.setTimeout(() => { setState('bite'); timer.current = window.setTimeout(() => { setState('idle'); flash('It got away.'); }, 1100); }, 1500 + Math.random() * 3000); };
  const reel = () => {
    if (state !== 'bite') { if (state === 'waiting') { window.clearTimeout(timer.current); setState('idle'); flash('Too early, nothing on the line.'); } return; }
    window.clearTimeout(timer.current);
    let r = Math.random(); let f: typeof FISH[number] = FISH[0]; for (const x of FISH) { r -= x.w; if (r <= 0) { f = x; break; } }
    setResult(f); setState('result'); addBucks(f.bucks); catchFish(f.id); recordActivity('fish');
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const unique = new Set(fish).size;
  return (
    <Scene bg="lakeville" loc="riverside" title="Lakeville"
      flavor="Slow down. Cast a line off the dock, the lake gives up something to everyone who waits."
      overlay={<>
      <div style={{ position: 'absolute', right: 8, top: 40, zIndex: 8, width: 190 }}>
        <MGPanel pad={8} style={{ background: MG.paper }}>
          <div style={{ fontWeight: 900, color: MG.blue, fontSize: 12, textTransform: 'uppercase' }}>Fishing</div>
          <div style={{ fontSize: 10, color: MG.sub, margin: '3px 0 6px' }}>Cast, wait for the bobber to dip, then reel. {8 - casts} casts left today. Collection: {unique}/{FISH.length}.</div>
          {state === 'idle' || state === 'result' ? <MGButton color="green" style={{ width: '100%', fontSize: 12 }} onClick={cast}>Cast line</MGButton>
            : <MGButton color={state === 'bite' ? 'leaf' : 'gold'} style={{ width: '100%', fontSize: 12 }} onClick={reel}>{state === 'bite' ? 'REEL IT IN!' : 'Waiting…'}</MGButton>}
          {result && <div style={{ marginTop: 6, fontSize: 11, textAlign: 'center' }}><img src={`/maplegrove/icons/fish/${FISH_ART[result.id] ?? 'bluegill'}.png`} alt="" draggable={false} style={{ width: 64, height: 64, objectFit: 'contain', maxWidth: 'none', display: 'block', margin: '0 auto 2px' }} /><b style={{ color: MG.blueDk }}>{result.name}</b><br /><span style={{ color: MG.greenDk, fontWeight: 800 }}><Coin size={11} /> +{result.bucks}</span> <span style={{ fontSize: 9, color: MG.sub }}>({result.rarity})</span></div>}
        </MGPanel>
      </div>
      </>}>
      <Hotspot x={72} y={44} w={22} h={18} label="The dock" sub={state === 'idle' || state === 'result' ? 'cast a line' : state === 'bite' ? 'REEL!' : 'waiting…'} onClick={state === 'bite' ? reel : state === 'waiting' ? reel : cast} labelAt="top" />
      <Hotspot x={27} y={44} w={12} h={8} label="Swim raft" sub="too cold today" disabled labelAt="top" />
      {state !== 'idle' && state !== 'result' && (
        <div style={{ position: 'absolute', left: '58%', top: '52%', zIndex: 5, pointerEvents: 'none', transition: 'transform 200ms', transform: state === 'bite' ? 'translateY(10px)' : 'none' }}>
          <div style={{ width: 16, height: 16, borderRadius: 8, background: 'linear-gradient(#ff5b5b 50%, #fff 50%)', border: '2px solid #b02020', boxShadow: '0 2px 3px rgba(0,0,0,0.3)', animation: 'mg-bob 1.8s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', left: '50%', top: '90%', width: 30, height: 10, marginLeft: -15, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.5)', animation: 'mg-ripple 1.8s ease-out infinite' }} />
          {state === 'bite' && <div style={{ position: 'absolute', left: '50%', top: -26, transform: 'translateX(-50%)', fontSize: 12, fontWeight: 900, color: '#fff', textShadow: '0 0 4px #000', whiteSpace: 'nowrap', animation: 'mg-bob 0.4s ease-in-out infinite' }}>REEL!</div>}
        </div>
      )}
      <ResidentSprites loc="riverside" onTalk={talk} />
      {node}{panel}
    </Scene>
  );
}

const CROPS: Record<string, { id: string; name: string; n: number }[]> = {
  spring: [{ id: 'g_carrots', name: 'carrots', n: 2 }, { id: 'g_peach', name: 'strawberries', n: 1 }],
  summer: [{ id: 'g_peach', name: 'peaches', n: 2 }, { id: 'g_carrots', name: 'sweet corn', n: 1 }],
  fall: [{ id: 'g_apple', name: 'apples', n: 2 }, { id: 'g_cider', name: 'a jug of cider', n: 1 }],
  winter: [{ id: 'g_cocoa', name: 'cocoa from the farm store', n: 1 }, { id: 'g_carrots', name: 'root vegetables', n: 1 }],
};
export function Farm() {
  const { flash, node } = useToast(); const { talk, panel } = useTalk(); const s = currentSeason();
  const doDaily = useMaple((st) => st.doDaily); const addPantry = useMaple((st) => st.addPantry); const addBucks = useMaple((st) => st.addBucks); const dailies = useMaple((st) => st.dailies); const recordActivity = useMaple((st) => st.recordActivity);
  const [picked, setPicked] = useState<string[]>([]);
  const crops = CROPS[s.id] ?? CROPS.fall;
  const today = (() => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; })();
  const done = dailies['farm_harvest'] === today;
  const pick = (c: { id: string; name: string; n: number }) => {
    if (picked.includes(c.id) || done) { flash(done ? 'Picked clean for today. Come back tomorrow.' : 'Already in your basket.'); return; }
    setPicked((p) => [...p, c.id]); addPantry(c.id, c.n); recordActivity('harvest');
    flash(`Picked ${c.name}. Into the pantry, someone in town would love those.`);
    if (picked.length + 1 >= crops.length) { doDaily('farm_harvest'); addBucks(20); useMaple.getState().addBucks(0); flash(`Hazel paid you 20 Maple Bucks for helping with the harvest.`); }
  };
  return (
    <Scene bg="farm" loc="farm" title="Farmington"
      flavor="Brooks Orchard. Help with the harvest once a day; what you pick goes to your pantry as gifts."
      overlay={<>
      <div style={{ position: 'absolute', right: 8, top: 40, zIndex: 8, width: 200 }}>
        <MGPanel pad={8} style={{ background: MG.paper }}>
          <div style={{ fontWeight: 900, color: MG.blue, fontSize: 12, textTransform: 'uppercase' }}>{s.name} harvest</div>
          <div style={{ fontSize: 10, color: MG.sub, margin: '3px 0 6px' }}>{done ? 'Done for today. Hazel says thanks.' : 'Click what is ready. Fill the basket for 20 Maple Bucks.'}</div>
          {crops.map((c) => <MGButton key={c.id} color={picked.includes(c.id) || done ? 'plain' : 'green'} disabled={picked.includes(c.id) || done} style={{ width: '100%', fontSize: 11, marginBottom: 4 }} onClick={() => pick(c)}>{picked.includes(c.id) || done ? '✓ ' : ''}Pick {c.name}</MGButton>)}
        </MGPanel>
      </div>
      </>}>
      <ResidentSprites loc="farm" bottom="6%" size={66} onTalk={talk} />
      {node}{panel}
    </Scene>
  );
}

const TRAIL = [{ id: 'pinecone', name: 'a perfect pinecone', x: '19%', b: '22%' }, { id: 'feather', name: 'a blue jay feather', x: '58%', b: '30%' }, { id: 'arrowhead', name: 'an arrowhead', x: '73%', b: '26%' }];
export function PineRidge() {
  const { flash, node } = useToast(); const { talk, panel } = useTalk();
  const doDaily = useMaple((st) => st.doDaily); const addBucks = useMaple((st) => st.addBucks); const dailies = useMaple((st) => st.dailies); const recordActivity = useMaple((st) => st.recordActivity);
  const [found, setFound] = useState<string[]>([]);
  const today = (() => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; })();
  const done = dailies['trail'] === today;
  const find = (t: typeof TRAIL[number]) => {
    if (found.includes(t.id) || done) return;
    const f = [...found, t.id]; setFound(f); addBucks(10); recordActivity('trail'); flash(`Found ${t.name}. +10 Maple Bucks.`);
    if (f.length === TRAIL.length) { doDaily('trail'); useMaple.getState().addBucks(15); flash('You found everything on the trail today. +15 bonus.'); }
  };
  return (
    <Scene bg="woodbury" loc="pineridge" title="Woodbury"
      flavor="Woodbury's little main street. Three things are hidden around it every day, look closely."
      overlay={!done ? (<div style={{ position: 'absolute', right: 8, top: 40, zIndex: 8, width: 170 }}>
        <MGPanel pad={8} style={{ background: MG.paper }}>
          <div style={{ fontWeight: 900, color: MG.blue, fontSize: 12, textTransform: 'uppercase' }}>Trail hunt</div>
          <div style={{ fontSize: 10, color: MG.sub, marginTop: 3 }}>{found.length}/{TRAIL.length} found. Click the glints.</div>
        </MGPanel>
      </div>) : null}>
      <Hotspot x={1} y={30} w={16} h={22} label="The Daily Scoop" sub="coffee, run by the Maple Grove Café" onClick={() => useMaple.getState().goTo('cafe')} labelAt="bottom" />
      <Hotspot x={70} y={40} w={14} h={14} label="The fountain" sub="go to Grove Park" onClick={() => useMaple.getState().goTo('park')} labelAt="top" />
      {TRAIL.map((t) => !found.includes(t.id) && !done && (
        <button key={t.id} onClick={() => find(t)} aria-label="something glints" style={{ position: 'absolute', left: t.x, bottom: t.b, width: 30, height: 30, borderRadius: 15, background: 'radial-gradient(#ffffff, #ffe66d 35%, rgba(255,230,120,0.25) 70%, transparent)', border: 'none', cursor: 'pointer', zIndex: 6, boxShadow: '0 0 14px 4px rgba(255,230,109,0.8)', animation: 'mg-twinkle 1.2s ease-in-out infinite' }} />
      ))}
      <ResidentSprites loc="pineridge" onTalk={talk} />
      {node}{panel}
    </Scene>
  );
}

const WHEEL = [{ label: '10 tickets', t: 10 }, { label: '25 MB', b: 25 }, { label: '5 tickets', t: 5 }, { label: '50 MB', b: 50 }, { label: 'Try again', b: 5 }, { label: '20 tickets', t: 20 }, { label: '100 MB', b: 100 }, { label: '15 tickets', t: 15 }];
export function County() {
  const { flash, node } = useToast(); const { talk, panel } = useTalk();
  const doDaily = useMaple((st) => st.doDaily); const addBucks = useMaple((st) => st.addBucks); const addTickets = useMaple((st) => st.addTickets); const dailies = useMaple((st) => st.dailies); const recordActivity = useMaple((st) => st.recordActivity);
  const [angle, setAngle] = useState(0); const [spinning, setSpinning] = useState(false); const [won, setWon] = useState('');
  const today = (() => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; })();
  const done = dailies['fair_wheel'] === today;
  const spin = () => {
    sounds.rattle?.();
    if (spinning || done) { if (done) flash('One spin a day. The Fair is open tomorrow too.'); return; }
    const idx = Math.floor(Math.random() * WHEEL.length); const target = 360 * 4 + (360 - idx * 45) - 22;
    setSpinning(true); setAngle(target);
    window.setTimeout(() => { const w = WHEEL[idx]; if (w.b) addBucks(w.b); if (w.t) addTickets(w.t); doDaily('fair_wheel'); recordActivity('fair'); setWon(w.label); setSpinning(false); }, 3200);
  };
  return (
    <Scene bg="eagan" loc="county" title="Eagan Fairgrounds"
      flavor="The fairgrounds. One spin of the prize wheel a day, and the best corn dogs in the county."
      overlay={<div style={{ position: 'absolute', right: 8, top: 40, zIndex: 8, width: 180 }}>
        <MGPanel pad={8} style={{ background: MG.paper }}>
          <div style={{ fontWeight: 900, color: MG.blue, fontSize: 12, textTransform: 'uppercase' }}>Prize wheel</div>
          <div style={{ fontSize: 10, color: MG.sub, marginTop: 3 }}>{spinning ? 'Round and round...' : won ? <>You won <b>{won}</b>!</> : done ? 'Spun today. Come back tomorrow.' : 'Maple Bucks and Arcade Tickets. One spin a day, click the wheel.'}</div>
          <div style={{ fontSize: 9, color: MG.sub, marginTop: 4 }}><Coin size={10} /> spend at the shops · <TicketIcon size={10} /> spend at the Prize Corner</div>
          <MGButton color={done ? 'plain' : 'gold'} disabled={spinning} style={{ width: '100%', fontSize: 12, marginTop: 6 }} onClick={spin}>{done ? 'Spun today' : spinning ? 'Spinning...' : 'Spin the wheel'}</MGButton>
        </MGPanel>
      </div>}>
      <Hotspot x={55} y={34} w={24} h={44} label="Prize wheel" sub={done ? 'spun today' : 'click to spin'} onClick={spin} labelAt="top" />
      <div style={{ position: 'absolute', left: '67.2%', top: '56.5%', width: '2.4%', aspectRatio: '1 / 1', transform: `translate(-50%,-50%) rotate(${angle}deg)`, transition: spinning ? 'transform 3.2s cubic-bezier(0.15, 0.8, 0.2, 1)' : 'none', zIndex: 5, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', left: '50%', bottom: '50%', width: 4, height: '380%', marginLeft: -2, background: MG.gold, border: `1px solid ${MG.blueDk}`, borderRadius: 2 }} />
      </div>
      <Hotspot x={1} y={28} w={22} h={40} label="Corn Dogs" sub="free today" onClick={() => { if (useMaple.getState().doDaily('corn_dog')) { useMaple.getState().bumpStat('happy', 4); flash('One corn dog, extra mustard, on the house. (+happiness)'); } else flash('You already had your corn dog today. The line agrees.'); }} labelAt="bottom" />
      <ResidentSprites loc="county" onTalk={talk} />
      {node}{panel}
    </Scene>
  );
}

export function AppleValley() {
  const { flash, node } = useToast(); const { talk, panel } = useTalk();
  const doDaily = useMaple((st) => st.doDaily); const addBucks = useMaple((st) => st.addBucks); const dailies = useMaple((st) => st.dailies); const recordActivity = useMaple((st) => st.recordActivity);
  const pantry = useMaple((st) => st.pantry); const addPantry = useMaple((st) => st.addPantry);
  const [skips, setSkips] = useState<number[]>([]); const [charging, setCharging] = useState(false); const power = useRef(0); const raf = useRef(0); const [meter, setMeter] = useState(0);
  const today = (() => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; })();
  const done = dailies['stones'] === today;
  const start = () => {
    if (done || skips.length >= 3) return;
    setCharging(true); power.current = 0; setMeter(0);
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000); prev = now;
      power.current = (power.current + dt * 85) % 100;
      setMeter(power.current);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };
  const release = () => {
    if (!charging) return; cancelAnimationFrame(raf.current); setCharging(false);
    const p = power.current; const n = p > 88 ? 1 : p > 55 ? Math.round(3 + (p - 55) / 8) : Math.max(1, Math.round(p / 20));
    const ns = [...skips, n]; setSkips(ns); addBucks(n * 3); recordActivity('stones'); flash(n >= 6 ? `${n} skips! A perfect throw. +${n * 3} MB` : n === 1 ? 'Plunk. One skip. +3 MB' : `${n} skips. +${n * 3} MB`);
    if (ns.length >= 3) { doDaily('stones'); if (ns.reduce((a, b) => a + b, 0) >= 12) { useMaple.getState().addBucks(20); flash('Three good throws - a 20 MB bonus from the duck committee.'); } }
  };
  const feed = () => { const g = pantry['g_pretzels'] ? 'g_pretzels' : pantry['g_cookies'] ? 'g_cookies' : null; if (!g) { flash('The ducks are hungry. Buy pretzels or cookies at Maple Mart and come back.'); return; } addPantry(g, -1); recordActivity('ducks'); useMaple.getState().bumpStat('happy', 4); flash('The ducks approve. (+happiness)'); };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return (
    <Scene bg="applevalley" loc="applevalley" title="Apple Valley"
      flavor="The pond at Apple Valley. Skip stones off the bank, feed the ducks, sit a while."
      overlay={<>
      <div style={{ position: 'absolute', right: 8, top: 40, zIndex: 8, width: 190 }}>
        <MGPanel pad={8} style={{ background: MG.paper }}>
          <div style={{ fontWeight: 900, color: MG.blue, fontSize: 12, textTransform: 'uppercase' }}>Skip stones</div>
          <div style={{ fontSize: 10, color: MG.sub, margin: '3px 0 6px' }}>{done ? 'Arm is tired. Tomorrow.' : `Hold to wind up, release in the green. ${3 - skips.length} stones left.`}</div>
          <div style={{ height: 10, background: 'linear-gradient(90deg,#c62828 0 20%, #f5b400 20% 55%, #43a047 55% 88%, #c62828 88%)', border: `2px solid ${MG.blueDk}`, borderRadius: 3, position: 'relative', marginBottom: 6 }}>
            {charging && <div style={{ position: 'absolute', top: -4, bottom: -4, width: 3, background: '#000', left: `${meter}%` }} />}
          </div>
          <MGButton color={done || skips.length >= 3 ? 'plain' : 'gold'} disabled={done || skips.length >= 3} style={{ width: '100%', fontSize: 12 }} onClick={() => undefined}>
            <span onMouseDown={start} onMouseUp={release} onMouseLeave={release} onTouchStart={start} onTouchEnd={release} style={{ display: 'block' }}>{charging ? 'Release!' : 'Hold to throw'}</span>
          </MGButton>
          <MGButton color="green" style={{ width: '100%', fontSize: 11, marginTop: 6 }} onClick={feed}>Feed the ducks</MGButton>
        </MGPanel>
      </div>
      </>}>
      <Hotspot x={64} y={58} w={16} h={12} label="Ducks" sub="feed them" onClick={feed} labelAt="bottom" />
      <Hotspot x={73} y={20} w={16} h={30} label="Gazebo" sub="sit a while" onClick={() => { useMaple.getState().bumpStat('happy', 2); flash('You sit in the gazebo. The ducks carry on. (+happiness)'); }} labelAt="bottom" />
      {skips.map((n, i) => <div key={i} style={{ position: 'absolute', left: `${44 + i * 12}%`, top: `${66 - n}%`, fontSize: 10, color: '#fff', fontWeight: 900, textShadow: '0 0 3px #000', zIndex: 5, pointerEvents: 'none' }}>{'○'.repeat(Math.min(n, 8))}</div>)}
      <ResidentSprites loc="applevalley" onTalk={talk} />
      {node}{panel}
    </Scene>
  );
}
