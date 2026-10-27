'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { AppWindowProps } from '@/lib/registry';
import { useWindows } from '@/store/windows';
import { useSave } from '@/store/save';
import { sounds } from '@/lib/sounds';

const W = 300;
const H = 440;
const TABLE_IMG: HTMLImageElement = typeof Image !== 'undefined' ? new Image() : ({} as HTMLImageElement);
if (typeof Image !== 'undefined') TABLE_IMG.src = '/pinball-table.jpg';
const R = 9;

const TWALL = 9;
const LANE_X = 256;
const LANE_TOP = 50;
const PLUNGE_X = 270;
const DOME = { x: 150, y: 178, r: 166 };
const DRAIN_Y = H + 18;

const RANKS = [
  { name: 'RECRUIT', at: 0 },
  { name: 'PILOT', at: 2000 },
  { name: 'ACE', at: 6000 },
  { name: 'CAPTAIN', at: 15000 },
  { name: 'COMMANDER', at: 30000 },
  { name: 'ADMIRAL', at: 60000 },
];
function rankFor(score: number): string {
  let r = RANKS[0].name;
  for (const x of RANKS) if (score >= x.at) r = x.name;
  return r;
}

interface Vec { x: number; y: number }
interface Bumper { x: number; y: number; r: number; score: number; lit: number; hue: string }
interface FlipperState { angle: number; target: number; rest: number; active: number }

