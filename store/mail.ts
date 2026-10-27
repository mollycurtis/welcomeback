import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface MailState {
  read: string[];
  markRead: (id: string) => void;
}
export const useMail = create<MailState>()(
  persist(
    (set) => ({
      read: [],
      markRead: (id) => set((s) => (s.read.includes(id) ? {} : { read: [...s.read, id] })),
    }),
    { name: 'welcome-back/mail', storage: createJSONStorage(() => sessionStorage), version: 1 },
  ),
);
