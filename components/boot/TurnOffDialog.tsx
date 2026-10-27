'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useSystem } from '@/store/system';
import { sounds } from '@/lib/sounds';

const TITLE_FONT = '"Franklin Gothic Medium", "Trebuchet MS", Tahoma, Verdana, sans-serif';
const UI_FONT = 'Tahoma, Verdana, "Segoe UI", sans-serif';

function PowerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
      <path d="M12 3v9" />
      <path d="M6.3 7.2a8 8 0 1 0 11.4 0" />
    </svg>
  );
}

function RestartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" />
      <path d="M19.5 3.5v4.8h-4.8" />
    </svg>
  );
}

function RoundButton({ label, from, to, icon, onClick }: { label: string; from: string; to: string; icon: ReactNode; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button aria-label={label} onClick={onClick} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'none', border: 0, cursor: 'pointer', padding: 0, width: 80 }}>
      <span style={{
        width: 33, height: 33, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(180deg, ${from} 0%, ${to} 100%)`, border: '1px solid rgba(255,255,255,0.85)',
        boxShadow: hover ? '0 0 0 2px rgba(255,255,255,0.55), 1px 2px 3px rgba(0,0,0,0.45)' : '1px 2px 3px rgba(0,0,0,0.45)',
        filter: hover ? 'brightness(1.12)' : 'none',
      }}>
        {icon}
      </span>
      <span style={{ color: '#fff', fontFamily: UI_FONT, fontSize: 11, textDecoration: hover ? 'underline' : 'none' }}>{label}</span>
    </button>
  );
}

export function TurnOffDialog() {
  const open = useSystem((s) => s.turnOff);
  const setTurnOff = useSystem((s) => s.setTurnOff);
  const setRestarting = useSystem((s) => s.setRestarting);
  const setStandby = useSystem((s) => s.setStandby);
  const setPhase = useSystem((s) => s.setPhase);
  const setStartOpen = useSystem((s) => s.setStartOpen);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setTurnOff(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setTurnOff]);

  if (!open) return null;
  const choose = (what: 'standby' | 'off' | 'restart') => {
    sounds.click();
    setTurnOff(false);
    setStartOpen(false);
    if (what === 'standby') { setStandby(true); return; }
    setRestarting(what === 'restart');
    setPhase('shutdown');
  };

  return (
    <div className="absolute inset-0" style={{ zIndex: 99990 }}>
      <div role="dialog" aria-label="Turn off computer" className="absolute" style={{
        left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 312,
        boxShadow: '2px 3px 10px rgba(0,0,0,0.5)', userSelect: 'none',
      }}>
        <div style={{ height: 46, background: 'linear-gradient(180deg, #0b2d9a 0%, #082587 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px 0 14px' }}>
          <span style={{ color: '#fff', fontFamily: TITLE_FONT, fontSize: 17 }}>Turn off computer</span>
        </div>
        <div style={{ height: 2, background: 'linear-gradient(90deg, #4f75d8 0%, #c7d6f6 35%, #c7d6f6 65%, #4f75d8 100%)' }} />
        <div style={{ background: 'linear-gradient(180deg, #7392e3 0%, #5a7edc 100%)', display: 'flex', justifyContent: 'space-evenly', padding: '24px 4px 20px' }}>
          <RoundButton label="Stand By" from="#f8d24d" to="#d68a0c" icon={<PowerIcon />} onClick={() => choose('standby')} />
          <RoundButton label="Turn Off" from="#ef6a3a" to="#bf2a10" icon={<PowerIcon />} onClick={() => choose('off')} />
          <RoundButton label="Restart" from="#70cc4a" to="#2f8f1c" icon={<RestartIcon />} onClick={() => choose('restart')} />
        </div>
        <div style={{ height: 44, background: 'linear-gradient(180deg, #082587 0%, #0b2d9a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 14px' }}>
          <button onClick={() => { sounds.click(); setTurnOff(false); }} style={{
            fontFamily: UI_FONT, fontSize: 11, color: '#000', minWidth: 72, padding: '3px 10px', cursor: 'pointer',
            background: 'linear-gradient(180deg, #ffffff 0%, #ecebe6 86%, #d6d0c5 100%)', border: '1px solid #003c74', borderRadius: 3,
          }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export function Standby() {
  const standby = useSystem((s) => s.standby);
  const setStandby = useSystem((s) => s.setStandby);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (!standby) { setDark(false); return; }
    const t = window.setTimeout(() => setDark(true), 50);
    let armed = false;
    const arm = window.setTimeout(() => { armed = true; }, 1500);
    const wake = () => { if (armed) setStandby(false); };
    window.addEventListener('keydown', wake);
    window.addEventListener('pointerdown', wake);
    window.addEventListener('mousemove', wake);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(arm);
      window.removeEventListener('keydown', wake);
      window.removeEventListener('pointerdown', wake);
      window.removeEventListener('mousemove', wake);
    };
  }, [standby, setStandby]);

  if (!standby) return null;
  return (
    <div aria-hidden="true" className="absolute inset-0 bg-black" style={{ zIndex: 99995, opacity: dark ? 1 : 0, transition: 'opacity 1s ease' }} />
  );
}
