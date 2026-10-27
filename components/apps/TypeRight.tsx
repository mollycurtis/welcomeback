'use client';

import { useEffect, useRef, useState } from 'react';
import type { AppWindowProps } from '@/lib/registry';
import { sounds } from '@/lib/sounds';

const PASSAGES = [
  'The quick brown fox jumps over the lazy dog. This sentence uses every letter in the alphabet, which is why typing programs love it.',
  'Summer starts on the last day of school. The bus drops you off and the whole afternoon is yours and nobody has told you what to do with it yet.',
  'Grandma types with one finger and reads every word out loud before she sends it. It takes her ten minutes to say hello. It is worth the wait.',
  'The morning glories on the trellis open before the bus comes. If you leave the house two minutes early you can count them. Blue ones first.',
  'A lemonade stand needs three things: a big sign, the corner by the stop sign, and somebody willing to sit there for two hours. Twenty five cents a cup.',
  'The best part of the block party is when it gets dark enough for the movie and everyone drags their lawn chairs into the street.',
  'Nobody in this house can agree on a movie, a plate, or whose turn it is on the computer. The computer one is the only fight that matters.',
  'Halloween decorations go up on the first of October with the windows open and the music turned up, whether or not anyone else is ready.',
  'Farkle is a dice game and Dad has never once let anyone win. He says that is how you learn. The rest of the family says that is how you lose.',
  'The bus comes at seven forty. If you leave at seven thirty eight you can still make it, as long as you run and the driver is in a good mood.',
  'There is one rule about the computer in this house and it is written on a sticky note on the monitor. Do not install anything. Dad means it.',
  'A t-ball coach needs a hat, a whistle, a clipboard he never writes on, and the patience to explain for the fifth time which way to run.',
];

export default function TypeRight({}: AppWindowProps) {
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [start, setStart] = useState<number | null>(null);
  const [done, setDone] = useState<{ wpm: number; acc: number; secs: number } | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const target = PASSAGES[idx];

  useEffect(() => { inputRef.current?.focus(); }, [idx]);
  useEffect(() => {
    if (start === null || done) return;
    const t = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(t);
  }, [start, done]);

  const onChange = (v: string) => {
    if (done) return;
    if (start === null && v.length > 0) setStart(Date.now());
    if (v.length > typed.length) sounds.thock();
    setTyped(v);
    if (v.length >= target.length) finish(v);
  };

  const finish = (v: string) => {
    const secs = Math.max(1, (Date.now() - (start ?? Date.now())) / 1000);
    let correct = 0;
    for (let i = 0; i < target.length; i++) if (v[i] === target[i]) correct++;
    const acc = Math.round((correct / target.length) * 100);
    const wpm = Math.round(((target.length / 5) / (secs / 60)) * (acc / 100));
    setDone({ wpm, acc, secs: Math.round(secs) });
    setBest((b) => (b === null || wpm > b ? wpm : b));
    sounds.ding();
  };

  const reset = (nextIdx = idx) => { setIdx(nextIdx); setTyped(''); setStart(null); setDone(null); setNow(0); };
  const elapsed = start && !done ? Math.round((now - start) / 1000) : done?.secs ?? 0;
  const liveWpm = start && !done && now > start ? Math.round(((typed.length / 5) / ((now - start) / 60000))) : 0;

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#d4d0c8', padding: 10, display: 'flex', flexDirection: 'column', gap: 8, fontFamily: 'Tahoma, Verdana, sans-serif' }}>
      <div style={{ display: 'flex', gap: 14, fontSize: 11, alignItems: 'center' }}>
        <span><b>Time</b> {elapsed}s</span>
        <span><b>WPM</b> {done ? done.wpm : liveWpm}</span>
        {done && <span><b>Accuracy</b> {done.acc}%</span>}
        <span style={{ flex: 1 }} />
        <span><b>Best</b> {best ?? '\u2014'}</span>
      </div>

      <div style={{ background: '#fff', border: '2px inset #e8e8e2', padding: '10px 12px', fontFamily: '"Courier New", monospace', fontSize: 14, lineHeight: 1.7, minHeight: 96, userSelect: 'none' }}>
        {target.split('').map((ch, i) => {
          const t = typed[i];
          const color = t === undefined ? '#000' : t === ch ? '#2a7a34' : '#c0392b';
          const bg = i === typed.length && !done ? '#ffe9a8' : t !== undefined && t !== ch ? '#ffd6d6' : 'transparent';
          return <span key={i} style={{ color, background: bg }}>{ch}</span>;
        })}
      </div>

      <input ref={inputRef} autoFocus value={typed} onChange={(e) => onChange(e.target.value)} disabled={!!done}
        onMouseDown={(e) => e.stopPropagation()} onPaste={(e) => e.preventDefault()}
        placeholder={done ? '' : 'Start typing here'}
        style={{ border: '2px inset #e8e8e2', padding: '6px 8px', fontFamily: '"Courier New", monospace', fontSize: 14, background: done ? '#eee' : '#fff' }} />

      {done && (
        <div style={{ background: '#fff8dc', border: '2px outset #f2f2ec', padding: '8px 12px', fontSize: 12, textAlign: 'center' }}>
          <b>{done.wpm} words per minute</b> at {done.acc}% accuracy in {done.secs} {done.secs === 1 ? 'second' : 'seconds'}.
          {done.wpm >= 60 ? ' You could type for a living.' : done.wpm >= 40 ? ' Faster than most grown ups.' : done.wpm >= 25 ? ' Not bad. Try again.' : ' Look at the keys less.'}
        </div>
      )}

      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
        <button onClick={() => { sounds.click(); reset(idx); }}
          style={{ background: '#d8d8d0', border: '2px outset #f2f2ec', padding: '4px 14px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>Try again</button>
        <button onClick={() => { sounds.click(); reset((idx + 1) % PASSAGES.length); }}
          style={{ background: '#d8d8d0', border: '2px outset #f2f2ec', padding: '4px 14px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>Next passage</button>
      </div>
    </div>
  );
}
