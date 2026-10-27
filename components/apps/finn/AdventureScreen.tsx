'use client';
/* eslint-disable @next/next/no-img-element */

import { MiniGame, PaintedMap, type GameKind } from './MiniGames';
import React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { sounds } from '@/lib/sounds';
import { useFinn } from '@/store/finn';
import {
  SCENES, SEA_STARS_PLACED,
  sceneById, characterById, itemById, notebookById, wonderById, NEXT_STEPS } from '@/lib/finn/content';
import { meets, applyEffects, combineOf, type WorldActions } from '@/lib/finn/engine';
import type { DialogueNode, Effects, Hotspot, Exit, Character } from '@/lib/finn/types';
import { FN, FN_FONT, FN_ROUND, FNButton, CURSORS, fnShadow, useSceneBox, HOW_TO_PLAY } from './ui';
import { AmbientEngine } from './ambient';
import { ambienceFor } from '@/lib/finn/ambience';
import { FinnActor, type FinnHandle } from './FinnActor';
import { BLINKS } from '@/lib/finn/blinks';
import { MOUTHS } from '@/lib/finn/mouths';
import { useFinnPrefs, TEXT_CPS, SPEED_LABEL } from '@/lib/finn/prefs';
import { GAGS as CLICK_GAGS, EFFECT_GAGS, type GagMotion } from '@/lib/finn/gags';
import { Typewriter, type TypewriterHandle } from './Typewriter';
import { arrivalFor, besideTarget, exitMotion, finnHalfW, restPoint, type Box as SBox, type Entry } from './staging';

const preloaded = new Map<string, Promise<void>>();
const FINN_LINE = '\u2063';

export function preloadPainting(src: string): Promise<void> {
  let p = preloaded.get(src);
  if (!p) {
    p = new Promise<void>((resolve) => {
      const im = new Image();
      im.onload = () => { (im.decode ? im.decode() : Promise.resolve()).then(() => resolve(), () => resolve()); };
      im.onerror = () => resolve();
      im.src = src;
    });
    preloaded.set(src, p);
  }
  return p;
}
const cap = (p: Promise<unknown>, ms: number) => Promise.race([p, new Promise((r) => window.setTimeout(r, ms))]);

const isFast = () => typeof window !== 'undefined' && !!(window as unknown as { __FINN_FAST__?: boolean }).__FINN_FAST__;
const awaitPainting = (src: string) => (isFast() ? (preloadPainting(src), null) : cap(preloadPainting(src), 1600));

type Panel = null | 'notebook' | 'menu';

