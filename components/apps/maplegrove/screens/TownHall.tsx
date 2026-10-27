'use client';

import { useState } from 'react';
import { MG, MGButton, MGPanel } from '../ui';
import { Hud } from '../Hud';
import { Backdrop, Hotspot, Caption, ShopPanel } from '../Backdrop';
import { Avatar } from '../Avatar';
import { useMaple, academicRank } from '@/store/maplegrove';
import { STICKERS, CARDS, CARD_SETS, cardsInSet, type CardSetId } from '@/lib/maplegrove/collectibles';
import { PLACED_RESIDENTS as RESIDENTS, TIER_LABEL, tierFor } from '@/lib/maplegrove/npcs';
import { CardFace, StickerBadge } from '../Collectibles';
import { ResidentSprites, useTalk, Hearts } from '../Residents';
import { currentSeason } from '@/lib/maplegrove/season';

type Tab = 'card' | 'stickers' | 'cards' | 'neighbors';

export function TownHall() {
  const goTo = useMaple((s) => s.goTo);
  const name = useMaple((s) => s.name);
  const avatar = useMaple((s) => s.avatar);
  const stickers = useMaple((s) => s.stickers);
  const cards = useMaple((s) => s.cards);
  const hearts = useMaple((s) => s.hearts);
  const talkedTo = useMaple((s) => s.talkedTo);
  const memories = useMaple((s) => s.memories);
  const academics = useMaple((s) => s.academics);
  const rooms = useMaple((s) => s.rooms);
  const joinedAt = useMaple((s) => s.joinedAt);
  const { talk, panel } = useTalk();
  const [tab, setTab] = useState<Tab>('card');
  const [set, setSet] = useState<CardSetId>('landmarks');
  const [open, setOpen] = useState(false);

  const placed = rooms.reduce((a, r) => a + r.placed.length, 0);
  const owned = new Map<string, number>(); cards.forEach((c) => owned.set(c, (owned.get(c) ?? 0) + 1));
  const uniqueCards = owned.size;
  const bestFriend = Object.entries(hearts).sort((a, b) => b[1] - a[1])[0];
  const fav = bestFriend ? RESIDENTS.find((r) => r.id === bestFriend[0]) : undefined;

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <Hud title="Town Hall" />
      <div style={{ position: 'relative', flex: 1 }}>
        <Backdrop bg="townhall" people={<ResidentSprites loc="townhall" bottom="12%" size={70} onTalk={talk} />}
          overlay={
            <>
              <Caption>Your records live at the front desk. The Mayor is usually around, click to talk.</Caption>
              {open && (
                <ShopPanel title="Resident records" onClose={() => setOpen(false)} width="72%">
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
                    {([['card', 'Resident Card'], ['stickers', `Stickers ${stickers.length}/${STICKERS.length}`], ['cards', `Cards ${uniqueCards}/${CARDS.length}`], ['neighbors', 'Neighbors']] as [Tab, string][]).map(([id, label]) => (
                      <button key={id} onClick={() => setTab(id)} style={{ border: `2px solid ${MG.blueDk}`, borderRadius: 4, padding: '2px 9px', fontWeight: 900, fontSize: 10, cursor: 'pointer', fontFamily: 'inherit',
                        background: tab === id ? `linear-gradient(#ffe98a, ${MG.gold})` : '#e9e2cc', color: MG.blueDk }}>{label}</button>
                    ))}
                  </div>
          {tab === 'card' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(160px, 200px) 1fr', gap: 14 }}>
              <MGPanel pad={12} style={{ background: 'linear-gradient(#f7f1ff,#efe9f3)', textAlign: 'center' }}>
                <div style={{ fontSize: 9, letterSpacing: 2, fontWeight: 800, color: MG.sub }}>MAPLE GROVE RESIDENT</div>
                <div style={{ width: 120, height: 120, margin: '8px auto', borderRadius: '50%', border: `3px solid ${MG.gold}`, lineHeight: 0, overflow: 'hidden' }}>
                  <Avatar a={avatar} size={114} bust />
                </div>
                <div style={{ fontWeight: 800, fontSize: 18, color: MG.purple }}>{name}</div>
                <div style={{ fontSize: 11, color: MG.sub }}>Rosemount · starter house</div>
                <div style={{ fontSize: 11, color: MG.sub }}>Moved in {joinedAt ? new Date(joinedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'today'} · {currentSeason().seasonName}</div>
                <div style={{ borderTop: `1px dashed ${MG.panelEdge}`, margin: '8px 0' }} />
                <Row k="Academy rank" v={academicRank(academics)} />
                <Row k="Furniture placed" v={String(placed)} />
                <Row k="Stickers" v={`${stickers.length} / ${STICKERS.length}`} />
                <Row k="Cards" v={`${uniqueCards} / ${CARDS.length}`} />
                <Row k="Neighbors met" v={`${talkedTo.length} / ${RESIDENTS.length}`} />
                {fav && <Row k="Closest friend" v={`${fav.name} ♥${bestFriend![1]}`} />}
              </MGPanel>
              <div>
                <div style={{ fontWeight: 800, color: MG.purple, fontSize: 14, marginBottom: 6 }}>Memories</div>
                {memories.length === 0 && <div style={{ fontSize: 12, color: MG.sub }}>Nothing yet. Go do something, buy a chair, meet a neighbor, win a game. It gets written down here.</div>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {[...memories].reverse().map((m, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12, padding: '5px 8px', background: i % 2 ? '#f6f0e3' : 'transparent', borderRadius: 6 }}>
                      <span style={{ color: MG.sub, fontWeight: 700, flex: '0 0 52px' }}>{new Date(m.t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
                      <span>{m.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'stickers' && (
            <>
              <div style={{ fontSize: 12, color: MG.sub, fontWeight: 700, marginBottom: 10 }}>Hover a blank spot to see where that sticker comes from. Gram Willoughby has four thousand. You have {stickers.length}.</div>
              {(['activity', 'friend', 'prize', 'event'] as const).map((src) => (
                <div key={src} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: MG.leaf, marginBottom: 6 }}>{{ activity: 'AROUND TOWN', friend: 'FROM FRIENDS', prize: 'PRIZE CORNER', event: 'FESTIVALS' }[src]}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {STICKERS.filter((s) => s.source === src).map((s) => (
                      <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 76 }}>
                        <StickerBadge st={s} owned={stickers.includes(s.id)} />
                        <div style={{ fontSize: 9, fontWeight: 800, textAlign: 'center', marginTop: 4, color: stickers.includes(s.id) ? MG.ink : MG.sub, lineHeight: 1.1 }}>{s.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {tab === 'cards' && (
            <>
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                {(Object.keys(CARD_SETS) as CardSetId[]).map((id) => {
                  const have = cardsInSet(id).filter((c) => owned.has(c.id)).length;
                  return <MGButton key={id} color={set === id ? 'purple' : 'plain'} style={{ fontSize: 12, padding: '4px 12px' }} onClick={() => setSet(id)}>{CARD_SETS[id].name} · {have}/{cardsInSet(id).length}</MGButton>;
                })}
              </div>
              <div style={{ fontSize: 12, color: MG.sub, marginBottom: 8 }}>{CARD_SETS[set].blurb} {set === 'residents' ? 'Each resident gives you their card at 10 hearts.' : 'Landmark packs are by the register at Maple Mart.'}
                {cardsInSet(set).every((c) => owned.has(c.id)) && <b style={{ color: MG.greenDk }}> Set complete!</b>}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                {cardsInSet(set).map((c) => <CardFace key={c.id} card={c} w={c.set === 'landmarks' ? 116 : 96} dim={!owned.has(c.id)} count={owned.get(c.id)} />)}
              </div>
            </>
          )}

          {tab === 'neighbors' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {RESIDENTS.map((r) => {
                const met = talkedTo.includes(r.id); const h = hearts[r.id] ?? 0;
                return (
                  <MGPanel key={r.id} pad={8} style={{ display: 'flex', gap: 10, alignItems: 'center', background: met ? MG.panel : '#f1ede6', opacity: met ? 1 : 0.7 }}>
                    <div style={{ width: 54, height: 54, borderRadius: '50%', border: `2px solid ${MG.gold}`, lineHeight: 0, overflow: 'hidden', flex: '0 0 auto' }}>
                      <Avatar a={r.avatar} size={50} bust residentIndex={r.portrait} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 13, color: MG.purple }}>{met ? r.name : '???'}</div>
                      <div style={{ fontSize: 10, color: MG.sub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{met ? r.role : 'Not met yet'}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}><Hearts n={h} size={10} /><span style={{ fontSize: 9, color: '#e34848', fontWeight: 800 }}>{met ? TIER_LABEL[tierFor(h)] : ''}</span></div>
                    </div>
                  </MGPanel>
                );
              })}
            </div>
          )}
                </ShopPanel>
              )}
            </>
          }>
          <Hotspot x={32} y={50} w={36} h={24} label="Front desk" sub="resident card · stickers · cards" onClick={() => setOpen(true)} />
          <Hotspot x={14} y={22} w={8} h={28} label="Community events" sub="this week in the Gazette" onClick={() => goTo('gazette')} />
          <Hotspot x={0} y={8} w={12} h={70} label="Front doors" sub="back downtown" onClick={() => goTo('town')} labelAt="bottom" />
          <Hotspot x={88} y={8} w={12} h={70} label="Front doors" sub="back downtown" onClick={() => goTo('town')} labelAt="bottom" />
          {panel}
        </Backdrop>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '2px 0' }}><span style={{ color: MG.sub, fontWeight: 700 }}>{k}</span><span style={{ fontWeight: 800 }}>{v}</span></div>;
}
