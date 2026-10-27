'use client';
/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';

const PINK = '#d84ea4';
type Tab = 'hair' | 'makeup' | 'nails';
const LIPS = ['transparent', '#e0508a', '#c2185b', '#ff8ab8', '#a0522d', '#ff5252', '#b06ad8'];
const BLUSH = ['transparent', 'rgba(255,120,150,0.45)', 'rgba(255,160,120,0.45)', 'rgba(230,100,170,0.45)'];
const SHADOW = ['transparent', 'rgba(120,80,200,0.45)', 'rgba(80,140,220,0.45)', 'rgba(230,150,60,0.45)', 'rgba(60,160,120,0.45)', 'rgba(255,255,255,0.35)'];
const NAILS = ['#f5d6e0', '#ff4f8b', '#c2185b', '#8a2be2', '#2b7bd8', '#111', '#ffe14a', '#4ad9c2', '#fff'];
const HAIR_STYLE = ['Natural', 'Sleek', 'Glossy', 'Sparkly'];
const FACE = { lips: { x: 50.7, y: 46.2, w: 9.6, h: 3.4 }, cheekL: { x: 36, y: 42.5 }, cheekR: { x: 65, y: 42.5 }, eyeL: { x: 37.5, y: 34.5 }, eyeR: { x: 62.5, y: 34.5 } };
const NAIL_POS: [number, number][] = [[3.4, 71], [12.3, 86], [23, 87], [31.9, 76], [37.3, 42], [63.2, 76], [72.5, 86], [83.3, 86], [91.2, 68], [58.8, 42]];

