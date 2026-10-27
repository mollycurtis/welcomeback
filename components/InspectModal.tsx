'use client';

import { useEffect, useState } from 'react';
import { useSystem } from '@/store/system';
import { HOTSPOTS } from '@/lib/scene';
import { sounds } from '@/lib/sounds';

export default function InspectModal() {
  const inspecting = useSystem((s) => s.inspecting);
  const setInspecting = useSystem((s) => s.setInspecting);
  const [closing, setClosing] = useState(false);

  const hot = HOTSPOTS.find((h) => h.id === inspecting);

  const close = () => {
    if (closing) return;
    sounds.setDown();
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setInspecting(null);
    }, 360);
  };

  useEffect(() => {
    if (!inspecting) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inspecting]);

  if (!hot || !hot.inspect || !hot.inspect.image) return null;
  const spec = hot.inspect;

  const fromCX = hot.left + hot.width / 2;
  const fromCY = hot.top + hot.height / 2;
  const fromScale = Math.max(0.08, hot.width / (spec.bigPct ?? 52));

  const bigW = spec.bigPct ?? 52;
  const toCX = 49;
  const toCY = 50;

  const active = !closing;
  const cx = active ? toCX : fromCX;
  const cy = active ? toCY : fromCY;
  const scale = active ? 1 : fromScale;
  const opacity = active ? 1 : 0;
  const tilt = active ? 'rotateX(4deg) rotateZ(-1.4deg)' : 'rotateX(0deg) rotateZ(0deg)';

  return (
    <div
      className="absolute inset-0 z-[60]"
      style={{
        perspective: '1500px',
      }}
      onClick={close}
    >
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 49% 50%, rgba(20,14,8,0.28) 30%, rgba(20,14,8,0.5) 100%)',
        opacity: active ? 1 : 0, transition: 'opacity 0.32s ease', animation: 'wb-fade-in 0.32s ease',
      }} />
      <div
        className="absolute"
        style={{
          left: cx + '%',
          top: cy + '%',
          width: bigW + '%',
          transform: `translate(-50%, -50%) scale(${scale}) ${tilt}`,
          transformOrigin: 'center center',
          opacity,
          transition: active
            ? 'left 0.42s cubic-bezier(0.2,1,0.3,1), top 0.42s cubic-bezier(0.2,1,0.3,1), transform 0.42s cubic-bezier(0.2,1,0.3,1), opacity 0.28s ease-out'
            : 'left 0.32s cubic-bezier(0.4,0,0.2,1), top 0.32s cubic-bezier(0.4,0,0.2,1), transform 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.24s ease-out',
          filter:
            'drop-shadow(0 34px 40px rgba(0,0,0,0.5)) drop-shadow(0 10px 16px rgba(0,0,0,0.38))',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Set it down"
          onClick={close}
          className="absolute z-10 flex items-center justify-center cursor-pointer"
          style={{
            top: '-2%',
            right: '-1%',
            width: '7%',
            aspectRatio: '1',
            minWidth: 26,
            borderRadius: '50%',
            background: 'rgba(28,28,28,0.92)',
            color: '#fff',
            border: '2px solid #fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
            fontSize: 15,
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        <img
          src={spec.image}
          alt={spec.title}
          draggable={false}
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />
      </div>
    </div>
  );
}
