export interface Spot { x: number; bottom: number; size: number }
export interface ScenePlacement { player: Spot; resident: Spot }

export const PLACEMENT: Record<string, ScenePlacement> = {
  town:        { player: { x: 40, bottom: 8,  size: 92 }, resident: { x: 50, bottom: 6,  size: 100 } },
  oakwood:     { player: { x: 44, bottom: 6,  size: 92 }, resident: { x: 62, bottom: 4,  size: 100 } },
  park:        { player: { x: 42, bottom: 5,  size: 92 }, resident: { x: 30, bottom: 4,  size: 100 } },
  academy:     { player: { x: 40, bottom: 6,  size: 88 }, resident: { x: 88, bottom: 3,  size: 100 } },
  riverside:   { player: { x: 40, bottom: 6,  size: 88 }, resident: { x: 34, bottom: 4,  size: 100 } },
  farm:        { player: { x: 40, bottom: 8,  size: 88 }, resident: { x: 46, bottom: 5,  size: 100 } },
  pineridge:   { player: { x: 40, bottom: 8,  size: 88 }, resident: { x: 48, bottom: 3,  size: 100 } },
  county:      { player: { x: 34, bottom: 8,  size: 88 }, resident: { x: 40, bottom: 3,  size: 100 } },
  applevalley: { player: { x: 40, bottom: 8,  size: 88 }, resident: { x: 26, bottom: 3,  size: 104 } },
  cafe:        { player: { x: 34, bottom: 4,  size: 92 }, resident: { x: 42, bottom: 3,  size: 110 } },
  maplemart:   { player: { x: 36, bottom: 4,  size: 92 }, resident: { x: 40, bottom: 3,  size: 110 } },
  threads:     { player: { x: 36, bottom: 4,  size: 92 }, resident: { x: 50, bottom: 3,  size: 110 } },
  furniture:   { player: { x: 34, bottom: 4,  size: 92 }, resident: { x: 78, bottom: 3,  size: 116 } },
  townhall:    { player: { x: 34, bottom: 4,  size: 92 }, resident: { x: 76, bottom: 3,  size: 110 } },
  gazette:     { player: { x: 34, bottom: 4,  size: 92 }, resident: { x: 30, bottom: 3,  size: 110 } },
  postoffice:  { player: { x: 34, bottom: 4,  size: 92 }, resident: { x: 50, bottom: 3,  size: 110 } },
  bank:        { player: { x: 34, bottom: 4,  size: 92 }, resident: { x: 72, bottom: 3,  size: 118 } },
  arcade:      { player: { x: 34, bottom: 4,  size: 92 }, resident: { x: 50, bottom: 4,  size: 84 } },
  neighbor:    { player: { x: 34, bottom: 4,  size: 92 }, resident: { x: 70, bottom: 3,  size: 84 } },
};
export const spot = (loc: string) => PLACEMENT[loc] ?? PLACEMENT.town;
export const CHAR_Z = 4;
