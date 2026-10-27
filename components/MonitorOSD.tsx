'use client';

import { useSave } from '@/store/save';

export type OsdItemId =
  | 'brightness'
  | 'contrast'
  | 'volume'
  | 'hpos'
  | 'degauss'
  | 'recall'
  | 'exit';

export const OSD_ITEMS: Array<{ id: OsdItemId; label: string }> = [
  { id: 'brightness', label: 'BRIGHTNESS' },
  { id: 'contrast', label: 'CONTRAST' },
  { id: 'volume', label: 'VOLUME' },
  { id: 'hpos', label: 'H-POSITION' },
  { id: 'degauss', label: 'DEGAUSS' },
  { id: 'recall', label: 'RECALL' },
  { id: 'exit', label: 'EXIT' },
];

export default function MonitorOSD({ open, sel }: { open: boolean; sel: number }) {
  const brightness = useSave((s) => s.brightness);
  const contrast = useSave((s) => s.contrast);
  const volume = useSave((s) => s.volume);
  const hpos = useSave((s) => s.hpos);

  if (!open) return null;

  const barValue = (id: OsdItemId): number | null => {
    if (id === 'brightness') return brightness;
    if (id === 'contrast') return contrast;
    if (id === 'volume') return volume;
    return null;
  };

  return (
    <div className="osd win-noselect" aria-label="Monitor menu">
      <div className="osd-title">M E N U</div>
      {OSD_ITEMS.map((it, i) => {
        const v = barValue(it.id);
        return (
          <div key={it.id} className={'osd-row' + (i === sel ? ' sel' : '')}>
            <span>
              {i === sel ? '\u25BA' : '\u00A0'} {it.label}
            </span>
            {v !== null && <Bar v={v} />}
            {it.id === 'hpos' && (
              <span className="osd-num">
                {hpos > 0 ? '+' : ''}
                {hpos}
              </span>
            )}
            {(it.id === 'degauss' || it.id === 'recall') && (
              <span className="osd-num">PRESS +</span>
            )}
            {it.id === 'exit' && <span className="osd-num">PRESS +</span>}
          </div>
        );
      })}
      <div className="osd-hint">MENU: select&nbsp;&nbsp;&nbsp;&minus; / + : adjust</div>
    </div>
  );
}

function Bar({ v }: { v: number }) {
  const filled = Math.round(v / 5);
  return (
    <span className="osd-bar">
      {Array.from({ length: 20 }).map((_, i) => (
        <i key={i} className={i < filled ? 'on' : ''} />
      ))}
    </span>
  );
}
