'use client';
/* eslint-disable @next/next/no-img-element */

import type { MGAvatar } from '@/store/maplegrove';

const AV = '/maplegrove/avatars';
export const RESIDENTS_HAVE_ART = true;
const HEAD_TOP: Record<string, number> = { 'avatar-1': 15, 'avatar-10': 15, 'avatar-11': 15, 'avatar-12': 19, 'avatar-14': 17, 'avatar-15': 15, 'avatar-4': 15, 'avatar-7': 15, 'avatar-8': 19, 'avatar-9': 19, 'resident-1': 15, 'resident-10': 35, 'resident-11': 56, 'resident-12': 110, 'resident-13': 32, 'resident-14': 41, 'resident-15': 32, 'resident-2': 17, 'resident-4': 19, 'resident-8': 37, 'resident-9': 33 };
const DEFAULT_TOP = 14;

export function Avatar({ a, size = 120, bust = false, residentIndex }: { a: MGAvatar; size?: number; bust?: boolean; residentIndex?: number }) {
  const SRC = 600;
  const CROP = 220, CROP_X = 40;
  const key = RESIDENTS_HAVE_ART && residentIndex !== undefined ? `resident-${residentIndex}` : `avatar-${a.preset ?? 0}`;
  const src = `${AV}/${key}.png`;
  const CROP_Y = Math.max(0, (HEAD_TOP[key] ?? DEFAULT_TOP) - 4);

  if (bust) {
    const k = size / CROP;
    return (
      <div style={{ width: size, height: size, position: 'relative', overflow: 'hidden', borderRadius: '50%', background: 'linear-gradient(#eaf2ff, #cfe0f5)', flex: '0 0 auto' }}>
        <img src={src} alt="" draggable={false} style={{ position: 'absolute',
          left: -CROP_X * k, top: -CROP_Y * k,
          width: (SRC / 2) * k, height: SRC * k,
          maxWidth: 'none', maxHeight: 'none',
          pointerEvents: 'none' }} />
      </div>
    );
  }
  return (
    <div style={{ width: size, height: size * 2, position: 'relative', overflow: 'hidden' }}>
      <img src={src} alt="" draggable={false} style={{ position: 'absolute', left: 0, top: 0, width: size, height: size * 2, maxWidth: 'none', maxHeight: 'none', pointerEvents: 'none' }} />
    </div>
  );
}


