export type FlagId = string;

export interface Requires {
  flags?: FlagId[];
  notFlags?: FlagId[];
  items?: string[];
  notItems?: string[];
}

export interface Effects {
  say?: string[];
  glow?: string;
  game?: 'shells' | 'count' | 'quiz';
  setFlags?: FlagId[];
  clearFlags?: FlagId[];
  giveItems?: string[];
  takeItems?: string[];
  notebook?: string[];
  wonder?: string[];
  resolveWonder?: string[];
  goScene?: string;
  seaStar?: string;
  sound?: string;
}

export interface Hotspot {
  id: string;
  label: string;
  x: number; y: number; w: number; h: number;
  kind?: 'essential' | 'optional' | 'decorative';
  cursor?: CursorKind;
  autoUse?: boolean;
  requires?: Requires;
  onClick?: Effects;
  onUse?: Record<string, Effects & { requires?: Requires }>;
  refuse?: string[];
  repeat?: string[];
}

export interface Exit {
  id: string;
  label: string;
  to: string;
  x: number; y: number; w: number; h: number;
  dir?: 'left' | 'right' | 'up' | 'down' | 'in' | 'out';
  requires?: Requires;
  blocked?: string[];
}

export interface Scene {
  id: string;
  title: string;
  region: string;
  background: string;
  bgW: number;
  bgH: number;
  hotspots?: Hotspot[];
  exits?: Exit[];
  characters?: string[];
  onEnter?: Effects;
}

export interface DialogueNode {
  id: string;
  lines: string[];
  requires?: Requires;
  effects?: Effects;
  replies?: { text: string; to?: string; requires?: Requires; effects?: Effects }[];
}

export interface Character {
  id: string;
  name: string;
  sprite: string;
  spriteTalk?: string;
  spriteBefore?: { flag: string; sprite: string };
  look?: string;
  requires?: Requires;
  x: number; y: number; w: number; h: number;
  dialogue: DialogueNode[];
  onGive?: Record<string, Effects & { requires?: Requires }>;
  refuse?: string[];
}

export interface Item {
  id: string;
  name: string;
  icon: string;
  description: string;
  combine?: Record<string, { into: string; say?: string[] }>;
}

export interface NotebookEntry {
  id: string;
  title: string;
  lines: string[];
}

export interface Wonder {
  id: string;
  question: string;
  hints: [string, string, string];
}

export type CursorKind = 'point' | 'swim' | 'look' | 'take' | 'talk' | 'use';
