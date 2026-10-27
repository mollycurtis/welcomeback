import type { Ambience, Emitter } from '@/lib/finn/ambience';

type Box = { ox: number; oy: number; sw: number; sh: number };
type Layer = 'back' | 'front';

interface Speck { x: number; y: number; r: number; vx: number; vy: number; a: number; ph: number; w: number; hue?: string; pulse?: number }
interface Star { x: number; y: number; s: number; age: number; dur: number; rot: number; layer: Layer }
interface Ring { x: number; y: number; r: number; age: number }
interface Pending { at: number; x: number; y: number; size: [number, number]; layer: Layer; vx?: number }

const TAU = Math.PI * 2;
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const irnd = (a: number, b: number) => Math.floor(rnd(a, b + 1));
const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];

export class AmbientEngine {
  private back: CanvasRenderingContext2D;
  private front: CanvasRenderingContext2D;
  private bc: HTMLCanvasElement;
  private fc: HTMLCanvasElement;
  private w = 0; private h = 0; private box: Box = { ox: 0, oy: 0, sw: 1, sh: 1 };
  private u = 1;
  private amb: Ambience | null = null;
  private idle = false;

  private snow: Speck[] = [];
  private specks: Speck[] = [];
  private motes: Speck[] = [];
  private stars: Star[] = [];
  private rings: Ring[] = [];
  private pending: Pending[] = [];
  private nextAt: number[] = [];
  private fishAt = 0;
  private glintAt = 0;

  private t = 0;
  private last = 0;
  private raf = 0;
  private running = false;
  private frontTick = 0;

  private glows = new Map<string, HTMLCanvasElement>();
  private sprite(rgb: string, hard = 0) {
    const key = rgb + ':' + hard;
    const hit = this.glows.get(key);
    if (hit) return hit;
    const c = document.createElement('canvas');
    c.width = c.height = 32;
    const g = c.getContext('2d')!;
    const gr = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    gr.addColorStop(0, `rgba(${rgb},1)`);
    if (hard) gr.addColorStop(hard, `rgba(${rgb},0.9)`);
    gr.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = gr; g.fillRect(0, 0, 32, 32);
    this.glows.set(key, c);
    return c;
  }

  private backFx: HTMLElement;
  private frontFx: HTMLElement;
  private live = 0;
  private tick = 0;
  private bubbleSprite = '';
  private fishSprite = '';

  private level = 0;
  private frames: number[] = [];
  private lastRaf = 0;
  private settleUntil = 0;

  constructor(back: HTMLCanvasElement, front: HTMLCanvasElement, backFx: HTMLElement, frontFx: HTMLElement) {
    this.bc = back; this.fc = front;
    this.backFx = backFx; this.frontFx = frontFx;
    this.back = back.getContext('2d')!;
    this.front = front.getContext('2d')!;
    this.bakeSprites();
  }

  private bakeSprites() {
    const b = document.createElement('canvas'); b.width = b.height = 48;
    const g = b.getContext('2d')!;
    const r = 20;
    g.fillStyle = 'rgba(190,230,250,0.24)';
    g.beginPath(); g.arc(24, 24, r, 0, TAU); g.fill();
    g.lineWidth = 4.2; g.strokeStyle = 'rgba(18,48,78,0.62)'; g.stroke();
    g.fillStyle = 'rgba(255,255,255,0.88)';
    g.beginPath(); g.arc(24 - r * 0.34, 24 - r * 0.36, r * 0.3, 0, TAU); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.5)';
    g.beginPath(); g.arc(24 + r * 0.32, 24 + r * 0.3, r * 0.12, 0, TAU); g.fill();
    this.bubbleSprite = b.toDataURL();

