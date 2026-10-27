'use client';

import { useEffect, useRef, useState } from 'react';
import { localPoint } from '@/lib/pointer';
import type { AppWindowProps } from '@/lib/registry';
import { useSave } from '@/store/save';
import { useSystem } from '@/store/system';
import { useWindows } from '@/store/windows';
import { FOLDERS, filesIn, type VFile } from '@/lib/fs';
import { Icon } from '@/lib/icons';
import { sounds } from '@/lib/sounds';

export default function MyDocuments(_: AppWindowProps) {
  const notepadEdits = useSave((s) => s.notepadEdits);
  const prompt = useSystem((s) => s.prompt);
  const confirm = useSystem((s) => s.confirm);
  const alert = useSystem((s) => s.alert);
  const open = useWindows((s) => s.open);
  const setFoundMom = useSave((s) => s.setFoundMom);
  const hiddenDocs = useSave((s) => s.hiddenDocs);
  const recycleDoc = useSave((s) => s.recycleDoc);
  const recycleFolder = useSave((s) => s.recycleFolder);

  const [cwd, setCwd] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [unlockedFolders, setUnlockedFolders] = useState<Set<string>>(new Set());
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cwd && hiddenDocs.includes('dir:' + cwd)) { setCwd(''); setSelected(null); }
  }, [cwd, hiddenDocs]);

  const folders = cwd === '' ? FOLDERS.filter((f) => !hiddenDocs.includes('dir:' + f.id)) : [];

  const userFiles: VFile[] =
    cwd === ''
      ? Object.keys(notepadEdits)
          .filter((p) => p.startsWith('userdocs/'))
          .map((p) => ({
            path: p,
            name: p.slice('userdocs/'.length),
            icon: 'notepad' as const,
            sizeLabel: '1 KB',
            content: '',
          }))
      : [];

  const files: VFile[] = [
    ...filesIn(cwd).filter((f) => !hiddenDocs.includes(f.path)),
    ...userFiles,
  ];

  const openFile = async (f: VFile) => {
    if (f.kind === 'exe') {
      const run = await confirm('Open File', 'Run "' + f.name + '"?', { okLabel: 'Run' });
      if (!run) return;
      const pw = await prompt(
        'Administrator',
        'Installing new software requires an administrator password:',
        { password: true, okLabel: 'Install' }
      );
      if (pw === null) return;
      await alert(
        'Installation blocked',
        'Installation blocked by parental controls.\n\n(He knew you would try.)',
        'error'
      );
      return;
    }
    if (f.kind === 'media') {
      sounds.song();
      return;
    }
    if (f.protected) {
      const pw = await prompt('Password required', '"' + f.name + '" is protected.\nType the password:', {
        password: true,
      });
      if (pw === null || !pw.trim()) return;
    }
    if (f.path.startsWith('mydocs/recipes/') || f.path === 'mydocs/budget') {
      if (!useSave.getState().foundMom) setFoundMom();
    }
    open('notepad', { title: f.name + ' · Notepad', props: { path: f.path } });
  };

  const enterFolder = async (id: string) => {
    const folder = FOLDERS.find((f) => f.id === id);
    if (folder?.locked && !unlockedFolders.has(id)) {
      const pw = await prompt('Password required', '"' + folder.name + '" is locked.\nType the password:', {
        password: true,
      });
      if (pw === null || !pw.trim()) return;
      setUnlockedFolders((prev) => new Set(prev).add(id));
    }
    sounds.blip();
    setCwd(id);
    setSelected(null);
  };

  const address =
    'C:\\My Documents' + (cwd ? '\\' + (FOLDERS.find((f) => f.id === cwd)?.name ?? cwd) : '');

  const deleteSelected = async () => {
    setMenu(null);
    if (!selected) return;
    if (selected.startsWith('dir:')) {
      const folder = FOLDERS.find((f) => f.id === selected.slice(4));
      if (!folder) return;
      const yes = await confirm(
        'Confirm Folder Delete',
        'Are you sure you want to remove the folder "' + folder.name + '" and move all its contents to the Recycle Bin?',
        { okLabel: 'Yes', cancelLabel: 'No' }
      );
      if (!yes) return;
      recycleFolder(folder.id, folder.name);
    } else {
      const file = files.find((f) => f.path === selected);
      if (!file) return;
      const yes = await confirm(
        'Confirm File Delete',
        'Are you sure you want to send "' + file.name + '" to the Recycle Bin?',
        { okLabel: 'Yes', cancelLabel: 'No' }
      );
      if (!yes) return;
      recycleDoc(file.path, file.name, address);
    }
    sounds.crumple();
    setSelected(null);
    rootRef.current?.focus();
  };

  const openSelected = () => {
    setMenu(null);
    if (!selected) return;
    if (selected.startsWith('dir:')) { void enterFolder(selected.slice(4)); return; }
    const file = files.find((f) => f.path === selected);
    if (file) void openFile(file);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Delete') { e.preventDefault(); void deleteSelected(); }
    else if (e.key === 'Enter') { e.preventDefault(); openSelected(); }
    else if (e.key === 'Backspace' && cwd) { e.preventDefault(); sounds.click(); setCwd(''); setSelected(null); }
  };

  const row = (
    key: string,
    icon: React.ReactNode,
    name: string,
    sizeLabel: string,
    onDouble: () => void
  ) => {
    const sel = selected === key;
    return (
      <div
        key={key}
        className="grid items-center px-2 py-1 cursor-default win-noselect"
        style={{
          gridTemplateColumns: '26px 1fr 70px',
          background: sel ? 'var(--sel-blue)' : 'transparent',
          color: sel ? '#fff' : '#000',
        }}
        onClick={(e) => {
          e.stopPropagation();
          setMenu(null);
          sounds.click();
          setSelected(key);
        }}
        onDoubleClick={onDouble}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setSelected(key);
          const root = rootRef.current;
          if (!root) return;
          const p = localPoint(root, e.clientX, e.clientY);
          setMenu({ x: Math.min(p.x, root.clientWidth - 150), y: Math.min(p.y, root.clientHeight - 70) });
        }}
      >
        {icon}
        <span className="text-[12px] truncate">{name}</span>
        <span className="text-[11px]">{sizeLabel}</span>
      </div>
    );
  };

  return (
    <div ref={rootRef} tabIndex={0} onKeyDown={onKeyDown} onClick={() => setMenu(null)}
      className="absolute inset-0 flex flex-col" style={{ outline: 'none' }}>
      <div className="flex items-center gap-2 px-2 py-1 text-[11px] win-noselect" style={{ borderBottom: '1px solid var(--shadow-dark)' }}>
        <button className="btn3d !px-2 text-[11px]" disabled={cwd === ''} onClick={() => { sounds.click(); setCwd(''); setSelected(null); }}>
          ← Back
        </button>
        <button className="btn3d !px-2 text-[11px]" disabled={!selected} onClick={() => void deleteSelected()}>
          Delete
        </button>
        <span>Address</span>
        <span className="bevel-in flex-1 px-2 py-0.5 flex items-center gap-1.5">
          <Icon name="docs" size={13} /> {address}
        </span>
      </div>

      <div className="flex-1 bevel-in m-1 overflow-auto bg-white" onClick={() => setSelected(null)}>
        <div
          className="grid items-center px-2 py-1 text-[11px] font-bold win-noselect sticky top-0"
          style={{ gridTemplateColumns: '26px 1fr 70px', background: 'var(--face)', borderBottom: '1px solid var(--shadow-dark)' }}
        >
          <span />
          <span>Name</span>
          <span>Size</span>
        </div>

        {folders.map((f) =>
          row('dir:' + f.id, <Icon name="folder" size={17} />, f.name, 'Folder', () => void enterFolder(f.id))
        )}
        {files.map((f) =>
          row(f.path, <Icon name={f.icon} size={17} />, f.name, f.sizeLabel, () => void openFile(f))
        )}

        {folders.length === 0 && files.length === 0 && (
          <div className="p-6 text-center text-[12px] text-[#5a5a5a]">This folder is empty.</div>
        )}
      </div>

      <div className="bevel-in mx-1 mb-1 px-2 h-[20px] flex items-center text-[11px] win-noselect" style={{ background: 'var(--face)' }}>
        {folders.length + files.length} object(s)
      </div>

      {menu && (
        <div className="menu-pop" style={{ left: menu.x, top: menu.y, zIndex: 50 }} onClick={(e) => e.stopPropagation()}>
          <button className="mi" style={{ fontWeight: 700 }} onClick={openSelected}>Open</button>
          <hr className="msep" />
          <button className="mi" onClick={() => void deleteSelected()}>Delete</button>
        </div>
      )}
    </div>
  );
}
