'use client';

import { useEffect, useRef, useState } from 'react';
import { useSystem } from '@/store/system';
import { useSave } from '@/store/save';
import { sounds } from '@/lib/sounds';
import { visibleAccounts, type AccountTileSpec } from '@/lib/accounts';
import { Icon } from '@/lib/icons';

export default function LoginScreen() {
  const setPhase = useSystem((s) => s.setPhase);
  const setUser = useSystem((s) => s.setUser);
  const recordLogin = useSave((s) => s.recordLogin);
  const foundMom = useSave((s) => s.foundMom);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const accounts = visibleAccounts(foundMom);

  const logOn = (account: AccountTileSpec) => {
    setUser(account.id);
    setLoading(true);
    sounds.chime();
    setTimeout(() => {
      recordLogin();
      setPhase('desktop');
    }, 1300);
  };

  if (loading) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: 'linear-gradient(180deg, #2a55a8 0%, #4a7ac8 50%, #2a55a8 100%)' }}
      >
        <p
          className="text-white text-lg font-bold"
          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
        >
          Loading your personal settings…
        </p>
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 flex flex-col"
      style={{ background: 'linear-gradient(180deg, #2a55a8 0%, #4a7ac8 48%, #2a55a8 100%)' }}
    >
      <div className="h-12" style={{ background: 'linear-gradient(180deg,#0a246a,#1c3f94)' }} />
      <div
        className="h-[2px]"
        style={{ background: 'linear-gradient(90deg, transparent, #e8a52e 35%, #e8a52e 65%, transparent)' }}
      />

      <div className="flex-1 flex items-center">
        <div className="flex-1 flex flex-col items-end pr-12 gap-3">
          <div
            className="text-white font-bold italic"
            style={{ fontSize: 44, textShadow: '2px 2px 3px rgba(0,0,0,0.35)', letterSpacing: 1 }}
          >
            Welcome
          </div>
          <div className="text-[#cfe0ff] text-[12px]">To begin, click your user name</div>
        </div>

        <div className="w-px self-stretch my-10 bg-gradient-to-b from-transparent via-[#9ab4e8] to-transparent" />

        <div className="flex-1 pl-12 flex flex-col gap-4">
          {accounts.map((a) => (
            <AccountTile
              key={a.id}
              account={a}
              active={activeId === a.id}
              onActivate={() => {
                sounds.click();
                setActiveId(a.id);
              }}
              onLogOn={() => logOn(a)}
            />
          ))}
        </div>
      </div>

      <div
        className="h-14 flex items-center px-6"
        style={{ background: 'linear-gradient(180deg,#1c3f94,#0a246a)' }}
      >
        <button
          className="flex items-center gap-2 text-white text-[12px] cursor-pointer bg-transparent border-0"
          onClick={() => {
            sounds.click();
            useSystem.getState().setTurnOff(true);
          }}
        >
          <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#c0392b] text-white font-bold">
            ⏻
          </span>
          Turn off computer
        </button>
        <span className="ml-auto text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }} title="Welcome Back, an original interactive experience by Molly Curtis">
        </span>
      </div>
    </div>
  );
}

function AccountTile({
  account,
  active,
  onActivate,
  onLogOn,
}: {
  account: AccountTileSpec;
  active: boolean;
  onActivate: () => void;
  onLogOn: () => void;
}) {
  const [pw, setPw] = useState('');
  const [nudge, setNudge] = useState<string | null>(null);
  const [wrong, setWrong] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (active) inputRef.current?.focus();
  }, [active]);

  const submit = () => {
    if (!pw.trim()) {
      sounds.blipLow();
      setNudge('Type your password to continue.');
      setTimeout(() => setNudge(null), 2200);
      inputRef.current?.focus();
      return;
    }
    if (!account.locked) {
      onLogOn();
      return;
    }
    sounds.error();
    const next = wrong + 1;
    setWrong(next);
    setNudge(
      next >= 3
        ? "it's her account. let her have one thing."
        : 'Incorrect password. This is Mom\'s account.'
    );
    setTimeout(() => setNudge(null), 2600);
    setPw('');
  };

  return (
    <div
      className="rounded p-2 pr-5 transition-colors cursor-pointer"
      style={{ background: active ? 'rgba(255,255,255,0.16)' : 'transparent' }}
      onClick={onActivate}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.10)';
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = 'transparent';
      }}
    >
      <div className="flex items-center gap-4">
        <span
          className="inline-flex items-center justify-center w-14 h-14 rounded bevel-thin shrink-0"
          style={{ background: 'linear-gradient(135deg,#9ab4e8,#6f8fc8)' }}
        >
          <Icon name="user" size={40} />
        </span>
        <div className="flex-1">
          <div
            className="text-white text-[18px] font-bold"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.45)' }}
          >
            {account.name}
          </div>

          {active ? (
            <div className="mt-1.5">
              <div className="text-[#d8e4ff] text-[11px] mb-1">Type your password</div>
              <div className="relative flex items-center gap-1.5">
                <input
                  ref={inputRef}
                  type="password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submit()}
                  onClick={(e) => e.stopPropagation()}
                  className="bevel-in px-2 py-1 text-[13px] w-44 outline-none"
                />
                <button
                  className="w-[24px] h-[24px] rounded-[3px] text-white font-bold leading-none cursor-pointer"
                  style={{
                    background: 'linear-gradient(180deg,#7ed87e,#2e9e2e)',
                    border: '1px solid #1c6e1c',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)',
                  }}
                  aria-label="Log on"
                  onClick={(e) => {
                    e.stopPropagation();
                    submit();
                  }}
                >
                  →
                </button>
                {nudge && (
                  <div className="tooltip-bubble" style={{ left: 0, top: 30 }}>
                    {nudge}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-[#d8e4ff] text-[11px]">Click to log on</div>
          )}
        </div>
      </div>
    </div>
  );
}
