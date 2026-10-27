'use client';

import { useEffect, useRef, useState } from 'react';
import { GameShell, useGame } from './GameShell';
import { MGButton } from '../ui';

const COLS = 10, ROWS = 16, CELL = 20, W = 680, H = 360;
const WELL_X = 240, WELL_Y = 14;
const BG: HTMLImageElement = typeof Image !== 'undefined' ? new Image() : ({} as HTMLImageElement);
if (typeof Image !== 'undefined') BG.src = '/maplegrove/games/blocks.jpg';
const BGX = 78, BGW = 524;
const PIECES: { cells: [number, number][]; color: string }[] = [
  { cells: [[0, 0], [1, 0], [2, 0], [3, 0]], color: '#4fb0a0' },
  { cells: [[0, 0], [1, 0], [0, 1], [1, 1]], color: '#e8c64a' },
  { cells: [[0, 0], [1, 0], [2, 0], [1, 1]], color: '#7b4fa0' },
  { cells: [[0, 0], [1, 0], [2, 0], [2, 1]], color: '#e08a1e' },
  { cells: [[0, 0], [1, 0], [2, 0], [0, 1]], color: '#3f6fb0' },
  { cells: [[0, 0], [1, 0], [1, 1], [2, 1]], color: '#5aa84a' },
  { cells: [[1, 0], [2, 0], [0, 1], [1, 1]], color: '#d8322a' },
];
const LINE_PTS = [0, 2, 5, 9, 15];

type Cell = string | null;
interface Piece { cells: [number, number][]; color: string; x: number; y: number }
interface S { grid: Cell[][]; cur: Piece; next: Piece; fall: number; interval: number; score: number; rows: number; placed: number; over: boolean }

const spawn = (): Piece => { const p = PIECES[Math.floor(Math.random() * PIECES.length)]; return { cells: p.cells.map((c) => [...c] as [number, number]), color: p.color, x: 3, y: -1 }; };
const fresh = (): S => ({ grid: Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(null)), cur: spawn(), next: spawn(), fall: 0, interval: 0.7, score: 0, rows: 0, placed: 0, over: false });
const fits = (g: Cell[][], p: Piece, dx = 0, dy = 0, cells = p.cells) => cells.every(([cx, cy]) => { const x = p.x + cx + dx, y = p.y + cy + dy; return x >= 0 && x < COLS && y < ROWS && (y < 0 || !g[y][x]); });
const rotated = (p: Piece): [number, number][] => { const maxY = Math.max(...p.cells.map((c) => c[1])); return p.cells.map(([x, y]) => [maxY - y, x] as [number, number]); };

