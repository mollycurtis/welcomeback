'use client';

import { useEffect, useRef, useState } from 'react';
import { MG, MGButton, Coin } from '../ui';
import { Hud } from '../Hud';
import { Backdrop, ShopPanel, type BgName } from '../Backdrop';

const ROOM_BG: Record<string, BgName> = { living: 'room_living', bedroom: 'room_bedroom', kitchen: 'room_kitchen' };
const PAINTED: Record<string, { wall: string; floor: string; horizon: number }> = {
  living:  { wall: 'wall_mint',  floor: 'floor_wood',   horizon: 57 },
  bedroom: { wall: 'wall_sky',   floor: 'floor_carpet', horizon: 58 },
  kitchen: { wall: 'wall_cream', floor: 'floor_tile',   horizon: 64 },
};
const HOUSE_ROOMS = Object.keys(ROOM_BG);
const REDECORABLE = ['living', 'bedroom'];
const BEDROOM_WALL_BG: Record<string, BgName> = {
  bw_blue: 'room_bedroom_blue', bw_butter: 'room_bedroom_butter', bw_dusty: 'room_bedroom_dusty',
  bw_lavender: 'room_bedroom_lavender', bw_forest: 'room_bedroom_forest', bw_navy: 'room_bedroom_navy',
  bw_wave: 'room_bedroom_wave',
};
const LIVING_WALL_BG: Record<string, BgName> = {
  wall_green: 'room_living_green', wall_cream: 'room_living_cream', wall_sky: 'room_living_sky',
  wall_mint: 'room_living_mint', wall_rose: 'room_living_rose', wall_stripe: 'room_living_stripe',
  wall_stars: 'room_living_stars',
};
import { Furniture } from '../Furniture';
import { useMaple } from '@/store/maplegrove';
import { byId, WALLPAPERS, BEDROOM_WALLS, type FurniItem } from '@/lib/maplegrove/catalog';

const GW = 10, GH = 5;

type Held = { uid: string; mode: 'new' | 'move'; item: FurniItem } | null;