export function AdventureScreen({ onExit }: { onExit: () => void }) {
  const st = useFinn();
  const scene = sceneById(st.scene) ?? SCENES[0];

  const [lines, setLines] = useState<string[]>([]);
  const [speaker, setSpeaker] = useState<string | null>(null);
  const [node, setNode] = useState<DialogueNode | null>(null);
  const [talkingTo, setTalkingTo] = useState<string | null>(null);
  const [held, setHeld] = useState<string | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [pouch, setPouch] = useState(false);
  const [ending, setEnding] = useState(false);
  const [idle, setIdle] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const backTo = st.prevScene && st.prevScene !== st.scene ? sceneById(st.prevScene) : null;
  const [intro, setIntro] = useState(!st.flags.includes('seen-intro'));
  const [hover, setHover] = useState<string>('');
  const [entered, setEntered] = useState<string[]>([]);

  const finn = useRef<FinnHandle>(null);
  const backCv = useRef<HTMLCanvasElement>(null);
  const frontCv = useRef<HTMLCanvasElement>(null);
  const backFx = useRef<HTMLDivElement>(null);
  const bgImg = useRef<HTMLImageElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState<string | null>(null);
  const frontFx = useRef<HTMLDivElement>(null);
  const engine = useRef<AmbientEngine | null>(null);
  const flights = useRef<HTMLDivElement>(null);
  const pouchBtn = useRef<HTMLButtonElement>(null);
  const noteBtn = useRef<HTMLSpanElement>(null);
  const arrival = useRef<Entry>('fade');
  const enteredScene = useRef<string | null>(null);
  const lastSpot = useRef<{ nx: number; ny: number } | null>(null);
  const leaving = useRef(false);
  const prevInv = useRef<string[]>(st.inventory);
  const prevStars = useRef(st.seaStars.length);
  const prevNotes = useRef(st.notebook.length);
  const [reduced] = useState(false);
  const [finnAt, setFinnAt] = useState<{ nx: number; ny: number } | null>(null);
  const [hello, setHello] = useState<string | null>(null);
  const lidRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const mouthRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const gagLayer = useRef<HTMLDivElement>(null);
  const textSpeed = useFinnPrefs((s) => s.textSpeed);
  const [hidden, setHidden] = useState(false);
  const [hoverExit, setHoverExit] = useState<string | null>(null);
  const [leavingExit, setLeavingExit] = useState<string | null>(null);
  const gagReady = useRef<Set<string>>(new Set());
  const gagBusy = useRef<Set<string>>(new Set());
  const charRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const speakerRef = useRef<string | null>(null);
  const talkingRef = useRef(false);
  const parents = useRef<DialogueNode[]>([]);
  const pendingNudge = useRef(-1);
  const typer = useRef<TypewriterHandle>(null);

  const world = useMemo(() => ({ flags: st.flags, inventory: st.inventory }), [st.flags, st.inventory]);

  const actions: WorldActions = useMemo(() => ({
    setFlag: st.setFlag, clearFlag: st.clearFlag,
    give: st.give, take: st.take,
    addNotebook: st.addNotebook, addWonder: st.addWonder, resolveWonder: st.resolveWonder,
    addSeaStar: st.addSeaStar, goScene: st.goScene,
  }), [st.setFlag, st.clearFlag, st.give, st.take, st.addNotebook, st.addWonder, st.resolveWonder, st.addSeaStar, st.goScene]);

  const play = (name?: string) => {
    if (name === 'star') sounds.finnStar();
    else if (name === 'pickup') sounds.finnPickup();
    else if (name === 'discover') sounds.finnDiscover();
    else sounds.finnTalk();
  };

  const stepNow = () => {
    const w = useFinn.getState();
    return NEXT_STEPS.findIndex((x) => !x.done({ flags: w.flags, inventory: w.inventory }));
  };
  const heardNow = () => useFinn.getState().heard ?? [];
  const openQuestions = (n: DialogueNode) => (n.replies ?? []).filter((r) => r.to && meets(r.requires, world) && !heardNow().includes(r.to));
  const menuFor = (n: DialogueNode) => (n.replies ?? []).filter((r) => meets(r.requires, world) && !(r.to && heardNow().includes(r.to)));
  const nudgeLines = (i: number) => ([] as string[]).concat(NEXT_STEPS[i].say ?? []).map((s) => FINN_LINE + s);
  const nudged = (before: number, say: string[]) => {
    const after = stepNow();
    if (!(after > before && after >= 0 && NEXT_STEPS[after].say)) return say;
    if (talkingRef.current) { pendingNudge.current = after; return say; }
    return say.concat(nudgeLines(after));
  };
  const burst = (h: Hotspot, fx?: Effects) => {
    if (!fx?.glow) return;
    setGlow({ h, color: fx.glow, key: Date.now() });
    window.setTimeout(() => setGlow(null), 2000);
  };

  const run = (fx: Effects | undefined, who: string | null = null) => {
    const before = stepNow();
    const say = nudged(before, applyEffects(fx, actions));
    play(fx?.sound);
    if (say.length) { setSpeaker(who); setLines(say); }
  };

  useEffect(() => {
    let timer = 0;
    const arm = () => {
      window.clearTimeout(timer);
      setIdle(false);
      timer = window.setTimeout(() => { setIdle(true); sounds.finnIdleBubbles(); }, 10000);
    };
    arm();
    window.addEventListener('pointerdown', arm);
    return () => { window.clearTimeout(timer); window.removeEventListener('pointerdown', arm); };
  }, []);

  useEffect(() => {
    if (!idle) return;
    const id = window.setInterval(() => sounds.finnIdleBubbles(), 9000);
    return () => window.clearInterval(id);
  }, [idle]);

  useEffect(() => {
    if (!scene || entered.includes(scene.id)) return;
    setEntered((e) => [...e, scene.id]);
    if (scene.onEnter) run(scene.onEnter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene?.id]);

  const { ref, box, px, size } = useSceneBox(scene.bgW, scene.bgH);

  const advance = () => {
    if (lines.length > 1) { setLines(lines.slice(1)); return; }
    if (talkingRef.current && !(node && menuFor(node).length)) {
      while (parents.current.length) {
        const p = parents.current.pop()!;
        if (openQuestions(p).length) { setNode(p); setLines([]); return; }
      }
      closeTalk();
      return;
    }
    setLines([]);
    if (!node) { setSpeaker(null); setTalkingTo(null); }
  };

  const startTalk = (charId: string) => {
    const c = characterById(charId); if (!c) return;
    const entry = c.dialogue.find((d) => meets(d.requires, world));
    if (!entry) return;
    sounds.finnTalk();
    talkingRef.current = true;
    pendingNudge.current = -1;
    parents.current = [];
    setTalkingTo(charId);
    if (heardNow().includes(entry.id)) {
      setNode(entry);
      setSpeaker(charId);
      setLines(openQuestions(entry).length ? [] : entry.lines.slice(-1));
      return;
    }
    openNode(entry, charId);
  };

  const openNode = (n: DialogueNode, charId: string, before = stepNow()) => {
    const say = applyEffects(n.effects, actions);
    useFinn.getState().hear(n.id);
    setNode(n);
    setSpeaker(charId);
    setLines(nudged(before, n.lines.concat(say)));
  };

  const pickReply = (r: NonNullable<DialogueNode['replies']>[number]) => {
    if (r.effects?.game) { const g = r.effects.game; closeTalk(); setGame(g); return; }
    const before = stepNow();
    const say = applyEffects(r.effects, actions);
    if (r.to && talkingTo) {
      const c = characterById(talkingTo);
      const next = c?.dialogue.find((d) => d.id === r.to);
      if (next) { if (node) parents.current.push(node); openNode(next, talkingTo, before); return; }
    }
    const out = nudged(before, say);
    if (out.length) { setLines(out); return; }
    closeTalk();
  };

  const closeTalk = () => {
    setNode(null); setTalkingTo(null); setSpeaker(null); setLines([]);
    talkingRef.current = false;
    parents.current = [];
    const p = pendingNudge.current;
    pendingNudge.current = -1;
    if (p >= 0 && stepNow() === p && NEXT_STEPS[p].say) setLines(nudgeLines(p));
  };

  const winGame = (kind: GameKind) => {
    if (st.flags.includes('won-' + kind)) return false;
    st.setFlag('won-' + kind);
    st.addSeaStar('star-' + kind);
    return true;
  };


  const clickHotspot = (id: string) => {
    const h = (scene.hotspots ?? []).find((x) => x.id === id); if (!h) return;
    if (held) {
      const fx = h.onUse?.[held];
      if (fx && meets(fx.requires, world)) { setHeld(null); burst(h, fx); run(fx); return; }
      sounds.finnNope();
      setSpeaker(null);
      setLines(h.refuse ?? ['That does not do anything here.']);
      setHeld(null);
      return;
    }
    if (h.autoUse && h.onUse) {
      const use = h.onUse;
      const k = Object.keys(use).find((id) => st.inventory.includes(id) && meets(use[id].requires, world));
      if (k) { burst(h, use[k]); run(use[k]); return; }
    }
    const n = st.bumpClick(h.id);
    if (n === 1 || !h.repeat?.length) { burst(h, h.onClick); run(h.onClick); return; }
    const r = h.repeat[(n - 2) % h.repeat.length];
    sounds.finnTalk();
    setSpeaker(null);
    setLines([r]);
  };

  const clickCharacter = (id: string) => {
    const c = characterById(id); if (!c) return;
    if (held) {
      const fx = c.onGive?.[held];
      if (fx && meets(fx.requires, world)) { setHeld(null); run(fx, id); return; }
      sounds.finnNope();
      setSpeaker(id);
      setLines(c.refuse ?? ['They do not want that.']);
      setHeld(null);
      return;
    }
    startTalk(id);
  };

  const clickExit = (id: string) => {
    const e = (scene.exits ?? []).find((x) => x.id === id); if (!e) return;
    if (!meets(e.requires, world)) {
      sounds.finnNope(); setSpeaker(null); setLines(e.blocked ?? ['Finn cannot get through that way yet.']);
      return;
    }
    sounds.finnSwim();
    setLines([]); setSpeaker(null); setHeld(null); closeTalk();
    st.goScene(e.to);
  };

  const visibleHotspots = (scene.hotspots ?? []).filter((h) => meets(h.requires, world));
  const glints = (h: Hotspot) =>
    collectable(h) || (h.kind === 'essential' && !!h.onUse && Object.keys(h.onUse).some((k) => st.inventory.includes(k)));
  const pearlIn = (h: Hotspot) => (h.onClick?.giveItems ?? []).find((i) => i.startsWith('pearl-'));
  const spotBoxes = (): SBox[] =>
    (scene.hotspots ?? []).filter((x) => x.kind === 'essential' || (collectable(x) && meets(x.requires, world)))
      .map((x) => ({ x: x.x, y: x.y, w: x.w, h: x.h }));
  const [glow, setGlow] = useState<{ h: Hotspot; color: string; key: number } | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [game, setGame] = useState<GameKind | null>(null);
  useEffect(() => {
    if (lines.length || node || mapOpen || game) return;
    if (st.inventory.includes('current-map') && !st.flags.includes('map-seen')) {
      st.setFlag('map-seen');
      setMapOpen(true);
    }
  }, [lines.length, node, mapOpen, game, st]);
  useEffect(() => { setHover(''); }, [scene.id]);
  const sceneChars = (scene.characters ?? []).map(characterById).filter((c): c is Character => !!c && meets(c.requires, world));
  const busy = lines.length > 0;

  const halfW = finnHalfW(scene.bgW, scene.bgH);
  const toPxN = (nx: number, ny: number) => ({ x: box.ox + nx * box.sw, y: box.oy + ny * box.sh });
  const pointerNx = box.sw ? (pointer.x - box.ox) / box.sw : null;

  const centerOf = (el: Element | null) => {
    const host = ref.current;
    if (!el || !host) return null;
    const hr = host.getBoundingClientRect(), r = el.getBoundingClientRect();
    const k = hr.width ? host.offsetWidth / hr.width : 1;
    return { x: (r.left - hr.left + r.width / 2) * k, y: (r.top - hr.top + r.height / 2) * k };
  };

  const fly = (src: string, from: { x: number; y: number }, to: { x: number; y: number }, sz: number, dur = 720) =>
    new Promise<void>((resolve) => {
      const layer = flights.current;
      if (!layer || reduced) { resolve(); return; }
      const img = document.createElement('img');
      img.src = src; img.alt = ''; img.draggable = false;
      Object.assign(img.style, {
        position: 'absolute', left: '0', top: '0', width: `${sz}px`, height: `${sz}px`, objectFit: 'contain',
        pointerEvents: 'none', willChange: 'transform', filter: 'drop-shadow(0 3px 4px rgba(0,0,0,.5))',
      });
      layer.appendChild(img);
      const dist = Math.hypot(to.x - from.x, to.y - from.y);
      const cx = (from.x + to.x) / 2, cy = Math.min(from.y, to.y) - Math.min(95, dist * 0.35 + 28);
      const spin = (to.x < from.x ? -1 : 1) * 210;
      const frames: Keyframe[] = [];
      for (let i = 0; i <= 18; i++) {
        const t = i / 18, u = 1 - t;
        const x = u * u * from.x + 2 * u * t * cx + t * t * to.x;
        const y = u * u * from.y + 2 * u * t * cy + t * t * to.y;
        const sc = t < 0.16 ? 1 + (t / 0.16) * 0.4 : 1.4 - ((t - 0.16) / 0.84) * 0.85;
        frames.push({ transform: `translate(${x - sz / 2}px, ${y - sz / 2}px) rotate(${spin * t}deg) scale(${sc})`, opacity: t > 0.9 ? (1 - t) / 0.1 : 1 });
      }
      const a = img.animate(frames, { duration: isFast() ? 20 : dur, easing: 'cubic-bezier(.3,.08,.35,1)' });
      const done = () => { img.remove(); resolve(); };
      a.finished.then(done, done);
    });

  const gulpPouch = () => {
    pouchBtn.current?.animate([
      { transform: 'scale(1)' }, { transform: 'scale(1.24, .86)', offset: 0.35 },
      { transform: 'scale(.92, 1.08)', offset: 0.65 }, { transform: 'scale(1)' },
    ], { duration: 420, easing: 'ease-out' });
  };
  const shineNotebook = () => {
    const b = noteBtn.current?.querySelector('button');
    b?.animate([
      { boxShadow: '0 3px 0 rgba(0,0,0,.35), 0 0 0 0 rgba(255,240,170,0)' },
      { boxShadow: '0 3px 0 rgba(0,0,0,.35), 0 0 0 5px rgba(255,240,170,.8)', offset: 0.3 },
      { boxShadow: '0 3px 0 rgba(0,0,0,.35), 0 0 0 13px rgba(255,240,170,0)' },
    ], { duration: 1100, iterations: 2, easing: 'ease-out' });
  };

  const approach = async (b: SBox, avoid: SBox[] = []): Promise<boolean> => {
    lastSpot.current = { nx: b.x + b.w / 2, ny: b.y + b.h / 2 };
    const f = finn.current;
    if (!f) return true;
    if (busy) closeTalk();
    const others = spotBoxes().filter((o) => !(o.x === b.x && o.y === b.y && o.w === b.w && o.h === b.h));
    const spot = besideTarget(b, f.pos(), halfW, avoid.concat(others));
    return f.swimTo({ nx: spot.nx, ny: spot.ny }, spot.face);
  };

  const charBoxes = (except?: string): SBox[] =>
    sceneChars.filter((o) => o && o.id !== except).map((o) => ({ x: o!.x, y: o!.y, w: o!.w, h: o!.h }));

  const onSpot = async (h: Hotspot) => {
    if (leaving.current) return;
    const b: SBox = { x: h.x, y: h.y, w: h.w, h: h.h };
    if (!(await approach(b, charBoxes()))) return;
    const target = toPxN(b.x + b.w / 2, b.y + b.h / 2);
    const useFx = held ? h.onUse?.[held] : undefined;
    if (held && useFx && meets(useFx.requires, world)) {
      const it = itemById(held);
      if (it) await fly(it.icon, centerOf(pouchBtn.current) ?? target, target, 30, 540);
      engine.current?.burst(target.x, target.y);
      finn.current?.react('grab');
    } else if (held) {
      finn.current?.react('nope');
    } else if (h.cursor === 'take') {
      finn.current?.react('grab');
    } else {
      finn.current?.react('lean', b.x + b.w / 2);
      engine.current?.glint(target.x, target.y, 3);
      playGag(`${scene.id}/${h.id}`, target);
    }
    clickHotspot(h.id);
  };

  const onChar = async (c: Character) => {
    if (leaving.current) return;
    const b: SBox = { x: c.x, y: c.y, w: c.w, h: c.h };
    if (!(await approach(b, charBoxes(c.id)))) return;
    if (held) {
      const fx = c.onGive?.[held];
      const target = toPxN(b.x + b.w / 2, b.y + b.h * 0.45);
      if (fx && meets(fx.requires, world)) {
        const it = itemById(held);
        if (it) await fly(it.icon, centerOf(pouchBtn.current) ?? target, target, 30, 540);
        engine.current?.burst(target.x, target.y);
        setHello(c.id);
      } else {
        finn.current?.react('nope');
      }
    } else {
      setHello(c.id);
    }
    window.setTimeout(() => setHello((x) => (x === c.id ? null : x)), 620);
    clickCharacter(c.id);
  };

  const dip = () => {
    const v = veil.current;
    if (!v || reduced || isFast()) { if (v) v.style.opacity = '1'; return Promise.resolve(); }
    v.getAnimations().forEach((a) => a.cancel());
    const a = v.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 170, easing: 'ease-in' });
    return a.finished.then(() => { v.style.opacity = '1'; }, () => { v.style.opacity = '1'; });
  };

  const onExitClick = async (e: Exit) => {
    if (leaving.current) return;
    if (!meets(e.requires, world)) { finn.current?.react('nope'); clickExit(e.id); return; }
    const m = exitMotion(e);
    leaving.current = true;
    setLeavingExit(e.id);
    closeTalk();
    window.setTimeout(() => { leaving.current = false; }, 2600);
    const dest = sceneById(e.to);
    await Promise.all([
      finn.current?.leave(m.kind, { nx: m.nx, ny: m.ny }),
      dest ? awaitPainting(dest.background) : null,
    ]);
    arrival.current = arrivalFor(m.kind);
    await dip();
    clickExit(e.id);
  };

  const onBackClick = async () => {
    if (leaving.current || !backTo) return;
    const b = backTo;
    leaving.current = true;
    setLeavingExit('back');
    window.setTimeout(() => { leaving.current = false; }, 2600);
    await Promise.all([finn.current?.leave('toward', { nx: 0.5, ny: 0.66 }), awaitPainting(b.background)]);
    arrival.current = 'fade';
    await dip();
    st.goScene(b.id); sounds.finnSwim(); setLines([]); setSpeaker(null); setHeld(null);
  };

  useEffect(() => {
    if (!box.sw || intro || !finn.current || ready !== scene.id) return;
    if (enteredScene.current === scene.id) return;
    enteredScene.current = scene.id;
    const obstacles: SBox[] = [
      ...sceneChars.map((c) => ({ x: c!.x, y: c!.y, w: c!.w, h: c!.h })),
      ...visibleHotspots.map((h) => ({ x: h.x, y: h.y, w: h.w, h: h.h })),
    ];
    const from = arrival.current;
    arrival.current = 'fade';
    leaving.current = false;
    finn.current.enter(from, restPoint(obstacles, from, halfW));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.id, box.sw > 0, intro, ready]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const el = ref.current;
      setHidden(!el || el.offsetParent === null || document.hidden);
    }, 600);
    return () => window.clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { if (hidden) engine.current?.stop(); else engine.current?.start(); }, [hidden]);

  useEffect(() => { setHoverExit(null); setLeavingExit(null); }, [scene.id]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      (scene.exits ?? []).forEach((x) => { const d = sceneById(x.to); if (d) preloadPainting(d.background); });
      if (backTo) preloadPainting(backTo.background);
    }, 600);
    return () => window.clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.id]);

  useEffect(() => {
    let alive = true;
    const img = bgImg.current, v = veil.current;
    if (!img || !v) return;
    const clear = () => {
      if (!alive) return;
      v.getAnimations().forEach((a) => a.cancel());
      if (reduced || isFast()) { v.style.opacity = '0'; setReady(scene.id); return; }
      const a = v.animate([{ opacity: +getComputedStyle(v).opacity }, { opacity: 0 }], { duration: 320, easing: 'ease-out' });
      const done = () => { v.style.opacity = '0'; };
      a.finished.then(done, done);
      setReady(scene.id);
    };
    if (reduced || isFast()) { clear(); return () => { alive = false; }; }
    cap(img.decode().catch(() => {}), 1400).then(clear);
    return () => { alive = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.id, reduced]);

  useEffect(() => {
    if (reduced || !backCv.current || !frontCv.current || !backFx.current || !frontFx.current) return;
    const e = new AmbientEngine(backCv.current, frontCv.current, backFx.current, frontFx.current);
    engine.current = e;
    e.start();
    return () => { e.destroy(); engine.current = null; };
  }, [reduced]);
  useEffect(() => {
    const e = engine.current, el = ref.current;
    if (!e || !el || !box.w) return;
    const r = el.getBoundingClientRect();
    e.resize(box.w, box.h, box, el.offsetWidth ? r.width / el.offsetWidth : 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [box, reduced]);
  useEffect(() => { engine.current?.setScene(ambienceFor(scene.id)); }, [scene.id, reduced, box.w > 0]);
  useEffect(() => { engine.current?.setIdle(idle); }, [idle]);

  useEffect(() => {
    const added = st.inventory.filter((i) => !prevInv.current.includes(i));
    prevInv.current = st.inventory;
    if (!added.length) return;
    if (pouch) { gulpPouch(); return; }
    const from = lastSpot.current ? toPxN(lastSpot.current.nx, lastSpot.current.ny) : null;
    const to = centerOf(pouchBtn.current);
    if (!from || !to) return;
    added.forEach((id, k) => {
      const it = itemById(id);
      if (!it) return;
      window.setTimeout(() => { fly(it.icon, from, to, 34).then(() => { gulpPouch(); engine.current?.glint(to.x, to.y, 2); }); }, k * 140);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [st.inventory]);

  useEffect(() => {
    const n = st.seaStars.length;
    if (n > prevStars.current) {
      const from = lastSpot.current ? toPxN(lastSpot.current.nx, lastSpot.current.ny) : null;
      const to = centerOf(noteBtn.current);
      if (from && to) {
        engine.current?.glint(from.x, from.y, 6);
        window.setTimeout(() => fly('/finn/items/sea-star.png', from, to, 34, 860).then(() => shineNotebook()), 180);
      }
      finn.current?.react('happy');
    }
    prevStars.current = n;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [st.seaStars.length]);

  useEffect(() => {
    const n = st.notebook.length;
    if (n > prevNotes.current) { shineNotebook(); finn.current?.react('happy'); }
    prevNotes.current = n;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [st.notebook.length]);

  speakerRef.current = speaker;

  const contained = (c: Character) => {
    const b = BLINKS[c.look ?? c.id]; const sz = size(c.w, c.h);
    const r = b.sw / b.sh;
    const cw = sz.width / sz.height > r ? sz.height * r : sz.width;
    const ch = sz.width / sz.height > r ? sz.height : sz.width / r;
    return { cw, ch, ox: (sz.width - cw) / 2, oy: (sz.height - ch) / 2 };
  };

  const blinkChar = (id: string, twice = false) => {
    const el = lidRefs.current[id];
    if (!el || reduced || isFast()) return;
    const seq = [0, 1, 2, 1, 0]; let i = 0;
    const step = () => {
      if (i >= seq.length) { el.style.visibility = 'hidden'; if (twice) window.setTimeout(() => blinkChar(id), 130); return; }
      el.style.visibility = 'visible'; el.style.backgroundPosition = `0% ${seq[i] * 50}%`; i++;
      window.setTimeout(step, 38);
    };
    step();
  };

  useEffect(() => {
    if (reduced || isFast()) return;
    const timers: Record<string, number> = {};
    const loop = (id: string) => {
      timers[id] = window.setTimeout(() => {
        if (speakerRef.current !== id) blinkChar(id, Math.random() < 0.15);
        loop(id);
      }, 2400 + Math.random() * 4200);
    };
    (scene.characters ?? []).filter((id) => BLINKS[characterById(id)?.look ?? id]).forEach(loop);
    return () => Object.values(timers).forEach((t) => window.clearTimeout(t));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.id, reduced]);

  const GAGS: Record<string, Keyframe[]> = {
    hop:     [{ translate: '0 0', scale: '1 1' }, { translate: '0 -7%', scale: '0.97 1.04', offset: 0.35 }, { translate: '0 0', scale: '1.04 0.95', offset: 0.65 }, { translate: '0 0', scale: '1 1' }],
    wiggle:  [{ rotate: '0deg' }, { rotate: '-4deg' }, { rotate: '4deg' }, { rotate: '-3deg' }, { rotate: '2deg' }, { rotate: '0deg' }],
    stretch: [{ scale: '1 1' }, { scale: '0.96 1.07', offset: 0.45 }, { scale: '1.02 0.98', offset: 0.8 }, { scale: '1 1' }],
    sway:    [{ rotate: '0deg' }, { rotate: '3deg', offset: 0.3 }, { rotate: '-3deg', offset: 0.7 }, { rotate: '0deg' }],
    huff:    [{ translate: '0 0' }, { translate: '-1.5% 0' }, { translate: '1.5% 0' }, { translate: '-1% 0' }, { translate: '0 0' }],
    puff:    [{ scale: '1 1' }, { scale: '1.14 1.14', offset: 0.3 }, { scale: '1.14 1.14', offset: 0.65 }, { scale: '0.96 0.96', offset: 0.85 }, { scale: '1 1' }],
    drift:   [{ translate: '0 0' }, { translate: '0 -5%', offset: 0.5 }, { translate: '0 0' }],
  };
  const PERSONALITY: Record<string, string[]> = {
    kelp: ['hop', 'wiggle'], pearlina: ['sway', 'stretch'], gus: ['stretch', 'sway'], marina: ['wiggle', 'sway'],
    'lobster-grump': ['huff'], shrimp: ['hop'], 'twin-a': ['hop', 'wiggle'], 'twin-b': ['hop', 'wiggle'],
    jellyfish: ['drift', 'sway'], 'crab-foreman': ['huff', 'stretch'], bubbles: ['puff'], barnacle: ['sway', 'stretch'],
    professor: ['wiggle', 'stretch'], eel: ['sway'], 'seahorse-post': ['drift', 'hop'], 'star-shop': ['stretch', 'sway'],
  };
  const DUR: Record<string, number> = { hop: 560, wiggle: 620, stretch: 900, sway: 1300, huff: 380, puff: 1100, drift: 1600 };
  useEffect(() => {
    if (reduced || isFast()) return;
    let t = 0, alive = true;
    const next = () => {
      t = window.setTimeout(() => {
        if (!alive) return;
        const ids = (scene.characters ?? []).filter((id) => id !== speakerRef.current && charRefs.current[id]);
        const id = ids[Math.floor(Math.random() * ids.length)];
        const el = id ? charRefs.current[id] : null;
        if (el) {
          const pool = PERSONALITY[id] ?? ['stretch'];
          const g = pool[Math.floor(Math.random() * pool.length)];
          el.animate(GAGS[g], { duration: DUR[g], easing: 'ease-in-out' });
        }
        next();
      }, 6500 + Math.random() * 7000);
    };
    next();
    return () => { alive = false; window.clearTimeout(t); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.id, reduced]);

  const rawLine = lines[0] ?? '';
  const finnLine = rawLine.startsWith(FINN_LINE);
  const line = finnLine ? rawLine.slice(FINN_LINE.length) : rawLine;
  const voice = finnLine ? null : speaker;
  const onSyllable = () => {
    const el = voice ? charRefs.current[voice] : null;
    if (el) el.animate([{ scale: '1 1' }, { scale: '1.018 1.035' }, { scale: '1 1' }], { duration: 110, easing: 'ease-out' });
    const m = voice ? mouthRefs.current[voice] : null;
    if (m && !reduced) {
      const seq: Array<[string, number]> = [['0%', 40], ['100%', 45], ['0%', 35]];
      let k = 0;
      const step = () => {
        if (k >= seq.length) { m.style.visibility = 'hidden'; return; }
        m.style.visibility = 'visible'; m.style.backgroundPosition = `0% ${seq[k][0]}`;
        const d = seq[k][1]; k++; window.setTimeout(step, d);
      };
      step();
    }
    else if (!voice) finn.current?.react('talk');
  };
  const onSceneClickCapture = (ev: React.MouseEvent) => {
    if (!busy) return;
    const t = ev.target as HTMLElement;
    if (t.closest('[data-dialogue]')) return;
    const onScene = t === bgImg.current || !!t.closest('[data-scene]');
    if (!onScene) return;
    const more = !!typer.current?.typing() || lines.length > 1 || (!!node && menuFor(node).length > 0);
    if (more || t === bgImg.current) { ev.stopPropagation(); ev.preventDefault(); onCard(); }
  };
  const onCard = () => { if (typer.current?.typing()) { typer.current.finish(); return; } advance(); };

  useEffect(() => {
    Object.keys(CLICK_GAGS).filter((k) => k.startsWith(scene.id + '/')).forEach((k) => {
      const n = k.replace('/', '__');
      Promise.all([preloadPainting(`/finn/gags/${n}.png`), preloadPainting(`/finn/gags/${n}-plate.png`)])
        .then(() => gagReady.current.add(k));
    });
  }, [scene.id]);

  const MOTIONS: Record<GagMotion, { origin: string; dur: number; frames: Keyframe[] }> = {
    sway:   { origin: '50% 100%', dur: 1150, frames: [{ rotate: '0deg' }, { rotate: '5deg' }, { rotate: '-4deg' }, { rotate: '3deg' }, { rotate: '-1.5deg' }, { rotate: '0deg' }] },
    wobble: { origin: '50% 100%', dur: 900,  frames: [{ rotate: '0deg' }, { rotate: '-6deg' }, { rotate: '5deg' }, { rotate: '-3.5deg' }, { rotate: '2deg' }, { rotate: '-1deg' }, { rotate: '0deg' }] },
    jiggle: { origin: '50% 60%',  dur: 520,  frames: [{ scale: '1 1', translate: '0 0' }, { scale: '1.04 0.97', translate: '-1% 0' }, { scale: '0.98 1.03', translate: '1% 0' }, { scale: '1.02 0.99', translate: '-0.5% 0' }, { scale: '1 1', translate: '0 0' }] },
    squash: { origin: '50% 100%', dur: 650,  frames: [{ scale: '1 1' }, { scale: '1.06 0.92', offset: 0.25 }, { scale: '0.97 1.06', offset: 0.55 }, { scale: '1.02 0.98', offset: 0.8 }, { scale: '1 1' }] },
    flap:   { origin: '50% 0%',   dur: 820,  frames: [{ scale: '1 1', rotate: '0deg' }, { scale: '1 1.06', rotate: '1.5deg' }, { scale: '1 0.96', rotate: '-1.5deg' }, { scale: '1 1.02', rotate: '0.5deg' }, { scale: '1 1', rotate: '0deg' }] },
  };

  const playGag = (key: string, at: { x: number; y: number }) => {
    const g = CLICK_GAGS[key];
    if (g) {
      if (gagBusy.current.has(key)) return;
      sounds.gag(g.sound);
      if (reduced || isFast() || !gagReady.current.has(key) || !gagLayer.current) return;
      gagBusy.current.add(key);
      const n = key.replace('/', '__'), p0 = px(g.x, g.y), sz = size(g.w, g.h);
      const mk = (src: string) => {
        const im = document.createElement('img'); im.src = src; im.alt = ''; im.draggable = false;
        Object.assign(im.style, { position: 'absolute', left: `${p0.left}px`, top: `${p0.top}px`,
          width: `${sz.width}px`, height: `${sz.height}px`, pointerEvents: 'none', visibility: 'hidden' });
        gagLayer.current!.appendChild(im); return im;
      };
      const plate = mk(`/finn/gags/${n}-plate.png`), obj = mk(`/finn/gags/${n}.png`);
      const done = () => { plate.remove(); obj.remove(); gagBusy.current.delete(key); };
      Promise.all([plate.decode(), obj.decode()]).then(() => {
        plate.style.visibility = 'visible'; obj.style.visibility = 'visible';
        const m = MOTIONS[g.motion];
        obj.style.transformOrigin = m.origin;
        engine.current?.puff(at.x, at.y - sz.height * 0.25, 4, [1.0, 2.2], 'front');
        obj.animate(m.frames, { duration: m.dur, easing: 'ease-out' }).finished.then(done, done);
      }, done);
    } else if (EFFECT_GAGS.has(key)) {
      sounds.gag('twinkle');
      engine.current?.burst(at.x, at.y); engine.current?.glint(at.x, at.y, 5);
    }
  };

  const leanFor = (c: Character) => {
    if (!finnAt) return 'none';
    const d = finnAt.nx - (c.x + c.w / 2);
    if (Math.abs(d) > 0.34) return 'none';
    const s = Math.sign(d);
    return `rotate(${s * 2.4}deg) translateX(${s * 1.6}%)`;
  };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: FN.deep, fontFamily: FN_FONT }}>
      <div ref={ref} onClickCapture={onSceneClickCapture}
        onMouseMove={(ev) => {
          const r = (ev.currentTarget as HTMLDivElement).getBoundingClientRect();
          const k = r.width ? (ev.currentTarget as HTMLDivElement).offsetWidth / r.width : 1;
          setPointer({ x: (ev.clientX - r.left) * k, y: (ev.clientY - r.top) * k });
        }}
        style={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden', background: FN.deep, cursor: CURSORS.point }}>
        <img ref={bgImg} src={scene.background} alt="" draggable={false}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />

        <canvas ref={backCv} aria-hidden
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }} />
        <div ref={gagLayer} aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }} />

        <div ref={backFx} aria-hidden
          style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }} />

        {sceneChars.map((c) => c && (
          <button key={c.id} data-scene onClick={() => onChar(c)}
            onMouseEnter={() => setHover(c.name)} onMouseLeave={() => setHover('')}
            aria-label={c.name}
            style={{
              position: 'absolute', ...px(c.x, c.y), ...size(c.w, c.h), zIndex: 2,
              padding: 0, border: 'none', background: 'transparent',
              cursor: held ? CURSORS.use : CURSORS.talk,
            }}>
            <span ref={(el) => { charRefs.current[c.id] = el; }} className={'finn-char-lean' + (hello === c.id ? ' finn-char-hello' : '')}
              style={{ display: 'block', width: '100%', height: '100%', transform: leanFor(c) }}>
              <div className={voice === c.id ? 'finn-talk' : 'finn-float finn-breathe'}
                style={{ position: 'relative', width: '100%', height: '100%',
                         animationDelay: `${(c.id.charCodeAt(0) % 7) * 0.4}s` }}>
                <img src={(voice === c.id && c.spriteTalk && !MOUTHS[c.look ?? c.id]) ? c.spriteTalk : (c.spriteBefore && !st.flags.includes(c.spriteBefore.flag) ? c.spriteBefore.sprite : c.sprite)} alt="" draggable={false}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block',
                           filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.45))' }} />
                {BLINKS[c.look ?? c.id] && !(voice === c.id && c.spriteTalk && !MOUTHS[c.look ?? c.id]) && (() => {
                  const b = BLINKS[c.look ?? c.id], r = contained(c);
                  return (
                    <div ref={(el) => { lidRefs.current[c.id] = el; }} aria-hidden
                      style={{
                        position: 'absolute', left: r.ox + b.x * r.cw, top: r.oy + b.y * r.ch,
                        width: b.w * r.cw, height: b.h * r.ch, pointerEvents: 'none', visibility: 'hidden',
                        backgroundImage: `url(/finn/characters/blink/${c.look ?? c.id}.png)`, backgroundSize: '100% 300%',
                        backgroundRepeat: 'no-repeat', backgroundPosition: '0% 0%',
                      }} />
                  );
                })()}
                {MOUTHS[c.look ?? c.id] && (() => {
                  const b = MOUTHS[c.look ?? c.id], sz = size(c.w, c.h), rr = b.sw / b.sh;
                  const cw = sz.width / sz.height > rr ? sz.height * rr : sz.width;
                  const ch = sz.width / sz.height > rr ? sz.height : sz.width / rr;
                  const ox = (sz.width - cw) / 2, oy = (sz.height - ch) / 2;
                  return (
                    <div ref={(el) => { mouthRefs.current[c.id] = el; }} aria-hidden
                      style={{
                        position: 'absolute', left: ox + b.x * cw, top: oy + b.y * ch, width: b.w * cw, height: b.h * ch,
                        pointerEvents: 'none', visibility: 'hidden',
                        backgroundImage: `url(/finn/characters/mouth/${c.look ?? c.id}.png)`, backgroundSize: '100% 200%',
                        backgroundRepeat: 'no-repeat', backgroundPosition: '0% 0%',
                      }} />
                  );
                })()}
              </div>
            </span>
          </button>
        ))}

        {visibleHotspots.map((h) => (
          <button key={h.id} data-scene onClick={() => onSpot(h)}
            onMouseEnter={() => setHover(h.label)} onMouseLeave={() => setHover('')}
            aria-label={h.label}
            style={{
              position: 'absolute', ...px(h.x, h.y), ...size(h.w, h.h), zIndex: 4,
              padding: 0, border: 'none', background: 'transparent',
              cursor: held ? CURSORS.use : CURSORS[h.cursor ?? 'look'],
              backgroundImage: glints(h)
                ? 'radial-gradient(circle at 50% 45%, rgba(255,246,200,0.55) 0%, rgba(255,246,200,0.18) 35%, rgba(255,246,200,0) 70%)'
                : undefined,
              animation: glints(h) ? 'finn-glint 2.8s ease-in-out infinite' : undefined,
            }}>
            {glints(h) && <span className="finn-sparkle" style={{ animationDelay: twinkleDelay(h.id) }}><i /></span>}
            {pearlIn(h) && (
              <img src={itemById(pearlIn(h)!)?.icon} alt="" aria-hidden="true" draggable={false} className="finn-pearl-bob"
                style={{ position: 'absolute', left: '50%', top: '50%', width: Math.min(75, 4.2 / h.w) + '%', pointerEvents: 'none', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.9))' }} />
            )}
          </button>
        ))}

        {glow && (
          <span key={glow.key} aria-hidden="true" className="finn-glowburst" style={{
            position: 'absolute', ...px(glow.h.x - glow.h.w * 0.4, glow.h.y - glow.h.h * 0.4), ...size(glow.h.w * 1.8, glow.h.h * 1.8),
            zIndex: 6, pointerEvents: 'none', mixBlendMode: 'screen',
            background: `radial-gradient(circle at 50% 50%, ${glow.color} 0%, ${glow.color}cc 18%, ${glow.color}55 40%, transparent 68%)`,
          }} />
        )}

        {scene.id === 'moon-chamber' && st.flags.includes('finished') && (
          <>
            <span aria-hidden="true" className="finn-shell-glow" style={{
              position: 'absolute', ...px(0.40, 0.30), ...size(0.30, 0.42), zIndex: 3, pointerEvents: 'none', mixBlendMode: 'screen',
              background: 'radial-gradient(circle at 50% 55%, rgba(255,240,200,0.75), rgba(255,220,150,0.25) 45%, transparent 70%)',
            }} />
            {SHELL_SETTINGS.map((q, i) => (
              <img key={q.id} src={itemById(q.id)?.icon} alt="" aria-hidden="true" draggable={false} className="finn-pearl-set"
                style={{ position: 'absolute', ...px(q.x - q.d / 2, q.y - q.d * 0.75), ...size(q.d, q.d * 1.5), zIndex: 3,
                  pointerEvents: 'none', animationDelay: (0.25 + i * 0.3) + 's', filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.95))' }} />
            ))}
          </>
        )}

        {TWINKLE_SCENES.includes(scene.id) && TWINKLES.map((t, i) => (
          <span key={i} aria-hidden="true" className="finn-twinkle" style={{
            position: 'absolute', ...px(t.x, t.y), width: t.r, height: t.r, zIndex: 2, pointerEvents: 'none',
            animationDelay: t.d + 's', animationDuration: t.s + 's',
          }} />
        ))}

        {(scene.exits ?? []).map((e) => (
          <button key={e.id} data-scene onClick={() => onExitClick(e)}
            onMouseEnter={() => setHoverExit(e.id)} onMouseLeave={() => setHoverExit((x) => (x === e.id ? null : x))}
            aria-label={e.label}
            style={{
              position: 'absolute', ...px(e.x, e.y), ...size(e.w, e.h), zIndex: 3,
              padding: 0, border: 'none', background: 'transparent', cursor: CURSORS.swim,
            }} />
        ))}

        {backTo && (
          <button data-scene onClick={onBackClick}
            onMouseEnter={() => setHoverExit('back')} onMouseLeave={() => setHoverExit((x) => (x === 'back' ? null : x))}
            aria-label={`Back to ${backTo.title}`}
            style={{
              position: 'absolute', left: '22%', right: '22%', bottom: 0, height: 34, zIndex: 3,
              padding: 0, border: 'none', background: 'transparent', cursor: CURSORS.back,
            }} />
        )}

        {(scene.exits ?? []).map((e) => {
          const k = exitMotion(e).kind;
          const cx = Math.min(0.9, Math.max(0.1, e.x + e.w / 2)), cy = Math.min(0.82, Math.max(0.18, e.y + e.h / 2));
          const p0 = px(cx, cy);
          return (
            <div key={'tag-' + e.id} aria-hidden
              style={{
                position: 'absolute', left: p0.left, top: p0.top, transform: 'translate(-50%, -50%)', zIndex: 7,
                pointerEvents: 'none', opacity: (hoverExit === e.id || leavingExit === e.id) ? 1 : 0, transition: 'opacity .2s ease',
                background: FN.shell, color: FN.ink, fontFamily: FN_FONT, fontSize: 9.5, fontWeight: 700,
                padding: '2px 7px', borderRadius: 999, boxShadow: '0 2px 5px rgba(0,0,0,.35)', whiteSpace: 'nowrap',
              }}>
              {k === 'left' ? `← ${e.label}` : k === 'right' ? `${e.label} →` : `↑ ${e.label}`}
            </div>
          );
        })}
        {backTo && (
          <div aria-hidden
            style={{
              position: 'absolute', left: '50%', bottom: 10, transform: 'translateX(-50%)', zIndex: 7,
              pointerEvents: 'none', opacity: (hoverExit === 'back' || leavingExit === 'back') ? 1 : 0, transition: 'opacity .2s ease',
              background: FN.shell, color: FN.ink, fontFamily: FN_FONT, fontSize: 9.5, fontWeight: 700,
              padding: '2px 7px', borderRadius: 999, boxShadow: '0 2px 5px rgba(0,0,0,.35)', whiteSpace: 'nowrap',
            }}>
            ↓ Back to {backTo.title}
          </div>
        )}

        <FinnActor ref={finn} box={box} reduced={reduced} busy={busy} pointerNx={pointerNx}
          onWake={(x, y) => engine.current?.puff(x, y, 1, [0.8, 1.7])} onSettle={setFinnAt} />

        <canvas ref={frontCv} aria-hidden
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 5, pointerEvents: 'none' }} />
        <div ref={frontFx} aria-hidden
          style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none', overflow: 'hidden' }} />

        <div ref={veil} aria-hidden
          style={{ position: 'absolute', inset: 0, zIndex: 9, pointerEvents: 'none', background: FN.deep, opacity: 1 }} />

        <div ref={flights} aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 8, pointerEvents: 'none' }} />

        <div style={{
          zIndex: 6, position: 'absolute', left: 6, top: 5, padding: '3px 8px', borderRadius: FN_ROUND,
          background: 'rgba(6,38,63,0.62)', color: '#fff', lineHeight: 1.15,
          textShadow: '0 1px 2px rgba(0,0,0,0.8)', pointerEvents: 'none',
        }}>
          <div style={{ fontSize: 12.5, fontWeight: 700 }}>{scene.title}</div>
          <div style={{ fontSize: 9.5, opacity: 0.8 }}>{scene.region}</div>
        </div>

        {hover && !busy && (
          <div style={{
            zIndex: 7, position: 'absolute', left: pointer.x + 16, top: pointer.y + 18,
            padding: '3px 9px', borderRadius: FN_ROUND, pointerEvents: 'none',
            background: 'rgba(6,38,63,0.86)', color: '#fff', fontSize: 12, fontWeight: 700,
            whiteSpace: 'nowrap', textShadow: '0 1px 2px rgba(0,0,0,0.9)',
            maxWidth: 230, overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{held ? `Use ${itemById(held)?.name} on ${hover}` : hover}</div>
        )}

        {busy && (
          <div data-dialogue onClick={onCard}
            style={{
              zIndex: 6,
              position: 'absolute', left: '50%', bottom: 8, transform: 'translateX(-50%)',
              width: 'min(calc(100% - 128px), 560px)', cursor: 'pointer',
              borderStyle: 'solid',
              borderWidth: '22px 42px 30px 40px',
              borderImageSource: 'url(/finn/ui/dialogue.png)',
              borderImageSlice: '66 136 98 128 fill',
              borderImageRepeat: 'stretch',
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.45))',
              padding: '3px 8px 2px',
            }}>
            <div style={{ minHeight: 53, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              {speaker && (
                <div style={{ fontSize: 10, fontWeight: 700, color: '#2a6f80', lineHeight: '12px', marginBottom: 1 }}>
                  {finnLine ? 'Finn' : characterById(speaker)?.name}
                </div>
              )}
              <div style={{ fontSize: 11.5, color: FN.ink, lineHeight: 1.35, maxWidth: '100%' }}>
                <Typewriter ref={typer} key={line} text={line} instant={reduced || isFast() || textSpeed === 'instant'}
                  hold={intro} cps={TEXT_CPS[textSpeed] || 30} onSyllable={onSyllable} />
              </div>
            </div>
          </div>
        )}

        {!busy && node && menuFor(node).length ? (
          <div style={{ zIndex: 6, position: 'absolute', left: '50%', bottom: 8, transform: 'translateX(-50%)', width: 'min(calc(100% - 128px), 560px)', display: 'flex', flexDirection: 'column', gap: 3 }}>
            {menuFor(node).map((r, i) => (
              <button key={i} onClick={() => pickReply(r)}
                style={{
                  textAlign: 'left', border: 'none', borderRadius: FN_ROUND,
                  background: 'rgba(255,246,226,0.9)',
                  backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)',
                  padding: '5px 10px', fontSize: 11.5, color: FN.ink, cursor: 'pointer',
                  fontFamily: FN_FONT, boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                }}>{r.text}</button>
            ))}
            <button onClick={closeTalk}
              style={{
                textAlign: 'left', background: 'rgba(6,38,63,0.55)', border: 'none', borderRadius: FN_ROUND,
                padding: '4px 10px', fontSize: 10.5, color: '#fff', cursor: 'pointer', fontFamily: FN_FONT,
              }}>Goodbye for now.</button>
          </div>
        ) : null}

      <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 6, display: 'flex', gap: 6, pointerEvents: 'none' }}>
        <span ref={noteBtn} style={{ display: 'inline-flex' }}>
            <FNButton tone="sand" style={{ fontSize: 9.5, padding: '3px 8px', pointerEvents: 'auto' }}
              onClick={() => setPanel(panel === 'notebook' ? null : 'notebook')}>
              Notebook
            </FNButton>
          </span>
          <FNButton tone="sand" style={{ fontSize: 9.5, padding: '3px 8px', pointerEvents: 'auto' }}
            onClick={() => setPanel(panel === 'menu' ? null : 'menu')}>
            Menu
          </FNButton>
      </div>

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 3, pointerEvents: 'none',
        display: 'flex', alignItems: 'flex-end', gap: 6, padding: '0 6px 6px',
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 0, display: 'flex', alignItems: 'flex-end' }}>
          {pouch && (
            <div className="finn-pop" style={{
              position: 'absolute', left: 2, bottom: 42, display: 'flex', gap: 7,
              alignItems: 'center', flexWrap: 'wrap', maxWidth: 330,
            }}>
              {st.inventory.length === 0 && (
                <span style={{
                  fontSize: 10.5, color: '#fff', padding: '3px 8px', borderRadius: FN_ROUND,
                  background: 'rgba(6,38,63,0.62)', textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                  pointerEvents: 'auto',
                }}>Nothing in your pouch yet.</span>
              )}
              {st.inventory.map((id) => {
                const it = itemById(id); if (!it) return null;
                const on = held === id;
                return (
                  <button key={id} title={it.name} aria-label={it.name}
                    onClick={() => {
                      if (id === 'current-map') { sounds.finnPickup(); setHeld(null); st.setFlag('map-seen'); setMapOpen(true); return; }
                      if (on) { setHeld(null); return; }
                      if (held) {
                        const c = combineOf(held, id);
                        if (c) {
                          const before = stepNow();
                          st.take(held); st.take(id); st.give(c.into);
                          sounds.finnDiscover(); setHeld(null); setSpeaker(null);
                          setLines(nudged(before, c.say ?? ['Finn fits them together.']));
                          return;
                        }
                      }
                      sounds.finnPickup(); setHeld(id);
                    }}
                    style={{
                      width: 38, height: 38, flex: '0 0 auto', padding: 4, cursor: 'pointer',
                      pointerEvents: 'auto', borderRadius: '50%', border: 'none',
                      background: on
                        ? 'radial-gradient(circle at 34% 30%, rgba(255,255,255,0.95), rgba(244,197,66,0.85) 55%, rgba(244,197,66,0.5) 100%)'
                        : 'radial-gradient(circle at 34% 30%, rgba(255,255,255,0.9), rgba(140,214,235,0.5) 48%, rgba(31,122,140,0.42) 100%)',
                      boxShadow: on
                        ? '0 0 0 2px rgba(240,113,79,0.9), 0 2px 5px rgba(0,0,0,0.45)'
                        : 'inset 0 0 6px rgba(255,255,255,0.75), 0 0 0 1px rgba(255,255,255,0.55), 0 2px 5px rgba(0,0,0,0.4)',
                    }}>
                    <img src={it.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                  </button>
                );
              })}
            </div>
          )}

          <button ref={pouchBtn} aria-label={pouch ? 'Close your pouch' : 'Open your pouch'}
            onClick={() => { sounds.finnPouch(!pouch); setPouch((o) => !o); }}
            style={{
              pointerEvents: 'auto', cursor: CURSORS.take, position: 'relative',
              width: 40, height: 40, padding: 0, border: 'none', borderRadius: '50%',
              background: pouch
                ? 'radial-gradient(circle at 34% 28%, rgba(255,255,255,0.97), rgba(244,197,66,0.85) 52%, rgba(214,150,26,0.6) 100%)'
                : 'radial-gradient(circle at 34% 28%, rgba(255,255,255,0.92), rgba(140,214,235,0.55) 46%, rgba(31,122,140,0.5) 100%)',
              boxShadow: 'inset 0 0 8px rgba(255,255,255,0.8), 0 0 0 1px rgba(255,255,255,0.6), 0 2px 6px rgba(0,0,0,0.45)',
            }}>
            <span aria-hidden style={{
              position: 'absolute', left: '50%', top: '52%', transform: 'translate(-50%,-50%)',
              width: 15, height: 15, borderRadius: '50%',
              background: 'radial-gradient(circle at 36% 30%, #fff, #f6ead2 55%, #d9c49b 100%)',
              boxShadow: '0 0 4px rgba(255,255,255,0.9)',
            }} />
            {st.inventory.length > 0 && (
              <span style={{
                position: 'absolute', right: -2, top: -2, width: 16, height: 16,
                borderRadius: '50%', background: FN.coral, color: '#fff',
                fontSize: 10, fontWeight: 700, lineHeight: '16px', textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
              }}>{st.inventory.length}</span>
            )}
          </button>
        </div>

      </div>
      </div>

      {intro && (
        <Intro onClose={() => { st.setFlag('seen-intro'); setIntro(false); sounds.finnPouch(true); }} />
      )}

      {st.flags.includes('finished') && !ending && !busy && (
        <TheEnd stars={st.seaStars.length} onClose={() => setEnding(true)} onExit={onExit} />
      )}

      {panel === 'notebook' && <Notebook onClose={() => setPanel(null)} />}
      {mapOpen && <PaintedMap onClose={() => setMapOpen(false)} />}
      {game && <MiniGame kind={game} onWin={() => winGame(game)} onClose={() => setGame(null)} />}
      {panel === 'menu' && <PauseMenu onClose={() => setPanel(null)} onExit={onExit} />}
    </div>
  );
}

