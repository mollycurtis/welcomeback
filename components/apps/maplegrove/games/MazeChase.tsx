'use client';

import { useEffect, useRef, useState } from 'react';
import { GameShell, useGame } from './GameShell';

const W = 680, H = 360, STEP = 4;
const BG: HTMLImageElement = typeof Image !== 'undefined' ? new Image() : ({} as HTMLImageElement);
if (typeof Image !== 'undefined') BG.src = '/maplegrove/games/maze.jpg';
const R = 8;

const CR = 4;
const DIRS: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];

interface Mover { x: number; y: number; dx: number; dy: number; want: [number, number] }
interface Gnome extends Mover { color: string; home: [number, number]; scared: boolean; think: number; wait: number }
interface Acorn { x: number; y: number; gold: boolean; taken: boolean }
interface S { mask: Uint8Array; mw: number; mh: number; player: Mover; gnomes: Gnome[]; acorns: Acorn[]; power: number; score: number; left: number; over: boolean; won: boolean; clock: number }

function build(img: HTMLImageElement): S {
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d')!; x.drawImage(img, 0, 0, W, H);
  const d = x.getImageData(0, 0, W, H).data; const mw = Math.ceil(W / STEP), mh = Math.ceil(H / STEP); const mask = new Uint8Array(mw * mh);
  for (let j = 0; j < mh; j++) for (let i = 0; i < mw; i++) {
    const px = Math.min(W - 1, i * STEP + STEP / 2), py = Math.min(H - 1, j * STEP + STEP / 2); const k = (py * W + px) * 4;
    const r = d[k], g = d[k + 1], b = d[k + 2]; mask[j * mw + i] = g > r + 20 && g > b + 35 ? 1 : 0;
  }
  const s: S = { mask, mw, mh, player: { x: 0, y: 0, dx: 0, dy: 0, want: [0, 0] }, gnomes: [], acorns: [], power: 0, score: 0, left: 0, over: false, won: false, clock: 0 };
  let best = -1, sx = W / 2, sy = H - 30;
  for (let px = 20; px < W - 20; px += 4) for (let py = H - 60; py > H - 16; py -= 4) { if (free(s, px, py, CR + 4)) { const room = clearance(s, px, py); if (room > best) { best = room; sx = px; sy = py; } } }
  s.player.x = sx; s.player.y = sy;
  const reach = new Uint8Array(mw * mh); const q: number[] = [Math.floor(sy / STEP) * mw + Math.floor(sx / STEP)]; reach[q[0]] = 1;
  while (q.length) { const k = q.pop()!; const i = k % mw, j = Math.floor(k / mw); for (const [ddx, ddy] of DIRS) { const ni = i + ddx, nj = j + ddy; if (ni < 0 || nj < 0 || ni >= mw || nj >= mh) continue; const nk = nj * mw + ni; if (!reach[nk] && !mask[nk]) { reach[nk] = 1; q.push(nk); } } }
  const spots: [number, number][] = [];
  for (let py = 16; py < H - 10; py += 22) for (let px = 12; px < W - 10; px += 22) { const k = Math.floor(py / STEP) * mw + Math.floor(px / STEP); if (reach[k] && free(s, px, py, CR + 1) && Math.hypot(px - sx, py - sy) > 24) spots.push([px, py]); }
  const corner = (fx: number, fy: number) => spots.reduce((b, p) => (Math.hypot(p[0] - fx, p[1] - fy) < Math.hypot(b[0] - fx, b[1] - fy) ? p : b), spots[0]);
  const golds = new Set([corner(0, 0), corner(W, 0), corner(0, H), corner(W, H)].map((p) => p.join(',')));
  s.acorns = spots.map(([px, py]) => ({ x: px, y: py, gold: golds.has(`${px},${py}`), taken: false })); s.left = s.acorns.length;
  const byDistance = [...spots].sort((a, b) => Math.hypot(b[0] - sx, b[1] - sy) - Math.hypot(a[0] - sx, a[1] - sy));
  const far: [number, number][] = [];
  for (const sp of byDistance) {
    if (far.length === 3) break;
    if (Math.hypot(sp[0] - sx, sp[1] - sy) < W * 0.4) break;
    if (far.every((f) => Math.hypot(f[0] - sp[0], f[1] - sp[1]) > W / 5)) far.push(sp);
  }
  for (const sp of byDistance) { if (far.length === 3) break; if (!far.includes(sp)) far.push(sp); }
  s.gnomes = far.map(([gx, gy], i) => ({ x: gx, y: gy, dx: 0, dy: 0, want: [0, 0], color: ['#d8322a', '#3f6fb0', '#5aa84a'][i], home: [gx, gy], scared: false, think: 0, wait: 1.2 + i }));
  return s;
}
function wrapX(px: number) { return ((px % W) + W) % W; }
function wrapY(py: number) { return ((py % H) + H) % H; }
function blocked(s: S, px: number, py: number) { const x = wrapX(px), y = wrapY(py); return !!s.mask[Math.floor(y / STEP) * s.mw + Math.floor(x / STEP)]; }
function free(s: S, px: number, py: number, r: number) { return !blocked(s, px - r, py - r) && !blocked(s, px + r, py - r) && !blocked(s, px - r, py + r) && !blocked(s, px + r, py + r) && !blocked(s, px, py); }
function clearance(s: S, px: number, py: number) { let r = 0; while (r < 40 && free(s, px, py, r + 2)) r += 2; return r; }
function move(s: S, m: Mover, speed: number, dt: number) {
  const step = speed * dt;
  const [wx, wy] = m.want;
  if (wx || wy) {
    if (free(s, m.x + wx * (step + 2), m.y + wy * (step + 2), CR)) { m.dx = wx; m.dy = wy; }
    else if (wx !== m.dx || wy !== m.dy) {
      for (let n = 1; n <= 7; n++) {
        let hit = 0;
        for (const o of [n, -n]) {
          const ax = m.x + (wy ? o : 0), ay = m.y + (wx ? o : 0);
          if (free(s, ax, ay, CR) && free(s, ax + wx * (step + 2), ay + wy * (step + 2), CR)) { hit = o; break; }
        }
        if (hit) {
          const d = Math.sign(hit) * Math.min(Math.abs(hit), step);
          if (wy && free(s, m.x + d, m.y, CR)) m.x += d;
          if (wx && free(s, m.x, m.y + d, CR)) m.y += d;
          break;
        }
      }
    }
  }
  if (!m.dx && !m.dy) return;

  const nx = m.x + m.dx * step, ny = m.y + m.dy * step;
  let moved = false;
  if (m.dx && free(s, nx, m.y, CR)) { m.x = nx; moved = true; }
  if (m.dy && free(s, m.x, ny, CR)) { m.y = ny; moved = true; }

  if (!moved) {
    for (let n = 1; n <= 7 && !moved; n++) {
      for (const o of [n, -n]) {
        if (m.dx && free(s, nx, m.y + o, CR)) { m.y += Math.sign(o) * Math.min(Math.abs(o), step); moved = true; break; }
        if (m.dy && free(s, m.x + o, ny, CR)) { m.x += Math.sign(o) * Math.min(Math.abs(o), step); moved = true; break; }
      }
    }
  }
  m.x = wrapX(m.x); m.y = wrapY(m.y);
  if (!moved) { m.dx = 0; m.dy = 0; }
}

