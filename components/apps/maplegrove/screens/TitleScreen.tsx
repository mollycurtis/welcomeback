'use client';

import { MG, MGButton, FONT_TITLE, bevel } from '../ui';
import { Backdrop } from '../Backdrop';

export function TitleScreen({ hasResident, onPlay, onNew }: { hasResident: boolean; onPlay: () => void; onNew: () => void }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Backdrop bg="mainstreet"
        overlay={
          <>
            <div style={{ position: 'absolute', top: '14%', left: 0, right: 0, textAlign: 'center' }}>
              <div style={{ display: 'inline-block', padding: '6px 26px 10px', background: `linear-gradient(${MG.blueLt}, ${MG.blue} 60%, ${MG.blueDk})`, border: `3px solid ${MG.blueDk}`, borderRadius: 8, boxShadow: `${bevel('rgba(255,255,255,0.4)', 'rgba(0,0,0,0.4)')}, 4px 6px 0 rgba(0,0,0,0.4)` }}>
                <div style={{ fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 'clamp(30px, 7vw, 54px)', lineHeight: 0.9, color: MG.gold, letterSpacing: -2, textTransform: 'uppercase',
                  textShadow: `3px 3px 0 ${MG.blueDk}, -1px -1px 0 ${MG.blueDk}, 1px -1px 0 ${MG.blueDk}, -1px 1px 0 ${MG.blueDk}, 5px 6px 0 rgba(0,0,0,0.35)` }}>
                  Maple<br />Grove
                </div>
                <div style={{ marginTop: 6, fontSize: 12, color: '#fff', fontWeight: 900, textShadow: '1px 1px 0 rgba(0,0,0,0.6)' }}>
                  a small town · big possibilities
                </div>
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: '20%', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 12 }}>
              <MGButton color="gold" style={{ fontSize: 18, padding: '9px 28px', fontFamily: FONT_TITLE, textTransform: 'uppercase' }} onClick={hasResident ? onPlay : onNew}>
                {hasResident ? 'Enter Town' : 'Play'}
              </MGButton>
              {hasResident && (
                <MGButton color="purple" style={{ fontSize: 14, padding: '9px 16px' }} onClick={onNew}>New Resident</MGButton>
              )}
            </div>
          </>
        } />
    </div>
  );
}
