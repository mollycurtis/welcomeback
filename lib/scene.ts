export const ROOM_SRC = '/room.webp';
export const ROOM_W = 1672;
export const ROOM_H = 941;
export const ROOM_ASPECT = ROOM_W / ROOM_H;

export const SCREEN = {
  left: 25.1,
  top: 13.55,
  width: 44.6,
  height: 58.1,
};

export const SCREEN_TRANSFORM = 'none';


export type HotspotKind = 'power' | 'osd' | 'inspect' | 'wiggle';

export interface Hotspot {
  id: string;
  kind: HotspotKind;
  left: number;
  top: number;
  width: number;
  height: number;
  title?: string;
  osdButton?: 'menu' | 'minus' | 'plus' | 'degauss' | 'aux';
  inspect?: InspectSpec;
  round?: boolean;
}

export interface InspectSpec {
  kind: 'card' | 'drawing' | 'photo' | 'note';
  title: string;
  crop?: { left: number; top: number; width: number; height: number };
  caption?: string;
  back?: string;
  bigPct?: number;
  art?: string;
  image?: string;
}

export const HOTSPOTS: Hotspot[] = [
  { id: 'power', kind: 'power', round: true, title: 'Power', left: 57.13, top: 76.88, width: 2.5, height: 4.5 },
  { id: 'osd-menu', kind: 'osd', osdButton: 'menu', round: true, title: 'Menu', left: 39.43, top: 78.25, width: 1.7, height: 3.0 },
  { id: 'osd-minus', kind: 'osd', osdButton: 'minus', round: true, title: '−', left: 41.29, top: 78.25, width: 1.7, height: 3.0 },
  { id: 'osd-plus', kind: 'osd', osdButton: 'plus', round: true, title: '+', left: 43.25, top: 78.25, width: 1.7, height: 3.0 },
  { id: 'osd-degauss', kind: 'osd', osdButton: 'degauss', round: true, title: 'Degauss', left: 45.22, top: 78.25, width: 1.7, height: 3.0 },
  { id: 'osd-aux', kind: 'osd', osdButton: 'aux', round: true, title: '', left: 47.21, top: 78.25, width: 1.7, height: 3.0 },

  {
    id: 'cds',
    kind: 'inspect',
    title: 'a stack of CDs',
    left: 0.0, top: 47.0, width: 13.5, height: 31.0,
    inspect: { kind: 'card', title: 'a stack of CDs', image: '/cd-disc.png', bigPct: 40 },
  },
  {
    id: 'petville',
    kind: 'inspect',
    title: 'Petville Adoption Center card',
    left: 8.0, top: 67.0, width: 12.0, height: 15.0,
    inspect: { kind: 'card', title: 'PETVILLE. Adoption Center', image: '/petville-card.webp', bigPct: 44 },
  },
  {
    id: 'familyphoto',
    kind: 'inspect',
    title: 'a family photo',
    left: 74.0, top: 19.5, width: 12.5, height: 19.5,
    inspect: { kind: 'photo', title: 'a photograph', image: '/photo-caption.png', bigPct: 46 },
  },
  {
    id: 'drawing',
    kind: 'inspect',
    title: "a child's drawing",
    left: 88.0, top: 29.0, width: 11.5, height: 19.0,
    inspect: { kind: 'drawing', title: 'a drawing, pinned to the board', image: '/drawing.webp', bigPct: 48 },
  },
];
