'use client';
import { useEffect, useRef, useState } from 'react';
import { GW, GH, GameFrame, Overlay, useLoop, useBest } from './GameShell';

const COLORS = ['#e53935', '#43a047', '#1e88e5', '#fdd835', '#8e24aa', '#fb8c00'];
const R = 14, COLS = 16;
type Cell = number | null;
export function BubblePop({ onBack }: { onBack: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { best, record } = useBest('bubble');
  const [state, setState] = useState<'ready' | 'play' | 'over' | 'won'>('ready');
  const [score, setScore] = useState(0);
  const grid = useRef<Cell[][]>([]); const aim = useRef(-Math.PI / 2); const shot = useRef<{ x: number; y: number; vx: number; vy: number; c: number } | null>(null);
  const next = useRef(0); const sc = useRef(0); const frame = useRef(0); const [, force] = useState(0);

  const start = () => {
    grid.current = Array.from({ length: 12 }, (_, r) => Array.from({ length: COLS }, () => (r < 5 ? Math.floor(Math.random() * 5) : null)));
    shot.current = null; next.current = Math.floor(Math.random() * 5); sc.current = 0; setScore(0); setState('play');
  };
  const cx = (c: number, r: number) => c * 2 * R + R + (r % 2 ? R : 0) + 8;
  const cy = (r: number) => r * (R * 1.75) + R + 6;

  const settle = (x: number, y: number, col: number) => {
    let br = Math.max(0, Math.round((y - R - 6) / (R * 1.75))); let bc = Math.round((x - R - 8 - (br % 2 ? R : 0)) / (2 * R));
    bc = Math.max(0, Math.min(COLS - 1 - (br % 2 ? 1 : 0), bc));
    while (grid.current[br]?.[bc] !== null && br < 12) br++;
    if (br >= 12) { setState('over'); record(sc.current); return; }
    grid.current[br][bc] = col;
    const seen = new Set<string>(); const stack = [[br, bc]];
    const nb = (r: number, c: number) => (r % 2 ? [[r, c - 1], [r, c + 1], [r - 1, c], [r - 1, c + 1], [r + 1, c], [r + 1, c + 1]] : [[r, c - 1], [r, c + 1], [r - 1, c - 1], [r - 1, c], [r + 1, c - 1], [r + 1, c]]);
    while (stack.length) { const [r, c] = stack.pop()!; const k = r + ',' + c; if (seen.has(k) || grid.current[r]?.[c] !== col) continue; seen.add(k); nb(r, c).forEach((n) => stack.push(n)); }
    if (seen.size >= 3) { seen.forEach((k) => { const [r, c] = k.split(',').map(Number); grid.current[r][c] = null; }); sc.current += seen.size * 10; setScore(sc.current);
      const anchored = new Set<string>(); const st2: number[][] = []; for (let c = 0; c < COLS; c++) if (grid.current[0][c] !== null) st2.push([0, c]);
      while (st2.length) { const [r, c] = st2.pop()!; const k = r + ',' + c; if (anchored.has(k) || grid.current[r]?.[c] == null) continue; anchored.add(k); nb(r, c).forEach((n) => st2.push(n)); }
      for (let r = 0; r < 12; r++) for (let c = 0; c < COLS; c++) if (grid.current[r][c] !== null && !anchored.has(r + ',' + c)) { grid.current[r][c] = null; sc.current += 20; }
      setScore(sc.current);
    }
    if (grid.current.every((row) => row.every((v) => v === null))) { setState('won'); record(sc.current + 500); }
  };

  useLoop(state === 'play', (dt) => {
    frame.current++;
    const s = shot.current;
    if (s) {
      s.x += s.vx * dt; s.y += s.vy * dt;
      if (s.x < R) { s.x = R; s.vx *= -1; } if (s.x > GW - R) { s.x = GW - R; s.vx *= -1; }
      let hit = s.y <= R + 6;
      if (!hit) for (let r = 0; r < 12 && !hit; r++) for (let c = 0; c < COLS; c++) if (grid.current[r][c] !== null && Math.hypot(cx(c, r) - s.x, cy(r) - s.y) < R * 1.9) { hit = true; break; }
      if (hit) { settle(s.x, s.y, s.c); shot.current = null; next.current = Math.floor(Math.random() * 5); }
    }
    force((v) => v + 1);
  });

  useEffect(() => {
    const c = canvas.current?.getContext('2d'); if (!c) return;
    c.fillStyle = '#0b1a3a'; c.fillRect(0, 0, GW, GH);
    grid.current.forEach((row, r) => row.forEach((v, col) => { if (v === null) return; c.fillStyle = COLORS[v]; c.beginPath(); c.arc(cx(col, r), cy(r), R - 1, 0, Math.PI * 2); c.fill(); c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.arc(cx(col, r) - 4, cy(r) - 4, 4, 0, Math.PI * 2); c.fill(); }));
    const s = shot.current; const bx = GW / 2, by = GH - 20;
    c.strokeStyle = 'rgba(255,255,255,0.35)'; c.setLineDash([4, 6]); c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + Math.cos(aim.current) * 90, by + Math.sin(aim.current) * 90); c.stroke(); c.setLineDash([]);
    c.fillStyle = COLORS[s ? s.c : next.current]; c.beginPath(); c.arc(s ? s.x : bx, s ? s.y : by, R - 1, 0, Math.PI * 2); c.fill();
  });

  const pointer = (x: number, y: number, kind: 'down' | 'move' | 'up') => {
    const bx = GW / 2, by = GH - 20; const a = Math.atan2(y - by, x - bx);
    aim.current = Math.max(-Math.PI + 0.25, Math.min(-0.25, a));
    if (kind === 'down' && state === 'play' && !shot.current) shot.current = { x: bx, y: by, vx: Math.cos(aim.current) * 420, vy: Math.sin(aim.current) * 420, c: next.current };
  };

  return (
    <GameFrame title="Bubble Pop Deluxe" color="#00838f" canvasRef={canvas} onBack={onBack} onCanvasPointer={pointer} status={<>Score {score} · Best {best}</>} controls="Move the mouse to aim, click to shoot. Match 3 to pop.">
      {state === 'ready' && <Overlay color="#00838f" onClick={start}><b>Bubble Pop Deluxe</b><br />Clear the board!<br /><small>click to start</small></Overlay>}
      {state === 'over' && <Overlay color="#00838f" onClick={start}><b>The bubbles reached the bottom.</b><br />Score {score}<br /><small>click to play again</small></Overlay>}
      {state === 'won' && <Overlay color="#00838f" onClick={start}><b>Board cleared!</b><br />Score {score}<br /><small>click to play again</small></Overlay>}
    </GameFrame>
  );
}
