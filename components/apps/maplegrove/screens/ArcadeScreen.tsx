'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from 'react';
import { MG, MGButton, MGPanel, Coin, TicketIcon } from '../ui';
import { Hud } from '../Hud';
import { Backdrop, ShopPanel, Hotspot } from '../Backdrop';
import { useMaple } from '@/store/maplegrove';
import { PRIZES } from '@/lib/maplegrove/catalog';
import { RARITIES } from '@/lib/maplegrove/avatar';
import { currentSeason } from '@/lib/maplegrove/season';
import { Furniture } from '../Furniture';
import { HOUSE_BEST } from '../games/GameShell';
import { TreasureMatch } from '../games/TreasureMatch';
import { BurgerRush } from '../games/BurgerRush';
import { SkeeBall } from '../games/SkeeBall';
import { BlockDrop } from '../games/BlockDrop';
import { MazeChase } from '../games/MazeChase';

interface Cab { id: string; name: string; color: string; live: boolean; blurb: string }
const CABS: Cab[] = [
  { id: 'acorn', name: 'Acorn Catch', color: '#c9893f', live: true, blurb: 'Catch falling acorns. Dodge the rocks!' },
  { id: 'match', name: 'Treasure Match', color: '#5aa84a', live: true, blurb: 'Flip cards, find the matching gems.' },
  { id: 'burger', name: 'Burger Rush', color: '#e0608f', live: true, blurb: 'Stack orders before the timer runs out.' },
  { id: 'skee', name: 'Skee Ball', color: '#d8322a', live: true, blurb: 'Nine balls up the ramp. Aim for the rings, or the corner pockets.' },
  { id: 'maze', name: 'Pixel Quest', color: '#3f9a3a', live: true, blurb: 'A squirrel, a hedge maze, three gnomes. Collect every pixel.' },
  { id: 'blocks', name: 'Block Drop', color: '#7b4fa0', live: true, blurb: 'Falling blocks. Clear rows before the well fills up.' },
];

export function ArcadeScreen() {
  const highScores = useMaple((s) => s.highScores);
  const tickets = useMaple((s) => s.tickets);
  const buyGrocery = useMaple((s) => s.buyGrocery);
  const buyPrize = useMaple((s) => s.buyPrize);
  const [playing, setPlaying] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [pick, setPick] = useState<string | null>(null);
  const [prizes, setPrizes] = useState(false);
  const season = currentSeason();
  const flash = (m: string) => { setToast(m); window.setTimeout(() => setToast(''), 2200); };

  const exitGame = (msg?: string) => { setPlaying(null); if (msg) flash(msg); };
  if (playing === 'acorn') return <AcornCatch onExit={exitGame} />;
  if (playing === 'match') return <TreasureMatch onExit={exitGame} />;
  if (playing === 'burger') return <BurgerRush onExit={exitGame} />;
  if (playing === 'skee') return <SkeeBall onExit={exitGame} />;
  if (playing === 'maze') return <MazeChase onExit={exitGame} />;
  if (playing === 'blocks') return <BlockDrop onExit={exitGame} />;

  const cab = (id: string) => CABS.find((c) => c.id === id)!;

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <Hud title="Arcade" />
      <div style={{ position: 'relative', flex: 1 }}>
        <Backdrop bg="arcade" overlay={<>
          {pick && (
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', zIndex: 20, width: 240, lineHeight: 1.3 }}>
            <MGPanel pad={10} style={{ background: MG.paper, textAlign: 'center' }}>
              <div style={{ fontWeight: 900, fontSize: 15, color: MG.blue, textTransform: 'uppercase' }}>{cab(pick).name}</div>
              <div style={{ fontSize: 11, color: MG.sub, margin: '4px 0 8px' }}>{cab(pick).blurb}<br /><b style={{ color: MG.blueDk }}>{highScores[pick] ? `Your best: ${highScores[pick]}` : `On the board: ${HOUSE_BEST[pick] ?? 0}`}</b>{season.bonusGame === pick && <><br /><b style={{ color: MG.leaf }}>Double tickets this season!</b></>}</div>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                <MGButton color="green" style={{ fontSize: 13 }} onClick={() => { useMaple.getState().recordActivity('arcade'); setPlaying(pick); setPick(null); }}>Insert coin · Play</MGButton>
                <MGButton color="plain" style={{ fontSize: 13 }} onClick={() => setPick(null)}>Back</MGButton>
              </div>
            </MGPanel>
          </div>
          )}
          {prizes && (
            <ShopPanel title="Prize Corner, trade your tickets" onClose={() => setPrizes(false)} width="62%">
              <div style={{ fontSize: 11, color: MG.sub, marginBottom: 8 }}>You have <b><TicketIcon size={12} /> {tickets}</b>. Prizes go to your house inventory.</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
                {PRIZES.map((it) => {
              const afford = tickets >= it.price;
              return (
                <MGPanel key={it.id} pad={6} style={{ background: MG.paper, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minWidth: 0 }}>
                  <div style={{ height: 46, display: 'flex', alignItems: 'flex-end' }}><Furniture item={it} w={44} h={44} /></div>
                  <div style={{ fontSize: 10, fontWeight: 800, marginTop: 3, display: 'flex', alignItems: 'center', gap: 3, lineHeight: 1.1 }}><span style={{ width: 6, height: 6, borderRadius: 6, background: RARITIES[it.rarity].color, flex: '0 0 6px' }} />{it.name}</div>
                  <div style={{ fontSize: 11, fontWeight: 900, color: MG.blueDk, margin: '2px 0 4px' }}><TicketIcon size={12} /> {it.price}</div>
                  <MGButton color={afford ? 'gold' : 'plain'} disabled={!afford} style={{ width: '100%', fontSize: 10, padding: '2px 0' }} onClick={() => { if (buyPrize(it.id)) flash(`${it.name}! Traded and bagged. It is in your house inventory.`); }}>{afford ? 'Trade' : 'Need tickets'}</MGButton>
                </MGPanel>
              );
            })}
              </div>
            </ShopPanel>
          )}
          {toast && <div style={{ position: 'absolute', left: '50%', top: '44%', transform: 'translate(-50%,-50%)', background: 'rgba(40,30,52,0.92)', color: '#fff', padding: '8px 16px', borderRadius: 10, fontWeight: 700, fontSize: 13, zIndex: 30 }}>{toast}</div>}
        </>}>
          <Hotspot x={0} y={12} w={19} h={72} label="Prize Corner" onClick={() => setPrizes((v) => !v)} silent />
          <Hotspot x={19} y={27} w={10} h={40} label="Acorn Catch" onClick={() => setPick('acorn')} silent />
          <Hotspot x={30} y={27} w={10} h={40} label="Treasure Match" onClick={() => setPick('match')} silent />
          <Hotspot x={40} y={27} w={9.5} h={40} label="Burger Rush" onClick={() => setPick('burger')} silent />
          <Hotspot x={52} y={28} w={17} h={34} label="Skee Ball" onClick={() => setPick('skee')} silent />
          <Hotspot x={70} y={27} w={9.5} h={40} label="Pixel Quest" onClick={() => setPick('maze')} silent />
          <Hotspot x={80} y={27} w={10} h={40} label="Block Drop" onClick={() => setPick('blocks')} silent />
          <Hotspot x={92} y={27} w={8} h={40} label="Snacks" sub="Maple Chips, 2 MB" onClick={() => { if (buyGrocery('g_chips')) flash('Maple Chips added to your pantry.'); else flash('Not enough Maple Bucks for chips.'); }} labelAt="bottom" />
        </Backdrop>
      </div>
    </div>
  );
}

