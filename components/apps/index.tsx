'use client';

import type { ComponentType } from 'react';
import type { AppId, AppWindowProps } from '@/lib/registry';
import Notepad from './Notepad';
import Scribble from './Scribble';
import WorldWindow from './WorldWindow';
import MyDocuments from './MyDocuments';
import MyPictures from './MyPictures';
import RecycleBin from './RecycleBin';
import Solitaire from './Solitaire';
import Minefield from './Minefield';
import Pinball from './Pinball';
import DisplayProperties from './DisplayProperties';
import Calculator from './Calculator';
import WelcomeMail from './WelcomeMail';
import Messenger from './Messenger';
import Calendar from './Calendar';
import AboutComputer from './AboutComputer';
import TypeRight from './TypeRight';

export const APP_COMPONENTS: Record<AppId, ComponentType<AppWindowProps>> = {
  notepad: Notepad,
  scribble: Scribble,
  browser: WorldWindow,
  mydocs: MyDocuments,
  mypics: MyPictures,
  recycle: RecycleBin,
  solitaire: Solitaire,
  minefield: Minefield,
  pinball: Pinball,
  display: DisplayProperties,
  calculator: Calculator,
  mail: WelcomeMail,
  messenger: Messenger,
  calendar: Calendar,
  about: AboutComputer,
  typeright: TypeRight,
};
