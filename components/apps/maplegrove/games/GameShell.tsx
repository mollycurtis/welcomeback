'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { MGButton, Coin, TicketIcon } from '../ui';
import { Hud } from '../Hud';
import { sounds } from '@/lib/sounds';
import { useMaple } from '@/store/maplegrove';
import { currentSeason } from '@/lib/maplegrove/season';

export type GameStatus = 'ready' | 'playing' | 'over';
export interface Reward { bucks: number; tickets: number }

export function payout(gameId: string, score: number, bucksPer = 3, ticketDiv = 3): Reward {
  const st = useMaple.getState();
  const bucks = Math.max(0, Math.round(score * bucksPer));
  const tickets = Math.max(score > 0 ? 1 : 0, Math.floor(score / ticketDiv)) * (currentSeason().bonusGame === gameId ? 2 : 1);
  st.addBucks(bucks); st.addTickets(tickets); st.setHighScore(gameId, score);
  return { bucks, tickets };
}

const HOUSE_RANGE: Record<string, [number, number]> = {
  acorn: [38, 62], match: [30, 48], burger: [24, 42], skee: [160, 260], maze: [48, 86], blocks: [20, 36],
};
export const HOUSE_BEST: Record<string, number> = Object.fromEntries(
  Object.entries(HOUSE_RANGE).map(([id, [lo, hi]]) => [id, lo + Math.floor(Math.random() * (hi - lo + 1))]),
);

export function useGame(gameId: string) {
  const mine = useMaple((s) => s.highScores[gameId] ?? 0);
  const best = Math.max(mine, HOUSE_BEST[gameId] ?? 0);
  const [status, setStatus] = useState<GameStatus>('ready');
  const [score, setScore] = useState(0);
  const [reward, setReward] = useState<Reward | null>(null);
  const finish = (final: number, bucksPer = 3, ticketDiv = 3) => { sounds.chime(); setScore(final); setReward(payout(gameId, final, bucksPer, ticketDiv)); setStatus('over'); };
  const start = () => { sounds.blip(); setReward(null); setScore(0); setStatus('playing'); };
  return { best, status, score, setScore, reward, finish, start };
}

export function GameShell({
  id, title, best, status, score, timeLeft, reward, intro, tip, overTitle = "Time's up!", stats, onStart, onExit, children, width = 680, height = 360,
}: {
  id: string; title: string; best: number; status: GameStatus; score: number; timeLeft?: number; reward: Reward | null;
  intro: ReactNode; tip?: string; overTitle?: string; stats?: ReactNode; onStart: () => void; onExit: (msg?: string) => void; children: ReactNode; height?: number; width?: number;
}) {
  const bonus = currentSeason().bonusGame === id;
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: 'linear-gradient(#20242c,#2c323d)' }}>
      <Hud title={title} onBack={() => onExit()} backLabel="Arcade" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 10, minHeight: 0 }}>
        <div style={{ display: 'flex', gap: 18, marginBottom: 8, color: '#fff', fontWeight: 800, fontSize: 12 }}>
          <span>Score: {score}</span>
          {timeLeft !== undefined && <span>Time: {timeLeft}s</span>}
          {stats}
          <span style={{ color: '#f4e08a' }}>Best: {best}</span>
          {bonus && <span style={{ color: '#7fe0a0' }}>2× tickets</span>}
        </div>
        <Stage width={width} height={height}>
          {children}
          {status !== 'playing' && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(24,28,34,0.86)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', gap: 10, textAlign: 'center', padding: 20 }}>
              {status === 'ready' ? (
                <>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#f4e08a' }}>{title}</div>
                  <div style={{ fontSize: 13, maxWidth: 380, lineHeight: 1.4 }}>{intro}</div>
                  <MGButton color="green" style={{ fontSize: 13, marginTop: 6 }} onClick={onStart}>Start</MGButton>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#f4e08a' }}>{overTitle}</div>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>Score: {score}</div>
                  {reward && (
                    <div style={{ fontSize: 14 }}>
                      You earned <b><Coin size={14} /> {reward.bucks}</b> and <b><TicketIcon size={14} /> {reward.tickets}</b>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                    <MGButton color="green" onClick={onStart}>Play Again</MGButton>
                    <MGButton color="plain" onClick={() => onExit(reward && reward.bucks > 0 ? `Nice! +${reward.bucks} Maple Bucks from ${title}.` : undefined)}>Back to Arcade</MGButton>
                  </div>
                </>
              )}
            </div>
          )}
        </Stage>
      </div>
    </div>
  );
}

function Stage({ width, height, children }: { width: number; height: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const fit = () => { setScale(Math.min(1, el.offsetWidth / width, el.offsetHeight / height)); };
    fit(); const ro = new ResizeObserver(fit); ro.observe(el); return () => ro.disconnect();
  }, [width, height]);
  return (
    <div ref={ref} style={{ flex: 1, width: '100%', minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: width * scale, height: height * scale, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width, height, transform: `scale(${scale})`, transformOrigin: 'top left', border: '3px solid #161a20', borderRadius: 8, overflow: 'hidden', background: '#161a20', boxSizing: 'content-box' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
