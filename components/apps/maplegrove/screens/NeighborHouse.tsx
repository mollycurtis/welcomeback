'use client';

import { Hud } from '../Hud';
import { Backdrop, Hotspot, Caption } from '../Backdrop';
import { useTalk } from '../Residents';
import { residentById } from '@/lib/maplegrove/npcs';
import { useToast } from '../SetPieces';
import { useMaple } from '@/store/maplegrove';

export function NeighborHouse() {
  const goTo = useMaple((s) => s.goTo);
  const bumpStat = useMaple((s) => s.bumpStat);
  const { talk, panel } = useTalk();
  const { flash, node } = useToast();

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <Hud title="Gram's House" onBack={() => goTo('oakwood')} backLabel="Rosemount" />
      <div style={{ position: 'relative', flex: 1 }}>
        <Backdrop bg="grandma_living"
          overlay={<Caption>Gram Willoughby&apos;s living room. Wipe your feet. She is in her armchair, click it to say hi.</Caption>}>
          <Hotspot x={31} y={12} w={12} h={36} label="Bookcase" sub="the sticker albums" labelAt="bottom"
            onClick={() => flash('Forty-one albums, alphabetized. Gram says you can look but not touch.')} />
          <Hotspot x={3} y={38} w={36} h={34} label="Sofa" sub="sit a while" labelAt="top"
            onClick={() => { bumpStat('happy', 2); flash('You sit. The blanket is scratchy and perfect. (+happiness)'); }} />
          <Hotspot x={52} y={38} w={16} h={34} label="Gram's armchair" sub="say hi" onClick={() => { const g = residentById('gram'); if (g) talk(g); }} labelAt="top" />
          <Hotspot x={74} y={14} w={12} h={52} label="Front door" sub="back to Rosemount" onClick={() => goTo('oakwood')} labelAt="top" />
          <Hotspot x={88} y={30} w={12} h={26} label="Television" sub="the weather channel, always" disabled />
          {node}
          {panel}
        </Backdrop>
      </div>
    </div>
  );
}
