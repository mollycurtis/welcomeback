'use client';

import { useState, useRef } from 'react';
import type { AppWindowProps } from '@/lib/registry';
import { useSave } from '@/store/save';
import { useSystem } from '@/store/system';
import { useWindows } from '@/store/windows';
import { findFile } from '@/lib/fs';
import { sounds } from '@/lib/sounds';

export default function Notepad({ windowId, props }: AppWindowProps) {
  const initialPath = typeof props?.path === 'string' ? (props.path as string) : null;

  const notepadEdits = useSave((s) => s.notepadEdits);
  const saveNotepad = useSave((s) => s.saveNotepad);
  const prompt = useSystem((s) => s.prompt);
  const alert = useSystem((s) => s.alert);
  const close = useWindows((s) => s.close);

  const [path, setPath] = useState<string | null>(initialPath);
  const [text, setText] = useState<string>(() =>
    initialPath ? notepadEdits[initialPath] ?? findFile(initialPath)?.content ?? '' : ''
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const textRef = useRef<HTMLTextAreaElement>(null);
  const past = useRef<string[]>([]);
  const lastEdit = useRef(0);

  const closeMenus = () => { setMenuOpen(false); setEditOpen(false); };

  const recordEdit = (prev: string) => {
    const now = Date.now();
    const coalesce = now - lastEdit.current < 600;
    lastEdit.current = now;
    if (!coalesce) {
      past.current.push(prev);
      if (past.current.length > 200) past.current.shift();
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    recordEdit(text);
    setText(e.target.value);
  };

  const commit = (next: string, caret?: number) => {
    past.current.push(text);
    lastEdit.current = 0;
    setText(next);
    if (caret != null) {
      requestAnimationFrame(() => {
        const el = textRef.current;
        if (el) { el.focus(); el.setSelectionRange(caret, caret); }
      });
    }
  };

  const undo = () => {
    if (!past.current.length) return;
    const prev = past.current.pop()!;
    lastEdit.current = 0;
    setText(prev);
    sounds.click();
  };

  const withSel = (fn: (el: HTMLTextAreaElement, start: number, end: number) => void) => {
    const el = textRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    el.focus();
    el.setSelectionRange(start, end);
    fn(el, start, end);
  };

  const doUndo = () => { closeMenus(); undo(); };
  const doCopy = () => { closeMenus(); withSel(() => { try { document.execCommand('copy'); } catch { } }); };
  const doCut = () => { closeMenus(); withSel(() => { try { document.execCommand('cut'); } catch { } }); };
  const doPaste = () => {
    closeMenus();
    withSel(async (_el, start, end) => {
      try {
        const clip = await navigator.clipboard.readText();
        commit(text.slice(0, start) + clip + text.slice(end), start + clip.length);
      } catch {
        try { document.execCommand('paste'); } catch { }
      }
    });
  };
  const doSelectAll = () => { closeMenus(); const el = textRef.current; if (el) { el.focus(); el.select(); } };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
      e.preventDefault();
      undo();
    }
  };

  const doSave = async () => {
    closeMenus();
    if (path) {
      saveNotepad(path, text);
      sounds.blip();
      return;
    }
    const name = await prompt('Save As', 'File name:', { defaultValue: 'untitled.txt' });
    if (!name || !name.trim()) return;
    const p = 'userdocs/' + name.trim();
    saveNotepad(p, text);
    setPath(p);
    await alert('Notepad', 'Saved to My Documents.');
  };

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="menubar relative flex win-noselect">
        <button onClick={() => { setEditOpen(false); setMenuOpen((v) => !v); }}>File</button>
        <button onClick={() => { setMenuOpen(false); setEditOpen((v) => !v); }}>Edit</button>
        {menuOpen && (
          <div className="menu-pop" style={{ left: 2, top: 22 }}>
            <button className="mi" onClick={() => void doSave()}>Save</button>
            <hr className="msep" />
            <button className="mi" onClick={() => { closeMenus(); close(windowId); }}>Exit</button>
          </div>
        )}
        {editOpen && (
          <div className="menu-pop" style={{ left: 38, top: 22 }}>
            <button className="mi" onClick={doUndo}>Undo</button>
            <hr className="msep" />
            <button className="mi" onClick={doCut}>Cut</button>
            <button className="mi" onClick={doCopy}>Copy</button>
            <button className="mi" onClick={doPaste}>Paste</button>
            <hr className="msep" />
            <button className="mi" onClick={doSelectAll}>Select All</button>
          </div>
        )}
      </div>

      <textarea
        autoFocus
        ref={textRef}
        value={text}
        onChange={onChange}
        onKeyDown={onKeyDown}
        spellCheck={false}
        className="flex-1 bevel-in m-1 p-2 resize-none outline-none text-[13px] leading-snug"
        style={{ fontFamily: '"Courier New", Courier, monospace' }}
        onPointerDown={closeMenus}
      />
    </div>
  );
}
