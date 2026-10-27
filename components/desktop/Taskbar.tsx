'use client';

import { useEffect, useRef, useState } from 'react';
import { useWindows, topWindowId } from '@/store/windows';
import { useSystem } from '@/store/system';
import { useSave } from '@/store/save';
import { APPS } from '@/lib/registry';
import { clockString, isLateNight } from '@/lib/time';
import { Icon } from '@/lib/icons';
import { sounds } from '@/lib/sounds';

export default function Taskbar() {
  const windows = useWindows((s) => s.windows);
  const taskbarClick = useWindows((s) => s.taskbarClick);
  const top = useWindows((s) => topWindowId(s.windows));
  const startOpen = useSystem((s) => s.startOpen);
  const setStartOpen = useSystem((s) => s.setStartOpen);
  const soundOn = useSave((s) => s.soundOn);
  const setSoundOn = useSave((s) => s.setSoundOn);

  const [time, setTime] = useState('');
  const [egg, setEgg] = useState(false);
  const clicksRef = useRef<number[]>([]);

  useEffect(() => {
    const update = () => setTime(clockString());
    update();
    const t = setInterval(update, 10_000);
    return () => clearInterval(t);
  }, []);

  const onClockClick = () => {
    const now = Date.now();
    clicksRef.current = [...clicksRef.current.filter((t) => now - t < 3200), now];
    if (clicksRef.current.length >= 12) {
      clicksRef.current = [];
      sounds.chime();
      setEgg(true);
      setTimeout(() => setEgg(false), 2600);
    }
  };

  const late = isLateNight();

  return (
    <div
      className="absolute bottom-0 inset-x-0 flex items-center gap-1 px-1 bevel-out"
      style={{ height: 30, zIndex: 9000 }}
    >
      <button
        className={'btn3d flex items-center gap-1.5 h-[24px] !px-2 font-bold italic text-[12px]' + (startOpen ? ' pressed' : '')}
        onClick={() => {
          sounds.click();
          setStartOpen(!startOpen);
        }}
      >
        start
      </button>

      <div
        className="self-stretch my-1 w-[2px]"
        style={{ borderLeft: '1px solid var(--shadow-dark)', borderRight: '1px solid #fff' }}
      />

      <div className="flex-1 flex items-center gap-1 overflow-hidden">
        {windows.map((w) => {
          const active = !w.minimized && top === w.id;
          return (
            <button
              key={w.id}
              className={'btn3d flex items-center gap-1 h-[22px] !px-1.5 min-w-0 max-w-[150px] flex-shrink' + (active ? ' pressed' : '')}
              onClick={() => taskbarClick(w.id)}
              style={active ? { background: '#dcd8c8' } : undefined}
            >
              <span className="shrink-0 inline-flex">
                <Icon name={APPS[w.appId].icon} size={14} />
              </span>
              <span className={'truncate text-[11px]' + (active ? ' font-bold' : '')}>
                {w.title}
              </span>
            </button>
          );
        })}
      </div>

      <div className="bevel-in relative flex items-center gap-2 h-[24px] px-2 !bg-[var(--face)]">
        <button
          className="bg-transparent border-0 p-0 cursor-pointer inline-flex"
          aria-label={soundOn ? 'Mute sounds' : 'Unmute sounds'}
          title={soundOn ? 'Sounds: on' : 'Sounds: muted'}
          onClick={() => {
            const next = !soundOn;
            setSoundOn(next);
            if (next) sounds.blip();
          }}
        >
          <Icon name={soundOn ? 'speaker' : 'speakerOff'} size={15} />
        </button>
        <span
          className="text-[11px] cursor-default win-noselect"
          onClick={onClockClick}
          title={late ? 'you should be asleep' : undefined}
        >
          {time}
        </span>
        {egg && (
          <div className="tooltip-bubble" style={{ right: 0, bottom: 30 }}>
            4:00 PM · June 12, 2009
          </div>
        )}
      </div>
    </div>
  );
}
