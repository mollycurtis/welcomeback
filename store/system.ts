'use client';

import { create } from 'zustand';
import { uid } from '@/lib/uid';

export type Phase = 'off' | 'boot' | 'login' | 'desktop' | 'shutdown';
export type SessionUser = string;

export type DialogKind = 'alert' | 'error' | 'confirm' | 'prompt';

export interface DialogSpec {
  id: string;
  kind: DialogKind;
  title: string;
  message: string;
  defaultValue?: string;
  password?: boolean;
  okLabel?: string;
  cancelLabel?: string;
  extraLabel?: string;
  resolve: (value: string | boolean | null) => void;
}

interface SystemState {
  phase: Phase;
  currentUser: SessionUser;
  startOpen: boolean;
  hasShutdown: boolean;
  turnOff: boolean;
  restarting: boolean;
  standby: boolean;
  bootSession: number;

  osdOpen: boolean;
  osdSel: number;
  degaussTick: number;

  inspecting: string | null;

  setPhase: (p: Phase) => void;
  setUser: (u: SessionUser) => void;
  setStartOpen: (v: boolean) => void;
  setHasShutdown: (v: boolean) => void;
  setTurnOff: (v: boolean) => void;
  setRestarting: (v: boolean) => void;
  setStandby: (v: boolean) => void;
  powerOn: () => void;
  setOsd: (open: boolean, sel?: number) => void;
  bumpDegauss: () => void;
  setInspecting: (id: string | null) => void;

  dialogs: DialogSpec[];
  alert: (title: string, message: string, kind?: 'alert' | 'error') => Promise<void>;
  confirm: (
    title: string,
    message: string,
    opts?: { okLabel?: string; cancelLabel?: string; extraLabel?: string }
  ) => Promise<boolean>;
  prompt: (
    title: string,
    message: string,
    opts?: { defaultValue?: string; password?: boolean; okLabel?: string }
  ) => Promise<string | null>;
  resolveDialog: (id: string, value: string | boolean | null) => void;
}

export const useSystem = create<SystemState>()((set, get) => ({
  phase: 'off',
  currentUser: 'owner',
  startOpen: false,
  hasShutdown: false,
  turnOff: false,
  restarting: false,
  standby: false,
  bootSession: 0,
  osdOpen: false,
  osdSel: 0,
  degaussTick: 0,
  inspecting: null,

  setPhase: (p) => set({ phase: p }),
  setUser: (u) => set({ currentUser: u }),
  setStartOpen: (v) => set({ startOpen: v }),
  setHasShutdown: (v) => set({ hasShutdown: v }),
  setTurnOff: (v) => set({ turnOff: v }),
  setRestarting: (v) => set({ restarting: v }),
  setStandby: (v) => set({ standby: v }),
  powerOn: () => set((s) => ({ phase: 'boot', bootSession: s.bootSession + 1 })),
  setOsd: (open, sel) => set((s) => ({ osdOpen: open, osdSel: sel ?? s.osdSel })),
  bumpDegauss: () => set((s) => ({ degaussTick: s.degaussTick + 1 })),
  setInspecting: (id) => set({ inspecting: id }),

  dialogs: [],

  alert: (title, message, kind = 'alert') =>
    new Promise<void>((res) => {
      const spec: DialogSpec = {
        id: uid(),
        kind,
        title,
        message,
        resolve: () => res(),
      };
      set((s) => ({ dialogs: [...s.dialogs, spec] }));
    }),

  confirm: (title, message, opts) =>
    new Promise<boolean>((res) => {
      const spec: DialogSpec = {
        id: uid(),
        kind: 'confirm',
        title,
        message,
        okLabel: opts?.okLabel,
        cancelLabel: opts?.cancelLabel,
        extraLabel: opts?.extraLabel,
        resolve: (v) => res(v === true),
      };
      set((s) => ({ dialogs: [...s.dialogs, spec] }));
    }),

  prompt: (title, message, opts) =>
    new Promise<string | null>((res) => {
      const spec: DialogSpec = {
        id: uid(),
        kind: 'prompt',
        title,
        message,
        defaultValue: opts?.defaultValue,
        password: opts?.password,
        okLabel: opts?.okLabel,
        resolve: (v) => res(typeof v === 'string' ? v : null),
      };
      set((s) => ({ dialogs: [...s.dialogs, spec] }));
    }),

  resolveDialog: (id, value) => {
    const d = get().dialogs.find((x) => x.id === id);
    if (!d) return;
    set((s) => ({ dialogs: s.dialogs.filter((x) => x.id !== id) }));
    d.resolve(value);
  },
}));
