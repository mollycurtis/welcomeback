export const FINN_H = 0.18;
export const FINN_ASPECT = 757 / 618;

export const BOUNDS = { x0: 0.07, x1: 0.93, y0: 0.22, y1: 0.72 };

export type Box = { x: number; y: number; w: number; h: number };
export type Entry = 'left' | 'right' | 'fade';
export type Leave = 'left' | 'right' | 'into' | 'toward';
export type Pt = { nx: number; ny: number };

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export const finnHalfW = (paintW: number, paintH: number) => (FINN_H * FINN_ASPECT * (paintH / paintW)) / 2;

function overlap(a: Box, b: Box) {
  const w = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
  const h = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
  return w * h;
}

export function restPoint(obstacles: Box[], entry: Entry, halfW: number): Pt {
  const anchorX = entry === 'left' ? 0.2 : entry === 'right' ? 0.8 : 0.3;
  const halfH = FINN_H / 2;
  let best: Pt = { nx: anchorX, ny: 0.52 };
  let bestScore = Infinity;
  for (let nx = BOUNDS.x0 + halfW; nx <= BOUNDS.x1 - halfW; nx += 0.035) {
    for (let ny = 0.34; ny <= 0.64; ny += 0.05) {
      const me: Box = { x: nx - halfW, y: ny - halfH, w: halfW * 2, h: FINN_H };
      const hit = obstacles.reduce((s, o) => s + overlap(me, o), 0) / (me.w * me.h);
      const score = hit * 12 + Math.abs(nx - anchorX) * 1.6 + Math.abs(ny - 0.5) * 0.8;
      if (score < bestScore) { bestScore = score; best = { nx, ny }; }
    }
  }
  return best;
}

export function besideTarget(t: Box, from: Pt, halfW: number, avoid: Box[] = []): Pt & { face: 'left' | 'right' } {
  const cx = t.x + t.w / 2;
  const gap = halfW * 0.92;
  const sideY = clamp(t.y + t.h * 0.5, BOUNDS.y0, BOUNDS.y1);
  const halfH = FINN_H / 2;
  const fits = (nx: number) => nx >= BOUNDS.x0 + halfW && nx <= BOUNDS.x1 - halfW;
  const hit = (nx: number, ny: number) => {
    const me: Box = { x: nx - halfW, y: ny - halfH, w: halfW * 2, h: FINN_H };
    return avoid.reduce((sum, o) => sum + overlap(me, o), 0) / (me.w * me.h);
  };
  const prefLeft = from.nx < cx;
  const spots = [prefLeft, !prefLeft].map((onLeft) => {
    const nx = onLeft ? t.x - gap : t.x + t.w + gap;
    return { nx, ny: sideY, ok: fits(nx), hit: hit(nx, sideY) };
  });
  const ay = t.y - halfH * 0.9;
  const ax = clamp(cx, BOUNDS.x0 + halfW, BOUNDS.x1 - halfW);
  spots.push({ nx: ax, ny: ay, ok: ay >= BOUNDS.y0, hit: hit(ax, ay) });
  const pick = spots.find((c) => c.ok && c.hit < 0.12)
    ?? spots.filter((c) => c.ok).sort((a, b) => a.hit - b.hit)[0]
    ?? spots[0];
  const nx = clamp(pick.nx, BOUNDS.x0 + halfW, BOUNDS.x1 - halfW);
  const ny = clamp(pick.ny, BOUNDS.y0, BOUNDS.y1);
  const face = Math.abs(nx - cx) < 0.01 ? (from.nx < cx ? 'right' : 'left') : nx < cx ? 'right' : 'left';
  return { nx, ny, face };
}

export function exitMotion(e: Box): { kind: Leave; nx: number; ny: number } {
  const cy = clamp(e.y + e.h * 0.5, BOUNDS.y0, BOUNDS.y1);
  if (e.x <= 0.03) return { kind: 'left', nx: 0.06, ny: cy };
  if (e.x + e.w >= 0.97) return { kind: 'right', nx: 0.94, ny: cy };
  return { kind: 'into', nx: e.x + e.w / 2, ny: clamp(e.y + e.h * 0.55, BOUNDS.y0 - 0.1, BOUNDS.y1) };
}

export const arrivalFor = (k: Leave): Entry => (k === 'right' ? 'left' : k === 'left' ? 'right' : 'fade');