interface Falling { x: number; y: number; v: number; kind: 'acorn' | 'gold' | 'rock' }
const ACORN_BG: HTMLImageElement = typeof Image !== 'undefined' ? new Image() : ({} as HTMLImageElement);
if (typeof Image !== 'undefined') ACORN_BG.src = '/maplegrove/games/acorn.jpg';
const CW = 680, CH = 360, GAME_SECS = 30;

function AcornCatch({ onExit }: { onExit: (msg?: string) => void }) {
  const addBucks = useMaple((s) => s.addBucks);
  const addTickets = useMaple((s) => s.addTickets);
  const setHighScore = useMaple((s) => s.setHighScore);
  const best = useMaple((s) => s.highScores['acorn'] ?? 0);

  const [status, setStatus] = useState<'ready' | 'playing' | 'over'>('ready');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_SECS);
  const [reward, setReward] = useState<{ bucks: number; tickets: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const items = useRef<Falling[]>([]);
  const basket = useRef(CW / 2);
  const scoreRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastSpawn = useRef(0);
  const startT = useRef(0);

  useEffect(() => {
    if (status !== 'playing') return;
    items.current = []; scoreRef.current = 0; setScore(0); basket.current = CW / 2;
    startT.current = performance.now(); lastSpawn.current = 0;
    const ctx = canvasRef.current!.getContext('2d')!;

    const loop = (t: number) => {
      const elapsed = (t - startT.current) / 1000;
      const left = Math.max(0, GAME_SECS - elapsed);
      setTimeLeft(Math.ceil(left));

      const rate = 0.62 - Math.min(0.32, elapsed * 0.01);
      if (t - lastSpawn.current > rate * 1000) {
        lastSpawn.current = t;
        const roll = Math.random();
        const kind: Falling['kind'] = roll < 0.16 ? 'rock' : roll < 0.24 ? 'gold' : 'acorn';
        items.current.push({ x: 30 + Math.random() * (CW - 60), y: -20, v: 120 + Math.random() * 90 + elapsed * 4, kind });
      }
      const dt = 1 / 60;
      const bx = basket.current, by = CH - 34, halfW = 60;
      for (const it of items.current) {
        it.y += it.v * dt;
        if (it.y >= by - 6 && it.y <= by + 18 && Math.abs(it.x - bx) < halfW) {
          if (it.kind === 'rock') scoreRef.current = Math.max(0, scoreRef.current - 3);
          else scoreRef.current += it.kind === 'gold' ? 5 : 1;
          setScore(scoreRef.current);
          it.y = CH + 100;
        }
      }
      items.current = items.current.filter((it) => it.y < CH + 40);

      ctx.clearRect(0, 0, CW, CH);
      if (ACORN_BG.complete && ACORN_BG.naturalWidth) ctx.drawImage(ACORN_BG, 0, 0, CW, CH);
      else { const g = ctx.createLinearGradient(0, 0, 0, CH); g.addColorStop(0, '#bfe3f2'); g.addColorStop(1, '#d7eec4'); ctx.fillStyle = g; ctx.fillRect(0, 0, CW, CH); }
      for (const it of items.current) drawItem(ctx, it);
      drawBasket(ctx, bx, by);

      if (left <= 0) { endGame(); return; }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const endGame = () => {
    cancelAnimationFrame(rafRef.current);
    const final = scoreRef.current;
    const bucks = final * 3, tickets = Math.floor(final / 5) * (currentSeason().bonusGame === 'acorn' ? 2 : 1);
    addBucks(bucks); addTickets(tickets); setHighScore('acorn', final);
    setReward({ bucks, tickets }); setStatus('over');
  };

  const onMove = (clientX: number) => {
    const r = canvasRef.current!.getBoundingClientRect();
    basket.current = Math.max(46, Math.min(CW - 46, ((clientX - r.left) / r.width) * CW));
  };

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') basket.current = Math.max(46, basket.current - 34);
      if (e.key === 'ArrowRight') basket.current = Math.min(CW - 46, basket.current + 34);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: 'linear-gradient(#20242c,#2c323d)' }}>
      <Hud title="Acorn Catch" onBack={() => onExit()} backLabel="Arcade" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 10, minHeight: 0 }}>
        <div style={{ display: 'flex', gap: 18, marginBottom: 8, color: '#fff', fontWeight: 800, fontSize: 15 }}>
          <span>Score: {score}</span><span>Time: {timeLeft}s</span><span style={{ color: '#f4e08a' }}>Best: {best}</span>
        </div>
        <div style={{ position: 'relative', border: '3px solid #161a20', borderRadius: 8, overflow: 'hidden', background: '#bfe3f2' }}>
          <canvas ref={canvasRef} width={CW} height={CH} style={{ display: 'block', width: CW, height: CH, cursor: 'crosshair', touchAction: 'none' }}
            onMouseMove={(e) => onMove(e.clientX)}
            onTouchMove={(e) => onMove(e.touches[0].clientX)} />
          {status !== 'playing' && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(24,28,34,0.86)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', gap: 10, textAlign: 'center', padding: 20 }}>
              {status === 'ready' ? (
                <>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#f4e08a' }}>Acorn Catch</div>
                  <div style={{ fontSize: 13, maxWidth: 360 }}>Move your basket with the mouse (or arrow keys). Catch acorns for points, golden acorns are worth 5, and dodge the rocks. You have {GAME_SECS} seconds!</div>
                  <MGButton color="green" style={{ fontSize: 17, marginTop: 6 }} onClick={() => setStatus('playing')}>Start</MGButton>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#f4e08a' }}>Time&apos;s up!</div>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>Score: {score}</div>
                  {reward && (
                    <div style={{ fontSize: 14 }}>
                      You earned <b><Coin size={14} /> {reward.bucks}</b> and <b><TicketIcon size={14} /> {reward.tickets}</b>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                    <MGButton color="green" onClick={() => { setReward(null); setStatus('playing'); }}>Play Again</MGButton>
                    <MGButton color="plain" onClick={() => onExit(reward && reward.bucks > 0 ? `Nice! +${reward.bucks} Maple Bucks from Acorn Catch.` : undefined)}>Back to Arcade</MGButton>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function drawItem(ctx: CanvasRenderingContext2D, it: Falling) {
  if (it.kind === 'rock') {
    ctx.fillStyle = '#8a8a92'; ctx.beginPath(); ctx.arc(it.x, it.y, 11, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#6a6a72'; ctx.beginPath(); ctx.arc(it.x - 3, it.y + 2, 4, 0, Math.PI * 2); ctx.fill();
    return;
  }
  const body = it.kind === 'gold' ? '#eab53e' : '#b06a32';
  const cap = it.kind === 'gold' ? '#c4912a' : '#6f4421';
  ctx.fillStyle = body; ctx.beginPath(); ctx.ellipse(it.x, it.y + 2, 9, 11, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = cap; ctx.beginPath(); ctx.ellipse(it.x, it.y - 6, 10, 6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(it.x - 1, it.y - 14, 2, 5);
}
function drawBasket(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#9a5a2c'; ctx.beginPath();
  ctx.moveTo(x - 46, y - 14); ctx.lineTo(x + 46, y - 14); ctx.lineTo(x + 36, y + 18); ctx.lineTo(x - 36, y + 18); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#6f4421'; ctx.lineWidth = 3;
  for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(x + i * 12, y - 14); ctx.lineTo(x + i * 9, y + 18); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(x - 44, y - 8); ctx.lineTo(x + 44, y - 8); ctx.stroke();
  ctx.fillStyle = '#7a4421'; ctx.fillRect(x - 48, y - 16, 96, 4);
}
