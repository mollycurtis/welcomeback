import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type WorldId = 'maple-grove' | 'petville' | 'ifind' | 'finn' | 'penguin-cove';

interface DiscoveryState {
  secrets: string[];
  completed: Partial<Record<WorldId, boolean>>;
  tokens: Record<string, number>;
  clues: string[];
  found: (id: string) => boolean;
  discover: (id: string) => boolean;
  complete: (world: WorldId) => void;
  addToken: (id: string, n?: number) => void;
  leaveClue: (id: string) => void;
  resetDiscovery: () => void;
}

const empty = { secrets: [] as string[], completed: {} as Partial<Record<WorldId, boolean>>, tokens: {} as Record<string, number>, clues: [] as string[] };

export const useDiscovery = create<DiscoveryState>()(
  persist(
    (set, get) => ({
      ...empty,
      found: (id) => get().secrets.includes(id),
      discover: (id) => { if (get().secrets.includes(id)) return false; set((s) => ({ secrets: [...s.secrets, id] })); return true; },
      complete: (world) => set((s) => ({ completed: { ...s.completed, [world]: true } })),
      addToken: (id, n = 1) => set((s) => ({ tokens: { ...s.tokens, [id]: (s.tokens[id] ?? 0) + n } })),
      leaveClue: (id) => set((s) => (s.clues.includes(id) ? s : { clues: [...s.clues, id] })),
      resetDiscovery: () => set({ ...empty }),
    }),
    { name: 'welcome-back/discovery', version: 1, storage: createJSONStorage(() => localStorage), migrate: (p) => ({ ...empty, ...(p as object) }) as DiscoveryState },
  ),
);