const G = 8;
interface Nav { gw: number; gh: number; ok: Uint8Array; dist: Int32Array }
function buildNav(s: S): Nav {
  const gw = Math.ceil(W / G), gh = Math.ceil(H / G); const ok = new Uint8Array(gw * gh);
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) ok[j * gw + i] = free(s, i * G + G / 2, j * G + G / 2, CR) ? 1 : 0;
  return { gw, gh, ok, dist: new Int32Array(gw * gh).fill(-1) };
}
function cellAt(n: Nav, x: number, y: number) {
  const i = Math.min(n.gw - 1, Math.floor(wrapX(x) / G)), j = Math.min(n.gh - 1, Math.floor(wrapY(y) / G));
  let best = j * n.gw + i, bd = 1e9;
  if (n.ok[best]) return best;
  for (let dj = -3; dj <= 3; dj++) for (let di = -3; di <= 3; di++) {
    const ii = (i + di + n.gw) % n.gw, jj = (j + dj + n.gh) % n.gh, k = jj * n.gw + ii;
    if (n.ok[k] && di * di + dj * dj < bd) { bd = di * di + dj * dj; best = k; }
  }
  return best;
}
function flood(n: Nav, from: number) {
  n.dist.fill(-1); n.dist[from] = 0; const q = [from];
  for (let h = 0; h < q.length; h++) {
    const k = q[h], i = k % n.gw, j = Math.floor(k / n.gw);
    for (const [dx, dy] of DIRS) {
      const nk = ((j + dy + n.gh) % n.gh) * n.gw + ((i + dx + n.gw) % n.gw);
      if (n.ok[nk] && n.dist[nk] < 0) { n.dist[nk] = n.dist[k] + 1; q.push(nk); }
    }
  }
}
function steer(n: Nav, gn: Gnome, wander: boolean) {
  const k = cellAt(n, gn.x, gn.y), i = k % n.gw, j = Math.floor(k / n.gw);
  const opts = DIRS.map((d) => {
    const nk = ((j + d[1] + n.gh) % n.gh) * n.gw + ((i + d[0] + n.gw) % n.gw);
    return { d, v: n.dist[nk] };
  }).filter((o) => o.v >= 0);
  if (!opts.length) return;
  const forward = opts.filter((o) => !(o.d[0] === -gn.dx && o.d[1] === -gn.dy) || (!gn.dx && !gn.dy));
  const pool = forward.length ? forward : opts;
  if (wander && !gn.scared) { gn.want = pool[Math.floor(Math.random() * pool.length)].d; return; }
  pool.sort((a, b) => (gn.scared ? b.v - a.v : a.v - b.v));
  gn.want = Math.random() < 0.22 && pool.length > 1 ? pool[1].d : pool[0].d;
}