export function DressUp({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<Tab>('hair');
  const [brush, setBrush] = useState(0);
  const [hair, setHair] = useState(0);
  const [lip, setLip] = useState(0); const [blush, setBlush] = useState(0); const [shadow, setShadow] = useState(0);
  const [nails, setNails] = useState<number[]>(Array(10).fill(0));
  const [nailColor, setNailColor] = useState(1);
  const [saved, setSaved] = useState('');
  const shine = Math.min(1, brush / 12);

  const Chip = ({ c, on, onClick }: { c: string; on: boolean; onClick: () => void }) => (
    <button onClick={onClick} aria-label={c} style={{ width: 26, height: 26, borderRadius: 13, border: on ? `3px solid ${PINK}` : '2px solid #e8b4d2', background: c === 'transparent' ? 'repeating-linear-gradient(45deg,#fff 0 4px,#f3d3e3 4px 8px)' : c, cursor: 'pointer', padding: 0 }} />
  );
  const TabBtn = ({ id, label }: { id: Tab; label: string }) => (
    <button onClick={() => setTab(id)} style={{ flex: 1, padding: '6px 0', border: `2px solid ${PINK}`, borderRadius: 6, background: tab === id ? PINK : '#fff', color: tab === id ? '#fff' : '#8a0a4a', fontWeight: 900, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>{label}</button>
  );

  return (
    <div style={{ fontFamily: 'Verdana, Tahoma, sans-serif', background: '#dfe9f7', minHeight: '100%', padding: 10 }}>
      <div style={{ background: PINK, color: '#fff', fontWeight: 900, fontSize: 15, padding: '5px 10px', borderRadius: '6px 6px 0 0', display: 'flex', alignItems: 'center' }}>
        ▶ Makeover Studio<span style={{ flex: 1 }} /><span className="link-1999" style={{ color: '#fff', fontSize: 11, fontWeight: 400 }} onClick={onBack}>&larr; back to GameFort</span>
      </div>
      <div style={{ border: `3px solid ${PINK}`, borderTop: 'none', background: '#fff0f7', padding: 10, display: 'flex', gap: 12 }}>
        <div onClick={tab === 'hair' ? () => setBrush((b) => b + 1) : undefined}
          style={{ position: 'relative', flex: '0 0 210px', height: 260, borderRadius: 8, border: `3px solid ${PINK}`, overflow: 'hidden', cursor: tab === 'hair' ? 'grab' : 'default', background: 'linear-gradient(#ffd6ea, #f7b6d6)' }}>
          <img src="/sites/makeover-portrait.png" alt="Ava" draggable={false} style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none', filter: hair === 1 ? 'contrast(1.05)' : hair === 2 ? 'saturate(1.2) brightness(1.03)' : 'none' }} />
          <div style={{ position: 'absolute', left: `${FACE.lips.x}%`, top: `${FACE.lips.y}%`, width: `${FACE.lips.w}%`, height: `${FACE.lips.h}%`, transform: 'translate(-50%,-50%)', borderRadius: '45% 45% 50% 50%', background: LIPS[lip], mixBlendMode: 'multiply', opacity: 0.85, pointerEvents: 'none' }} />
          {[FACE.cheekL, FACE.cheekR].map((c, i) => <div key={i} style={{ position: 'absolute', left: `${c.x}%`, top: `${c.y}%`, width: 34, height: 20, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: BLUSH[blush], filter: 'blur(5px)', pointerEvents: 'none' }} />)}
          {[FACE.eyeL, FACE.eyeR].map((c, i) => <div key={i} style={{ position: 'absolute', left: `${c.x}%`, top: `${c.y}%`, width: 30, height: 12, transform: 'translate(-50%,-110%)', borderRadius: '50% 50% 30% 30%', background: SHADOW[shadow], filter: 'blur(2px)', pointerEvents: 'none' }} />)}
          <div style={{ position: 'absolute', left: '14%', top: '2%', width: '72%', height: '70%', borderRadius: '50%', background: `radial-gradient(ellipse at 40% 20%, rgba(255,255,255,${0.5 * shine}), transparent 50%)`, pointerEvents: 'none' }} />
          {hair === 3 && shine > 0.5 && ['18%,20%', '70%,30%', '30%,60%', '66%,70%'].map((p, i) => { const [l, t] = p.split(','); return <span key={i} style={{ position: 'absolute', left: l, top: t, color: '#fff', textShadow: '0 0 6px #fff', fontSize: 14, pointerEvents: 'none' }}>✦</span>; })}
          {tab === 'hair' && <div style={{ position: 'absolute', bottom: 6, left: 0, right: 0, textAlign: 'center', fontSize: 11, fontWeight: 900, color: '#8a0a4a', background: 'rgba(255,255,255,0.7)' }}>{brush < 12 ? `click to brush (${brush}/12)` : 'shiny!'}</div>}
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: '#8a0a4a' }}>
          <div style={{ display: 'flex', gap: 6 }}><TabBtn id="hair" label="Hair" /><TabBtn id="makeup" label="Makeup" /><TabBtn id="nails" label="Nails" /></div>
          {tab === 'hair' && (
            <>
              <div>Click her hair to brush it. Then pick a finish:</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{HAIR_STYLE.map((h, i) => <button key={h} onClick={() => setHair(i)} style={{ padding: '4px 10px', border: `2px solid ${PINK}`, borderRadius: 4, background: hair === i ? PINK : '#fff', color: hair === i ? '#fff' : '#8a0a4a', fontWeight: 900, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>{h}</button>)}</div>
            </>
          )}
          {tab === 'makeup' && (
            <>
              <div style={{ fontWeight: 900 }}>Lipstick</div><div style={{ display: 'flex', gap: 5 }}>{LIPS.map((c, i) => <Chip key={c} c={c} on={lip === i} onClick={() => setLip(i)} />)}</div>
              <div style={{ fontWeight: 900 }}>Blush</div><div style={{ display: 'flex', gap: 5 }}>{BLUSH.map((c, i) => <Chip key={c} c={c} on={blush === i} onClick={() => setBlush(i)} />)}</div>
              <div style={{ fontWeight: 900 }}>Eyeshadow</div><div style={{ display: 'flex', gap: 5 }}>{SHADOW.map((c, i) => <Chip key={c} c={c} on={shadow === i} onClick={() => setShadow(i)} />)}</div>
            </>
          )}
          {tab === 'nails' && (
            <>
              <div>Pick a polish, then click each nail:</div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>{NAILS.map((c, i) => <Chip key={c} c={c} on={nailColor === i} onClick={() => setNailColor(i)} />)}</div>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1020 / 455', margin: '4px 0 0' }}>
                <img src="/sites/makeover-hands.png" alt="hands" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
                {NAIL_POS.map(([nx, ny], idx) => (
                  <button key={idx} onClick={() => setNails((n) => n.map((v, i) => (i === idx ? nailColor : v)))} aria-label={`nail ${idx + 1}`}
                    style={{ position: 'absolute', left: `${nx}%`, top: `${ny}%`, width: '5.2%', height: '12%', transform: 'translate(-50%,-50%) rotate(' + (idx === 4 || idx === 9 ? '0' : idx < 5 ? '-8' : '8') + 'deg)', borderRadius: '45% 45% 40% 40%', background: NAILS[nails[idx]], border: '1px solid rgba(120,60,40,0.5)', cursor: 'pointer', padding: 0, mixBlendMode: nails[idx] === 0 ? 'normal' : 'multiply', opacity: 0.95 }} />
                ))}
              </div>
            </>
          )}
          <div style={{ marginTop: 'auto', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setSaved('Saved! Ava says thank you.')} style={{ background: `linear-gradient(#ff9ad5, ${PINK})`, border: '2px solid #ffd6ff', color: '#fff', fontWeight: 900, fontSize: 11, padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit' }}>SAVE LOOK</button>
            <button onClick={() => { setBrush(0); setHair(0); setLip(0); setBlush(0); setShadow(0); setNails(Array(10).fill(0)); setSaved(''); }} style={{ background: '#fff', border: `2px solid ${PINK}`, color: '#8a0a4a', fontWeight: 900, fontSize: 11, padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit' }}>Start over</button>
            <span style={{ fontSize: 11, flex: '1 1 100%', minHeight: 14, color: '#8a0a4a' }}>{saved}</span>
          </div>
        </div>
      </div>
      <div style={{ fontSize: 11, padding: '6px 2px', color: '#1a2a55' }}>Brush, paint, glam. There is no wrong answer.</div>
    </div>
  );
}
