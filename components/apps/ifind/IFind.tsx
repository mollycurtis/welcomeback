'use client';
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import { useIFind } from '@/store/ifind';
import { PUZZLES, PUZZLES_BY_DIFFICULTY, DIFFICULTY_LABEL, DIFFICULTY_COLOR, timeLimit, puzzleById } from '@/lib/ifind/puzzles';
import { IF, IF_LABEL, IF_SERIF, IFButton, Plate, Stars, hardBevel, paperTile, vignette, woodGrain, useCoverBox } from './ui';
import { PuzzleScreen } from './PuzzleScreen';

type Screen = 'menu' | 'select' | 'play';

export default function IFind() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [playing, setPlaying] = useState<string | null>(null);
  const records = useIFind((s) => s.records);

  const solved = Object.keys(records).length;
  const stars = Object.values(records).reduce((n, r) => n + r.stars, 0);

  if (screen === 'play' && playing) {
    const puzzle = puzzleById(playing);
    if (!puzzle) { setScreen('select'); setPlaying(null); return null; }
    const i = PUZZLES_BY_DIFFICULTY.findIndex((p) => p.id === playing);
    const next = PUZZLES_BY_DIFFICULTY[i + 1];
    return (
      <PuzzleScreen key={puzzle.id} puzzle={puzzle}
        onExit={() => { setScreen('select'); setPlaying(null); }}
        onNext={next ? () => setPlaying(next.id) : null} />
    );
  }

  if (screen === 'select') {
    return (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: `${vignette}, ${woodGrain}` }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px',
          background: 'rgba(0,0,0,0.42)', borderBottom: `2px solid #120a04`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
        }}>
          <IFButton tone="dark" style={{ padding: '4px 11px', fontSize: 11 }} onClick={() => setScreen('menu')}>Menu</IFButton>
          <Plate style={{ fontSize: 14 }}>Pick a scene</Plate>
          <Plate style={{ marginLeft: 'auto', fontSize: 12 }}>{stars} / {PUZZLES.length * 3} stars</Plate>
        </div>

        {PUZZLES.length === 0 ? (
          <Empty />
        ) : (
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 10, alignContent: 'start' }}>
            {PUZZLES_BY_DIFFICULTY.map((p) => {
              const rec = records[p.id];
              return (
                <button key={p.id} onClick={() => { setPlaying(p.id); setScreen('play'); }}
                  style={{
                    display: 'block', width: '100%', padding: 6, textAlign: 'left', cursor: 'pointer',
                    background: paperTile, borderRadius: 0,
                    border: `2px solid ${IF.brassDk}`, boxShadow: hardBevel() + ', 3px 3px 0 rgba(0,0,0,0.5)',
                    fontFamily: 'inherit',
                  }}>
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '2 / 1', overflow: 'hidden', background: '#120a04', border: `2px solid ${IF.woodDk}` }}>
                    <img src={p.scene} alt="" draggable={false}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', maxWidth: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                    <span style={{ fontFamily: IF_SERIF, fontWeight: 700, fontSize: 13, color: IF.ink }}>{p.title}</span>
                    <span style={{
                      fontFamily: IF_LABEL, fontWeight: 900, fontSize: 9.5, letterSpacing: 0.6, textTransform: 'uppercase',
                      color: DIFFICULTY_COLOR[p.difficulty],
                    }}>{DIFFICULTY_LABEL[p.difficulty]}</span>
                  </div>
                  <div style={{ fontFamily: IF_SERIF, fontSize: 10, color: IF.inkSoft, margin: '1px 0 3px' }}>
                    {p.targets.length} to find · {timeLimit(p.difficulty, p.targets.length)}s
                  </div>
                  {rec
                    ? <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Stars n={rec.stars} size={13} />
                        <span style={{ fontFamily: IF_SERIF, fontSize: 10, color: IF.inkSoft }}>{Math.ceil(rec.bestSecondsLeft)}s to spare</span>
                      </span>
                    : <span style={{ fontFamily: IF_SERIF, fontSize: 10, color: IF.inkSoft }}>Not solved yet</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Home solved={solved} totalRounds={PUZZLES.length} stars={stars} onStart={() => setScreen('select')} />
  );
}

const HOME_W = 1536;
const HOME_H = 1024;
const HOME_BUTTON = { x: 0.322, y: 0.517, w: 0.356, h: 0.081 };

function Home({ solved, totalRounds, stars, onStart }: {
  solved: number; totalRounds: number; stars: number; onStart: () => void;
}) {
  const { ref, px, size } = useCoverBox(HOME_W, HOME_H);
  const [pressed, setPressed] = useState(false);

  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#120a04' }}>
      <img src="/ifind/ui/home.jpg" alt="" draggable={false}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', maxWidth: 'none' }} />

      <button
        aria-label={solved ? 'Keep looking' : 'Start exploring'}
        onClick={onStart}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        style={{
          position: 'absolute', ...px(HOME_BUTTON.x, HOME_BUTTON.y), ...size(HOME_BUTTON.w, HOME_BUTTON.h),
          border: 'none', background: 'transparent', cursor: 'pointer', padding: 0,
          filter: pressed ? 'brightness(0.88)' : 'none',
        }}
      />

      {solved > 0 && (
        <div style={{
          position: 'absolute', ...px(0.5, 0.655), transform: 'translate(-50%, -50%)',
          fontFamily: IF_SERIF, fontSize: 12, color: 'rgba(251,243,216,0.85)',
          letterSpacing: 0.4, textShadow: '0 1px 3px rgba(0,0,0,0.9)', whiteSpace: 'nowrap',
        }}>
          {solved} of {totalRounds} solved &middot; {stars} stars
        </div>
      )}
    </div>
  );
}

function Empty() {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{
        maxWidth: 420, textAlign: 'center', padding: 20, borderRadius: 0,
        background: paperTile, border: `3px solid ${IF.brassDk}`,
        boxShadow: hardBevel() + ', 4px 4px 0 rgba(0,0,0,0.5)',
      }}>
        <div style={{ fontFamily: IF_SERIF, fontWeight: 700, fontSize: 20, color: IF.ink }}>No scenes installed</div>
        <p style={{ fontFamily: IF_SERIF, fontSize: 13, color: IF.inkSoft, lineHeight: 1.55, margin: '8px 0 0' }}>
          The disc is in the drive but the picture folder is empty.
          Scenes drop into <code>public/ifind/</code> and get listed in <code>lib/ifind/puzzles.ts</code>.
        </p>
      </div>
    </div>
  );
}
