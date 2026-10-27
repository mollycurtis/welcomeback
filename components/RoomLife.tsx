'use client';

import { SCREEN } from '@/lib/scene';

const LEAF_FRAMES = [0, 1, 2, 3, 4, 5];

export default function RoomLife({ focused, dim = false }: { focused: boolean; dim?: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0"
      style={{ zIndex: 1, clipPath: 'inset(0 ' + (100 - SCREEN.left + 0.5) + '% 0 0)',
        opacity: dim ? 0 : 1, transition: 'opacity 0.32s ease' }}>
      <div className="absolute" style={{ left: 0, top: 0, width: '16.75%', height: '31.77%',
        opacity: focused ? 0.25 : 1, transition: 'opacity 1.2s ease' }}>
        {LEAF_FRAMES.map((i) => (
          <img key={i} src={'/fx/leaf-' + i + '.webp'} alt="" draggable={false}
            className="wb-leaf absolute inset-0 w-full h-full" style={{ animationDelay: -i * 1.6 + 's' }} />
        ))}
      </div>
      <div className="absolute" style={{ left: '-4%', top: '-6%', width: '38%', height: '78%',
        opacity: focused ? 0.25 : 0.55, transition: 'opacity 1.2s ease' }}>
        <div className="wb-sunlight absolute inset-0" style={{
          mixBlendMode: 'soft-light',
          background: 'radial-gradient(ellipse at 28% 26%, rgba(255,238,190,0.7), rgba(255,220,150,0.24) 40%, rgba(255,220,150,0) 68%)',
        }} />
      </div>
    </div>
  );
}
