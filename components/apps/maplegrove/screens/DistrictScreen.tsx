'use client';

import { useState } from 'react';
import { MG, MGButton, MGPanel, Coin, FONT_TITLE } from '../ui';
import {

      Scene, useToast } from '../SetPieces';
import { ResidentSprites, useTalk } from '../Residents';
import { Hotspot } from '../Backdrop';
import { useMaple, academicRank, type MGLocation } from '@/store/maplegrove';
import { currentSeason } from '@/lib/maplegrove/season';
import { byId } from '@/lib/maplegrove/catalog';
import { Furniture } from '../Furniture';

function WelcomePopup({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 40, background: 'rgba(15,20,40,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <MGPanel pad={14} style={{ background: MG.paper, width: 'min(440px, 92%)', position: 'relative' }}>
        <button onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: -10, right: -10, width: 26, height: 26, borderRadius: 5, border: `2px solid ${MG.blueDk}`, background: `linear-gradient(#ffe98a, ${MG.gold})`, color: MG.blueDk, fontWeight: 900, cursor: 'pointer', lineHeight: 1, fontSize: 15 }}>×</button>
        <div style={{ fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 18, color: MG.blue, textTransform: 'uppercase' }}>Welcome to Maple Grove</div>
        <div style={{ fontSize: 11, color: MG.sub, fontWeight: 700, marginBottom: 8 }}>a small town, big possibilities!</div>
        <div style={{ fontSize: 12, lineHeight: 1.5, color: MG.ink }}>
          <p style={{ margin: '0 0 6px' }}>This is Rosemount, your street. The yellow house is yours. Click things in every scene: doors, shops, shelves, and the neighbors themselves.</p>
          <p style={{ margin: '0 0 6px' }}>Earn <b>Maple Bucks</b> by playing at the Arcade, helping on the farm, fishing, taking a class or spinning the fair wheel. Spend them on furniture, groceries and new looks. Talk to residents to make friends; they send letters and gifts.</p>
          <p style={{ margin: 0 }}>The yellow <b>Map</b> button at the top left takes you anywhere. Your town resets when the computer shuts down, so make today count.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}><MGButton color="green" onClick={onClose}>Let me look around</MGButton></div>
      </MGPanel>
    </div>
  );
}

function Rosemount() {
  const introSeen = useMaple((s) => s.introSeen); const dismissIntro = useMaple((s) => s.dismissIntro);
  const goTo = useMaple((st) => st.goTo);
  const { talk, panel } = useTalk();
  return (
    <Scene bg="oakwood" title="Rosemount" playerX="41%" playerBottom="22%" playerSize={70}
      flavor="Your street. Click your house to go inside, or say hi to the neighbors."
      overlay={
        <div style={{ position: 'absolute', right: 8, top: 8, zIndex: 6 }}>
          <MGButton color="gold" style={{ fontSize: 12, padding: '3px 10px' }} onClick={() => goTo('town')}>Downtown &rarr;</MGButton>
        </div>
      }>
      <Hotspot x={4} y={19} w={23} h={38} label="My House" sub="click to go inside" onClick={() => goTo('house')} labelAt="bottom" />
      <Hotspot x={32} y={27} w={20} h={24} label="Neighbors" sub="the blue house - Gram's" onClick={() => goTo('neighbor')} labelAt="bottom" />
      <ResidentSprites loc="oakwood" bottom="22%" size={66} onTalk={talk} />
      {!introSeen && <WelcomePopup onClose={dismissIntro} />}
      {panel}
    </Scene>
  );
}