function Intro({ onClose }: { onClose: () => void }) {
  const line = (k: string, v: string) => (
    <div style={{ display: 'flex', gap: 7, marginBottom: 5, textAlign: 'left' }}>
      <span style={{ color: FN.coral, fontWeight: 700, flex: '0 0 62px', fontSize: 11 }}>{k}</span>
      <span style={{ fontSize: 11.5, color: FN.ink, lineHeight: 1.35 }}>{v}</span>
    </div>
  );
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 14, display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 12, background: 'rgba(6,38,63,0.8)', fontFamily: FN_FONT,
    }}>
      <div className="finn-pop" style={{
        width: '100%', maxWidth: 400, padding: 15,
        background: FN.shell, borderRadius: FN_ROUND, boxShadow: fnShadow,
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: FN.sea, textAlign: 'center' }}>
          Oh no! The Moon Pearls are missing!
        </div>
        <p style={{ fontSize: 11.5, color: FN.inkSoft, lineHeight: 1.45, margin: '6px 0 11px', textAlign: 'center' }}>
          All five pearls are gone from the Moon Shell, and the big festival is tonight.
          Can you help Finn find them?
        </p>
        {HOW_TO_PLAY.map(([k, v]) => <React.Fragment key={k}>{line(k, v)}</React.Fragment>)}
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <FNButton onClick={onClose} style={{ fontSize: 13, padding: '8px 22px' }}>Let’s go!</FNButton>
        </div>
      </div>
    </div>
  );
}