    const f = document.createElement('canvas'); f.width = 64; f.height = 32;
    const h = f.getContext('2d')!;
    h.translate(40, 16);
    h.fillStyle = 'rgb(16,42,78)';
    h.beginPath(); h.ellipse(0, 0, 20, 8, 0, 0, TAU); h.fill();
    h.beginPath(); h.moveTo(-17, 0); h.lineTo(-31, -8); h.lineTo(-28, 0); h.lineTo(-31, 8); h.closePath(); h.fill();
    h.beginPath(); h.moveTo(-3, -7); h.lineTo(2, -12); h.lineTo(6, -6); h.closePath(); h.fill();
    this.fishSprite = f.toDataURL();
  }

  resize(w: number, h: number, box: Box, zoom: number) {
    this.w = w; this.h = h; this.box = box;
    this.u = Math.max(0.5, box.sh / 420);
    const dpr = window.devicePixelRatio || 1;
    const kb = Math.min(2, dpr * Math.max(1, zoom));
    const kf = Math.min(1.25, dpr);
    for (const [c, ctx, k] of [[this.bc, this.back, kb], [this.fc, this.front, kf]] as const) {
      c.width = Math.max(1, Math.round(w * k));
      c.height = Math.max(1, Math.round(h * k));
      ctx.setTransform(k, 0, 0, k, 0, 0);
    }
    this.seedFields();
  }

  setScene(amb: Ambience) {
    this.amb = amb;
    this.backFx.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    this.frontFx.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    this.stars = []; this.rings = []; this.pending = [];
    this.nextAt = amb.emitters.map((e) => this.t + e.every * rnd(0.15, 0.9));
    this.fishAt = this.t + rnd(1.8, 4.0);
    this.glintAt = this.t + rnd(0.4, 1.2);
    this.seedFields();
    if (this.level) this.applyLevel();
  }

  setIdle(on: boolean) { this.idle = on; }

  puff(x: number, y: number, n = 1, size: [number, number] = [0.9, 1.8], layer: Layer = 'front', vx = 0) {
    for (let i = 0; i < n; i++) this.pending.push({ at: this.t + i * rnd(0.03, 0.09), x: x + rnd(-3, 3), y: y + rnd(-3, 3), size, layer, vx });
  }

  burst(x: number, y: number) {
    this.rings.push({ x, y, r: 4 * this.u, age: 0 });
    for (let i = 0; i < 9; i++) this.pending.push({ at: this.t + i * 0.025, x: x + rnd(-10, 10) * this.u, y: y + rnd(-6, 6) * this.u, size: [1.0, 2.6], layer: 'front', vx: rnd(-18, 18) });
  }

  glint(x: number, y: number, n = 4) {
    for (let i = 0; i < n; i++) {
      this.stars.push({ x: x + rnd(-14, 14) * this.u, y: y + rnd(-10, 10) * this.u, s: rnd(3.5, 6.5) * this.u, age: -i * 0.08, dur: rnd(0.45, 0.7), rot: rnd(0, TAU), layer: 'front' });
    }
  }

  start() {
    if (this.running) return;
    this.running = true; this.last = performance.now();
    const tick = (now: number) => {
      if (!this.running) return;
      this.raf = requestAnimationFrame(tick);
      if (document.hidden) { this.last = now; this.lastRaf = 0; return; }
      this.govern(now);
      const dt = (now - this.last) / 1000;
      if (dt < 1 / 30) return;
      this.last = now;
      this.step(Math.min(dt, 0.1));
      if (++this.tick % 3 === 0) this.draw();
      else this.drawFront();
    };
    this.raf = requestAnimationFrame(tick);
  }

  stop() { this.running = false; cancelAnimationFrame(this.raf); }

  private govern(now: number) {
    if (this.lastRaf) this.frames.push(now - this.lastRaf);
    this.lastRaf = now;
    if (this.frames.length < 120) return;
    const sorted = [...this.frames].sort((a, b) => a - b);
    const median = sorted[sorted.length >> 1];
    this.frames = [];
    if (now < this.settleUntil || this.level >= 3 || this.full) return;
    if (median > 24) {
      this.level++;
      this.settleUntil = now + 1500;
      this.applyLevel();
    }
  }

  private shed(c: HTMLCanvasElement) {
    if (c.style.display === 'none') return;
    c.style.transition = 'opacity 1s'; c.style.opacity = '0';
    window.setTimeout(() => { c.style.display = 'none'; }, 1050);
  }

  private applyLevel() {
    if (this.level >= 1) { this.shed(this.fc); this.specks = []; this.snow = this.snow.filter((_, i) => i % 2 === 0); }
    if (this.level >= 2) { this.shed(this.bc); this.snow = []; this.motes = []; }
  }

  private get full() { return typeof window !== 'undefined' && !!(window as unknown as { __FINN_FULL__?: boolean }).__FINN_FULL__; }

  get quality() { return this.level; }
  destroy() {
    this.stop(); this.snow = []; this.specks = []; this.motes = [];
    this.backFx.replaceChildren(); this.frontFx.replaceChildren();
  }

  private seedFields() {
    if (!this.amb || !this.w) return;
    const area = (this.w * this.h) / (620 * 340);
    const k = this.amb.kind;
    const n = (base: number) => Math.round(base * area);
    const u = this.u;

    const snowN = k === 'open' ? n(58) : k === 'deep' ? n(26) : k === 'night' ? n(22) : k === 'treasure' ? n(14) : 0;
    this.snow = Array.from({ length: snowN }, () => ({
      x: rnd(0, this.w), y: rnd(0, this.h), r: rnd(0.5, 1.35) * u,
      vx: rnd(-3, 3) * u, vy: rnd(2.5, 8) * u, a: rnd(0.16, 0.4), ph: rnd(0, TAU), w: rnd(0.3, 0.9),
    }));

    const frontN = k === 'open' ? n(9) : k === 'deep' ? n(5) : k === 'night' ? n(6) : n(4);
    this.specks = Array.from({ length: frontN }, () => ({
      x: rnd(0, this.w), y: rnd(0, this.h), r: rnd(1.8, 3.4) * u,
      vx: rnd(-8, 8) * u, vy: rnd(7, 18) * u, a: rnd(0.08, 0.18), ph: rnd(0, TAU), w: rnd(0.4, 1.0),
    }));

    if (k === 'deep') {
      this.motes = Array.from({ length: n(26) }, () => ({
        x: rnd(0, this.w), y: rnd(0, this.h), r: rnd(0.9, 2.2) * u, vx: rnd(-5, 5) * u, vy: rnd(-5, 5) * u,
        a: rnd(0.3, 0.9), ph: rnd(0, TAU), w: rnd(0.4, 1.1), pulse: rnd(0.6, 1.6),
        hue: pick(['127,240,255', '95,214,200', '160,232,255', '120,255,210']),
      }));
    } else if (k === 'night') {
      this.motes = Array.from({ length: n(22) }, () => ({
        x: rnd(0, this.w), y: rnd(0, this.h), r: rnd(0.9, 2.0) * u, vx: rnd(-3, 3) * u, vy: rnd(-11, -4) * u,
        a: rnd(0.3, 0.8), ph: rnd(0, TAU), w: rnd(0.5, 1.2), pulse: rnd(0.8, 1.8),
        hue: pick(['255,217,138', '255,231,176', '255,200,120']),
      }));
    } else if (k === 'interior' || k === 'treasure') {
      this.motes = Array.from({ length: n(k === 'treasure' ? 18 : 32) }, () => ({
        x: rnd(0, this.w), y: rnd(0, this.h), r: rnd(0.55, 1.3) * u, vx: rnd(-2.5, 2.5) * u, vy: rnd(-1.5, 2.5) * u,
        a: rnd(0.2, 0.55), ph: rnd(0, TAU), w: rnd(0.2, 0.6), pulse: rnd(0.3, 0.9), hue: '255,240,207',
      }));
    } else {
      this.motes = [];
    }
  }

  private px(nx: number) { return this.box.ox + nx * this.box.sw; }
  private py(ny: number) { return this.box.oy + ny * this.box.sh; }

  private spawnBubble(x: number, y: number, size: [number, number], layer: Layer, vx = 0) {
    if (this.live > 40) return;
    if (this.level >= 3 && layer === 'back') return;
    const u = this.u;
    const r = rnd(size[0], size[1]) * u;
    const vy0 = (rnd(24, 44) + r * 3.2) * u / Math.max(1, u * 0.9);
    const ceiling = rnd(-0.08, 0.22) * this.h;
    const amp = rnd(1.6, 4.8) * u * (1 + r / (6 * u)), freq = rnd(1.3, 2.8), ph = rnd(0, TAU);
    const dist = Math.max(8, y - ceiling), a = 3 * u;
    const life = Math.min(9, (-vy0 + Math.sqrt(vy0 * vy0 + 4 * a * dist)) / (2 * a));
    const tiny = r < 1.25 * u;
    const el = document.createElement(tiny ? 'div' : 'img');
    const d = r * 2;
    Object.assign(el.style, {
      position: 'absolute', left: '0', top: '0', width: `${d}px`, height: `${d}px`,
      pointerEvents: 'none', willChange: 'transform, opacity',
      ...(tiny ? { borderRadius: '50%', background: 'rgba(225,245,255,0.78)' } : {}),
    });
    if (!tiny) { (el as HTMLImageElement).src = this.bubbleSprite; (el as HTMLImageElement).alt = ''; }
    (layer === 'front' ? this.frontFx : this.backFx).appendChild(el);
    this.live++;
    const frames: Keyframe[] = [];
    const N = 14;
    for (let i = 0; i <= N; i++) {
      const t = (life * i) / N;
      const yy = y - vy0 * t - a * t * t;
      const drift = vx ? (vx * (1 - Math.exp(-1.86 * t))) / 1.86 : 0;
      const xx = x + drift + Math.sin(t * freq + ph) * amp;
      const sw = Math.min(1.32, 1 + 0.06 * t);
      const fade = i === 0 ? 0 : i === N ? 0 : 1;
      frames.push({ transform: `translate(${(xx - r).toFixed(1)}px, ${(yy - r).toFixed(1)}px) scale(${(i === N ? sw * 1.5 : sw).toFixed(3)})`, opacity: fade });
    }
    const anim = el.animate(frames, { duration: life * 1000, easing: 'linear' });
    const done = () => { el.remove(); this.live--; };
    anim.finished.then(done, done);
  }

  private step(dt: number) {
    if (!this.amb) return;
    this.t += dt;
    const t = this.t, u = this.u;

    this.amb.emitters.forEach((e: Emitter, i) => {
      if (t < this.nextAt[i]) return;
      const boost = this.idle ? 2.3 : 1;
      this.nextAt[i] = t + (e.every / boost) * rnd(0.55, 1.5);
      const sx = this.px(e.x), sy = this.py(e.y);
      if (sy < 0 || sy > this.h + 8) return;
      const [lo, hi] = e.burst ?? [1, 2];
      const size = e.size ?? [1.4, 2.8];
      const spread = (e.spread ?? 0.02) * this.box.sw;
      for (let k = 0, n = irnd(lo, hi); k < n; k++) {
        this.pending.push({ at: t + k * rnd(0.08, 0.26), x: sx + rnd(-spread, spread), y: sy + rnd(-2, 2), size, layer: 'back' });
      }
    });

    for (let i = this.pending.length - 1; i >= 0; i--) {
      const p = this.pending[i];
      if (t >= p.at) { this.spawnBubble(p.x, p.y, p.size, p.layer, p.vx); this.pending.splice(i, 1); }
    }

    for (let i = this.rings.length - 1; i >= 0; i--) { this.rings[i].age += dt; if (this.rings[i].age > 0.55) this.rings.splice(i, 1); }
    for (let i = this.stars.length - 1; i >= 0; i--) { this.stars[i].age += dt; if (this.stars[i].age > this.stars[i].dur) this.stars.splice(i, 1); }

    const drift = (s: Speck, speed = 1) => {
      s.x += (s.vx + Math.sin(t * s.w + s.ph) * 4 * u) * dt * speed;
      s.y += s.vy * dt * speed;
      if (s.x < -8) s.x = this.w + 8; else if (s.x > this.w + 8) s.x = -8;
      if (s.y < -8) s.y = this.h + 8; else if (s.y > this.h + 8) s.y = -8;
    };
    this.snow.forEach((s) => drift(s));
    this.specks.forEach((s) => drift(s, 1));
    this.motes.forEach((s) => drift(s));

    if (this.amb.fish && t >= this.fishAt) {
      this.fishAt = t + rnd(7, 15);
      this.spawnSchool();
    }

    if (this.amb.glints && t >= this.glintAt) {
      this.glintAt = t + rnd(0.7, 1.9);
      const [gx, gy, gw, gh] = this.amb.glints;
      this.stars.push({ x: this.px(rnd(gx, gx + gw)), y: this.py(rnd(gy, gy + gh)), s: rnd(3, 6.5) * u, age: 0, dur: rnd(0.55, 0.9), rot: rnd(0, TAU), layer: 'back' });
    }
  }

  private spawnSchool() { if (this.level < 3) this.spawnSchoolDom(); }

  private spawnSchoolDom() {
    const u = this.u;
    const band = this.amb?.fishBand ?? [0.08, 0.28];
    const dir = Math.random() < 0.5 ? 1 : -1;
    const lone = Math.random() < 0.2;
    const count = lone ? 1 : irnd(3, 7);
    const d = lone ? rnd(0.75, 0.95) : rnd(0.32, 0.7);
    const L = rnd(14, 21) * u * (0.6 + d * 0.8);
    const speed = rnd(20, 36) * u * (0.55 + d * 0.6);
    const baseY = this.py(rnd(band[0], band[1]));
    const span = this.w + L * 6;
    for (let i = 0; i < count; i++) {
      const lag = i * L * rnd(1.1, 1.7) + rnd(0, L);
      const size = L * rnd(0.85, 1.1);
      const y0 = baseY + rnd(-L * 1.4, L * 1.4);
      const dur = ((span + lag) / (speed * rnd(0.93, 1.07))) * 1000;
      const el = document.createElement('img');
      el.src = this.fishSprite; el.alt = '';
      Object.assign(el.style, {
        position: 'absolute', left: '0', top: '0', width: `${size * 1.6}px`, height: `${size * 0.8}px`,
        pointerEvents: 'none', willChange: 'transform', opacity: String(0.14 + d * 0.24),
      });
      this.backFx.appendChild(el);
      const frames: Keyframe[] = [];
      const N = 24, mAmp = size * rnd(0.25, 0.6), ph = rnd(0, TAU);
      for (let k = 0; k <= N; k++) {
        const t = k / N;
        const x = dir > 0 ? -L * 3 - lag + t * (span + lag) : this.w + L * 3 + lag - t * (span + lag);
        const y = y0 + Math.sin(x * 0.012 + ph) * mAmp;
        const wag = Math.sin(t * 48 + ph) * 4;
        frames.push({ transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scaleX(${dir > 0 ? 1 : -1}) rotate(${wag.toFixed(1)}deg)` });
      }
      const a = el.animate(frames, { duration: dur, easing: 'linear' });
      const done = () => el.remove();
      a.finished.then(done, done);
    }
  }

  private draw() {
    if (this.level >= 2) return;
    const B = this.back;
    B.clearRect(0, 0, this.w, this.h);
    const t = this.t;

    B.fillStyle = 'rgba(214,236,250,1)';
    for (const s of this.snow) {
      B.globalAlpha = s.a;
      B.beginPath(); B.arc(s.x, s.y, s.r, 0, TAU); B.fill();
    }
    B.globalAlpha = 1;

    for (const m of this.motes) {
      const a = m.a * (0.55 + 0.45 * Math.sin(t * (m.pulse ?? 1) + m.ph));
      if (a <= 0.02) continue;
      const R = m.r * 4.2;
      B.globalAlpha = a * 0.55;
      B.drawImage(this.sprite(m.hue ?? '255,255,255'), m.x - R, m.y - R, R * 2, R * 2);
      B.globalAlpha = Math.min(1, a + 0.2);
      B.drawImage(this.sprite(m.hue ?? '255,255,255', 0.55), m.x - m.r, m.y - m.r, m.r * 2, m.r * 2);
    }
    B.globalAlpha = 1;

    for (const s of this.stars) if (s.layer === 'back') this.drawStar(B, s);

    this.drawFront();
  }

  private drawFront() {
    if (this.level >= 1) return;
    const F = this.front;
    const lively = this.rings.length > 0 || this.stars.some((s) => s.layer === 'front');
    this.frontTick++;
    if (!lively && this.frontTick % 3) return;
    F.clearRect(0, 0, this.w, this.h);
    const speck = this.sprite('220,240,255');
    for (const s of this.specks) {
      const R = s.r * 1.6;
      F.globalAlpha = s.a;
      F.drawImage(speck, s.x - R, s.y - R, R * 2, R * 2);
    }
    F.globalAlpha = 1;
    for (const r of this.rings) {
      const k = r.age / 0.55;
      F.strokeStyle = `rgba(255,248,214,${0.8 * (1 - k)})`;
      F.lineWidth = Math.max(1, 2.2 * this.u * (1 - k));
      F.beginPath(); F.arc(r.x, r.y, r.r + k * 30 * this.u, 0, TAU); F.stroke();
    }
    for (const s of this.stars) if (s.layer === 'front') this.drawStar(F, s);
  }

  private drawStar(c: CanvasRenderingContext2D, s: Star) {
    if (s.age < 0) return;
    const k = s.age / s.dur;
    const sc = Math.sin(Math.PI * k);
    const L = s.s * sc, w = L * 0.22;
    c.save();
    c.translate(s.x, s.y); c.rotate(s.rot + k * 0.6);
    c.fillStyle = `rgba(255,250,215,${0.95 * sc})`;
    for (let i = 0; i < 2; i++) {
      c.beginPath();
      c.moveTo(0, -L); c.lineTo(w, 0); c.lineTo(0, L); c.lineTo(-w, 0); c.closePath(); c.fill();
      c.rotate(Math.PI / 2);
    }
    c.fillStyle = `rgba(255,255,255,${sc})`;
    c.beginPath(); c.arc(0, 0, w * 0.9, 0, TAU); c.fill();
    c.restore();
  }
}
