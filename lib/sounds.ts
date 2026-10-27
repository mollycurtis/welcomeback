'use client';

import { useSave } from '@/store/save';
import { useFinnPrefs } from '@/lib/finn/prefs';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function ensure(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC: typeof AudioContext | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.16;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

const enabled = () => useSave.getState().soundOn;
const finnEnabled = () => enabled() && useFinnPrefs.getState().soundOn;

let volumeLevel = 0.5;

let lastStartup = -10000;

interface ToneOpts {
  type?: OscillatorType;
  vol?: number;
  when?: number;
  glideTo?: number;
}

function tone(freq: number, dur: number, opts: ToneOpts = {}) {
  if (!enabled()) return;
  const c = ensure();
  if (!c || !master) return;
  const t0 = c.currentTime + (opts.when ?? 0);
  const o = c.createOscillator();
  o.type = opts.type ?? 'square';
  o.frequency.setValueAtTime(freq, t0);
  if (opts.glideTo) o.frequency.exponentialRampToValueAtTime(opts.glideTo, t0 + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(opts.vol ?? 0.5, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g);
  g.connect(master);
  o.start(t0);
  o.stop(t0 + dur + 0.05);
}

function noiseBurst(dur: number, vol: number, cutoff: number, when = 0) {
  if (!enabled()) return;
  const c = ensure();
  if (!c || !master) return;
  const t0 = c.currentTime + when;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = cutoff;
  const g = c.createGain();
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(lp);
  lp.connect(g);
  g.connect(master);
  src.start(t0);
}

function bubble(freq: number, when = 0, vol = 0.20, dur = 0.075) {
  if (!finnEnabled()) return;
  const c = ensure();
  if (!c || !master) return;
  const t0 = c.currentTime + when;
  const o = c.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(freq, t0);
  o.frequency.exponentialRampToValueAtTime(freq * 2.6, t0 + dur);
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 1900;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(lp); lp.connect(g); g.connect(master);
  o.start(t0); o.stop(t0 + dur + 0.05);
}

function waterSweep(from: number, to: number, dur: number, vol = 0.10, when = 0) {
  if (!finnEnabled()) return;
  const c = ensure();
  if (!c || !master) return;
  const t0 = c.currentTime + when;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource(); src.buffer = buf;
  const bp = c.createBiquadFilter();
  bp.type = 'bandpass'; bp.Q.value = 1.6;
  bp.frequency.setValueAtTime(from, t0);
  bp.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + dur * 0.25);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(bp); bp.connect(g); g.connect(master);
  src.start(t0); src.stop(t0 + dur + 0.05);
}

export const sounds = {
  unlock() {
    ensure();
  },

  setVolume(v: number) {
    volumeLevel = Math.max(0, Math.min(1, v));
    if (master) master.gain.value = 0.32 * volumeLevel;
    else ensure();
    if (master) master.gain.value = 0.32 * volumeLevel;
  },

  thock() {
    tone(620, 0.045, { type: 'square', vol: 0.3 });
    tone(180, 0.06, { type: 'sine', vol: 0.25 });
  },

  degauss() {
    tone(2300, 0.018, { type: 'square', vol: 0.22 });
    tone(46, 0.55, { type: 'sine', vol: 0.95 });
    tone(118, 0.3, { type: 'triangle', vol: 0.4 });
    noiseBurst(0.42, 0.22, 420, 0.02);
  },

  click() {
  },

  blip() {
    tone(880, 0.07, { type: 'triangle', vol: 0.4 });
  },

  blipLow() {
    tone(520, 0.08, { type: 'triangle', vol: 0.35 });
  },

  error() {
    tone(440, 0.12, { type: 'square', vol: 0.38 });
    tone(220, 0.22, { type: 'square', vol: 0.38, when: 0.11 });
  },

  post() {
    tone(990, 0.14, { type: 'square', vol: 0.45 });
  },

  chime() {
    tone(1318.5, 0.5, { type: 'sine', vol: 0.3 });
    tone(1975.5, 0.4, { type: 'sine', vol: 0.12, when: 0.05 });
  },

  startup() {
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (now - lastStartup < 2500) return;
    lastStartup = now;
    const notes = [329.63, 392.0, 493.88, 659.25];
    notes.forEach((f, i) => {
      tone(f, 1.15, { type: 'triangle', vol: 0.3, when: i * 0.17 });
      tone(f / 2, 1.35, { type: 'sine', vol: 0.11, when: i * 0.17 });
    });
  },

  shutdown() {
    const notes = [659.25, 493.88, 392.0, 329.63];
    notes.forEach((f, i) => {
      tone(f, 0.95, { type: 'triangle', vol: 0.28, when: i * 0.16 });
    });
    tone(164.81, 1.7, { type: 'sine', vol: 0.13, when: 0.5 });
  },

  ding(freq = 1200) {
    tone(freq, 0.09, { type: 'square', vol: 0.3 });
    tone(freq * 1.5, 0.06, { type: 'sine', vol: 0.15, when: 0.01 });
  },

  launch() {
    tone(220, 0.3, { type: 'sawtooth', vol: 0.25, glideTo: 880 });
  },

  boom() {
    tone(160, 0.25, { type: 'square', vol: 0.4, glideTo: 60 });
    noiseBurst(0.22, 0.25, 600);
  },

  printer() {
    for (let i = 0; i < 10; i++) {
      tone(170 + (i % 3) * 55, 0.045, { type: 'square', vol: 0.18, when: i * 0.085 });
    }
    tone(700, 0.25, { type: 'triangle', vol: 0.15, when: 0.95, glideTo: 300 });
  },

  pickUp() {
    tone(150, 0.05, { type: 'sine', vol: 0.52 });
    tone(96, 0.07, { type: 'sine', vol: 0.32, when: 0.005 });
    noiseBurst(0.04, 0.17, 2400);
  },

  setDown() {
    noiseBurst(0.05, 0.18, 1500);
    tone(120, 0.07, { type: 'sine', vol: 0.45, when: 0.01 });
  },

  crumple() {
    noiseBurst(0.09, 0.17, 3800);
    noiseBurst(0.07, 0.14, 2600, 0.06);
    noiseBurst(0.06, 0.11, 1900, 0.12);
    tone(140, 0.05, { type: 'sine', vol: 0.12, when: 0.13 });
  },

  song() {
    if (!enabled()) return;
    const seq: [number, number][] = [
      [523.25, 0], [659.25, 0.17], [783.99, 0.34], [1046.5, 0.51],
      [783.99, 0.68], [880.0, 0.85], [1046.5, 1.02], [1318.5, 1.26],
    ];
    seq.forEach(([f, w]) => {
      tone(f, 0.2, { type: 'square', vol: 0.32, when: w });
      tone(f / 2, 0.22, { type: 'triangle', vol: 0.12, when: w });
    });
  },

  rattle() {
    noiseBurst(0.028, 0.13, 5200);
    tone(430, 0.03, { type: 'triangle', vol: 0.13, when: 0.02 });
    noiseBurst(0.03, 0.1, 4200, 0.05);
    tone(330, 0.03, { type: 'triangle', vol: 0.11, when: 0.08 });
    noiseBurst(0.025, 0.08, 6000, 0.09);
  },

  ifindFound(streak = 0) {
    const step = Math.min(streak, 7);
    const f = 523.25 * Math.pow(2, step / 12);
    tone(f, 0.11, { type: 'triangle', vol: 0.34 });
    tone(f * 2, 0.09, { type: 'sine', vol: 0.16, when: 0.015 });
    tone(f * 3, 0.07, { type: 'sine', vol: 0.07, when: 0.03 });
  },

  ifindWrong() {
    tone(196, 0.07, { type: 'triangle', vol: 0.34 });
    tone(131, 0.11, { type: 'sine', vol: 0.26, when: 0.01 });
    noiseBurst(0.04, 0.1, 900, 0.005);
  },

  ifindHint() {
    tone(1480, 0.4, { type: 'sine', vol: 0.2, glideTo: 740 });
    tone(740, 0.5, { type: 'sine', vol: 0.09, when: 0.06, glideTo: 494 });
  },

  ifindTick(urgent = false) {
    tone(urgent ? 1760 : 1320, 0.028, { type: 'square', vol: urgent ? 0.2 : 0.12 });
    noiseBurst(0.012, 0.05, 6000);
  },

  ifindWin() {
    const seq: [number, number][] = [[523.25, 0], [659.25, 0.1], [783.99, 0.2], [1046.5, 0.32]];
    seq.forEach(([f, w]) => {
      tone(f, 0.26, { type: 'triangle', vol: 0.3, when: w });
      tone(f / 2, 0.3, { type: 'sine', vol: 0.11, when: w });
    });
  },

  ifindTimeUp() {
    const seq: [number, number][] = [[659.25, 0], [523.25, 0.13], [392.0, 0.26], [261.63, 0.42]];
    seq.forEach(([f, w]) => {
      tone(f, 0.3, { type: 'triangle', vol: 0.28, when: w });
    });
    tone(130.81, 0.9, { type: 'sine', vol: 0.14, when: 0.42 });
  },

  finnPickup() {
    bubble(380, 0, 0.22);
    bubble(510, 0.055, 0.19);
    bubble(680, 0.105, 0.15);
    waterSweep(600, 2200, 0.16, 0.05, 0.02);
  },

  finnDiscover() {
    [300, 400, 520, 660, 840].forEach((f, i) => bubble(f, i * 0.055, 0.2 - i * 0.015));
    waterSweep(400, 3000, 0.45, 0.07, 0.05);
    [523.25, 659.25, 783.99].forEach((f, i) => {
      tone(f, 0.5, { type: 'sine', vol: 0.11, when: 0.3 + i * 0.015 });
      tone(f * 2, 0.4, { type: 'sine', vol: 0.04, when: 0.32 + i * 0.015 });
    });
  },

  finnStar() {
    bubble(1200, 0, 0.13, 0.05);
    bubble(1600, 0.04, 0.11, 0.045);
    bubble(2100, 0.08, 0.08, 0.04);
  },

  gag(kind: 'swish' | 'rattle' | 'boing' | 'wub' | 'twinkle') {
    if (!finnEnabled()) return;
    const c = ensure(); if (!c || !master) return;
    const t = c.currentTime + 0.01;
    const note = (type: OscillatorType, f0: number, f1: number, at: number, dur: number, vol: number, f2?: number) => {
      const o = c.createOscillator(), g = c.createGain(); o.type = type;
      o.frequency.setValueAtTime(f0, t + at);
      if (f2) { o.frequency.exponentialRampToValueAtTime(f1, t + at + dur * 0.4); o.frequency.exponentialRampToValueAtTime(f2, t + at + dur); }
      else o.frequency.exponentialRampToValueAtTime(f1, t + at + dur);
      g.gain.setValueAtTime(0.0001, t + at); g.gain.exponentialRampToValueAtTime(vol, t + at + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + at + dur);
      o.connect(g); g.connect(master!); o.start(t + at); o.stop(t + at + dur + 0.02);
    };
    const noise = (at: number, dur: number, freq: number, vol: number) => {
      const n = Math.floor(c.sampleRate * dur), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
      const src = c.createBufferSource(); src.buffer = b;
      const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = freq; bp.Q.value = 2;
      const g = c.createGain(); g.gain.value = vol;
      src.connect(bp); bp.connect(g); g.connect(master!); src.start(t + at);
    };
    switch (kind) {
      case 'boing':   note('sine', 190, 540, 0, 0.34, 0.16, 290); bubble(420, 0.12, 0.08, 0.05); break;
      case 'wub':     note('triangle', 150, 105, 0, 0.16, 0.16); note('triangle', 140, 98, 0.16, 0.18, 0.13); break;
      case 'rattle':  [0, 0.05, 0.1, 0.16].forEach((at, i) => noise(at, 0.035, 1500 + i * 300, 0.09)); bubble(380, 0.2, 0.08, 0.05); break;
      case 'swish':   waterSweep(1900, 520, 0.36, 0.07); bubble(300, 0.18, 0.09, 0.05); break;
      case 'twinkle': [1760, 2350, 2960].forEach((f, i) => note('sine', f, f * 1.01, i * 0.065, 0.14, 0.07)); break;
    }
  },

  finnTalk() {
    bubble(220 + Math.random() * 60, 0, 0.11, 0.06);
  },

  finnSwim() {
    waterSweep(2400, 320, 0.42, 0.13);
    bubble(300, 0.05, 0.13);
    bubble(240, 0.14, 0.10);
    bubble(190, 0.23, 0.07);
  },

  finnNope() {
    bubble(260, 0, 0.14, 0.09);
    bubble(190, 0.09, 0.11, 0.10);
  },

  finnPouch(open = true) {
    if (open) {
      bubble(420, 0, 0.15, 0.06);
      bubble(560, 0.04, 0.13, 0.055);
      bubble(700, 0.08, 0.10, 0.05);
      waterSweep(800, 2600, 0.18, 0.05);
    } else {
      bubble(620, 0, 0.12, 0.055);
      bubble(430, 0.05, 0.12, 0.065);
    }
  },

  finnIdleBubbles() {
    const n = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      bubble(260 + Math.random() * 420, i * (0.12 + Math.random() * 0.18), 0.045, 0.07);
    }
  },

  ifindFold() {
    noiseBurst(0.07, 0.13, 3400);
    noiseBurst(0.05, 0.09, 2200, 0.05);
  },
};
