'use client';

import { useEffect, useRef, useState } from 'react';
import { useSystem } from '@/store/system';
import { useSave } from '@/store/save';
import { sounds } from '@/lib/sounds';

const BIOS_LINES = [
  'SYSTEM BIOS v2.04',
  'Copyright (C) 1998-2003',
  'WELCOME BACK  (C) 2027 Molly Curtis',
  '',
  'Main Processor : 1.2 GHz',
  '@MEM',
  '',
  'Detecting IDE drives ...',
  '  Primary Master  : 40 GB HDD',
  '  Primary Slave   : CD-RW DRIVE',
  'Keyboard ........ DETECTED',
  'Mouse ........... DETECTED',
  '',
  'Press DEL to enter SETUP',
  'Booting from C: ...',
];

type Step = 'bios' | 'logo' | 'lastlogin';

export default function BootScreen() {
  const setPhase = useSystem((s) => s.setPhase);
  const bootCount = useSave((s) => s.bootCount);
  
  const fast = bootCount > 0;
  const [step, setStep] = useState<Step>(fast ? 'logo' : 'bios');
  const [lineCount, setLineCount] = useState(0);
  const [mem, setMem] = useState(0);
  const [chunks, setChunks] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);
  const startedSound = useRef(false);

  useEffect(() => {
    if (!fast) sounds.post();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (step !== 'bios') return;
    if (lineCount >= BIOS_LINES.length) {
      const t = setTimeout(() => setStep('logo'), 500);
      return () => clearTimeout(t);
    }
    const current = BIOS_LINES[lineCount];
    if (current === '@MEM') {
      const t = setInterval(() => {
        setMem((m) => {
          const next = Math.min(m + 16384, 262144);
          if (next >= 262144) {
            clearInterval(t);
            setLineCount((i) => i + 1);
          }
          return next;
        });
      }, 26);
      return () => clearInterval(t);
    }
    const t = setTimeout(() => setLineCount((i) => i + 1), lineCount === 0 ? 200 : 98);
    return () => clearTimeout(t);
  }, [step, lineCount]);

  useEffect(() => {
    if (step !== 'logo') return;
    if (!startedSound.current) {
      startedSound.current = true;
      sounds.startup();
    }
    const TOTAL = 22;
    const t = setInterval(() => {
      setChunks((c) => {
        if (c < TOTAL - 1) return c + 1;
        clearInterval(t);
        return c;
      });
    }, 85);
    const finish = setTimeout(() => {
      setChunks(22);
      setTimeout(() => setStep('lastlogin'), 350);
    }, 85 * 22 + 650);
    return () => {
      clearInterval(t);
      clearTimeout(finish);
    };
  }, [step]);

  useEffect(() => {
    if (step !== 'lastlogin') return;
    const a = setTimeout(() => setShowWelcome(true), 950);
    const b = setTimeout(() => setPhase('login'), 2600);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [step, setPhase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && step === 'bios') {
        setSetupOpen(true);
      } else if (e.key === 'Escape') {
        setSetupOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  if (setupOpen) {
    return (
      <div className="absolute inset-0 bg-[#0000a8] font-bios text-[#c8c8c8] p-8 text-xl leading-relaxed">
        <div className="border-2 border-[#c8c8c8] p-6 max-w-2xl mx-auto mt-10">
          <p className="text-center text-[#ffd54a] mb-6">SETUP UTILITY</p>
          <div className="flex justify-between">
            <span>NOSTALGIA</span>
            <span className="text-[#9fe870]">[ MAX ]</span>
          </div>
          <p className="mt-6 text-[#8a8fa0] text-base">This value cannot be lowered.</p>
          <p className="mt-10 text-center text-base">Press ESC to exit</p>
        </div>
      </div>
    );
  }

  if (step === 'bios') {
    return (
      <div className="absolute inset-0 bg-black font-bios text-[#c8c8c8] text-lg leading-snug p-5">
        {BIOS_LINES.slice(0, lineCount + 1).map((line, i) => {
          if (i > lineCount) return null;
          if (line === '@MEM') {
            return (
              <div key={i}>
                Memory Test    : {mem} K{mem >= 262144 ? ' OK' : ''}
              </div>
            );
          }
          return <div key={i}>{line === '' ? '\u00A0' : line}</div>;
        })}
        <span className="boot-cursor" />
      </div>
    );
  }

  if (step === 'logo') {
    return (
      <div className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-8">
        <div
          className="text-white font-bold italic"
          style={{ fontSize: 30, textShadow: '1px 1px 2px rgba(0,0,0,0.6)', letterSpacing: 1 }}
        >
          Welcome
        </div>
        <div className="progress-track w-72">
          <div className="progress-chunks">
            {Array.from({ length: 22 }).map((_, i) => (
              <i key={i} style={{ visibility: i < chunks ? 'visible' : 'hidden' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-5">
      <p className="font-bios text-2xl text-[#9aa0b4]">
        Last login: June 12, 2009
      </p>
      <p
        className="font-bios text-3xl text-[#f4eed8] transition-opacity duration-700"
        style={{ opacity: showWelcome ? 1 : 0 }}
      >
        Welcome back.
      </p>
    </div>
  );
}
