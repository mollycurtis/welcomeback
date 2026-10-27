'use client';

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { FN, FN_FONT } from './ui';
import { sounds } from '@/lib/sounds';
import { useFinn } from '@/store/finn';
import { itemById } from '@/lib/finn/content';

export type GameKind = 'shells' | 'count' | 'quiz';

const IMG = '/finn/minigames/';
const rand = (n: number) => Math.floor(Math.random() * n);
const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = rand(i + 1); [b[i], b[j]] = [b[j], b[i]]; } return b; };

function Stage({ bg, children }: { bg: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const fit = () => {
      const w = Math.min(el.clientWidth, el.clientHeight * 1.5);
      setSize({ w, h: w / 1.5 });
    };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(6,38,63,0.92)' }}>
      {size.w > 0 && (
        <div className="relative overflow-hidden" style={{ width: size.w, height: size.h, backgroundImage: bg ? `url(${bg})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center', fontSize: Math.max(12, size.w / 52) }}>
          {children}
        </div>
      )}
    </div>
  );
}

function Banner({ children }: { children: ReactNode }) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 text-center" style={{
      bottom: '4%', minWidth: '46%', maxWidth: '80%', padding: '0.5em 1.2em', borderRadius: 14,
      background: 'rgba(255,251,235,0.95)', color: FN.ink, fontFamily: FN_FONT, fontWeight: 700, fontSize: '1.05em',
      boxShadow: '0 4px 14px rgba(0,0,0,0.35)', zIndex: 5,
    }}>
      {children}
    </div>
  );
}

function Btn({ onClick, children, label }: { onClick: () => void; children: ReactNode; label?: string }) {
  return (
    <button aria-label={label} onClick={onClick} style={{
      fontFamily: FN_FONT, fontWeight: 700, fontSize: '0.95em', color: '#fff', background: FN.sea,
      border: '2px solid rgba(255,255,255,0.8)', borderRadius: 999, padding: '0.35em 1.1em', margin: '0.35em 0.3em 0',
      cursor: 'pointer', boxShadow: '0 3px 0 rgba(0,0,0,0.25)',
    }}>
      {children}
    </button>
  );
}

function Star({ size = '13%' }: { size?: string }) {
  return (
    <svg viewBox="0 0 100 100" className="mg-pop" style={{ width: size, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.35))' }} aria-hidden="true">
      <polygon points="50,6 61,38 95,38 67,58 78,92 50,72 22,92 33,58 5,38 39,38" fill="#ffcf3a" stroke="#e08a00" strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}

function WinCard({ first, again, onDone, text }: { first: boolean; again: () => void; onDone: () => void; text: string }) {
  const stars = useFinn((s) => s.seaStars.length);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={{ background: 'rgba(6,38,63,0.8)', zIndex: 6, fontFamily: FN_FONT }}>
      {first && <Star />}
      <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.9em', textShadow: '0 3px 0 rgba(0,0,0,0.35)', marginTop: '0.3em' }}>{text}</div>
      {first && <div style={{ color: '#ffe9a8', fontWeight: 700, fontSize: '1.2em', marginTop: '0.2em' }}>You won a sea star! You have {stars} of 3.</div>}
      <div style={{ marginTop: '0.6em' }}>
        <Btn onClick={again}>Play again</Btn>
        <Btn onClick={onDone}>All done</Btn>
      </div>
    </div>
  );
}

const SLOTS = [27, 50, 73];

function ShellGame({ onWin, onClose }: { onWin: () => boolean; onClose: () => void }) {
  const won = useFinn((s) => s.flags.includes('won-shells'));
  const [slot, setSlot] = useState([0, 1, 2]);
  const [pearl, setPearl] = useState(1);
  const [lifted, setLifted] = useState<number | null>(1);
  const [phase, setPhase] = useState<'ready' | 'shuffle' | 'pick' | 'miss' | 'win'>('ready');
  const [first, setFirst] = useState(false);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };

  const start = () => {
    sounds.finnPickup();
    setLifted(null); setPhase('shuffle');
    let order = [...slot];
    const swaps = 7;
    for (let i = 0; i < swaps; i++) {
      later(() => {
        const a = rand(3); let b = rand(3); if (b === a) b = (a + 1) % 3;
        const x = order.indexOf(a), y = order.indexOf(b);
        order = [...order]; order[x] = b; order[y] = a;
        setSlot(order);
      }, 500 + i * 480);
    }
    later(() => setPhase('pick'), 500 + swaps * 480 + 300);
  };
  const pick = (s: number) => {
    if (phase !== 'pick') return;
    setLifted(s);
    if (s === pearl) {
      sounds.finnDiscover();
      setFirst(onWin());
      later(() => setPhase('win'), 700);
    } else {
      sounds.finnNope();
      setPhase('miss');
      later(() => setLifted(pearl), 900);
    }
  };
  const again = () => { setSlot([0, 1, 2]); const p = rand(3); setPearl(p); setLifted(p); setPhase('ready'); setFirst(false); };
  const pearlIcon = itemById('pearl-moon')?.icon;

  return (
    <Stage bg={IMG + 'shells-bg.jpg'}>
      {[0, 1, 2].map((s) => (
        <div key={s}>
          {s === pearl && (
            <img src={pearlIcon} alt="" draggable={false} className="absolute" style={{
              width: '5%', left: `${SLOTS[slot[s]] - 2.5}%`, top: '57%', transition: 'left 0.42s ease-in-out', filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.6))',
            }} />
          )}
          <button aria-label="Shell" data-pearl={s === pearl ? 'yes' : 'no'} onClick={() => pick(s)} className="absolute" style={{
            width: '19%', left: `${SLOTS[slot[s]] - 9.5}%`, top: '47%', padding: 0, border: 0, background: 'none',
            transition: 'left 0.42s ease-in-out, transform 0.3s ease', transform: lifted === s ? 'translateY(-80%)' : 'none',
            cursor: phase === 'pick' ? 'pointer' : 'default', zIndex: 2,
          }}>
            <img src={IMG + 'shell.webp'} alt="" draggable={false} style={{ width: '100%', filter: 'drop-shadow(0 6px 6px rgba(60,30,10,0.35))' }} />
          </button>
        </div>
      ))}
      {phase === 'ready' && (
        <Banner>
          {won ? 'Watch the pearl. Can you find it again?' : 'Watch the pearl! Find it and win a sea star!'}
          <div><Btn onClick={start}>Ready!</Btn></div>
        </Banner>
      )}
      {phase === 'shuffle' && <Banner>Keep your eyes on the pearl...</Banner>}
      {phase === 'pick' && <Banner>Which shell has the pearl?</Banner>}
      {phase === 'miss' && <Banner>Oops! It was over there. <Btn onClick={again}>Try again</Btn></Banner>}
      {phase === 'win' && <WinCard first={first} again={again} onDone={onClose} text="You found it!" />}
    </Stage>
  );
}

const FISH = ['yellow', 'orange', 'purple', 'green'] as const;
type Fish = { c: (typeof FISH)[number]; x: number; y: number; flip: boolean; d: number };

function placeFish(colors: (typeof FISH)[number][]): Fish[] {
  const out: Fish[] = [];
  for (const c of colors) {
    let x = 0, y = 0;
    for (let tries = 0; tries < 200; tries++) {
      x = 10 + Math.random() * 72; y = 14 + Math.random() * 44;
      if (out.every((f) => Math.hypot(f.x - x, (f.y - y) * 1.5) > 14)) break;
    }
    out.push({ c, x, y, flip: Math.random() < 0.5, d: +(Math.random() * 1.5).toFixed(2) });
  }
  return out;
}

function makeRound(r: number): { fish: Fish[]; ask: string; answer: number } {
  if (r === 0) {
    const n = 2 + rand(3);
    return { fish: placeFish(Array(n).fill('yellow')), ask: 'How many fish do you see?', answer: n };
  }
  if (r === 1) {
    const n = 4 + rand(3);
    return { fish: placeFish(Array.from({ length: n }, () => FISH[rand(4)])), ask: 'How many fish do you see now?', answer: n };
  }
  const target = 2 + rand(3);
  const others = 3 + rand(3);
  const colors = shuffle([...Array(target).fill('purple'), ...Array.from({ length: others }, () => (['yellow', 'orange', 'green'] as const)[rand(3)])]);
  return { fish: placeFish(colors), ask: 'How many PURPLE fish do you see?', answer: target };
}

function CountGame({ onWin, onClose }: { onWin: () => boolean; onClose: () => void }) {
  const [round, setRound] = useState(0);
  const [data, setData] = useState(() => makeRound(0));
  const [msg, setMsg] = useState<'ask' | 'right' | 'wrong'>('ask');
  const [done, setDone] = useState(false);
  const [first, setFirst] = useState(false);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const answer = (n: number) => {
    if (msg === 'right' || done) return;
    if (n === data.answer) {
      sounds.finnDiscover(); setMsg('right');
      timers.current.push(window.setTimeout(() => {
        if (round === 2) { setFirst(onWin()); setDone(true); return; }
        setRound(round + 1); setData(makeRound(round + 1)); setMsg('ask');
      }, 1300));
    } else {
      sounds.finnNope(); setMsg('wrong');
    }
  };
  const again = () => { setRound(0); setData(makeRound(0)); setMsg('ask'); setDone(false); setFirst(false); };

  return (
    <Stage bg={IMG + 'count-bg.jpg'}>
      {data.fish.map((f, i) => (
        <img key={round + '-' + i} src={IMG + 'fish-' + f.c + '.webp'} alt="" draggable={false} data-fish={f.c} className="absolute mg-bob" style={{
          width: '11%', left: `${f.x}%`, top: `${f.y}%`, animationDelay: `-${f.d}s`, transform: f.flip ? 'scaleX(-1)' : undefined,
        }} />
      ))}
      <div className="absolute left-1/2 -translate-x-1/2 text-center" style={{ top: '3%', fontFamily: FN_FONT, fontWeight: 800, fontSize: '1.35em', color: '#fff', textShadow: '0 2px 0 rgba(0,0,0,0.4)', whiteSpace: 'nowrap' }}>
        {data.ask} <span style={{ opacity: 0.8, fontSize: '0.8em' }}>({round + 1} of 3)</span>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 flex" style={{ bottom: '17%', gap: '0.45em', zIndex: 4 }}>
        {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
          <button key={n} aria-label={'Number ' + n} data-answer={n === data.answer ? 'yes' : 'no'} onClick={() => answer(n)} style={{
            width: '2.3em', height: '2.3em', borderRadius: '50%', border: '3px solid #fff', background: 'rgba(31,122,140,0.92)', color: '#fff',
            fontFamily: FN_FONT, fontWeight: 800, fontSize: '1.15em', cursor: 'pointer', boxShadow: '0 3px 0 rgba(0,0,0,0.3)',
          }}>{n}</button>
        ))}
      </div>
      {msg === 'right' && !done && <Banner>Yes! That&rsquo;s right!</Banner>}
      {msg === 'wrong' && <Banner>Hmm, let&rsquo;s count again!</Banner>}
      {done && <WinCard first={first} again={again} onDone={onClose} text="Great counting!" />}
    </Stage>
  );
}

const CREATURES: { id: string; name: string; img: string; group?: string }[] = [
  { id: 'octopus', name: 'an octopus', img: '/finn/characters/marina-idle.png' },
  { id: 'turtle', name: 'a sea turtle', img: '/finn/characters/barnacle-idle.png' },
  { id: 'jellyfish', name: 'a jellyfish', img: '/finn/characters/jellyfish-idle.png' },
  { id: 'seahorse', name: 'a seahorse', img: IMG + 'seahorse.webp' },
  { id: 'crab', name: 'a crab', img: '/finn/characters/crab-foreman-idle.png', group: 'claws' },
  { id: 'starfish', name: 'a starfish', img: '/finn/characters/star-shop-idle.png' },
  { id: 'pufferfish', name: 'a pufferfish', img: '/finn/characters/bubbles-idle.png' },
  { id: 'eel', name: 'an eel', img: '/finn/characters/eel-idle.png' },
  { id: 'lobster', name: 'a lobster', img: '/finn/characters/lobster-grump-idle.png', group: 'claws' },
];

function makeQuiz() {
  return shuffle(CREATURES).slice(0, 5).map((q) => {
    const pool = shuffle(CREATURES.filter((c) => c.id !== q.id && !(q.group && c.group === q.group))).slice(0, 2);
    return { q, choices: shuffle([q, ...pool]) };
  });
}

function SeaQuiz({ onWin, onClose }: { onWin: () => boolean; onClose: () => void }) {
  const [quiz, setQuiz] = useState(makeQuiz);
  const [i, setI] = useState(0);
  const [msg, setMsg] = useState<'ask' | 'right' | 'wrong'>('ask');
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [first, setFirst] = useState(false);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const cur = quiz[i];

  const choose = (id: string) => {
    if (msg === 'right' || done) return;
    if (id === cur.q.id) {
      sounds.finnDiscover(); setMsg('right'); setWrongId(null);
      timers.current.push(window.setTimeout(() => {
        if (i === quiz.length - 1) { setFirst(onWin()); setDone(true); return; }
        setI(i + 1); setMsg('ask');
      }, 1300));
    } else {
      sounds.finnNope(); setMsg('wrong'); setWrongId(id);
      timers.current.push(window.setTimeout(() => setWrongId(null), 500));
    }
  };
  const again = () => { setQuiz(makeQuiz()); setI(0); setMsg('ask'); setDone(false); setFirst(false); };

  return (
    <Stage bg={IMG + 'quiz-bg.jpg'}>
      <div className="absolute text-center" style={{ left: '27%', width: '46%', top: '30%', fontFamily: FN_FONT, color: '#f4f4ee', fontWeight: 800, fontSize: '1.45em', textShadow: '0 0 6px rgba(255,255,255,0.25)' }}>
        Which one is {cur.q.name}?
        <div style={{ fontSize: '0.6em', opacity: 0.75, fontWeight: 600 }}>Question {i + 1} of {quiz.length}</div>
      </div>
      <div className="absolute flex justify-center items-end" style={{ left: '27%', width: '46%', top: '42%', height: '21%', gap: '4%' }}>
        {cur.choices.map((c) => (
          <button key={c.id} aria-label="Choice" data-correct={c.id === cur.q.id ? 'yes' : 'no'} onClick={() => choose(c.id)}
            className={wrongId === c.id ? 'mg-shake' : undefined} style={{
              width: '30%', height: '100%', padding: '2%', border: '3px dashed rgba(255,255,255,0.35)', borderRadius: 14,
              background: msg === 'right' && c.id === cur.q.id ? 'rgba(255,230,120,0.35)' : 'rgba(255,255,255,0.06)', cursor: 'pointer',
            }}>
            <img src={c.img} alt="" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </button>
        ))}
      </div>
      {msg === 'right' && !done && <Banner>Yes! That&rsquo;s {cur.q.name}!</Banner>}
      {msg === 'wrong' && <Banner>Not quite! Try again!</Banner>}
      {done && <WinCard first={first} again={again} onDone={onClose} text="You aced the quiz!" />}
    </Stage>
  );
}

const TITLES: Record<GameKind, string> = {
  shells: 'Coco and Bibi\u2019s Shell Game',
  count: 'Kelp\u2019s Fish Count',
  quiz: 'Professor Bubble\u2019s Sea Quiz',
};

const ENTER_BUBBLES = Array.from({ length: 24 }, (_, i) => ({
  x: (i * 37 + 11) % 96 + 2, s: 10 + ((i * 13) % 26), delay: ((i * 7) % 10) * 0.045, dur: 0.85 + ((i * 5) % 6) * 0.08,
}));

export function MiniGame({ kind, onWin, onClose }: { kind: GameKind; onWin: () => boolean; onClose: () => void }) {
  const [entering, setEntering] = useState(true);
  useEffect(() => { const t = window.setTimeout(() => setEntering(false), 1500); return () => window.clearTimeout(t); }, []);
  return (
    <div className="absolute inset-0" style={{ zIndex: 300 }}>
      <div className="absolute inset-0 mg-enter">
        {kind === 'shells' && <ShellGame onWin={onWin} onClose={onClose} />}
        {kind === 'count' && <CountGame onWin={onWin} onClose={onClose} />}
        {kind === 'quiz' && <SeaQuiz onWin={onWin} onClose={onClose} />}
      </div>
      {entering && (
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 9 }}>
          <div className="absolute inset-0 mg-wash" style={{ background: 'linear-gradient(to top, rgba(10,70,110,0.85), rgba(20,110,160,0.6))' }} />
          {ENTER_BUBBLES.map((b, i) => (
            <span key={i} className="mg-rise" style={{ left: b.x + '%', width: b.s, height: b.s, animationDelay: b.delay + 's', animationDuration: b.dur + 's' }} />
          ))}
        </div>
      )}
      <div className="absolute flex items-center justify-between" style={{ left: 10, right: 10, top: 8, zIndex: 8, pointerEvents: 'none' }}>
        <span style={{ fontFamily: FN_FONT, fontWeight: 800, fontSize: 14, color: FN.ink, background: 'rgba(255,251,235,0.95)', padding: '4px 12px', borderRadius: 999 }}>{TITLES[kind]}</span>
        <button aria-label="Close game" onClick={onClose} style={{ pointerEvents: 'auto', width: 30, height: 30, borderRadius: '50%', border: '2px solid #fff', background: 'rgba(6,38,63,0.85)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>&times;</button>
      </div>
    </div>
  );
}

const MAP_SPOTS = [
  { flag: 'got-pearl-garden', pearl: 'pearl-garden', place: 'Flower Garden', x: 67.7, y: 35 },
  { flag: 'got-pearl-ruby', pearl: 'pearl-ruby', place: 'Hidden Grotto', x: 84.5, y: 26 },
  { flag: 'got-pearl-moon', pearl: 'pearl-moon', place: 'Pearl Shrine', x: 66, y: 54 },
  { flag: 'got-pearl-ocean', pearl: 'pearl-ocean', place: 'The Sunken Ship', x: 45, y: 70 },
  { flag: 'got-pearl-sun', pearl: 'pearl-sun', place: 'Treasure Room', x: 38.6, y: 84.5 },
];

export function PaintedMap({ onClose }: { onClose: () => void }) {
  const flags = useFinn((s) => s.flags);
  return (
    <div className="absolute inset-0" style={{ zIndex: 300 }}>
      <Stage bg="">
        <img src={IMG + 'map.webp'} alt="The Professor's map" draggable={false} className="absolute inset-0 w-full h-full" />
        {MAP_SPOTS.map((m) => {
          const got = flags.includes(m.flag);
          return (
            <div key={m.flag} className="absolute flex flex-col items-center" style={{ left: `${m.x}%`, top: `${m.y}%`, transform: 'translate(-50%, -50%)' }}>
              <img src={itemById(m.pearl)?.icon} alt="" draggable={false} className={got ? undefined : 'mg-bob'} style={{ width: '2.6em', opacity: got ? 0.55 : 1, filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.95))' }} />
              <span style={{
                fontFamily: FN_FONT, fontWeight: 800, fontSize: '0.8em', whiteSpace: 'nowrap', color: FN.ink, background: 'rgba(255,251,235,0.95)',
                padding: '1px 8px', borderRadius: 999, marginTop: 2, textDecoration: got ? 'line-through' : 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}>
                {got ? '\u2713 ' : ''}{m.place}
              </span>
            </div>
          );
        })}
        <div className="absolute left-1/2 -translate-x-1/2 text-center" style={{
          top: '1.5%', fontFamily: FN_FONT, fontWeight: 800, fontSize: '1.05em', color: FN.ink, background: 'rgba(255,251,235,0.95)',
          padding: '0.3em 1em', borderRadius: 999, boxShadow: '0 2px 6px rgba(0,0,0,0.3)', whiteSpace: 'nowrap',
        }}>
          The Professor&rsquo;s Map: the pearls are where the water slows down!
        </div>
      </Stage>
      <button aria-label="Close map" onClick={onClose} className="absolute" style={{ right: 10, top: 8, zIndex: 8, width: 30, height: 30, borderRadius: '50%', border: '2px solid #fff', background: 'rgba(6,38,63,0.85)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>&times;</button>
    </div>
  );
}
