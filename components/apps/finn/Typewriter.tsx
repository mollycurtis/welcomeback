'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

export interface TypewriterHandle { typing: () => boolean; finish: () => void }

export const Typewriter = forwardRef<TypewriterHandle, {
  text: string;
  instant: boolean;
  hold?: boolean;
  cps?: number;
  onSyllable: (vowel: string, rise: number, loud: boolean) => void;
}>(function Typewriter({ text, instant, hold = false, cps = 30, onSyllable }, ref) {
  const [shown, setShown] = useState(instant ? text.length : 0);
  const shownRef = useRef(shown);
  shownRef.current = shown;
  const syl = useRef(onSyllable);
  syl.current = onSyllable;
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (hold) { setShown(0); return; }
    if (instant || !text) { setShown(text.length); return; }
    setShown(0);
    let i = 0, last = 0;
    const vowel = (ch?: string) => !!ch && /[aeiouy]/i.test(ch);
    const id = window.setInterval(() => {
      i = Math.min(text.length, i + 1);
      setShown(i);
      const now = performance.now();
      if (vowel(text[i - 1]) && !vowel(text[i - 2]) && now - last > 165) {
        last = now;
        const rest = text.slice(i);
        const stop = rest.search(/[.?!]/);
        const mark = stop >= 0 ? rest[stop] : '.';
        const nearEnd = stop >= 0 && stop < 7;
        const rise = mark === '?' ? (nearEnd ? 0.16 : 0.03) : mark === '!' ? 0.07 : (nearEnd ? -0.09 : 0);
        syl.current(text[i - 1], rise, mark === '!');
      }
      if (i >= text.length) { window.clearInterval(id); timer.current = null; }
    }, Math.max(8, Math.round(1000 / cps)));
    timer.current = id;
    return () => { window.clearInterval(id); timer.current = null; };
  }, [text, instant, hold, cps]);

  useImperativeHandle(ref, () => ({
    typing: () => shownRef.current < text.length,
    finish: () => {
      if (timer.current) { window.clearInterval(timer.current); timer.current = null; }
      shownRef.current = text.length;
      setShown(text.length);
    },
  }), [text]);

  return <>{text.slice(0, shown)}<span style={{ visibility: 'hidden' }}>{text.slice(shown)}</span></>;
});
