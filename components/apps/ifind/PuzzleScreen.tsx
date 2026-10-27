'use client';
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from 'react';
import { sounds } from '@/lib/sounds';
import { useIFind } from '@/store/ifind';
import { timeLimit, starsFor, type Puzzle, type Target } from '@/lib/ifind/puzzles';
import { IF, IF_LABEL, IF_SERIF, ClueStrip, Grain, IFButton, Stars, hardBevel, paperTile, useCoverBox, vignette, woodGrain } from './ui';

type Status = 'ready' | 'playing' | 'won' | 'lost';

const TOP_BAR_H = 24;

function Scene({
  puzzle, found, hintOn, miss, onClickAt,
}: {
  puzzle: Puzzle; found: Set<string>; hintOn: Target | null;
  miss: { x: number; y: number; id: number } | null;
  onClickAt: (nx: number, ny: number) => void;
}) {
  const { ref, px, size, toPicture } = useCoverBox(puzzle.sceneW, puzzle.sceneH, 'contain');

  const click = (e: React.MouseEvent) => {
    const pt = toPicture(e.clientX, e.clientY);
    if (pt && pt.nx >= 0 && pt.nx <= 1 && pt.ny >= 0 && pt.ny <= 1) onClickAt(pt.nx, pt.ny);
  };

  return (
    <div ref={ref} onClick={click}
      style={{
        position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden', cursor: 'crosshair',
        background: `${vignette}, ${woodGrain}`,
      }}>
      <img src={puzzle.scene} alt="" draggable={false}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', maxWidth: 'none',
          filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.85))',
        }} />

      {puzzle.targets.filter((t) => found.has(t.id)).map((t) => (
        <span key={t.id} className="ifind-found"
          style={{
            position: 'absolute', ...px(t.x, t.y), ...size(t.w, t.h),
            border: `2px solid rgba(232,183,49,0.85)`, borderRadius: '50%', pointerEvents: 'none',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.6)',
          }} />
      ))}

      {hintOn && (
        <span className="ifind-hint"
          style={{
            position: 'absolute', ...px(hintOn.x, hintOn.y), ...size(hintOn.w, hintOn.h),
            border: `3px solid ${IF.found}`, borderRadius: '50%', pointerEvents: 'none',
            filter: 'drop-shadow(0 0 0 2px rgba(255,255,255,0.95)) drop-shadow(0 0 10px rgba(0,0,0,0.6))',
          }} />
      )}

      {miss && (
        <span key={miss.id} className="ifind-miss"
          style={{
            position: 'absolute', ...px(miss.x, miss.y),
            width: 30, height: 30, marginLeft: -15, marginTop: -15, borderRadius: '50%',
            border: `3px solid ${IF.miss}`, pointerEvents: 'none',
          }} />
      )}
    </div>
  );
}

