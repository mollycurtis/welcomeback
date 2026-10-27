import type { IconName } from './icons';

export type AppId =
  | 'notepad'
  | 'scribble'
  | 'browser'
  | 'mydocs'
  | 'mypics'
  | 'recycle'
  | 'solitaire'
  | 'minefield'
  | 'pinball'
  | 'display'
  | 'calculator'
  | 'mail'
  | 'messenger'
  | 'calendar'
  | 'about'
  | 'typeright';

export interface AppWindowProps {
  windowId: string;
  props?: Record<string, unknown>;
}

export interface AppMeta {
  id: AppId;
  title: string;
  icon: IconName;
  w: number;
  h: number;
  minW: number;
  minH: number;
  singleton?: boolean;
}

export const APPS: Record<AppId, AppMeta> = {
  notepad:   { id: 'notepad',   title: 'Notepad',            icon: 'notepad',  w: 480, h: 380, minW: 300, minH: 220 },
  scribble:  { id: 'scribble',  title: 'Scribble',           icon: 'paint',    w: 700, h: 540, minW: 560, minH: 440 },
  browser:   { id: 'browser',   title: 'WorldWindow',        icon: 'globe',    w: 740, h: 560, minW: 500, minH: 380 },
  mydocs:    { id: 'mydocs',    title: 'My Documents',       icon: 'docs',     w: 540, h: 400, minW: 380, minH: 280, singleton: true },
  mypics:    { id: 'mypics',    title: 'My Pictures',        icon: 'pictures', w: 600, h: 440, minW: 420, minH: 320, singleton: true },
  recycle:   { id: 'recycle',   title: 'Recycle Bin',        icon: 'recycle',  w: 500, h: 380, minW: 360, minH: 260, singleton: true },
  solitaire: { id: 'solitaire', title: 'Solitaire',          icon: 'cards',    w: 640, h: 540, minW: 600, minH: 480, singleton: true },
  minefield: { id: 'minefield', title: 'Minefield',          icon: 'mine',     w: 268, h: 376, minW: 268, minH: 376, singleton: true },
  pinball:   { id: 'pinball',   title: 'Pinball',            icon: 'pinball',  w: 540, h: 470, minW: 480, minH: 420, singleton: true },
  display:   { id: 'display',   title: 'Display Properties', icon: 'monitor',  w: 420, h: 430, minW: 400, minH: 400, singleton: true },
  calculator:{ id: 'calculator',title: 'Calculator',         icon: 'calc',     w: 260, h: 268, minW: 260, minH: 268, singleton: true },
  mail:      { id: 'mail',      title: 'WelcomeMail',        icon: 'mail',     w: 660, h: 460, minW: 520, minH: 340, singleton: true },
  messenger: { id: 'messenger', title: 'Chatterbox Messenger', icon: 'chat',   w: 560, h: 430, minW: 440, minH: 320, singleton: true },
  calendar:  { id: 'calendar',  title: 'Calendar',           icon: 'calendar', w: 520, h: 360, minW: 440, minH: 300, singleton: true },
  typeright: { id: 'typeright', title: 'TypeRight',          icon: 'typing',   w: 520, h: 330, minW: 440, minH: 300, singleton: true },
  about:     { id: 'about',     title: 'About This Computer',icon: 'monitor',  w: 400, h: 430, minW: 380, minH: 360, singleton: true },
};
