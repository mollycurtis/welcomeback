import type { BuddyStats } from '@/store/maplegrove';
import { groceryById } from './collectibles';

export type Taste = 'produce' | 'snack' | 'drink' | 'sweet' | 'book';

export interface Nutrition {
  effect: Partial<Record<keyof BuddyStats, number>>;
}

export const NUTRITION: Record<Taste, Nutrition> = {
  produce: { effect: { health: 7, happy: 2 } },
  snack:   { effect: { happy: 5, health: 1 } },
  drink:   { effect: { health: 4, happy: 3 } },
  sweet:   { effect: { happy: 8 } },
  book:    { effect: { smarts: 7, creative: 3 } },
};

export const isReadable = (id: string) => groceryById(id)?.taste === 'book';

export function nutritionFor(groceryId: string): Nutrition | null {
  const g = groceryById(groceryId);
  if (!g) return null;
  return NUTRITION[g.taste as Taste] ?? null;
}

export function effectSummary(groceryId: string): string {
  const n = nutritionFor(groceryId);
  if (!n) return '';
  const LABEL: Record<string, string> = { happy: 'Happiness', health: 'Health', love: 'Friendship', smarts: 'Smarts', creative: 'Creativity' };
  return Object.entries(n.effect).map(([k, v]) => `+${v} ${LABEL[k] ?? k}`).join(', ');
}
