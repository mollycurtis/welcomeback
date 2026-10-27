'use client';

import { scaleOf } from '@/lib/pointer';
import { useWindows, topWindowId, type WindowInstance } from '@/store/windows';
import { APPS } from '@/lib/registry';
import { Icon } from '@/lib/icons';
import { APP_COMPONENTS } from '@/components/apps';

export default function WindowFrame({ win }: { win: WindowInstance }) {
  const focus = useWindows((s) => s.focus);
  const close = useWindows((s) => s.close);
  const minimize = useWindows((s) => s.minimize);
  const toggleMaximize = useWindows((s) => s.toggleMaximize);
  const move = useWindows((s) => s.move);
  const resize = useWindows((s) => s.resize);
  const active = useWindows((s) => topWindowId(s.windows) === win.id);

  const meta = APPS[win.appId];
  const Comp = APP_COMPONENTS[win.appId];

  const startDrag = (e: React.PointerEvent) => {
    if (win.maximized) return;
    if ((e.target as HTMLElement).closest('.titlebtn')) return;
    focus(win.id);
    const sx = e.clientX;
    const sy = e.clientY;
    const k = 1 / scaleOf(document.getElementById('window-layer'));
    const ox = win.x;
    const oy = win.y;
    const onMove = (ev: PointerEvent) => {
      const nx = Math.max(-(win.w - 80), ox + (ev.clientX - sx) * k);
      const ny = Math.max(0, oy + (ev.clientY - sy) * k);
      move(win.id, nx, ny);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const startResize = (e: React.PointerEvent) => {
    e.stopPropagation();
    focus(win.id);
    const sx = e.clientX;
    const sy = e.clientY;
    const k = 1 / scaleOf(document.getElementById('window-layer'));
    const ow = win.w;
    const oh = win.h;
    const onMove = (ev: PointerEvent) => {
      resize(win.id, ow + (ev.clientX - sx) * k, oh + (ev.clientY - sy) * k);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div
      className="absolute flex flex-col bevel-out"
      style={{
        ...(win.maximized
          ? { left: 0, top: 0, right: 0, bottom: 0, width: 'auto', height: 'auto' }
          : { left: win.x, top: win.y, width: win.w, height: win.h }),
        zIndex: win.z,
        display: win.minimized ? 'none' : 'flex',
        boxShadow: active ? '3px 3px 0 rgba(0,0,0,0.35)' : '2px 2px 0 rgba(0,0,0,0.22)',
      }}
      onPointerDown={() => focus(win.id)}
    >
      <div
        className={'titlebar flex items-center gap-1 px-1 h-[22px] shrink-0 win-noselect' + (active ? '' : ' inactive')}
        onPointerDown={startDrag}
        onDoubleClick={() => toggleMaximize(win.id)}
        style={{ cursor: win.maximized ? 'default' : 'move' }}
      >
        <Icon name={meta.icon} size={14} />
        <span className="flex-1 truncate text-[11px] font-bold pl-0.5">{win.title}</span>
        <button className="titlebtn" aria-label="Minimize" onClick={() => minimize(win.id)}>
          <span style={{ marginTop: 6 }}>▬</span>
        </button>
        <button className="titlebtn" aria-label="Maximize" onClick={() => toggleMaximize(win.id)}>
          {win.maximized ? '❐' : '□'}
        </button>
        <button className="titlebtn close" aria-label="Close" onClick={() => close(win.id)}>
          ✕
        </button>
      </div>

      <div className="flex-1 relative overflow-hidden" style={{ background: 'var(--face)' }}>
        <Comp windowId={win.id} props={win.props} />
      </div>

      {!win.maximized && (
        <div
          className="absolute bottom-0 right-0 w-[15px] h-[15px]"
          style={{ cursor: 'nwse-resize' }}
          onPointerDown={startResize}
        >
          <svg width="15" height="15" aria-hidden="true">
            <g fill="#808080">
              <rect x="10" y="10" width="2" height="2" />
              <rect x="10" y="6" width="2" height="2" />
              <rect x="6" y="10" width="2" height="2" />
            </g>
            <g fill="#ffffff">
              <rect x="11" y="11" width="2" height="2" />
              <rect x="11" y="7" width="2" height="2" />
              <rect x="7" y="11" width="2" height="2" />
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}
