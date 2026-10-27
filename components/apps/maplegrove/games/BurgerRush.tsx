'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from 'react';
import { GameShell, useGame } from './GameShell';

const SECS = 45;
type Ing = 'patty' | 'cheese' | 'lettuce' | 'tomato' | 'onion' | 'bacon' | 'pickle' | 'topbun';
const ING: Record<Ing, { name: string; color: string; h: number; seat: number; edge: string }> = {
  patty:   { name: 'Patty',   color: '#6b3f24', h: 82,  seat: 0.585, edge: '#4a2a16' },
  cheese:  { name: 'Cheese',  color: '#f5c542', h: 95,  seat: 0.632, edge: '#d9a51f' },
  lettuce: { name: 'Lettuce', color: '#7fcf5a', h: 106, seat: 0.443, edge: '#5aa83a' },
  tomato:  { name: 'Tomato',  color: '#e04a3a', h: 77,  seat: 0.481, edge: '#b8352a' },
  onion:   { name: 'Onion',   color: '#efe0f2', h: 84,  seat: 0.476, edge: '#c9a8d0' },
  bacon:   { name: 'Bacon',   color: '#b84a3a', h: 66,  seat: 0.379, edge: '#7a2a20' },
  pickle:  { name: 'Pickle',  color: '#5f9a3a', h: 110, seat: 0.545, edge: '#3f6f28' },
  topbun:  { name: 'Top Bun', color: '#e0a557', h: 117, seat: 0.291, edge: '#b57a34' },
};
const ALL: Ing[] = ['patty', 'cheese', 'lettuce', 'tomato', 'onion', 'bacon', 'pickle'];
const BINS: Ing[] = [...ALL, 'topbun'];

const STACK_W = 132;
const BUN_LIFT = 8;
const BUN_W = 138;
const BUN_H = (BUN_W * 86) / 270;
const BUN_SEAT = 1 - 34 / 86;

const layerHeight = (ing: Ing) => (STACK_W * ING[ing].h) / 300;

function stackOffsets(stack: Ing[]): { ing: Ing; bottom: number }[] {
  let y = BUN_LIFT + BUN_H * BUN_SEAT;
  const out: { ing: Ing; bottom: number }[] = [];
  for (const ing of stack) {
    out.push({ ing, bottom: y });
    y += layerHeight(ing) * ING[ing].seat;
  }
  return out;
}

const newOrder = (n: number): Ing[] => {
  const o: Ing[] = ['patty'];
  while (o.length < n) o.push(ALL[Math.floor(Math.random() * ALL.length)]);
  o.push('topbun');
  return o;
};

