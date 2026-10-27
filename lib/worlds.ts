import type { IconName } from './icons';

export interface World {
  slug: string;
  url: string;
  name: string;
  tag: string;
  icon: IconName;
  accent: string;
}

export const WORLDS: World[] = [
  { slug: 'finn',      url: 'www.finnthefish.com',  name: 'Finn the Fish', tag: 'Dive in and explore.',          icon: 'finn',        accent: '#1f7a8c' },
  { slug: 'maple',     url: 'www.maplegrove.com',   name: 'Maple Grove',   tag: 'Your neighborhood is waiting.', icon: 'mapleGrove',  accent: '#4a9d4a' },
  { slug: 'ifind',     url: 'www.ifind.com',        name: 'iFind',         tag: 'Find the hidden things.',       icon: 'ifind',       accent: '#1f3a93' },
  { slug: 'petville',  url: 'www.petville.com',     name: 'Petville',      tag: 'Adopt a pet. Love a pet.',      icon: 'petville',    accent: '#2f6fd0' },
  { slug: 'penguin',   url: 'www.penguincove.com',  name: 'Penguin Cove',  tag: 'Waddle on in.',                 icon: 'penguinCove', accent: '#4aa3d8' },
];
