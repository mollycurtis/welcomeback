'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const SAVE_SCOPE: 'session' | 'local' = 'session';
const SAVE_KEY = 'welcome-back-save-v2';

export interface Painting {
  id: string;
  name: string;
  dataUrl: string;
  createdAt: string;
}

export interface RecycledItem {
  id: string;
  name: string;
  deleted: string;
  origin: string;
  kind: 'painting' | 'builtin' | 'doc' | 'userdoc' | 'folder' | 'userfolder';
  painting?: Painting;
  builtinId?: string;
  path?: string;
  content?: string;
  folderId?: string;
  folderName?: string;
}

export const MACHINE_DATE = '6/12/2009';

const binId = () => 'rec-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export function freeName(name: string, taken: (n: string) => boolean): string {
  if (!taken(name)) return name;
  const dot = name.lastIndexOf('.');
  const stem = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : '';
  for (let i = 2; ; i++) {
    const n = stem + ' (' + i + ')' + ext;
    if (!taken(n)) return n;
  }
}

interface SaveState {
  bootCount: number;

  soundOn: boolean;
  crtFxOn: boolean;

  brightness: number;
  contrast: number;
  volume: number;
  hpos: number;

  wallpaper: 'hill' | 'teal' | 'navy' | 'none';
  theme: 'blue' | 'olive' | 'silver';
  ssText: string;
  ssWaitMs: number;
  colorBits: 16 | 32;
  refreshHz: 60 | 75;
  fontSmooth: boolean;

  iconPos: Record<string, { x: number; y: number }>;

  pinballHigh: number;

  notepadEdits: Record<string, string>;
  paintings: Painting[];
  recycled: RecycledItem[];
  hiddenBuiltinPics: string[];
  hiddenDocs: string[];

  clubMember: boolean;
  fortAccount: { user: string; pass: string } | null;
  fortLoggedIn: boolean;
  fortFavorites: string[];
  foundMom: boolean;
  userFolders: string[];
  hitCount: number;
  cornerHits: number;

  recordLogin: () => void;
  setSoundOn: (v: boolean) => void;
  setCrtFxOn: (v: boolean) => void;
  setMonitor: (k: 'brightness' | 'contrast' | 'volume' | 'hpos', v: number) => void;
  recallMonitor: () => void;
  setDisplay: (
    k: 'wallpaper' | 'theme' | 'ssText' | 'ssWaitMs' | 'colorBits' | 'refreshHz' | 'fontSmooth',
    v: string | number | boolean
  ) => void;
  setIconPos: (id: string, pos: { x: number; y: number }) => void;
  resetIconPos: () => void;
  setFoundMom: () => void;
  setPinballHigh: (v: number) => void;
  saveNotepad: (path: string, content: string) => void;
  addPainting: (p: Painting) => void;
  recyclePainting: (p: Painting) => void;
  recycleBuiltinPic: (id: string, name: string) => void;
  recycleDoc: (path: string, name: string, origin: string) => void;
  recycleFolder: (id: string, name: string) => void;
  recycleUserFolder: (name: string) => void;
  restoreRecycled: (binId: string) => void;
  deleteRecycled: (binId: string) => void;
  emptyBin: () => void;
  joinClub: () => void;
  fortSignup: (user: string, pass: string) => void;
  fortLogin: (user: string, pass: string) => boolean;
  fortLogout: () => void;
  fortToggleFavorite: (id: string) => void;
  addUserFolder: () => string;
  renameUserFolder: (from: string, to: string) => string | null;
  bumpHitCount: () => number;
  recordCornerHit: () => void;
}

const noopStorage: Storage = {
  length: 0,
  clear: () => {},
  getItem: () => null,
  key: () => null,
  removeItem: () => {},
  setItem: () => {},
};

function pickStorage(): Storage {
  if (typeof window === 'undefined') return noopStorage;
  return SAVE_SCOPE === 'local' ? window.localStorage : window.sessionStorage;
}

if (typeof window !== 'undefined') {
  try {
    window.localStorage.removeItem('welcome-back-save-v1');
  } catch {
  }
}

