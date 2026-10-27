'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { AppWindowProps } from '@/lib/registry';
import { useWindows } from '@/store/windows';
import { sounds } from '@/lib/sounds';

type Suit = '♠' | '♥' | '♦' | '♣';
const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
const RED = new Set<Suit>(['♥', '♦']);
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

interface Card {
  id: string;
  suit: Suit;
  rank: number;
  faceUp: boolean;
}
interface Game {
  stock: Card[];
  waste: Card[];
  foundations: Card[][];
  tableau: Card[][];
}

const CW = 64;
const CH = 90;
const GAP = 14;
const PAD = 12;

function freshGame(): Game {
  const deck: Card[] = [];
  for (const s of SUITS)
    for (let r = 1; r <= 13; r++)
      deck.push({ id: s + r, suit: s, rank: r, faceUp: false });
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  const tableau: Card[][] = Array.from({ length: 7 }, () => []);
  let k = 0;
  for (let col = 0; col < 7; col++)
    for (let row = 0; row <= col; row++) {
      const card = deck[k++];
      card.faceUp = row === col;
      tableau[col].push(card);
    }
  return { stock: deck.slice(k), waste: [], foundations: [[], [], [], []], tableau };
}

const rankLabel = (r: number) => RANKS[r - 1];

export default function Solitaire({ windowId }: AppWindowProps) {
  const close = useWindows((s) => s.close);
  const [game, setGame] = useState<Game>(freshGame);
  const [won, setWon] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [drag, setDrag] = useState<{
    cards: Card[];
    from: { pile: 'tableau' | 'waste' | 'foundation'; index: number };
    gx: number;
    gy: number;
    x: number;
    y: number;
  } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [, forceFit] = useState(0);

  useEffect(() => {
    const bump = () => forceFit((n) => n + 1);
    bump();
    window.addEventListener('resize', bump);
    return () => window.removeEventListener('resize', bump);
  }, []);

  const newGame = useCallback(() => {
    setGame(freshGame());
    setWon(false);
  }, []);

  const colX = (i: number) => PAD + i * (CW + GAP);

  useEffect(() => {
    if (!won && game.foundations.every((f) => f.length === 13)) {
      setWon(true);
      sounds.chime();
    }
  }, [game, won]);

  const drawStock = () => {
    setGame((g) => {
      if (g.stock.length === 0) {
        if (g.waste.length === 0) return g;
        sounds.click();
        return { ...g, stock: g.waste.slice().reverse().map((c) => ({ ...c, faceUp: false })), waste: [] };
      }
      const stock = g.stock.slice();
      const card = stock.pop()!;
      card.faceUp = true;
      sounds.blip();
      return { ...g, stock, waste: [...g.waste, card] };
    });
  };

  const canFoundation = (card: Card, f: Card[]) =>
    f.length === 0 ? card.rank === 1 : f[f.length - 1].suit === card.suit && card.rank === f[f.length - 1].rank + 1;

  const canTableau = (card: Card, col: Card[]) => {
    if (col.length === 0) return card.rank === 13;
    const top = col[col.length - 1];
    return top.faceUp && RED.has(top.suit) !== RED.has(card.suit) && card.rank === top.rank - 1;
  };

  const [hintId, setHintId] = useState<string | null>(null);
  const [hintMsg, setHintMsg] = useState('');
  const findHint = (): { id: string; msg: string } | null => {
    const name = (c: Card) => `${['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'][c.rank]}${c.suit}`;
    const wTop = game.waste[game.waste.length - 1];
    if (wTop) { if (game.foundations.some((f) => canFoundation(wTop, f))) return { id: wTop.id, msg: `${name(wTop)} from the waste can go up to a foundation.` }; }
    for (let i = 0; i < 7; i++) { const col = game.tableau[i]; const top = col[col.length - 1]; if (top && top.faceUp && game.foundations.some((f) => canFoundation(top, f))) return { id: top.id, msg: `${name(top)} in column ${i + 1} can go up to a foundation.` }; }
    if (wTop) { const j = game.tableau.findIndex((c) => canTableau(wTop, c)); if (j >= 0) return { id: wTop.id, msg: `${name(wTop)} from the waste fits on column ${j + 1}.` }; }
    for (let i = 0; i < 7; i++) {
      const col = game.tableau[i]; const first = col.findIndex((c) => c.faceUp); if (first < 0) continue;
      for (let k = first; k < col.length; k++) {
        const c = col[k]; const j = game.tableau.findIndex((t, ti) => ti !== i && canTableau(c, t));
        if (j >= 0 && !(k === 0 && game.tableau[j].length === 0)) return { id: c.id, msg: `Move ${name(c)} from column ${i + 1} onto column ${j + 1}.` };
      }
    }
    if (game.stock.length) return { id: 'stock', msg: 'Nothing to move. Draw from the stock.' };
    return null;
  };
  const showHint = () => { const h = findHint(); setHintId(h?.id ?? null); setHintMsg(h ? h.msg : 'No moves left. Deal again?'); window.setTimeout(() => { setHintId(null); setHintMsg(''); }, 2600); };

  const sendToFoundation = (card: Card, from: { pile: 'tableau' | 'waste'; index: number }) => {
    setGame((g) => {
      const fi = g.foundations.findIndex((f) => canFoundation(card, f));
      if (fi < 0) return g;
      const next = structuredClone(g) as Game;
      if (from.pile === 'waste') next.waste.pop();
      else {
        next.tableau[from.index].pop();
        flipLast(next.tableau[from.index]);
      }
      next.foundations[fi].push({ ...card });
      sounds.blipLow();
      return next;
    });
  };

  const allFaceUp = (g: Game) => g.stock.length === 0 && g.waste.every((c) => c.faceUp) && g.tableau.every((col) => col.every((c) => c.faceUp));
  const canAutoFinish = allFaceUp(game) && game.foundations.reduce((n, f) => n + f.length, 0) < 52;

  const stepAutoFinish = (): boolean => {
    let moved = false;
    setGame((g) => {
      const next = structuredClone(g) as Game;
      const wTop = next.waste[next.waste.length - 1];
      if (wTop) {
        const fi = next.foundations.findIndex((f) => canFoundation(wTop, f));
        if (fi >= 0) { next.waste.pop(); next.foundations[fi].push(wTop); moved = true; return next; }
      }
      for (let i = 0; i < 7; i++) {
        const col = next.tableau[i]; const top = col[col.length - 1];
        if (!top) continue;
        const fi = next.foundations.findIndex((f) => canFoundation(top, f));
        if (fi >= 0) { col.pop(); flipLast(col); next.foundations[fi].push(top); moved = true; return next; }
      }
      return g;
    });
    return moved;
  };

  const autoFinish = () => {
    let n = 0;
    const tick = () => {
      if (n++ > 60) return;
      if (stepAutoFinish()) { sounds.blipLow(); window.setTimeout(tick, 90); }
    };
    tick();
  };

  const flipLast = (col: Card[]) => {
    if (col.length && !col[col.length - 1].faceUp) col[col.length - 1].faceUp = true;
  };

  const localXY = (cx: number, cy: number) => {
    const el = rootRef.current;
    if (!el) return { x: cx, y: cy };
    const rect = el.getBoundingClientRect();
    const fx = rect.width ? el.offsetWidth / rect.width : 1;
    const fy = rect.height ? el.offsetHeight / rect.height : 1;
    return { x: (cx - rect.left) * fx, y: (cy - rect.top) * fy };
  };

  const cardTopLeft = (
    from: { pile: 'tableau' | 'waste' | 'foundation'; index: number },
    cards: Card[]
  ) => {
    if (from.pile === 'waste') return { left: colX(1), top: 0 };
    if (from.pile === 'foundation') return { left: colX(3 + from.index), top: 0 };
    const col = game.tableau[from.index];
    const idx = col.findIndex((c) => c.id === cards[0].id);
    return { left: colX(from.index), top: (CH + 40) + (idx < 0 ? 0 : idx) * fan };
  };

  const startDrag = (
    e: React.PointerEvent,
    cards: Card[],
    from: { pile: 'tableau' | 'waste' | 'foundation'; index: number }
  ) => {
    if (won) return;
    const { x, y } = localXY(e.clientX, e.clientY);
    const tl = cardTopLeft(from, cards);
    setDrag({ cards, from, gx: x - tl.left, gy: y - tl.top, x, y });
    setMenuOpen(false);
  };

  useEffect(() => {
    if (!drag) return;
    const onMove = (ev: PointerEvent) => {
      const { x, y } = localXY(ev.clientX, ev.clientY);
      setDrag((d) => (d ? { ...d, x, y } : d));
    };
    const onUp = (ev: PointerEvent) => {
      const { x, y } = localXY(ev.clientX, ev.clientY);
      drop(x, y);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag]);

  const foundationY = 0;
  const drop = (x: number, y: number) => {
    if (!drag) return;
    const moving = drag.cards;
    const head = moving[0];

    if (moving.length === 1) {
      for (let i = 0; i < 4; i++) {
        const fx = colX(3 + i);
        if (x >= fx && x <= fx + CW && y >= foundationY && y <= foundationY + CH + 20) {
          if (canFoundation(head, game.foundations[i])) {
            commitMove(drag.from, { pile: 'foundation', index: i });
            setDrag(null);
            return;
          }
        }
      }
    }
    const tTop = CH + 40;
    for (let i = 0; i < 7; i++) {
      const tx = colX(i);
      if (x >= tx - GAP / 2 && x <= tx + CW + GAP / 2 && y >= tTop) {
        if (canTableau(head, game.tableau[i])) {
          commitMove(drag.from, { pile: 'tableau', index: i });
          setDrag(null);
          return;
        }
      }
    }
    sounds.click();
    setDrag(null);
  };

  const commitMove = (
    from: { pile: 'tableau' | 'waste' | 'foundation'; index: number },
    to: { pile: 'tableau' | 'foundation'; index: number }
  ) => {
    setGame((g) => {
      const next = structuredClone(g) as Game;
      let moving: Card[] = [];
      if (from.pile === 'waste') moving = [next.waste.pop()!];
      else if (from.pile === 'foundation') moving = [next.foundations[from.index].pop()!];
      else {
        const col = next.tableau[from.index];
        const fromIdx = col.findIndex((c) => c.id === drag!.cards[0].id);
        moving = col.splice(fromIdx);
        flipLast(col);
      }
      if (to.pile === 'foundation') next.foundations[to.index].push(...moving);
      else next.tableau[to.index].push(...moving);
      sounds.blipLow();
      return next;
    });
  };

  const faceUpRun = (col: Card[], i: number) => {
    const run = col.slice(i);
    return run.every((c) => c.faceUp) ? run : null;
  };

  const DW = colX(6) + CW + PAD;
  const maxLen = Math.max(1, ...game.tableau.map((c) => c.length));
  const cw = boxRef.current?.clientWidth ?? 600;
  const ch = boxRef.current?.clientHeight ?? 460;
  const fit = Math.min(cw / DW, 1);
  const availH = ch / fit - 8;
  const fan = maxLen > 1 ? Math.max(9, Math.min(24, (availH - (CH + 40) - CH) / (maxLen - 1))) : 24;
  const DH = (CH + 40) + (maxLen - 1) * fan + CH + 12;
  const offX = Math.max(0, (cw - DW * fit) / 2);
  const offY = 8;

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="menubar relative flex win-noselect">
        <button onClick={() => setMenuOpen((v) => !v)}>Game</button>
        <button onClick={showHint}>Hint</button>
        {canAutoFinish && <button onClick={autoFinish}>Finish</button>}
        {hintMsg && <span className="ml-3 text-[11px] self-center text-[#1a3a7a]">{hintMsg}</span>}
        {menuOpen && (
          <div className="menu-pop" style={{ left: 2, top: 22 }}>
            <button className="mi" onClick={() => { setMenuOpen(false); newGame(); }}>Deal</button>
            <button className="mi" onClick={() => { setMenuOpen(false); showHint(); }}>Hint (H)</button>
            <button className="mi" disabled={!canAutoFinish} onClick={() => { setMenuOpen(false); autoFinish(); }}>Finish game</button>
            <hr className="msep" />
            <button className="mi" onClick={() => close(windowId)}>Exit</button>
          </div>
        )}
      </div>

      <div
        ref={boxRef}
        className="flex-1 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#0a7a3a,#076a32)' }}
        onPointerDown={() => setMenuOpen(false)}
      >
       <div
         ref={rootRef}
         style={{
           position: 'absolute',
           width: DW,
           height: DH,
           transformOrigin: 'top left',
           transform: `translate(${offX}px, ${offY}px) scale(${fit})`,
         }}
       >
        <Slot x={colX(0)} y={0} onClick={drawStock}>
          {game.stock.length > 0 ? <CardBack /> : <Recycle />}
        </Slot>

        <div className="absolute" style={{ left: colX(1), top: 0, width: CW, height: CH }}>
          {game.waste.slice(-1).map((c) => (
            <CardFace
              key={c.id}
              card={c}
              glow={hintId === c.id}
              onPointerDown={(e) => startDrag(e, [c], { pile: 'waste', index: 0 })}
              onDoubleClick={() => sendToFoundation(c, { pile: 'waste', index: 0 })}
              hidden={drag?.from.pile === 'waste' && drag.cards[0].id === c.id}
            />
          ))}
        </div>

        {game.foundations.map((f, i) => (
          <Slot key={i} x={colX(3 + i)} y={0} label={f.length === 0 ? SUITS[i] : undefined}>
            {f.slice(-1).map((c) => (
              <CardFace
                key={c.id}
                card={c}
                glow={hintId === c.id}
                onPointerDown={(e) => startDrag(e, [c], { pile: 'foundation', index: i })}
              />
            ))}
          </Slot>
        ))}

        {game.tableau.map((col, i) => (
          <div key={i} className="absolute" style={{ left: colX(i), top: CH + 40 }}>
            {col.length === 0 && <EmptySlot />}
            {col.map((c, j) => {
              const run = c.faceUp ? faceUpRun(col, j) : null;
              const isDragged =
                drag?.from.pile === 'tableau' &&
                drag.from.index === i &&
                drag.cards.some((dc) => dc.id === c.id);
              return (
                <div key={c.id} className="absolute" style={{ top: j * fan, left: 0 }}>
                  {c.faceUp ? (
                    <CardFace
                      card={c}
                      glow={hintId === c.id}
                      hidden={isDragged}
                      onPointerDown={(e) => run && startDrag(e, run, { pile: 'tableau', index: i })}
                      onDoubleClick={() =>
                        run && run.length === 1 && sendToFoundation(c, { pile: 'tableau', index: i })
                      }
                    />
                  ) : (
                    <CardBack />
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {drag && (
          <div
            className="absolute pointer-events-none z-[500]"
            style={{ left: drag.x - drag.gx, top: drag.y - drag.gy }}
          >
            {drag.cards.map((c, j) => (
              <div key={c.id} className="absolute" style={{ top: j * 24 }}>
                <CardFace card={c} glow={hintId === c.id} />
              </div>
            ))}
          </div>
        )}
       </div>

        {won && <WinCascade onDone={() => {}} />}
        {won && (
          <div className="absolute inset-0 flex items-center justify-center z-[600] pointer-events-none">
            <div className="bevel-out px-6 py-4 text-center pointer-events-auto">
              <p className="text-[15px] font-bold mb-1">You win!</p>
              <p className="text-[12px] mb-3">Told you the cascade was worth it.</p>
              <button className="btn3d" onClick={newGame}>Deal Again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Slot({
  x,
  y,
  children,
  onClick,
  label,
}: {
  x: number;
  y: number;
  children?: React.ReactNode;
  onClick?: () => void;
  label?: string;
}) {
  return (
    <div
      className="absolute"
      style={{ left: x, top: y, width: CW, height: CH }}
      onClick={onClick}
    >
      <EmptySlot label={label} />
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}

function EmptySlot({ label }: { label?: string }) {
  return (
    <div
      className="absolute inset-0 rounded-[5px] flex items-center justify-center"
      style={{ border: '2px solid rgba(255,255,255,0.35)', background: 'rgba(0,0,0,0.08)', width: CW, height: CH }}
    >
      {label && <span className="text-[26px] text-white/40">{label}</span>}
    </div>
  );
}

function CardBack() {
  return (
    <div
      className="rounded-[5px]"
      style={{
        width: CW,
        height: CH,
        border: '2px solid #fff',
        background: 'repeating-linear-gradient(45deg,#1a4a8a 0 6px,#2a5a9a 6px 12px)',
        boxShadow: '1px 1px 2px rgba(0,0,0,0.4)',
      }}
    />
  );
}

function Recycle() {
  return (
    <div
      className="rounded-[5px] flex items-center justify-center text-white/70 text-[22px]"
      style={{ width: CW, height: CH, border: '2px solid rgba(255,255,255,0.5)' }}
    >
      ↻
    </div>
  );
}

function CardFace({
  card,
  onPointerDown,
  onDoubleClick,
  hidden,
  glow,
}: {
  card: Card;
  onPointerDown?: (e: React.PointerEvent) => void;
  onDoubleClick?: () => void;
  hidden?: boolean;
  glow?: boolean;
}) {
  const red = RED.has(card.suit);
  return (
    <div
      className="rounded-[5px] bg-white select-none"
      style={{
        width: CW,
        height: CH,
        border: '1px solid #999',
        boxShadow: glow ? '0 0 0 3px #ffd400, 0 0 14px 4px #ffd400' : '1px 1px 2px rgba(0,0,0,0.35)',
        color: red ? '#c8102e' : '#1a1a1a',
        visibility: hidden ? 'hidden' : 'visible',
        cursor: onPointerDown ? 'grab' : 'default',
        position: 'relative',
      }}
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
    >
      <div className="absolute top-[3px] left-[4px] leading-none text-[14px] font-bold">
        {rankLabel(card.rank)}
      </div>
      <div className="absolute top-[16px] left-[4px] leading-none text-[12px]">{card.suit}</div>
      <div className="absolute inset-0 flex items-center justify-center text-[26px]">{card.suit}</div>
    </div>
  );
}

function WinCascade({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    const ctx = canvas.getContext('2d')!;
    type B = { x: number; y: number; vx: number; vy: number; suit: Suit; rank: number };
    const balls: B[] = [];
    let frame = 0;
    let raf = 0;
    const spawn = () => {
      const suit = SUITS[Math.floor(Math.random() * 4)];
      balls.push({
        x: canvas.width / 2 + (Math.random() * 200 - 100),
        y: 30,
        vx: (Math.random() * 2 - 1) * 6,
        vy: -(Math.random() * 4 + 2),
        suit,
        rank: Math.floor(Math.random() * 13) + 1,
      });
    };
    const drawCard = (b: B) => {
      const red = RED.has(b.suit);
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#999';
      const x = Math.round(b.x);
      const y = Math.round(b.y);
      ctx.fillRect(x, y, CW, CH);
      ctx.strokeRect(x, y, CW, CH);
      ctx.fillStyle = red ? '#c8102e' : '#1a1a1a';
      ctx.font = 'bold 14px Tahoma, sans-serif';
      ctx.fillText(rankLabel(b.rank), x + 4, y + 16);
      ctx.font = '24px Tahoma, sans-serif';
      ctx.fillText(b.suit, x + CW / 2 - 8, y + CH / 2 + 8);
    };
    const tick = () => {
      frame++;
      if (frame % 6 === 0 && balls.length < 220) spawn();
      for (const b of balls) {
        b.vy += 0.28;
        b.x += b.vx;
        b.y += b.vy;
        if (b.y + CH > canvas.height) {
          b.y = canvas.height - CH;
          b.vy *= -0.78;
          if (Math.abs(b.vy) < 2) b.vy = -(Math.random() * 6 + 4);
        }
        if (b.x < -CW || b.x > canvas.width) b.vx *= -1;
        drawCard(b);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);
  return <canvas ref={ref} className="absolute inset-0 z-[550] pointer-events-none" />;
}
