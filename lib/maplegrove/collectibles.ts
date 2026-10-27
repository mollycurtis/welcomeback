import type { GiftTaste } from './npcs';

export type StickerSource = 'activity' | 'friend' | 'prize' | 'event';

export interface Sticker {
  id: string;
  name: string;
  hint: string;
  source: StickerSource;
  color: string;
  glyph: string;
}

export const STICKERS: Sticker[] = [
  { id: 'st_home',      name: 'Home Sweet Home', hint: 'Visit your house.',                         source: 'activity', color: '#e0608f', glyph: '⌂' },
  { id: 'st_first_buy', name: 'First Purchase',  hint: 'Buy anything at Maple Furniture.',           source: 'activity', color: '#eab53e', glyph: '$' },
  { id: 'st_decorator', name: 'Decorator',       hint: 'Place five pieces of furniture at home.',    source: 'activity', color: '#7b4fa0', glyph: '✦' },
  { id: 'st_arcade',    name: 'Game On',         hint: 'Finish a game at the Arcade.',               source: 'activity', color: '#5566c0', glyph: '▶' },
  { id: 'st_talker',    name: 'Neighborly',      hint: 'Talk to five different residents.',          source: 'activity', color: '#4f9b46', glyph: '…' },
  { id: 'st_reader',    name: 'Subscriber',      hint: 'Read this week\'s Maple Gazette.',           source: 'activity', color: '#3b3050', glyph: '¶' },
  { id: 'st_shopper',   name: 'New Look',        hint: 'Buy something at Threads Boutique.',         source: 'activity', color: '#d96a93', glyph: '✂' },
  { id: 'st_pack',      name: 'Pack Rat',        hint: 'Open a trading card pack.',                  source: 'activity', color: '#3f6fb0', glyph: '▣' },
  { id: 'st_park',      name: 'Park Regular',    hint: 'Make a wish at the Grove Park fountain.',    source: 'activity', color: '#4fb0a0', glyph: '~' },
  { id: 'st_school',    name: 'Honor Roll',      hint: 'Pass a class at Maple Academy.',             source: 'activity', color: '#c63a2b', glyph: 'A' },
  { id: 'st_friend',    name: 'Good Friend',     hint: 'Reach 4 hearts with any resident.',          source: 'activity', color: '#e34848', glyph: '♥' },
  { id: 'st_gift',      name: 'Thoughtful',      hint: 'Give a resident a gift they love.',          source: 'activity', color: '#f3a23a', glyph: '✿' },
  { id: 'st_keys',       name: 'Key to the Town', hint: 'A gift from Mayor Maple.',      source: 'friend', color: '#eab53e', glyph: '⚿' },
  { id: 'st_press',      name: 'PRESS',           hint: 'A gift from Audrey Smythe.',    source: 'friend', color: '#3b3050', glyph: 'P' },
  { id: 'st_hiscore',    name: 'High Score',      hint: 'Beat a high score at the Arcade.',       source: 'friend', color: '#5566c0', glyph: '1' },
  { id: 'st_greenthumb', name: 'Green Thumb',     hint: 'A gift from Olivia Bloom.',     source: 'friend', color: '#4f9b46', glyph: '♣' },
  { id: 'st_compass',    name: 'Compass',         hint: 'A gift from Theo Finch.',       source: 'friend', color: '#8a5a30', glyph: '✧' },
  { id: 'st_measure',    name: 'Measure Twice',   hint: 'A gift from Walt Ferris.',      source: 'friend', color: '#c9893f', glyph: '⌐' },
  { id: 'st_mug',        name: 'Steaming Mug',    hint: 'A gift from June Park.',        source: 'friend', color: '#a9743b', glyph: '☕' },
  { id: 'st_cart',       name: 'Cart Six',        hint: 'A gift from Raj Patel.',        source: 'friend', color: '#5aa84a', glyph: '▤' },
  { id: 'st_needle',     name: 'Needle & Thread', hint: 'A gift from Lena Moreau.',      source: 'friend', color: '#d96a93', glyph: '§' },
  { id: 'st_apple',      name: 'Gold Star Apple', hint: 'A gift from Principal Okafor.', source: 'friend', color: '#c63a2b', glyph: '★' },
  { id: 'st_beaker',     name: 'Beaker',          hint: 'Pass a class at Maple Academy.',          source: 'friend', color: '#4fb0a0', glyph: 'Ω' },
  { id: 'st_cookie',     name: 'Cookie',          hint: 'A gift from Gram Willoughby.',  source: 'friend', color: '#c9893f', glyph: '●' },
  { id: 'st_smiley',     name: 'Puffy Smiley',    hint: 'A gift from Maya Chen.',        source: 'friend', color: '#eab53e', glyph: '☺' },
  { id: 'st_headphones', name: 'Headphones',      hint: 'A gift from Nora Vance.',     source: 'friend', color: '#2a2a2a', glyph: '♫' },
  { id: 'st_apple_red',  name: 'Orchard Apple',   hint: 'A gift from Hazel Brooks.',     source: 'friend', color: '#d9482f', glyph: '❁' },
  { id: 'st_whistle',    name: 'Whistle',         hint: 'A gift from Sam Delgado.',      source: 'friend', color: '#3f6fb0', glyph: '♪' },
  { id: 'st_ticket',     name: 'Golden Ticket',   hint: 'Prize Corner at the Arcade.',   source: 'prize', color: '#eab53e', glyph: '✪' },
  { id: 'st_festival',   name: 'Festival Pin',    hint: 'Visit Grove Park during a festival.', source: 'event', color: '#e07a2a', glyph: '✹' },
  { id: 'st_angler',     name: 'Angler',          hint: 'Catch a fish at Lakeville.',    source: 'activity', color: '#3f6fb0', glyph: '≋' },
  { id: 'st_harvest',    name: 'Green Thumb',     hint: 'Help with the harvest at the Farm.', source: 'activity', color: '#5aa84a', glyph: '❀' },
  { id: 'st_hiker',      name: 'Trailblazer',     hint: 'Find everything on the Woodbury trail.', source: 'activity', color: '#2f6b3a', glyph: '▲' },
  { id: 'st_fair',       name: 'Fair Ribbon',     hint: 'Spin the wheel at the Eagan Fairgrounds.', source: 'event', color: '#d8322a', glyph: '✿' },
  { id: 'st_streak',     name: 'Regular',         hint: 'Visit Maple Grove three days in a row.', source: 'activity', color: '#eab53e', glyph: '3' },
  { id: 'st_goals',      name: 'Go Getter',       hint: 'Finish all of a day\'s goals.',  source: 'activity', color: '#7b4fa0', glyph: '✔' },
];
export const stickerById = (id: string) => STICKERS.find((s) => s.id === id);

