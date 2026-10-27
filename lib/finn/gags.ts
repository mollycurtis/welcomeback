export type GagMotion = 'sway' | 'wobble' | 'jiggle' | 'squash' | 'flap';
export type GagSound = 'swish' | 'rattle' | 'boing' | 'wub' | 'twinkle';
export const GAGS: Record<string, { x: number; y: number; w: number; h: number; motion: GagMotion; sound: GagSound }> = {
  'moon-shell-plaza/plaza-awning': { x: 0.7025, y: 0.2695, w: 0.0918, h: 0.1016, motion: 'flap', sound: 'swish' },
  'coral-gardens/anemone-empty': { x: 0.7324, y: 0.4629, w: 0.2520, h: 0.2578, motion: 'sway', sound: 'swish' },
  'coral-gardens/gardens-kelp': { x: 0.0072, y: 0.0010, w: 0.1445, h: 0.2588, motion: 'sway', sound: 'swish' },
  'marina-shop/ms-bench': { x: 0.2845, y: 0.3066, w: 0.2155, h: 0.1943, motion: 'jiggle', sound: 'rattle' },
  'bubble-docks/dk-traps': { x: 0.0176, y: 0.6787, w: 0.1914, h: 0.2109, motion: 'squash', sound: 'boing' },
  'festival-grounds/fg-stage': { x: 0.2018, y: 0.2627, w: 0.2305, h: 0.2471, motion: 'squash', sound: 'boing' },
  'kelp-forest/kf-sign': { x: 0.0794, y: 0.4346, w: 0.1836, h: 0.2031, motion: 'wobble', sound: 'wub' },
  'hidden-grotto/hg-crystals': { x: 0.7220, y: 0.4551, w: 0.0586, h: 0.1143, motion: 'jiggle', sound: 'twinkle' },
  'trench-tunnel/tt-pipe': { x: 0.3822, y: 0.5029, w: 0.0781, h: 0.1504, motion: 'jiggle', sound: 'rattle' },
  'ship-cargo/sc-barrels': { x: 0.6868, y: 0.5000, w: 0.1445, h: 0.2139, motion: 'squash', sound: 'boing' },
  'ship-cabin/sc-charts': { x: 0.0423, y: 0.1680, w: 0.1628, h: 0.2725, motion: 'flap', sound: 'swish' },
};
export const EFFECT_GAGS = new Set<string>([
  'moon-shell-plaza/plaza-lanterns',
  'festival-grounds/fg-crates-after',
  'flower-garden/fg-arch',
  'flower-garden/fg-beds',
  'hidden-grotto/hg-falls',
  'reef-gate/rg-gate-open',
  'moon-chamber/mc-shell-done',
]);