export const useSave = create<SaveState>()(
  persist(
    (set, get) => ({
      bootCount: 0,
      soundOn: true,
      crtFxOn: false,
      brightness: 50,
      contrast: 50,
      volume: 50,
      hpos: 0,
      wallpaper: 'hill',
      theme: 'blue',
      ssText: 'Welcome Back',
      colorBits: 32,
      refreshHz: 60,
      fontSmooth: true,
      ssWaitMs: 90_000,
      iconPos: {},
      pinballHigh: 18450,
      notepadEdits: {},
      paintings: [],
      recycled: [],
      hiddenBuiltinPics: [],
      hiddenDocs: [],
      clubMember: false,
      fortAccount: null,
      fortLoggedIn: false,
      fortFavorites: [],
      foundMom: false,
      userFolders: [],
      hitCount: 48213,
      cornerHits: 0,

      recordLogin: () => set((s) => ({ bootCount: s.bootCount + 1 })),
      setSoundOn: (v) => set({ soundOn: v }),
      setCrtFxOn: (v) => set({ crtFxOn: v }),
      setMonitor: (k, v) => set({ [k]: v } as Partial<SaveState>),
      recallMonitor: () => set({ brightness: 50, contrast: 50, volume: 50, hpos: 0 }),
      setDisplay: (k, v) => set({ [k]: v } as Partial<SaveState>),
      setIconPos: (id, pos) =>
        set((s) => ({ iconPos: { ...s.iconPos, [id]: pos } })),
      resetIconPos: () => set({ iconPos: {} }),
      setFoundMom: () => set({ foundMom: true }),
      setPinballHigh: (v) => set({ pinballHigh: v }),
      saveNotepad: (path, content) =>
        set((s) => ({ notepadEdits: { ...s.notepadEdits, [path]: content } })),
      addPainting: (p) => set((s) => ({ paintings: [p, ...s.paintings] })),
      recyclePainting: (p) =>
        set((s) => ({
          paintings: s.paintings.filter((x) => x.id !== p.id),
          recycled: [
            { id: binId(), name: p.name, deleted: MACHINE_DATE, origin: 'C:\\My Pictures', kind: 'painting', painting: p },
            ...s.recycled,
          ],
        })),
      recycleBuiltinPic: (id, name) =>
        set((s) => ({
          hiddenBuiltinPics: s.hiddenBuiltinPics.includes(id) ? s.hiddenBuiltinPics : [...s.hiddenBuiltinPics, id],
          recycled: [
            { id: binId(), name, deleted: MACHINE_DATE, origin: 'C:\\My Pictures', kind: 'builtin', builtinId: id },
            ...s.recycled,
          ],
        })),
      recycleDoc: (path, name, origin) =>
        set((s) => {
          if (path.startsWith('userdocs/')) {
            const { [path]: content, ...rest } = s.notepadEdits;
            return {
              notepadEdits: rest,
              recycled: [{ id: binId(), name, deleted: MACHINE_DATE, origin, kind: 'userdoc', path, content: content ?? '' }, ...s.recycled],
            };
          }
          return {
            hiddenDocs: s.hiddenDocs.includes(path) ? s.hiddenDocs : [...s.hiddenDocs, path],
            recycled: [{ id: binId(), name, deleted: MACHINE_DATE, origin, kind: 'doc', path }, ...s.recycled],
          };
        }),
      recycleFolder: (id, name) =>
        set((s) => ({
          hiddenDocs: s.hiddenDocs.includes('dir:' + id) ? s.hiddenDocs : [...s.hiddenDocs, 'dir:' + id],
          recycled: [{ id: binId(), name, deleted: MACHINE_DATE, origin: 'C:\\My Documents', kind: 'folder', folderId: id }, ...s.recycled],
        })),
      recycleUserFolder: (name) =>
        set((s) => ({
          userFolders: s.userFolders.filter((n) => n !== name),
          recycled: [{ id: binId(), name, deleted: MACHINE_DATE, origin: 'Desktop', kind: 'userfolder', folderName: name }, ...s.recycled],
        })),
      restoreRecycled: (id) =>
        set((s) => {
          const item = s.recycled.find((r) => r.id === id);
          if (!item) return {} as Partial<SaveState>;
          const recycled = s.recycled.filter((r) => r.id !== id);
          switch (item.kind) {
            case 'painting':
              return item.painting ? { recycled, paintings: [item.painting, ...s.paintings] } : { recycled };
            case 'builtin':
              return { recycled, hiddenBuiltinPics: s.hiddenBuiltinPics.filter((x) => x !== item.builtinId) };
            case 'doc':
              return { recycled, hiddenDocs: s.hiddenDocs.filter((x) => x !== item.path) };
            case 'folder':
              return { recycled, hiddenDocs: s.hiddenDocs.filter((x) => x !== 'dir:' + item.folderId) };
            case 'userdoc': {
              const name = freeName(item.path!.slice('userdocs/'.length), (n) => ('userdocs/' + n) in s.notepadEdits);
              return { recycled, notepadEdits: { ...s.notepadEdits, ['userdocs/' + name]: item.content ?? '' } };
            }
            case 'userfolder': {
              const name = freeName(item.folderName!, (n) => s.userFolders.includes(n));
              return { recycled, userFolders: [...s.userFolders, name] };
            }
          }
          return { recycled };
        }),
      deleteRecycled: (id) => set((s) => ({ recycled: s.recycled.filter((r) => r.id !== id) })),
      emptyBin: () => set({ recycled: [] }),
      joinClub: () => set({ clubMember: true }),
      fortSignup: (user, pass) => set({ fortAccount: { user, pass }, fortLoggedIn: true }),
      fortLogin: (user, pass) => {
        const a = get().fortAccount;
        if (a && a.user.toLowerCase() === user.toLowerCase() && a.pass === pass) { set({ fortLoggedIn: true }); return true; }
        return false;
      },
      fortLogout: () => set({ fortLoggedIn: false }),
      fortToggleFavorite: (id) => set((s) => ({ fortFavorites: s.fortFavorites.includes(id) ? s.fortFavorites.filter((x) => x !== id) : [...s.fortFavorites, id] })),
      addUserFolder: () => {
        const taken = get().userFolders;
        const name = freeName('New Folder', (n) => taken.includes(n));
        set((s) => ({ userFolders: [...s.userFolders, name] }));
        return name;
      },
      renameUserFolder: (from, to) => {
        const want = to.trim().replace(/[\\/:*?"<>|]/g, '');
        if (!want || want === from) return null;
        const taken = get().userFolders.filter((n) => n !== from);
        const name = freeName(want, (n) => taken.includes(n));
        set((s) => {
          const { ['uf-' + from]: pos, ...rest } = s.iconPos;
          return {
            userFolders: s.userFolders.map((n) => (n === from ? name : n)),
            iconPos: pos ? { ...rest, ['uf-' + name]: pos } : rest,
          };
        });
        return name;
      },
      bumpHitCount: () => {
        const next = get().hitCount + 1;
        set({ hitCount: next });
        return next;
      },
      recordCornerHit: () => set((s) => ({ cornerHits: s.cornerHits + 1 })),
    }),
    {
      name: SAVE_KEY,
      storage: createJSONStorage(pickStorage),
    }
  )
);