export type CardSetId = 'residents' | 'landmarks';
export interface Card {
  id: string;
  set: CardSetId;
  name: string;
  caption: string;
  rarity: 'common' | 'uncommon' | 'rare';
  color: string;
  npc?: string;
}

export const CARD_SETS: Record<CardSetId, { name: string; blurb: string; reward: { kind: 'sticker' | 'bucks'; id: string } }> = {
  residents: { name: 'Maple Grove Residents', blurb: 'Everyone who makes this town a town.', reward: { kind: 'bucks', id: '500' } },
  landmarks: { name: 'Local Landmarks',      blurb: 'The places you\'ll remember.',          reward: { kind: 'bucks', id: '300' } },
};

export const CARDS: Card[] = [
  { id: 'c_mayor',     set: 'residents', name: 'Mayor Maple',       caption: 'Has never lost an election. Has never had an opponent.', rarity: 'rare', color: '#eab53e', npc: 'mayor' },
  { id: 'c_audrey',    set: 'residents', name: 'Audrey Smythe',     caption: 'Deadline is Wednesday.',                                 rarity: 'rare', color: '#3b3050', npc: 'audrey' },
  { id: 'c_olivia',    set: 'residents', name: 'Olivia Bloom',      caption: '300 bulbs. 290 blooms.',                                 rarity: 'rare', color: '#4f9b46', npc: 'olivia' },
  { id: 'c_theo',      set: 'residents', name: 'Theo Finch',        caption: 'Not lost. Taking the long way.',                         rarity: 'rare', color: '#8a5a30', npc: 'theo' },
  { id: 'c_walt',      set: 'residents', name: 'Walt Ferris',       caption: 'Find the chair. The rest follows.',                      rarity: 'rare', color: '#c9893f', npc: 'walt' },
  { id: 'c_june',      set: 'residents', name: 'June Park',         caption: 'The mug on the left is yours.',                          rarity: 'rare', color: '#a9743b', npc: 'june' },
  { id: 'c_raj',       set: 'residents', name: 'Raj Patel',         caption: 'Take cart two.',                                         rarity: 'rare', color: '#5aa84a', npc: 'raj' },
  { id: 'c_lena',      set: 'residents', name: 'Lena Moreau',       caption: 'Memories you can wear.',                                 rarity: 'rare', color: '#d96a93', npc: 'lena' },
  { id: 'c_principal', set: 'residents', name: 'Principal Okafor',  caption: 'Attendance optional. Curiosity not.',                    rarity: 'rare', color: '#c63a2b', npc: 'principal' },
  { id: 'c_gram',      set: 'residents', name: 'Gram Willoughby',   caption: 'Four thousand stickers and counting.',                   rarity: 'rare', color: '#e6dcc4', npc: 'gram' },
  { id: 'c_maya',      set: 'residents', name: 'Maya Chen',         caption: 'Do you collect? Please say you collect.',                rarity: 'rare', color: '#e0608f', npc: 'maya' },
  { id: 'c_nora',      set: 'residents', name: 'Nora Vance',        caption: 'Knows the whole town from behind a counter.',                            rarity: 'rare', color: '#2a2a2a', npc: 'marcus' },
  { id: 'c_hazel',     set: 'residents', name: 'Hazel Brooks',      caption: 'Boots on. Worth it.',                                    rarity: 'rare', color: '#d9482f', npc: 'hazel' },
  { id: 'c_sam',       set: 'residents', name: 'Sam Delgado',       caption: 'Walk, don\'t run. Actually, run.',                       rarity: 'rare', color: '#3f6fb0', npc: 'sam' },
  { id: 'c_townhall',  set: 'landmarks', name: 'Town Hall',         caption: 'Est. 1912. The clock is four minutes fast on purpose.',  rarity: 'common',   color: '#cf9a5a' },
  { id: 'c_fountain',  set: 'landmarks', name: 'Grove Park',        caption: 'Wishes: uncountable. Pennies: 40,000-ish.',              rarity: 'common',   color: '#4fb0a0' },
  { id: 'c_arcade',    set: 'landmarks', name: 'The Arcade',        caption: 'Same carpet since \'86.',                                rarity: 'common',   color: '#5566c0' },
  { id: 'c_academy',   set: 'landmarks', name: 'Maple Academy',     caption: 'Same building. Different roof.',                          rarity: 'common',   color: '#c63a2b' },
  { id: 'c_orchard',   set: 'landmarks', name: 'Woodbury',    caption: 'Four generations of apples.',                             rarity: 'uncommon', color: '#7fb04a' },
  { id: 'c_river',     set: 'landmarks', name: 'Maple Grove Lake',    caption: 'Where the light hits the water sideways at five.',        rarity: 'uncommon', color: '#3f86c8' },
  { id: 'c_eagan',     set: 'landmarks', name: 'Eagan Fairgrounds', caption: 'One spin a day. The wheel remembers nothing.', rarity: 'rare', color: '#e0608f' },
  { id: 'c_pool',      set: 'landmarks', name: 'Rosemount',           caption: 'Every street looks the same in the best way.', rarity: 'rare', color: '#8fd0e8' },
];
export const cardById = (id: string) => CARDS.find((c) => c.id === id);
export const cardsInSet = (set: CardSetId) => CARDS.filter((c) => c.set === set);