export function HouseScreen() {
  const goTo = useMaple((s) => s.goTo);
  const rooms = useMaple((s) => s.rooms);
  const activeRoom = useMaple((s) => s.activeRoom);
  const setActiveRoom = useMaple((s) => s.setActiveRoom);
  const inventory = useMaple((s) => s.inventory);
  const ownedWall = useMaple((s) => s.ownedWall);
  const placeFromInventory = useMaple((s) => s.placeFromInventory);
  const movePlaced = useMaple((s) => s.movePlaced);
  const returnToInventory = useMaple((s) => s.returnToInventory);
  const applyWall = useMaple((s) => s.applyWall);

  const shown = rooms.filter((r) => HOUSE_ROOMS.includes(r.id));
  const room = shown.find((r) => r.id === activeRoom) ?? shown[0];
  const horizon = PAINTED[room.id]?.horizon ?? 60;

  useEffect(() => { if (room && room.id !== activeRoom) setActiveRoom(room.id); }, [room, activeRoom, setActiveRoom]);

  const [held, setHeld] = useState<Held>(null);
  const [shop, setShop] = useState(false);
  const storeStock = useMaple((s) => s.storeStock); const buyFurniture = useMaple((s) => s.buyFurniture); const bucks = useMaple((s) => s.bucks);
  const [selected, setSelected] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<'furniture' | 'wall' | 'floor'>('furniture');
  const floorRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);

  const cellFrom = (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement | null>, gh: number) => {
    const r = ref.current!.getBoundingClientRect();
    const cx = Math.floor(((e.clientX - r.left) / r.width) * GW);
    const cy = Math.floor(((e.clientY - r.top) / r.height) * gh);
    return { cx, cy };
  };

  const placeAt = (cx: number, cy: number) => {
    if (!held) return;
    const x = Math.max(0, Math.min(GW - held.item.w, cx));
    const y = Math.max(0, Math.min(GH - held.item.h, cy));
    if (held.mode === 'new') placeFromInventory(held.uid, x, y);
    else movePlaced(held.uid, x, y);
    setHeld(null); setSelected(null);
  };

  const onFloorClick = (e: React.MouseEvent) => {
    if (held && !held.item.wall) { const { cx, cy } = cellFrom(e, floorRef, GH); placeAt(cx, cy); }
    else if (!held) setSelected(null);
  };
  const onWallClick = (e: React.MouseEvent) => {
    if (held && held.item.wall) { const { cx } = cellFrom(e, wallRef, 1); placeAt(cx, 0); }
    else if (!held) setSelected(null);
  };

  const startMove = (uid: string, item: FurniItem) => { setHeld({ uid, mode: 'move', item }); setSelected(null); };
  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <Hud title="My House" onBack={() => goTo('oakwood')} backLabel="Rosemount" />

      <div style={{ flex: '0 0 30px', display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px', background: MG.panel, borderBottom: `2px solid ${MG.blueDk}` }}>
        {shown.map((r) => (
          <button key={r.id} onClick={() => { setActiveRoom(r.id); setHeld(null); setSelected(null); }}
            style={{ padding: '2px 10px', borderRadius: 4, fontSize: 11, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit',
              background: r.id === activeRoom ? `linear-gradient(#ffe98a, ${MG.gold})` : '#e9e2cc', color: MG.blueDk, border: `2px solid ${MG.blueDk}` }}>
            {r.name}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        {held && <span style={{ fontSize: 12, fontWeight: 800, color: MG.leaf }}>Placing {held.item.name} - click the {held.item.wall ? 'wall' : 'floor'}</span>}
        {held && <MGButton color="plain" style={{ fontSize: 11, padding: '3px 8px' }} onClick={() => setHeld(null)}>Cancel</MGButton>}
      </div>

      <div style={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <Backdrop bg={room.id === 'living' ? (LIVING_WALL_BG[room.wall] ?? 'room_living_green')
            : room.id === 'bedroom' ? (BEDROOM_WALL_BG[room.wall] ?? 'room_bedroom_blue')
            : (ROOM_BG[room.id] ?? 'room_living')} overlay={shop && (
          <ShopPanel title="Maple Furniture delivers" onClose={() => setShop(false)} width="62%">
            <div style={{ fontSize: 11, color: MG.sub, marginBottom: 8 }}>Today's stock. You have <b><Coin size={12} /> {bucks}</b>. Bought pieces land in your Furniture drawer.</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(104px, 1fr))', gap: 8 }}>
              {storeStock.map((id) => { const it = byId(id); if (!it) return null; const ok = bucks >= it.price; return (
                <div key={id} style={{ background: '#fffaf0', border: `2px solid ${MG.panelEdge}`, borderRadius: 8, padding: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div style={{ height: 46, display: 'flex', alignItems: 'flex-end' }}><Furniture item={it} w={44} h={44} /></div>
                  <div style={{ fontSize: 10, fontWeight: 800, marginTop: 3, lineHeight: 1.1 }}>{it.name}</div>
                  <div style={{ fontSize: 11, fontWeight: 900, color: '#5a4710', margin: '2px 0 4px' }}><Coin size={12} /> {it.price}</div>
                  <MGButton color={ok ? 'green' : 'plain'} disabled={!ok} style={{ width: '100%', fontSize: 10, padding: '2px 0' }} onClick={() => buyFurniture(id)}>Buy</MGButton>
                </div>); })}
            </div>
          </ShopPanel>
        )}>
          <div ref={wallRef} onClick={onWallClick} data-wall
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: `${horizon}%`, cursor: held?.item.wall ? 'crosshair' : 'default' }}>
            {room.placed.filter((p) => byId(p.itemId)?.wall).map((p) => {
              const it = byId(p.itemId)!;
              return (
                <PlacedWall key={p.uid} item={it} colPct={(p.x + 0.5) / GW} selected={selected === p.uid}
                  onClick={(e) => { e.stopPropagation(); if (!held) setSelected(p.uid); }} />
              );
            })}
          </div>
          <div ref={floorRef} onClick={onFloorClick} data-floor
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${100 - horizon}%`, cursor: held && !held.item.wall ? 'crosshair' : 'default' }}>
            {held && !held.item.wall && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `linear-gradient(rgba(255,255,255,0.35) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.35) 1px,transparent 1px)`, backgroundSize: `${100 / GW}% ${100 / GH}%` }} />
            )}
            {room.placed.filter((p) => !byId(p.itemId)?.wall).sort((a, b) => a.y - b.y).map((p) => {
              const it = byId(p.itemId)!;
              return (
                <PlacedFloor key={p.uid} item={it} p={p} selected={selected === p.uid}
                  onSelect={(e) => { e.stopPropagation(); if (!held) setSelected(p.uid); }}
                  onMove={() => startMove(p.uid, it)}
                  onStore={() => { returnToInventory(p.uid); setSelected(null); }} />
              );
            })}
          </div>
        </Backdrop>
      </div>

      <div style={{ flex: drawerOpen ? '0 0 96px' : '0 0 28px', display: 'flex', flexDirection: 'column', background: MG.panel, borderTop: `3px solid ${MG.purpleDk}`, transition: 'flex-basis 160ms' }}>
        <div style={{ display: 'flex', gap: 6, padding: '4px 10px 0', alignItems: 'center' }}>
          <DrawerTab on={drawer === 'furniture'} onClick={() => { setDrawer('furniture'); setDrawerOpen(true); }}>Furniture ({inventory.length})</DrawerTab>
          {REDECORABLE.includes(room.id) && <DrawerTab on={drawer === 'wall'} onClick={() => { setDrawer('wall'); setDrawerOpen(true); }}>Wallpaper</DrawerTab>}
          <DrawerTab on={false} onClick={() => setShop(true)}>Shop</DrawerTab>
          <div style={{ flex: 1 }} />
          <button onClick={() => setDrawerOpen((o) => !o)} title={drawerOpen ? 'Hide drawer' : 'Show drawer'}
            style={{ border: `2px solid ${MG.panelEdge}`, borderRadius: 6, background: '#fffaf0', fontFamily: 'inherit', fontWeight: 800, fontSize: 11, padding: '2px 8px', cursor: 'pointer', color: MG.sub }}>
            {drawerOpen ? 'Hide ▾' : 'Show ▴'}
          </button>
        </div>
        <div style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', padding: drawerOpen ? 6 : 0, display: drawerOpen ? 'flex' : 'none', gap: 8, alignItems: 'stretch' }}>
          {drawer === 'furniture' && (
            inventory.length === 0
              ? <Empty onGo={() => setShop(true)} />
              : inventory.map((o) => {
                  const it = byId(o.itemId)!;
                  const on = held?.uid === o.uid;
                  return (
                    <button key={o.uid} data-invtile onClick={() => setHeld({ uid: o.uid, mode: 'new', item: it })}
                      style={{ flex: '0 0 84px', borderRadius: 8, cursor: 'pointer', background: on ? '#fff5cc' : '#fffaf0',
                        border: on ? `3px solid ${MG.gold}` : `2px solid ${MG.panelEdge}`, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <div style={{ height: 44, display: 'flex', alignItems: 'flex-end' }}><Furniture item={it} w={Math.min(70, it.w * 30)} h={40} /></div>
                      <span style={{ fontSize: 10, fontWeight: 700, lineHeight: 1.05, textAlign: 'center', marginTop: 3 }}>{it.name}</span>
                    </button>
                  );
                })
          )}
          {drawer === 'wall' && (room.id === 'bedroom' ? BEDROOM_WALLS : WALLPAPERS).filter((w) => ownedWall.includes(w.id)).map((w) => (
            <SurfaceSwatch key={w.id} css={w.css} art={w.id.startsWith('bw_') ? undefined : `/maplegrove/icons/wall/${w.id}.png`} name={w.name} active={room.wall === w.id} onClick={() => applyWall(w.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PlacedFloor({ item, p, selected, onSelect, onMove, onStore }: {
  item: FurniItem; p: { x: number; y: number }; selected: boolean;
  onSelect: (e: React.MouseEvent) => void; onMove: () => void; onStore: () => void;
}) {
  const baseFromBottom = (1 - (p.y + item.h) / GH) * 100;
  return (
    <div onClick={onSelect}
      style={{ position: 'absolute', left: `${(p.x / GW) * 100}%`, bottom: `${baseFromBottom}%`,
        width: `${(item.w / GW) * 100}%`, display: 'flex', alignItems: 'flex-end',
        cursor: 'pointer', zIndex: selected ? 50 : 10 + p.y }}>
      <div style={{ width: '100%', position: 'relative', outline: selected ? `3px solid ${MG.purple}` : 'none', outlineOffset: 2 }}>
        <Furniture item={item} w={'100%'} h={'auto'} />
        {selected && (
          <div style={{ position: 'absolute', top: -28, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4, whiteSpace: 'nowrap', zIndex: 60 }}>
            <Mini onClick={(e) => { e.stopPropagation(); onMove(); }} color={MG.purple}>Move</Mini>
            <Mini onClick={(e) => { e.stopPropagation(); onStore(); }} color={MG.leaf}>Put Away</Mini>
          </div>
        )}
      </div>
    </div>
  );
}

function PlacedWall({ item, colPct, selected, onClick }: { item: FurniItem; colPct: number; selected: boolean; onClick: (e: React.MouseEvent) => void }) {
  return (
    <div onClick={onClick}
      style={{ position: 'absolute', left: `calc(${colPct * 100}% - 38px)`, bottom: '12%', width: 76, height: 76, cursor: 'pointer',
        outline: selected ? `3px solid ${MG.purple}` : 'none' }}>
      <Furniture item={item} w={76} h={76} />
    </div>
  );
}

function Mini({ children, onClick, color }: { children: React.ReactNode; onClick: (e: React.MouseEvent) => void; color: string }) {
  return (
    <button onClick={onClick} style={{ fontSize: 11, fontWeight: 800, color: '#fff', background: color, border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', boxShadow: '0 2px 0 rgba(0,0,0,0.3)' }}>
      {children}
    </button>
  );
}

function DrawerTab({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ padding: '2px 10px', borderRadius: 4, fontSize: 11, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit',
      background: on ? `linear-gradient(#ffe98a, ${MG.gold})` : '#e9e2cc', color: MG.blueDk, border: `2px solid ${MG.blueDk}` }}>
      {children}
    </button>
  );
}

function SurfaceSwatch({ css, name, active, onClick, art }: { css: string; name: string; active: boolean; onClick: () => void; art?: string }) {
  return (
    <button onClick={onClick} style={{ flex: '0 0 84px', borderRadius: 8, cursor: 'pointer', background: '#fffaf0', padding: 4,
      border: active ? `3px solid ${MG.green}` : `2px solid ${MG.panelEdge}`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', height: 40, borderRadius: 5, border: '1px solid rgba(0,0,0,0.15)', overflow: 'hidden',
        background: art ? `url(${art}) center / cover` : css }} />
      <span style={{ fontSize: 10, fontWeight: 700, marginTop: 3 }}>{name}{active ? ' (on)' : ''}</span>
    </button>
  );
}

function Empty({ onGo }: { onGo: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 8px' }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: MG.sub }}>No furniture yet. Earn some Maple Bucks and visit the Furniture Store!</span>
      <MGButton color="gold" onClick={onGo} style={{ fontSize: 13 }}><Coin size={14} /> Go shopping</MGButton>
    </div>
  );
}
