import { RESIDENTS, type Resident } from './npcs';
import { byId } from './catalog';
import { currentSeason, seeded, weekKey } from './season';

export const GAME_NAMES: Record<string, string> = { acorn: 'Acorn Catch', match: 'Treasure Match', burger: 'Burger Rush', skee: 'Skee Ball', maze: 'Pixel Quest', blocks: 'Block Drop' };

export interface GazetteArticle { head: string; body: string; kicker?: string }
export interface GazetteIssue {
  key: string;
  number: number;
  dateline: string;
  front: GazetteArticle;
  community: GazetteArticle[];
  featured: { resident: Resident; quote: string };
  arcade: GazetteArticle;
  store: GazetteArticle;
  announcements: string[];
}

const COMMUNITY_POOL: ((r: () => number, s: ReturnType<typeof currentSeason>) => GazetteArticle)[] = [
  () => ({ head: 'Town Hall Clock Runs Four Minutes Fast', body: 'The clock above Town Hall has been four minutes fast for years. Mayor Maple says he likes it that way, so nobody in town is ever late. Nobody has fixed it and, honestly, nobody wants to.' }),
  () => ({ head: 'Squeaky Cart at Maple Mart', body: 'Cart six at Maple Mart still squeaks, no matter how many times manager Raj Patel oils the wheel. If you want a quiet trip, grab cart two instead.' }),
  () => ({ head: 'Record Number of Ducks at Grove Park', body: 'Olivia Bloom counted eleven ducks at the Grove Park pond this week, the most anyone can remember. Bring pretzels or cookies from Maple Mart if you want to feed them.' }),
  () => ({ head: 'Library Passes 1,200 Newspapers', body: 'The Maple Academy library now keeps over 1,200 old issues of this very paper. If you ever want to know what happened in town years ago, that is where to look.' }),
  () => ({ head: 'Fishing Is Good at Lakeville', body: 'The bluegill are biting off the Lakeville dock this week. Cast a line, wait for the bobber to dip, then reel it in. Sam Delgado says beginners are catching just fine.' }),
  () => ({ head: 'Free Corn Dogs at the Fairgrounds', body: 'The Eagan Fairgrounds is handing out one free corn dog a day while the fair is in town. Spin the prize wheel while you are there.' }),
  () => ({ head: 'Harvest Help Wanted at the Orchard', body: 'Hazel Brooks is welcoming anyone who wants to help pick apples at the Farmington orchard. Whatever you pick is yours to keep or give to a neighbor as a gift.' }),
  () => ({ head: 'A Note From the People Who Built This Town', body: 'A reader wrote in asking who really runs Maple Grove. The honest answer: a developer named Molly, one careful piece at a time, over about a year. She says thanks for visiting.' }),
  () => ({ head: 'Strange Rumor: The Town Is a Computer Program', body: 'A kid at Maple Academy insists the whole town lives inside an old family computer and resets when the machine shuts off. Adults called it nonsense. The kid has not been proven wrong.' }),
  (_, s) => ({ head: `${s.seasonName} Decorations Are Up Downtown`, body: `Volunteers spent the weekend putting up ${s.decor[0]}. Look for ${s.decor[1]} and ${s.decor[2]} around town while the season lasts.` }),
  () => ({ head: 'New Looks Arrive at Threads', body: 'Lena Moreau has fresh outfits on the rack at Threads Boutique this week. Try one on in the mirror; changing your look is free to browse.' }),
  () => ({ head: 'Savings Pay Off at Maple Bank', body: 'Maple Bank reminds residents that money left in savings grows a little every day.' }),
];

const QUOTES: Record<string, string[]> = {
  mayor: ['Maple Grove is small enough to know and big enough to love.', 'A town is a promise everybody keeps together.'],
  audrey: ['Nothing happens here, every single week, and I have to write it all down.', 'Print isn\'t dead. It\'s in the corner booth.'],
  olivia: ['Plant something. Anything. The town gets kinder.', 'Ferns forgive everything.'],
  theo: ['Every hidden thing was hidden by someone who wanted it found.', 'I take the long way so the town lasts longer.'],
  walt: ['Find the chair you love. The rest follows.', 'Rugs go down first. People forget rugs.'],
  june: ['Half this town does its thinking at my window table.', 'Cocoa people are honest people.'],
  raj: ['Aisle three is snacks. Aisle four is also snacks.', 'Every kid buys their first pack here. I remember most of them.'],
  lena: ['Clothes are memories you can wear.', 'If you love it, don\'t wait.'],
  principal: ['Attendance is optional. Curiosity is not.', 'Every kid who walks in is my favorite kid.'],
  gram: ['My sticker book is complete. My sticker books are not.', 'Take two. I\'m not counting.'],
  maya: ['Do you collect? Please say you collect.', 'Rare packs come Tuesdays. Everyone knows. Nobody says.'],
  nora: ['Savings grow overnight. That is not a trick, that is just interest.', 'The vault door weighs more than my car.'],
  hazel: ['The trees don\'t know they\'re four generations. They just grow.', 'Grow something. That\'s the whole secret.'],
  sam: ['Being outside turned out to be a job.', 'Walk, don\'t run. Actually, run.'],
};