export interface Pack { id: string; name: string; price: number; set: CardSetId; count: number; blurb: string }
export const PACKS: Pack[] = [
  { id: 'pk_landmarks', name: 'Landmarks Pack', price: 60, set: 'landmarks', count: 2, blurb: 'Two cards from the Local Landmarks set. Might be doubles. That\'s collecting.' },
];

export function pullCards(set: CardSetId, n: number, rnd = Math.random): string[] {
  const pool = cardsInSet(set);
  const weight = (c: Card) => (c.rarity === 'common' ? 6 : c.rarity === 'uncommon' ? 3 : 1);
  const total = pool.reduce((a, c) => a + weight(c), 0);
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    let r = rnd() * total;
    for (const c of pool) { r -= weight(c); if (r <= 0) { out.push(c.id); break; } }
  }
  return out;
}

export interface Grocery { id: string; name: string; price: number; taste: GiftTaste; color: string; blurb: string }
export const GROCERY_ICON: Record<string, string> = {
  g_apples_green: 'apples_green',
  g_corn: 'corn',
  g_strawberries: 'strawberries',
  g_bananas: 'bananas',
  g_broccoli: 'broccoli',
  g_tomatoes: 'tomatoes',
  g_potatoes: 'potatoes',
  g_blueberries: 'blueberries',
  g_cheesepuffs: 'cheesepuffs',
  g_popcorn: 'popcorn',
  g_granola: 'granola',
  g_trailmix: 'trailmix',
  g_crackers: 'crackers',
  g_jerky: 'jerky',
  g_cheesestick: 'cheesestick',
  g_fruitsnacks: 'fruitsnacks',
  g_rootbeer: 'rootbeer',
  g_milk: 'milk',
  g_lemonade: 'lemonade',
  g_orangejuice: 'orangejuice',
  g_water: 'water',
  g_soda: 'soda',
  g_icedtea: 'icedtea',
  g_sportsdrink: 'sportsdrink',
  g_candyapple: 'candyapple',
  g_cupcake: 'cupcake',
  g_gumballs: 'gumballs',
  g_chocolatebar: 'chocolatebar',
  g_lollipop: 'lollipop',
  g_donut: 'donut',
  g_icecreamsandwich: 'icecreamsandwich',
  g_jellybeans: 'jellybeans',
  g_puzzlemag: 'puzzlemag',
  g_stickerbook: 'stickerbook',
  g_newspaper: 'newspaper',
  g_mystery: 'mystery',
  g_cookbook: 'cookbook',
  g_fieldguide: 'fieldguide',
  g_jokebook: 'jokebook',
  g_coloringbook: 'coloringbook',
  g_peach: 'peach', g_carrots: 'carrots', g_pretzels: 'pretzels', g_chips: 'chips', g_cocoa: 'cocoa',
  g_cider: 'cider', g_cookies: 'cookies', g_fudge: 'fudge', g_comic: 'comic', g_almanac: 'almanac',
};
export const groceryIcon = (id: string) => (GROCERY_ICON[id] ? `/maplegrove/icons/grocery/${GROCERY_ICON[id]}.png` : null);

