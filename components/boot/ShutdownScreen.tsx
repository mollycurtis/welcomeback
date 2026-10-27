'use client';

import { useEffect, useState } from 'react';
import { useSystem } from '@/store/system';
import { useMaple } from '@/store/maplegrove';
import { useIFind } from '@/store/ifind';
import { useFinn } from '@/store/finn';
import { useWindows } from '@/store/windows';
import { sounds } from '@/lib/sounds';

type Step = 'saving' | 'closing' | 'line' | 'dot';

export default function ShutdownScreen() {
  const setPhase = useSystem((s) => s.setPhase);
  const setHasShutdown = useSystem((s) => s.setHasShutdown);
  const setStartOpen = useSystem((s) => s.setStartOpen);
  const closeAll = useWindows((s) => s.closeAll);
  const [step, setStep] = useState<Step>('saving');

  useEffect(() => {
    closeAll();
    setStartOpen(false);
    const a = setTimeout(() => {
      setStep('closing');
      sounds.shutdown();
    }, 1100);
    const b = setTimeout(() => setStep('line'), 2900);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [closeAll, setStartOpen]);

  if (step === 'line') {
    return (
      <div
        className="absolute inset-0 anim-crt-off2"
        style={{ background: 'linear-gradient(180deg, #2a55a8, #4a7ac8)' }}
        onAnimationEnd={() => setStep('dot')}
      />
    );
  }

  if (step === 'dot') {
    return (
      <div className="absolute inset-0 bg-black">
        <div
          className="crt-dot"
          onAnimationEnd={() => {
            setHasShutdown(true);
            useMaple.getState().resetAll();
            useIFind.getState().resetAll();
            useFinn.getState().resetAll();
            const sys = useSystem.getState();
            if (sys.restarting) {
              sys.setRestarting(false);
              setTimeout(() => sys.powerOn(), 900);
              return;
            }
            setPhase('off');
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-6"
      style={{ background: 'linear-gradient(180deg, #2a55a8 0%, #4a7ac8 50%, #2a55a8 100%)' }}
    >
      <p
        className="text-white text-lg font-bold"
        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
      >
        {step === 'saving' ? 'Saving your settings…' : 'Shutting down…'}
      </p>
    </div>
  );
}
