'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

export const GW = 480, GH = 320;

export function useKeys() {
  const keys = useRef<Set<string>>(new Set());
  useEffect(() => {
    const d = (e: KeyboardEvent) => { if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) e.preventDefault(); keys.current.add(e.key); };
    const u = (e: KeyboardEvent) => keys.current.delete(e.key);
    window.addEventListener('keydown', d); window.addEventListener('keyup', u);
    return () => { window.removeEventListener('keydown', d); window.removeEventListener('keyup', u); };
  }, []);
  return keys;
}

export function useLoop(run: boolean, step: (dt: number) => void) {
  const ref = useRef(step); ref.current = step;
  useEffect(() => {
    if (!run) return;
    let raf = 0, last = performance.now();
    const tick = (t: number) => { const dt = Math.min(0.05, (t - last) / 1000); last = t; ref.current(dt); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run]);
}

export function GameFrame({ title, color, children, status, onBack, controls, canvasRef, onCanvasPointer }: {
  title: string; color: string; children?: ReactNode; status: ReactNode; onBack: () => void; controls: string;
  canvasRef: React.RefObject<HTMLCanvasElement | null>; onCanvasPointer?: (x: number, y: number, kind: 'down' | 'move' | 'up') => void;
}) {
  const [focused, setFocused] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const pt = (e: React.PointerEvent, kind: 'down' | 'move' | 'up') => {
    if (!onCanvasPointer || !canvasRef.current) return;
    const r = canvasRef.current.getBoundingClientRect();
    onCanvasPointer(((e.clientX - r.left) / r.width) * GW, ((e.clientY - r.top) / r.height) * GH, kind);
  };
  return (
    <div style={{ fontFamily: 'Verdana, Tahoma, sans-serif', background: '#dfe9f7', minHeight: '100%', padding: 10 }}>
      <div style={{ background: color, color: '#fff', fontWeight: 900, fontSize: 15, padding: '5px 10px', borderRadius: '6px 6px 0 0', display: 'flex', alignItems: 'center' }}>
        ▶ {title}<span style={{ flex: 1 }} /><span className="link-1999" style={{ color: '#fff', fontSize: 11, fontWeight: 400 }} onClick={onBack}>&larr; back to GameFort</span>
      </div>
      <div ref={wrap} tabIndex={0} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onPointerDown={() => wrap.current?.focus()}
        style={{ background: '#000', border: `3px solid ${color}`, borderTop: 'none', outline: 'none', position: 'relative', lineHeight: 0 }}>
        <canvas ref={canvasRef} width={GW} height={GH} style={{ width: '100%', display: 'block', imageRendering: 'pixelated', touchAction: 'none' }}
          onPointerDown={(e) => pt(e, 'down')} onPointerMove={(e) => pt(e, 'move')} onPointerUp={(e) => pt(e, 'up')} />
        {!focused && <div style={{ position: 'absolute', bottom: 6, left: 0, right: 0, textAlign: 'center', color: '#fff', fontSize: 10, lineHeight: 1.2, opacity: 0.8, pointerEvents: 'none' }}>click the game to give it the keyboard</div>}
        {children}
      </div>
      <div style={{ display: 'flex', gap: 12, fontSize: 11, padding: '6px 2px', color: '#1a2a55', alignItems: 'center', flexWrap: 'wrap' }}>
        <span>{status}</span><span style={{ flex: 1 }} /><span style={{ color: '#5a6a8a' }}>{controls}</span>
      </div>
    </div>
  );
}

export function Overlay({ children, color, onClick }: { children: ReactNode; color: string; onClick: () => void }) {
  return (
    <div onClick={onClick} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', lineHeight: 1.3 }}>
      <div style={{ background: '#fff', border: `4px solid ${color}`, borderRadius: 8, padding: '12px 22px', textAlign: 'center', fontSize: 13, color: '#1a2a55', minWidth: 200 }}>{children}</div>
    </div>
  );
}

export function useBest(key: string) {
  const [best, setBest] = useState<number>(() => { try { return Number(sessionStorage.getItem('gamefort-' + key) ?? 0); } catch { return 0; } });
  const record = (v: number) => { if (v > best) { setBest(v); try { sessionStorage.setItem('gamefort-' + key, String(v)); } catch { } } };
  return { best, record };
}
