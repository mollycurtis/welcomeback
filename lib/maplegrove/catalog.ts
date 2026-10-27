export type FurniKind =
  | 'chair' | 'sofa' | 'stool' | 'table' | 'bed' | 'shelf' | 'dresser'
  | 'lamp' | 'floorlamp' | 'plant' | 'tv' | 'console' | 'rug'
  | 'poster' | 'window' | 'clock' | 'trophy' | 'plush' | 'pumpkin' | 'lights' | 'wreath';

export type FurniCat =
  | 'Seating' | 'Tables' | 'Beds' | 'Storage' | 'Lighting' | 'Plants'
  | 'Electronics' | 'Rugs' | 'Wall' | 'Trophies' | 'Seasonal';

export interface FurniItem {
  id: string;
  name: string;
  cat: FurniCat;
  kind: FurniKind;
  price: number;
  w: number;
  h: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'event';
  c1: string;
  c2: string;
  wall?: boolean;
  special?: boolean;
}

export const FURNITURE: FurniItem[] = [
  { id: 'chair_wood', name: 'Wooden Chair', cat: 'Seating', kind: 'chair', price: 120, w: 1, h: 1, rarity: 'common', c1: '#a9743b', c2: '#7d5226' },
  { id: 'chair_comfy', name: 'Comfy Armchair', cat: 'Seating', kind: 'chair', price: 340, w: 1, h: 1, rarity: 'common', c1: '#5a8f6b', c2: '#3f6a4e' },
  { id: 'stool_round', name: 'Round Stool', cat: 'Seating', kind: 'stool', price: 80, w: 1, h: 1, rarity: 'common', c1: '#d36b4a', c2: '#9c4d33' },
  { id: 'sofa_blue', name: 'Blue Sofa', cat: 'Seating', kind: 'sofa', price: 520, w: 2, h: 1, rarity: 'common', c1: '#3f6fb0', c2: '#2f5388' },
  { id: 'sofa_cream', name: 'Cream Loveseat', cat: 'Seating', kind: 'sofa', price: 560, w: 2, h: 1, rarity: 'uncommon', c1: '#e6dcc4', c2: '#c8bd9e' },
  { id: 'sofa_plush', name: 'Plush Velvet Sofa', cat: 'Seating', kind: 'sofa', price: 980, w: 2, h: 1, rarity: 'rare', c1: '#7b4fa0', c2: '#5d3a7c' },

  { id: 'table_small', name: 'Side Table', cat: 'Tables', kind: 'table', price: 110, w: 1, h: 1, rarity: 'common', c1: '#b07c44', c2: '#85592f' },
  { id: 'table_coffee', name: 'Coffee Table', cat: 'Tables', kind: 'table', price: 260, w: 2, h: 1, rarity: 'common', c1: '#9a6a3a', c2: '#6f4a26' },
  { id: 'table_dining', name: 'Dining Table', cat: 'Tables', kind: 'table', price: 600, w: 2, h: 2, rarity: 'uncommon', c1: '#8a5a30', c2: '#5f3d1f' },

  { id: 'bed_basic', name: 'Starter Bed', cat: 'Beds', kind: 'bed', price: 400, w: 2, h: 2, rarity: 'common', c1: '#b5c7d8', c2: '#7d5226' },
  { id: 'bed_cozy', name: 'Cozy Quilt Bed', cat: 'Beds', kind: 'bed', price: 720, w: 2, h: 2, rarity: 'uncommon', c1: '#e0608f', c2: '#9c4063' },
  { id: 'bed_bunk', name: 'Bunk Bed', cat: 'Beds', kind: 'bed', price: 1100, w: 2, h: 2, rarity: 'rare', c1: '#5aa84a', c2: '#3f7a34' },

  { id: 'shelf_books', name: 'Bookshelf', cat: 'Storage', kind: 'shelf', price: 380, w: 1, h: 1, rarity: 'common', c1: '#8a5a30', c2: '#caa472' },
  { id: 'dresser_oak', name: 'Oak Dresser', cat: 'Storage', kind: 'dresser', price: 440, w: 2, h: 1, rarity: 'common', c1: '#a9743b', c2: '#7d5226' },
  { id: 'shelf_cubes', name: 'Cube Shelf', cat: 'Storage', kind: 'shelf', price: 520, w: 2, h: 1, rarity: 'uncommon', c1: '#ece6dc', c2: '#c8bd9e' },

  { id: 'lamp_desk', name: 'Desk Lamp', cat: 'Lighting', kind: 'lamp', price: 90, w: 1, h: 1, rarity: 'common', c1: '#e8c64a', c2: '#2a2a2a' },
  { id: 'lamp_floor', name: 'Floor Lamp', cat: 'Lighting', kind: 'floorlamp', price: 230, w: 1, h: 1, rarity: 'common', c1: '#f1e3a0', c2: '#7d5226' },
  { id: 'lamp_paper', name: 'Paper Lantern', cat: 'Lighting', kind: 'floorlamp', price: 300, w: 1, h: 1, rarity: 'uncommon', c1: '#f4cf6a', c2: '#d9482f', special: true },

  { id: 'plant_fern', name: 'Potted Fern', cat: 'Plants', kind: 'plant', price: 70, w: 1, h: 1, rarity: 'common', c1: '#4f9b46', c2: '#9c6b3a' },
  { id: 'plant_tall', name: 'Tall Palm', cat: 'Plants', kind: 'plant', price: 210, w: 1, h: 1, rarity: 'common', c1: '#3f8a44', c2: '#9c6b3a' },
  { id: 'plant_flower', name: 'Flower Box', cat: 'Plants', kind: 'plant', price: 160, w: 1, h: 1, rarity: 'uncommon', c1: '#e0608f', c2: '#4f9b46' },
  { id: 'plant_maple', name: 'Bonsai Maple', cat: 'Plants', kind: 'plant', price: 640, w: 1, h: 1, rarity: 'rare', c1: '#c0392b', c2: '#7d5226', special: true },

  { id: 'tv_crt', name: 'Boxy TV', cat: 'Electronics', kind: 'tv', price: 480, w: 2, h: 1, rarity: 'common', c1: '#3a3a3a', c2: '#7fd0e0', special: true },
  { id: 'console_game', name: 'Game Console', cat: 'Electronics', kind: 'console', price: 360, w: 1, h: 1, rarity: 'uncommon', c1: '#5a5a66', c2: '#e8c64a', special: true },
  { id: 'tv_flat', name: 'Flat Screen', cat: 'Electronics', kind: 'tv', price: 1200, w: 2, h: 1, rarity: 'rare', c1: '#1a1a1a', c2: '#4fb0a0' },

  { id: 'rug_round', name: 'Round Rug', cat: 'Rugs', kind: 'rug', price: 140, w: 2, h: 2, rarity: 'common', c1: '#d9482f', c2: '#e6dcc4' },
  { id: 'rug_stripe', name: 'Striped Rug', cat: 'Rugs', kind: 'rug', price: 180, w: 3, h: 2, rarity: 'common', c1: '#3f6fb0', c2: '#e8c64a' },
  { id: 'rug_star', name: 'Star Rug', cat: 'Rugs', kind: 'rug', price: 420, w: 3, h: 2, rarity: 'uncommon', c1: '#7b4fa0', c2: '#f1e3a0', special: true },

  { id: 'poster_band', name: 'Band Poster', cat: 'Wall', kind: 'poster', price: 60, w: 1, h: 1, rarity: 'common', c1: '#2a2a2a', c2: '#e0608f', wall: true },
  { id: 'poster_maple', name: 'Maple Grove Poster', cat: 'Wall', kind: 'poster', price: 90, w: 1, h: 1, rarity: 'uncommon', c1: '#4f9b46', c2: '#c0392b', wall: true },
  { id: 'window_round', name: 'Round Window', cat: 'Wall', kind: 'window', price: 240, w: 1, h: 1, rarity: 'common', c1: '#8fd0e8', c2: '#e6dcc4', wall: true, special: true },
  { id: 'clock_wall', name: 'Wall Clock', cat: 'Wall', kind: 'clock', price: 130, w: 1, h: 1, rarity: 'common', c1: '#ece6dc', c2: '#2a2a2a', wall: true, special: true },
  { id: 'trophy_acorn', name: 'Acorn Trophy', cat: 'Trophies', kind: 'trophy', price: 40, w: 1, h: 1, rarity: 'uncommon', c1: '#eab53e', c2: '#7d5226', special: true },
  { id: 'trophy_gold', name: 'Golden Cup', cat: 'Trophies', kind: 'trophy', price: 120, w: 1, h: 1, rarity: 'rare', c1: '#f4cf6a', c2: '#3b3050', special: true },
  { id: 'plush_bear', name: 'Prize Bear', cat: 'Seasonal', kind: 'plush', price: 60, w: 1, h: 1, rarity: 'uncommon', c1: '#c9893f', c2: '#e0608f', special: true },
  { id: 'poster_arcade', name: 'Arcade Poster', cat: 'Wall', kind: 'poster', price: 30, w: 1, h: 1, rarity: 'uncommon', c1: '#5566c0', c2: '#e0608f', wall: true, special: true },
  { id: 'cabinet_mini', name: 'Mini Cabinet', cat: 'Electronics', kind: 'console', price: 200, w: 1, h: 1, rarity: 'epic', c1: '#2a2030', c2: '#4fd0e0', special: true },

  { id: 'ev_bloom_wreath', name: 'Bloom Wreath', cat: 'Seasonal', kind: 'wreath', price: 180, w: 1, h: 1, rarity: 'event', c1: '#e88ab0', c2: '#4f9b46', wall: true, special: true },
  { id: 'ev_carnival_plush', name: 'Carnival Plush', cat: 'Seasonal', kind: 'plush', price: 220, w: 1, h: 1, rarity: 'event', c1: '#f3a23a', c2: '#3f6fb0', special: true },
  { id: 'ev_harvest_pumpkin', name: 'Harvest Pumpkin', cat: 'Seasonal', kind: 'pumpkin', price: 160, w: 1, h: 1, rarity: 'event', c1: '#e07a2a', c2: '#4f9b46', special: true },
  { id: 'ev_winter_lights', name: 'String of Lights', cat: 'Seasonal', kind: 'lights', price: 200, w: 2, h: 1, rarity: 'event', c1: '#f4e08a', c2: '#2a2a2a', wall: true, special: true },
];