function TheEnd({ stars, onClose, onExit }: { stars: number; onClose: () => void; onExit: () => void }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 12, display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 14, fontFamily: FN_FONT,
      background: 'radial-gradient(circle at 50% 45%, rgba(255,214,120,0.35), rgba(6,38,63,0.82) 60%)',
    }}>
      {TWINKLES.map((t, i) => (
        <span key={i} aria-hidden="true" className="finn-twinkle" style={{
          position: 'absolute', left: (t.x * 100) + '%', top: (t.y * 180) + '%', width: t.r + 2, height: t.r + 2,
          animationDelay: t.d + 's', animationDuration: t.s + 's', pointerEvents: 'none',
        }} />
      ))}
      <div className="finn-pop" style={{
        width: '100%', maxWidth: 380, textAlign: 'center', padding: 16,
        background: FN.shell, borderRadius: FN_ROUND, boxShadow: fnShadow,
      }}>
        <div className="finn-title-glow" style={{ fontSize: 22, fontWeight: 700, color: FN.sea }}>The Moonlight Festival</div>
        <p style={{ fontSize: 12.5, color: FN.ink, lineHeight: 1.55, margin: '10px 0' }}>
          Nobody stole the Moon Pearls after all! The old pouch had a hole, and the water
          carried the pearls away. You found every single one!
        </p>
        <p style={{ fontSize: 12.5, color: FN.ink, lineHeight: 1.55, margin: '0 0 10px' }}>
          Thank you, Finn! You saved the festival!
        </p>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', margin: '0 0 12px' }}>
          {SHELL_SETTINGS.map((q, i) => (
            <img key={q.id} src={itemById(q.id)?.icon} alt="" className="finn-pearl-set"
              style={{ width: 30, height: 30, animationDelay: (0.3 + i * 0.18) + 's' }} />
          ))}
        </div>
        <div style={{ fontSize: 11.5, color: FN.inkSoft, marginBottom: 12 }}>
          Sea stars won: {stars} of {SEA_STARS_PLACED}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <FNButton onClick={onClose}>Keep swimming</FNButton>
          <FNButton tone="sand" onClick={onExit}>Back to the title</FNButton>
        </div>
      </div>
    </div>
  );
}