export default function Pinball({ windowId }: AppWindowProps) {
  const close = useWindows((s) => s.close);
  const pinballHigh = useSave((s) => s.pinballHigh);
  const setPinballHigh = useSave((s) => s.setPinballHigh);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [score, setScore] = useState(0);
  const [balls, setBalls] = useState(3);
  const [message, setMessage] = useState('PRESS SPACE TO LAUNCH');
  const [high, setHigh] = useState(pinballHigh);
  const rank = rankFor(score);

  const g = useRef({
    ball: { x: PLUNGE_X, y: H - 40 } as Vec,
    vel: { x: 0, y: 0 } as Vec,
    inPlay: false,
    onPlunger: true,
    plunger: 0,
    plungerHeld: false,
    score: 0,
    balls: 3,
    over: false,
    tick: 0,
    stuck: 0,
    slingL: 0,
    slingR: 0,
    left: { angle: -0.5, target: -0.5, rest: -0.5, active: 0.6 } as FlipperState,
    right: { angle: -0.5, target: -0.5, rest: -0.5, active: 0.6 } as FlipperState,
    bumpers: [
      { x: 107, y: 99, r: 19, score: 100, lit: 0, hue: '#33c2ff' },
      { x: 196, y: 99, r: 19, score: 100, lit: 0, hue: '#ffb13b' },
      { x: 150, y: 66, r: 19, score: 150, lit: 0, hue: '#ff5a8a' },
      { x: 64, y: 210, r: 12, score: 200, lit: 0, hue: '#7affb0' },
      { x: 243, y: 210, r: 12, score: 200, lit: 0, hue: '#b58aff' },
    ] as Bumper[],
  });

  const resetBallToPlunger = () => {
    const s = g.current;
    s.ball = { x: PLUNGE_X, y: H - 40 };
    s.vel = { x: 0, y: 0 };
    s.onPlunger = true;
    s.inPlay = false;
    s.plunger = 0;
  };

  const newGame = useCallback(() => {
    const s = g.current;
    s.score = 0;
    s.balls = 3;
    s.over = false;
    for (const b of s.bumpers) b.lit = 0;
    setScore(0);
    setBalls(3);
    setMessage('PRESS SPACE TO LAUNCH');
    resetBallToPlunger();
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const s = g.current;
      if (e.repeat) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        s.left.target = s.left.active;
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        s.right.target = s.right.active;
      } else if (e.key === ' ') {
        e.preventDefault();
        if (s.over) {
          newGame();
          return;
        }
        if (s.onPlunger) s.plungerHeld = true;
      }
    };
    const up = (e: KeyboardEvent) => {
      const s = g.current;
      if (e.key === 'ArrowLeft') {
        s.left.target = s.left.rest;
      } else if (e.key === 'ArrowRight') {
        s.right.target = s.right.rest;
      } else if (e.key === ' ') {
        if (s.onPlunger && s.plungerHeld) {
          s.vel = { x: 0, y: -(17 + s.plunger * 4) };
          s.onPlunger = false;
          s.inPlay = true;
          s.plungerHeld = false;
          s.plunger = 0;
          sounds.launch();
          setMessage('');
        }
      }
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [newGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    let bumpScore = 0;

    const GRAV = 0.22;
    const PACE = 0.88;
    const FRICTION = 0.995;

    const LF = { px: 84, py: H - 58, len: 62 };
    const RF = { px: W - 84, py: H - 58, len: 62 };

    const SL_L = { x1: TWALL + 1, y1: 300, x2: LF.px - 16, y2: 372 };
    const SL_R = { x1: LANE_X - 1, y1: 300, x2: RF.px + 16, y2: 372 };

    const reflect = (nx: number, ny: number, bounce: number) => {
      const s = g.current;
      const dot = s.vel.x * nx + s.vel.y * ny;
      s.vel.x -= (1 + bounce) * dot * nx;
      s.vel.y -= (1 + bounce) * dot * ny;
    };

    const flipperLine = (f: typeof LF, state: FlipperState, dir: 1 | -1) => {
      const ang = dir === 1 ? -state.angle : Math.PI + state.angle;
      const tx = f.px + Math.cos(ang) * f.len;
      const ty = f.py + Math.sin(ang) * f.len;
      return { x1: f.px, y1: f.py, x2: tx, y2: ty, ang };
    };

    const collideFlipper = (f: typeof LF, state: FlipperState, dir: 1 | -1, prevAngle: number, canKick: boolean) => {
      const s = g.current;
      const line = flipperLine(f, state, dir);
      const dx = line.x2 - line.x1;
      const dy = line.y2 - line.y1;
      const len2 = dx * dx + dy * dy || 1;
      let t = ((s.ball.x - line.x1) * dx + (s.ball.y - line.y1) * dy) / len2;
      t = Math.max(0, Math.min(1, t));
      const cx = line.x1 + t * dx;
      const cy = line.y1 + t * dy;
      const ddx = s.ball.x - cx;
      const ddy = s.ball.y - cy;
      const dist = Math.hypot(ddx, ddy);
      if (dist < R + 5) {
        const nx = ddx / (dist || 1);
        const ny = ddy / (dist || 1);
        s.ball.x = cx + nx * (R + 5);
        s.ball.y = cy + ny * (R + 5);
        reflect(nx, ny, 0.4);
        const swing = state.angle - prevAngle;
        if (canKick && Math.abs(swing) > 0.02) {
          const kick = Math.min(Math.abs(swing) * 60, 10.5) + 2;
          s.vel.x += nx * kick * 0.5;
          s.vel.y -= kick;
          sounds.ding(700);
          return true;
        }
      }
      return false;
    };

    const sling = (seg: typeof SL_L, which: 'L' | 'R') => {
      const s = g.current;
      const d = segDist(s.ball, seg.x1, seg.y1, seg.x2, seg.y2);
      if (d.dist < R) {
        s.ball.x += d.nx * (R - d.dist);
        s.ball.y += d.ny * (R - d.dist);
        reflect(d.nx, d.ny, 0.5);
        s.vel.x += d.nx * 3.1;
        s.vel.y += d.ny * 3.1;
        if (which === 'L') s.slingL = 6; else s.slingR = 6;
        sounds.ding(1150);
      }
    };

    let prevT = performance.now();
    let acc = 0;
    const FIXED = 1000 / 60;

    const step = (now?: number) => {
      const t = now ?? performance.now();
      acc += Math.min(100, t - prevT);
      prevT = t;
      if (acc < FIXED) { raf = requestAnimationFrame(step); return; }
      let steps = 0;
      while (acc >= FIXED && steps < 5) { acc -= FIXED; steps++; simulate(); }
      draw(ctx, g.current);
      raf = requestAnimationFrame(step);
    };

    const simulate = () => {
      const s = g.current;
      s.tick++;

      const prevL = s.left.angle;
      const prevR = s.right.angle;
      s.left.angle += (s.left.target - s.left.angle) * 0.45;
      s.right.angle += (s.right.target - s.right.angle) * 0.45;
      if (s.slingL > 0) s.slingL--;
      if (s.slingR > 0) s.slingR--;

      if (s.onPlunger) {
        if (s.plungerHeld) s.plunger = Math.min(1, s.plunger + 0.02);
        s.ball.x = PLUNGE_X;
        s.ball.y = H - 40 + s.plunger * 18;
      }

      if (s.inPlay) {
        s.vel.y += GRAV * PACE * PACE;
        s.vel.x *= FRICTION;
        s.vel.y *= FRICTION;
        const sp = Math.hypot(s.vel.x, s.vel.y);
        if (sp > 16) {
          s.vel.x *= 16 / sp;
          s.vel.y *= 16 / sp;
        }
        const SUB = 4;
        let kickL = false;
        let kickR = false;
        for (let k = 0; k < SUB; k++) {
          s.ball.x += (s.vel.x * PACE) / SUB;
          s.ball.y += (s.vel.y * PACE) / SUB;

          if (s.ball.x < R + TWALL) { s.ball.x = R + TWALL; reflect(1, 0, 0.6); }
          if (s.ball.x > W - R - TWALL) { s.ball.x = W - R - TWALL; reflect(-1, 0, 0.6); }
          if (s.ball.y < R + TWALL) { s.ball.y = R + TWALL; reflect(0, 1, 0.6); }

          if (s.ball.y < DOME.y) {
            const dx = s.ball.x - DOME.x;
            const dy = s.ball.y - DOME.y;
            const dd = Math.hypot(dx, dy);
            if (dd > DOME.r - R) {
              const nx = dx / (dd || 1);
              const ny = dy / (dd || 1);
              s.ball.x = DOME.x + nx * (DOME.r - R);
              s.ball.y = DOME.y + ny * (DOME.r - R);
              reflect(nx, ny, 0.5);
            }
        }

        if (s.ball.y > LANE_TOP && s.ball.y < H - 26) {
          if (s.ball.x < LANE_X && s.ball.x > LANE_X - R && s.vel.x > 0) {
            s.ball.x = LANE_X - R;
            reflect(-1, 0, 0.5);
          }
        }

        for (const b of s.bumpers) {
          const ddx = s.ball.x - b.x;
          const ddy = s.ball.y - b.y;
          const dist = Math.hypot(ddx, ddy);
          if (dist < b.r + R) {
            const nx = ddx / (dist || 1);
            const ny = ddy / (dist || 1);
            s.ball.x = b.x + nx * (b.r + R);
            s.ball.y = b.y + ny * (b.r + R);
            reflect(nx, ny, 0.9);
            s.vel.x += nx * 2.2;
            s.vel.y += ny * 2.2;
            b.lit = 9;
            s.score += b.score;
            bumpScore = s.score;
            sounds.ding(900 + b.score);
          }
        }

        sling(SL_L, 'L');
        sling(SL_R, 'R');

        if (collideFlipper(LF, s.left, 1, prevL, !kickL)) kickL = true;
        if (collideFlipper(RF, s.right, -1, prevR, !kickR)) kickR = true;
        }
        for (const b of s.bumpers) if (b.lit > 0) b.lit--;

        const sp2 = Math.hypot(s.vel.x, s.vel.y);
        if (sp2 < 0.45 && s.ball.y < H - 70) {
          s.stuck++;
          if (s.stuck > 100) { s.vel.x += (Math.random() - 0.5) * 3; s.vel.y += 1.6; s.stuck = 0; }
        } else {
          s.stuck = 0;
        }

        if (s.ball.y > DRAIN_Y) {
          s.inPlay = false;
          s.balls -= 1;
          setBalls(s.balls);
          sounds.boom();
          if (s.balls <= 0) {
            s.over = true;
            setMessage('GAME OVER. SPACE TO PLAY AGAIN');
            setScore(s.score);
            if (s.score > useSave.getState().pinballHigh) {
              setPinballHigh(s.score);
              setHigh(s.score);
            }
          } else {
            setMessage('BALL ' + (4 - s.balls) + ' - SPACE TO LAUNCH');
            resetBallToPlunger();
          }
        }
        if (bumpScore) {
          setScore(s.score);
          bumpScore = 0;
        }
      }

    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col bg-[var(--face)]">
      <div className="menubar relative flex win-noselect">
        <button onClick={() => setMenuOpen((v) => !v)}>Game</button>
        {menuOpen && (
          <div className="menu-pop" style={{ left: 2, top: 22 }}>
            <button className="mi" onClick={() => { setMenuOpen(false); newGame(); }}>New Game</button>
            <hr className="msep" />
            <button className="mi" onClick={() => close(windowId)}>Exit</button>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 flex items-stretch gap-2 p-2" onPointerDown={() => setMenuOpen(false)}>
        <div className="bevel-in" style={{ lineHeight: 0, minHeight: 0 }}>
          <canvas ref={canvasRef} width={W} height={H} style={{ display: 'block', height: '100%', width: 'auto' }} />
        </div>

        <div className="flex-1 flex flex-col gap-1.5 win-noselect min-h-0">
          <div
            className="bevel-thin px-2 py-1.5 text-center"
            style={{ background: 'linear-gradient(180deg,#1a1f4a,#0a0e28)' }}
          >
            <div
              className="font-bios text-[16px] tracking-[2px]"
              style={{ color: '#9fd0ff', textShadow: '0 0 7px rgba(90,160,255,0.7)' }}
            >
              ★ STAR PILOT
            </div>
            <div className="text-[8px] tracking-[3px]" style={{ color: '#6a78b0' }}>
              DEEP SPACE PINBALL
            </div>
          </div>

          <Panel label="SCORE">
            <span className="lcd block text-right px-2 py-1 text-[20px]">{score.toLocaleString()}</span>
          </Panel>

          <div className="grid grid-cols-2 gap-1.5">
            <Panel label="RANK">
              <span className="lcd block text-center px-1 py-1 text-[11px]">{rank}</span>
            </Panel>
            <Panel label="HIGH">
              <span className="lcd block text-right px-2 py-1 text-[13px]">{high.toLocaleString()}</span>
            </Panel>
          </div>

          <Panel label="BALL">
            <div className="flex gap-1.5 px-2 py-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ background: i < balls ? '#dfe7ef' : '#5a5a5a', boxShadow: i < balls ? '0 0 4px #fff' : 'none' }}
                />
              ))}
            </div>
          </Panel>

          {message && (
            <div className="lcd text-center px-2 py-1.5 text-[12px] leading-tight">{message}</div>
          )}

          <div className="mt-auto bevel-thin p-2 text-[11px] leading-relaxed" style={{ background: '#fdf6da' }}>
            <div className="font-bold mb-1">CONTROLS</div>
            <div><b>←</b> &nbsp;left flipper</div>
            <div><b>→</b> &nbsp;right flipper</div>
            <div><b>Space</b> &nbsp;hold to launch</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Panel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bevel-thin" style={{ background: '#bdb5a0' }}>
      <div className="text-[10px] px-2 pt-1 font-bold tracking-wide">{label}</div>
      {children}
    </div>
  );
}

type GState = {
  ball: Vec; onPlunger: boolean; plunger: number; tick: number;
  slingL: number; slingR: number;
  left: FlipperState; right: FlipperState; bumpers: Bumper[]; score: number;
};

function hexA(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
}

function draw(ctx: CanvasRenderingContext2D, s: GState) {
  ctx.clearRect(0, 0, W, H);

  if (TABLE_IMG.complete && TABLE_IMG.naturalWidth) {
    ctx.drawImage(TABLE_IMG, 0, 0, W, H);
  } else {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#0b1334'); grad.addColorStop(1, '#05070f');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  }

  ctx.beginPath();
  ctx.arc(DOME.x, DOME.y, DOME.r - R / 2, Math.PI, Math.PI * 2);
  ctx.strokeStyle = '#3f588c';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.strokeStyle = 'rgba(140,180,255,0.25)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const arrowN = 7;
  for (let i = 0; i < arrowN; i++) {
    const ang = Math.PI + (Math.PI * (i + 0.5)) / arrowN;
    const ax = DOME.x + Math.cos(ang) * (DOME.r - 16);
    const ay = DOME.y + Math.sin(ang) * (DOME.r - 16);
    const on = s.onPlunger && Math.floor(s.tick / 6) % arrowN === i;
    ctx.fillStyle = on ? '#ffe27a' : 'rgba(120,150,210,0.30)';
    ctx.save();
    ctx.translate(ax, ay);
    ctx.rotate(ang + Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.lineTo(3.5, 3);
    ctx.lineTo(-3.5, 3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  ctx.strokeStyle = '#3a4d70';
  ctx.lineWidth = 5;
  ctx.strokeRect(TWALL - 3, TWALL - 3, W - 2 * (TWALL - 3), H - 2 * (TWALL - 3));

  ctx.fillStyle = 'rgba(120,160,255,0.05)';
  ctx.fillRect(LANE_X + 1, LANE_TOP, W - 9 - (LANE_X + 1), H - 12 - LANE_TOP);
  ctx.strokeStyle = '#3a4d70';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(LANE_X, LANE_TOP);
  ctx.lineTo(LANE_X, H - 30);
  ctx.stroke();

  const fuelCols = ['#ff5a5a', '#ffb13b', '#ffe27a', '#7affb0', '#33c2ff', '#b58aff'];
  const litFuel = Math.min(6, Math.floor(s.score / 2000));
  for (let i = 0; i < 6; i++) {
    const fy = 250 - i * 16;
    const on = i < litFuel;
    ctx.fillStyle = on ? fuelCols[i] : 'rgba(255,255,255,0.08)';
    if (on) {
      ctx.shadowColor = fuelCols[i];
      ctx.shadowBlur = 6;
    }
    ctx.fillRect(TWALL + 2, fy, 9, 10);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(160,190,255,0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(TWALL + 2, fy, 9, 10);
  }

  drawSling(ctx, { x1: TWALL + 1, y1: 300, x2: 84 - 16, y2: 372 }, s.slingL > 0);
  drawSling(ctx, { x1: LANE_X - 1, y1: 300, x2: (W - 84) + 16, y2: 372 }, s.slingR > 0);

  for (const b of s.bumpers) {
    const lit = b.lit > 0;
    if (lit) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r + 7, 0, Math.PI * 2);
      ctx.fillStyle = hexA(b.hue, 0.35);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = '#16223c';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = lit ? '#ffffff' : hexA(b.hue, 0.85);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r * 0.58, 0, Math.PI * 2);
    ctx.fillStyle = lit ? '#ffffff' : b.hue;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(b.x - b.r * 0.2, b.y - b.r * 0.2, b.r * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.fill();
  }

  drawFlipper(ctx, { px: 84, py: H - 58, len: 62 }, s.left, 1);
  drawFlipper(ctx, { px: W - 84, py: H - 58, len: 62 }, s.right, -1);

  if (s.onPlunger) {
    const px = PLUNGE_X;
    const top = H - 12 - s.plunger * 16;
    ctx.strokeStyle = '#5a6680';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const yy = H - 12 - i * 4;
      ctx.beginPath();
      ctx.moveTo(px - 6, yy);
      ctx.lineTo(px + 6, yy - 2);
      ctx.stroke();
    }
    ctx.fillStyle = '#aab0bd';
    ctx.fillRect(px - 7, top, 14, 6);
  }

  const bg = ctx.createRadialGradient(s.ball.x - 3, s.ball.y - 3, 1, s.ball.x, s.ball.y, R);
  bg.addColorStop(0, '#ffffff');
  bg.addColorStop(0.5, '#d2d7e0');
  bg.addColorStop(1, '#7c8290');
  ctx.beginPath();
  ctx.arc(s.ball.x, s.ball.y, R, 0, Math.PI * 2);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(s.ball.x - 3, s.ball.y - 3, 2, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fill();
}

function drawSling(
  ctx: CanvasRenderingContext2D,
  seg: { x1: number; y1: number; x2: number; y2: number },
  lit: boolean
) {
  const dx = seg.x2 - seg.x1;
  const dy = seg.y2 - seg.y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const sign = seg.x2 > seg.x1 ? -1 : 1;
  const ox = nx * 13 * sign;
  const oy = ny * 13 * sign;
  ctx.beginPath();
  ctx.moveTo(seg.x1, seg.y1);
  ctx.lineTo(seg.x2, seg.y2);
  ctx.lineTo(seg.x2 + ox, seg.y2 + oy);
  ctx.lineTo(seg.x1 + ox, seg.y1 + oy);
  ctx.closePath();
  ctx.fillStyle = '#1c2b48';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(seg.x1, seg.y1);
  ctx.lineTo(seg.x2, seg.y2);
  ctx.lineWidth = lit ? 4 : 3;
  ctx.strokeStyle = lit ? '#ffffff' : '#ffd24a';
  if (lit) { ctx.shadowColor = '#ffe27a'; ctx.shadowBlur = 8; }
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function drawFlipper(
  ctx: CanvasRenderingContext2D,
  f: { px: number; py: number; len: number },
  state: FlipperState,
  dir: 1 | -1
) {
  const ang = dir === 1 ? -state.angle : Math.PI + state.angle;
  const tx = f.px + Math.cos(ang) * f.len;
  const ty = f.py + Math.sin(ang) * f.len;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#27314c';
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.moveTo(f.px, f.py);
  ctx.lineTo(tx, ty);
  ctx.stroke();
  const g = ctx.createLinearGradient(f.px, f.py, tx, ty);
  g.addColorStop(0, '#eef2ff');
  g.addColorStop(1, '#aab4d6');
  ctx.strokeStyle = g;
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(f.px, f.py);
  ctx.lineTo(tx, ty);
  ctx.stroke();
  ctx.strokeStyle = dir === 1 ? '#ff5a5a' : '#5ab0ff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(f.px, f.py);
  ctx.lineTo(tx, ty);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(f.px, f.py, 7, 0, Math.PI * 2);
  ctx.fillStyle = '#cad2e8';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#7a85a8';
  ctx.stroke();
}

function segDist(p: Vec, x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy || 1;
  let t = ((p.x - x1) * dx + (p.y - y1) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const cx = x1 + t * dx;
  const cy = y1 + t * dy;
  const ddx = p.x - cx;
  const ddy = p.y - cy;
  const dist = Math.hypot(ddx, ddy) || 1;
  return { dist, nx: ddx / dist, ny: ddy / dist };
}
