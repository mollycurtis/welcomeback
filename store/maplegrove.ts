'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { sounds } from '@/lib/sounds';
import { SHOP_FURNITURE, byId, wallById, bedroomWallById, floorById } from '@/lib/maplegrove/catalog';
import { residentById, tierFor, type FriendTier } from '@/lib/maplegrove/npcs';
import { groceryById, PACKS, pullCards, cardById, stickerById, CARD_SETS, cardsInSet, type CardSetId } from '@/lib/maplegrove/collectibles';
import { currentSeason, weekKey } from '@/lib/maplegrove/season';
import { nutritionFor } from '@/lib/maplegrove/nutrition';

export const MAX_HEARTS = 5;
const SAVE_KEY = 'welcome-back/maple-grove';
const SAVE_VERSION = 3;

export type MGPhase = 'title' | 'create' | 'play';
export type MGLocation =
  | 'map' | 'town' | 'house' | 'furniture' | 'maplemart' | 'threads'
  | 'arcade' | 'cafe' | 'townhall' | 'gazette' | 'postoffice' | 'bank' | 'applevalley' | 'park' | 'academy'
  | 'oakwood' | 'pineridge' | 'riverside' | 'farm' | 'county' | 'neighbor';

export interface MGAvatar {
  preset: number;
}
export const DEFAULT_AVATAR: MGAvatar = { preset: 0 };
export const AVATAR_COUNT = 16;
export const AVATAR_PRICE = 300;

export interface OwnedItem { uid: string; itemId: string; from?: string }
export interface PlacedItem { uid: string; itemId: string; x: number; y: number }
export interface MGRoom { id: string; name: string; wall: string; floor: string; placed: PlacedItem[] }

export const STARTER_ROOMS: MGRoom[] = [
  { id: 'living', name: 'Living Room', wall: 'wall_green', floor: 'floor_wood', placed: [] },
  { id: 'bedroom', name: 'Bedroom', wall: 'bw_blue', floor: 'floor_carpet', placed: [] },
  { id: 'kitchen', name: 'Kitchen', wall: 'wall_cream', floor: 'floor_tile', placed: [] },
];

let uidN = 0;
const uid = () => `i${Date.now().toString(36)}${(uidN++).toString(36)}`;

function freshRooms(): MGRoom[] {
  const rooms = STARTER_ROOMS.map((r) => ({ ...r, placed: [] as PlacedItem[] }));
  rooms[1].placed.push({ uid: uid(), itemId: 'bed_basic', x: 6, y: 3 });
  return rooms;
}

export interface BuddyStats { happy: number; health: number; love: number; smarts: number; creative: number }
export interface Memory { t: number; text: string }
export interface TalkResult { line: string; gained: boolean; hearts: number; tier: FriendTier; gift?: string; tooSoon?: boolean }

export const ACADEMIC_RANKS = ['Beginner Student', 'Honor Student', 'Academic Leader', 'Academy Scholar'];
export const academicRank = (pts: number) => ACADEMIC_RANKS[Math.min(3, Math.floor(pts / 3))];

const TALK_COOLDOWN_MS = 45_000;
const WISH_COOLDOWN_MS = 5 * 60_000;

export interface MGStore {
  phase: MGPhase;
  location: MGLocation;
  prevLocation: MGLocation | null;
  name: string;
  avatar: MGAvatar;
  ownedAvatars: number[];
  bucks: number;
  tickets: number;
  inventory: OwnedItem[];
  ownedWall: string[];
  ownedFloor: string[];
  rooms: MGRoom[];
  activeRoom: string;
  storeStock: string[];
  highScores: Record<string, number>;

  hearts: Record<string, number>;
  lastTalk: Record<string, number>;
  talkedTo: string[];
  claimedGifts: string[];

  stickers: string[];
  cards: string[];
  setsClaimed: string[];
  pantry: Record<string, number>;

  academics: number;
  gazetteRead: string;
  lastWish: number;
  joinedAt: number;
  memories: Memory[];
  notice: string | null;
  introSeen: boolean;
  dailies: Record<string, string>;
  streak: number;
  lastVisitDay: string;
  goalsDone: string[];
  mailRead: string[];
  fish: string[];
  trophies: string[];
  activity: Record<string, number>;
  stats: BuddyStats;
  savings: number;
  interestEarned: number;

