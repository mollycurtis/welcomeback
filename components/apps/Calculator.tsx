'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AppWindowProps } from '@/lib/registry';
import { sounds } from '@/lib/sounds';

type Op = '+' | '-' | '*' | '/' | null;

export default function Calculator({}: AppWindowProps) {
  const [display, setDisplay] = useState('0');
  const [stored, setStored] = useState<number | null>(null);
  const [op, setOp] = useState<Op>(null);
  const [fresh, setFresh] = useState(true);
  const [memory, setMemory] = useState(0);

  const digits = useCallback((d: string) => {
    setDisplay((cur) => {
      if (d === '.') {
        if (fresh) { setFresh(false); return '0.'; }
        return cur.includes('.') ? cur : cur + '.';
      }
      if (fresh) { setFresh(false); return d; }
      if (cur === '0') return d;
      return cur.length < 16 ? cur + d : cur;
    });
  }, [fresh]);

  const apply = (a: number, b: number, o: Op): number => {
    switch (o) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b === 0 ? NaN : a / b;
      default: return b;
    }
  };

  const show = (n: number) => {
    if (!isFinite(n)) return 'Cannot divide by zero.';
    const r = Math.round(n * 1e10) / 1e10;
    return String(r).length > 16 ? r.toExponential(9) : String(r);
  };

  const chooseOp = (o: Exclude<Op, null>) => {
    const cur = parseFloat(display);
    if (stored !== null && op && !fresh) {
      const r = apply(stored, cur, op);
      setStored(r); setDisplay(show(r));
    } else setStored(cur);
    setOp(o); setFresh(true);
  };

  const equals = () => {
    if (stored === null || !op) return;
    const r = apply(stored, parseFloat(display), op);
    setDisplay(show(r)); setStored(null); setOp(null); setFresh(true);
  };

  const clearAll = () => { setDisplay('0'); setStored(null); setOp(null); setFresh(true); };
  const clearEntry = () => { setDisplay('0'); setFresh(true); };
  const back = () => setDisplay((c) => (c.length <= 1 || fresh ? '0' : c.slice(0, -1)));

  const press = (label: string) => {
    sounds.blip();
    if (/^[0-9.]$/.test(label)) return digits(label);
    switch (label) {
      case '+': case '-': case '*': case '/': return chooseOp(label);
      case '=': return equals();
      case 'C': return clearAll();
      case 'CE': return clearEntry();
      case '<': return back();
      case '+/-': return setDisplay((c) => (c.startsWith('-') ? c.slice(1) : c === '0' ? c : '-' + c));
      case 'sqrt': return setDisplay(show(Math.sqrt(parseFloat(display))));
      case '%': return setDisplay(show(parseFloat(display) / 100));
      case '1/x': return setDisplay(show(1 / parseFloat(display)));
      case 'MC': return setMemory(0);
      case 'MR': { setDisplay(show(memory)); setFresh(true); return; }
      case 'MS': return setMemory(parseFloat(display));
      case 'M+': return setMemory((m) => m + parseFloat(display));
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      if (/^[0-9.]$/.test(k)) { press(k); e.preventDefault(); return; }
      if (['+', '-', '*', '/'].includes(k)) { press(k); e.preventDefault(); return; }
      if (k === 'Enter' || k === '=') { press('='); e.preventDefault(); return; }
      if (k === 'Backspace') { press('<'); e.preventDefault(); return; }
      if (k === 'Escape') { press('C'); e.preventDefault(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const key = (label: string, tone: 'num' | 'op' | 'fn' | 'mem' = 'num') => (
    <button key={label} onClick={() => press(label)}
      style={{
        fontFamily: 'Tahoma, Verdana, sans-serif',
        fontSize: label.length > 2 ? 10 : 13,
        fontWeight: 700,
        color: tone === 'fn' ? '#b02a1a' : tone === 'num' ? '#0a1a6a' : tone === 'mem' ? '#b02a1a' : '#0a1a6a',
        background: '#d4d0c8', border: '2px outset #f4f4ee',
        padding: 0, cursor: 'pointer', minWidth: 0,
      }}>{label}</button>
  );

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#d4d0c8', padding: 6, display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{
        background: '#fff', border: '2px inset #e8e8e2', padding: '0 7px',
        fontFamily: 'Tahoma, Verdana, sans-serif', fontSize: 16, textAlign: 'right',
        height: 26, lineHeight: '26px',
        overflow: 'hidden', whiteSpace: 'nowrap', flex: '0 0 auto',
      }}>{display}</div>

      <div style={{ display: 'flex', gap: 4, flex: '0 0 auto' }}>
        <div style={{ width: 28, flex: '0 0 28px' }} />
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
          {key('<', 'fn')}{key('CE', 'fn')}{key('C', 'fn')}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: 4, minHeight: 0 }}>
        <div style={{ width: 28, flex: '0 0 28px', display: 'grid', gridTemplateRows: 'repeat(4, 1fr)', gap: 4 }}>
          {key('MC', 'mem')}{key('MR', 'mem')}{key('MS', 'mem')}{key('M+', 'mem')}
        </div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', gap: 4 }}>
          {key('7')}{key('8')}{key('9')}{key('/', 'op')}{key('sqrt', 'op')}
          {key('4')}{key('5')}{key('6')}{key('*', 'op')}{key('%', 'op')}
          {key('1')}{key('2')}{key('3')}{key('-', 'op')}{key('1/x', 'op')}
          {key('0')}{key('+/-')}{key('.')}{key('+', 'op')}{key('=', 'op')}
        </div>
      </div>
    </div>
  );
}
