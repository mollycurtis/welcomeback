'use client';
import { useEffect, useRef, useState } from 'react';
import { GW, GH, GameFrame, Overlay, useKeys, useLoop, useBest } from './GameShell';

const COLS = 24, ROWS = 16, CS = 20;
function genMaze(seed: number) {
  let s = seed; const rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  const walls = Array.from({ length: ROWS }, () => Array(COLS).fill(true));
  const carve = (x: number, y: number) => {
    walls[y][x] = false;
    const dirs = [[2, 0], [-2, 0], [0, 2], [0, -2]].sort(() => rnd() - 0.5);
    for (const [dx, dy] of dirs) { const nx = x + dx, ny = y + dy; if (nx > 0 && ny > 0 && nx < COLS - 1 && ny < ROWS - 1 && walls[ny][nx]) { walls[y + dy / 2][x + dx / 2] = false; carve(nx, ny); } }
  };
  carve(1, 1);
  const ex = COLS - 2, ey = ROWS - 2;
  walls[ey][ex] = false;
  walls[ey][ex - 1] = false;
  walls[ey - 1][ex] = false;
  return walls;
}

export function MazeGame({ onBack }: { onBack: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const keys = useKeys();
  const { best, record } = useBest('maze');
  const [level, setLevel] = useState(1);
  const [state, setState] = useState<'ready' | 'play' | 'won'>('ready');
  const [time, setTime] = useState(0);
  const maze = useRef(genMaze(7)); const pos = useRef({ x: 1.5, y: 1.5 }); const t = useRef(0); const cool = useRef(0); const [, force] = useState(0);

  const start = (lv: number) => { maze.current = genMaze(7 + lv * 31); pos.current = { x: 1.5, y: 1.5 }; t.current = 0; setTime(0); setLevel(lv); setState('play'); };

  useLoop(state === 'play', (dt) => {
    t.current += dt; setTime(Math.floor(t.current));
    cool.current -= dt;
    const k = keys.current; const p = pos.current; const sp = 5 * dt;
    let nx = p.x, ny = p.y;
    if (k.has('ArrowLeft')) nx -= sp; if (k.has('ArrowRight')) nx += sp; if (k.has('ArrowUp')) ny -= sp; if (k.has('ArrowDown')) ny += sp;
    const free = (x: number, y: number) => { const r = 0.26; return ![[x - r, y - r], [x + r, y - r], [x - r, y + r], [x + r, y + r]].some(([cx, cy]) => maze.current[Math.floor(cy)]?.[Math.floor(cx)] !== false); };
    if (free(nx, p.y)) p.x = nx; if (free(p.x, ny)) p.y = ny;
    if (Math.floor(p.x) === COLS - 2 && Math.floor(p.y) === ROWS - 2) { setState('won'); record(Math.max(0, 300 - Math.floor(t.current)) * level); }
    force((v) => v + 1);
  });

  useEffect(() => {
    const c = canvas.current?.getContext('2d'); if (!c) return;
    c.fillStyle = '#000'; c.fillRect(0, 0, GW, GH);
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) if (maze.current[y][x]) { c.fillStyle = '#e8e8f0'; c.fillRect(x * CS, y * CS, CS, CS); }
    const ex = (COLS - 2) * CS, ey = (ROWS - 2) * CS; const pulse = 0.6 + 0.4 * Math.sin(t.current * 5);
    c.fillStyle = `rgba(80,220,120,${pulse})`; c.fillRect(ex, ey, CS, CS);
    c.fillStyle = '#1b7a3a'; c.fillRect(ex + CS / 2 - 1, ey + 3, 2, CS - 6); c.fillStyle = '#ff3b3b'; c.beginPath(); c.moveTo(ex + CS / 2 + 1, ey + 3); c.lineTo(ex + CS - 3, ey + 7); c.lineTo(ex + CS / 2 + 1, ey + 11); c.fill();
    c.fillStyle = 'rgba(80,220,120,0.9)'; c.fillRect(CS * 0.5, 2, 84, 14); c.fillStyle = '#000'; c.font = 'bold 9px Verdana'; c.fillText('get to the green flag', CS * 0.5 + 4, 12);
    c.fillStyle = '#ff3b3b'; c.beginPath(); c.arc(pos.current.x * CS, pos.current.y * CS, 6, 0, Math.PI * 2); c.fill();
  });

  return (
    <GameFrame title="The Maze Game" color="#c8262d" canvasRef={canvas} onBack={onBack} status={<>Level {level} · Time {time}s · Best score {best}</>} controls="Arrow keys to move. Reach the yellow square.">
      {state === 'ready' && <Overlay color="#c8262d" onClick={() => start(1)}><b>The Maze Game</b><br />Can you find your way out?<br /><small>click to start</small></Overlay>}
      {state === 'won' && <Overlay color="#c8262d" onClick={() => start(level + 1)}><b>You made it!</b><br />{time} seconds<br /><small>click for level {level + 1}</small></Overlay>}
    </GameFrame>
  );
}