export function buildIssue(opts: { stock: string[]; topGame?: string; topScore?: number; playerName?: string; newResident?: boolean }, d: Date = new Date()): GazetteIssue {
  const key = weekKey(d);
  const rnd = seeded(key);
  const s = currentSeason(d);
  const num = 1180 + (parseInt(key.slice(-2), 10) || 0) + (d.getFullYear() - 2009) * 52;

  const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)];
  const featured = pick(RESIDENTS);
  const quote = pick(QUOTES[featured.id] ?? ['No comment.']);

  const shuffled = [...COMMUNITY_POOL].sort(() => rnd() - 0.5).slice(0, 3).map((f) => f(rnd, s));
  const community: GazetteArticle[] = [...shuffled];
  if (opts.newResident && opts.playerName) {
    community.unshift({ kicker: 'NEW IN TOWN', head: `${opts.playerName} Moves Into Rosemount`, body: `A new resident, ${opts.playerName}, has moved into the yellow house on Rosemount. Neighbors are already dropping off letters at the Post Office. Welcome to Maple Grove, ${opts.playerName}.` });
  }

  const frontHeads: Record<string, GazetteArticle> = {
    spring: { kicker: 'FRONT PAGE', head: 'Bloom Festival Preparations Begin in Grove Park', body: 'Olivia Bloom and a crew of volunteers spent the weekend turning soil around the Central Fountain. "Three hundred bulbs," Bloom said. "Give or take ten." The Bloom Wreath stall opens at the park this week.' },
    summer: { kicker: 'FRONT PAGE', head: 'Carnival Banners Go Up on Main Street', body: 'Striped banners now hang between every lamp post downtown. The Rosemount pool is open, Sam Delgado is "at both places somehow," and the Arcade is paying double tickets on its featured game all season.' },
    fall: { kicker: 'FRONT PAGE', head: 'Harvest Festival Preparations Begin in Grove Park', body: 'Hay bales arrived outside Town Hall Monday morning courtesy of Brooks Orchard. Hazel Brooks confirmed the pumpkins "outdid themselves." The Harvest stall opens at the park this week; the Fishing Derby follows.' },
    winter: { kicker: 'FRONT PAGE', head: 'Lights Go Up Across Maple Grove', body: 'Volunteers strung lights between the downtown lamp posts Saturday. Mayor Maple, spotted on a ladder, said he "does not help" while helping. The winter market stalls are up in Grove Park.' },
  };

  const topScore = opts.topScore ?? 0;
  const arcade: GazetteArticle = topScore > 0
    ? { kicker: 'ARCADE', head: `${opts.playerName ?? 'A New Resident'} Posts ${topScore} in ${opts.topGame ?? 'Acorn Catch'}`, body: `the Arcade confirmed the score "went up on the board and stays there." The Prize Corner has new stock. Season bonus: ${GAME_NAMES[s.bonusGame] ?? s.bonusGame} pays double tickets.` }
    : { kicker: 'ARCADE', head: 'High Score Board Awaits a Challenger', body: `"Somebody come beat something," said the Arcade. The Prize Corner has new stock. Season bonus: ${GAME_NAMES[s.bonusGame] ?? s.bonusGame} pays double tickets during the ${s.name}.` };

  const stockItems = opts.stock.map(byId).filter(Boolean);
  const hi = stockItems.length ? stockItems[Math.floor(rnd() * stockItems.length)]! : undefined;
  const store: GazetteArticle = hi
    ? { kicker: 'STORE HIGHLIGHT', head: `Maple Furniture: ${hi.name} in Stock`, body: `Walt Ferris is featuring the ${hi.name} (${hi.price} Maple Bucks) in the front window this week. "Every good room starts with one piece you love," Ferris said, gesturing at it.` }
    : { kicker: 'STORE HIGHLIGHT', head: 'Maple Furniture Restocks Overnight', body: 'Walt Ferris "does not sleep, he restocks." New pieces in the window this week.' };

  const announcements = [
    `${s.name} is on at Grove Park. The ${s.stall.item} stall is open.`,
    'Maple Academy classes are open to all residents. Attendance optional.',
    'Farmers Market: Saturdays, Farmington. Peaches first.',
    'Tips for the Gazette go in the box by the door. Anonymous ones get read first.',
  ];

  const dateline = d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  return { key, number: num, dateline, front: frontHeads[s.id], community, featured: { resident: featured, quote }, arcade, store, announcements };
}
