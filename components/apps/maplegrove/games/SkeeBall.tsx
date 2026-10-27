'use client';

import { useEffect, useRef, useState } from 'react';
import { GameShell, useGame } from './GameShell';

const W = 680, H = 360, BALLS = 9;
const BG: HTMLImageElement = typeof Image !== 'undefined' ? new Image() : ({} as HTMLImageElement);
if (typeof Image !== 'undefined') BG.src = '/maplegrove/games/skee.jpg';
const LANE = { bottomY: H - 6, bottomL: 150, bottomR: 530, topY: 190, topL: 292, topR: 388 };
const BOARD_X = 339;
const RINGS: { pts: number; y0: number; y1: number }[] = [
  { pts: 50, y0: 133, y1: 143 }, { pts: 40, y0: 143, y1: 152 }, { pts: 30, y0: 152, y1: 161 }, { pts: 20, y0: 161, y1: 170 }, { pts: 10, y0: 170, y1: 183 },
];

type Stage = 'aim' | 'power' | 'roll' | 'settle';
interface Ball { x: number; y: number; t: number; toX: number; toY: number; landed: boolean; pts: number }
interface S { stage: Stage; aim: number; aimDir: number; power: number; powerDir: number; ball: Ball | null; score: number; ballNo: number; settleT: number }
const fresh = (): S => ({ stage: 'aim', aim: 0.5, aimDir: 1, power: 0, powerDir: 1, ball: null, score: 0, ballNo: 1, settleT: 0 });
const laneX = (aim: number, y: number) => {
  const f = (LANE.bottomY - y) / (LANE.bottomY - LANE.topY);
  const l = LANE.bottomL + (LANE.topL - LANE.bottomL) * f, r = LANE.bottomR + (LANE.topR - LANE.bottomR) * f;
  return l + (r - l) * aim;
};
function landing(aim: number, power: number): { x: number; y: number; pts: number } {
  const x = BOARD_X + (aim - 0.5) * 120 + (Math.random() - 0.5) * 8;
  const y = 238 - power * 112 + (Math.random() - 0.5) * 8;
  let pts = 0;
  if (Math.abs(x - BOARD_X) < 40) for (const r of RINGS) if (y >= r.y0 && y < r.y1) pts = r.pts;
  return { x, y, pts };
}

export function SkeeBall({ onExit }: { onExit: (msg?: string) => void }) {
  const g = useGame('skee');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const st = useRef<S>(fresh());
  const raf = useRef(0);
  const [ballNo, setBallNo] = useState(1);
  const [last, setLast] = useState('');
  const start = () => { st.current = fresh(); setBallNo(1); setLast(''); g.start(); };
  const click = () => {
    const s = st.current;
    if (s.stage === 'aim') { s.stage = 'power'; s.power = 0; s.powerDir = 1; return; }
    if (s.stage === 'power') { const land = landing(s.aim, s.power); s.ball = { x: laneX(s.aim, LANE.bottomY), y: LANE.bottomY, t: 0, toX: land.x, toY: land.y, landed: false, pts: land.pts }; s.stage = 'roll'; }
  };

  useEffect(() => {
    if (g.status !== 'playing') return;
    const ctx = canvasRef.current!.getContext('2d')!;
    let prev = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - prev) / 1000); prev = t;
      const s = st.current;
      if (s.stage === 'aim') { s.aim += s.aimDir * dt * 0.75; if (s.aim > 1) { s.aim = 1; s.aimDir = -1; } if (s.aim < 0) { s.aim = 0; s.aimDir = 1; } }
      if (s.stage === 'power') { s.power += s.powerDir * dt * 1.25; if (s.power > 1) { s.power = 1; s.powerDir = -1; } if (s.power < 0) { s.power = 0; s.powerDir = 1; } }
      if (s.stage === 'roll' && s.ball) {
        const b = s.ball; b.t += dt * 1.1;
        if (b.t < 0.6) { const f = b.t / 0.6; b.y = LANE.bottomY + (LANE.topY - LANE.bottomY) * f; b.x = laneX(s.aim, b.y); }
        else if (b.t < 1) { const f = (b.t - 0.6) / 0.4; const lipX = laneX(s.aim, LANE.topY); b.x = lipX + (b.toX - lipX) * f; b.y = LANE.topY + (b.toY - LANE.topY) * f - Math.sin(f * Math.PI) * 18; }
        else if (!b.landed) { b.landed = true; b.x = b.toX; b.y = b.toY; s.score += b.pts; s.stage = 'settle'; s.settleT = 0; setLast(b.pts === 50 ? '50! Dead centre.' : b.pts ? `${b.pts} points` : b.toY < 133 ? 'Over the top. No points.' : 'Short. No points.'); }
      }
      if (s.stage === 'settle') { s.settleT += dt; if (s.settleT > 0.9) { if (s.ballNo >= BALLS) { g.finish(s.score, 0.4, 25); return; } s.ballNo += 1; setBallNo(s.ballNo); s.ball = null; s.stage = 'aim'; } }
      draw(ctx, s);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [g.status]);

  return (
    <GameShell id="skee" title="Skee Ball" best={g.best} status={g.status} score={g.status === 'playing' ? st.current.score : g.score} reward={g.reward}
      stats={<span>Ball {Math.min(ballNo, BALLS)} / {BALLS}</span>} overTitle="Last ball!"
      intro={<>Nine balls up the lane. Click once to set your aim, click again to set the power. The rings at the far end score 10 to 50, straight up the middle. Too hard sails over, too soft dies on the ramp.</>}
      tip="the 50 is a hair below full power. Keep the aim marker in the middle third." onStart={start} onExit={onExit}>
      <canvas ref={canvasRef} width={W} height={H} onClick={click} style={{ display: 'block', width: '100%', height: 'auto', cursor: 'pointer' }} />
      {g.status === 'playing' && last && (
        <div style={{ position: 'absolute', left: 12, bottom: 12, background: 'rgba(27,20,48,0.85)', color: '#f4e08a', fontWeight: 800, fontSize: 13, padding: '4px 10px', borderRadius: 6, pointerEvents: 'none' }}>{last}</div>
      )}
    </GameShell>
  );
}

