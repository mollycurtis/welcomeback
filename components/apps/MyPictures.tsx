'use client';

/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from 'react';
import type { AppWindowProps } from '@/lib/registry';
import { useSave } from '@/store/save';
import { useSystem } from '@/store/system';
import { sounds } from '@/lib/sounds';
import { localPoint } from '@/lib/pointer';
import { BUILTIN_PICTURES } from '@/lib/artifacts';

export default function MyPictures(_: AppWindowProps) {
  const paintings = useSave((s) => s.paintings);
  const hiddenBuiltinPics = useSave((s) => s.hiddenBuiltinPics);
  const recyclePainting = useSave((s) => s.recyclePainting);
  const recycleBuiltinPic = useSave((s) => s.recycleBuiltinPic);
  const confirm = useSystem((s) => s.confirm);
  const rootRef = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);

  const builtins = BUILTIN_PICTURES.filter((p) => !hiddenBuiltinPics.includes(p.id));

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewerId, setViewerId] = useState<string | null>(null);

  const viewerBuiltin = builtins.find((p) => p.id === viewerId) ?? null;
  const viewerPainting = paintings.find((p) => p.id === viewerId) ?? null;
  const openViewer = (id: string) => {
    setMenu(null);
    sounds.blip();
    setSelectedId(id);
    setViewerId(id);
  };

  const deleteSelected = async () => {
    setMenu(null);
    const b = builtins.find((p) => p.id === selectedId);
    const d = paintings.find((p) => p.id === selectedId);
    const name = b?.name ?? d?.name;
    if (!name) return;
    const yes = await confirm('Confirm File Delete', 'Are you sure you want to send "' + name + '" to the Recycle Bin?', { okLabel: 'Yes', cancelLabel: 'No' });
    if (!yes) return;
    if (b) recycleBuiltinPic(b.id, b.name);
    else if (d) recyclePainting(d);
    sounds.crumple();
    setSelectedId(null);
    rootRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (viewerId) { if (e.key === 'Escape') setViewerId(null); return; }
    if (e.key === 'Delete') { e.preventDefault(); void deleteSelected(); }
    else if (e.key === 'Enter' && selectedId) { e.preventDefault(); openViewer(selectedId); }
  };

  const onPicContext = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(id);
    const root = rootRef.current;
    if (!root) return;
    const p = localPoint(root, e.clientX, e.clientY);
    setMenu({ x: Math.min(p.x, root.clientWidth - 150), y: Math.min(p.y, root.clientHeight - 70) });
  };

  const hasSel = !!(builtins.find((p) => p.id === selectedId) || paintings.find((p) => p.id === selectedId));

  return (
    <div ref={rootRef} tabIndex={0} onKeyDown={onKeyDown} onClick={() => setMenu(null)}
      className="absolute inset-0 flex flex-col" style={{ outline: 'none' }}>
      <div className="flex items-center gap-1 px-1 py-1 win-noselect" style={{ borderBottom: '1px solid var(--shadow-dark)' }}>
        <button className="btn3d text-[11px]" disabled={!hasSel} onClick={() => selectedId && openViewer(selectedId)}>
          Open
        </button>
        <button className="btn3d text-[11px]" disabled={!hasSel} onClick={() => void deleteSelected()}>
          Delete
        </button>
      </div>
      <div className="flex-1 flex min-h-0">
        <div className="flex-1 bevel-in m-1 overflow-auto bg-white p-2" onClick={() => setSelectedId(null)}>
          <div className="flex flex-wrap gap-3 content-start">
            {builtins.map((p) => {
              const sel = p.id === selectedId;
              return (
                <button
                  key={p.id}
                  className="flex flex-col items-center gap-1 w-[108px] cursor-pointer bg-transparent border-0 p-1"
                  style={{ outline: sel ? '1px dotted var(--sel-blue)' : 'none', background: sel ? '#dce6f6' : 'transparent' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenu(null);
                    sounds.click();
                    setSelectedId(p.id);
                  }}
                  onDoubleClick={() => openViewer(p.id)}
                  onContextMenu={(e) => onPicContext(e, p.id)}
                >
                  <span className="bevel-thin bg-white inline-flex overflow-hidden" style={{ width: 96, height: 64 }}>
                    <span className="w-full h-full [&>svg]:w-full [&>svg]:h-full">{p.svg}</span>
                  </span>
                  <span className="text-[11px] truncate w-full text-center">{p.name}</span>
                </button>
              );
            })}
            {paintings.map((p) => {
              const sel = p.id === selectedId;
              return (
                <button
                  key={p.id}
                  className="flex flex-col items-center gap-1 w-[108px] cursor-pointer bg-transparent border-0 p-1"
                  style={{ outline: sel ? '1px dotted var(--sel-blue)' : 'none', background: sel ? '#dce6f6' : 'transparent' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenu(null);
                    sounds.click();
                    setSelectedId(p.id);
                  }}
                  onDoubleClick={() => openViewer(p.id)}
                  onContextMenu={(e) => onPicContext(e, p.id)}
                >
                  <img
                    src={p.dataUrl}
                    alt={p.name}
                    className="bevel-thin bg-white"
                    style={{ width: 96, height: 64, objectFit: 'cover', imageRendering: 'pixelated' }}
                  />
                  <span className="text-[11px] truncate w-full text-center">{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      <div className="bevel-in mx-1 mb-1 px-2 h-[20px] flex items-center justify-between text-[11px] win-noselect" style={{ background: 'var(--face)' }}>
        <span>{builtins.length + paintings.length} picture(s)</span>
        <span className="text-[#5a5a5a]">double-click to enlarge</span>
      </div>

      {menu && (
        <div className="menu-pop" style={{ left: menu.x, top: menu.y, zIndex: 40 }} onClick={(e) => e.stopPropagation()}>
          <button className="mi" style={{ fontWeight: 700 }} onClick={() => selectedId && openViewer(selectedId)}>Open</button>
          <hr className="msep" />
          <button className="mi" onClick={() => void deleteSelected()}>Delete</button>
        </div>
      )}

      {viewerId && (viewerBuiltin || viewerPainting) && (
        <div
          className="absolute inset-0 z-50 flex flex-col"
          style={{ background: 'rgba(14,18,32,0.93)' }}
          onClick={() => setViewerId(null)}
        >
          <div
            className="flex items-center justify-between px-3 h-7 shrink-0 text-white text-[12px]"
            style={{ background: 'linear-gradient(180deg,#1c3f94,#0a246a)' }}
          >
            <span className="truncate font-bold">
              {viewerBuiltin ? viewerBuiltin.name : viewerPainting!.name}
            </span>
            <button
              className="w-5 h-5 leading-none rounded-[2px] text-white cursor-pointer"
              style={{ background: 'linear-gradient(180deg,#d96a5a,#b0392b)', border: '1px solid #7e2018' }}
              aria-label="Close"
              onClick={(e) => { e.stopPropagation(); setViewerId(null); }}
            >
              ✕
            </button>
          </div>
          <div className="flex-1 min-h-0 flex items-center justify-center p-5">
            {viewerBuiltin ? (
              <span
                className="bevel-thin bg-white inline-flex overflow-hidden"
                style={{ width: 'min(560px, 86%)', maxHeight: '88%' }}
              >
                <span className="w-full [&>svg]:w-full [&>svg]:h-auto block">{viewerBuiltin.svg}</span>
              </span>
            ) : (
              <img
                src={viewerPainting!.dataUrl}
                alt={viewerPainting!.name}
                className="bevel-thin bg-white"
                style={{ maxWidth: '90%', maxHeight: '88%', objectFit: 'contain', imageRendering: 'pixelated' }}
              />
            )}
          </div>
          <div className="text-center text-[#8ba3d8] text-[10px] pb-2 shrink-0 win-noselect">
            click anywhere to close
          </div>
        </div>
      )}
    </div>
  );
}
