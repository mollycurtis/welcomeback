'use client';

import { useState } from 'react';
import { MG, MGButton, MGPanel, Coin, FONT_TITLE } from '../ui';
import { Hud } from '../Hud';
import { PlayerSprite, useTalk } from '../Residents';
import { Backdrop, Hotspot, Caption, ShopPanel } from '../Backdrop';
import { useMaple } from '@/store/maplegrove';
import { RESIDENTS } from '@/lib/maplegrove/npcs';
import { currentSeason } from '@/lib/maplegrove/season';

interface Letter { id: string; from: string; subject: string; body: string; bucks?: number }

const NOTE_SUBJECT: Record<string, string> = { mayor: 'Welcome to Maple Grove', audrey: 'Off the record', olivia: 'Something for the windowsill', theo: 'Trail report', walt: 'About that sofa', june: 'On the house', raj: 'Aisle three', lena: 'New arrivals', principal: 'Attendance', gram: 'From the porch', maya: 'Trade?', hazel: 'From the orchard', sam: 'Pool rules' };
const NOTE: Record<string, string> = {
  mayor: 'Officially: welcome. Unofficially: the clock on the tower is four minutes fast and I would appreciate it if nobody mentioned it at the meeting.',
  audrey: 'Good to meet a new face. If anything odd happens on your street, you tell me first. The Gazette runs Wednesdays.',
  olivia: 'The gardens are better with company. Bring gloves, I have a spare trowel with your name on it.',
  theo: 'Three things go missing on the Woodbury trail every single day. I have theories. Meet me up there.',
  walt: 'Stock rotates daily. If you liked the blue chair, do not wait. Tomorrow it is a lamp.',
  june: 'Your first cocoa is on the house. Say I sent you, then say it again louder because I will be at the espresso machine.',
  raj: 'The gold tags on the shelves mark what your neighbors love. Very useful for someone new who wants to make friends fast.',
  lena: 'New looks came in. Try one on in the mirror, I will be honest with you, that is the whole service.',
  principal: 'Classes run every day, one each. Nobody has failed yet. I say this to everyone. It is still true.',
  gram: 'Come sit a while. I have forty one sticker albums and a lot of lemonade and not enough people to show either to.',
  maya: 'I have doubles of the Town Hall card. You will too, eventually, everyone does. We can trade.',
  hazel: 'The orchard is open for picking once a day. Whatever you pick is yours to give away. That is how the town works.',
  sam: 'The raft opens when the water is warm, which is July, which is not now. Fish off the dock in the meantime, the bluegill are stupid this time of year.',
};

