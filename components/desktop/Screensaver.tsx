'use client';

import { useEffect, useRef, useState } from 'react';
import { useSystem } from '@/store/system';
import { useSave } from '@/store/save';

const COLORS = ['#ffd54a', '#7ec4ff', '#ff7ec4', '#9fe870', '#ffb45e', '#c9a0ff'];

export default function Screensaver() {
  const dialogCount = useSystem((s) => s.dialogs.length);
  const recordCornerHit = useSave((s) => s.recordCornerHit);
  const ssText = useSave((s) => s.ssText);
  const ssWaitMs = useSave((s) => s.ssWaitMs);

  const [active, setActive] = useState(false);
  const [colorIdx, setColorIdx] = useState(0);

  const activeRef = useRef(false);
  const lastInputRef = useRef(Date.now());
  const wrapRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  activeRef.current = active;

  useEffect(() => {
    const poke = () => {
      lastInputRef.current = Date.now();
      if (activeRef.current) {
        setActive(false);
      }
    };
    window.addEventListener('pointermove', poke);
    window.addEventListener('pointerdown', poke);
    window.addEventListener('keydown', poke);
    const t = setInterval(() => {
      if (!activeRef.current && dialogCount === 0 && Date.now() - lastInputRef.current > ssWaitMs) {
        setActive(true);
      }
    }, 4000);
    return () => {
      window.removeEventListener('pointermove', poke);
      window.removeEventListener('pointerdown', poke);
      window.removeEventListener('keydown', poke);
      clearInterval(t);
    };
  }, [dialogCount, ssWaitMs]);

  useEffect(() => {
    if (!active) return;
    const wrap = wrapRef.current;
    const box = boxRef.current;
    if (!wrap || !box) return;

    let x = 60;
    let y = 60;
    let vx = 62;
    let vy = 50;
    let raf = 0;

    let prevT = performance.now();
    const step = (now?: number) => {
      const t = now ?? performance.now();
      const dt = Math.min(0.05, (t - prevT) / 1000); prevT = t;
      const W = wrap.clientWidth;
      const H = wrap.clientHeight;
      const bw = box.offsetWidth;
      const bh = box.offsetHeight;
      x += vx * dt;
      y += vy * dt;
      let hitX = false;
      let hitY = false;
      if (x <= 0) { x = 0; vx = -vx; hitX = true; }
      else if (x + bw >= W) { x = W - bw; vx = -vx; hitX = true; }
      if (y <= 0) { y = 0; vy = -vy; hitY = true; }
      else if (y + bh >= H) { y = H - bh; vy = -vy; hitY = true; }

      if (hitX || hitY) setColorIdx((c) => (c + 1) % COLORS.length);
      if (hitX && hitY) recordCornerHit();

      box.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, recordCornerHit]);

  if (!active) return null;

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 bg-black overflow-hidden"
      style={{ zIndex: 9800, cursor: 'none' }}
    >
      <div ref={boxRef} className="absolute will-change-transform">
        <span
          className="font-bios text-3xl tracking-[0.15em] whitespace-nowrap"
          style={{ color: COLORS[colorIdx] }}
        >
          {ssText || 'Welcome Back'}
        </span>
      </div>
    </div>
  );
}
