export type AmbientKind = 'open' | 'deep' | 'interior' | 'night' | 'treasure';

export interface Emitter {
  x: number;
  y: number;
  every: number;
  burst?: [number, number];
  size?: [number, number];
  spread?: number;
}

export interface Ambience {
  kind: AmbientKind;
  emitters: Emitter[];
  fish?: boolean;
  fishBand?: [number, number];
  glints?: [number, number, number, number];
}

const SEABED: Emitter[] = [
  { x: 0.14, y: 0.93, every: 7.5, burst: [1, 2], size: [1.6, 3.2], spread: 0.03 },
  { x: 0.52, y: 0.95, every: 9.0, burst: [1, 3], size: [1.4, 2.8], spread: 0.04 },
  { x: 0.86, y: 0.92, every: 8.0, burst: [1, 2], size: [1.6, 3.0], spread: 0.03 },
];

export const AMBIENCE: Record<string, Ambience> = {
  'moon-shell-plaza': {
    kind: 'open', fish: true, fishBand: [0.10, 0.34],
    emitters: [
      { x: 0.46, y: 0.34, every: 3.4, burst: [1, 2], size: [1.2, 2.2], spread: 0.025 },
      { x: 0.08, y: 0.86, every: 8.0, burst: [1, 2], size: [1.8, 3.2] },
      { x: 0.92, y: 0.84, every: 9.0, burst: [1, 2], size: [1.8, 3.0] },
    ],
  },
  'coral-gardens': {
    kind: 'open', fish: true, fishBand: [0.08, 0.32],
    emitters: [
      { x: 0.84, y: 0.64, every: 4.2, burst: [2, 4], size: [1.4, 2.8], spread: 0.03 },
      { x: 0.10, y: 0.80, every: 7.0, burst: [1, 2], size: [1.6, 3.0] },
      { x: 0.48, y: 0.92, every: 9.5, burst: [1, 2], size: [1.4, 2.6] },
    ],
  },
  'finn-home': {
    kind: 'open', fish: true, fishBand: [0.08, 0.28],
    emitters: [
      { x: 0.40, y: 0.26, every: 5.5, burst: [1, 3], size: [1.2, 2.4], spread: 0.015 },
      ...SEABED,
    ],
  },
  'cove-shops': { kind: 'open', fish: true, fishBand: [0.06, 0.24], emitters: SEABED },

  'bubble-bay-market': {
    kind: 'open', fish: true, fishBand: [0.06, 0.24],
    emitters: [
      { x: 0.47, y: 0.42, every: 2.6, burst: [2, 4], size: [1.2, 2.4], spread: 0.03 },
      { x: 0.10, y: 0.90, every: 9.0, burst: [1, 2], size: [1.6, 2.8] },
      { x: 0.90, y: 0.90, every: 9.0, burst: [1, 2], size: [1.6, 2.8] },
    ],
  },
  'marina-shop': {
    kind: 'interior',
    emitters: [{ x: 0.86, y: 0.36, every: 8.5, burst: [1, 2], size: [1.4, 2.4], spread: 0.02 }],
  },
  'bubble-cafe': {
    kind: 'interior',
    emitters: [
      { x: 0.66, y: 0.40, every: 3.2, burst: [1, 3], size: [1.0, 2.0], spread: 0.02 },
      { x: 0.20, y: 0.52, every: 9.0, burst: [1, 1], size: [1.2, 2.0] },
    ],
  },
  'bubble-docks': {
    kind: 'open', fish: true, fishBand: [0.06, 0.22],
    emitters: [
      { x: 0.88, y: 0.44, every: 4.8, burst: [2, 3], size: [1.4, 2.6], spread: 0.02 },
      { x: 0.30, y: 0.90, every: 8.0, burst: [1, 2], size: [1.6, 2.8] },
    ],
  },
  'festival-grounds': {
    kind: 'open', fish: true, fishBand: [0.06, 0.20],
    emitters: [{ x: 0.30, y: 0.46, every: 5.0, burst: [1, 3], size: [1.2, 2.4], spread: 0.03 }, ...SEABED],
  },

  'kelp-forest': {
    kind: 'open', fish: true, fishBand: [0.10, 0.36],
    emitters: [
      { x: 0.12, y: 0.94, every: 5.0, burst: [1, 3], size: [1.6, 3.0], spread: 0.04 },
      { x: 0.36, y: 0.95, every: 6.5, burst: [1, 2], size: [1.4, 2.6], spread: 0.04 },
      { x: 0.64, y: 0.95, every: 6.0, burst: [1, 2], size: [1.4, 2.6], spread: 0.04 },
      { x: 0.90, y: 0.94, every: 5.5, burst: [1, 3], size: [1.6, 3.0], spread: 0.04 },
    ],
  },
  'flower-garden': {
    kind: 'open', fish: true, fishBand: [0.06, 0.26],
    emitters: [
      { x: 0.37, y: 0.36, every: 2.2, burst: [2, 4], size: [1.0, 2.2], spread: 0.02 },
      ...SEABED,
    ],
  },
  'hidden-grotto': {
    kind: 'open', fish: false,
    emitters: [
      { x: 0.24, y: 0.56, every: 1.9, burst: [2, 4], size: [1.0, 2.4], spread: 0.03 },
      { x: 0.48, y: 0.66, every: 6.0, burst: [1, 2], size: [1.6, 3.0], spread: 0.05 },
    ],
  },

  'trench-edge': {
    kind: 'deep',
    emitters: [
      { x: 0.56, y: 0.92, every: 4.0, burst: [2, 5], size: [1.8, 3.6], spread: 0.02 },
      { x: 0.72, y: 0.84, every: 7.5, burst: [1, 3], size: [1.6, 3.0], spread: 0.02 },
    ],
  },
  'trench-tunnel': {
    kind: 'deep',
    emitters: [{ x: 0.64, y: 0.60, every: 6.0, burst: [1, 3], size: [1.4, 2.8], spread: 0.03 }, ...SEABED],
  },
  'deep-cave': {
    kind: 'deep',
    emitters: [
      { x: 0.10, y: 0.72, every: 6.5, burst: [1, 2], size: [1.4, 2.6], spread: 0.02 },
      { x: 0.88, y: 0.64, every: 7.0, burst: [1, 2], size: [1.4, 2.6], spread: 0.02 },
      { x: 0.50, y: 0.94, every: 9.0, burst: [1, 2], size: [1.6, 3.0] },
    ],
  },

  'reef-gate': { kind: 'open', fish: true, fishBand: [0.06, 0.24], emitters: SEABED },
  'ancient-reef': { kind: 'open', fish: true, fishBand: [0.08, 0.30], emitters: SEABED },
  'pearl-shrine': {
    kind: 'open', fish: true, fishBand: [0.04, 0.20],
    emitters: [
      { x: 0.46, y: 0.44, every: 3.0, burst: [1, 3], size: [1.0, 2.0], spread: 0.04 },
      ...SEABED,
    ],
  },

  'ship-exterior': {
    kind: 'open', fish: true, fishBand: [0.06, 0.26],
    emitters: [
      { x: 0.46, y: 0.58, every: 5.2, burst: [1, 3], size: [1.4, 2.8], spread: 0.03 },
      ...SEABED,
    ],
  },
  'ship-cargo': {
    kind: 'interior',
    emitters: [{ x: 0.70, y: 0.38, every: 7.0, burst: [1, 2], size: [1.4, 2.4], spread: 0.03 }],
  },
  'ship-cabin': {
    kind: 'interior',
    emitters: [{ x: 0.60, y: 0.30, every: 8.0, burst: [1, 2], size: [1.2, 2.2], spread: 0.04 }],
  },
  'ship-treasure': {
    kind: 'treasure', glints: [0.04, 0.40, 0.46, 0.84],
    emitters: [{ x: 0.66, y: 0.36, every: 8.5, burst: [1, 2], size: [1.2, 2.2], spread: 0.03 }],
  },

  'moonlight-festival': {
    kind: 'night', fish: true, fishBand: [0.10, 0.30],
    emitters: [
      { x: 0.64, y: 0.40, every: 2.6, burst: [2, 4], size: [1.0, 2.2], spread: 0.05 },
      { x: 0.22, y: 0.80, every: 3.2, burst: [1, 3], size: [1.2, 2.4], spread: 0.05 },
      { x: 0.84, y: 0.78, every: 3.6, burst: [1, 3], size: [1.2, 2.4], spread: 0.05 },
      ...SEABED,
    ],
  },
  'moon-chamber': {
    kind: 'night',
    emitters: [
      { x: 0.50, y: 0.46, every: 2.4, burst: [1, 3], size: [1.0, 2.0], spread: 0.04 },
    ],
  },
};

export const ambienceFor = (sceneId: string): Ambience =>
  AMBIENCE[sceneId] ?? { kind: 'open', fish: true, fishBand: [0.08, 0.28], emitters: SEABED };
