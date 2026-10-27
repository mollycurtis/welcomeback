import type { Effects, Requires } from './types';
import { itemById } from './content';

export interface WorldView {
  flags: string[];
  inventory: string[];
}

export function meets(req: Requires | undefined, w: WorldView): boolean {
  if (!req) return true;
  if (req.flags && !req.flags.every((f) => w.flags.includes(f))) return false;
  if (req.notFlags && req.notFlags.some((f) => w.flags.includes(f))) return false;
  if (req.items && !req.items.every((i) => w.inventory.includes(i))) return false;
  if (req.notItems && req.notItems.some((i) => w.inventory.includes(i))) return false;
  return true;
}

export interface WorldActions {
  setFlag: (f: string) => void;
  clearFlag: (f: string) => void;
  give: (id: string) => void;
  take: (id: string) => void;
  addNotebook: (id: string) => void;
  addWonder: (id: string) => void;
  resolveWonder: (id: string) => void;
  addSeaStar: (id: string) => void;
  goScene: (id: string) => void;
}

export function applyEffects(fx: Effects | undefined, act: WorldActions): string[] {
  if (!fx) return [];
  fx.setFlags?.forEach(act.setFlag);
  fx.clearFlags?.forEach(act.clearFlag);
  fx.giveItems?.forEach(act.give);
  fx.takeItems?.forEach(act.take);
  fx.notebook?.forEach(act.addNotebook);
  fx.wonder?.forEach(act.addWonder);
  fx.resolveWonder?.forEach(act.resolveWonder);
  if (fx.seaStar) act.addSeaStar(fx.seaStar);
  if (fx.goScene) act.goScene(fx.goScene);
  return fx.say ?? [];
}

export function combineOf(a: string, b: string): { into: string; say?: string[] } | null {
  return itemById(a)?.combine?.[b] ?? itemById(b)?.combine?.[a] ?? null;
}
