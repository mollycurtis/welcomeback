import type { MGStore as MGState } from '@/store/maplegrove';

export interface Goal { id: string; text: string; reward: number; done: (s: MGState) => boolean }
const POOL: Goal[] = [
  { id: 'talk2', text: 'Say hi to 2 residents', reward: 20, done: (s) => (s.activity.talk ?? 0) >= 2 },
  { id: 'arcade1', text: 'Play a game at the Arcade', reward: 20, done: (s) => (s.activity.arcade ?? 0) >= 1 },
  { id: 'buy1', text: 'Buy something at any shop', reward: 15, done: (s) => (s.activity.buy ?? 0) >= 1 },
  { id: 'gift1', text: 'Give a resident a gift', reward: 25, done: (s) => (s.activity.gift ?? 0) >= 1 },
  { id: 'fish1', text: 'Catch a fish at Lakeville', reward: 20, done: (s) => (s.activity.fish ?? 0) >= 1 },
  { id: 'harvest', text: 'Help with the harvest at the Farm', reward: 20, done: (s) => (s.activity.harvest ?? 0) >= 1 },
  { id: 'trail', text: 'Find something on the Woodbury trail', reward: 15, done: (s) => (s.activity.trail ?? 0) >= 1 },
  { id: 'class1', text: 'Take a class at Maple Academy', reward: 25, done: (s) => (s.activity.class ?? 0) >= 1 },
  { id: 'gazette', text: 'Read this week\'s Gazette', reward: 10, done: (s) => (s.activity.gazette ?? 0) >= 1 },
  { id: 'wish', text: 'Make a wish at the fountain', reward: 10, done: (s) => (s.activity.wish ?? 0) >= 1 },
  { id: 'decorate', text: 'Place a piece of furniture at home', reward: 15, done: (s) => (s.activity.decorate ?? 0) >= 1 },
  { id: 'fair', text: 'Spin the wheel at the Eagan Fairgrounds', reward: 15, done: (s) => (s.activity.fair ?? 0) >= 1 },
];
export function todaysGoals(t = Date.now()): Goal[] {
  const d = new Date(t); let seed = d.getFullYear() * 400 + d.getMonth() * 40 + d.getDate();
  const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  const pool = [...POOL]; const out: Goal[] = [];
  while (out.length < 3 && pool.length) out.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0]);
  return out;
}
