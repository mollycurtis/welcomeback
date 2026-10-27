import type { SeasonId } from './districts';

export interface SeasonEvent {
  id: SeasonId;
  name: string;
  seasonName: string;
  months: number[];
  tagline: string;
  sky: string;
  ground: string;
  accent: string;
  leaf: string;
  decor: string[];
  stall: { item: string; itemId: string; price: number; blurb: string };
  bonusGame: string;
}

export const SEASONS: SeasonEvent[] = [
  {
    id: 'spring', name: 'Spring Bloom Festival', seasonName: 'Spring', months: [2, 3, 4],
    tagline: 'The gardens are waking up.',
    sky: 'linear-gradient(#c9e6f5,#eaf4e6)', ground: 'linear-gradient(#8ec46b,#7ab55a)', accent: '#e88ab0', leaf: '#7fc06a',
    decor: ['flower boxes on every lamp post', 'the fountain is running again', 'tulips along the sidewalks'],
    stall: { item: 'Bloom Wreath', itemId: 'ev_bloom_wreath', price: 180, blurb: 'Fresh flowers, wired by Olivia herself.' },
    bonusGame: 'match',
  },
  {
    id: 'summer', name: 'Summer Carnival', seasonName: 'Summer', months: [5, 6, 7],
    tagline: 'Longest days of the year. Make them count.',
    sky: 'linear-gradient(#a8dcf5,#e8f5e6)', ground: 'linear-gradient(#79b850,#6aa845)', accent: '#f3a23a', leaf: '#3f8f44',
    decor: ['striped carnival banners over Main Street', 'the pool is open', 'string lights in Grove Park'],
    stall: { item: 'Carnival Plush', itemId: 'ev_carnival_plush', price: 220, blurb: 'A prize-booth bear. Slightly lopsided. Perfect.' },
    bonusGame: 'skee',
  },
  {
    id: 'fall', name: 'Harvest Festival', seasonName: 'Fall', months: [8, 9, 10],
    tagline: 'Pumpkins, hay bales, and the best week of the year.',
    sky: 'linear-gradient(#d7c9a8,#efe4cf)', ground: 'linear-gradient(#b8944a,#a8843e)', accent: '#e07a2a', leaf: '#c63a2b',
    decor: ['hay bales outside Town Hall', 'a pumpkin on every stoop', 'red and gold leaves down the whole street'],
    stall: { item: 'Harvest Pumpkin', itemId: 'ev_harvest_pumpkin', price: 160, blurb: 'Carve it or keep it.' },
    bonusGame: 'acorn',
  },
  {
    id: 'winter', name: 'Winter Celebration', seasonName: 'Winter', months: [11, 0, 1],
    tagline: 'Lights on, snow down, everybody inside for cocoa.',
    sky: 'linear-gradient(#b9c8d8,#e6edf3)', ground: 'linear-gradient(#eef3f7,#dbe4ec)', accent: '#e34848', leaf: '#8a5a30',
    decor: ['snow on the rooftops', 'lights strung between the lamp posts', 'the winter market stalls are up in Grove Park'],
    stall: { item: 'String of Lights', itemId: 'ev_winter_lights', price: 200, blurb: 'Warm white. Hangs anywhere.' },
    bonusGame: 'burger',
  },
];

export function currentSeason(d: Date = new Date()): SeasonEvent {
  const m = d.getMonth();
  return SEASONS.find((s) => s.months.includes(m)) ?? SEASONS[2];
}

export function weekKey(d: Date = new Date()): string {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const wk = Math.ceil(((t.getTime() - y0.getTime()) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-w${wk}`;
}

export function seeded(key: string) {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619); }
  return () => {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}
