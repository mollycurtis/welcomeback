'use client';

import { useEffect, useRef, useState } from 'react';
import type { AppWindowProps } from '@/lib/registry';
import { useSave } from '@/store/save';
import { useSystem } from '@/store/system';
import { useWindows } from '@/store/windows';
import { uid } from '@/lib/uid';
import { sounds } from '@/lib/sounds';

const CW = 600;
const CH = 400;

const COLORS = [
  '#000000', '#7a7a7a', '#7a1010', '#7a5b1a', '#0a5c0a', '#0a5c5c', '#0a1a7a', '#6a0a7a',
  '#ffffff', '#c0c0c0', '#e02020', '#f3c94b', '#3fae3f', '#3fc4c4', '#2a52d8', '#d84ad8',
];

type Tool = 'pencil' | 'eraser' | 'fill';

export default function Scribble({ windowId }: AppWindowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const dirty = useRef(false);

  const [tool, setTool] = useState<Tool>('pencil');
  const [size, setSize] = useState(3);
  const [color, setColor] = useState('#000000');
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const history = useRef<ImageData[]>([]);

  const addPainting = useSave((s) => s.addPainting);
  const prompt = useSystem((s) => s.prompt);
  const confirm = useSystem((s) => s.confirm);
  const alert = useSystem((s) => s.alert);
  const close = useWindows((s) => s.close);

  useEffect(() => {
    rootRef.current?.focus();
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CW, CH);
  }, []);

  const getCtx = () => canvasRef.current?.getContext('2d') ?? null;

  const pushHistory = () => {
    const ctx = getCtx();
    if (!ctx) return;
    try {
      history.current.push(ctx.getImageData(0, 0, CW, CH));
      if (history.current.length > 40) history.current.shift();
    } catch { }
  };

  const undo = () => {
    const ctx = getCtx();
    const img = history.current.pop();
    if (ctx && img) {
      ctx.putImageData(img, 0, 0);
      sounds.click();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
      e.preventDefault();
      undo();
    }
  };

  const stamp = (ctx: CanvasRenderingContext2D, x: number, y: number, c: string, s: number) => {
    ctx.fillStyle = c;
    const half = Math.floor(s / 2);
    ctx.fillRect(x - half, y - half, s, s);
  };

  const lineStamp = (
    ctx: CanvasRenderingContext2D,
    x0: number, y0: number, x1: number, y1: number,
    c: string, s: number
  ) => {
    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    let x = x0;
    let y = y0;
    for (;;) {
      stamp(ctx, x, y, c, s);
      if (x === x1 && y === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x += sx; }
      if (e2 <= dx) { err += dx; y += sy; }
    }
  };

  const floodFill = (ctx: CanvasRenderingContext2D, x: number, y: number, hex: string) => {
    const img = ctx.getImageData(0, 0, CW, CH);
    const d = img.data;
    const at = (px: number, py: number) => (py * CW + px) * 4;
    const t = at(x, y);
    const tr = d[t], tg = d[t + 1], tb = d[t + 2];
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    if (tr === r && tg === g && tb === b) return;
    const stack: Array<[number, number]> = [[x, y]];
    while (stack.length) {
      const next = stack.pop();
      if (!next) break;
      const [px, py] = next;
      if (px < 0 || py < 0 || px >= CW || py >= CH) continue;
      const i = at(px, py);
      if (d[i] !== tr || d[i + 1] !== tg || d[i + 2] !== tb) continue;
      d[i] = r; d[i + 1] = g; d[i + 2] = b; d[i + 3] = 255;
      stack.push([px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]);
    }
    ctx.putImageData(img, 0, 0);
  };

  const xyOf = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const fx = rect.width ? canvas.width / rect.width : 1;
    const fy = rect.height ? canvas.height / rect.height : 1;
    return {
      x: Math.floor((e.clientX - rect.left) * fx),
      y: Math.floor((e.clientY - rect.top) * fy),
    };
  };

  const strokeColor = () => (tool === 'eraser' ? '#ffffff' : color);
  const strokeSize = () => (tool === 'eraser' ? Math.max(size * 2, 8) : size);

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setMenuOpen(false);
    setEditOpen(false);
    const ctx = getCtx();
    if (!ctx) return;
    pushHistory();
    const { x, y } = xyOf(e);
    dirty.current = true;
    if (tool === 'fill') {
      floodFill(ctx, x, y, color);
      sounds.click();
      return;
    }
    drawing.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    stamp(ctx, x, y, strokeColor(), strokeSize());
    last.current = { x, y };
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = getCtx();
    if (!ctx || !last.current) return;
    const { x, y } = xyOf(e);
    lineStamp(ctx, last.current.x, last.current.y, x, y, strokeColor(), strokeSize());
    last.current = { x, y };
  };

  const onUp = () => {
    drawing.current = false;
    last.current = null;
  };

  const fileNew = async () => {
    setMenuOpen(false);
    if (dirty.current) {
      const yes = await confirm('Scribble', 'Clear the canvas?', { okLabel: 'Clear' });
      if (!yes) return;
    }
    const ctx = getCtx();
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CW, CH);
    dirty.current = false;
  };

  const fileSave = async () => {
    setMenuOpen(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const name = await prompt('Save Picture', 'Name your masterpiece:', {
      defaultValue: 'my drawing',
    });
    if (!name || !name.trim()) return;
    addPainting({
      id: uid(),
      name: name.trim().slice(0, 40),
      dataUrl: canvas.toDataURL('image/png'),
      createdAt: new Date().toISOString(),
    });
    sounds.chime();
    await alert('Scribble', 'Saved to My Pictures.\n\nThe computer will keep it.');
  };

  const filePrint = async () => {
    setMenuOpen(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const sheet = document.createElement('canvas');
    sheet.width = CW + 60;
    sheet.height = CH + 80;
    const ctx = sheet.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, sheet.width, sheet.height);
    ctx.drawImage(canvas, 30, 30);
    ctx.fillStyle = 'rgba(0,0,0,0.045)';
    for (let y = 30; y < CH + 30; y += 7) {
      ctx.fillRect(30, y, CW, 1);
    }
    ctx.fillStyle = '#9aa0a6';
    ctx.font = '11px Tahoma, sans-serif';
    ctx.fillText('printed on the family printer · ' + new Date().toLocaleDateString(), 30, CH + 58);

    sounds.printer();
    const a = document.createElement('a');
    a.href = sheet.toDataURL('image/png');
    a.download = 'printout.png';
    a.click();
    await alert('Scribble', 'Sent to printer.\n\n(Check your downloads tray.)');
  };

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={() => rootRef.current?.focus()}
      className="absolute inset-0 flex flex-col outline-none"
    >
      <div className="menubar relative flex win-noselect">
        <button onClick={() => { setEditOpen(false); setMenuOpen((v) => !v); }}>File</button>
        <button onClick={() => { setMenuOpen(false); setEditOpen((v) => !v); }}>Edit</button>
        {menuOpen && (
          <div className="menu-pop" style={{ left: 2, top: 22 }}>
            <button className="mi" onClick={() => void fileNew()}>New</button>
            <button className="mi" onClick={() => void fileSave()}>Save to My Pictures…</button>
            <button className="mi" onClick={() => void filePrint()}>Print</button>
            <hr className="msep" />
            <button className="mi" onClick={() => close(windowId)}>Exit</button>
          </div>
        )}
        {editOpen && (
          <div className="menu-pop" style={{ left: 38, top: 22 }}>
            <button className="mi" onClick={() => { setEditOpen(false); undo(); }}>Undo</button>
          </div>
        )}
      </div>

      <div className="flex-1 flex min-h-0">
        <div className="w-[88px] p-1.5 flex flex-col gap-1 win-noselect" style={{ borderRight: '1px solid var(--shadow-dark)' }}>
          {(['pencil', 'eraser', 'fill'] as Tool[]).map((t) => (
            <button
              key={t}
              className={'btn3d !px-1 text-[11px] capitalize' + (tool === t ? ' pressed' : '')}
              onClick={() => { setTool(t); sounds.click(); }}
            >
              {t}
            </button>
          ))}
          <div className="mt-2 text-[10px] text-center">Size</div>
          <div className="flex justify-center gap-1">
            {[1, 3, 8].map((s) => (
              <button
                key={s}
                className={'btn3d !p-0 w-[22px] h-[22px] inline-flex items-center justify-center' + (size === s ? ' pressed' : '')}
                onClick={() => { setSize(s); sounds.click(); }}
                aria-label={'Brush size ' + s}
              >
                <span style={{ width: s + 2, height: s + 2, background: '#000' }} />
              </button>
            ))}
          </div>
          <div className="mt-2 text-[10px] text-center">Colors</div>
          <div className="grid grid-cols-4 gap-[3px] justify-items-center">
            {COLORS.map((c) => (
              <button
                key={c}
                className="w-[16px] h-[16px] bevel-thin cursor-pointer p-0"
                style={{ background: c, outline: color === c ? '2px solid var(--sel-blue)' : 'none' }}
                onClick={() => { setColor(c); sounds.click(); }}
                aria-label={'Color ' + c}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-center">
            <span className="w-[34px] h-[22px] bevel-in inline-block" style={{ background: color }} />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-3" style={{ background: '#808080' }}>
          <canvas
            ref={canvasRef}
            width={CW}
            height={CH}
            className="bg-white"
            style={{
              imageRendering: 'pixelated',
              touchAction: 'none',
              cursor: 'crosshair',
              boxShadow: '2px 2px 0 rgba(0,0,0,0.4)',
            }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerLeave={onUp}
          />
        </div>
      </div>
    </div>
  );
}