  setPhase: (p: MGPhase) => void;
  goTo: (l: MGLocation) => void;
  setActiveRoom: (id: string) => void;
  setNotice: (n: string | null) => void;
  dismissIntro: () => void;

  finishCreate: (name: string, preset?: number) => void;

  addBucks: (n: number) => void;
  addTickets: (n: number) => void;
  doDaily: (key: string) => boolean;
  addPantry: (id: string, n?: number) => void;
  checkIn: () => { newDay: boolean; streak: number };
  claimGoal: (goal: string) => void;
  readMail: (id: string) => void;
  catchFish: (id: string) => void;
  addTrophy: (id: string) => void;
  recordActivity: (kind: string) => void;
  earnSticker: (id: string) => boolean;
  setPreset: (i: number) => void;
  buyAvatar: (i: number) => boolean;
  bumpStat: (k: keyof BuddyStats, n: number) => void;
  eatGrocery: (id: string) => boolean;
  deposit: (n: number) => boolean;
  withdraw: (n: number) => boolean;

  buyFurniture: (itemId: string) => boolean;
  buyWall: (id: string) => boolean;
  buyFloor: (id: string) => boolean;
  buyGrocery: (id: string) => boolean;
  buyPack: (packId: string) => string[] | null;
  buyPrize: (itemId: string) => boolean;
  buyEventItem: (itemId: string) => boolean;
  rollStock: () => void;

  placeFromInventory: (uid: string, x: number, y: number) => void;
  movePlaced: (uid: string, x: number, y: number) => void;
  returnToInventory: (uid: string) => void;
  applyWall: (id: string) => void;
  applyFloor: (id: string) => void;

  talkTo: (npcId: string) => TalkResult;
  giveGift: (npcId: string, groceryId: string) => { loved: boolean; hearts: number; gift?: string } | null;

  awardSticker: (id: string) => boolean;
  readGazette: () => void;
  makeWish: () => { ok: boolean; bucks: number };
  passClass: (subject: string, score: number) => { bucks: number; rank: string; rankedUp: boolean };
  setHighScore: (game: string, score: number) => void;
  addMemory: (text: string) => void;

  resetAll: () => void;
}

function pickStock(n: number): string[] {
  const pool = SHOP_FURNITURE.map((f) => f.id);
  const out: string[] = [];
  while (out.length < n && pool.length) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  return out;
}

const fresh = () => {
  const avatar = { ...DEFAULT_AVATAR };
  return {
    phase: 'title' as MGPhase, location: 'town' as MGLocation, prevLocation: null as MGLocation | null, name: '', avatar,
    bucks: 250, tickets: 0, inventory: [] as OwnedItem[],
    ownedWall: ['wall_green', 'bw_blue'], ownedFloor: ['floor_wood', 'floor_carpet', 'floor_tile'], ownedAvatars: [] as number[],
    rooms: freshRooms(), activeRoom: 'living', storeStock: pickStock(12), highScores: {} as Record<string, number>,
    dailies: {} as Record<string, string>, streak: 0, lastVisitDay: '', goalsDone: [] as string[], mailRead: [] as string[], fish: [] as string[], trophies: [] as string[], activity: {} as Record<string, number>,
    stats: { happy: 60, health: 60, love: 30, smarts: 40, creative: 40 } as BuddyStats, savings: 0, interestEarned: 0,
    hearts: {} as Record<string, number>, lastTalk: {} as Record<string, number>, talkedTo: [] as string[], claimedGifts: [] as string[],
    stickers: [] as string[], cards: [] as string[], setsClaimed: [] as string[], pantry: {} as Record<string, number>,
    academics: 0, gazetteRead: '', lastWish: 0, joinedAt: 0, memories: [] as Memory[], notice: null as string | null, introSeen: false,
  };
};

