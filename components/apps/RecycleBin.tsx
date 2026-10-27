'use client';

import { useRef, useState } from 'react';
import type { AppWindowProps } from '@/lib/registry';
import { useSave, type RecycledItem } from '@/store/save';
import { useSystem } from '@/store/system';
import { Icon, type IconName } from '@/lib/icons';
import { sounds } from '@/lib/sounds';
import { findFile } from '@/lib/fs';

const iconFor = (it: RecycledItem): IconName => {
  if (it.kind === 'painting' || it.kind === 'builtin') return 'pictures';
  if (it.kind === 'folder' || it.kind === 'userfolder') return 'folder';
  if (it.kind === 'doc' && it.path) return findFile(it.path)?.icon ?? 'file';
  return 'notepad';
};

export default function RecycleBin(_: AppWindowProps) {
  const recycled = useSave((s) => s.recycled);
  const restoreRecycled = useSave((s) => s.restoreRecycled);
  const deleteRecycled = useSave((s) => s.deleteRecycled);
  const emptyBin = useSave((s) => s.emptyBin);
  const confirm = useSystem((s) => s.confirm);

  const [selected, setSelected] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const sel = recycled.find((r) => r.id === selected) ?? null;

  const restore = (id = selected) => {
    if (!id) return;
    restoreRecycled(id);
    setSelected(null);
    sounds.chime();
  };

  const deleteOne = async () => {
    if (!sel) return;
    const yes = await confirm(
      'Confirm File Delete',
      'Are you sure you want to permanently delete "' + sel.name + '"?',
      { okLabel: 'Yes', cancelLabel: 'No' }
    );
    if (!yes) return;
    deleteRecycled(sel.id);
    setSelected(null);
    sounds.crumple();
    rootRef.current?.focus();
  };

  const onEmpty = async () => {
    if (!recycled.length) return;
    const yes = await confirm(
      'Confirm Multiple File Delete',
      recycled.length === 1
        ? 'Are you sure you want to permanently delete "' + recycled[0].name + '"?'
        : 'Are you sure you want to permanently delete these ' + recycled.length + ' items?',
      { okLabel: 'Yes', cancelLabel: 'No' }
    );
    if (!yes) return;
    emptyBin();
    setSelected(null);
    sounds.crumple();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Delete') { e.preventDefault(); void deleteOne(); }
    else if (e.key === 'Enter') { e.preventDefault(); restore(); }
  };

  const cols = '26px 1fr 130px 76px';

  return (
    <div ref={rootRef} tabIndex={0} onKeyDown={onKeyDown} className="absolute inset-0 flex flex-col" style={{ outline: 'none' }}>
      <div className="flex items-center gap-1 px-1 py-1 win-noselect" style={{ borderBottom: '1px solid var(--shadow-dark)' }}>
        <button className="btn3d text-[11px]" disabled={!sel} onClick={() => restore()}>
          Restore
        </button>
        <button className="btn3d text-[11px]" disabled={!sel} onClick={() => void deleteOne()}>
          Delete
        </button>
        <button className="btn3d text-[11px]" disabled={recycled.length === 0} onClick={() => void onEmpty()}>
          Empty Recycle Bin
        </button>
      </div>

      <div className="flex-1 bevel-in m-1 overflow-auto bg-white" onClick={() => setSelected(null)}>
        {recycled.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center text-[12px] text-[#5a5a5a] win-noselect">
            The Recycle Bin is empty.
          </div>
        ) : (
          <>
            <div
              className="grid items-center px-2 py-1 text-[11px] font-bold win-noselect sticky top-0"
              style={{ gridTemplateColumns: cols, background: 'var(--face)', borderBottom: '1px solid var(--shadow-dark)' }}
            >
              <span />
              <span>Name</span>
              <span>Original Location</span>
              <span>Date Deleted</span>
            </div>
            {recycled.map((it) => {
              const on = selected === it.id;
              return (
                <div
                  key={it.id}
                  className="grid items-center px-2 py-1 cursor-default win-noselect"
                  style={{ gridTemplateColumns: cols, background: on ? 'var(--sel-blue)' : 'transparent', color: on ? '#fff' : '#000' }}
                  onClick={(e) => { e.stopPropagation(); sounds.click(); setSelected(it.id); }}
                  onDoubleClick={() => restore(it.id)}
                  title="Double-click to restore"
                >
                  <Icon name={iconFor(it)} size={17} />
                  <span className="text-[12px] truncate">{it.name}</span>
                  <span className="text-[11px] truncate">{it.origin}</span>
                  <span className="text-[11px]">{it.deleted}</span>
                </div>
              );
            })}
          </>
        )}
      </div>

      <div className="bevel-in mx-1 mb-1 px-2 h-[20px] flex items-center text-[11px] win-noselect" style={{ background: 'var(--face)' }}>
        {recycled.length} object(s)
      </div>
    </div>
  );
}
