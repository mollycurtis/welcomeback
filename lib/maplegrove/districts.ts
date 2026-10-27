import type { MGLocation } from '@/store/maplegrove';

export type SeasonId = 'spring' | 'summer' | 'fall' | 'winter';

export interface District {
  loc: MGLocation;
  name: string;
  short: string;
  purpose: string;
  live: boolean;
  cx: number; cy: number; w: number; h: number;
  lx?: number; ly?: number;
  plaque?: boolean;
}

export const DISTRICTS: District[] = [
  { loc: 'town',        name: 'Downtown',     short: 'Downtown',     purpose: 'The commercial and social heart of Maple Grove.',        live: true, cx: 50.5, cy: 44.0, w: 28, h: 30, lx: 50.8, ly: 43.5 },
  { loc: 'oakwood',     name: 'Rosemount',    short: 'Rosemount',    purpose: 'Where every resident starts. Your house is here.',       live: true, cx: 83.0, cy: 80.0, w: 28, h: 24, lx: 82.0, ly: 73.5 },
  { loc: 'riverside',   name: 'Lakeville',    short: 'Lakeville',    purpose: 'The lake. Fish off the dock, watch the sailboats.',      live: true, cx: 25.0, cy: 15.0, w: 40, h: 30, lx: 25.1, ly: 9.5 },
  { loc: 'farm',        name: 'Farmington',   short: 'Farmington',   purpose: 'Brooks Orchard and the farms. Help with the harvest.',   live: true, cx: 19.0, cy: 41.0, w: 34, h: 26, lx: 19.8, ly: 33.5 },
  { loc: 'pineridge',   name: 'Woodbury',     short: 'Woodbury',     purpose: 'Big homes among the trees, and the trail behind them.',  live: true, cx: 75.0, cy: 13.0, w: 28, h: 26, lx: 74.4, ly: 7.0 },
  { loc: 'park',        name: 'Grove Park',   short: 'Grove Park',   purpose: 'Where the whole town gathers for festivals.',            live: true, cx: 51.0, cy: 73.0, w: 24, h: 26, lx: 51.4, ly: 63.5 },
  { loc: 'academy',     name: 'Bloomington',  short: 'Bloomington',  purpose: 'Maple Academy, the school fields and the mall.',         live: true, cx: 15.0, cy: 71.0, w: 32, h: 30, lx: 11.6, ly: 60.0 },
  { loc: 'county',      name: 'Eagan',        short: 'Eagan',        purpose: 'The fairgrounds, spin the wheel, win big.',              live: true, cx: 89.0, cy: 30.0, w: 22, h: 22, lx: 93.9, ly: 25.5 },
  { loc: 'applevalley', name: 'Apple Valley', short: 'Apple Valley', purpose: 'The pond and the stone bridge. Skip stones, feed ducks.', live: true, cx: 84.0, cy: 54.0, w: 26, h: 22, lx: 84.8, ly: 53.5 },
];

export const districtByLoc = (loc: MGLocation) => DISTRICTS.find((d) => d.loc === loc);

export const PLACE_NAMES: Record<MGLocation, string> = {
  map: 'Town Map', town: 'Downtown', house: 'My House', neighbor: "Gram's House", furniture: 'Maple Furniture',
  maplemart: 'Maple Mart', threads: 'Threads Boutique', arcade: 'The Arcade', cafe: 'Maple Grove Café',
  townhall: 'Town Hall', gazette: 'Gazette Office', postoffice: 'Post Office', bank: 'Maple Bank', applevalley: 'Apple Valley', park: 'Grove Park', academy: 'Bloomington',
  oakwood: 'Rosemount', pineridge: 'Woodbury', riverside: 'Lakeville', farm: 'Farmington', county: 'Eagan',
};