function collectable(h: Hotspot) {
  return h.cursor === 'take' || !!h.onClick?.giveItems?.length || !!h.onClick?.seaStar;
}
function twinkleDelay(id: string) {
  let n = 0;
  for (let i = 0; i < id.length; i++) n = (n * 31 + id.charCodeAt(i)) >>> 0;
  return -((n % 34) / 10) + 's';
}

function Notebook({ onClose }: { onClose: () => void }) {
  const st = useFinn();
  const [openHint, setOpenHint] = useState<Record<string, number>>({});
  const [nextShown, setNextShown] = useState<number | null>(null);
  const stepIdx = NEXT_STEPS.findIndex((x) => !x.done({ flags: st.flags, inventory: st.inventory }));
  const step = stepIdx >= 0 ? NEXT_STEPS[stepIdx] : null;
  const entries = st.notebook.map(notebookById).filter(Boolean);
  const open = st.wonder.filter((w) => !st.resolvedWonder.includes(w)).map(wonderById).filter(Boolean);
  const done = st.wonder.filter((w) => st.resolvedWonder.includes(w)).map(wonderById).filter(Boolean);

  return (
    <Overlay title="Finn's Notebook" onClose={onClose} paper>
      {step && (
        <div style={{ marginBottom: 12, breakInside: 'avoid', padding: '6px 9px', border: `2px dashed ${FN.gold}`, borderRadius: 6, background: 'rgba(255,248,214,0.75)' }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: FN.coral, marginBottom: 2 }}>Stuck?</div>
          {nextShown === stepIdx ? (
            <div style={{ fontSize: 11.5, color: FN.ink, lineHeight: 1.45 }}>{step.hint}</div>
          ) : (
            <button onClick={() => setNextShown(stepIdx)}
              style={{ fontFamily: FN_FONT, fontSize: 11.5, color: FN.sea, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
              What should I do next? &rsaquo;
            </button>
          )}
          <div style={{ fontSize: 10.5, color: FN.inkSoft, marginTop: 4, lineHeight: 1.4 }}>
            Tip: things that sparkle can be picked up or used. Click them!
          </div>
        </div>
      )}
      {entries.length === 0 && <p style={{ fontSize: 12, color: FN.inkSoft }}>Nothing written down yet.</p>}
      {entries.map((n) => n && (
        <div key={n.id} style={{ marginBottom: 12, breakInside: 'avoid' }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: FN.sea, marginBottom: 2 }}>{n.title}</div>
          {n.lines.map((l, i) => (
            <div key={i} style={{ fontSize: 11.5, color: FN.ink, lineHeight: 1.45 }}>{l}</div>
          ))}
        </div>
      ))}

      {(open.length > 0 || done.length > 0) && (
        <>
          <div style={{ fontSize: 13, fontWeight: 700, color: FN.coral, marginBottom: 4 }}>
            Things I&apos;m Wondering About
          </div>
          {open.map((w) => w && (
            <div key={w.id} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11.5, color: FN.ink, lineHeight: 1.45 }}>{w.question}</div>
              {(openHint[w.id] ?? 0) > 0 && (
                <div style={{ margin: '3px 0 0 6px' }}>
                  {w.hints.slice(0, openHint[w.id]).map((h, i) => (
                    <div key={i} style={{
                      fontSize: 10.5, color: FN.ink, lineHeight: 1.3, marginBottom: 2,
                      borderLeft: `3px solid ${FN.gold}`, paddingLeft: 5,
                    }}>
                      <b style={{ color: FN.coral }}>Nudge {i + 1}:</b> {h}
                    </div>
                  ))}
                </div>
              )}
              {(openHint[w.id] ?? 0) < 3 && (
                <button onClick={() => setOpenHint((o) => ({ ...o, [w.id]: (o[w.id] ?? 0) + 1 }))}
                  style={{
                    marginTop: 2, fontFamily: FN_FONT, fontSize: 10.5, color: FN.sea, background: 'none',
                    border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline',
                  }}>
                  {(openHint[w.id] ?? 0) === 0 ? 'Give me a nudge \u203a' : 'Still stuck \u203a'}
                </button>
              )}
            </div>
          ))}
          {done.map((w) => w && (
            <div key={w.id} style={{ fontSize: 12, color: FN.inkSoft, textDecoration: 'line-through' }}>{w.question}</div>
          ))}
        </>
      )}

      <div style={{ fontSize: 11, color: FN.inkSoft, marginTop: 12, borderTop: `1px solid ${FN.sandDk}`, paddingTop: 6 }}>
        Sea stars won: {st.seaStars.length} of {SEA_STARS_PLACED}
      </div>
    </Overlay>
  );
}