export function BurgerRush({ onExit }: { onExit: (msg?: string) => void }) {
  const g = useGame('burger');
  const [timeLeft, setTimeLeft] = useState(SECS);
  const [order, setOrder] = useState<Ing[]>(() => newOrder(2));
  const [stack, setStack] = useState<Ing[]>([]);
  const [served, setServed] = useState(0);
  const [shake, setShake] = useState(false);
  const scoreRef = useRef(0);
  const servedRef = useRef(0);
  const finished = useRef(false);

  const end = () => { if (finished.current) return; finished.current = true; g.finish(scoreRef.current, 1); };
  const start = () => {
    scoreRef.current = 0; servedRef.current = 0; setServed(0); setStack([]); setOrder(newOrder(2)); setTimeLeft(SECS);
    finished.current = false; g.start();
  };

  useEffect(() => {
    if (g.status !== 'playing') return;
    const t0 = performance.now();
    const iv = window.setInterval(() => {
      const left = Math.max(0, SECS - Math.floor((performance.now() - t0) / 1000));
      setTimeLeft(left);
      if (left <= 0) { window.clearInterval(iv); end(); }
    }, 250);
    return () => window.clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [g.status]);

  const add = (ing: Ing) => {
    if (g.status !== 'playing') return;
    const i = stack.length;
    if (order[i] !== ing) {
      setStack([]); setShake(true); window.setTimeout(() => setShake(false), 300);
      scoreRef.current = Math.max(0, scoreRef.current - 2); g.setScore(scoreRef.current);
      return;
    }
    const next = [...stack, ing];
    if (next.length === order.length) {
      servedRef.current += 1; setServed(servedRef.current);
      scoreRef.current += 3 + order.length * 2; g.setScore(scoreRef.current);
      setStack(next);
      window.setTimeout(() => {
        setStack([]);
        setOrder(newOrder(Math.min(7, 2 + Math.floor(servedRef.current / 2))));
      }, 600);
    } else setStack(next);
  };

  return (
    <GameShell id="burger" title="Burger Rush" best={g.best} status={g.status} score={g.score} timeLeft={timeLeft} reward={g.reward}
      stats={<span style={{ color: '#f3a23a' }}>Served: {served}</span>}
      intro={<>Read the order ticket and click the ingredients in the order listed, top to bottom. The buns are on us. Finish the stack to serve it, taller burgers pay more. A wrong ingredient dumps the plate. {SECS} seconds!</>}
      tip="click the ingredients in ticket order, first line first. The next one is highlighted." onStart={start} onExit={onExit}>
      <div style={{ width: 680, height: 360, background: 'url(/maplegrove/games/burger.jpg) center / cover', position: 'relative', display: 'flex' }}>
        <div style={{ position: 'absolute', left: 22, top: 18, width: 150, background: '#fffdf5', border: '2px solid #cdbf9e', borderRadius: 4, padding: '8px 10px', boxShadow: '2px 3px 0 rgba(0,0,0,0.15)', fontSize: 12 }}>
          <div style={{ fontWeight: 800, borderBottom: '1px dashed #cdbf9e', marginBottom: 6, color: '#5a4a30' }}>ORDER #{served + 1}</div>
          {order.map((ing, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: i < stack.length ? '#a09880' : i === stack.length ? '#c0392b' : '#3a2a10', padding: '1px 4px', borderRadius: 3, background: i === stack.length ? '#fff1d6' : 'transparent', textDecoration: i < stack.length ? 'line-through' : 'none' }}>
              <img src={`/maplegrove/games/ing-${ing}.png`} alt="" draggable={false} style={{ width: 22, height: 10, objectFit: 'contain' }} />{ING[ing].name}
            </div>
          ))}
        </div>

        <div style={{ position: 'absolute', left: '50%', bottom: 228, transform: 'translateX(-50%)', color: '#fff', fontWeight: 900, fontSize: 12, textShadow: '0 1px 3px rgba(0,0,0,0.6)', background: 'rgba(40,30,52,0.55)', padding: '2px 10px', borderRadius: 10 }}>{stack.length}/{order.length} on the bun</div>
        <div style={{ position: 'absolute', left: '50%', bottom: 96, transform: `translateX(-50%) ${shake ? 'translateX(-6px)' : ''}`, transition: 'transform .08s', width: 200, height: 260 }}>
          <div style={{ position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)', width: 200, height: 14, borderRadius: 100, background: '#e9eef2', border: '2px solid #b8c4cc' }} />
          <img src="/maplegrove/games/bun-bottom.png" alt="" draggable={false}
            style={{ position: 'absolute', left: '50%', bottom: BUN_LIFT, transform: 'translateX(-50%)', width: BUN_W, height: 'auto', display: 'block' }} />
          {stackOffsets(stack).map(({ ing, bottom }, i) => (
            <img key={i} src={`/maplegrove/games/ing-${ing}.png`} alt={ING[ing].name} draggable={false}
              style={{ position: 'absolute', left: '50%', bottom, transform: 'translateX(-50%)', width: STACK_W, height: 'auto', display: 'block', zIndex: i + 2, filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.35))' }} />
          ))}
        </div>

        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 108, background: '#8a5a2c', borderTop: '6px solid #6f4421' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 5, padding: '6px 8px' }}>
            {BINS.map((ing) => (
              <button key={ing} onClick={() => add(ing)} style={{ border: '2px solid rgba(60,40,20,0.35)', background: 'rgba(255,250,240,0.92)', borderRadius: 8, padding: '5px 0 3px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, boxShadow: '0 3px 0 rgba(0,0,0,0.25)' }}>
                <img src={`/maplegrove/games/ing-${ing}.png`} alt="" draggable={false} style={{ width: 44, height: 22, objectFit: 'contain', flex: '0 0 auto', display: 'block' }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: '#3a2a10' }}>{ING[ing].name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
}