function draw(ctx: CanvasRenderingContext2D, s: S) {
  if (BG.complete && BG.naturalWidth) ctx.drawImage(BG, 0, 0, W, H); else { ctx.fillStyle = '#2a1a10'; ctx.fillRect(0, 0, W, H); }
  if (s.stage === 'aim' || s.stage === 'power') {
    const x = laneX(s.aim, LANE.bottomY);
    ctx.fillStyle = '#f4e08a'; ctx.beginPath(); ctx.moveTo(x, LANE.bottomY - 26); ctx.lineTo(x - 9, LANE.bottomY - 8); ctx.lineTo(x + 9, LANE.bottomY - 8); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(244,224,138,0.55)'; ctx.setLineDash([6, 6]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, LANE.bottomY - 26); ctx.lineTo(laneX(s.aim, LANE.topY), LANE.topY); ctx.stroke(); ctx.setLineDash([]);
  }
  if (s.stage === 'power') {
    const mx = 610, my = 70, mh = 220;
    ctx.fillStyle = 'rgba(27,20,48,0.85)'; ctx.fillRect(mx - 6, my - 24, 36, mh + 34);
    const grad = ctx.createLinearGradient(0, my + mh, 0, my); grad.addColorStop(0, '#3f9a3a'); grad.addColorStop(0.55, '#e8c64a'); grad.addColorStop(0.93, '#d8322a'); grad.addColorStop(1, '#7b4fa0');
    ctx.fillStyle = '#1b1430'; ctx.fillRect(mx, my, 24, mh);
    ctx.fillStyle = grad; ctx.fillRect(mx, my + mh * (1 - s.power), 24, mh * s.power);
    ctx.fillStyle = '#fff'; ctx.fillRect(mx - 4, my + mh * 0.07 - 1, 32, 2);
    ctx.font = 'bold 10px Verdana, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#f4e08a'; ctx.fillText('POWER', mx + 12, my - 10);
  }
  if (s.ball) {
    const b = s.ball; const f = Math.min(1, Math.max(0, (LANE.bottomY - b.y) / (LANE.bottomY - 130)));
    const r = 13 - 9 * f;
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(b.x, b.y + r * 0.5, r, r * 0.4, 0, 0, Math.PI * 2); ctx.fill();
    const grd = ctx.createRadialGradient(b.x - r * 0.35, b.y - r * 0.35, 1, b.x, b.y, r); grd.addColorStop(0, '#ffffff'); grd.addColorStop(1, '#c5b8a0');
    ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#6b6050'; ctx.lineWidth = 1.2; ctx.stroke();
  }
  if (s.stage === 'aim' || s.stage === 'power') { ctx.fillStyle = 'rgba(27,20,48,0.8)'; ctx.fillRect(16, 14, 118, 22); ctx.font = 'bold 10px Verdana, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#f4e08a'; ctx.fillText(s.stage === 'aim' ? 'CLICK TO SET AIM' : 'CLICK TO ROLL', 75, 29); }
}
