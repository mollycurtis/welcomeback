'use client';
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';

const GREEN = '#9fe870';
const INK = '#d6d9df';
const SOFT = '#8a909c';

function Title() {
  return (
    <p className="font-bios tracking-widest" style={{ color: GREEN, fontSize: 30, lineHeight: 1, textShadow: '0 0 12px rgba(159,232,112,0.35)' }}>
      WELCOME BACK
    </p>
  );
}

const FEATURES: { img: string; name: string; line: string }[] = [
  { img: '/mobile/maplegrove.jpg', name: 'Maple Grove', line: 'Move into a little town. Decorate your house, shop on Main Street and win tickets at the arcade.' },
  { img: '/mobile/ifind.jpg', name: 'iFind', line: 'Hidden object rooms against the clock. Six rooms, fifty-eight things to find.' },
  { img: '/mobile/finn.jpg', name: 'Finn the Fish', line: 'A point and click mystery under the sea. The Moon Pearls are missing and somebody has to find them.' },
  { img: '/mobile/desktop.jpg', name: 'The rest of the computer', line: 'Solitaire, Pinball, Minefield, Scribble, a typing game, a 2009 internet and a whole family\u2019s worth of files.' },
];

function Phone() {
  const [sent, setSent] = useState<null | 'copied' | 'show'>(null);
  const url = typeof window === 'undefined' ? '' : window.location.origin + '/';

  const send = async () => {
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    if (nav.share) {
      try { await nav.share({ title: 'Welcome Back', text: 'Play this on a computer:', url }); } catch { }
      return;
    }
    try { await navigator.clipboard.writeText(url); setSent('copied'); } catch { setSent('show'); }
  };

  return (
    <div className="fixed inset-0 overflow-y-auto" style={{ background: '#0b0c12', color: INK }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '34px 22px 40px' }}>
        <Title />
        <h1 className="font-bios" style={{ fontSize: 25, lineHeight: 1.15, marginTop: 14, color: '#fff' }}>
          The family computer is still on.
        </h1>
        <p className="font-bios" style={{ fontSize: 19, lineHeight: 1.3, marginTop: 10 }}>
          It&apos;s June 2009 and everything is exactly where it was left: old Chatterbox conversations, a calendar full of piano lessons, a My Documents folder nobody ever cleaned out, and the games everyone played after school.
        </p>

        <img src="/mobile/hero.jpg" alt="The family computer on its desk, switched on" style={{ width: '100%', marginTop: 20, borderRadius: 6, border: '1px solid #2a2e38', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />

        <div style={{ marginTop: 26, display: 'grid', gap: 18 }}>
          {FEATURES.map((f) => (
            <div key={f.name}>
              <img src={f.img} alt={f.name} loading="lazy" style={{ width: '100%', borderRadius: 6, border: '1px solid #2a2e38' }} />
              <p className="font-bios" style={{ fontSize: 22, color: '#fff', marginTop: 8 }}>{f.name}</p>
              <p className="font-bios" style={{ fontSize: 18, lineHeight: 1.25, color: INK }}>{f.line}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 30, padding: '18px 16px', border: '2px solid #2f3a26', borderRadius: 8, background: '#11160d', textAlign: 'center' }}>
          <p className="font-bios" style={{ fontSize: 23, color: GREEN }}>It needs a real computer.</p>
          <p className="font-bios" style={{ fontSize: 18, lineHeight: 1.25, marginTop: 6 }}>
            Open this page on a laptop or desktop to play. On a tablet, turn it sideways.
          </p>
          <button onClick={() => void send()} className="font-bios"
            style={{ marginTop: 14, fontSize: 20, padding: '9px 18px', borderRadius: 6, border: '2px solid ' + GREEN, background: 'transparent', color: GREEN, cursor: 'pointer' }}>
            Send myself the link
          </button>
          {sent === 'copied' && <p className="font-bios" style={{ fontSize: 17, marginTop: 8, color: SOFT }}>Link copied. Paste it into a text or an email to yourself.</p>}
          {sent === 'show' && <p className="font-bios" style={{ fontSize: 17, marginTop: 8, color: SOFT, wordBreak: 'break-all' }}>{url}</p>}
        </div>
      </div>
    </div>
  );
}

function Rotate() {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-8" style={{ background: '#0b0c12', color: INK }}>
      <div className="text-center" style={{ maxWidth: 420 }}>
        <Title />
        <div className="wb-rotate" aria-hidden="true" style={{ width: 54, height: 78, margin: '34px auto 30px', border: '3px solid ' + INK, borderRadius: 9, position: 'relative' }}>
          <span style={{ position: 'absolute', left: '50%', bottom: 5, width: 8, height: 8, marginLeft: -4, borderRadius: '50%', background: INK }} />
        </div>
        <p className="font-bios" style={{ fontSize: 24, color: '#fff' }}>Turn your tablet sideways to play.</p>
        <p className="font-bios" style={{ fontSize: 18, marginTop: 10, color: SOFT }}>There&apos;s a whole computer in here. It needs the long way around.</p>
      </div>
    </div>
  );
}

function TooSmall() {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-8" style={{ background: '#0b0c12', color: INK }}>
      <div className="text-center" style={{ maxWidth: 440 }}>
        <Title />
        <p className="font-bios" style={{ fontSize: 24, color: '#fff', marginTop: 22 }}>This screen is too small for Welcome Back.</p>
        <p className="font-bios" style={{ fontSize: 19, marginTop: 10, color: SOFT }}>Please play on a bigger screen, like a laptop or a desktop computer.</p>
      </div>
    </div>
  );
}

export default function SmallScreen({ kind }: { kind: 'phone' | 'rotate' | 'small' }) {
  if (kind === 'phone') return <Phone />;
  if (kind === 'rotate') return <Rotate />;
  return <TooSmall />;
}
