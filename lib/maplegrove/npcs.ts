import type { MGAvatar, MGLocation } from '@/store/maplegrove';
import type { SeasonId } from './districts';

export type GiftTaste = 'snack' | 'drink' | 'produce' | 'sweet' | 'book';
export type FriendTier = 'new' | 'familiar' | 'friend' | 'close' | 'best';

export interface Resident {
  id: string;
  portrait: number;
  scale?: number;
  name: string;
  role: string;
  loc: MGLocation;
  home?: MGLocation;
  avatar: MGAvatar;
  likes: GiftTaste[];
  intro: string;
  lines: Record<FriendTier, string[]>;
  seasonal?: Partial<Record<SeasonId, string>>;
  gifts: { hearts: number; kind: 'sticker' | 'furniture' | 'card' | 'bucks'; id: string; note: string }[];
  x?: number;
}

const A = (p: { preset: number }): MGAvatar => ({ preset: p.preset });

export const RESIDENTS: Resident[] = [
  {
    id: 'mayor',
    portrait: 0, scale: 0.62, name: 'Mayor Maple', role: 'Mayor of Maple Grove', loc: 'townhall', x: 68,
    avatar: A({ preset: 0 }),
    likes: ['sweet', 'drink'],
    intro: "Well, look who moved in! Welcome to Maple Grove. Town Hall's always open, and so is my door.",
    lines: {
      new: ['Settling in okay? Rosemount is a fine place to start.', "If you need anything, the Gazette usually knows before I do.", 'Have you seen Grove Park yet? Best fountain in the county.'],
      familiar: ["You're becoming a regular face around here. I like that.", "I keep telling Audrey we need a 'new residents' column. She keeps saying yes.", 'The furniture store got new stock. I may have already looked.'],
      friend: ["You know, this town runs on people like you showing up.", 'I was at the Arcade last night. Purely official business.', "Between us, I've never beaten Ben at anything."],
      close: ["Some days I walk to the overlook just to look at the whole town. You should come sometime.", 'My grandfather planted the big maple in the park. Fifty one years ago this spring.'],
      best: ["Maple Grove is lucky to have you. I mean that.", 'One day this town will name something after you. A bench, at least.'],
    },
    seasonal: { fall: 'Harvest Festival week is my favorite week. Don\'t tell the other weeks.', winter: 'The lights go up tonight. I pretend I don\'t help. I help.', spring: 'Planting day in the park this weekend. Bring gloves.', summer: 'The pool opens Saturday. I will not be doing the cannonball. Probably.' },
    gifts: [
      { hearts: 3, kind: 'sticker', id: 'st_keys', note: 'A little "Key to the Town" sticker. "Symbolic. Mostly."' },
      { hearts: 6, kind: 'furniture', id: 'poster_maple', note: 'An official Maple Grove poster from the Town Hall lobby.' },
      { hearts: 5, kind: 'card', id: 'c_mayor', note: 'His own trading card. He signed it.' },
    ],
  },
  {
    id: 'audrey',
    portrait: 1, scale: 0.60, name: 'Audrey Smythe', role: 'Editor-in-Chief, Maple Gazette', loc: 'gazette', x: 22,
    avatar: A({ preset: 1 }),
    likes: ['drink', 'book'],
    intro: "New in town? Perfect. Say something quotable and you'll be in Thursday's issue.",
    lines: {
      new: ['Deadline is Wednesday. Deadline is always Wednesday.', 'Read this week\'s issue yet? The front page took me all night.', 'Tips go in the box by the door. Anonymous ones get read first.'],
      familiar: ['You again! Got any news for me? Anything counts. A new couch counts.', 'The rumor about the town shutting down? I started it. Sales were slow.', 'I photographed the fountain for the fourth time this month. It photographs well.'],
      friend: ["I'd put you in the Featured Resident column, but you'd have to sit for a portrait.", ],
      close: ['I started the Gazette in a spare room with a typewriter and a grudge. The grudge is gone. The typewriter is upstairs.', 'Some weeks nothing happens here. Those are the hardest issues and the ones I love most.'],
      best: ['You made the paper. Page one. Don\'t let it go to your head.', 'If I ever retire, the Gazette is yours. I will not retire.'],
    },
    seasonal: { fall: 'Harvest edition is thirty two pages. My hands hurt.', winter: 'The Winter Edition has a crossword. It is very hard. You\'re welcome.' },
    gifts: [
      { hearts: 3, kind: 'sticker', id: 'st_press', note: 'A PRESS sticker. "Use responsibly."' },
      { hearts: 6, kind: 'bucks', id: '150', note: '"Freelance rate. For the tip about the couch."' },
      { hearts: 5, kind: 'card', id: 'c_audrey', note: 'Her trading card. The photo is unflattering; she chose it on purpose.' },
    ],
  },
  {
    id: 'olivia',
    portrait: 3, scale: 0.50, name: 'Olivia Bloom', role: 'Gardener & Farmers Market organizer', loc: 'park', x: 74,
    avatar: A({ preset: 3 }),
    likes: ['produce', 'drink'],
    intro: "Hi there! Mind the tulips. Actually, no - don't mind them, just don't step on them.",
    lines: {
      new: ['The community garden is behind the fountain. Everyone gets a plot.', 'The Farmington market runs Saturdays. Get there early for the good peaches.', 'I planted three hundred bulbs last fall. Two hundred and ninety came up. Not bad.'],
      familiar: ['You\'ve got dirt on your shoe. Good sign.', 'Want to see something? The bonsai maple in my greenhouse just turned red.', 'The ducks in the pond have names. Don\'t ask me the names. Ask the ducks.'],
      friend: ['I saved you a seedling. It\'s a fern. Ferns forgive everything.', 'The orchard is going to be beautiful this year. Come pick with me.'],
      close: ['I moved here for one summer, fifteen years ago. The summer never ended.', 'My grandmother said a town is only as kind as its gardens. I try to keep ours very kind.'],
      best: ['The new flower bed by the fountain? That\'s named for you. Small sign. Big feelings.', 'Best friends get first pick at the market. Forever.'],
    },
    seasonal: { spring: 'Bloom Festival! This is the week I live for.', fall: 'Harvest! The pumpkins outdid themselves. I did nothing. They did it.', winter: 'Everything sleeps in winter. Even me, if I\'m honest.', summer: 'Water the tomatoes at dawn, not noon. Trust me.' },
    gifts: [
      { hearts: 3, kind: 'sticker', id: 'st_greenthumb', note: 'A Green Thumb sticker. Slightly soil-stained.' },
      { hearts: 6, kind: 'furniture', id: 'plant_fern', note: 'The fern she promised you.' },
      { hearts: 5, kind: 'card', id: 'c_olivia', note: 'Her trading card, taken in the greenhouse.' },
    ],
  },
  {
    id: 'theo',
    portrait: 4, scale: 0.52, name: 'Theo Finch', role: 'Local explorer', loc: 'pineridge', x: 74,
    avatar: A({ preset: 4 }),
    likes: ['snack', 'produce'],
    intro: "Shh - hear that? That's the river. I've mapped most of it. Most.",
    lines: {
      new: ['There\'s a trail behind the campground nobody uses. Nobody but me.', 'I found a bottle cap from 1987 under the old dock. Kept it, obviously.', 'Lakeville is quiet on purpose. Downtown is loud on purpose. Balance.'],
      familiar: ['Back again? Good. The river likes regulars.', 'I lost a fishing lure in the pond in \'04. Still looking. Still hopeful.', 'Every hidden thing in this town is hidden by someone who wanted it found.'],
      friend: ['Okay. There\'s a spot upstream where the light hits the water sideways at five. Go.', 'I\'ll teach you fishing sometime. It\'s mostly waiting. I\'m great at waiting.'],
      close: ['I\'m not lost, ever. I just take the long way so the town lasts longer.', 'I keep a notebook of every good spot. Page one is the bench by the fountain. Page forty is blank. For you.'],
      best: ['You\'ve seen more of this town than most people who\'ve lived here forever. Feels good, right?', 'The map in my head has your house on it now. That\'s how I know you live here.'],
    },
    seasonal: { fall: 'The trail is all red right now. Go before the wind gets it.', winter: 'The river\'s frozen at the bend. Don\'t walk on it. I did. Don\'t.' },
    gifts: [
      { hearts: 3, kind: 'sticker', id: 'st_compass', note: 'A little compass sticker. It doesn\'t point north. He says that\'s the point.' },
      { hearts: 6, kind: 'furniture', id: 'window_round', note: 'A round porthole window he salvaged from the old marina.' },
      { hearts: 5, kind: 'card', id: 'c_theo', note: 'His trading card. Photo is of his back, walking away down a trail.' },
    ],
  },

  {
    id: 'walt',
    portrait: 5, scale: 0.60, name: 'Walt Ferris', role: 'Owner, Maple Furniture', loc: 'furniture', x: 16,
    avatar: A({ preset: 5 }),
    likes: ['drink', 'snack'],
    intro: 'Every good room starts with one chair you love. Find the chair. The rest follows.',
    lines: {
      new: ['New stock every visit. I don\'t sleep. I restock.', 'Rugs go down first. People forget rugs.', 'The blue sofa is the best seller. I don\'t know why. It\'s just blue.'],
      familiar: ['Back for more? I had a feeling. I set aside a lamp.', 'You have a good eye. I say that to everyone but I mean it with you.'],
      friend: ['The plush sofa? Ask me about a discount when nobody\'s listening.', 'I built the front counter in 1998 and it has never been level.'],
      close: ['My wife picked every color in this store. I just carry the boxes.', 'Someday I want to see your house. Sellers never see the rooms.'],
      best: ['You could run this place. Don\'t. But you could.', 'Anything in the window is yours at cost. Forever. That\'s not a sale. That\'s friendship.'],
    },
    gifts: [
      { hearts: 3, kind: 'sticker', id: 'st_measure', note: 'A tape-measure sticker. "Measure twice."' },
      { hearts: 6, kind: 'furniture', id: 'lamp_paper', note: 'A paper lantern from the display window.' },
      { hearts: 5, kind: 'card', id: 'c_walt', note: 'His trading card. He is sitting in the blue sofa.' },
    ],
  },
  {
    id: 'june',
    portrait: 6, scale: 0.52, name: 'June Park', role: 'Owner, Maple Grove Café', loc: 'cafe', x: 78,
    avatar: A({ preset: 6 }),
    likes: ['sweet', 'book'],
    intro: 'Welcome in. The mug on the left is yours now. I decided.',
    lines: {
      new: ['Cocoa\'s better than coffee here. Coffee people are lying.', 'Half the town does their thinking at that window table.', 'Audrey writes the whole Gazette from the corner booth. Pretend you don\'t see her.'],
      familiar: ['Your usual? I don\'t know your usual yet. Let\'s invent one.', 'Ben came in this morning and ordered "the loud one." I gave him an espresso.'],
      friend: ['I put a cinnamon roll aside. It\'s yours. No, don\'t pay.', 'Rainy days are the best days in here. Everyone stays too long.'],
      close: ['I opened this place the year my daughter left for college. I needed a room full of people.', 'I know everyone\'s order in town. Yours, I looked forward to learning.'],
      best: ['The window table is yours whenever you want it. I\'ll shoo the mayor.', 'Best friend discount is one hundred percent. Please still tip Marcus.'],
    },
    seasonal: { winter: 'Peppermint cocoa all season. Come warm up.', fall: 'Apple cider from the orchard. Hot. Go on.' },
    gifts: [
      { hearts: 3, kind: 'sticker', id: 'st_mug', note: 'A steaming-mug sticker from the tip jar.' },
      { hearts: 6, kind: 'furniture', id: 'table_small', note: 'A little café table from the back patio.' },
      { hearts: 5, kind: 'card', id: 'c_june', note: 'Her trading card. Mid-laugh, holding two mugs.' },
    ],
  },
  {
    id: 'raj',
    portrait: 7, scale: 0.55, name: 'Raj Patel', role: 'Manager, Maple Mart', loc: 'maplemart', x: 60,
    avatar: A({ preset: 7 }),
    likes: ['produce', 'snack'],
    intro: 'Aisle three is snacks. Aisle four is also snacks. We know our customers.',
    lines: {
      new: ['Fresh produce comes in from the Farmington every morning.', 'Sticker packs are by the register. Yes, they\'re for kids. Yes, adults buy them.', 'Cart wheel squeaks on cart six. Take cart two.'],
      familiar: ['Regular! Good. I ordered extra of the crackers you like.', 'Someone rearranged the cereal by color. It was me. I regret nothing.'],
      friend: ['I\'ll tell you when the rare packs come in. Tuesday. Don\'t tell anyone I told you Tuesday.', 'Olivia\'s peaches are the best thing in this store and they aren\'t even mine.'],
      close: ['I\'ve worked here since I was sixteen. The mop is older than me.', 'Every kid in town buys their first sticker pack here. I remember most of them.'],
      best: ['You\'re practically staff. Want a vest? I have a vest.', 'The employee discount is yours. Officially unofficially.'],
    },
    gifts: [
      { hearts: 3, kind: 'sticker', id: 'st_cart', note: 'A shopping-cart sticker off the register.' },
      { hearts: 6, kind: 'bucks', id: '120', note: '"A gift card. It\'s cash. We don\'t have gift cards."' },
      { hearts: 5, kind: 'card', id: 'c_raj', note: 'His trading card. Aisle three. Proud.' },
    ],
  },
  {
    id: 'lena',
    portrait: 8, scale: 0.55, name: 'Lena Moreau', role: 'Owner, Threads Boutique', loc: 'threads', x: 62,
    avatar: A({ preset: 8 }),
    likes: ['sweet', 'book'],
    intro: 'Come in, come in. Clothes are just memories you can wear. Let\'s make some.',
    lines: {
      new: ['Rare pieces come and go. If you love it, don\'t wait.', 'The mirror in the back is very honest. Fair warning.', 'Event shirts only come around once. Collect them.'],
      familiar: ['Ooh, is that new? It suits you. I would say so.', 'I dyed a whole rack of hoodies maple red last night. My hands are pink.'],
      friend: ['I\'m holding a jacket for you. I didn\'t ask. I knew.', 'You\'ve got a look now. People notice. Audrey noticed.'],
      close: ['I used to design in the city. Nobody there wore anything they loved. Here, everybody does.', 'The first thing I sold in this shop was a hair bow. To the mayor. For his niece. Allegedly.'],
      best: ['You\'re my muse. That\'s a lot. I don\'t take it back.', 'Anything new hits my rack, you see it first. Best friend rule.'],
    },
    gifts: [
      { hearts: 3, kind: 'sticker', id: 'st_needle', note: 'A needle-and-thread sticker.' },
      { hearts: 6, kind: 'bucks', id: '100', note: '"Store credit. Spend it here. Or don\'t. But here."' },
      { hearts: 5, kind: 'card', id: 'c_lena', note: 'Her trading card. Impeccably styled. Obviously.' },
    ],
  },

  {
    id: 'principal',
    portrait: 9, scale: 0.48, name: 'Principal Okafor', role: 'Principal, Maple Academy', loc: 'academy', x: 74,
    avatar: A({ preset: 9 }),
    likes: ['drink', 'book'],
    intro: 'Welcome to Maple Academy. Attendance is optional. Curiosity is not.',
    lines: {
      new: ['Classes are more like games here. Mrs. Okafor\'s orders. That\'s me.', 'The library keeps every Gazette ever printed. Every one.', 'Science Fair is in the spring. Start thinking. Start small.'],
      familiar: ['Back for class? My favorite kind of student.', 'The gym floor was just redone. Please slide on it. That\'s an order.'],
      friend: ['I\'ll let you in on something: I still don\'t know my times tables past nine.', 'Honor Student comes fast if you just keep showing up.'],
      close: ['I went to this school. Same building. Different roof. Same smell in the gym.', 'Every kid who walks through that door is my favorite kid. I mean every one.'],
      best: ['Academy Scholar. That\'s you. Your name goes on the plaque in the lobby.', 'Come back and teach a class someday. I\'ll save you the good chalk.'],
    },
    gifts: [
      { hearts: 3, kind: 'sticker', id: 'st_apple', note: 'A gold-star apple sticker. Classic.' },
      { hearts: 6, kind: 'furniture', id: 'shelf_books', note: 'A bookshelf from the surplus closet. Comes with dust.' },
      { hearts: 5, kind: 'card', id: 'c_principal', note: 'Her trading card. In front of the plaque. Your name is on it.' },
    ],
  },

  {
    id: 'gram',
    portrait: 11, scale: 0.50, name: 'Gram Willoughby', role: 'Retired. Collects everything.', loc: 'oakwood', x: 72,
    avatar: A({ preset: 11 }),
    likes: ['sweet', 'book'],
    intro: 'Oh! A new neighbor. I\'ve got lemonade and about four thousand stickers. Come sit.',
    lines: {
      new: ['I\'ve lived on this street since before it had a name.', 'My sticker book is complete. My sticker books, plural, are not.', 'Take a cookie. Two. I\'m not counting.'],
      familiar: ['There you are. Pull up a chair.', 'I traded a duplicate card to a boy on a bicycle in 1994. Still think about it.'],
      friend: ['Show me your sticker book sometime. I\'ll show you mine. Mine takes an afternoon.'],
      close: ['My husband built this porch. He said the swing would outlast us both. He was half right so far.'],
      best: ['You\'re family now, dear. That comes with cookies and a key.'],
    },
    gifts: [
      { hearts: 3, kind: 'sticker', id: 'st_cookie', note: 'A chocolate-chip cookie sticker. Smells faintly of cookie.' },
      { hearts: 6, kind: 'card', id: 'c_fountain', note: 'A Central Fountain card from her duplicates box.' },
      { hearts: 5, kind: 'card', id: 'c_gram', note: 'Her own trading card. She had them printed herself. In 1996.' },
    ],
  },
  {
    id: 'maya',
    portrait: 12, scale: 0.48, name: 'Maya Chen', role: 'Student, sticker trader', loc: 'applevalley', x: 74,
    avatar: A({ preset: 0 }),
    likes: ['sweet', 'snack'],
    intro: 'Hi!! Do you collect? Please say you collect.',
    lines: {
      new: ['I have doubles of the Town Hall card if you want to trade later!', 'The rare packs at Maple Mart come Tuesdays. Everyone knows. Nobody says.'],
      familiar: ['You\'re back! Did you open a pack yet? Which one did you get?', 'I want to be Gazette editor when I grow up. Or a duck. Ducks seem happy.'],
      friend: ['Okay, okay: the Arcade Prize Corner has a sticker you can\'t get ANYWHERE else.'],
      close: ['I keep my best cards in a shoebox under my bed. That\'s where all the important stuff goes.'],
      best: ['Best friends trade cards for free. That\'s just the rule. Here.'],
    },
    gifts: [
      { hearts: 3, kind: 'sticker', id: 'st_smiley', note: 'A puffy smiley sticker from her collection.' },
      { hearts: 6, kind: 'card', id: 'c_townhall', note: 'Her double Town Hall card. Finally traded.' },
      { hearts: 5, kind: 'card', id: 'c_maya', note: 'Her trading card. She drew it herself.' },
    ],
  },
  {
    id: 'nora',
    portrait: 10, scale: 0.55, name: 'Nora Vance', role: 'Teller, Maple Bank', loc: 'bank', x: 26,
    avatar: A({ preset: 1 }),
    likes: ['snack', 'drink'],
    intro: 'Morning. Window two is open whenever you are.',
    lines: {
      new: ['"Morning. Window two is open whenever you are."', '"Welcome to Maple Bank. Savings or just looking at the vault?"'],
      familiar: ['"Back again. Your savings ticked up overnight."', '"Everybody in this town comes through eventually."'],
      friend: ['"I keep a running guess at what people are saving for. Yours is a good one."', '"The vault door weighs more than my car. I looked it up."'],
      close: ['"I will tell you a secret: the interest is the boring part. The people are not."'],
      best: ['"You are on the short list of people I am always glad to see at the window."'],
    },
    gifts: [
      { hearts: 3, kind: 'sticker', id: 'st_headphones', note: 'A headphones sticker from his skateboard.' },
      { hearts: 6, kind: 'furniture', id: 'poster_band', note: 'A band poster from the café wall.' },
      { hearts: 5, kind: 'card', id: 'c_nora', note: 'Her trading card. The vault, finally perfect.' },
    ],
  },
  {
    id: 'hazel',
    portrait: 14, scale: 0.50, name: 'Hazel Brooks', role: 'Farmer, Brooks Orchard', loc: 'farm', x: 74,
    avatar: A({ preset: 2 }),
    likes: ['produce', 'sweet'],
    intro: 'Boots on? Good. Everything out here is a little muddy and a lot worth it.',
    lines: {
      new: ['The orchard\'s been in my family four generations. The trees don\'t know that. They just grow.', 'Farmers Market Saturdays. I bring the peaches. Olivia brings the talking.'],
      familiar: ['Back for more air? Best air in the county, right here.'],
      friend: ['Pick a plot. Any plot. Grow something. Anything. That\'s the whole secret.'],
      close: ['My grandfather planted the first apple tree the same year the mayor\'s grandfather planted the big maple. They argued about it for forty years.'],
      best: ['You\'ve got standing-in-the-field friend status. There is no higher honor here.'],
    },
    gifts: [
      { hearts: 3, kind: 'sticker', id: 'st_apple_red', note: 'A shiny red apple sticker.' },
      { hearts: 6, kind: 'furniture', id: 'plant_flower', note: 'A flower box from the greenhouse.' },
      { hearts: 5, kind: 'card', id: 'c_hazel', note: 'Her trading card. Up a ladder. Peach in hand.' },
    ],
  },
  {
    id: 'dez',
    portrait: 16, scale: 0.50, name: 'Dez Okafor', role: 'Runs the prize wheel', loc: 'county', x: 72,
    avatar: A({ preset: 9 }),
    likes: ['sweet', 'snack'],
    intro: 'One spin a day. That\'s the rule. Don\'t look at me like that, I didn\'t make it.',
    lines: {
      new: ['The wheel\'s rigged. Not in your favor, not against you. Just rigged toward interesting.', 'Corn dog stand opens at noon. I get the first one. Perks of the job.'],
      familiar: ['Back for your spin? Everybody\'s got a spin. Even the mayor. He lands on socks every time.'],
      friend: ['Between you and me, the big prize hasn\'t come up since May. It\'s due.'],
      close: ['I\'ve run this wheel three summers. I could tell you where it lands by the sound. I won\'t. But I could.'],
      best: ['You\'re the only person who comes here to talk instead of spin. Don\'t tell the others.'],
    },
    gifts: [
      { hearts: 3, kind: 'sticker', id: 'st_fair', note: 'A fair ribbon sticker off his lanyard.' },
      { hearts: 6, kind: 'furniture', id: 'poster_band', note: 'A poster from the bandstand.' },
      { hearts: 5, kind: 'card', id: 'c_eagan', note: 'The Fairgrounds card. He signed the back.' },
    ],
  },
  {
    id: 'sam',
    portrait: 15, scale: 0.50, name: 'Sam Delgado', role: 'Lifeguard / Coach', loc: 'riverside', x: 74,
    avatar: A({ preset: 3 }),
    likes: ['drink', 'snack'],
    intro: 'Hey! Walk, don\'t run. Actually, run. I run everywhere.',
    lines: {
      new: ['Pool\'s in Rosemount, gym\'s at the Academy, and I\'m at both. Somehow.', 'Fishing Derby is at the pond every fall. Biggest fish wins a trophy. The fish get released. The trophy doesn\'t.'],
      familiar: ['You\'ve got good energy. Come to Sports Day.'],
      friend: ['Relay teams need a fourth. You\'re the fourth. Congrats.'],
      close: ['I wasn\'t good at anything in school except being outside. Turns out that\'s a job.'],
      best: ['MVP. That\'s you. I made the medal from a bottle cap. It counts.'],
    },
    gifts: [
      { hearts: 3, kind: 'sticker', id: 'st_whistle', note: 'A whistle sticker. Silent. Thankfully.' },
      { hearts: 6, kind: 'bucks', id: '110', note: '"Prize money from a race you weren\'t in. Take it."' },
      { hearts: 5, kind: 'card', id: 'c_sam', note: 'His trading card. Mid-jump. Whistle blurred.' },
    ],
  },
];

export const residentById = (id: string) => RESIDENTS.find((r) => r.id === id);
export const PLACED_RESIDENTS = RESIDENTS.filter((r) => r.loc !== 'map');

export const residentsAt = (loc: MGLocation) => RESIDENTS.filter((r) => r.loc === loc || r.home === loc);

export function tierFor(hearts: number): FriendTier {
  if (hearts >= 5) return 'best';
  if (hearts >= 4) return 'close';
  if (hearts >= 2) return 'friend';
  if (hearts >= 1) return 'familiar';
  return 'new';
}
export const TIER_LABEL: Record<FriendTier, string> = {
  new: 'New acquaintance', familiar: 'Familiar face', friend: 'Friend', close: 'Close friend', best: 'Best friend',
};
