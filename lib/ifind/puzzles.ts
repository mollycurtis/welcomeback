export type Difficulty = 'easy' | 'medium' | 'hard';

export const DIFFICULTY_RANK: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2 };
export const DIFFICULTY_LABEL: Record<Difficulty, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
export const DIFFICULTY_COLOR: Record<Difficulty, string> = { easy: '#3f9a3a', medium: '#c9962a', hard: '#c8102e' };

const READ_ALLOWANCE = 12;
const PER_OBJECT: Record<Difficulty, number> = { easy: 10, medium: 9, hard: 8 };

export function timeLimit(difficulty: Difficulty, objects: number): number {
  return Math.round((READ_ALLOWANCE + PER_OBJECT[difficulty] * objects) / 5) * 5;
}

export interface Target {
  id: string;
  label: string;
  x: number; y: number; w: number; h: number;
  patch?: string;
}

interface Base {
  id: string;
  title: string;
  scene: string;
  sceneW: number;
  sceneH: number;
  difficulty: Difficulty;
  category: string;
  targets: Target[];
}

export interface SpyPuzzle extends Base {
  kind: 'spy';
  riddle: string[];
}

export interface ComparePuzzle extends Base {
  kind: 'compare';
}

export type Puzzle = SpyPuzzle | ComparePuzzle;

