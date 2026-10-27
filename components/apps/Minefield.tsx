'use client';

import { useEffect, useRef, useState } from 'react';
import type { AppWindowProps } from '@/lib/registry';
import { useWindows } from '@/store/windows';
import { sounds } from '@/lib/sounds';

type Diff = { name: string; cols: number; rows: number; mines: number };
const DIFFS: Record<string, Diff> = {
  beginner: { name: 'Beginner', cols: 9, rows: 9, mines: 10 },
  intermediate: { name: 'Intermediate', cols: 16, rows: 16, mines: 40 },
  expert: { name: 'Expert', cols: 30, rows: 16, mines: 99 },
};

interface Cell {
  mine: boolean;
  adj: number;
  revealed: boolean;
  flagged: boolean;
}

const NUM_COLORS = ['', '#1a1ad8', '#1a7a1a', '#d81a1a', '#101080', '#7a1a1a', '#1a7a7a', '#000', '#7a7a7a'];

function blankBoard(d: Diff): Cell[] {
  return Array.from({ length: d.cols * d.rows }, () => ({
    mine: false,
    adj: 0,
    revealed: false,
    flagged: false,
  }));
}

export default function Minefield({ windowId }: AppWindowProps) {
  const close = useWindows((s) => s.close);
  const [diffKey, setDiffKey] = useState('beginner');
  const d = DIFFS[diffKey];

  const [board, setBoard] = useState<Cell[]>(() => blankBoard(d));
  const [state, setState] = useState<'fresh' | 'playing' | 'won' | 'lost'>('fresh');
  const [time, setTime] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [poke, setPoke] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const idx = (c: number, r: number) => r * d.cols + c;
  const inBounds = (c: number, r: number) => c >= 0 && r >= 0 && c < d.cols && r < d.rows;
  const neighbors = (c: number, r: number) => {
    const out: number[] = [];
    for (let dc = -1; dc <= 1; dc++)
      for (let dr = -1; dr <= 1; dr++) {
        if (!dc && !dr) continue;
        if (inBounds(c + dc, r + dr)) out.push(idx(c + dc, r + dr));
      }
    return out;
  };

  const reset = (dd: Diff = d) => {
    if (timer.current) clearInterval(timer.current);
    setBoard(blankBoard(dd));
    setState('fresh');
    setTime(0);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => reset(d), [diffKey]);

  useEffect(() => {
    if (state === 'playing') {
      timer.current = setInterval(() => setTime((t) => Math.min(t + 1, 999)), 1000);
      return () => {
        if (timer.current) clearInterval(timer.current);
      };
    }
  }, [state]);

  const flags = board.filter((c) => c.flagged).length;
  const minesLeft = Math.max(0, d.mines - flags);

  const layMines = (safe: number): Cell[] => {
    const next = blankBoard(d);
    const safeC = safe % d.cols;
    const safeR = Math.floor(safe / d.cols);
    const forbidden = new Set<number>([safe, ...neighbors(safeC, safeR)]);
    let placed = 0;
    while (placed < d.mines) {
      const i = Math.floor(Math.random() * next.length);
      if (next[i].mine || forbidden.has(i)) continue;
      next[i].mine = true;
      placed++;
    }
    for (let r = 0; r < d.rows; r++)
      for (let c = 0; c < d.cols; c++) {
        if (next[idx(c, r)].mine) continue;
        next[idx(c, r)].adj = neighbors(c, r).filter((n) => next[n].mine).length;
      }
    return next;
  };

  const floodReveal = (cells: Cell[], start: number) => {
    const stack = [start];
    while (stack.length) {
      const i = stack.pop()!;
      const c = cells[i];
      if (c.revealed || c.flagged) continue;
      c.revealed = true;
      if (c.adj === 0 && !c.mine) {
        const cc = i % d.cols;
        const rr = Math.floor(i / d.cols);
        neighbors(cc, rr).forEach((n) => {
          if (!cells[n].revealed) stack.push(n);
        });
      }
    }
  };

  const checkWin = (cells: Cell[]) =>
    cells.every((c) => c.mine || c.revealed);

  const loseWith = (cells: Cell[]) => {
    cells.forEach((c) => {
      if (c.mine) c.revealed = true;
    });
    setState('lost');
    sounds.boom();
  };

  const reveal = (i: number) => {
    if (state === 'won' || state === 'lost') return;
    let cells: Cell[];
    let s = state;
    if (state === 'fresh') {
      cells = layMines(i);
      s = 'playing';
      setState('playing');
    } else {
      cells = board.map((c) => ({ ...c }));
    }
    const cell = cells[i];
    if (cell.flagged || cell.revealed) return;
    if (cell.mine) {
      loseWith(cells);
      setBoard(cells);
      return;
    }
    floodReveal(cells, i);
    sounds.blip();
    if (checkWin(cells)) {
      setState('won');
      sounds.chime();
    } else if (s !== state) {
    }
    setBoard(cells);
  };

  const chord = (i: number) => {
    if (state !== 'playing') return;
    const cell = board[i];
    if (!cell.revealed || cell.adj === 0) return;
    const c = i % d.cols;
    const r = Math.floor(i / d.cols);
    const ns = neighbors(c, r);
    const flagged = ns.filter((n) => board[n].flagged).length;
    if (flagged !== cell.adj) return;
    const cells = board.map((x) => ({ ...x }));
    let hitMine = false;
    ns.forEach((n) => {
      if (!cells[n].flagged && !cells[n].revealed) {
        if (cells[n].mine) hitMine = true;
        else floodReveal(cells, n);
      }
    });
    if (hitMine) {
      loseWith(cells);
    } else if (checkWin(cells)) {
      setState('won');
      sounds.chime();
    } else {
      sounds.blip();
    }
    setBoard(cells);
  };

  const flag = (i: number) => {
    if (state === 'won' || state === 'lost') return;
    if (board[i].revealed) return;
    const cells = board.map((c) => ({ ...c }));
    cells[i].flagged = !cells[i].flagged;
    sounds.click();
    setBoard(cells);
  };

  const face = state === 'lost' ? '😵' : state === 'won' ? '😎' : poke ? '😮' : '🙂';
  const digits = (n: number) => String(Math.max(0, Math.min(999, n))).padStart(3, '0');

  return (
    <div className="absolute inset-0 flex flex-col bg-[var(--face)]">
      <div className="menubar relative flex win-noselect">
        <button onClick={() => setMenuOpen((v) => !v)}>Game</button>
        {menuOpen && (
          <div className="menu-pop" style={{ left: 2, top: 22 }}>
            <button className="mi" onClick={() => { setMenuOpen(false); reset(); }}>New Game</button>
            <hr className="msep" />
            {Object.entries(DIFFS).map(([k, dd]) => (
              <button
                key={k}
                className="mi"
                onClick={() => { setMenuOpen(false); setDiffKey(k); }}
              >
                {diffKey === k ? '● ' : '\u00A0\u00A0'}
                {dd.name}
              </button>
            ))}
            <hr className="msep" />
            <button className="mi" onClick={() => close(windowId)}>Exit</button>
          </div>
        )}
      </div>

      <div className="p-2 flex-1 flex flex-col items-center justify-center overflow-auto" onPointerDown={() => setMenuOpen(false)}>
        <div className="bevel-in p-2" style={{ background: '#c0bca e'.replace(' ', '') }}>
          <div className="bevel-thin flex items-center justify-between px-2 py-1 mb-2" style={{ background: '#bdb5a0' }}>
            <span className="lcd px-1 text-[20px] leading-none">{digits(minesLeft)}</span>
            <button
              className="btn3d !p-0 w-[30px] h-[30px] text-[18px] leading-none"
              onClick={() => reset()}
              aria-label="New game"
            >
              {face}
            </button>
            <span className="lcd px-1 text-[20px] leading-none">{digits(time)}</span>
          </div>

          <div
            className="bevel-in inline-grid mx-auto"
            style={{ gridTemplateColumns: `repeat(${d.cols}, 22px)` }}
            onContextMenu={(e) => e.preventDefault()}
          >
            {board.map((cell, i) => (
              <CellBtn
                key={i}
                cell={cell}
                onReveal={() => reveal(i)}
                onChord={() => chord(i)}
                onFlag={() => flag(i)}
                onPoke={(v) => setPoke(v)}
              />
            ))}
          </div>
        </div>
        <p className="text-[10px] text-[#5a5a5a] mt-1.5 text-center">
          left-click reveal · right-click flag · click a number to chord
        </p>
      </div>
    </div>
  );
}

function CellBtn({
  cell,
  onReveal,
  onChord,
  onFlag,
  onPoke,
}: {
  cell: Cell;
  onReveal: () => void;
  onChord: () => void;
  onFlag: () => void;
  onPoke: (v: boolean) => void;
}) {
  if (cell.revealed) {
    return (
      <span
        className="w-[22px] h-[22px] inline-flex items-center justify-center text-[13px] font-bold select-none"
        style={{
          border: '1px solid #b0b0a0',
          background: cell.mine ? '#d81a1a' : '#cdc8b8',
          color: NUM_COLORS[cell.adj] || '#000',
        }}
        onClick={cell.adj ? onChord : undefined}
      >
        {cell.mine ? '✸' : cell.adj || ''}
      </span>
    );
  }
  return (
    <button
      className="w-[22px] h-[22px] btn3d !p-0 inline-flex items-center justify-center text-[13px] leading-none"
      onClick={onReveal}
      onContextMenu={(e) => {
        e.preventDefault();
        onFlag();
      }}
      onPointerDown={() => onPoke(true)}
      onPointerUp={() => onPoke(false)}
      onPointerLeave={() => onPoke(false)}
    >
      {cell.flagged ? '🚩' : ''}
    </button>
  );
}
