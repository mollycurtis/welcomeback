'use client';
import { useEffect, useRef, useState } from 'react';
import { GW, GH, GameFrame, Overlay, useKeys, useLoop, useBest } from './GameShell';

const SPRITE: Record<string, HTMLImageElement> = {};
if (typeof Image !== 'undefined') {
  for (const k of ['patty', 'cheese', 'lettuce', 'tomato']) { const im = new Image(); im.src = `/maplegrove/games/ing-${k}.png`; SPRITE[k] = im; }
  const bt = new Image(); bt.src = '/maplegrove/games/bun-top.png'; SPRITE['top bun'] = bt;
  const bb = new Image(); bb.src = '/maplegrove/games/bun-bottom.png'; SPRITE['bun'] = bb;
}
const drawIng = (c: CanvasRenderingContext2D, name: string, color: string, x: number, y: number, w: number, h: number) => {
  const im = SPRITE[name];
  if (im && im.complete && im.naturalWidth) { const hh = name.includes('bun') ? h * 2.6 : h * 2.2; c.drawImage(im, x, y - hh * 0.35, w, hh); return; }
  if (false) {
  }
  c.fillStyle = color; c.beginPath(); c.roundRect(x, y, w, h, name.includes('bun') ? h : 3); c.fill();
};
const ING = [{ n: 'bun', c: '#e0a85b' }, { n: 'patty', c: '#6b3e26' }, { n: 'cheese', c: '#f7c948' }, { n: 'lettuce', c: '#5cb85c' }, { n: 'tomato', c: '#e04a3a' }, { n: 'top bun', c: '#e0a85b' }];
interface Drop { x: number; y: number; k: number; v: number }
export function BurgerTime({ onBack }: { onBack: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const keys = useKeys(); const { best, record } = useBest('burger');
  const [state, setState] = useState<'ready' | 'play' | 'over'>('ready');
  const [hud, setHud] = useState({ score: 0, time: 60, stack: 0 });
  const px = useRef(GW / 2); const drops = useRef<Drop[]>([]); const stack = useRef<number[]>([]); const sc = useRef(0); const time = useRef(60); const spawn = useRef(0); const [, force] = useState(0);
  const start = () => { drops.current = []; stack.current = []; sc.current = 0; time.current = 60; setHud({ score: 0, time: 60, stack: 0 }); setState('play'); };
  const need = () => Math.min(stack.current.length, ING.length - 1);

  useLoop(state === 'play', (dt) => {
    const k = keys.current; if (k.has('ArrowLeft')) px.current -= 300 * dt; if (k.has('ArrowRight')) px.current += 300 * dt; px.current = Math.max(24, Math.min(GW - 24, px.current));
    time.current -= dt; spawn.current -= dt;
    if (spawn.current <= 0) { spawn.current = 1.15; const want = need(); const k2 = Math.random() < 0.6 ? want : Math.floor(Math.random() * ING.length); drops.current.push({ x: 30 + Math.random() * (GW - 60), y: -20, k: k2, v: 65 + Math.random() * 40 + (60 - time.current) * 0.9 }); }
    const top = GH - 30 - stack.current.length * 9;
    for (const d of drops.current) {
      d.y += d.v * dt;
      if (d.y > top - 8 && d.y < top + 10 && Math.abs(d.x - px.current) < 34) {
        if (d.k === need()) { stack.current.push(d.k); sc.current += 10; if (d.k === ING.length - 1) { sc.current += 50; stack.current = []; } } else { sc.current = Math.max(0, sc.current - 5); }
        d.y = GH + 50;
      }
    }
    drops.current = drops.current.filter((d) => d.y < GH + 20);
    setHud({ score: sc.current, time: Math.max(0, Math.ceil(time.current)), stack: stack.current.length });
    if (time.current <= 0) { setState('over'); record(sc.current); }
    force((v) => v + 1);
  });

  useEffect(() => {
    const c = canvas.current?.getContext('2d'); if (!c) return;
    c.fillStyle = '#2b2b2b'; c.fillRect(0, 0, GW, GH);
    c.fillStyle = '#444'; c.fillRect(0, GH - 24, GW, 24);
    c.fillStyle = '#fff8e1'; c.fillRect(GW - 110, 8, 102, 26 + ING.length * 12); c.fillStyle = '#333'; c.font = 'bold 10px Verdana'; c.fillText('ORDER', GW - 102, 22);
    ING.forEach((g, i) => { c.fillStyle = i < stack.current.length ? '#9e9e9e' : i === need() ? '#c62828' : '#333'; c.font = (i === need() ? 'bold ' : '') + '10px Verdana'; c.fillText((i < stack.current.length ? '✓ ' : '') + g.n, GW - 102, 36 + i * 12); });
    c.fillStyle = '#eee'; c.fillRect(px.current - 36, GH - 30, 72, 6);
    stack.current.forEach((k, i) => drawIng(c, ING[k].n, ING[k].c, px.current - 30, GH - 39 - i * 9, 60, 9));
    drops.current.forEach((d) => { drawIng(c, ING[d.k].n, ING[d.k].c, d.x - 22, d.y - 5, 44, 10);  });
  });

  return (
    <GameFrame title="Burger Time!" color="#d27b1c" canvasRef={canvas} onBack={onBack} status={<>Score {hud.score} · {hud.time}s · Best {best}</>} controls="← → move the plate. Catch ingredients in ticket order. Wrong one costs 5.">
      {state === 'ready' && <Overlay color="#d27b1c" onClick={start}><b>Burger Time!</b><br />Stack &apos;em up!<br /><small>click to start</small></Overlay>}
      {state === 'over' && <Overlay color="#d27b1c" onClick={start}><b>Kitchen closed.</b><br />Score {hud.score}<br /><small>click to play again</small></Overlay>}
    </GameFrame>
  );
}