export const PUZZLES: Puzzle[] = [
  {
    kind: 'spy',
    id: 'busy-desk',
    title: 'The Busy Desk',
    scene: '/ifind/busy-desk/scene.jpg',
    sceneW: 1536, sceneH: 1024,
    difficulty: 'medium',
    category: 'Home',
    riddle: [
      'I find a candle, a polaroid photo, a passport, a luggage tag, some scissors, a compact disc, a coffee mug, a paint palette, some headphones, and some sunglasses. Now look, be brisk!',
    ],
    targets: [
      { id: 'bd_candle', label: 'a candle',        x: 0.045, y: 0.215, w: 0.075, h: 0.110 },
      { id: 'bd_polaroid', label: 'a polaroid photo', x: 0.782, y: 0.045, w: 0.094, h: 0.132 },
      { id: 'bd_pass',   label: 'a passport',      x: 0.185, y: 0.560, w: 0.078, h: 0.120 },
      { id: 'bd_tag',    label: 'a luggage tag',   x: 0.285, y: 0.545, w: 0.072, h: 0.155 },
      { id: 'bd_disc',   label: 'a compact disc',  x: 0.040, y: 0.690, w: 0.130, h: 0.170 },
      { id: 'bd_scis',   label: 'some scissors',   x: 0.205, y: 0.775, w: 0.078, h: 0.140 },
      { id: 'bd_mug',    label: 'a coffee mug',    x: 0.638, y: 0.245, w: 0.088, h: 0.125 },
      { id: 'bd_pal',    label: 'a paint palette', x: 0.598, y: 0.455, w: 0.142, h: 0.185 },
      { id: 'bd_phones', label: 'some headphones', x: 0.795, y: 0.450, w: 0.142, h: 0.170 },
      { id: 'bd_shades', label: 'some sunglasses', x: 0.105, y: 0.295, w: 0.095, h: 0.080 },
    ],
  },
  {
    kind: 'spy',
    id: 'computer-room',
    title: 'The Office',
    scene: '/ifind/office/scene.jpg',
    sceneW: 1536, sceneH: 1024,
    difficulty: 'medium',
    category: 'Home',
    riddle: [
      'I find a desk lamp, a printer, a cordless phone, a coffee cup, a trophy, a cat, a rack of discs, and a kitchen rag. Look sharp, the clock is running.',
    ],
    targets: [
      { id: 'cr_lamp',   label: 'a desk lamp',      x: 0.015, y: 0.290, w: 0.090, h: 0.155 },
      { id: 'cr_print',  label: 'a printer',        x: 0.330, y: 0.415, w: 0.100, h: 0.115 },
      { id: 'cr_phone',  label: 'a cordless phone', x: 0.295, y: 0.450, w: 0.050, h: 0.095 },
      { id: 'cr_cup',    label: 'a coffee cup',     x: 0.095, y: 0.490, w: 0.052, h: 0.072 },
      { id: 'cr_troph',  label: 'a trophy',         x: 0.697, y: 0.262, w: 0.040, h: 0.072 },
      { id: 'cr_cat',    label: 'a cat',            x: 0.715, y: 0.795, w: 0.160, h: 0.115 },
      { id: 'cr_discs',  label: 'a rack of discs',  x: 0.729, y: 0.420, w: 0.046, h: 0.245 },
      { id: 'cr_rag',    label: 'a kitchen rag',     x: 0.519, y: 0.444, w: 0.034, h: 0.068 },
    ],
  },
  {
    kind: 'spy',
    id: 'childhood-bedroom',
    title: 'The Bedroom',
    scene: '/ifind/bedroom/scene.jpg',
    sceneW: 1536, sceneH: 1024,
    difficulty: 'easy',
    category: 'Home',
    riddle: [
      'I find a starfish lamp, a dolphin, a CD player, a pair of slippers, an open book, a hobby horse, a horse poster, and a basket of stuffed animals.',
    ],
    targets: [
      { id: 'bd2_lamp',  label: 'a starfish lamp',           x: 0.268, y: 0.415, w: 0.090, h: 0.170 },
      { id: 'bd2_dolph', label: 'a dolphin',                 x: 0.025, y: 0.500, w: 0.125, h: 0.120 },
      { id: 'bd2_box',   label: 'a CD player',               x: 0.463, y: 0.650, w: 0.090, h: 0.095 },
      { id: 'bd2_slip',  label: 'a pair of slippers',        x: 0.370, y: 0.710, w: 0.080, h: 0.080 },
      { id: 'bd2_book',  label: 'an open book',              x: 0.350, y: 0.790, w: 0.170, h: 0.110 },
      { id: 'bd2_horse', label: 'a hobby horse',             x: 0.673, y: 0.438, w: 0.066, h: 0.096 },
      { id: 'bd2_post',  label: 'a horse poster',            x: 0.727, y: 0.262, w: 0.086, h: 0.208 },
      { id: 'bd2_bask',  label: 'a basket of stuffed animals', x: 0.638, y: 0.565, w: 0.095, h: 0.150 },
    ],
  },
  {
    kind: 'spy',
    id: 'childhood-kitchen',
    title: 'The Kitchen',
    scene: '/ifind/kitchen/scene.jpg',
    sceneW: 1536, sceneH: 1024,
    difficulty: 'medium',
    category: 'Home',
    riddle: [
      'I find a cat, a dish rack, a striped towel, a bird, a green kettle, a paper towel roll, a broom, a pair of glasses, and a vase of flowers. Supper can wait.',
    ],
    targets: [
      { id: 'kt_cat',    label: 'a cat',              x: 0.028, y: 0.792, w: 0.165, h: 0.128 },
      { id: 'kt_rack',   label: 'a dish rack',        x: 0.045, y: 0.445, w: 0.095, h: 0.105 },
      { id: 'kt_towel',  label: 'a striped towel',    x: 0.132, y: 0.490, w: 0.065, h: 0.110 },
      { id: 'kt_bird',   label: 'a bird',             x: 0.207, y: 0.378, w: 0.046, h: 0.062 },
      { id: 'kt_kettle', label: 'a green kettle',     x: 0.433, y: 0.428, w: 0.045, h: 0.055 },
      { id: 'kt_roll',   label: 'a paper towel roll', x: 0.305, y: 0.412, w: 0.026, h: 0.082 },
      { id: 'kt_broom',  label: 'a broom',            x: 0.708, y: 0.410, w: 0.045, h: 0.245 },
      { id: 'kt_glass',  label: 'a pair of glasses',  x: 0.755, y: 0.670, w: 0.080, h: 0.055 },
      { id: 'kt_vase',   label: 'a vase of flowers',  x: 0.885, y: 0.435, w: 0.110, h: 0.155 },
    ],
  },
  {
    kind: 'spy',
    id: 'shed-garage',
    title: 'The Garage',
    scene: '/ifind/garage/scene.jpg',
    sceneW: 1672, sceneH: 941,
    difficulty: 'hard',
    category: 'Home',
    riddle: [
      'I find a yellow truck, a red ladder, a four wheeler, a set of antlers, a garage door, a red tool chest, a rolled air hose, a shop vacuum, and a red air tank. Mind the oil on the floor.',
    ],
    targets: [
      { id: 'sg_truck',  label: 'a yellow truck',   x: 0.010, y: 0.250, w: 0.175, h: 0.470 },
      { id: 'sg_ladder', label: 'a red ladder',     x: 0.214, y: 0.262, w: 0.042, h: 0.165 },
      { id: 'sg_quad',   label: 'a four wheeler',   x: 0.198, y: 0.412, w: 0.090, h: 0.125 },
      { id: 'sg_horns',  label: 'a set of antlers', x: 0.428, y: 0.262, w: 0.045, h: 0.095 },
      { id: 'sg_door',   label: 'a garage door',    x: 0.503, y: 0.238, w: 0.190, h: 0.180 },
      { id: 'sg_chest',  label: 'a red tool chest', x: 0.300, y: 0.378, w: 0.068, h: 0.130 },
      { id: 'sg_hose',   label: 'a rolled air hose', x: 0.838, y: 0.182, w: 0.058, h: 0.090 },
      { id: 'sg_vac',    label: 'a shop vacuum',    x: 0.935, y: 0.540, w: 0.058, h: 0.145 },
      { id: 'sg_tank',   label: 'a red air tank',   x: 0.792, y: 0.345, w: 0.046, h: 0.185 },
    ],
  },
  {
    kind: 'spy',
    id: 'antique-store',
    title: 'The Antique Store',
    scene: '/ifind/antique/scene.jpg',
    sceneW: 1536, sceneH: 1024,
    difficulty: 'hard',
    category: 'Town',
    riddle: [
      'I find a birdcage, a typewriter, an old camera, a violin, a globe, a ship in a bottle, a tall clay pot, a duck decoy, a red toy truck, a gold clock, a case of butterflies, and a brass elephant. Take your time, but not too much.',
    ],
    targets: [
      { id: 'an_cage',   label: 'a birdcage',           x: 0.852, y: 0.120, w: 0.108, h: 0.165 },
      { id: 'an_type',   label: 'a typewriter',         x: 0.718, y: 0.330, w: 0.108, h: 0.105 },
      { id: 'an_camera', label: 'an old camera',        x: 0.357, y: 0.388, w: 0.044, h: 0.050 },
      { id: 'an_violin', label: 'a violin',             x: 0.418, y: 0.375, w: 0.085, h: 0.205 },
      { id: 'an_globe',  label: 'a globe',              x: 0.178, y: 0.275, w: 0.105, h: 0.175 },
      { id: 'an_ship',   label: 'a ship in a bottle',   x: 0.018, y: 0.435, w: 0.110, h: 0.125 },
      { id: 'an_jug',    label: 'a tall clay pot',      x: 0.568, y: 0.625, w: 0.070, h: 0.155 },
      { id: 'an_duck',   label: 'a duck decoy',         x: 0.735, y: 0.455, w: 0.070, h: 0.075 },
      { id: 'an_truck',  label: 'a red toy truck',      x: 0.718, y: 0.555, w: 0.065, h: 0.065 },
      { id: 'an_clock',  label: 'a gold clock',         x: 0.525, y: 0.185, w: 0.072, h: 0.125 },
      { id: 'an_bfly',   label: 'a case of butterflies', x: 0.778, y: 0.175, w: 0.078, h: 0.110 },
      { id: 'an_eleph',  label: 'a brass elephant',     x: 0.120, y: 0.812, w: 0.085, h: 0.095 },
    ],
  },
];

export const puzzleById = (id: string) => PUZZLES.find((p) => p.id === id);

export const PUZZLES_BY_DIFFICULTY: Puzzle[] = [...PUZZLES].sort(
  (a, b) => DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty],
);

export function starsFor(secondsLeft: number, limit: number, mistakes: number): 1 | 2 | 3 {
  if (secondsLeft <= 0) return 1;
  const pace = secondsLeft / limit;
  if (pace >= 0.45 && mistakes <= 1) return 3;
  if (pace >= 0.2 && mistakes <= 4) return 2;
  return 1;
}