export function MazeChase({ onExit }: { onExit: (msg?: string) => void }) {
  const g = useGame('maze');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const st = useRef<S | null>(null);
  const raf = useRef(0);
  const nav = useRef<Nav | null>(null);
  const navT = useRef(0);
  const [left, setLeft] = useState(0);
  const [won, setWon] = useState(false);

  const start = () => {
    const go = () => { st.current = build(BG); nav.current = null; navT.current = 0; setLeft(st.current.left); setWon(false); g.start(); };
    if (BG.complete && BG.naturalWidth) go(); else BG.onload = go;
  };

  useEffect(() => {
    if (g.status !== 'playing') return;
    const key = (e: KeyboardEvent) => {
      const m: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1], a: [-1, 0], d: [1, 0], w: [0, -1], s: [0, 1] };
      const d = m[e.key]; if (d && st.current) { e.preventDefault(); st.current.player.want = d; }
    };
    window.addEventListener('keydown', key);
    const ctx = canvasRef.current!.getContext('2d')!;
    let prev = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - prev) / 1000); prev = t;
      const s = st.current!; const p = s.player;
      move(s, p, 105, dt);
      for (const a of s.acorns) if (!a.taken && Math.hypot(a.x - p.x, a.y - p.y) < R + 4) { a.taken = true; s.score += 1; s.left -= 1; setLeft(s.left); if (a.gold) { s.power = 6; s.gnomes.forEach((gn) => (gn.scared = true)); } }
      if (s.power > 0) { s.power -= dt; if (s.power <= 0) s.gnomes.forEach((gn) => (gn.scared = false)); }
      if (!nav.current) nav.current = buildNav(s);
      navT.current -= dt;
      if (navT.current <= 0) { navT.current = 0.2; flood(nav.current, cellAt(nav.current, p.x, p.y)); }
      s.clock += dt;
      const wander = s.clock % 9 > 6.5;
      for (const gn of s.gnomes) {
        if (gn.wait > 0) { gn.wait -= dt; continue; }
        gn.think -= dt;
        if (gn.think <= 0 || !(gn.dx || gn.dy)) {
          gn.think = 0.15;
          steer(nav.current, gn, wander);
        }
        move(s, gn, gn.scared ? 58 : 72, dt);
        if (Math.hypot(gn.x - p.x, gn.y - p.y) < R * 1.6) {
          if (gn.scared) { s.score += 5; gn.x = gn.home[0]; gn.y = gn.home[1]; gn.scared = false; gn.dx = 0; gn.dy = 0; }
          else s.over = true;
        }
      }
      if (s.left === 0) { s.won = true; s.score += 20; s.over = true; }
      draw(ctx, s);
      if (s.over) { setWon(s.won); g.finish(s.score, 3); return; }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener('keydown', key); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [g.status]);

  return (
    <GameShell id="maze" title="Pixel Quest" best={g.best} status={g.status} score={g.status === 'playing' ? st.current?.score ?? 0 : g.score} reward={g.reward}
      stats={<span>Pixels left: {left}</span>} overTitle={won ? 'Maze cleared!' : 'Caught!'}
      intro={<>You are a squirrel loose in the hedge maze. Collect every pixel with the <b>arrow keys</b>. Three garden gnomes are after you. Grab a <b>golden pixel</b> in a corner and for a few seconds you can chase them instead.</>}
      tip="gnomes don't turn around in a corridor. Slip past them at a junction." onStart={start} onExit={onExit}>
      <canvas ref={canvasRef} width={W} height={H} style={{ display: 'block', width: '100%', height: 'auto', background: `url(/maplegrove/games/maze.jpg) center / cover` }} />
    </GameShell>
  );
}

