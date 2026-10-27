'use client';

import { useEffect, useMemo, useState } from 'react';
import { MG, Leaf } from '../ui';
import { Hud } from '../Hud';
import { Backdrop, Hotspot, Caption, ShopPanel } from '../Backdrop';
import { Avatar } from '../Avatar';
import { useMaple } from '@/store/maplegrove';
import { buildIssue, GAME_NAMES } from '@/lib/maplegrove/gazette';
import { ResidentSprites, useTalk } from '../Residents';

export function GazetteScreen() {
  const goTo = useMaple((s) => s.goTo);
  const stock = useMaple((s) => s.storeStock);
  const highScores = useMaple((s) => s.highScores);
  const name = useMaple((s) => s.name);
  const readGazette = useMaple((s) => s.readGazette);
  const { talk, panel } = useTalk();

  const issue = useMemo(() => {
    const [topGame, topScore] = Object.entries(highScores).sort((a, b) => b[1] - a[1])[0] ?? ['acorn', 0];
    return buildIssue({ stock, topGame: GAME_NAMES[topGame] ?? topGame, topScore, playerName: name, newResident: true });
  }, [stock, highScores, name]);

  const [reading, setReading] = useState(false);
  useEffect(() => { readGazette(); }, [readGazette]);

  const H = ({ children }: { children: React.ReactNode }) => <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 700, color: '#2a2420', lineHeight: 1.15 }}>{children}</div>;
  const P = ({ children }: { children: React.ReactNode }) => <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 11.5, color: '#3a332c', lineHeight: 1.4, marginTop: 3 }}>{children}</div>;
  const K = ({ children }: { children: React.ReactNode }) => <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.5, color: MG.leaf, marginBottom: 2 }}>{children}</div>;
  const Rule = () => <div style={{ borderTop: '1px solid #b9ae9c', margin: '8px 0' }} />;

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <Hud title="Maple Gazette" onBack={() => goTo('town')} backLabel="Town" />
      <div style={{ position: 'relative', flex: 1 }}>
        <Backdrop bg="gazette" people={<ResidentSprites loc="gazette" bottom="12%" size={70} onTalk={talk} />}
          overlay={
            <>
              <Caption>This week&apos;s issue is on the desk. Audrey is at hers, click her to talk.</Caption>
              {reading && (
                <ShopPanel title={`The Maple Gazette - No. ${issue.number}`} onClose={() => setReading(false)} width="70%">
          <div style={{ background: '#f4efe3', border: '1px solid #b9ae9c', padding: 12, maxWidth: 640, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', borderBottom: '3px double #2a2420', paddingBottom: 6 }}>
              <div style={{ fontFamily: 'Georgia, serif', fontWeight: 900, fontSize: 'clamp(15px, 4vw, 26px)', letterSpacing: 1, whiteSpace: 'nowrap', color: '#2a2420' }}><Leaf size={22} /> THE MAPLE GAZETTE</div>
              <div style={{ fontSize: 9, letterSpacing: 1, color: '#5a5048', fontWeight: 700, display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 4 }}>
                <span>No. {issue.number}</span><span>{issue.dateline.toUpperCase()}</span><span>FREE · TAKE ONE</span>
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <K>{issue.front.kicker}</K>
              <H><div style={{ fontSize: 22 }}>{issue.front.head}</div></H>
              <P>{issue.front.body}</P>
            </div>
            <Rule />

            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16 }}>
              <div>
                <K>COMMUNITY NEWS</K>
                {issue.community.map((a, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    {a.kicker && <div style={{ fontSize: 9, fontWeight: 800, color: MG.green, letterSpacing: 1 }}>{a.kicker}</div>}
                    <H><div style={{ fontSize: 14 }}>{a.head}</div></H>
                    <P>{a.body}</P>
                  </div>
                ))}
                <Rule />
                <K>{issue.arcade.kicker}</K>
                <H><div style={{ fontSize: 14 }}>{issue.arcade.head}</div></H>
                <P>{issue.arcade.body}</P>
              </div>
              <div>
                <div style={{ border: '1px solid #b9ae9c', padding: 8, background: '#efe8d8' }}>
                  <K>FEATURED RESIDENT</K>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid #b9ae9c', overflow: 'hidden', lineHeight: 0, flex: '0 0 auto' }}>
                      <Avatar a={issue.featured.resident.avatar} size={52} bust residentIndex={issue.featured.resident.portrait} />
                    </div>
                    <div>
                      <H><div style={{ fontSize: 13 }}>{issue.featured.resident.name}</div></H>
                      <div style={{ fontSize: 10, color: '#5a5048' }}>{issue.featured.resident.role}</div>
                    </div>
                  </div>
                  <P><i>“{issue.featured.quote}”</i></P>
                </div>
                <div style={{ marginTop: 10 }}>
                  <K>{issue.store.kicker}</K>
                  <H><div style={{ fontSize: 13 }}>{issue.store.head}</div></H>
                  <P>{issue.store.body}</P>
                </div>
                <Rule />
                <K>ANNOUNCEMENTS</K>
                {issue.announcements.map((a, i) => <P key={i}>• {a}</P>)}
              </div>
            </div>
            <div style={{ textAlign: 'center', fontSize: 9, color: '#5a5048', marginTop: 12, borderTop: '1px solid #b9ae9c', paddingTop: 6 }}>
              Published weekly from the corner booth at the Maple Grove Café. Tips: the box by the door. Back issues: Maple Academy Library.
            </div>
          </div>
                </ShopPanel>
              )}
            </>
          }>
          <Hotspot x={46} y={60} w={20} h={16} label="This week's issue" sub="read the paper" onClick={() => setReading(true)} />
          <Hotspot x={30} y={19} w={20} h={34} label="Story board" sub="what's pinned up this week" onClick={() => setReading(true)} />
          {panel}
        </Backdrop>
      </div>
    </div>
  );
}
