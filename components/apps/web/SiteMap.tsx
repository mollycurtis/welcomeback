'use client';

/* eslint-disable @next/next/no-img-element */

import { useState, type CSSProperties, type ReactNode } from 'react';

export interface Area { x: number; y: number; w: number; h: number; title: string; onClick?: () => void; href?: string }

export function ImageMap({ src, alt, areas, quiet, children, style }: { src: string; alt: string; areas: Area[]; children?: ReactNode; style?: CSSProperties ; quiet?: boolean }) {
  const [hov, setHov] = useState<number | null>(null);
  return (
    <div style={{ position: 'relative', width: '100%', lineHeight: 0, ...style }}>
      <img src={src} alt={alt} draggable={false} style={{ width: '100%', display: 'block', userSelect: 'none' }} />
      {areas.map((a, i) => (
        <a key={i} title={a.title} onClick={(e) => { e.preventDefault(); a.onClick?.(); }} href={a.href ?? '#'}
          onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
          style={{ position: 'absolute', left: `${a.x}%`, top: `${a.y}%`, width: `${a.w}%`, height: `${a.h}%`, cursor: 'pointer', display: 'block',
            background: hov === i && !quiet ? 'rgba(255,255,255,0.14)' : 'transparent', outline: hov === i && !quiet ? '1px dotted rgba(0,0,0,0.45)' : 'none' }} />
      ))}
      {children}
    </div>
  );
}

export function SubPage({ site, title, tagline, nav, children, accent = '#5a3a1e', bg = '#f3eee2', font = 'Georgia, "Times New Roman", serif', onBack, backLabel = 'Home', sidebar, topRight, footer }: {
  site: string; title: string; tagline?: string; nav?: { label: string; onClick: () => void }[]; children: ReactNode; accent?: string; bg?: string; font?: string; onBack: () => void; backLabel?: string;
  sidebar?: ReactNode; topRight?: ReactNode; footer?: ReactNode;
}) {
  return (
    <div style={{ fontFamily: font, fontSize: 12, background: bg, minHeight: '100%', color: '#222', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: `linear-gradient(${accent}, ${accent}dd)`, color: '#fff', padding: '10px 16px', display: 'flex', alignItems: 'flex-end', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 700, cursor: 'pointer' }} onClick={onBack}>{site}</div>
          {tagline && <div style={{ fontSize: 11, opacity: 0.85, fontStyle: 'italic' }}>{tagline}</div>}
        </div>
        {topRight && <div style={{ fontSize: 11 }}>{topRight}</div>}
      </div>
      {nav && (
        <div style={{ display: 'flex', gap: 14, padding: '5px 16px', background: 'rgba(0,0,0,0.08)', borderBottom: '1px solid rgba(0,0,0,0.15)', fontSize: 12, flexWrap: 'wrap' }}>
          {nav.map((n) => <span key={n.label} className="link-1999" onClick={n.onClick}>{n.label}</span>)}
        </div>
      )}
      <div style={{ display: 'flex', gap: 16, padding: '14px 18px', flex: 1 }}>
        {sidebar && <div style={{ flex: '0 0 150px', fontSize: 11, lineHeight: 1.7, background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.12)', padding: 8, alignSelf: 'flex-start' }}>{sidebar}</div>}
        <div style={{ flex: 1, minWidth: 0, maxWidth: 640 }}>
          <h1 style={{ fontSize: 18, margin: '0 0 8px', color: accent }}>{title}</h1>
          <div style={{ lineHeight: 1.55 }}>{children}</div>
          <div style={{ marginTop: 18, fontSize: 11 }}><span className="link-1999" onClick={onBack}>&larr; {backLabel}</span></div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(0,0,0,0.15)', padding: '8px 18px', fontSize: 10, color: '#666', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {footer ?? <><span className="link-1999" onClick={onBack}>Home</span><span>&middot;</span><span>Privacy Policy</span><span>&middot;</span><span>Terms of Use</span><span>&middot;</span><span>Site Map</span><span style={{ flex: 1 }} /><span>&copy; 2009 {site}. All rights reserved.</span></>}
      </div>
    </div>
  );
}

export const P = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => <p style={{ margin: '0 0 9px', ...style }}>{children}</p>;
export const H = ({ children }: { children: ReactNode }) => <h2 style={{ fontSize: 14, margin: '14px 0 5px' }}>{children}</h2>;
export const Table = ({ rows }: { rows: [string, string][] }) => (
  <table style={{ borderCollapse: 'collapse', fontSize: 12, margin: '4px 0 10px' }}>
    <tbody>{rows.map(([a, b], i) => <tr key={i} style={{ background: i % 2 ? 'rgba(0,0,0,0.04)' : 'transparent' }}><td style={{ padding: '3px 12px 3px 4px', fontWeight: 700 }}>{a}</td><td style={{ padding: '3px 4px' }}>{b}</td></tr>)}</tbody>
  </table>
);
