import type { AppId } from './registry';
import type { IconName } from './icons';
import { WORLDS } from './worlds';

export interface DesktopItem {
  col?: number;
  id: string;
  label: string;
  icon: IconName;
  shortcut?: boolean;
  appId: AppId;
  title?: string;
  props?: Record<string, unknown>;
}

export const DESKTOP_ITEMS: DesktopItem[] = [
  { id: 'mydocs', col: 0,  label: 'My Documents', icon: 'docs',     appId: 'mydocs' },
  { id: 'mypics', col: 0,  label: 'My Pictures',  icon: 'pictures', appId: 'mypics' },
  { id: 'notepad', col: 0, label: 'Notepad',      icon: 'notepad',  appId: 'notepad' },
  { id: 'browser', col: 0, label: 'WorldWindow',  icon: 'globe',    appId: 'browser', props: { url: 'home' } },
  { id: 'scribble', col: 0,label: 'Scribble',     icon: 'paint',    appId: 'scribble' },
  { id: 'recycle', col: 0, label: 'Recycle Bin',  icon: 'recycle',  appId: 'recycle' },
  { id: 'calculator', col: 1, label: 'Calculator', icon: 'calc',    appId: 'calculator' },
  { id: 'messenger', col: 1, label: 'Chatterbox', icon: 'chat',     appId: 'messenger' },
  { id: 'mail', col: 1,    label: 'WelcomeMail',  icon: 'mail',     appId: 'mail' },
  { id: 'calendar', col: 1, label: 'Calendar',   icon: 'calendar', appId: 'calendar' },
  { id: 'typeright', col: 1, label: 'TypeRight', icon: 'typing',   appId: 'typeright' },
  { id: 'solitaire', col: 1, label: 'Solitaire',  icon: 'cards',    appId: 'solitaire' },
  { id: 'pinball', col: 2,   label: 'Pinball',    icon: 'pinball',  appId: 'pinball' },
  { id: 'minefield', col: 2, label: 'Minefield',  icon: 'mine',     appId: 'minefield' },
  ...WORLDS.map((w) => ({
    id: 'world-' + w.slug,
    label: w.name,
    icon: w.icon,
    shortcut: false,
    appId: 'browser' as AppId,
    props: { url: w.url },
  })),
];
