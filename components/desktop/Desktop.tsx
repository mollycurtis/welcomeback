'use client';

import { scaleOf, localPoint } from '@/lib/pointer';
import { useEffect, useRef, useState } from 'react';
import { useChatter } from '@/store/chatter';
import { IDLE_MESSAGE } from '@/lib/chatterData';
import { useWindows } from '@/store/windows';
import { useSystem } from '@/store/system';
import { useSave } from '@/store/save';
import { DESKTOP_ITEMS, type DesktopItem } from '@/lib/desktopItems';
import { Icon, type IconName } from '@/lib/icons';
import { sounds } from '@/lib/sounds';
import Wallpaper from './Wallpaper';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import Screensaver from './Screensaver';
import WindowFrame from '@/components/window/WindowFrame';

const TASKBAR_H = 30;
const CELL_W = 78;
const CELL_H = 76;
const PADDING = 10;

interface Marquee { x0: number; y0: number; x1: number; y1: number }
interface IconNode { id: string; label: string; icon: IconName; shortcut?: boolean; onOpen: () => void }

export default function Desktop() {
  const idleSent = useChatter((c) => c.idleSent);
  useEffect(() => {
    if (idleSent) return;
    const t = window.setTimeout(() => {
      const c = useChatter.getState();
      if (c.idleSent) return;
      c.receive(IDLE_MESSAGE.buddyId, IDLE_MESSAGE.text);
      c.setOnline(IDLE_MESSAGE.buddyId);
      c.markIdleSent();
      c.markUnread(IDLE_MESSAGE.buddyId);
      sounds.ding();
      useWindows.getState().open('messenger', { props: { buddy: IDLE_MESSAGE.buddyId } });
    }, 5 * 60 * 1000);
    return () => window.clearTimeout(t);
  }, [idleSent]);

  const windows = useWindows((s) => s.windows);
  const open = useWindows((s) => s.open);
  const startOpen = useSystem((s) => s.startOpen);
  const alert = useSystem((s) => s.alert);

  const userFolders = useSave((s) => s.userFolders);
  const addUserFolder = useSave((s) => s.addUserFolder);
  const renameUserFolder = useSave((s) => s.renameUserFolder);
  const recycleUserFolder = useSave((s) => s.recycleUserFolder);
  const binCount = useSave((s) => s.recycled.length);
  const emptyBin = useSave((s) => s.emptyBin);
  const confirm = useSystem((s) => s.confirm);
  const prompt = useSystem((s) => s.prompt);
  const iconPos = useSave((s) => s.iconPos);
  const setIconPos = useSave((s) => s.setIconPos);
  const resetIconPos = useSave((s) => s.resetIconPos);
  const themeName = useSave((s) => s.theme);

  const [selected, setSelected] = useState<string | null>(null);
  const [marquee, setMarquee] = useState<Marquee | null>(null);
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; icon?: IconNode } | null>(null);
  const [, forceLayout] = useState(0);

  useEffect(() => {
    const bump = () => forceLayout((n) => n + 1);
    bump();
    window.addEventListener('resize', bump);
    return () => window.removeEventListener('resize', bump);
  }, []);

  const rootRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);

  const openItem = (item: DesktopItem) =>
    open(item.appId, { title: item.title, props: item.props });

  const nodes: IconNode[] = [
    ...DESKTOP_ITEMS.map((item) => ({
      id: item.id,
      label: item.label,
      icon: item.id === 'recycle' && binCount > 0 ? ('recycleFull' as IconName) : item.icon,
      shortcut: item.shortcut,
      onOpen: () => openItem(item),
    })),
    ...userFolders.map((name) => ({
      id: 'uf-' + name,
      label: name,
      icon: 'folder' as IconName,
      onOpen: () =>
        void alert(name, 'This folder is empty.\n\n(It was born seconds ago. Give it time.)'),
    })),
  ];

  const isWorld = (id: string) => id.startsWith('world-');

  const colArea = (rootRef.current?.clientHeight ?? 600) - TASKBAR_H - PADDING;
  const surfaceW = rootRef.current?.clientWidth ?? 900;
  const perCol = Math.max(1, Math.floor(colArea / CELL_H));

  const worldCount = nodes.filter((n) => isWorld(n.id)).length;
  const worldCols = Math.max(1, Math.ceil(worldCount / perCol));
  const worldPerCol = Math.max(1, Math.ceil(worldCount / worldCols));
  const worldLeft = Math.max(PADDING, surfaceW - PADDING - worldCols * CELL_W);

  const defaults: Record<string, { x: number; y: number }> = {};
  const colOf = (id: string) => DESKTOP_ITEMS.find((d) => d.id === id)?.col;
  const rowsIn: number[] = [];
  let lastCol = 0;
  let wi = 0;
  for (const n of nodes) {
    if (isWorld(n.id)) {
      defaults[n.id] = {
        x: worldLeft + Math.floor(wi / worldPerCol) * CELL_W,
        y: PADDING + (wi % worldPerCol) * CELL_H,
      };
      wi++;
    } else {
      let c = colOf(n.id) ?? lastCol;
      while ((rowsIn[c] ?? 0) >= perCol) c++;
      const r = rowsIn[c] ?? 0;
      defaults[n.id] = { x: PADDING + c * CELL_W, y: PADDING + r * CELL_H };
      rowsIn[c] = r + 1;
      lastCol = c;
    }
  }

  const posOf = (id: string) => iconPos[id] ?? defaults[id] ?? { x: PADDING, y: PADDING };

  const isUserFolder = (id: string) => id.startsWith('uf-');

  const deleteIcon = async (node: IconNode, snapBack?: { x: number; y: number }) => {
    setCtxMenu(null);
    if (node.id === 'recycle') return;
    if (!isUserFolder(node.id)) {
      if (snapBack) setIconPos(node.id, snapBack);
      sounds.click();
      await alert('Delete', '"' + node.label + '" cannot be deleted.\n\nThis item is protected by an administrator (dad).', 'error');
      return;
    }
    const yes = await confirm(
      'Confirm Folder Delete',
      'Are you sure you want to remove the folder "' + node.label + '" and move all its contents to the Recycle Bin?',
      { okLabel: 'Yes', cancelLabel: 'No' }
    );
    if (!yes) { if (snapBack) setIconPos(node.id, snapBack); return; }
    recycleUserFolder(node.label);
    setSelected(null);
    sounds.crumple();
  };

  const renameIcon = async (node: IconNode) => {
    setCtxMenu(null);
    sounds.click();
    if (!isUserFolder(node.id)) {
      await alert('Rename', 'You do not have permission to rename this item.', 'error');
      return;
    }
    const to = await prompt('Rename', 'Type a new name for this folder:', { defaultValue: node.label, okLabel: 'OK' });
    if (to === null) return;
    const name = renameUserFolder(node.label, to);
    if (name) setSelected('uf-' + name);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Delete' || !selected) return;
      const a = document.activeElement;
      if (a && a !== document.body && a !== rootRef.current) return;
      if (useSystem.getState().dialogs.length) return;
      const node = nodes.find((n) => n.id === selected);
      if (node) { e.preventDefault(); void deleteIcon(node); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const onSurfaceDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setCtxMenu(null);
    if (e.button !== 0) return;
    if (e.target !== e.currentTarget) return;
    setSelected(null);
    const surf = e.currentTarget;
    const { x: x0, y: y0 } = localPoint(surf, e.clientX, e.clientY);
    setMarquee({ x0, y0, x1: x0, y1: y0 });
    const onMove = (ev: PointerEvent) => {
      const p = localPoint(surf, ev.clientX, ev.clientY);
      setMarquee({ x0, y0, x1: p.x, y1: p.y });
    };
    const onUp = () => {
      setMarquee(null);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const startIconDrag = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    setCtxMenu(null);
    setSelected(id);
    const surf = surfaceRef.current!;
    const scale = scaleOf(surf);
    const W = surf.clientWidth, H = surf.clientHeight;
    const start = posOf(id);
    const grabX = e.clientX;
    const grabY = e.clientY;
    let moved = false;

    const onMove = (ev: PointerEvent) => {
      const ddx = (ev.clientX - grabX) / scale;
      const ddy = (ev.clientY - grabY) / scale;
      if (!moved && Math.hypot(ddx, ddy) < 3) return;
      moved = true;
      const nx = Math.max(0, Math.min(W - CELL_W, start.x + ddx));
      const ny = Math.max(0, Math.min(H - CELL_H, start.y + ddy));
      setIconPos(id, { x: nx, y: ny });
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      if (!moved || id === 'recycle') return;
      const at = useSave.getState().iconPos[id] ?? start;
      const bin = posOf('recycle');
      const cx = at.x + CELL_W / 2, cy = at.y + CELL_H / 2;
      if (cx > bin.x && cx < bin.x + CELL_W && cy > bin.y && cy < bin.y + CELL_H) {
        const node = nodes.find((n) => n.id === id);
        if (node) void deleteIcon(node, start);
      }
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const onIconContext = (e: React.MouseEvent, node: IconNode) => {
    e.preventDefault();
    e.stopPropagation();
    setSelected(node.id);
    const root = rootRef.current;
    if (!root) return;
    const p = localPoint(root, e.clientX, e.clientY);
    sounds.click();
    setCtxMenu({ x: Math.min(p.x, root.clientWidth - 190), y: Math.min(p.y, root.clientHeight - 150), icon: node });
  };

  const onContext = (e: React.MouseEvent) => {
    e.preventDefault();
    if ((e.target as HTMLElement) !== surfaceRef.current) {
      setCtxMenu(null);
      return;
    }
    const root = rootRef.current;
    if (!root) return;
    const p = localPoint(root, e.clientX, e.clientY);
    setCtxMenu({
      x: Math.min(p.x, root.clientWidth - 190),
      y: Math.min(p.y, root.clientHeight - 170),
    });
  };

  const mq = marquee
    ? {
        left: Math.min(marquee.x0, marquee.x1),
        top: Math.min(marquee.y0, marquee.y1),
        width: Math.abs(marquee.x1 - marquee.x0),
        height: Math.abs(marquee.y1 - marquee.y0),
      }
    : null;

  return (
    <div ref={rootRef} data-theme={themeName} className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }} onContextMenu={onContext}>
      <Wallpaper />

      <div
        ref={surfaceRef}
        id="window-layer"
        className="absolute inset-x-0 top-0"
        style={{ bottom: TASKBAR_H }}
        onPointerDown={onSurfaceDown}
      >
        {nodes.map((node) => {
          const pos = posOf(node.id);
          return (
            <DesktopIcon
              key={node.id}
              node={node}
              x={pos.x}
              y={pos.y}
              selected={selected === node.id}
              onDragStart={(e) => startIconDrag(e, node.id)}
              onOpen={node.onOpen}
              onContext={(e) => onIconContext(e, node)}
            />
          );
        })}

        {mq && <div className="ants" style={mq} />}

        {windows.map((w) => (
          <WindowFrame key={w.id} win={w} />
        ))}
      </div>

      {ctxMenu && ctxMenu.icon && ctxMenu.icon.id === 'recycle' && (
        <div
          className="menu-pop"
          style={{ left: ctxMenu.x, top: ctxMenu.y, zIndex: 9600 }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button className="mi" style={{ fontWeight: 700 }} onClick={() => { const n = ctxMenu.icon!; setCtxMenu(null); n.onOpen(); }}>
            Open
          </button>
          <hr className="msep" />
          <button className="mi" disabled={binCount === 0} onClick={async () => {
            setCtxMenu(null);
            const yes = await confirm('Confirm Multiple File Delete', 'Are you sure you want to permanently delete ' + (binCount === 1 ? 'this item?' : 'these ' + binCount + ' items?'), { okLabel: 'Yes', cancelLabel: 'No' });
            if (yes) { emptyBin(); sounds.crumple(); }
          }}>
            Empty Recycle Bin
          </button>
          <hr className="msep" />
          <button className="mi" onClick={() => { setCtxMenu(null); sounds.click(); void alert('Recycle Bin Properties', 'Location: C:\\RECYCLED\nContents: ' + binCount + ' item(s)\n\nMaximum size of Recycle Bin: 10% of each drive'); }}>
            Properties
          </button>
        </div>
      )}
      {ctxMenu && ctxMenu.icon && ctxMenu.icon.id !== 'recycle' && (
        <div
          className="menu-pop"
          style={{ left: ctxMenu.x, top: ctxMenu.y, zIndex: 9600 }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button className="mi" style={{ fontWeight: 700 }} onClick={() => { const n = ctxMenu.icon!; setCtxMenu(null); n.onOpen(); }}>
            Open
          </button>
          <hr className="msep" />
          <button className="mi" onClick={() => { setCtxMenu(null); sounds.click(); void alert('Send To', 'The floppy drive is empty.', 'error'); }}>
            Send To &rsaquo;
          </button>
          <button className="mi" onClick={() => { setCtxMenu(null); sounds.click(); void alert('Create Shortcut', 'Windows cannot create a shortcut here.\n\nThe desktop is already the shortcut.', 'error'); }}>
            Create Shortcut
          </button>
          <button className="mi" onClick={() => void deleteIcon(ctxMenu.icon!)}>
            Delete
          </button>
          <button className="mi" onClick={() => void renameIcon(ctxMenu.icon!)}>
            Rename
          </button>
          <hr className="msep" />
          <button className="mi" onClick={() => {
            const n = ctxMenu.icon!; setCtxMenu(null); sounds.click();
            void alert(n.label + ' Properties', isUserFolder(n.id)
              ? 'Type: File Folder\nLocation: C:\\Desktop\nContains: 0 Files, 0 Folders\nCreated: today'
              : 'Type: ' + (n.shortcut ? 'Shortcut' : 'Application') + '\nLocation: C:\\Desktop\nCreated: 2004\n\nAttributes: Read-only');
          }}>
            Properties
          </button>
        </div>
      )}
      {ctxMenu && !ctxMenu.icon && (
        <div
          className="menu-pop"
          style={{ left: ctxMenu.x, top: ctxMenu.y, zIndex: 9600 }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button className="mi" onClick={() => { sounds.click(); resetIconPos(); setCtxMenu(null); }}>
            Arrange Icons
          </button>
          <button className="mi" onClick={() => { sounds.click(); setCtxMenu(null); }}>
            Refresh
          </button>
          <hr className="msep" />
          <button className="mi" onClick={() => { setCtxMenu(null); sounds.blip(); addUserFolder(); }}>
            New Folder
          </button>
          <hr className="msep" />
          <button className="mi" onClick={() => { setCtxMenu(null); open('display'); }}>
            Properties
          </button>
        </div>
      )}

      {startOpen && <StartMenu />}
      <Taskbar />
      <Screensaver />
    </div>
  );
}

function DesktopIcon({
  node,
  x,
  y,
  selected,
  onDragStart,
  onOpen,
  onContext,
}: {
  node: IconNode;
  x: number;
  y: number;
  selected: boolean;
  onDragStart: (e: React.PointerEvent) => void;
  onOpen: () => void;
  onContext: (e: React.MouseEvent) => void;
}) {
  const unread = useChatter((c) => c.unreadCount());
  return (
    <div
      className={'dicon absolute' + (selected ? ' selected' : '')}
      style={{ left: x, top: y }}
      onPointerDown={(e) => { if (e.button === 0) onDragStart(e); else e.stopPropagation(); }}
      onDoubleClick={onOpen}
      onContextMenu={onContext}
    >
      <span className="relative inline-block">
        <Icon name={node.icon} size={30} />
        {node.label === 'Chatterbox' && unread > 0 && (
          <span
            className="absolute inline-flex items-center justify-center"
            style={{
              top: -4, right: -6, minWidth: 16, height: 16, padding: '0 4px', borderRadius: 8,
              background: '#d0342c', color: '#fff', fontSize: 10, fontWeight: 700,
              border: '1.5px solid #fff', boxShadow: '0 1px 2px rgba(0,0,0,0.5)', lineHeight: 1,
            }}>{unread}</span>
        )}
        {node.shortcut && (
          <span
            className="absolute bottom-0 left-0 bg-white inline-flex items-center justify-center"
            style={{ width: 13, height: 13, border: '1px solid #5a5a5a' }}
          >
            <svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true">
              <polygon points="1.5,7.5 1.5,1.5 7.5,7.5" fill="#000" />
            </svg>
          </span>
        )}
      </span>
      <span className="lbl">{node.label}</span>
    </div>
  );
}