function GrovePark() {
  const s = currentSeason();
  const { talk, panel } = useTalk();
  const { flash, node } = useToast();
  const makeWish = useMaple((st) => st.makeWish);
  const buyEvent = useMaple((st) => st.buyEventItem);
  const bucks = useMaple((st) => st.bucks);
  const [stall, setStall] = useState(false);
  const item = byId(s.stall.itemId)!;

  const wish = () => {
    const r = makeWish();
    flash(r.ok ? `You tossed a coin in… and found ${r.bucks} Maple Bucks by the rim. Lucky.` : 'You already made a wish. Give the fountain a minute.');
  };

  return (
    <Scene bg="park" title="Grove Park" playerX="30%" playerBottom="14%" playerSize={70}
      flavor={`${s.name} - ${s.tagline}`}>
      <Hotspot x={41} y={38} w={19} h={22} label="Fountain" sub="make a wish" onClick={wish} />
      <Hotspot x={68} y={20} w={21} h={30} label={`${s.name} Stall`} sub="in the gazebo" onClick={() => setStall((v) => !v)} />
      {stall && (
        <div style={{ position: 'absolute', right: 12, top: 60, zIndex: 8, width: 230 }}>
          <MGPanel pad={10} style={{ background: 'rgba(255,250,240,0.97)' }}>
            <div style={{ fontWeight: 800, color: MG.purple, fontSize: 13 }}>{s.name} Stall</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '8px 0' }}>
              <Furniture item={item} w={56} h={56} />
              <div style={{ fontSize: 12 }}>
                <b>{item.name}</b><div style={{ color: MG.sub }}>{s.stall.blurb}</div>
                <div style={{ fontWeight: 800, color: '#5a4710', marginTop: 4 }}><Coin size={13} /> {item.price}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <MGButton color={bucks >= item.price ? 'green' : 'plain'} disabled={bucks < item.price} style={{ fontSize: 12, padding: '5px 12px', flex: 1 }}
                onClick={() => { if (buyEvent(item.id)) flash(`Bought a ${item.name}! It's in your house inventory.`); }}>Buy</MGButton>
              <MGButton color="plain" style={{ fontSize: 12, padding: '5px 10px' }} onClick={() => setStall(false)}>Close</MGButton>
            </div>
            <div style={{ fontSize: 10, color: MG.sub, marginTop: 6 }}>Event only. Gone when the season turns.</div>
            <div style={{ borderTop: `1px dashed ${MG.panelEdge}`, marginTop: 8, paddingTop: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: MG.purple, marginBottom: 4 }}>▸ Also at the stall</div>
              {[{ id: 'g_cider', name: 'Apple Cider', price: 14 }, { id: 'g_fudge', name: 'Maple Fudge', price: 18 }].map((g) => (
                <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, marginBottom: 3 }}>
                  <span style={{ flex: 1 }}>{g.name}</span><Coin size={11} /> {g.price}
                  <MGButton color={bucks >= g.price ? 'green' : 'plain'} disabled={bucks < g.price} style={{ fontSize: 10, padding: '2px 8px' }} onClick={() => { if (useMaple.getState().buyGrocery(g.id)) flash(`${g.name} added to your pantry.`); }}>Buy</MGButton>
                </div>
              ))}
            </div>
          </MGPanel>
        </div>
      )}
      <ResidentSprites loc="park" bottom="14%" size={66} onTalk={talk} />
      {node}
      {panel}
    </Scene>
  );
}

type Q = { q: string; a: string; opts: string[] };
function mathQ(): Q {
  const a = 3 + Math.floor(Math.random() * 12), b = 2 + Math.floor(Math.random() * 12);
  const ops = [['+', a + b], ['−', a - b], ['×', a * b]] as const;
  const [sym, ans] = ops[Math.floor(Math.random() * 3)];
  const wrong = new Set<number>(); while (wrong.size < 3) { const w = ans + (Math.floor(Math.random() * 11) - 5); if (w !== ans) wrong.add(w); }
  return { q: `${a} ${sym} ${b} = ?`, a: String(ans), opts: [String(ans), ...[...wrong].map(String)].sort(() => Math.random() - 0.5) };
}
const SCIENCE: Q[] = [
  { q: 'What do plants need from the sun to make food?', a: 'Light', opts: ['Light', 'Sand', 'Salt', 'Sound'] },
  { q: 'Water boils at how many degrees Celsius?', a: '100', opts: ['100', '50', '212', '0'] },
  { q: 'How many legs does a spider have?', a: '8', opts: ['8', '6', '4', '10'] },
  { q: 'The closest star to Earth is…', a: 'The Sun', opts: ['The Sun', 'Polaris', 'The Moon', 'Mars'] },
  { q: 'Ice is water in what state?', a: 'Solid', opts: ['Solid', 'Liquid', 'Gas', 'Plasma'] },
  { q: 'Which gas do people breathe out?', a: 'Carbon dioxide', opts: ['Carbon dioxide', 'Oxygen', 'Helium', 'Neon'] },
  { q: 'Which planet is known as the Red Planet?', a: 'Mars', opts: ['Mars', 'Venus', 'Jupiter', 'Saturn'] },
  { q: 'What is the largest organ of the human body?', a: 'Skin', opts: ['Skin', 'Heart', 'Liver', 'Brain'] },
];
const HISTORY: Q[] = [
  { q: 'Who was the first President of the United States?', a: 'George Washington', opts: ['George Washington', 'Abraham Lincoln', 'Thomas Jefferson', 'John Adams'] },
  { q: 'In what year did the United States declare independence?', a: '1776', opts: ['1776', '1812', '1620', '1865'] },
  { q: 'The pyramids of Giza are in which country?', a: 'Egypt', opts: ['Egypt', 'Greece', 'Mexico', 'India'] },
  { q: 'Who was the first person to walk on the Moon?', a: 'Neil Armstrong', opts: ['Neil Armstrong', 'Buzz Aldrin', 'John Glenn', 'Sally Ride'] },
  { q: 'Which ship sank in 1912 after hitting an iceberg?', a: 'Titanic', opts: ['Titanic', 'Mayflower', 'Lusitania', 'Santa Maria'] },
  { q: 'The Great Wall is in which country?', a: 'China', opts: ['China', 'Japan', 'Korea', 'Mongolia'] },
];
const EASTER_EGG: Q = { q: 'Who created Welcome Back?', a: 'Molly Curtis', opts: ['Dennis Hartwell', 'Priya Nandakumar', 'Molly Curtis', 'Owen Blackwood'] };
type ClassName = 'Math' | 'Science' | 'History';

