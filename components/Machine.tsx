'use client';

import { TurnOffDialog, Standby } from '@/components/boot/TurnOffDialog';
import RoomLife from './RoomLife';
import { useEffect, useRef, useState } from 'react';
import { useSystem } from '@/store/system';
import { useSave } from '@/store/save';
import { useWindows } from '@/store/windows';
import { sounds } from '@/lib/sounds';
import {
  ROOM_SRC,
  ROOM_W,
  ROOM_H,
  SCREEN,
  SCREEN_TRANSFORM,
  HOTSPOTS,
  type Hotspot,
} from '@/lib/scene';
import SmallScreen from '@/components/SmallScreen';
import { useMonitor } from '@/lib/useMonitor';
import BootScreen from '@/components/boot/BootScreen';
import LoginScreen from '@/components/boot/LoginScreen';
import ShutdownScreen from '@/components/boot/ShutdownScreen';
import Desktop from '@/components/desktop/Desktop';
import Dialogs from '@/components/window/Dialogs';
import MonitorOSD from '@/components/MonitorOSD';
import InspectModal from '@/components/InspectModal';
import WiggleLayer from '@/components/WiggleLayer';

export default function Machine() {
  const wasOk = useRef(false);
  const phase = useSystem((s) => s.phase);
  const bootSession = useSystem((s) => s.bootSession);
  const hasShutdown = useSystem((s) => s.hasShutdown);
  const powerOn = useSystem((s) => s.powerOn);
  const osdOpen = useSystem((s) => s.osdOpen);
  const osdSel = useSystem((s) => s.osdSel);
  const degaussTick = useSystem((s) => s.degaussTick);
  const bumpDegauss = useSystem((s) => s.bumpDegauss);

  const crtFxOn = useSave((s) => s.crtFxOn);
  const colorBits = useSave((s) => s.colorBits);
  const refreshHz = useSave((s) => s.refreshHz);
  const fontSmooth = useSave((s) => s.fontSmooth);
  const brightness = useSave((s) => s.brightness);
  const contrast = useSave((s) => s.contrast);
  const volume = useSave((s) => s.volume);
  const hpos = useSave((s) => s.hpos);

  const inspecting = useSystem((s) => s.inspecting);
  const turnOff = useSystem((s) => s.turnOff);
  const [coarse, setCoarse] = useState(false);
  useEffect(() => { setCoarse(window.matchMedia('(pointer: coarse)').matches); }, []);
  const setInspecting = useSystem((s) => s.setInspecting);
  const { press } = useMonitor();
  const [gate, setGate] = useState<'ok' | 'rotate' | 'phone' | 'small'>('ok');
  const [vp, setVp] = useState({ w: 0, h: 0 });
  const [focused, setFocused] = useState(false);
  const [zooming, setZooming] = useState(false);
  useEffect(() => { setZooming(true); const t = window.setTimeout(() => setZooming(false), 1300); return () => window.clearTimeout(t); }, [focused]);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setVp({ w, h });
      const usableNow = w >= 940 && h >= 600;
      const rotatable = Math.max(w, h) >= 940 && Math.min(w, h) >= 600;
      const touch = window.matchMedia('(pointer: coarse)').matches;
      setGate(usableNow ? 'ok' : touch ? (rotatable ? 'rotate' : 'phone') : 'small');
    };
    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);

  useEffect(() => {
    sounds.setVolume(volume / 100);
  }, [volume]);

  useEffect(() => {
    if (phase === 'desktop') {
      const t = setTimeout(() => setFocused(true), 550);
      return () => clearTimeout(t);
    }
    setFocused(false);
  }, [phase]);

  useEffect(() => {
    if (!focused) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const sys = useSystem.getState();
      const busy = useWindows.getState().windows.some((w) => !w.minimized)
        || sys.dialogs.length > 0 || sys.startOpen || sys.osdOpen;
      if (!busy) setFocused(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focused]);

  const screenLive = phase !== 'off';

  const handlePower = () => {
    if (phase === 'off') {
      sounds.unlock();
      sounds.thock();
      powerOn();
      setTimeout(() => bumpDegauss(), 1000);
    } else {
      sounds.thock();
      const st = useSystem.getState();
      if (st.standby) { st.setStandby(false); return; }
      if (phase === 'desktop' || phase === 'login') {
        st.setStartOpen(false);
        st.setTurnOff(true);
        setFocused(true);
      }
    }
  };

  const onHotspot = (h: Hotspot) => {
    if (h.kind === 'power') return handlePower();
    if (h.kind === 'osd' && h.osdButton) return press(h.osdButton);
    if (h.kind === 'inspect') {
      sounds.pickUp();
      setInspecting(h.id);
    }
    if (h.kind === 'wiggle') {
      window.dispatchEvent(new CustomEvent('wb-wiggle', { detail: h.id }));
    }
  };

  if (gate === 'ok') wasOk.current = true;
  if (gate !== 'ok' && !wasOk.current) return <SmallScreen kind={gate} />;

  const screenFilter = {
    filter:
      'brightness(' +
      (0.55 + (brightness / 100) * 0.9).toFixed(3) +
      ') contrast(' +
      (0.6 + (contrast / 100) * 0.8).toFixed(3) +
      ')',
    transform: 'translateX(' + hpos + 'px)',
  };

  const power = HOTSPOTS.find((h) => h.kind === 'power');
  const bandTop = SCREEN.top - 2;
  const bandBottom = (power ? power.top + power.height : SCREEN.top + SCREEN.height) + 2;
  const contain = vp.w ? Math.min(vp.w / ROOM_W, vp.h / ROOM_H) : 0;
  const cover = vp.w ? Math.max(vp.w / ROOM_W, vp.h / ROOM_H) : 0;
  const fit = coarse ? cover : contain;
  const cw = ROOM_W * fit;
  const ch = ROOM_H * fit;
  const sx = (cw * (SCREEN.left + SCREEN.width / 2)) / 100;
  const sy = (ch * (SCREEN.top + SCREEN.height / 2)) / 100;
  const bandFits = (ch * (bandBottom - bandTop)) / 100 <= vp.h;
  const wantY = bandFits ? vp.h / 2 - (ch * (bandTop + bandBottom)) / 200 : vp.h - (ch * bandBottom) / 100;
  const ox = Math.round(cw <= vp.w ? (vp.w - cw) / 2 : Math.min(0, Math.max(vp.w - cw, vp.w / 2 - sx)));
  const oy = Math.round(ch <= vp.h ? (vp.h - ch) / 2 : Math.min(0, Math.max(vp.h - ch, wantY)));
  const ambient = vp.w > 0 && (cw < vp.w - 1 || ch < vp.h - 1);

  const scW = (cw * SCREEN.width) / 100;
  const scH = (ch * SCREEN.height) / 100;
  const zoom = scH ? Math.min((0.9 * vp.h) / scH, (0.96 * vp.w) / scW) : 1;
  const tx = Math.round(vp.w / 2 - (ox + sx));
  const ty = Math.round(vp.h / 2 - (oy + sy));

  return (
    <div className="fixed inset-0 bg-[#0d0907] select-none overflow-hidden">
      {gate !== 'ok' && <div className="fixed inset-0" style={{ zIndex: 100000 }}><SmallScreen kind={gate} /></div>}
      {ambient && (
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'url(/room-blur.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      )}
      <div
        className="absolute wb-zoom"
        style={{
          left: ox,
          top: oy,
          width: cw,
          height: ch,
          visibility: vp.w ? 'visible' : 'hidden',
          transformOrigin: sx + 'px ' + sy + 'px',
          transform: focused ? 'translate(' + tx + 'px, ' + ty + 'px) scale(' + zoom + ')' : 'translate(0px, 0px) scale(1)',
          willChange: zooming ? 'transform' : 'auto',
        }}
      >
        <img
          src={ROOM_SRC}
          alt="A family computer on a desk by a window"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div data-fontsmooth={fontSmooth ? 'on' : 'off'}
          data-screen="1"
          className="absolute overflow-hidden"
          style={{
            left: SCREEN.left + '%',
            top: SCREEN.top + '%',
            width: SCREEN.width + '%',
            height: SCREEN.height + '%',
            transform: SCREEN_TRANSFORM,
            transformOrigin: 'center center',
            filter: colorBits === 16 ? 'contrast(1.12) saturate(1.25)' : undefined,
            background: '#000',
            borderRadius: '1.25% 1.25% 6px 6px / 1.7% 1.7% 6px 6px',
            boxShadow: 'inset 0 0 22px 6px rgba(0,0,0,0.9)',
          }}
        >
          {screenLive && (
            <div key={bootSession} className="absolute inset-0 anim-crt-on bg-black" style={screenFilter}>
              <div className={'absolute inset-0' + (degaussTick ? '' : '')} key={'dg' + degaussTick}>
                <div className={degaussTick ? 'absolute inset-0 fx-degauss' : 'absolute inset-0'}>
                  <div className="absolute inset-0" style={{ filter: turnOff ? 'grayscale(1)' : 'none', transition: turnOff ? 'filter 1.4s ease' : 'filter 0.25s ease' }}>
                    {phase === 'boot' && <BootScreen />}
                    {phase === 'login' && <LoginScreen />}
                    {phase === 'desktop' && <Desktop />}
                    {phase === 'shutdown' && <ShutdownScreen />}
                  </div>
                  <Dialogs />
                  <TurnOffDialog />
                  <Standby />
                </div>
              </div>
            </div>
          )}

          {phase === 'off' && hasShutdown && (
            <div className="absolute inset-0 bg-black" />
          )}

          <MonitorOSD open={osdOpen && screenLive} sel={osdSel} />

          {screenLive && crtFxOn && (
            <div className={'absolute inset-0 pointer-events-none fx-scanlines fx-vignette fx-grain fx-roll z-[2000] ' + (refreshHz === 75 ? 'fx-flicker-soft' : 'fx-flicker')}>
              <div className="rollbar" />
            </div>
          )}
        </div>

        <div aria-hidden="true" className="absolute pointer-events-none" style={{
          left: '56.433%', top: '78.858%', width: '0.323%', height: '0.574%', borderRadius: '50%',
          background: phase === 'off'
            ? 'radial-gradient(circle at 40% 35%, #ffb3a8 0%, #ff3b2a 45%, #c8160c 100%)'
            : 'radial-gradient(circle at 40% 35%, #d4ffd9 0%, #3cf06a 45%, #12a63a 100%)',
          boxShadow: phase === 'off'
            ? '0 0 3px 1px rgba(255,50,35,0.75), 0 0 8px rgba(255,50,35,0.35)'
            : '0 0 3px 1px rgba(60,240,100,0.75), 0 0 8px rgba(60,240,100,0.35)',
        }} />
        {!focused && HOTSPOTS.map((h) => (
          <HotZone key={h.id} h={h} onActivate={() => onHotspot(h)} />
        ))}

        {!focused && phase === 'desktop' && (
          <button
            aria-label="Use the computer"
            onClick={() => setFocused(true)}
            className="absolute cursor-pointer border-0 bg-transparent"
            style={{
              left: SCREEN.left + '%',
              top: SCREEN.top + '%',
              width: SCREEN.width + '%',
              height: SCREEN.height + '%',
              zIndex: 50,
            }}
          />
        )}

        {inspecting && <InspectModal />}
        <WiggleLayer />
      </div>

      <div aria-hidden="true" className="absolute wb-zoom pointer-events-none"
        style={{
          left: ox,
          top: oy,
          width: cw,
          height: ch,
          visibility: vp.w ? 'visible' : 'hidden',
          transformOrigin: sx + 'px ' + sy + 'px',
          transform: focused ? 'translate(' + tx + 'px, ' + ty + 'px) scale(' + zoom + ')' : 'translate(0px, 0px) scale(1)',
          willChange: zooming ? 'transform' : 'auto',
        }}>
        <RoomLife focused={focused} dim={!!inspecting} />
      </div>

      <button
        className="wb-stepback"
        onClick={() => setFocused(false)}
        aria-label="Step back from the computer"
        style={{
          position: 'absolute',
          top: 22,
          left: 22,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '7px 14px 7px 10px',
          borderRadius: 999,
          background: 'rgba(18,16,14,0.5)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          border: '1px solid rgba(240,234,216,0.22)',
          color: '#f0ead8',
          fontSize: 13,
          letterSpacing: '0.03em',
          boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
          cursor: 'pointer',
          opacity: focused ? 1 : 0,
          pointerEvents: focused ? 'auto' : 'none',
          transform: focused ? 'translateY(0)' : 'translateY(-8px)',
          transition: focused
            ? 'opacity 350ms ease 300ms, transform 350ms ease 300ms, background 160ms ease, border-color 160ms ease'
            : 'opacity 180ms ease, transform 180ms ease',
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="19" y1="12" x2="6" y2="12" />
          <polyline points="12 18 6 12 12 6" />
        </svg>
        <span>step back</span>
      </button>
    </div>
  );
}

function HotZone({
  h,
  onActivate,
}: {
  h: Hotspot;
  onActivate: () => void;
}) {
  return (
    <button
      aria-label={h.title || h.id}
      onClick={onActivate}
      className="absolute cursor-pointer p-0 border-0 bg-transparent"
      style={{
        left: h.left + '%',
        top: h.top + '%',
        width: h.width + '%',
        height: h.height + '%',
        borderRadius: h.round ? '50%' : '6px',
        boxShadow: 'none',
        background: 'transparent',
        outline: 'none',
      }}
    />
  );
}