function PauseMenu({ onClose, onExit }: { onClose: () => void; onExit: () => void }) {
  const prefs = useFinnPrefs();
  const resetAll = useFinn((s) => s.resetAll);
  return (
    <Overlay title="Menu" onClose={onClose}>
      <p style={{ fontSize: 12, color: FN.inkSoft, lineHeight: 1.5 }}>
        Finn saves by himself as you go. You can close the window and come back to it while the computer is on.
      </p>
      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        <FNButton onClick={onClose}>Keep playing</FNButton>
        <FNButton tone="sand" onClick={prefs.toggleSound}>Sound: {prefs.soundOn ? 'On' : 'Off'}</FNButton>
        <FNButton tone="sand" onClick={prefs.cycleTextSpeed}>Text speed: {SPEED_LABEL[prefs.textSpeed]}</FNButton>
        <FNButton tone="coral"
          onClick={() => {
            if (!window.confirm('Start the mystery over? Your progress will be lost.')) return;
            resetAll();
            onExit();
          }}>
          Start over
        </FNButton>
        <FNButton tone="sand" onClick={onExit}>Quit to title</FNButton>
      </div>
    </Overlay>
  );
}

function Overlay({ title, children, onClose, paper }: {
  title: string; children: React.ReactNode; onClose: () => void; paper?: boolean;
}) {
  return (
    <div onClick={onClose}
      style={{ position: 'absolute', inset: 0, background: 'rgba(6,38,63,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8, zIndex: 10 }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{
          ...(paper
            ? {
                position: 'absolute', left: '4%', right: '4%', top: '6%', bottom: '6%', width: 'auto', maxWidth: 'none',
                borderRadius: 4,
                background: 'linear-gradient(#f4ecd6, #ecdfbf)',
                boxShadow: 'inset 0 0 50px rgba(120,80,30,0.16), 0 10px 30px rgba(0,0,0,0.55)',
              }
            : { width: '100%', maxWidth: 420, maxHeight: '96%', background: FN.shell, borderRadius: FN_ROUND, boxShadow: fnShadow }),
          display: 'flex', flexDirection: 'column', fontFamily: FN_FONT, minHeight: 0,
        }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: paper ? '14px 28px 6px' : '12px 14px 6px', flex: '0 0 auto', borderBottom: paper ? '2px solid rgba(120,90,50,0.35)' : 'none', margin: paper ? '0 28px' : 0,
          ...(paper ? { paddingLeft: 0, paddingRight: 0 } : {}) }}>
          <div style={{ fontSize: paper ? 16 : 15, fontWeight: 700, color: FN.ink, flex: 1, textAlign: 'left', letterSpacing: paper ? 0.3 : 0 }}>{title}</div>
          <button onClick={onClose} aria-label="Close"
            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: FN.inkSoft }}>&times;</button>
        </div>
        <div style={{
          flex: 1, minHeight: 0, overflowY: 'auto',
          padding: paper ? '8px 28px 18px' : '0 14px 12px',
          ...(paper ? { columnCount: 2 as const, columnGap: 40, columnRule: '1px solid rgba(120,90,50,0.22)', columnFill: 'balance' as const } : {}),
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

const SHELL_SETTINGS = [
  { id: 'pearl-ruby', x: 0.4817, y: 0.5692, d: 0.029 },
  { id: 'pearl-ocean', x: 0.5136, y: 0.5576, d: 0.0335 },
  { id: 'pearl-moon', x: 0.5536, y: 0.5437, d: 0.038 },
  { id: 'pearl-sun', x: 0.5931, y: 0.5570, d: 0.0285 },
  { id: 'pearl-garden', x: 0.6246, y: 0.5682, d: 0.0285 },
];

const TWINKLE_SCENES = ['moonlight-festival', 'moon-chamber'];
const TWINKLES = Array.from({ length: 18 }, (_, i) => {
  const r = (n: number) => { const v = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453; return v - Math.floor(v); };
  return { x: 0.04 + r(1) * 0.92, y: 0.04 + r(2) * 0.5, d: +(r(3) * 5).toFixed(2), s: +(3 + r(4) * 3).toFixed(2), r: 3 + Math.round(r(5) * 3) };
});

