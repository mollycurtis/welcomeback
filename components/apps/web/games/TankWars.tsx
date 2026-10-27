'use client';
import { useEffect, useRef, useState } from 'react';
import { GW, GH, GameFrame, Overlay, useKeys, useLoop, useBest } from './GameShell';

interface Tank { x: number; y: number; a: number; hp: number }
interface Shot { x: number; y: number; vx: number; vy: number; mine: boolean; life: number }
const WALLS = [[120, 60, 24, 100], [336, 160, 24, 100], [200, 20, 80, 24], [200, 276, 80, 24], [220, 140, 40, 40]];
const hitWall = (x: number, y: number, r = 12) => x < r || y < r || x > GW - r || y > GH - r || WALLS.some(([wx, wy, ww, wh]) => x + r > wx && x - r < wx + ww && y + r > wy && y - r < wy + wh);

export function TankWars({ onBack }: { onBack: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const keys = useKeys(); const { best, record } = useBest('tank');
  const [state, setState] = useState<'ready' | 'play' | 'over'>('ready');
  const [score, setScore] = useState({ me: 0, cpu: 0 });
  const me = useRef<Tank>({ x: 50, y: GH - 50, a: -Math.PI / 2, hp: 1 }); const cpu = useRef<Tank>({ x: GW - 50, y: 50, a: Math.PI / 2, hp: 1 });
  const shots = useRef<Shot[]>([]); const cool = useRef(0); const cpuCool = useRef(1); const [, force] = useState(0);
  const start = () => { me.current = { x: 50, y: GH - 50, a: -Math.PI / 2, hp: 1 }; cpu.current = { x: GW - 50, y: 50, a: Math.PI / 2, hp: 1 }; shots.current = []; setScore({ me: 0, cpu: 0 }); setState('play'); };
  const reset = () => { me.current = { x: 50, y: GH - 50, a: -Math.PI / 2, hp: 1 }; cpu.current = { x: GW - 50, y: 50, a: Math.PI / 2, hp: 1 }; shots.current = []; };

  useLoop(state === 'play', (dt) => {
    const k = keys.current, m = me.current, c = cpu.current;
    if (k.has('ArrowLeft')) m.a -= 3 * dt; if (k.has('ArrowRight')) m.a += 3 * dt;
    const mv = (k.has('ArrowUp') ? 1 : 0) - (k.has('ArrowDown') ? 0.6 : 0);
    const nx = m.x + Math.cos(m.a) * 90 * mv * dt, ny = m.y + Math.sin(m.a) * 90 * mv * dt;
    if (!hitWall(nx, m.y)) m.x = nx; if (!hitWall(m.x, ny)) m.y = ny;
    cool.current -= dt;
    if (k.has(' ') && cool.current <= 0) { cool.current = 0.45; shots.current.push({ x: m.x + Math.cos(m.a) * 16, y: m.y + Math.sin(m.a) * 16, vx: Math.cos(m.a) * 260, vy: Math.sin(m.a) * 260, mine: true, life: 2.5 }); }
    const want = Math.atan2(m.y - c.y, m.x - c.x); let d = want - c.a; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
    c.a += Math.sign(d) * Math.min(Math.abs(d), 0.8 * dt);
    const dist = Math.hypot(m.x - c.x, m.y - c.y);
    if (dist > 150) { const cx = c.x + Math.cos(c.a) * 60 * dt, cy = c.y + Math.sin(c.a) * 60 * dt; if (!hitWall(cx, c.y)) c.x = cx; else c.a += 1.5 * dt; if (!hitWall(c.x, cy)) c.y = cy; }
    cpuCool.current -= dt;
    if (Math.abs(d) < 0.12 && dist < 300 && cpuCool.current <= 0) { cpuCool.current = 3.2; const err = (Math.random() - 0.5) * 0.3; shots.current.push({ x: c.x + Math.cos(c.a) * 16, y: c.y + Math.sin(c.a) * 16, vx: Math.cos(c.a + err) * 130, vy: Math.sin(c.a + err) * 130, mine: false, life: 2.0 }); }
    for (const s of shots.current) {
      s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt;
      if (hitWall(s.x, s.y, 3)) { if (s.x < 3 || s.x > GW - 3) s.vx *= -1; else if (s.y < 3 || s.y > GH - 3) s.vy *= -1; else { s.life = 0; } }
      const tgt = s.mine ? c : m;
      if (Math.hypot(tgt.x - s.x, tgt.y - s.y) < 14) { s.life = 0; setScore((sc) => { const n = s.mine ? { ...sc, me: sc.me + 1 } : { ...sc, cpu: sc.cpu + 1 }; if (n.me >= 3 || n.cpu >= 3) { setState('over'); record(n.me * 100 - n.cpu * 30); } return n; }); reset(); break; }
    }
    shots.current = shots.current.filter((s) => s.life > 0);
    force((v) => v + 1);
  });

  useEffect(() => {
    const c = canvas.current?.getContext('2d'); if (!c) return;
    c.fillStyle = '#6b7a55'; c.fillRect(0, 0, GW, GH);
    c.fillStyle = 'rgba(0,0,0,0.08)'; for (let i = 0; i < GW; i += 40) c.fillRect(i, 0, 1, GH); for (let i = 0; i < GH; i += 40) c.fillRect(0, i, GW, 1);
    c.fillStyle = '#8f8f8f'; WALLS.forEach(([x, y, w, h]) => { c.fillRect(x, y, w, h); c.strokeStyle = '#555'; c.strokeRect(x, y, w, h); });
    const draw = (t: Tank, col: string) => { c.save(); c.translate(t.x, t.y); c.rotate(t.a); c.fillStyle = col; c.fillRect(-12, -10, 24, 20); c.fillStyle = '#222'; c.fillRect(-12, -13, 24, 4); c.fillRect(-12, 9, 24, 4); c.fillStyle = col; c.beginPath(); c.arc(0, 0, 7, 0, Math.PI * 2); c.fill(); c.fillStyle = '#222'; c.fillRect(0, -2, 20, 4); c.restore(); };
    draw(me.current, '#3fa34d'); draw(cpu.current, '#d23b3b');
    shots.current.forEach((s) => { c.fillStyle = s.mine ? '#ffe36b' : '#ff9c6b'; c.beginPath(); c.arc(s.x, s.y, 3, 0, Math.PI * 2); c.fill(); });
  });

  return (
    <GameFrame title="Tank Wars" color="#5d7a2a" canvasRef={canvas} onBack={onBack} status={<>You {score.me} - CPU {score.cpu} · Best {best}</>} controls="Arrows drive & turn. Space fires. First to 3 hits wins.">
      {state === 'ready' && <Overlay color="#5d7a2a" onClick={start}><b>Tank Wars</b><br />Battle the computer!<br /><small>click to start</small></Overlay>}
      {state === 'over' && <Overlay color="#5d7a2a" onClick={start}><b>{score.me > score.cpu ? 'You win!' : 'The computer wins.'}</b><br />{score.me} - {score.cpu}<br /><small>click to play again</small></Overlay>}
    </GameFrame>
  );
}
