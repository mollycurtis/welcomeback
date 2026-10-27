import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { BUDDIES, WAITING, ONLINE_AT_START, type Line, type Session } from '@/lib/chatterData';
import { clockString } from '@/lib/time';

interface ChatterState {
  threads: Record<string, Line[]>;
  used: Record<string, string[]>;
  online: string[];
  unread: string[];
  idleSent: boolean;
  startedAt: string;

  sessions: (id: string) => Session[];
  send: (id: string, text: string) => void;
  receive: (id: string, text: string) => void;
  markUsed: (id: string, text: string) => void;
  markRead: (id: string) => void;
  markUnread: (id: string) => void;
  setOnline: (id: string) => void;
  markIdleSent: () => void;
  unreadCount: () => number;
}

const firstThreads = (): Record<string, Line[]> =>
  Object.fromEntries(Object.entries(WAITING).map(([id, text]) => [id, [{ who: 'them' as const, text }]]));

export const useChatter = create<ChatterState>()(
  persist(
    (set, get) => ({
      threads: firstThreads(), used: {}, online: [...ONLINE_AT_START], unread: Object.keys(WAITING), idleSent: false, startedAt: clockString(),

      sessions: (id) => {
        const past = BUDDIES.find((b) => b.id === id)?.history ?? [];
        const today = get().threads[id] ?? [];
        return today.length ? [...past, { date: 'June 12, 2009, ' + get().startedAt, lines: today, live: true }] : past;
      },
      send: (id, text) => set((s) => ({ threads: { ...s.threads, [id]: [...(s.threads[id] ?? []), { who: 'me', text }] } })),
      receive: (id, text) => set((s) => ({ threads: { ...s.threads, [id]: [...(s.threads[id] ?? []), { who: 'them', text }] } })),
      markUsed: (id, text) => set((s) => ({ used: { ...s.used, [id]: [...(s.used[id] ?? []), text] } })),
      markRead: (id) => set((s) => (s.unread.includes(id) ? { unread: s.unread.filter((u) => u !== id) } : {})),
      markUnread: (id) => set((s) => (s.unread.includes(id) ? {} : { unread: [...s.unread, id] })),
      setOnline: (id) => set((s) => (s.online.includes(id) ? {} : { online: [...s.online, id] })),
      markIdleSent: () => set({ idleSent: true }),
      unreadCount: () => get().unread.length,
    }),
    {
      name: 'welcome-back/chatter',
      storage: createJSONStorage(() => sessionStorage),
      version: 4,
    },
  ),
);