export const useMaple = create<MGStore>()(
  persist(
    (set, get) => {
      const dayKey = (t = Date.now()) => { const d = new Date(t); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
      const STAT_FOR: Record<string, [keyof BuddyStats, number]> = { talk: ['love', 3], gift: ['love', 6], arcade: ['happy', 5], class: ['smarts', 6], decorate: ['creative', 5], buy: ['happy', 2], wish: ['happy', 3], fish: ['health', 4], harvest: ['health', 5], trail: ['health', 4], gazette: ['smarts', 3], fair: ['happy', 4], bank: ['smarts', 1] };
      const act = (kind: string) => set((st) => {
        const hit = STAT_FOR[kind]; const stats = hit ? { ...st.stats, [hit[0]]: Math.max(0, Math.min(100, st.stats[hit[0]] + hit[1])) } : st.stats;
        return { activity: { ...st.activity, [kind]: (st.activity[kind] ?? 0) + 1 }, stats };
      });
      const mem = (text: string) => set((s) => ({ memories: [...s.memories.slice(-39), { t: Date.now(), text }] }));
      const sticker = (id: string): boolean => {
        const s = get();
        if (s.stickers.includes(id) || !stickerById(id)) return false;
        set({ stickers: [...s.stickers, id], notice: `New sticker: ${stickerById(id)!.name}` });
        mem(`Earned the "${stickerById(id)!.name}" sticker.`);
        return true;
      };
      const checkSets = () => {
        const s = get();
        for (const id of Object.keys(CARD_SETS) as CardSetId[]) {
          if (s.setsClaimed.includes(id)) continue;
          if (!cardsInSet(id).every((c) => s.cards.includes(c.id))) continue;
          const r = CARD_SETS[id].reward;
          set((st) => ({ setsClaimed: [...st.setsClaimed, id], bucks: r.kind === 'bucks' ? st.bucks + Number(r.id) : st.bucks, notice: `${CARD_SETS[id].name} complete! ${r.kind === 'bucks' ? `+${r.id} Maple Bucks` : ''}` }));
          if (r.kind === 'sticker') sticker(r.id);
          mem(`Completed the ${CARD_SETS[id].name} card set.`);
        }
      };
      const claimGifts = (npcId: string, hearts: number): string | undefined => {
        const r = residentById(npcId); if (!r) return;
        let note: string | undefined;
        for (const g of r.gifts) {
          const key = `${npcId}:${g.hearts}`;
          if (hearts < g.hearts || get().claimedGifts.includes(key)) continue;
          set((s) => ({ claimedGifts: [...s.claimedGifts, key] }));
          if (g.kind === 'sticker') sticker(g.id);
          else if (g.kind === 'furniture') set((s) => ({ inventory: [...s.inventory, { uid: uid(), itemId: g.id, from: r.name }] }));
          else if (g.kind === 'card') { set((s) => ({ cards: [...s.cards, g.id] })); checkSets(); }
          else if (g.kind === 'bucks') set((s) => ({ bucks: s.bucks + Number(g.id) }));
          mem(`${r.name} gave you a gift: ${g.note}`);
          note = g.note;
        }
        return note;
      };

      return {
        ...fresh(),

        setPhase: (p) => set({ phase: p }),
        goTo: (l) => {
          set((st) => ({ prevLocation: st.location === l ? st.prevLocation : st.location, location: l }));
          if (l === 'house') sticker('st_home');
          if (l === 'park') sticker('st_festival');
        },
        setActiveRoom: (id) => set({ activeRoom: id }),
        setNotice: (n) => set({ notice: n }),
        dismissIntro: () => set({ introSeen: true }),

        finishCreate: (name, preset) => {
          const st = get();
          const p = preset !== undefined && (!st.joinedAt || st.ownedAvatars.includes(preset)) ? preset : st.avatar.preset;
          const avatar: MGAvatar = { ...st.avatar, preset: p }; const owned = st.ownedAvatars.includes(p) ? st.ownedAvatars : [...st.ownedAvatars, p];
          const nm = name.trim() || 'Resident';
          if (get().joinedAt) { set({ name: nm, avatar, ownedAvatars: owned, phase: 'play' }); mem('Changed up my look.'); return; }
          set({ name: nm, avatar, ownedAvatars: owned, phase: 'play', location: 'oakwood', joinedAt: Date.now(), memories: [] });
          mem(`Moved into the starter house on Oakwood's east side.`);
        },
        addBucks: (n) => { if (n > 0) sounds.ding(1400); set((s) => ({ bucks: Math.max(0, s.bucks + n) })); },
        addTickets: (n) => { if (n > 0) sounds.ding(900); set((s) => ({ tickets: Math.max(0, s.tickets + n) })); },
        doDaily: (key) => {
          const d = dayKey(); if (get().dailies[key] === d) return false;
          set((s) => ({ dailies: { ...s.dailies, [key]: d } }));
          const STICKER_FOR: Record<string, string> = { farm_harvest: 'st_harvest', trail: 'st_hiker', fair_wheel: 'st_fair' };
          if (STICKER_FOR[key]) sticker(STICKER_FOR[key]);
          return true;
        },
        addPantry: (id, n = 1) => set((s) => ({ pantry: { ...s.pantry, [id]: (s.pantry[id] ?? 0) + n } })),
        checkIn: () => {
          const d = dayKey(); const s = get();
          if (s.lastVisitDay === d) return { newDay: false, streak: s.streak };
          const yesterday = dayKey(Date.now() - 86400000);
          const streak = s.lastVisitDay === yesterday ? s.streak + 1 : 1;
          const interest = Math.floor(s.savings * 0.02);
          const drift = (v: number) => Math.max(0, Math.min(100, v - 6));
          set({ lastVisitDay: d, streak, goalsDone: [], activity: {}, bucks: s.bucks + 25, savings: s.savings + interest, interestEarned: s.interestEarned + interest,
            stats: { happy: drift(s.stats.happy), health: drift(s.stats.health), love: drift(s.stats.love), smarts: drift(s.stats.smarts), creative: drift(s.stats.creative) } });
          if (interest > 0) mem(`Maple Bank paid ${interest} Maple Bucks in interest.`);
          mem(streak > 1 ? `Day ${streak} in a row. Town Hall left 25 Maple Bucks in themailbox.` : 'A new day in Maple Grove. 25 Maple Bucks allowance from Town Hall.');
          return { newDay: true, streak };
        },
        claimGoal: (goal) => set((s) => ({ goalsDone: [...s.goalsDone, goal] })),
        readMail: (id) => set((s) => ({ mailRead: s.mailRead.includes(id) ? s.mailRead : [...s.mailRead, id] })),
        catchFish: (id) => { const first = !get().fish.includes(id); set((s) => ({ fish: [...s.fish, id] })); if (first) mem(`First ${id.replace('f_', '').replace(/_/g, ' ')} caught at Riverside.`); sticker('st_angler'); },
        addTrophy: (id) => { if (get().trophies.includes(id)) return; set((s) => ({ trophies: [...s.trophies, id] })); mem(`Earned a trophy: ${id.replace('tr_', '').replace(/_/g, ' ')}.`); },
        setPreset: (i) => set((st) => (st.ownedAvatars.includes(i) ? { avatar: { ...st.avatar, preset: i } } : {})),
        buyAvatar: (i) => { const st = get(); if (st.ownedAvatars.includes(i)) { set({ avatar: { ...st.avatar, preset: i } }); return true; } if (st.bucks < AVATAR_PRICE) return false; set({ bucks: st.bucks - AVATAR_PRICE, ownedAvatars: [...st.ownedAvatars, i], avatar: { ...st.avatar, preset: i } }); act('buy'); mem('Got a whole new look at Threads.'); sticker('st_shopper'); return true; },
        earnSticker: (id) => sticker(id),
        bumpStat: (k, n) => set((st) => ({ stats: { ...st.stats, [k]: Math.max(0, Math.min(100, st.stats[k] + n)) } })),

        eatGrocery: (id) => {
          const st = get();
          if ((st.pantry[id] ?? 0) <= 0) return false;
          const n = nutritionFor(id);
          if (!n) return false;
          const stats = { ...st.stats };
          for (const [k, v] of Object.entries(n.effect)) {
            const key = k as keyof BuddyStats;
            stats[key] = Math.max(0, Math.min(100, stats[key] + (v as number)));
          }
          const pantry = { ...st.pantry, [id]: st.pantry[id] - 1 };
          if (pantry[id] <= 0) delete pantry[id];
          set({ pantry, stats });
          return true;
        },
        deposit: (n) => { const st = get(); if (n <= 0 || st.bucks < n) return false; set({ bucks: st.bucks - n, savings: st.savings + n }); act('bank'); return true; },
        withdraw: (n) => { const st = get(); if (n <= 0 || st.savings < n) return false; set({ bucks: st.bucks + n, savings: st.savings - n }); act('bank'); return true; },
        recordActivity: (kind) => act(kind),

        buyFurniture: (itemId) => {
          const it = byId(itemId); if (!it) return false;
          const s = get(); if (s.bucks < it.price) return false;
          act('buy');
          set({ bucks: s.bucks - it.price, inventory: [...s.inventory, { uid: uid(), itemId, from: 'Maple Furniture' }] });
          mem(`Bought a ${it.name} at Maple Furniture.`);
          sticker('st_first_buy');
          return true;
        },
        buyWall: (id) => {
          const s = get(); if (s.ownedWall.includes(id)) return true;
          const w = wallById(id) ?? bedroomWallById(id); if (!w || s.bucks < w.price) return false;
          act('buy');
          set({ bucks: s.bucks - w.price, ownedWall: [...s.ownedWall, id] }); sticker('st_first_buy'); return true;
        },
        buyFloor: (id) => {
          const s = get(); if (s.ownedFloor.includes(id)) return true;
          const f = floorById(id); if (!f || s.bucks < f.price) return false;
          act('buy');
          set({ bucks: s.bucks - f.price, ownedFloor: [...s.ownedFloor, id] }); sticker('st_first_buy'); return true;
        },
        buyGrocery: (id) => {
          const g = groceryById(id); const s = get(); if (!g || s.bucks < g.price) return false;
          act('buy');
          set({ bucks: s.bucks - g.price, pantry: { ...s.pantry, [id]: (s.pantry[id] ?? 0) + 1 } });
          return true;
        },
        buyPack: (packId) => {
          const p = PACKS.find((x) => x.id === packId); const s = get(); if (!p || s.bucks < p.price) return null;
          act('buy');
          const pulled = pullCards(p.set, p.count);
          set({ bucks: s.bucks - p.price, cards: [...s.cards, ...pulled] }); checkSets();
          mem(`Opened a ${p.name}: ${pulled.map((c) => cardById(c)?.name).join(', ')}.`);
          sticker('st_pack');
          return pulled;
        },
        buyPrize: (itemId) => {
          const it = byId(itemId); const s = get(); if (!it || s.tickets < it.price) return false;
          act('buy');
          set({ tickets: s.tickets - it.price, inventory: [...s.inventory, { uid: uid(), itemId, from: 'Arcade Prize Corner' }] });
          mem(`Traded ${it.price} tickets for a ${it.name} at the Prize Corner.`);
          if (it.id === 'trophy_gold') sticker('st_ticket');
          return true;
        },
        buyEventItem: (itemId) => {
          const it = byId(itemId); const s = get(); if (!it || s.bucks < it.price) return false;
          act('buy');
          set({ bucks: s.bucks - it.price, inventory: [...s.inventory, { uid: uid(), itemId, from: currentSeason().name }] });
          mem(`Bought a ${it.name} at the ${currentSeason().name}.`);
          return true;
        },
        rollStock: () => set({ storeStock: pickStock(12) }),

        placeFromInventory: (u, x, y) => {
          act('decorate');
          set((s) => {
            const item = s.inventory.find((i) => i.uid === u); if (!item) return s;
            const rooms = s.rooms.map((r) => (r.id === s.activeRoom ? { ...r, placed: [...r.placed, { uid: u, itemId: item.itemId, x, y }] } : r));
            return { rooms, inventory: s.inventory.filter((i) => i.uid !== u) };
          });
          const placed = get().rooms.reduce((a, r) => a + r.placed.length, 0);
          if (placed >= 7) sticker('st_decorator');
        },
        movePlaced: (u, x, y) =>
          set((s) => ({ rooms: s.rooms.map((r) => (r.id === s.activeRoom ? { ...r, placed: r.placed.map((p) => (p.uid === u ? { ...p, x, y } : p)) } : r)) })),
        returnToInventory: (u) =>
          set((s) => {
            const room = s.rooms.find((r) => r.id === s.activeRoom); const p = room?.placed.find((q) => q.uid === u); if (!p) return s;
            return {
              rooms: s.rooms.map((r) => (r.id === s.activeRoom ? { ...r, placed: r.placed.filter((q) => q.uid !== u) } : r)),
              inventory: [...s.inventory, { uid: u, itemId: p.itemId }],
            };
          }),
        applyWall: (id) => set((s) => ({ rooms: s.rooms.map((r) => (r.id === s.activeRoom ? { ...r, wall: id } : r)) })),
        applyFloor: (id) => set((s) => ({ rooms: s.rooms.map((r) => (r.id === s.activeRoom ? { ...r, floor: id } : r)) })),

        talkTo: (npcId) => {
          act('talk');
          const r = residentById(npcId); const s = get();
          if (!r) return { line: '...', gained: false, hearts: 0, tier: 'new' };
          const first = !s.talkedTo.includes(npcId);
          const now = Date.now();
          const tooSoon = !first && now - (s.lastTalk[npcId] ?? 0) < TALK_COOLDOWN_MS;
          let hearts = s.hearts[npcId] ?? 0;
          let gained = false;
          if (!tooSoon && hearts < 10) { hearts += 1; gained = true; }
          const talkedTo = first ? [...s.talkedTo, npcId] : s.talkedTo;
          set({ hearts: { ...s.hearts, [npcId]: hearts }, lastTalk: tooSoon ? s.lastTalk : { ...s.lastTalk, [npcId]: now }, talkedTo });
          if (first) mem(`Met ${r.name}, ${r.role.toLowerCase()}.`);
          if (talkedTo.length >= 5) sticker('st_talker');
          if (hearts >= 2) sticker('st_friend');
          const tier = tierFor(hearts);
          const season = currentSeason().id;
          const pool = [...r.lines[tier]];
          if (r.seasonal?.[season] && Math.random() < 0.35) pool.push(r.seasonal[season]!);
          const line = first ? r.intro : pool[Math.floor(Math.random() * pool.length)];
          const gift = gained ? claimGifts(npcId, hearts) : undefined;
          if (hearts === 10 && gained) mem(`${r.name} is now your best friend.`);
          return { line, gained, hearts, tier, gift, tooSoon };
        },
        giveGift: (npcId, groceryId) => {
          act('gift');
          const r = residentById(npcId); const g = groceryById(groceryId); const s = get();
          if (!r || !g || (s.pantry[groceryId] ?? 0) <= 0) return null;
          const loved = r.likes.includes(g.taste);
          const hearts = Math.min(MAX_HEARTS, (s.hearts[npcId] ?? 0) + (loved ? 2 : 1));
          set({ pantry: { ...s.pantry, [groceryId]: s.pantry[groceryId] - 1 }, hearts: { ...s.hearts, [npcId]: hearts } });
          mem(`Gave ${r.name} ${g.name}${loved ? ' - they loved it.' : '.'}`);
          if (loved) sticker('st_gift');
          if (hearts >= 2) sticker('st_friend');
          const gift = claimGifts(npcId, hearts);
          return { loved, hearts, gift };
        },

        awardSticker: (id) => sticker(id),
        readGazette: () => {
          act('gazette');
          const wk = weekKey();
          if (get().gazetteRead !== wk) { set({ gazetteRead: wk }); mem(`Read this week's Maple Gazette.`); }
          sticker('st_reader');
        },
        makeWish: () => {
          act('wish');
          const s = get(); const now = Date.now();
          if (now - s.lastWish < WISH_COOLDOWN_MS) return { ok: false, bucks: 0 };
          const bucks = 15 + Math.floor(Math.random() * 26);
          set({ lastWish: now, bucks: s.bucks + bucks });
          mem(`Made a wish at the Central Fountain.`);
          sticker('st_park');
          return { ok: true, bucks };
        },
        passClass: (subject, score) => {
          const s = get();
          const bucks = 20 + score * 8;
          const before = academicRank(s.academics), after = academicRank(s.academics + 1);
          set({ bucks: s.bucks + bucks, academics: s.academics + 1 });
          mem(`Passed ${subject} at Maple Academy (${score}/5).`);
          sticker('st_school');
          return { bucks, rank: after, rankedUp: before !== after };
        },
        setHighScore: (game, score) => {
          set((s) => ({ highScores: { ...s.highScores, [game]: Math.max(score, s.highScores[game] ?? 0) } }));
          sticker('st_arcade');
        },
        addMemory: (text) => mem(text),

        resetAll: () => set(fresh()),
      };
    },
    {
      name: SAVE_KEY,
      version: SAVE_VERSION,
      storage: createJSONStorage(() => sessionStorage),
      migrate: (persisted, version) => {
        const base = fresh() as unknown as Record<string, unknown>;
        const old = (persisted ?? {}) as Record<string, unknown>;
        const merged: Record<string, unknown> = { ...base };
        for (const k of Object.keys(base)) if (k in old) merged[k] = old[k];
        if (version < 3) { }
        return merged as unknown as MGStore;
      },
    },
  ),
);
