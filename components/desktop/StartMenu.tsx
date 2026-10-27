'use client';

import { useSystem } from '@/store/system';
import { useWindows } from '@/store/windows';
import { Icon, type IconName } from '@/lib/icons';
import { accountName } from '@/lib/accounts';
import { sounds } from '@/lib/sounds';
import type { AppId } from '@/lib/registry';

export default function StartMenu() {
  const setStartOpen = useSystem((s) => s.setStartOpen);
  const setPhase = useSystem((s) => s.setPhase);
  const setUser = useSystem((s) => s.setUser);
  const confirm = useSystem((s) => s.confirm);
  const currentUser = useSystem((s) => s.currentUser);
  const open = useWindows((s) => s.open);
  const closeAll = useWindows((s) => s.closeAll);

  const launch = (appId: AppId, props?: Record<string, unknown>) => {
    setStartOpen(false);
    open(appId, props ? { props } : undefined);
  };

  const logOff = async () => {
    sounds.click();
    setStartOpen(false);
    const yes = await confirm('Log Off Windows', 'Are you sure you want to log off?', { okLabel: 'Log Off', cancelLabel: 'Cancel' });
    if (!yes) return;
    closeAll();
    setUser('user');
    setPhase('login');
  };

  const shutDown = () => {
    sounds.click();
    setStartOpen(false);
    useSystem.getState().setTurnOff(true);
  };

  const name = accountName(currentUser);

  return (
    <>
      <div
        className="absolute inset-0"
        style={{ zIndex: 9400 }}
        onPointerDown={() => setStartOpen(false)}
      />

      <div
        className="absolute bevel-out flex"
        style={{ left: 4, bottom: 32, width: 248, zIndex: 9500, boxShadow: '3px 3px 0 rgba(0,0,0,0.35)' }}
      >
        <div className="flex-1 flex flex-col py-1" style={{ background: 'var(--face)' }}>
          <div
            className="flex items-center gap-2 px-2 py-2 mb-1"
            style={{ borderBottom: '1px solid var(--shadow-dark)', boxShadow: '0 1px 0 #fff' }}
          >
            <Icon name="user" size={26} />
            <span className="font-bold text-[13px] truncate">{name}</span>
          </div>

          <Item icon="paint" label="Scribble" onClick={() => launch('scribble')} />
          <Item icon="notepad" label="Notepad" onClick={() => launch('notepad')} />
          <Item icon="globe" label="WorldWindow" onClick={() => launch('browser', { url: 'home' })} />
          <Item icon="cards" label="Solitaire" onClick={() => launch('solitaire')} />
          <Item icon="mine" label="Minefield" onClick={() => launch('minefield')} />
          <Item icon="pinball" label="Pinball" onClick={() => launch('pinball')} />
          <hr className="msep" />
          <Item icon="docs" label="My Documents" onClick={() => launch('mydocs')} />
          <Item icon="pictures" label="My Pictures" onClick={() => launch('mypics')} />
          <hr className="msep" />
          <Item icon="monitor" label="Display Properties" onClick={() => launch('display')} />
          <hr className="msep" />
          <Item icon="key" label={'Log Off ' + name + '…'} onClick={logOff} />
          <Item icon="lock" label="Shut Down…" onClick={() => void shutDown()} />
        </div>
      </div>
    </>
  );
}

function Item({
  icon,
  label,
  onClick,
}: {
  icon: IconName;
  label: string;
  onClick: () => void;
}) {
  return (
    <button className="mi" onClick={onClick}>
      <Icon name={icon} size={18} />
      <span className="text-[12px]">{label}</span>
    </button>
  );
}
