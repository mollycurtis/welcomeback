'use client';

import { useEffect, useRef, useState } from 'react';
import { useSystem, type DialogSpec } from '@/store/system';
import { sounds } from '@/lib/sounds';
import { Icon } from '@/lib/icons';

export default function Dialogs() {
  const dialogs = useSystem((s) => s.dialogs);
  if (dialogs.length === 0) return null;
  return (
    <>
      {dialogs.map((d, i) => (
        <DialogBox key={d.id} spec={d} offset={i} topmost={i === dialogs.length - 1} />
      ))}
    </>
  );
}

function DialogBox({
  spec,
  offset,
  topmost,
}: {
  spec: DialogSpec;
  offset: number;
  topmost: boolean;
}) {
  const resolveDialog = useSystem((s) => s.resolveDialog);
  const [value, setValue] = useState(spec.defaultValue ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (spec.kind === 'error') sounds.error();
    else sounds.blip();
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!topmost) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        ok();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancel();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topmost, value]);

  const ok = () => {
    sounds.click();
    if (spec.kind === 'prompt') resolveDialog(spec.id, value);
    else if (spec.kind === 'confirm') resolveDialog(spec.id, true);
    else resolveDialog(spec.id, null);
  };
  const cancel = () => {
    sounds.click();
    resolveDialog(spec.id, spec.kind === 'confirm' ? false : null);
  };

  const icon =
    spec.kind === 'error' ? 'warn' : spec.kind === 'confirm' ? 'question' : 'info';

  return (
    <div className="absolute inset-0 z-[5000]" style={{ background: 'rgba(0,0,0,0.02)' }}>
      <div
        className="absolute bevel-out flex flex-col"
        style={{
          left: '50%',
          top: '38%',
          transform: `translate(-50%, -50%) translate(${offset * 14}px, ${offset * 14}px)`,
          width: 340,
        }}
      >
        <div className="titlebar flex items-center px-1 h-[22px] win-noselect">
          <span className="flex-1 text-[11px] font-bold pl-1">{spec.title}</span>
          <button className="titlebtn close" onClick={cancel} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="p-4 flex gap-3 items-start" style={{ background: 'var(--face)' }}>
          <Icon name={icon} size={32} />
          <div className="flex-1">
            <p className="text-[12px] whitespace-pre-line leading-snug">{spec.message}</p>
            {spec.kind === 'prompt' && (
              <input
                ref={inputRef}
                type={spec.password ? 'password' : 'text'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="bevel-in mt-3 w-full px-2 py-1 text-[12px] outline-none"
              />
            )}
          </div>
        </div>

        <div
          className="flex justify-end gap-2 px-4 pb-3 pt-1"
          style={{ background: 'var(--face)' }}
        >
          <button className="btn3d min-w-[72px]" onClick={ok}>
            {spec.okLabel ?? 'OK'}
          </button>
          {(spec.kind === 'confirm' || spec.kind === 'prompt') && (
            <button className="btn3d min-w-[72px]" onClick={cancel}>
              {spec.cancelLabel ?? 'Cancel'}
            </button>
          )}
          {spec.kind === 'confirm' && spec.extraLabel && (
            <button className="btn3d" onClick={cancel}>
              {spec.extraLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
