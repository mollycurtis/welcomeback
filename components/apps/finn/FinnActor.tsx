'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { BOUNDS, FINN_ASPECT, FINN_H, type Entry, type Leave, type Pt } from './staging';

type Box = { w: number; h: number; sw: number; sh: number; ox: number; oy: number };
type Face = 'left' | 'right';

export type Gesture = 'grab' | 'nope' | 'happy' | 'nod' | 'lean' | 'talk';

export interface FinnHandle {
  swimTo: (p: Pt, face?: Face) => Promise<boolean>;
  enter: (from: Entry, p: Pt) => Promise<void>;
  leave: (how: Leave, via: Pt) => Promise<void>;
  place: (p: Pt) => void;
  react: (g: Gesture, towardNx?: number) => void;
  face: (f: Face) => Promise<void>;
  pos: () => Pt;
  tailPx: () => { x: number; y: number };
}

const fast = () => typeof window !== 'undefined' && !!(window as unknown as { __FINN_FAST__?: boolean }).__FINN_FAST__;
const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export const FinnActor = forwardRef<FinnHandle, {
  box: Box;
  reduced: boolean;
  busy: boolean;
  pointerNx: number | null;
  onWake: (x: number, y: number) => void;
  onSettle?: (p: Pt) => void;
}>(function FinnActor({ box, reduced, busy, pointerNx, onWake, onSettle }, ref) {
  const mover = useRef<HTMLDivElement>(null);
  const act = useRef<HTMLDivElement>(null);
  const flip = useRef<HTMLDivElement>(null);
  const lids = useRef<HTMLDivElement>(null);
  const mouth = useRef<HTMLDivElement>(null);

  const pos = useRef<Pt>({ nx: 0.3, ny: 0.52 });
  const facing = useRef<Face>('right');
  const moveAnim = useRef<Animation | null>(null);
  const token = useRef(0);
  const [swimming, setSwimming] = useState(false);
  const [pose, setPose] = useState<'idle' | 'react'>('idle');
  const [visible, setVisible] = useState(false);
  const poseTimer = useRef(0);
  const lastMove = useRef(0);

  const H = FINN_H * box.sh;
  const W = H * FINN_ASPECT;

  const toPx = useCallback((p: Pt) => ({ x: box.ox + p.nx * box.sw, y: box.oy + p.ny * box.sh }), [box]);
  const toN = useCallback((x: number, y: number): Pt => ({
    nx: box.sw ? (x - box.ox) / box.sw : 0.3, ny: box.sh ? (y - box.oy) / box.sh : 0.5,
  }), [box]);

  const tf = (x: number, y: number, rot = 0, s = 1) =>
    `translate(${(x - W / 2).toFixed(2)}px, ${(y - H / 2).toFixed(2)}px) rotate(${rot.toFixed(2)}deg) scale(${s})`;

  const livePx = useCallback(() => {
    const el = mover.current;
    if (el) {
      const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
      if (m.m41 || m.m42) return { x: m.m41 + W / 2, y: m.m42 + H / 2 };
    }
    return toPx(pos.current);
  }, [H, W, toPx]);

  const setStatic = useCallback((x: number, y: number, rot = 0, s = 1, o = 1) => {
    const el = mover.current; if (!el) return;
    el.style.transform = tf(x, y, rot, s);
    el.style.opacity = String(o);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [H, W]);

  useEffect(() => {
    if (!box.sw || moveAnim.current) return;
    const p = toPx(pos.current);
    setStatic(p.x, p.y);
  }, [box, toPx, setStatic]);

  const flash = (ms: number) => {
    window.clearTimeout(poseTimer.current);
    setPose('react');
    poseTimer.current = window.setTimeout(() => setPose('idle'), ms);
  };

  const blink = useCallback((twice = false) => {
    const el = lids.current;
    if (!el || reduced || fast()) return;
    const seq = [0, 1, 2, 1, 0];
    const show = (i: number) => {
      if (i >= seq.length) {
        el.style.visibility = 'hidden';
        if (twice) window.setTimeout(() => blink(false), 130);
        return;
      }
      el.style.visibility = 'visible';
      el.style.backgroundPosition = `0% ${seq[i] * 50}%`;
      window.setTimeout(() => show(i + 1), 38);
    };
    show(0);
  }, [reduced]);

  const face = useCallback(async (f: Face) => {
    if (f === facing.current) return;
    const el = flip.current;
    const from = facing.current === 'left' ? 1 : -1;
    facing.current = f;
    const to = f === 'left' ? 1 : -1;
    if (!el) return;
    if (reduced || fast()) { el.style.transform = `scaleX(${to})`; return; }
    const a = el.animate([
      { transform: `scaleX(${from}) scaleY(1)` },
      { transform: `scaleX(${from * 0.12}) scaleY(1.07)`, offset: 0.45 },
      { transform: `scaleX(${to * 0.12}) scaleY(1.07)`, offset: 0.55 },
      { transform: `scaleX(${to * 1.06}) scaleY(0.97)`, offset: 0.85 },
      { transform: `scaleX(${to}) scaleY(1)` },
    ], { duration: 190, easing: 'ease-in-out' });
    await a.finished.catch(() => {});
    el.style.transform = `scaleX(${to})`;
    if (Math.random() < 0.5) blink();
  }, [reduced, blink]);

  const swimTo = useCallback(async (p: Pt, finalFace?: Face): Promise<boolean> => {
    const my = ++token.current;
    const el = mover.current;
    const target: Pt = { nx: clamp(p.nx, -0.2, 1.2), ny: clamp(p.ny, -0.2, 1.2) };
    const from = livePx();
    moveAnim.current?.cancel(); moveAnim.current = null;
    const to = toPx(target);
    const dx = to.x - from.x, dy = to.y - from.y;
    const dist = Math.hypot(dx, dy);
    lastMove.current = performance.now();

    if (!el || reduced || fast() || dist < 2) {
      pos.current = target; setStatic(to.x, to.y);
      if (Math.abs(dx) > 2) await face(dx < 0 ? 'left' : 'right');
      if (finalFace) await face(finalFace);
      onSettle?.(target);
      return my === token.current;
    }

    if (Math.abs(dx) > 6) await face(dx < 0 ? 'left' : 'right');
    if (my !== token.current) return false;

    const bend = dist * 0.1 * (Math.random() < 0.5 ? -1 : 1);
    const nxp = -dy / (dist || 1), nyp = dx / (dist || 1);
    const cx = (from.x + to.x) / 2 + nxp * bend, cy = (from.y + to.y) / 2 + nyp * bend;
    const sign = facing.current === 'left' ? -1 : 1;
    const frames: Keyframe[] = [];
    const N = 16;
    for (let i = 0; i <= N; i++) {
      const t = i / N, u = 1 - t;
      const x = u * u * from.x + 2 * u * t * cx + t * t * to.x;
      const y = u * u * from.y + 2 * u * t * cy + t * t * to.y;
      const tx = 2 * u * (cx - from.x) + 2 * t * (to.x - cx);
      const ty = 2 * u * (cy - from.y) + 2 * t * (to.y - cy);
      const a = Math.atan2(ty, Math.abs(tx) + 1e-3) * (180 / Math.PI);
      const env = Math.pow(Math.sin(Math.PI * t), 0.7);
      frames.push({ transform: tf(x, y, clamp(sign * a * 0.55, -15, 15) * env) });
    }
    const dur = clamp((dist / Math.max(1, box.w)) * 1050, 300, 1000);
    setSwimming(true);
    const anim = el.animate(frames, { duration: dur, easing: 'cubic-bezier(.42,.06,.32,1)', fill: 'forwards' });
    moveAnim.current = anim;

    const wake = window.setInterval(() => {
      const lp = livePx();
      const tail = facing.current === 'left' ? W * 0.27 : -W * 0.27;
      onWake(lp.x + tail, lp.y + H * 0.1);
    }, 95);

    try { await anim.finished; } catch { }
    window.clearInterval(wake);
    if (my !== token.current) return false;

    pos.current = target;
    setStatic(to.x, to.y);
    anim.cancel(); moveAnim.current = null;
    setSwimming(false);

    const glide = Math.sign(dx) * Math.min(6, dist * 0.04);
    if (glide && act.current) {
      act.current.animate([
        { transform: 'translate(0,0)' }, { transform: `translate(${glide}px,0)` }, { transform: 'translate(0,0)' },
      ], { duration: 320, easing: 'ease-out' });
    }
    if (finalFace) await face(finalFace);
    onSettle?.(target);
    return my === token.current;
  }, [H, W, box.w, face, livePx, onSettle, onWake, reduced, setStatic, toPx]);

  const place = useCallback((p: Pt) => {
    token.current++;
    moveAnim.current?.cancel(); moveAnim.current = null;
    pos.current = p;
    const q = toPx(p); setStatic(q.x, q.y);
  }, [setStatic, toPx]);

  const enter = useCallback(async (from: Entry, p: Pt) => {
    setVisible(true);
    const dest = toPx(p);
    if (reduced || fast()) { place(p); return; }
    if (from === 'fade') {
      place(p);
      const el = mover.current; if (!el) return;
      const a = el.animate([
        { transform: tf(dest.x, dest.y - H * 0.25, 0, 0.45), opacity: 0 },
        { transform: tf(dest.x, dest.y, 0, 1), opacity: 1 },
      ], { duration: 460, easing: 'cubic-bezier(.2,.7,.3,1)' });
      await a.finished.catch(() => {});
      return;
    }
    const startX = from === 'left' ? -W * 0.8 : box.w + W * 0.8;
    facing.current = from === 'left' ? 'right' : 'left';
    if (flip.current) flip.current.style.transform = `scaleX(${facing.current === 'left' ? 1 : -1})`;
    pos.current = toN(startX, dest.y);
    setStatic(startX, dest.y);
    await swimTo(p);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [H, W, box.w, place, reduced, setStatic, swimTo, toN, toPx]);

  const leave = useCallback(async (how: Leave, via: Pt) => {
    if (reduced || fast()) return;
    const ok = await swimTo(via);
    if (!ok) return;
    const el = mover.current; if (!el) return;
    const here = toPx(via);
    if (how === 'left' || how === 'right') {
      const offX = how === 'left' ? -W : box.w + W;
      await swimTo(toN(offX, here.y));
      return;
    }
    const into = how === 'into';
    const a = el.animate([
      { transform: tf(here.x, here.y, 0, 1), opacity: 1 },
      { transform: tf(here.x, here.y + (into ? -H * 0.35 : H * 0.3), 0, into ? 0.35 : 1.3), opacity: 0 },
    ], { duration: into ? 420 : 340, easing: 'cubic-bezier(.5,0,.8,.4)', fill: 'forwards' });
    await a.finished.catch(() => {});
    a.cancel();
  }, [H, W, box.w, reduced, swimTo, toN, toPx]);

  const react = useCallback((g: Gesture, towardNx?: number) => {
    const el = act.current;
    if (!el || reduced || fast()) return;
    const fwd = (facing.current === 'left' ? -1 : 1);
    const u = H / 70;
    switch (g) {
      case 'grab':
        flash(620);
        el.animate([
          { transform: 'translate(0,0)' }, { transform: `translate(${fwd * 9 * u}px, ${2 * u}px) rotate(${fwd * 4}deg)` },
          { transform: 'translate(0,0)' },
        ], { duration: 300, easing: 'ease-out' });
        break;
      case 'nope':
        flash(480);
        el.animate([
          { transform: 'translateX(0)' }, { transform: `translateX(${-4 * u}px)` }, { transform: `translateX(${4 * u}px)` },
          { transform: `translateX(${-3 * u}px)` }, { transform: `translateX(${3 * u}px)` }, { transform: 'translateX(0)' },
        ], { duration: 380, easing: 'linear' });
        break;
      case 'happy':
        flash(760);
        el.animate([
          { transform: 'translateY(0) scale(1,1)' },
          { transform: `translateY(${-14 * u}px) scale(0.95,1.06)`, offset: 0.35 },
          { transform: 'translateY(0) scale(1.07,0.92)', offset: 0.62 },
          { transform: `translateY(${-4 * u}px) scale(1,1)`, offset: 0.8 },
          { transform: 'translateY(0) scale(1,1)' },
        ], { duration: 640, easing: 'ease-out' });
        break;
      case 'talk': {
        el.animate([{ scale: '1 1' }, { scale: '1.02 1.04' }, { scale: '1 1' }], { duration: 110, easing: 'ease-out' });
        const m = mouth.current;
        if (m && pose === 'idle') {
          const seq: Array<[string, number]> = [['0%', 40], ['100%', 45], ['0%', 35]];
          let k = 0;
          const step = () => {
            if (k >= seq.length) { m.style.visibility = 'hidden'; return; }
            m.style.visibility = 'visible'; m.style.backgroundPosition = `0% ${seq[k][0]}`;
            const d = seq[k][1]; k++; window.setTimeout(step, d);
          };
          step();
        }
        break;
      }
      case 'nod':
        el.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${3 * u}px)` }, { transform: 'translateY(0)' }], { duration: 220 });
        break;
      case 'lean': {
        const dir = towardNx === undefined ? fwd : (towardNx < pos.current.nx ? -1 : 1);
        el.animate([
          { transform: 'translate(0,0) rotate(0)' },
          { transform: `translate(${dir * 5 * u}px, ${2 * u}px) rotate(${-dir * 5}deg)`, offset: 0.25 },
          { transform: `translate(${dir * 5 * u}px, ${2 * u}px) rotate(${-dir * 5}deg)`, offset: 0.75 },
          { transform: 'translate(0,0) rotate(0)' },
        ], { duration: 1100, easing: 'ease-in-out' });
        break;
      }
    }
  }, [H, reduced, pose]);

  useImperativeHandle(ref, () => ({
    swimTo, enter, leave, place, react, face,
    pos: () => ({ ...pos.current }),
    tailPx: () => { const lp = livePx(); return { x: lp.x + (facing.current === 'left' ? W * 0.27 : -W * 0.27), y: lp.y + H * 0.1 }; },
  }), [enter, face, leave, livePx, place, react, swimTo, H, W]);

  useEffect(() => {
    if (reduced || !visible) return;
    let alive = true;
    const loop = async () => {
      while (alive) {
        await sleep(5200 + Math.random() * 5200);
        if (!alive || busy || fast() || moveAnim.current) continue;
        if (performance.now() - lastMove.current < 3500) continue;
        const r = Math.random();
        if (r < 0.42) {
          await face(facing.current === 'left' ? 'right' : 'left');
        } else if (r < 0.8) {
          const p = pos.current;
          const dx = (Math.random() < 0.5 ? -1 : 1) * (0.025 + Math.random() * 0.035);
          const dy = (Math.random() - 0.5) * 0.04;
          await swimTo({ nx: clamp(p.nx + dx, BOUNDS.x0 + 0.08, BOUNDS.x1 - 0.08), ny: clamp(p.ny + dy, BOUNDS.y0, BOUNDS.y1) });
        } else {
          react('nod');
        }
      }
    };
    loop();
    return () => { alive = false; };
  }, [busy, face, react, reduced, swimTo, visible]);

  useEffect(() => {
    if (reduced || !visible) return;
    let t = 0, alive = true;
    const next = () => {
      t = window.setTimeout(() => {
        if (!alive) return;
        if (pose === 'idle') blink(Math.random() < 0.18);
        next();
      }, 2200 + Math.random() * 3600);
    };
    next();
    return () => { alive = false; window.clearTimeout(t); };
  }, [blink, pose, reduced, visible]);

  useEffect(() => {
    if (reduced || pointerNx === null || busy || swimming) return;
    const behind = facing.current === 'left' ? pointerNx > pos.current.nx + 0.06 : pointerNx < pos.current.nx - 0.06;
    if (!behind) return;
    const t = window.setTimeout(() => {
      if (!moveAnim.current) face(facing.current === 'left' ? 'right' : 'left');
    }, 1300);
    return () => window.clearTimeout(t);
  }, [pointerNx, busy, swimming, face, reduced]);

  if (!box.sw) return null;
  return (
    <div ref={mover} aria-hidden
      style={{
        position: 'absolute', left: 0, top: 0, width: W, height: H, zIndex: 5,
        pointerEvents: 'none', willChange: 'transform', visibility: visible ? 'visible' : 'hidden',
      }}>
      <div ref={act} style={{ width: '100%', height: '100%' }}>
        <div ref={flip} style={{ width: '100%', height: '100%', transform: 'scaleX(-1)' }}>
          <div className={'finn-hover' + (swimming ? ' is-swim' : '')}
            style={{ width: '100%', height: '100%', position: 'relative' }}>
            <div className="finn-rig" style={{ position: 'absolute', inset: 0, opacity: pose === 'idle' ? 1 : 0 }}>
              <img src="/finn/characters/finn-rig-tail.png" alt="" draggable={false} className="finn-rig-tail"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.42))' }} />
              <div className="finn-rig-body" style={{ position: 'absolute', inset: 0 }}>
                <img src="/finn/characters/finn-rig-body.png" alt="" draggable={false}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.42))' }} />
                <div ref={lids} aria-hidden
                  style={{
                    position: 'absolute', left: '15.59%', top: '28.96%',
                    width: '35.27%', height: '29.13%',
                    backgroundImage: 'url(/finn/characters/finn-blink.png)', backgroundSize: '100% 300%',
                    backgroundRepeat: 'no-repeat', backgroundPosition: '0% 0%', visibility: 'hidden',
                  }} />
                <div ref={mouth} aria-hidden
                  style={{
                    position: 'absolute', left: '18.63%', top: '55.66%',
                    width: '26.29%', height: '20.39%',
                    backgroundImage: 'url(/finn/characters/mouth/finn.png)', backgroundSize: '100% 200%',
                    backgroundRepeat: 'no-repeat', backgroundPosition: '0% 0%', visibility: 'hidden',
                  }} />
              </div>
            </div>
            <img src="/finn/characters/finn-rig-react.png" alt="" draggable={false} aria-hidden
              style={{ position: 'absolute', left: '4%', top: '-6%', width: '92%', height: '112%', objectFit: 'contain',
                       filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.42))', opacity: pose === 'react' ? 1 : 0 }} />
          </div>
        </div>
      </div>
    </div>
  );
});