export interface Surface {
  id: string;
  name: string;
  price: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'event';
  css: string;
}

export const WALLPAPERS: Surface[] = [
  { id: 'wall_green', name: 'Sage Green', price: 0, rarity: 'common', css: '#8aab84' },
  { id: 'wall_cream', name: 'Cream Paint', price: 90, rarity: 'common', css: '#efe7d6' },
  { id: 'wall_sky', name: 'Sky Blue', price: 120, rarity: 'common', css: '#bfe0ee' },
  { id: 'wall_mint', name: 'Mint Green', price: 120, rarity: 'common', css: '#c9e6cf' },
  { id: 'wall_rose', name: 'Rose Pink', price: 160, rarity: 'uncommon', css: '#f0cfdc' },
  { id: 'wall_stripe', name: 'Striped Paper', price: 220, rarity: 'uncommon', css: 'repeating-linear-gradient(90deg,#efe7d6 0 14px,#e3d6bd 14px 28px)' },
  { id: 'wall_stars', name: 'Starry Night', price: 480, rarity: 'rare', css: 'radial-gradient(#f4e08a 1.5px,transparent 2px) 0 0/22px 22px, #2c2f55' },
];

export const BEDROOM_WALLS: Surface[] = [
  { id: 'bw_blue',     name: 'Cornflower',     price: 0,   rarity: 'common', css: '#597eac' },
  { id: 'bw_butter',   name: 'Butter Yellow',  price: 90,  rarity: 'common', css: '#f1d8a8' },
  { id: 'bw_dusty',    name: 'Dusty Rose',     price: 120, rarity: 'common', css: '#bb706d' },
  { id: 'bw_lavender', name: 'Lavender',       price: 120, rarity: 'common', css: '#b4a1b3' },
  { id: 'bw_forest',   name: 'Forest Green',   price: 160, rarity: 'uncommon', css: '#616a4c' },
  { id: 'bw_navy',     name: 'Midnight Navy',  price: 160, rarity: 'uncommon', css: '#294461' },
  { id: 'bw_wave',     name: 'Olive Waves',    price: 220, rarity: 'rare',   css: '#a49b79' },
];