export const GROCERIES: Grocery[] = [
  { id: 'g_apples_green', name: 'Green Apples', price: 10, taste: 'produce', color: '#7ec850', blurb: "Tart enough to make one eye close." },
  { id: 'g_corn', name: 'Sweet Corn', price: 9, taste: 'produce', color: '#f0c33c', blurb: "Two ears. Butter not included." },
  { id: 'g_strawberries', name: 'Strawberry Basket', price: 15, taste: 'produce', color: '#e0433f', blurb: "Eat them today. That is the deal with strawberries." },
  { id: 'g_bananas', name: 'Bananas', price: 7, taste: 'produce', color: '#f2cb45', blurb: "Somewhere between green and spotted. Your call." },
  { id: 'g_broccoli', name: 'Broccoli', price: 9, taste: 'produce', color: '#3f8f4a', blurb: "Good for you, and it knows it." },
  { id: 'g_tomatoes', name: 'Tomatoes on the Vine', price: 12, taste: 'produce', color: '#d8402f', blurb: "Still on the vine, which somehow matters." },
  { id: 'g_potatoes', name: 'Potatoes', price: 6, taste: 'produce', color: '#b0854a', blurb: "Three of them. Endlessly useful." },
  { id: 'g_blueberries', name: 'Blueberry Pint', price: 16, taste: 'produce', color: '#4a5fb0', blurb: "A pint, minus the handful you eat in the car." },
  { id: 'g_cheesepuffs', name: 'Cheese Puffs', price: 9, taste: 'snack', color: '#f08a2a', blurb: "Turns your fingers orange. Worth it." },
  { id: 'g_popcorn', name: 'Popcorn Bag', price: 8, taste: 'snack', color: '#f2e2b8', blurb: "Movie night in a striped bag." },
  { id: 'g_granola', name: 'Granola Bar', price: 6, taste: 'snack', color: '#c8a', blurb: "Health food, technically." },
  { id: 'g_trailmix', name: 'Trail Mix', price: 13, taste: 'snack', color: '#a8742a', blurb: "Everyone picks out the candy first." },
  { id: 'g_crackers', name: 'Crackers Box', price: 11, taste: 'snack', color: '#e0b048', blurb: "Buttery, round, and gone in a sitting." },
  { id: 'g_jerky', name: 'Beef Jerky', price: 18, taste: 'snack', color: '#7a3a20', blurb: "Chewy. Salty. Lasts forever in a backpack." },
  { id: 'g_cheesestick', name: 'Cheese Stick', price: 5, taste: 'snack', color: '#f2d24a', blurb: "You are supposed to peel it. Nobody does." },
  { id: 'g_fruitsnacks', name: 'Fruit Snacks', price: 7, taste: 'snack', color: '#8a4fc0', blurb: "The red ones are the good ones." },
  { id: 'g_rootbeer', name: 'Root Beer', price: 11, taste: 'drink', color: '#6b3a1a', blurb: "Glass bottle. Tastes better that way." },
  { id: 'g_milk', name: 'Carton of Milk', price: 8, taste: 'drink', color: '#cfe0f0', blurb: "Cold, plain, and exactly right with cookies." },
  { id: 'g_lemonade', name: 'Lemonade Jug', price: 15, taste: 'drink', color: '#f2e05a', blurb: "Made this morning. Pulp and all." },
  { id: 'g_orangejuice', name: 'Orange Juice', price: 12, taste: 'drink', color: '#f09030', blurb: "The kind with the little orange on the box." },
  { id: 'g_water', name: 'Bottled Water', price: 4, taste: 'drink', color: '#8fd0e8', blurb: "Water. In a bottle. Revolutionary." },
  { id: 'g_soda', name: 'Soda Can', price: 6, taste: 'drink', color: '#d8322a', blurb: "Cracks open with the best sound in the world." },
  { id: 'g_icedtea', name: 'Iced Tea', price: 10, taste: 'drink', color: '#c08a2a', blurb: "Sweet enough to count as dessert." },
  { id: 'g_sportsdrink', name: 'Sports Drink', price: 9, taste: 'drink', color: '#3fa0e0', blurb: "Electric blue. Tastes electric blue." },
  { id: 'g_candyapple', name: 'Candy Apple', price: 14, taste: 'sweet', color: '#c8202a', blurb: "One bite, then you rethink everything." },
  { id: 'g_cupcake', name: 'Frosted Cupcake', price: 13, taste: 'sweet', color: '#f090b8', blurb: "More frosting than cupcake. Correct." },
  { id: 'g_gumballs', name: 'Bag of Gumballs', price: 9, taste: 'sweet', color: '#e04f8a', blurb: "Flavour lasts ninety seconds. Chew lasts hours." },
  { id: 'g_chocolatebar', name: 'Chocolate Bar', price: 12, taste: 'sweet', color: '#6b4020', blurb: "Snaps into squares. Gets eaten in one." },
  { id: 'g_lollipop', name: 'Lollipop', price: 5, taste: 'sweet', color: '#f070a8', blurb: "A spiral of pure patience." },
  { id: 'g_donut', name: 'Donut', price: 11, taste: 'sweet', color: '#f2a0c0', blurb: "Pink glaze, rainbow sprinkles, no regrets." },
  { id: 'g_icecreamsandwich', name: 'Ice Cream Sandwich', price: 13, taste: 'sweet', color: '#8a6a4a', blurb: "The wrapper always sticks. Still worth it." },
  { id: 'g_jellybeans', name: 'Jar of Jellybeans', price: 17, taste: 'sweet', color: '#50b0a0', blurb: "Nobody agrees on the best colour." },
  { id: 'g_puzzlemag', name: 'Puzzle Magazine', price: 13, taste: 'book', color: '#f0c840', blurb: "Half the crossword is already filled in. Wrongly." },
  { id: 'g_stickerbook', name: 'Sticker Book', price: 15, taste: 'book', color: '#f090c8', blurb: "Gram would like a word about your sticker habits." },
  { id: 'g_newspaper', name: 'Local Newspaper', price: 5, taste: 'book', color: '#c8c4b8', blurb: "Yesterday's Gazette. Still good reading." },
  { id: 'g_mystery', name: 'Mystery Paperback', price: 18, taste: 'book', color: '#2f4a7a', blurb: "You will guess it on page nine and be wrong." },
  { id: 'g_cookbook', name: 'Cookbook', price: 22, taste: 'book', color: '#c0402a', blurb: "Three recipes you will make, forty you will admire." },
  { id: 'g_fieldguide', name: 'Field Guide', price: 19, taste: 'book', color: '#3f7a3a', blurb: "Theo swears by it. Theo is still lost." },
  { id: 'g_jokebook', name: 'Joke Book', price: 11, taste: 'book', color: '#f08a2a', blurb: "Every joke lands with someone. Eventually." },
  { id: 'g_coloringbook', name: 'Coloring Book', price: 12, taste: 'book', color: '#70b0e0', blurb: "Crayons included. Two are broken." },
  { id: 'g_peach',    name: 'Orchard Peach',     price: 12, taste: 'produce', color: '#f3a23a', blurb: 'From Brooks Orchard. Still warm from the sun, allegedly.' },
  { id: 'g_carrots',  name: 'Bunch of Carrots',  price: 8,  taste: 'produce', color: '#e07a2a', blurb: 'Olivia grew these. She\'ll tell you.' },
  { id: 'g_pretzels', name: 'Pretzel Twists',    price: 10, taste: 'snack',   color: '#c9893f', blurb: 'Aisle three. Or four.' },
  { id: 'g_chips',    name: 'Maple Chips',       price: 2, taste: 'snack',   color: '#eab53e', blurb: 'Kettle-cooked. Slightly too salty. Perfect.' },
  { id: 'g_cocoa',    name: 'Cocoa Mix',         price: 14, taste: 'drink',   color: '#7a4a28', blurb: 'the Café\'s own blend, in a tin.' },
  { id: 'g_cider',    name: 'Apple Cider',       price: 14, taste: 'drink',   color: '#c4673b', blurb: 'Pressed in the Farmington every Saturday.' },
  { id: 'g_cookies',  name: 'Chocolate Chip Cookies', price: 16, taste: 'sweet', color: '#8a5a30', blurb: 'Gram Willoughby\'s recipe. Sort of. Close enough.' },
  { id: 'g_fudge',    name: 'Maple Fudge',       price: 18, taste: 'sweet',   color: '#a9743b', blurb: 'The town\'s namesake in fudge form.' },
  { id: 'g_comic',    name: 'Rocket Run Comic',  price: 20, taste: 'book',    color: '#5566c0', blurb: 'Issue #12. The one where they go to the moon.' },
  { id: 'g_almanac',  name: 'Maple Almanac',     price: 24, taste: 'book',    color: '#4f9b46', blurb: 'Planting dates, moon phases, and one recipe for pie.' },
];
export const groceryById = (id: string) => GROCERIES.find((g) => g.id === id);
