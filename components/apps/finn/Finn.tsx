'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from 'react';
import { sounds } from '@/lib/sounds';
import { useFinn } from '@/store/finn';
import { FIRST_SCENE, sceneById } from '@/lib/finn/content';
import { AdventureScreen, preloadPainting } from './AdventureScreen';
import { FN, FN_FONT, FN_ROUND, FNButton, fnShadow, useSceneBox, HOW_TO_PLAY } from './ui';
import { useFinnPrefs, SPEED_LABEL } from '@/lib/finn/prefs';

const HOME_W = 1448;
const HOME_H = 1086;
const BTN = {
  play:    { x: 0.759, y: 0.392, w: 0.151, h: 0.088 },
  newGame: { x: 0.759, y: 0.515, w: 0.158, h: 0.071 },
  options: { x: 0.761, y: 0.606, w: 0.153, h: 0.071 },
};

export default function Finn() {
  const started = useFinn((s) => s.started);
  const scene = useFinn((s) => s.scene);
  const newGame = useFinn((s) => s.newGame);
  useEffect(() => {
    const saved = sceneById(scene); if (saved) preloadPainting(saved.background);
    const first = sceneById(FIRST_SCENE); if (first) preloadPainting(first.background);
  }, [scene]);
  const [playing, setPlaying] = useState(false);

  const saveOk = started && !!sceneById(scene);

  useEffect(() => { if (playing && !saveOk) setPlaying(false); }, [playing, saveOk]);

  if (playing && saveOk) return <AdventureScreen onExit={() => setPlaying(false)} />;

  const start = (fresh: boolean) => {
    if (fresh) {
      if (saveOk && !window.confirm('Start a new mystery? Your saved game will be lost.')) return;
      newGame(FIRST_SCENE);
    } else if (!saveOk) {
      newGame(FIRST_SCENE);
    }
    sounds.finnTalk();
    setPlaying(true);
  };

  return <Title saveOk={saveOk} onStart={start} />;
}

const TITLE_BUBBLES = [
  { x: 5, s: 14, d: 9, o: 1 }, { x: 11, s: 9, d: 7.5, o: 4 }, { x: 19, s: 18, d: 11, o: 7 },
  { x: 30, s: 8, d: 8.5, o: 2.5 }, { x: 64, s: 10, d: 9.5, o: 5.5 }, { x: 76, s: 16, d: 10.5, o: 0.5 },
  { x: 86, s: 9, d: 8, o: 3.5 }, { x: 93, s: 13, d: 12, o: 8 },
];

function Title({ saveOk, onStart }: { saveOk: boolean; onStart: (fresh: boolean) => void }) {
  const [pressed, setPressed] = useState<string | null>(null);
  const [options, setOptions] = useState(false);
  const prefs = useFinnPrefs();
  const { ref, px, size } = useSceneBox(HOME_W, HOME_H);
  useEffect(() => { const t = window.setTimeout(() => sounds.finnPouch(true), 350); return () => window.clearTimeout(t); }, []);

  const hit = (key: keyof typeof BTN, label: string, onClick: () => void) => (
    <button
      aria-label={label}
      onClick={onClick}
      onPointerDown={() => setPressed(key)}
      onPointerUp={() => setPressed(null)}
      onPointerLeave={() => setPressed(null)}
      style={{
        position: 'absolute', ...px(BTN[key].x, BTN[key].y), ...size(BTN[key].w, BTN[key].h),
        border: 'none', background: 'transparent', cursor: 'pointer', padding: 0,
        filter: pressed === key ? 'brightness(0.86)' : 'none',
      }}
    />
  );

  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: FN.deep, fontFamily: FN_FONT }}>
      <img src="/finn/ui/home.webp" alt="Finn the Fish" draggable={false}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', maxWidth: 'none' }} />
      {TITLE_BUBBLES.map((b, i) => (
        <span key={i} aria-hidden="true" className="finn-title-bubble"
          style={{ left: b.x + '%', width: b.s, height: b.s, animationDuration: b.d + 's', animationDelay: -b.o + 's' }} />
      ))}

      {hit('play', saveOk ? 'Play, continue your saved game' : 'Play', () => onStart(false))}
      {hit('newGame', 'New Game', () => onStart(true))}
      {hit('options', 'Options', () => { sounds.finnTalk(); setOptions(true); })}

      {options && (
        <div onClick={() => setOptions(false)}
          style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, background: 'rgba(6,38,63,0.72)' }}>
          <div onClick={(e) => e.stopPropagation()} className="finn-pop"
            style={{ width: '100%', maxWidth: 400, maxHeight: '96%', overflowY: 'auto', padding: 15, background: FN.shell, borderRadius: FN_ROUND, boxShadow: fnShadow }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: FN.sea, flex: 1 }}>Options</div>
              <button onClick={() => setOptions(false)} aria-label="Close"
                style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: FN.inkSoft }}>&times;</button>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              <FNButton tone="sand" onClick={() => { prefs.toggleSound(); if (!prefs.soundOn) sounds.finnPouch(true); }}>
                Sound: {prefs.soundOn ? 'On' : 'Off'}
              </FNButton>
              <FNButton tone="sand" onClick={prefs.cycleTextSpeed}>Text speed: {SPEED_LABEL[prefs.textSpeed]}</FNButton>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: FN.coral, marginBottom: 6 }}>How to play</div>
            {HOW_TO_PLAY.map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 7, marginBottom: 5, textAlign: 'left' }}>
                <span style={{ color: FN.coral, fontWeight: 700, flex: '0 0 62px', fontSize: 11 }}>{k}</span>
                <span style={{ fontSize: 11.5, color: FN.ink, lineHeight: 1.35 }}>{v}</span>
              </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <FNButton onClick={() => setOptions(false)} style={{ fontSize: 13, padding: '8px 22px' }}>Back</FNButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
