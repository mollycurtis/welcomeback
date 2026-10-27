'use client';

import { useState } from 'react';
import { MG, MGButton, MGPanel, Coin, FONT_TITLE } from '../ui';
import { Hud } from '../Hud';
import { Backdrop, Caption, Hotspot, ShopPanel } from '../Backdrop';
import { ResidentSprites, useTalk } from '../Residents';
import { useToast } from '../SetPieces';
import { useMaple } from '@/store/maplegrove';

export function BankScreen() {
  const bucks = useMaple((s) => s.bucks); const savings = useMaple((s) => s.savings); const earned = useMaple((s) => s.interestEarned);
  const deposit = useMaple((s) => s.deposit); const withdraw = useMaple((s) => s.withdraw); const goTo = useMaple((s) => s.goTo);
  const [amt, setAmt] = useState(50); const [msg, setMsg] = useState('');
  const [open, setOpen] = useState(false); const { talk, panel } = useTalk(); const { flash, node } = useToast();
  const GOAL = 2500;
  const act = (fn: (n: number) => boolean, verb: string) => { if (fn(amt)) setMsg(`${verb} ${amt} Maple Bucks.`); else setMsg(verb === 'Deposited' ? "You don't have that much in your wallet." : "You don't have that much saved."); };
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <Hud title="Maple Bank" />
      <div style={{ position: 'relative', flex: 1 }}>
        <Backdrop bg="bank" people={<ResidentSprites loc="bank" onTalk={talk} />}
          overlay={<>
            <Caption>Maple Bank. Savings pay 2% a day. Step up to the counter to deposit or withdraw.</Caption>
            {open && (<ShopPanel title="Member Services" onClose={() => setOpen(false)} width="70%">
      <div style={{ display: 'flex', gap: 14, padding: 14, flexWrap: 'wrap', fontSize: 12, color: MG.ink }}>
        <div style={{ flex: '1 1 260px' }}>
          <MGPanel pad={12} style={{ background: MG.paper }}>
            <div style={{ fontFamily: FONT_TITLE, fontWeight: 900, color: MG.blue, fontSize: 14, textTransform: 'uppercase' }}>Your accounts</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, padding: '6px 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}><span>Wallet</span><b><Coin size={12} /> {bucks.toLocaleString()}</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}><span>Savings (2% daily)</span><b><Coin size={12} /> {savings.toLocaleString()}</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}><span>Interest earned to date</span><b style={{ color: MG.greenDk }}>+{earned}</b></div>
            <div style={{ marginTop: 10, fontSize: 11, color: MG.sub }}>Amount</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
              {[25, 50, 100, 250].map((n) => <button key={n} onClick={() => setAmt(n)} style={{ border: `2px solid ${MG.blueDk}`, borderRadius: 4, padding: '2px 8px', fontWeight: 900, fontSize: 11, cursor: 'pointer', background: amt === n ? `linear-gradient(#ffe98a, ${MG.gold})` : '#e9e2cc', color: MG.blueDk, fontFamily: 'inherit' }}>{n}</button>)}
              <input type="number" value={amt} min={1} onChange={(e) => setAmt(Math.max(1, Number(e.target.value) || 1))} style={{ width: 70, padding: '3px 6px', border: `2px solid ${MG.blueDk}`, borderRadius: 4, fontFamily: 'inherit', fontSize: 12 }} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <MGButton color="green" style={{ fontSize: 12 }} onClick={() => act(deposit, 'Deposited')}>Deposit</MGButton>
              <MGButton color="gold" style={{ fontSize: 12 }} onClick={() => act(withdraw, 'Withdrew')}>Withdraw</MGButton>
            </div>
            {msg && <div style={{ marginTop: 6, fontWeight: 700, color: MG.blueDk }}>{msg}</div>}
          </MGPanel>
        </div>
        <div style={{ flex: '1 1 220px' }}>
          <MGPanel pad={12} style={{ background: MG.paper }}>
            <div style={{ fontFamily: FONT_TITLE, fontWeight: 900, color: MG.blue, fontSize: 14, textTransform: 'uppercase' }}>Savings goal</div>
            <div style={{ fontSize: 11, color: MG.sub, margin: '4px 0 6px' }}>A house on Woodbury costs {GOAL.toLocaleString()} Maple Bucks. Interest gets you there faster.</div>
            <div style={{ height: 14, background: '#e9e2cc', border: `2px solid ${MG.blueDk}`, borderRadius: 4 }}><div style={{ width: `${Math.min(100, (savings / GOAL) * 100)}%`, height: '100%', background: MG.green }} /></div>
            <div style={{ fontSize: 11, marginTop: 4, textAlign: 'right' }}>{Math.min(100, Math.round((savings / GOAL) * 100))}%</div>
            <div style={{ fontFamily: FONT_TITLE, fontWeight: 900, color: MG.blue, fontSize: 12, textTransform: 'uppercase', marginTop: 12 }}>How to earn</div>
            <ul style={{ margin: '4px 0 0', paddingLeft: 16, lineHeight: 1.6, fontSize: 11 }}>
              <li><span className="link-1999" onClick={() => goTo('arcade')}>Arcade</span> games pay Maple Bucks and Tickets</li>
              <li><span className="link-1999" onClick={() => goTo('academy')}>Academy</span> classes pay per correct answer</li>
              <li><span className="link-1999" onClick={() => goTo('riverside')}>Lakeville</span> fish sell themselves</li>
              <li><span className="link-1999" onClick={() => goTo('map')}>Daily goals</span> on the town map</li>
            </ul>
          </MGPanel>
        </div>
      </div>
            </ShopPanel>)}
          </>}>
          <Hotspot x={24} y={40} w={54} h={30} label="Teller counter" sub="deposit · withdraw" onClick={() => setOpen(true)} />
          <Hotspot x={84} y={12} w={16} h={64} label="The vault" sub="employees only" disabled labelAt="bottom" />
          <Hotspot x={4} y={52} w={18} h={26} label="Waiting chairs" sub="sit a while" onClick={() => { if (useMaple.getState().doDaily('bank_chairs')) { useMaple.getState().addBucks(20); flash('Someone left 20 Maple Bucks between the cushions. Finders keepers.'); } else flash('You already checked the cushions today.'); }} labelAt="top" />
          {node}
          {panel}
        </Backdrop>
      </div>
    </div>
  );
}