export function PuzzleScreen({ puzzle, onExit, onNext }: {
  puzzle: Puzzle; onExit: () => void; onNext: (() => void) | null;
}) {
  const limit = timeLimit(puzzle.difficulty, puzzle.targets.length);
  const finishPuzzle = useIFind((s) => s.finishPuzzle);

  const [status, setStatus] = useState<Status>('ready');
  const [found, setFound] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [left, setLeft] = useState(limit);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hint, setHint] = useState<Target | null>(null);
  const [miss, setMiss] = useState<{ x: number; y: number; id: number } | null>(null);
  const missId = useRef(0);
  const saved = useRef(false);
  const total = puzzle.targets.length;

  const finish = useCallback((won: boolean, secsLeft: number, misses: number) => {
    if (saved.current) return;
    saved.current = true;
    setStatus(won ? 'won' : 'lost');
    if (won) {
      sounds.ifindWin();
      finishPuzzle(puzzle.id, { stars: starsFor(secsLeft, limit, misses), bestSecondsLeft: secsLeft, mistakes: misses });
    } else sounds.ifindTimeUp();
  }, [finishPuzzle, limit, puzzle.id]);

  useEffect(() => {
    if (status !== 'playing') return;
    let prev = performance.now(); let raf = 0; let remaining = left;
    let lastWhole = Math.ceil(remaining);
    const tick = (now: number) => {
      remaining -= (now - prev) / 1000; prev = now;
      if (remaining <= 0) { setLeft(0); finish(false, 0, mistakes); return; }
      const whole = Math.ceil(remaining);
      if (whole !== lastWhole) {
        lastWhole = whole;
        if (whole <= 10) sounds.ifindTick(whole <= 5);
      }
      setLeft(remaining); raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const start = () => {
    sounds.ifindFound(2); saved.current = false;
    setFound(new Set()); setMistakes(0); setLeft(limit); setHintsUsed(0); setHint(null); setStreak(0); setStatus('playing');
  };

  const clickAt = (nx: number, ny: number) => {
    if (status !== 'playing') return;
    const hit = puzzle.targets
      .filter((t) => !found.has(t.id) && nx >= t.x && nx <= t.x + t.w && ny >= t.y && ny <= t.y + t.h)
      .reduce<Target | undefined>((best, t) => (!best || t.w * t.h < best.w * best.h ? t : best), undefined);
    if (hit) {
      sounds.ifindFound(streak);
      setStreak((n) => n + 1);
      const next = new Set(found); next.add(hit.id); setFound(next);
      if (hint?.id === hit.id) setHint(null);
      if (next.size === total) finish(true, Math.max(0, left), mistakes);
    } else {
      sounds.ifindWrong();
      setStreak(0);
      missId.current += 1;
      setMiss({ x: nx, y: ny, id: missId.current });
      setMistakes((m) => m + 1);
      setLeft((t) => Math.max(0.01, t - 2));
      window.setTimeout(() => setMiss(null), 550);
    }
  };

  const useHint = () => {
    if (status !== 'playing' || hint) return;
    const open = puzzle.targets.filter((t) => !found.has(t.id));
    if (!open.length) return;
    sounds.ifindHint();
    setHintsUsed((h) => h + 1);
    setLeft((t) => Math.max(0.01, t - 5));
    setHint(open[Math.floor(Math.random() * open.length)]);
    window.setTimeout(() => setHint(null), 1800);
  };

  const mm = Math.floor(Math.max(0, left) / 60);
  const ss = Math.floor(Math.max(0, left) % 60);
  const low = left <= 10;

  const riddle = puzzle.kind === 'spy' ? puzzle.riddle : null;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: IF.woodDk }}>
      <div style={{
        flex: `0 0 ${TOP_BAR_H}px`, display: 'flex', alignItems: 'center', gap: 7, padding: '0 8px', zIndex: 2,
        background: `linear-gradient(${IF.wood}, ${IF.woodDk})`, borderBottom: `1px solid ${IF.brassDk}`,
      }}>
        <button onClick={onExit} style={{
          fontFamily: IF_LABEL, fontWeight: 700, fontSize: 9, letterSpacing: 0.8, textTransform: 'uppercase',
          color: '#fff', background: IF.navy, border: '1px solid #0e1f45', borderRadius: 0,
          padding: '3px 8px', cursor: 'pointer', textShadow: '1px 1px 0 rgba(0,0,0,0.6)',
        }}>Menu</button>
        <span style={{
          fontFamily: IF_LABEL, fontWeight: 900, fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase',
          color: IF.brass, textShadow: '1px 1px 0 rgba(0,0,0,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{puzzle.title}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 7, flex: '0 0 auto' }}>
          <span style={{ fontFamily: IF_LABEL, fontWeight: 700, fontSize: 10, letterSpacing: 0.4, color: IF.parchment, whiteSpace: 'nowrap' }}>
            Found {found.size}/{total}
          </span>
          <span style={{
            fontFamily: IF_LABEL, fontWeight: 700, fontSize: 11, letterSpacing: 0.4, padding: '1px 6px', borderRadius: 0,
            color: low ? '#ffd9d4' : IF.parchment,
            background: low ? IF.miss : 'rgba(0,0,0,0.4)',
            border: `1px solid ${low ? '#7d1e15' : '#120a04'}`,
          }}>
            {mm}:{String(ss).padStart(2, '0')}
          </span>
          <IFButton onClick={useHint} disabled={status !== 'playing' || !!hint}
            style={{ padding: '3px 9px', fontSize: 9 }}>Hint</IFButton>
        </div>
      </div>

      <Scene puzzle={puzzle} found={found} hintOn={hint} miss={miss} onClickAt={clickAt} />

      <ClueStrip style={{ flex: '0 0 auto', zIndex: 2, padding: '4px 10px' }}>
        {riddle ? (
          <div style={{ fontFamily: IF_SERIF, fontSize: 11.5, fontWeight: 600, color: IF.ink, lineHeight: 1.35 }}>
            {renderLine(riddle.join(' '), puzzle.targets, found)}
          </div>
        ) : (
          <div style={{ fontFamily: IF_SERIF, fontSize: 11.5, fontWeight: 600, color: IF.ink, textAlign: 'center' }}>
            Two pictures that look the same. Click everything that is not.
          </div>
        )}
      </ClueStrip>

      {status !== 'playing' && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(12,7,3,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{
            maxWidth: 430, width: '100%', textAlign: 'center', padding: 20, borderRadius: 0,
            position: 'relative', background: paperTile, border: `3px solid ${IF.brassDk}`,
            boxShadow: hardBevel() + ', 5px 5px 0 rgba(0,0,0,0.6)',
          }}>
            <Grain opacity={0.5} />
            {status === 'ready' && (
              <>
                <div style={{ fontFamily: IF_SERIF, fontWeight: 700, fontSize: 24, color: IF.ink }}>{puzzle.title}</div>
                <div style={{ fontFamily: IF_SERIF, fontSize: 13, color: IF.inkSoft, margin: '6px 0 8px' }}>
                  {total} to find · {limit} seconds
                </div>
                <div style={{ fontFamily: IF_SERIF, fontSize: 13, color: IF.ink, margin: '0 0 14px' }}>
                  Find each thing from the riddle below and click it.
                </div>
                <IFButton onClick={start} style={{ fontSize: 15, padding: '9px 26px' }}>Begin</IFButton>
              </>
            )}
            {status === 'won' && (
              <>
                <div style={{ fontFamily: IF_SERIF, fontWeight: 700, fontSize: 24, color: IF.ink }}>You found them all.</div>
                <div style={{ margin: '10px 0' }}><Stars n={starsFor(left, limit, mistakes)} size={28} /></div>
                <div style={{ fontFamily: IF_SERIF, fontSize: 13, color: IF.inkSoft, marginBottom: 14 }}>
                  {Math.ceil(left)} seconds to spare · {mistakes} wrong {mistakes === 1 ? 'guess' : 'guesses'}
                  {hintsUsed > 0 && ` · ${hintsUsed} ${hintsUsed === 1 ? 'hint' : 'hints'}`}
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <IFButton tone="dark" onClick={start}>Again</IFButton>
                  {onNext && <IFButton onClick={onNext}>Next scene</IFButton>}
                  <IFButton tone="dark" onClick={onExit}>Menu</IFButton>
                </div>
              </>
            )}
            {status === 'lost' && (
              <>
                <div style={{ fontFamily: IF_SERIF, fontWeight: 700, fontSize: 24, color: IF.miss }}>Out of time.</div>
                <div style={{ fontFamily: IF_SERIF, fontSize: 13, color: IF.inkSoft, margin: '8px 0 14px' }}>
                  You found {found.size} of {total}.
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <IFButton onClick={start}>Try again</IFButton>
                  <IFButton tone="dark" onClick={onExit}>Menu</IFButton>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function renderLine(line: string, targets: Target[], found: Set<string>) {
  const hits = targets
    .filter((t) => found.has(t.id) && line.toLowerCase().includes(t.label.toLowerCase()))
    .sort((a, b) => line.toLowerCase().indexOf(a.label.toLowerCase()) - line.toLowerCase().indexOf(b.label.toLowerCase()));
  if (!hits.length) return line;

  const out: React.ReactNode[] = [];
  let rest = line;
  let key = 0;
  for (const t of hits) {
    const i = rest.toLowerCase().indexOf(t.label.toLowerCase());
    if (i < 0) continue;
    out.push(rest.slice(0, i));
    out.push(
      <span key={key++} style={{ textDecoration: 'line-through', color: IF.inkSoft, opacity: 0.65 }}>
        {rest.slice(i, i + t.label.length)}
      </span>,
    );
    rest = rest.slice(i + t.label.length);
  }
  out.push(rest);
  return out;
}
