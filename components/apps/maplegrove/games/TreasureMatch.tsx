'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from 'react';
import { GameShell, useGame } from './GameShell';

const SECS = 60;
const GEMS = [
  { id: 'ruby', img: 1 }, { id: 'sapphire', img: 2 }, { id: 'emerald', img: 3 }, { id: 'amethyst', img: 4 },
  { id: 'diamond', img: 5 }, { id: 'topaz', img: 6 }, { id: 'rose', img: 7 }, { id: 'aqua', img: 8 },
];

interface Card { key: number; gem: number; up: boolean; done: boolean }

function shuffle<T>(a: T[]): T[] { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
const deal = (): Card[] => shuffle([...GEMS.keys(), ...GEMS.keys()]).map((gem, key) => ({ key, gem, up: false, done: false }));

export function TreasureMatch({ onExit }: { onExit: (msg?: string) => void }) {
  const g = useGame('match');
  const [cards, setCards] = useState<Card[]>(deal);
  const [timeLeft, setTimeLeft] = useState(SECS);
  const [combo, setCombo] = useState(0);
  const open = useRef<number[]>([]);
  const lock = useRef(false);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const finished = useRef(false);

  const end = (bonus = 0) => {
    if (finished.current) return; finished.current = true;
    g.finish(scoreRef.current + bonus, 1.2);
  };

  const start = () => {
    setCards(deal()); open.current = []; lock.current = false; scoreRef.current = 0; comboRef.current = 0;
    setCombo(0); setTimeLeft(SECS); finished.current = false; g.start();
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

  const flip = (key: number) => {
    if (g.status !== 'playing' || lock.current) return;
    const c = cards[key]; if (c.up || c.done) return;
    const next = cards.map((x) => (x.key === key ? { ...x, up: true } : x));
    setCards(next); open.current.push(key);
    if (open.current.length < 2) return;
    lock.current = true;
    const [a, b] = open.current;
    if (next[a].gem === next[b].gem) {
      comboRef.current += 1;
      scoreRef.current += 10 + Math.min(15, Math.max(0, comboRef.current - 1) * 3);
      g.setScore(scoreRef.current); setCombo(comboRef.current);
      window.setTimeout(() => {
        const done = next.map((x) => (x.key === a || x.key === b ? { ...x, done: true } : x));
        setCards(done); open.current = []; lock.current = false;
        if (done.every((x) => x.done)) end(Math.floor(timeLeft / 2));
      }, 350);
    } else {
      comboRef.current = 0; setCombo(0);
      window.setTimeout(() => {
        setCards((cs) => cs.map((x) => (x.key === a || x.key === b ? { ...x, up: false } : x)));
        open.current = []; lock.current = false;
      }, 750);
    }
  };

  return (
    <GameShell id="match" title="Treasure Match" best={g.best} status={g.status} score={g.score} timeLeft={timeLeft} reward={g.reward}
      stats={combo > 1 ? <span style={{ color: '#7fe0a0' }}>Combo ×{combo}</span> : undefined}
      overTitle={cards.every((c) => c.done) ? 'Board cleared!' : "Time's up!"}
      intro={<>Flip two cards to find matching gems. Every pair is worth 10 points, and matching again right away builds a combo. Clear all 8 pairs before the clock runs out to bank a time bonus.</>}
      tip="remember where the misses were, they come back." onStart={start} onExit={onExit}>
      <div style={{ width: 680, height: 360, background: 'url(/maplegrove/games/match.jpg) center / cover', display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: 10, padding: 14, boxSizing: 'border-box' }}>
        {cards.map((c) => (
          <button key={c.key} onClick={() => flip(c.key)} disabled={c.done}
            style={{ position: 'relative', border: 'none', padding: 0, background: 'transparent', cursor: c.done ? 'default' : 'pointer', perspective: 600 }}>
            <div style={{ position: 'absolute', inset: 0, transition: 'transform .3s', transformStyle: 'preserve-3d', transform: c.up || c.done ? 'rotateY(180deg)' : 'none' }}>
              <img src="/maplegrove/games/cards/back.png" alt="" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', backfaceVisibility: 'hidden', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.4))' }} />
              <img src={`/maplegrove/games/cards/gem-${GEMS[c.gem].img}.png`} alt={GEMS[c.gem].id} draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', opacity: c.done ? 0.45 : 1, filter: c.done ? 'grayscale(0.6)' : 'drop-shadow(0 2px 3px rgba(0,0,0,0.4))' }} />
            </div>
          </button>
        ))}
      </div>
    </GameShell>
  );
}
