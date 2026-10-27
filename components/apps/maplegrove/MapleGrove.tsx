'use client';

import { useEffect } from 'react';
import { MGStage, MG, MGButton } from './ui';
import { useMaple } from '@/store/maplegrove';
import { Hud } from './Hud';
import { TitleScreen } from './screens/TitleScreen';
import { CreateScreen } from './screens/CreateScreen';
import { TownScreen } from './screens/TownScreen';
import { HouseScreen } from './screens/HouseScreen';
import { NeighborHouse } from './screens/NeighborHouse';
import { FurnitureStore } from './screens/FurnitureStore';
import { ArcadeScreen } from './screens/ArcadeScreen';
import { MapScreen } from './screens/MapScreen';
import { DistrictScreen } from './screens/DistrictScreen';
import { MapleMart } from './screens/MapleMart';
import { ThreadsBoutique } from './screens/ThreadsBoutique';
import { CafeScreen } from './screens/CafeScreen';
import { GazetteScreen } from './screens/GazetteScreen';
import { TownHall } from './screens/TownHall';
import { PostOffice } from './screens/PostOffice';
import { BankScreen } from './screens/BankScreen';

export default function MapleGrove() {
  const phase = useMaple((s) => s.phase);
  const location = useMaple((s) => s.location);
  const name = useMaple((s) => s.name);
  const setPhase = useMaple((s) => s.setPhase);
  const resetAll = useMaple((s) => s.resetAll);

  let body: React.ReactNode;
  if (phase === 'title') {
    body = <TitleScreen hasResident={name !== ''} onPlay={() => setPhase('play')} onNew={() => { resetAll(); setPhase('create'); }} />;
  } else if (phase === 'create') {
    body = <CreateScreen />;
  } else {
    switch (location) {
      case 'map': body = <MapScreen />; break;
      case 'town': body = <TownScreen />; break;
      case 'house': body = <HouseScreen />; break;
      case 'neighbor': body = <NeighborHouse />; break;
      case 'furniture': body = <FurnitureStore />; break;
      case 'arcade': body = <ArcadeScreen />; break;
      case 'maplemart': body = <MapleMart />; break;
      case 'threads': body = <ThreadsBoutique />; break;
      case 'cafe': body = <CafeScreen />; break;
      case 'gazette': body = <GazetteScreen />; break;
      case 'townhall': body = <TownHall />; break;
      case 'postoffice': body = <PostOffice />; break;
      case 'bank': body = <BankScreen />; break;
      case 'oakwood': case 'park': case 'academy': case 'riverside': case 'farm': case 'pineridge': case 'county': case 'applevalley':
        body = <DistrictScreen loc={location} />; break;
      default: body = <Stub />;
    }
  }

  const longPage = phase === 'create' || (phase === 'play' && (location === 'arcade' || location === 'bank'));
  return <MGStage scroll={longPage}>{body}{phase === 'play' && <Notice />}</MGStage>;
}

function Notice() {
  const notice = useMaple((s) => s.notice);
  const setNotice = useMaple((s) => s.setNotice);
  useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(() => setNotice(null), 2600);
    return () => window.clearTimeout(t);
  }, [notice, setNotice]);
  if (!notice) return null;
  return (
    <div style={{ position: 'absolute', top: 48, left: '50%', transform: 'translateX(-50%)', zIndex: 50, pointerEvents: 'none' }}>
      <div style={{ background: `linear-gradient(#ffe98a, ${MG.gold})`, color: MG.blueDk, border: `2px solid ${MG.blueDk}`, borderRadius: 4, padding: '4px 14px', fontWeight: 900, fontSize: 12, boxShadow: '3px 3px 0 rgba(0,0,0,0.35)' }}>
        ★ {notice}
      </div>
    </div>
  );
}

function Stub() {
  const goTo = useMaple((s) => s.goTo);
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <Hud onBack={() => goTo('town')} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: MG.sub }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: MG.purple }}>Opening soon</div>
        <div style={{ fontSize: 14 }}>This part of Maple Grove is still being built.</div>
        <MGButton color="green" onClick={() => goTo('town')}>Back to Downtown</MGButton>
      </div>
    </div>
  );
}