export function PostOffice() {
  const goTo = useMaple((s) => s.goTo);
  const name = useMaple((s) => s.name);
  const hearts = useMaple((s) => s.hearts);
  const mailRead = useMaple((s) => s.mailRead);
  const readMail = useMaple((s) => s.readMail);
  const addBucks = useMaple((s) => s.addBucks);
  const streak = useMaple((s) => s.streak);
  const [open, setOpen] = useState(false);
  const { panel } = useTalk();
  const [sel, setSel] = useState<Letter | null>(null);
  const season = currentSeason();
  const you = name || 'Resident';

  const letters: Letter[] = [
    { id: 'welcome', from: 'Mayor Maple, Town Hall', subject: `Welcome to Maple Grove, ${you}!`, body: `Dear ${you},\n\nOn behalf of everyone in town: welcome home. Your starter house on Rosemount is yours; Maple Furniture can help you fill it. Stop by Town Hall any time, your resident card, sticker book and card binder live at the front desk.\n\nEnclosed: 50 Maple Bucks to get you started.\n\n -  Mayor Maple`, bucks: 50 },
    { id: `festival_${season.id}`, from: 'Grove Park Events', subject: `You're invited: the ${season.name}`, body: `${season.tagline}\n\nThe stall is open in the gazebo at Grove Park all season. Bring a friend, make a wish at the fountain, and don't miss the Arcade bonus - ${season.bonusGame ? 'one cabinet pays double tickets' : 'every cabinet is buzzing'}.\n\nSee you there!`, bucks: 15 },
    ...(streak >= 3 ? [{ id: 'streak3', from: 'Town Hall', subject: 'Three days running!', body: `${you},\n\nThe clerk noticed you've been in town three days in a row. That's the kind of resident Maple Grove is built on. Here's a little something.\n\n -  Town Hall`, bucks: 30 }] : []),
    ...RESIDENTS.flatMap((r) => {
      const h = hearts[r.id] ?? 0; const out: Letter[] = [];
      if (h >= 1) out.push({ id: `${r.id}_1`, from: `${r.name}`, subject: NOTE_SUBJECT[r.id] ?? 'Hey neighbor', body: `${you},

${NOTE[r.id] ?? 'Nice meeting you today. Stop by again.'}

${r.name.split(' ')[0]}` });
      if (h >= 6) out.push({ id: `${r.id}_6`, from: `${r.name}`, subject: 'For you', body: `${you},\n\nYou've been a real friend. I put a little something in the envelope. Don't spend it all at the Arcade. (Do.)\n\n -  ${r.name}`, bucks: 40 });
      return out;
    }),
  ];
  const unread = letters.filter((l) => !mailRead.includes(l.id));
  const openLetter = (l: Letter) => { setSel(l); if (!mailRead.includes(l.id)) { readMail(l.id); if (l.bucks) addBucks(l.bucks); } };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <Hud title="Post Office" />
      <div style={{ position: 'relative', flex: 1 }}>
        <Backdrop bg="postoffice"
          overlay={
            <>
              <Caption>{unread.length ? `You have ${unread.length} new letter${unread.length > 1 ? 's' : ''}. Click the counter.` : 'No new mail. Residents write once they know you.'}</Caption>
              {open && (
                <ShopPanel title={`Mail for ${you}`} onClose={() => { setOpen(false); setSel(null); }} width="70%">
                  {sel ? (
                    <div>
                      <div style={{ fontFamily: FONT_TITLE, fontWeight: 900, color: MG.blue, fontSize: 13 }}>{sel.subject}</div>
                      <div style={{ fontSize: 10, color: MG.sub, marginBottom: 8 }}>From: {sel.from}</div>
                      <MGPanel pad={10} style={{ background: '#fffdf5', whiteSpace: 'pre-wrap', fontSize: 12, lineHeight: 1.5, fontFamily: 'Georgia, serif' }}>{sel.body}</MGPanel>
                      {sel.bucks && <div style={{ marginTop: 6, fontSize: 11, fontWeight: 900, color: MG.greenDk }}><Coin size={12} /> {sel.bucks} Maple Bucks were enclosed{mailRead.includes(sel.id) ? ' (added to your wallet)' : ''}.</div>}
                      <MGButton color="plain" style={{ fontSize: 11, marginTop: 8 }} onClick={() => setSel(null)}>&larr; Back to inbox</MGButton>
                    </div>
                  ) : (
                    <div>
                      {letters.length === 0 && <div style={{ fontSize: 12 }}>Nothing yet.</div>}
                      {letters.map((l) => {
                        const isNew = !mailRead.includes(l.id);
                        return (
                          <div key={l.id} onClick={() => openLetter(l)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', marginBottom: 4, background: isNew ? '#fff' : 'rgba(255,255,255,0.5)', border: `2px solid ${isNew ? MG.blueDk : 'rgba(0,0,0,0.12)'}`, borderRadius: 5, cursor: 'pointer' }}>
                            <span style={{ fontSize: 16 }}>{isNew ? '✉' : '📄'}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: isNew ? 900 : 700, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.subject}</div>
                              <div style={{ fontSize: 10, color: MG.sub }}>{l.from}</div>
                            </div>
                            {l.bucks && isNew && <span style={{ fontSize: 10, fontWeight: 900, color: MG.greenDk }}><Coin size={10} /> {l.bucks}</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ShopPanel>
              )}
            </>
          }>
          <Hotspot x={86} y={10} w={10} h={60} label="Door" sub="back downtown" onClick={() => goTo('town')} labelAt="bottom" />
          <Hotspot x={22} y={26} w={53} h={54} label="Counter" sub={unread.length ? `${unread.length} new` : 'check your mail'} onClick={() => setOpen(true)} />
          <PlayerSprite loc="postoffice" />
          {panel}
        </Backdrop>
      </div>
    </div>
  );
}
