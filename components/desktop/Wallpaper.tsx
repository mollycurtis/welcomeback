'use client';

import { useEffect, useState } from 'react';
import { timeOfDay, type TimeOfDay } from '@/lib/time';
import { useSave } from '@/store/save';

const DAY_SRC = '/wallpaper-day.jpg';
const NIGHT_SRC = '/wallpaper-night.jpg';

export default function Wallpaper() {
  const choice = useSave((s) => s.wallpaper);
  const [tod, setTod] = useState<TimeOfDay>('afternoon');

  useEffect(() => {
    const update = () => setTod(timeOfDay());
    update();
    const t = setInterval(update, 60_000);
    return () => clearInterval(t);
  }, []);

  if (choice && choice !== 'hill') {
    const bg = choice === 'teal' ? '#2e7d6e' : choice === 'navy' ? '#0a1740' : '#000';
    return <div className="absolute inset-0" style={{ background: bg }} aria-hidden="true" />;
  }

  const src = tod === 'night' || tod === 'dusk' ? NIGHT_SRC : DAY_SRC;

  return (
    <div
      className="absolute inset-0"
      aria-hidden="true"
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
}