export function BlockDrop({ onExit }: { onExit: (msg?: string) => void }) {
  const g = useGame('blocks');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const st = useRef<S>(fresh());
  const raf = useRef(0);
  const [rows, setRows] = useState(0);

  const start = () => { st.current = fresh(); setRows(0); g.start(); };

  const lock = (s: S) => {
    s.cur.cells.forEach(([cx, cy]) => { const y = s.cur.y + cy; if (y < 0) { s.over = true; return; } s.grid[y][s.cur.x + cx] = s.cur.color; });
    if (s.over) return;
    let cleared = 0;
    s.grid = s.grid.filter((row) => { const full = row.every(Boolean); if (full) cleared++; return !full; });
    while (s.grid.length < ROWS) s.grid.unshift(Array<Cell>(COLS).fill(null));
    s.rows += cleared; s.score += LINE_PTS[cleared]; s.placed += 1; if (s.placed % 10 === 0) s.score += 1;
    s.interval = Math.max(0.16, 0.7 - Math.floor(s.rows / 5) * 0.08);
    setRows(s.rows);
    s.cur = s.next; s.next = spawn();
    if (!fits(s.grid, s.cur)) s.over = true;
  };
  const act = (a: 'left' | 'right' | 'rot' | 'down' | 'drop') => {
    const s = st.current; if (g.status !== 'playing' || s.over) return;
    if (a === 'left' && fits(s.grid, s.cur, -1)) s.cur.x -= 1;
    if (a === 'right' && fits(s.grid, s.cur, 1)) s.cur.x += 1;
    if (a === 'rot') { const r = rotated(s.cur); if (fits(s.grid, s.cur, 0, 0, r)) s.cur.cells = r; else if (fits(s.grid, s.cur, -1, 0, r)) { s.cur.x -= 1; s.cur.cells = r; } else if (fits(s.grid, s.cur, 1, 0, r)) { s.cur.x += 1; s.cur.cells = r; } }
    if (a === 'down') { if (fits(s.grid, s.cur, 0, 1)) s.cur.y += 1; else lock(s); s.fall = 0; }
    if (a === 'drop') { while (fits(s.grid, s.cur, 0, 1)) s.cur.y += 1; lock(s); s.fall = 0; }
  };

  useEffect(() => {
    if (g.status !== 'playing') return;
    const key = (e: KeyboardEvent) => {
      const map: Record<string, Parameters<typeof act>[0]> = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'rot', ArrowDown: 'down', ' ': 'drop', a: 'left', d: 'right', w: 'rot', s: 'down' };
      const a = map[e.key]; if (a) { e.preventDefault(); act(a); }
    };
    window.addEventListener('keydown', key);
    const ctx = canvasRef.current!.getContext('2d')!;
    let prev = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - prev) / 1000); prev = t;
      const s = st.current;
      s.fall += dt;
      if (s.fall >= s.interval) { s.fall = 0; if (fits(s.grid, s.cur, 0, 1)) s.cur.y += 1; else lock(s); }
      draw(ctx, s);
      if (s.over) { g.finish(s.score, 3); return; }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener('keydown', key); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [g.status]);

  return (
    <GameShell id="blocks" title="Block Drop" best={g.best} status={g.status} score={g.status === 'playing' ? st.current.score : g.score} reward={g.reward}
      stats={<span>Rows: {rows}</span>} overTitle="Topped out!"
      intro={<>Pieces fall into the well. <b>← →</b> move, <b>↑</b> rotates, <b>↓</b> nudges, <b>space</b> drops. Fill a whole row to clear it, four at once is worth the most. The well speeds up every five rows.</>}
      tip="Keep the stack flat and leave one column open for the long bar." onStart={start} onExit={onExit}>
      <canvas ref={canvasRef} width={W} height={H} style={{ display: 'block', width: '100%', height: 'auto' }} />
      {g.status === 'playing' && (
        <div style={{ position: 'absolute', right: 14, bottom: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 40px)', gap: 4 }}>
          <span /><MGButton color="plain" style={{ padding: '4px 0', fontSize: 13 }} onClick={() => act('rot')}>⟳</MGButton><span />
          <MGButton color="plain" style={{ padding: '4px 0', fontSize: 13 }} onClick={() => act('left')}>◀</MGButton>
          <MGButton color="plain" style={{ padding: '4px 0', fontSize: 13 }} onClick={() => act('drop')}>▼▼</MGButton>
          <MGButton color="plain" style={{ padding: '4px 0', fontSize: 13 }} onClick={() => act('right')}>▶</MGButton>
        </div>
      )}
    </GameShell>
  );
}

function block(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.fillStyle = color; ctx.fillRect(x, y, CELL, CELL);
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(x, y, CELL, 3); ctx.fillRect(x, y, 3, CELL);
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(x, y + CELL - 3, CELL, 3); ctx.fillRect(x + CELL - 3, y, 3, CELL);
  ctx.strokeStyle = '#1b1430'; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, CELL - 1, CELL - 1);
}

function draw(ctx: CanvasRenderingContext2D, s: S) {
  ctx.fillStyle = '#12101c'; ctx.fillRect(0, 0, W, H);
  if (BG.complete && BG.naturalWidth) ctx.drawImage(BG, BGX, 0, BGW, H);
  ctx.fillStyle = '#17122c'; ctx.fillRect(WELL_X, WELL_Y, COLS * CELL, ROWS * CELL);
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  for (let x = 1; x < COLS; x++) { ctx.beginPath(); ctx.moveTo(WELL_X + x * CELL, WELL_Y); ctx.lineTo(WELL_X + x * CELL, WELL_Y + ROWS * CELL); ctx.stroke(); }
  s.grid.forEach((row, y) => row.forEach((c, x) => { if (c) block(ctx, WELL_X + x * CELL, WELL_Y + y * CELL, c); }));
  s.cur.cells.forEach(([cx, cy]) => { const y = s.cur.y + cy; if (y >= 0) block(ctx, WELL_X + (s.cur.x + cx) * CELL, WELL_Y + y * CELL, s.cur.color); });
  ctx.fillStyle = '#ffd27a'; ctx.font = 'bold 16px Verdana, sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(String(s.score), BGX + BGW * 0.16, 60);
  ctx.fillText(String(Math.floor(s.rows / 5) + 1), BGX + BGW * 0.16, 104);
  ctx.fillText(String(s.rows), BGX + BGW * 0.16, 146);
  const nx = BGX + BGW * 0.84 - (Math.max(...s.next.cells.map((c) => c[0])) + 1) * 5, ny = 58;
  s.next.cells.forEach(([cx, cy]) => { ctx.fillStyle = s.next.color; ctx.fillRect(nx + cx * 10, ny + cy * 10, 9, 9); });
}
