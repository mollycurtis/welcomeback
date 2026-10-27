'use client';
import { useEffect, useRef, useState } from 'react';
import { GW, GH, GameFrame, Overlay, useKeys, useLoop, useBest } from './GameShell';

interface Foe { x: number; hp: number; cool: number; dir: number }
export function StickFighter({ onBack }: { onBack: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const keys = useKeys(); const { best, record } = useBest('stick');
  const [state, setState] = useState<'ready' | 'play' | 'over'>('ready');
  const [hud, setHud] = useState({ t: 0, hp: 100, ko: 0 });
  const me = useRef({ x: GW / 2, vy: 0, y: 0, hp: 100, punch: 0, face: 1 }); const foes = useRef<Foe[]>([]); const t = useRef(0); const spawn = useRef(0); const ko = useRef(0); const [, force] = useState(0);
  const start = () => { me.current = { x: GW / 2, vy: 0, y: 0, hp: 100, punch: 0, face: 1 }; foes.current = []; t.current = 0; spawn.current = 0; ko.current = 0; setHud({ t: 0, hp: 100, ko: 0 }); setState('play'); };
  const GROUND = GH - 40;

  useLoop(state === 'play', (dt) => {
    const k = keys.current, m = me.current; t.current += dt;
    if (k.has('ArrowLeft')) { m.x -= 140 * dt; m.face = -1; } if (k.has('ArrowRight')) { m.x += 140 * dt; m.face = 1; }
    m.x = Math.max(20, Math.min(GW - 20, m.x));
    if (k.has('ArrowUp') && m.y === 0) m.vy = -260;
    m.vy += 700 * dt; m.y += m.vy * dt; if (m.y > 0) { m.y = 0; m.vy = 0; }
    m.punch = Math.max(0, m.punch - dt); if (foes.current.length === 0) m.hp = Math.min(100, m.hp + 4 * dt);
    if (k.has(' ') && m.punch <= 0) { m.punch = 0.35; foes.current.forEach((f) => { if (Math.sign(f.x - m.x) === m.face && Math.abs(f.x - m.x) < 64) { f.hp -= 1; f.x += m.face * 55; f.cool = Math.max(f.cool, 0.8); } }); }
    spawn.current -= dt;
    if (spawn.current <= 0) { spawn.current = Math.max(1.5, 4 - t.current / 25); const left = Math.random() < 0.5; foes.current.push({ x: left ? -10 : GW + 10, hp: 2, cool: 0, dir: left ? 1 : -1 }); }
    for (const f of foes.current) {
      const d = m.x - f.x; f.dir = Math.sign(d) || 1;
      if (Math.abs(d) > 34) f.x += f.dir * 60 * dt; else { f.cool -= dt; if (f.cool <= 0) { f.cool = 1.2; m.hp -= 6; } }
    }
    foes.current = foes.current.filter((f) => { if (f.hp <= 0) { ko.current++; return false; } return true; });
    setHud({ t: Math.floor(t.current), hp: Math.max(0, m.hp), ko: ko.current });
    if (m.hp <= 0) { setState('over'); record(Math.floor(t.current) + ko.current * 5); }
    force((v) => v + 1);
  });

  useEffect(() => {
    const c = canvas.current?.getContext('2d'); if (!c) return;
    c.fillStyle = '#cfe3f7'; c.fillRect(0, 0, GW, GH); c.fillStyle = '#7a8a9a'; c.fillRect(0, GROUND, GW, GH - GROUND);
    const stick = (x: number, y: number, col: string, face: number, punch: boolean) => {
      c.strokeStyle = col; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.arc(x, y - 52, 9, 0, Math.PI * 2); c.stroke();
      c.beginPath(); c.moveTo(x, y - 43); c.lineTo(x, y - 18); c.moveTo(x, y - 18); c.lineTo(x - 10, y); c.moveTo(x, y - 18); c.lineTo(x + 10, y);
      c.moveTo(x, y - 36); c.lineTo(x - 12 * face, y - 26); c.moveTo(x, y - 36); c.lineTo(x + (punch ? 30 : 12) * face, y - (punch ? 34 : 26)); c.stroke();
    };
    const m = me.current; stick(m.x, GROUND + m.y, '#111', m.face, m.punch > 0.2);
    foes.current.forEach((f) => stick(f.x, GROUND, f.hp > 1 ? '#c62828' : '#ef6c6c', f.dir, false));
    c.fillStyle = '#c62828'; c.fillRect(10, 10, 120, 8); c.fillStyle = '#43a047'; c.fillRect(10, 10, Math.max(0, me.current.hp) * 1.2, 8);
  });

  return (
    <GameFrame title="Stick Fighter" color="#1f5bd6" canvasRef={canvas} onBack={onBack} status={<>Survived {hud.t}s · KOs {hud.ko} · Best {best}</>} controls="← → move, ↑ jump, Space punch. Face them before you swing.">
      {state === 'ready' && <Overlay color="#1f5bd6" onClick={start}><b>Stick Fighter</b><br />How long can you last?<br /><small>click to start</small></Overlay>}
      {state === 'over' && <Overlay color="#1f5bd6" onClick={start}><b>Knocked out.</b><br />{hud.t} seconds · {hud.ko} KOs<br /><small>click to try again</small></Overlay>}
    </GameFrame>
  );
}