function draw(ctx: CanvasRenderingContext2D, s: S) {
  if (BG.complete && BG.naturalWidth) ctx.drawImage(BG, 0, 0, W, H);
  for (const a of s.acorns) {
    if (a.taken) continue;
    if (a.gold) { ctx.fillStyle = '#f4d24a'; ctx.beginPath(); ctx.ellipse(a.x, a.y, 6, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#c9902a'; ctx.fillRect(a.x - 6, a.y - 8, 12, 3); ctx.strokeStyle = 'rgba(255,240,150,0.9)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(a.x, a.y, 10, 0, Math.PI * 2); ctx.stroke(); }
    else { ctx.fillStyle = '#7a4a20'; ctx.beginPath(); ctx.ellipse(a.x, a.y, 3.5, 4.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#4a2a10'; ctx.fillRect(a.x - 3.5, a.y - 5.5, 7, 2.5); }
  }
  for (const gn of s.gnomes) {
    const x = gn.x, y = gn.y; const blink = s.power > 0 && s.power < 2 && Math.floor(s.power * 6) % 2 === 0;
    ctx.fillStyle = gn.scared ? (blink ? '#ffffff' : '#8fa0e0') : '#f2c8a8'; ctx.beginPath(); ctx.arc(x, y + 2, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = gn.scared ? '#5560a0' : gn.color; ctx.beginPath(); ctx.moveTo(x - 8, y - 1); ctx.lineTo(x + 8, y - 1); ctx.lineTo(x, y - 13); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x - 2.5, y + 1, 1.4, 0, Math.PI * 2); ctx.arc(x + 2.5, y + 1, 1.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e8e2d6'; ctx.fillRect(x - 4, y + 5, 8, 4);
  }
  const p = s.player;
  ctx.fillStyle = '#a0522d'; ctx.beginPath(); ctx.arc(p.x - 6 * (p.dx || 0), p.y - 5, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#c47a3a'; ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f2d2b0'; ctx.beginPath(); ctx.arc(p.x, p.y + 2.5, 4.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1b1430'; ctx.beginPath(); ctx.arc(p.x - 2.5, p.y - 1.5, 1.4, 0, Math.PI * 2); ctx.arc(p.x + 2.5, p.y - 1.5, 1.4, 0, Math.PI * 2); ctx.fill();
  if (s.power > 0) { ctx.strokeStyle = '#f4d24a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, 12, 0, Math.PI * 2); ctx.stroke(); }
}
