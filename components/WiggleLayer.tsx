'use client';

import { useEffect, useRef, useState } from 'react';
import { HOTSPOTS } from '@/lib/scene';
import { sounds } from '@/lib/sounds';

const SPRITE_BY_ID: Record<string, string> = {
  pencup: '/pen-cup-sprite.png',
};

const SPRITE_RECT_BY_ID: Record<string, { left: number; top: number; width: number }> = {
  pencup: { left: 77.5, top: 44.0, width: 12.5 },
};

const SPRITE_SPLIT_BY_ID: Record<string, { rim: number }> = {
  pencup: { rim: 0.5 },
};

export default function WiggleLayer() {
  const [active, setActive] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  useEffect(() => {
    const onWiggle = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (!SPRITE_BY_ID[id]) return;
      sounds.rattle();
      setActive(id);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setActive(null), 650);
    };
    window.addEventListener('wb-wiggle', onWiggle as EventListener);
    return () => window.removeEventListener('wb-wiggle', onWiggle as EventListener);
  }, []);

  return (
    <>
      {HOTSPOTS.filter((h) => h.kind === 'wiggle' && SPRITE_BY_ID[h.id]).map((h) => {
        const r = SPRITE_RECT_BY_ID[h.id] ?? { left: h.left, top: h.top, width: h.width };
        const split = SPRITE_SPLIT_BY_ID[h.id];
        const common = {
          left: r.left + '%',
          top: r.top + '%',
          width: r.width + '%',
          height: 'auto' as const,
          zIndex: 30,
        };
        if (split) {
          const rim = split.rim * 100;
          return (
            <span key={h.id}>
              <img
                src={SPRITE_BY_ID[h.id]}
                alt=""
                aria-hidden="true"
                draggable={false}
                className="absolute pointer-events-none"
                style={{
                  ...common,
                  clipPath: 'inset(0 0 ' + (100 - rim - 3) + '% 0)',
                  transformOrigin: '50% ' + rim + '%',
                  transform: 'rotate(0deg)',
                  animation: active === h.id ? 'wb-pens-sway 0.62s ease-in-out' : 'none',
                }}
              />
              <img
                src={SPRITE_BY_ID[h.id]}
                alt=""
                aria-hidden="true"
                draggable={false}
                className="absolute pointer-events-none"
                style={{ ...common, clipPath: 'inset(' + rim + '% 0 0 0)' }}
              />
            </span>
          );
        }
        return (
          <img
            key={h.id}
            src={SPRITE_BY_ID[h.id]}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute pointer-events-none"
            style={{
              ...common,
              transformOrigin: '50% 88%',
              transform: 'rotate(0deg)',
              animation: active === h.id ? 'wb-cap-nudge 0.62s ease-in-out' : 'none',
            }}
          />
        );
      })}
      <style>{`
        @keyframes wb-cap-nudge {
          0%   { transform: rotate(0deg) translateY(0); }
          18%  { transform: rotate(-7deg) translateY(-1%); }
          42%  { transform: rotate(5deg) translateY(0); }
          64%  { transform: rotate(-3deg) translateY(0); }
          82%  { transform: rotate(1.4deg) translateY(0); }
          100% { transform: rotate(0deg) translateY(0); }
        }
        @keyframes wb-pens-sway {
          0%   { transform: rotate(0deg); }
          20%  { transform: rotate(-5deg); }
          45%  { transform: rotate(3.4deg); }
          68%  { transform: rotate(-1.9deg); }
          85%  { transform: rotate(0.9deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </>
  );
}
