'use client';
/* eslint-disable @next/next/no-img-element */

import { useState, type ReactNode } from 'react';
import { MG, MGButton, MGPanel } from './ui';
import { Avatar } from './Avatar';
import { useMaple, type MGLocation, type TalkResult } from '@/store/maplegrove';
import { spot, CHAR_Z } from '@/lib/maplegrove/placement';
import { residentsAt, residentById, tierFor, type Resident } from '@/lib/maplegrove/npcs';
import { currentSeason } from '@/lib/maplegrove/season';
import { CHATS } from '@/lib/maplegrove/chats';
import { GROCERIES } from '@/lib/maplegrove/collectibles';

export function Hearts({ n, size = 12 }: { n: number; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1 }} title={`${n} / 5 hearts`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ fontSize: size, lineHeight: 1, color: i < n ? '#e34848' : '#d9cce8' }}>♥</span>
      ))}
    </span>
  );
}

export function ResidentSprites({ loc, bottom = '10%', size = 78, onTalk, zIndex = 4 }: { loc: MGLocation; bottom?: string; size?: number; onTalk: (r: Resident) => void; zIndex?: number }) {
  const talkedTo = useMaple((s) => s.talkedTo);
  return (
    <>
      {residentsAt(loc).slice(0, 1).map((r) => {
        const sp = spot(loc).resident;
        return (
          <button key={r.id} onClick={() => onTalk(r)} aria-label={`Talk to ${r.name}`}
            style={{ position: 'absolute', left: `${sp.x}%`, bottom: `${sp.bottom}%`, transform: 'translateX(-50%)', zIndex: CHAR_Z, background: 'none', border: 'none', padding: 0, cursor: 'pointer', pointerEvents: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              {!talkedTo.includes(r.id) && (
                <span style={{ background: 'rgba(255,250,240,0.92)', border: `1.5px solid ${MG.panelEdge}`, borderRadius: 10, padding: '1px 8px', fontSize: 10, fontWeight: 800, color: MG.ink }}>?</span>
              )}
              <Avatar a={r.avatar} size={sp.size} residentIndex={r.portrait} />
            </div>
          </button>
        );
      })}
    </>
  );
}

export function TalkPanel({ npcId, res, onClose }: { npcId: string; res: TalkResult; onClose: () => void }) {
  const r = residentById(npcId)!;
  const giveGift = useMaple((s) => s.giveGift);
  const hearts = useMaple((s) => s.hearts[npcId] ?? 0);
  const pantry = useMaple((s) => s.pantry);
  const [reply, setReply] = useState<ReactNode>(null);
  const [gifting, setGifting] = useState(false);
  const owned = GROCERIES.filter((g) => (pantry[g.id] ?? 0) > 0);
  const first = r.name.split(' ')[0];
  const tier = tierFor(hearts);
  const pick = (arr: readonly string[], avoid?: string) => { const opts = arr.filter((l) => l !== avoid); return opts[Math.floor(Math.random() * opts.length)] ?? arr[0]; };
  const season = currentSeason();

  const OPTIONS: { label: string; run: () => void }[] = [
    ...(CHATS[npcId] ?? [
      { ask: 'Hey! How\'s it going?', reply: pick(r.lines[tier], res.line) },
      { ask: 'Anything new around town?', reply: r.seasonal?.[season.id] ?? `${season.name} is on in Grove Park. Whole town's going.` },
    ]).map((o) => ({ label: o.ask, run: () => setReply(o.reply) })),
    ...(npcId === 'june' ? [{ label: 'Tip the jar (5 MB)', run: () => { if (useMaple.getState().bucks >= 5) { useMaple.getState().addBucks(-5); setReply('"Every coin goes to the summer reading club. Thank you, hon."'); } else setReply('"Tip me when you have it, hon. The jar is patient."'); } }] : []),
    ...(owned.length ? [{ label: 'I brought you something', run: () => setGifting(true) }] : []),
    { label: 'Gotta run, see you!', run: onClose },
  ];
  const give = (gid: string) => {
    const g = giveGift(npcId, gid); setGifting(false);
    if (!g) return;
    setReply(<span>{g.loved ? `"Oh - this is my favorite!" +2 ♥` : `"Thanks, that's kind." +1 ♥`}{g.gift && <><br /><b>Gift received:</b> {g.gift}</>}</span>);
  };

  return (
    <div style={{ position: 'absolute', left: '4%', right: '4%', bottom: '10%', zIndex: 20 }}>
      <MGPanel pad={10} style={{ background: 'rgba(255,250,240,0.97)', display: 'flex', gap: 12, alignItems: 'stretch', boxShadow: '0 -4px 14px rgba(40,30,52,0.25)' }}>
        <div style={{ flex: '0 0 104px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ borderRadius: '50%', border: `3px solid ${MG.gold}`, boxShadow: '0 2px 4px rgba(0,0,0,0.25)', lineHeight: 0 }}>
            <Avatar a={r.avatar} size={96} bust residentIndex={r.portrait} />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontWeight: 800, fontSize: 15, color: MG.purple }}>{r.name}</span>
            <span style={{ fontSize: 11, color: MG.sub, fontWeight: 700 }}>{r.role}</span>
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.35, color: MG.ink }}>“{reply ? reply : res.line}”</div>
          {res.gift && !reply && <div style={{ fontSize: 12, color: MG.greenDk, fontWeight: 700 }}>Gift received: {res.gift}</div>}
          {gifting ? (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {owned.map((g) => (
                <MGButton key={g.id} color={r.likes.includes(g.taste) ? 'gold' : 'plain'} style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => give(g.id)}>{g.name} ×{pantry[g.id]}</MGButton>
              ))}
              <MGButton color="plain" style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => setGifting(false)}>Never mind</MGButton>
            </div>
          ) : reply ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }} />
              <MGButton color="plain" style={{ fontSize: 13, padding: '5px 14px' }} onClick={onClose}>Bye, {first}</MGButton>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {OPTIONS.map((o) => <MGButton key={o.label} color={o.label.startsWith('Gotta') ? 'plain' : 'purple'} style={{ fontSize: 12, padding: '4px 12px' }} onClick={o.run}>{o.label}</MGButton>)}
            </div>
          )}
        </div>
      </MGPanel>
    </div>
  );
}

export function useTalk() {
  const [conv, setConv] = useState<{ npc: string; res: TalkResult } | null>(null);
  const panel = conv ? <TalkPanel key={conv.npc} npcId={conv.npc} res={conv.res} onClose={() => setConv(null)} /> : null;
  const talk = (r: Resident) => { const res = useMaple.getState().talkTo(r.id); setConv({ npc: r.id, res }); };
  return { talk, panel, talking: conv !== null };
}

export function PlayerSprite(_: { loc: MGLocation }) {
  return null;
}

(ResidentSprites as unknown as { isPeople: boolean }).isPeople = true;
(TalkPanel as unknown as { isOverlay: boolean }).isOverlay = true;