export const FLOORS: Surface[] = [
  { id: 'floor_wood', name: 'Wood Floor', price: 0, rarity: 'common', css: 'repeating-linear-gradient(90deg,#c79a5e 0 26px,#bb8d50 26px 27px)' },
  { id: 'floor_tile', name: 'Checker Tile', price: 140, rarity: 'common', css: 'repeating-conic-gradient(#e6dccb 0 25%, #cdbfa6 0 50%) 0 0 / 36px 36px' },
  { id: 'floor_carpet', name: 'Soft Carpet', price: 140, rarity: 'common', css: '#cdb89e' },
  { id: 'floor_green', name: 'Green Carpet', price: 160, rarity: 'uncommon', css: '#8fb487' },
  { id: 'floor_dark', name: 'Dark Wood', price: 260, rarity: 'uncommon', css: 'repeating-linear-gradient(90deg,#7a5430 0 26px,#6d4a2a 26px 27px)' },
  { id: 'floor_stone', name: 'Stone Tile', price: 320, rarity: 'rare', css: 'repeating-conic-gradient(#bdbdb2 0 25%,#a9a99e 0 50%) 0 0/40px 40px' },
];

export const byId = (id: string) => FURNITURE.find((f) => f.id === id);
export const SHOP_FURNITURE = FURNITURE.filter((f) => !f.special);
export const PRIZES = FURNITURE.filter((f) => f.cat === 'Trophies' || (f.special && f.rarity !== 'event'));
export const bedroomWallById = (id: string) => BEDROOM_WALLS.find((w) => w.id === id);
export const wallById = (id: string) => WALLPAPERS.find((w) => w.id === id);
export const floorById = (id: string) => FLOORS.find((f) => f.id === id);