function Academy() {
  const { talk, panel } = useTalk();
  const academics = useMaple((st) => st.academics);
  const passClass = useMaple((st) => st.passClass); const dailies = useMaple((st) => st.dailies); const doDaily = useMaple((st) => st.doDaily);
  const today = (() => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; })();
  const taken = (c: string) => dailies[`class_${c}`] === today;
  const [cls, setCls] = useState<ClassName | null>(null);
  const [qs, setQs] = useState<Q[]>([]);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState<{ bucks: number; rank: string; rankedUp: boolean } | null>(null);
  const [open, setOpen] = useState(false);

  const start = (c: ClassName) => {
    useMaple.getState().recordActivity('class');
    const pool = c === 'Math' ? Array.from({ length: 5 }, mathQ) : c === 'Science' ? [...SCIENCE].sort(() => Math.random() - 0.5).slice(0, 5) : [...[...HISTORY].sort(() => Math.random() - 0.5).slice(0, 4), EASTER_EGG];
    setCls(c); setQs(pool); setI(0); setScore(0); setDone(null);
  };
  const answer = (o: string) => {
    const sc = score + (o === qs[i].a ? 1 : 0);
    setScore(sc);
    if (i + 1 >= qs.length) { doDaily(`class_${cls!}`); setDone(passClass(cls!, sc)); }
    else setI(i + 1);
  };

  return (
    <Scene bg="academy" title="Bloomington" playerX="38%" playerBottom="18%" playerSize={70}
      flavor={`Attendance optional. Curiosity not. You are ${academicRank(academics)}${academics ? ` (${academics} classes)` : ''}.`}>
      <Hotspot x={44} y={44} w={12} h={22} label="Front doors" sub="go to class" onClick={() => setOpen((o) => !o)} />
      <ResidentSprites loc="academy" bottom="18%" size={66} onTalk={talk} />

      {open && (
      <div style={{ position: 'absolute', left: '50%', top: 48, transform: 'translateX(-50%)', zIndex: 8, width: 'min(300px, 92%)' }}>
        <MGPanel pad={10} style={{ background: 'rgba(255,250,240,0.97)' }}>
          {!cls ? (
            <>
              <div style={{ fontWeight: 800, color: MG.purple, fontSize: 13, marginBottom: 6 }}>Today&apos;s classes</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <MGButton color="purple" style={{ fontSize: 12, padding: '5px 10px' }} disabled={taken('Math')} onClick={() => start('Math')}>{taken('Math') ? 'Math, done today' : 'Math, quick problems'}</MGButton>
                <MGButton color="green" style={{ fontSize: 12, padding: '5px 10px' }} disabled={taken('Science')} onClick={() => start('Science')}>{taken('Science') ? 'Science, done today' : 'Science, the fun kind'}</MGButton>
                <MGButton color="gold" style={{ fontSize: 12, padding: '5px 10px' }} disabled={taken('History')} onClick={() => start('History')}>{taken('History') ? 'History, done today' : 'History, the easy stuff'}</MGButton>
              </div>
              <div style={{ fontSize: 10, color: MG.sub, marginTop: 6 }}>5 questions. Earn Maple Bucks. Every class counts toward your rank.</div>
              <MGButton color="plain" style={{ fontSize: 11, padding: '3px 8px', marginTop: 6 }} onClick={() => setOpen(false)}>Close</MGButton>
            </>
          ) : done ? (
            <>
              <div style={{ fontWeight: 800, color: MG.purple, fontSize: 13 }}>{cls}: {score}/5</div>
              <div style={{ fontSize: 12, margin: '6px 0' }}>You earned <b><Coin size={12} /> {done.bucks}</b>.{done.rankedUp && <><br /><b style={{ color: MG.greenDk }}>Rank up: {done.rank}!</b></>}</div>
              <MGButton color="plain" style={{ fontSize: 12, padding: '5px 10px' }} onClick={() => setCls(null)}>Back to classes</MGButton>
            </>
          ) : (
            <>
              <div style={{ fontSize: 11, color: MG.sub, fontWeight: 700 }}>{cls} · Question {i + 1} of {qs.length}</div>
              <div style={{ fontWeight: 800, fontSize: 14, margin: '6px 0 8px', color: MG.ink }}>{qs[i].q}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 6 }}>
                {qs[i].opts.map((o) => <MGButton key={o} color="plain" style={{ fontSize: 12, padding: '5px 6px', whiteSpace: 'normal', minWidth: 0, lineHeight: 1.2 }} onClick={() => answer(o)}>{o}</MGButton>)}
              </div>
            </>
          )}
        </MGPanel>
      </div>
      )}
      {panel}
    </Scene>
  );
}

import { Lakeville, Farm, PineRidge, County, AppleValley } from './Outskirts';

export function DistrictScreen({ loc }: { loc: MGLocation }) {
  switch (loc) {
    case 'oakwood': return <Rosemount />;
    case 'park': return <GrovePark />;
    case 'academy': return <Academy />;
    case 'riverside': return <Lakeville />;
    case 'farm': return <Farm />;
    case 'pineridge': return <PineRidge />;
    case 'county': return <County />;
    case 'applevalley': return <AppleValley />;
    default: return <Rosemount />;
  }
}
