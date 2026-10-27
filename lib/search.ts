export type ResultState = 'live' | 'dead' | 'archived' | 'broken';

export interface SearchResult {
  title: string;
  url: string;
  blurb: string;
  state: ResultState;
  display?: string;
}

export interface SearchEntry {
  terms: string[];
  results: SearchResult[];
  didYouMean?: string;
}

export const SEARCH_DB: SearchEntry[] = [
  {
    terms: ['dog sit', 'dog sitting', 'how to dog sit', 'pet sitting', 'pet sit', 'watch a dog', 'watching a dog'],
    results: [{ title: 'PetPals. How to Dog Sit Like a Pro', url: 'www.petpals.com/dog-sitting', blurb: 'Walks twice a day, fresh water, treats up high and socks off the floor. A dog misses its family, so extra belly rubs help.', state: 'live' }],
  },
  {
    terms: ['tucker birthday', 'dog birthday', 'birthday ideas', 'pet birthday', 'dog party'],
    results: [{ title: 'PetPals. How to Throw a Birthday Party for Your Dog', url: 'www.petpals.com/dog-birthday', blurb: 'Peanut butter cake, one or two guests, a new tennis ball. Skip the hat, or take the photo fast.', state: 'live' }],
  },
  {
    terms: ['penguin cove', 'cove', 'level 50', 'level 47', 'icicle', 'penguin', 'igloo', 'unbanned', 'banned'],
    results: [
      {
        title: 'Penguin Cove. Official Site',
        url: 'www.penguincove.com',
        blurb: 'Fresh powder daily since 2003. Build an igloo, join the snowball arena, adopt a puffle-thing.',
        state: 'live',
      },
      {
        title: 'Penguin Cove Help. Tips for earning coins faster',
        url: 'www.penguincove.com/help/tips',
        blurb: 'There are no cheat codes. Daily fishing, Snowball Arena streaks and Plaza deliveries are the fastest legitimate coins.',
        state: 'live',
      },
      {
        title: 'Penguin Cove Help. Igloo decorating tips',
        url: 'www.penguincove.com/help/igloo',
        blurb: 'Layouts from the community: keep the door clear, big furniture on the walls, fireplace in the middle.',
        state: 'live',
      },
      {
        title: 'Penguin Cove Help. My account was banned',
        url: 'www.penguincove.com/help/account',
        blurb: 'Most bans are 24 hours. A parent can email support from the address on the account.',
        state: 'live',
      },
      {
        title: 'Penguin Cove Forums :: How do I get to level 50??',
        url: 'forums.penguincove.com/viewtopic-4471',
        blurb: 'Reply 1: git gud. Reply 2: my cousin works there and, [thread locked by moderator]',
        state: 'dead',
        display: 'forums.penguincove.com/...',
      },
    ],
  },
  {
    terms: ['maze', 'maze game', 'the maze'],
    results: [
      {
        title: 'THE MAZE GAME (do not play with sound on)',
        url: 'www.freewebs.com/themazegame',
        blurb: 'A relaxing maze. Just follow the path to level 3. Nothing happens at level 3. Nothing at all.',
        state: 'broken',
        display: 'freewebs.com/themazegame',
      },
      {
        title: 'GameFort. The Maze Game',
        url: 'www.gamefort.com/maze',
        blurb: 'Can you find your way out? Arrow keys. Three levels. Nothing jumps out.',
        state: 'live',
      },
      {
        title: 'GameFort. Free Games',
        url: 'www.gamefort.com',
        blurb: 'Thousands of free games. The Maze Game, Bubble Pop Deluxe, Tank Wars, and more. No download*.',
        state: 'live',
      },
    ],
    didYouMean: 'the maze game',
  },
  {
    terms: ['pizza', 'italian pie', 'pie shoppe', 'pizza palace'],
    results: [
      {
        title: 'Italian Pie Shoppe. Good Food. Good Friends. Great Pizza.',
        url: 'www.italianpieshoppe.com',
        blurb: 'Family owned since 1987. Menu, specials, hours. Family Night every Tuesday: large 1 topping $11.99.',
        state: 'live',
      },
      {
        title: 'RecordsZone. World Record: Most Pizza',
        url: 'www.recordszone.com/pizza',
        blurb: 'The largest pizza ever made was 122 feet across. The most slices eaten in ten minutes is over 40.',
        state: 'live',
      },
    ],
  },
  {
    terms: ['homework', 'help', 'math', 'metaphor', 'water cycle'],
    results: [
      {
        title: 'Homework Help HQ',
        url: 'www.homeworkhelphq.com',
        blurb: 'Free homework help for grades 5 to 8, written by teachers. Math, science, English, social studies, study skills.',
        state: 'live',
      },
      {
        title: 'City Public Library. Research & Homework Help',
        url: 'www.citylibrary.org/homework',
        blurb: 'Free live tutoring for grades 4 to 12 with your library card, every day 2 to 10 pm. Book report guide at the desk.',
        state: 'live',
      },
      {
        title: 'BookReportsForFree.net. Holes by Louis Sachar',
        url: 'www.bookreportsforfree.net/holes',
        blurb: 'Full summary, themes, and "my favorite part" paragraph you can definitely use as your own, ',
        state: 'dead',
        display: 'bookreportsforfree.net/holes',
      },
    ],
  },
  {
    terms: ['petville', 'adopt', 'adoption', 'tucker'],
    results: [
      {
        title: 'Petville Adoption Center',
        url: 'www.petville.com',
        blurb: 'Adopt a pet. Name it. Never log off. Now with the Lighthouse Update!',
        state: 'broken',
      },
      {
        title: 'Petville. Account Recovery',
        url: 'www.petville.com/recover',
        blurb: 'Forgot your pet? We did too. This page is no longer available.',
        state: 'dead',
        display: 'petville.com/recover',
      },
    ],
  },
  {
    terms: ['maple grove', 'maplegrove', 'maple coins', 'coins'],
    results: [
      {
        title: 'Maple Grove. Official',
        url: 'www.maplegrove.com',
        blurb: 'Build a house, decorate your room, earn Maple Coins. The cozy world. Now with autumn.',
        state: 'live',
      },
      {
        title: 'MapleGrove Fan Page :: ~Sparkle~Kitty~\'s Corner~',
        url: 'www.expage.com/sparklekitty',
        blurb: 'my fav world!!! tips, my room tour, and a quiz. sign my guestbook!!! best viewed in 800x600',
        state: 'dead',
        display: 'expage.com/sparklekitty',
      },
    ],
  },
  {
    terms: ['cheat', 'cheats', 'cheat codes', 'bighead', 'opensesame', 'secret code'],
    results: [
    ],
  },
  {
    terms: ['horse game', 'dinosaur game', 'doll house game', 'my game', 'game i made'],
    results: [
      {
        title: '~* my game *~ (UNDER CONSTRUCTION 4ever)',
        url: 'www.geocities.com/sunnyhills/mygame',
        blurb: 'a game im making. it has HORSES and DINOSAURS and a DOLL HOUSE. coming soon (2009)!! still working on it',
        state: 'archived',
        display: 'geocities.com/sunnyhills/mygame',
      },
    ],
  },
  {
    terms: ['quiz', 'am i', 'what kind of', 'personality test', 'which animal', 'which penguin', 'am i cool'],
    results: [
      {
        title: 'Which Penguin Cove Animal Are You?',
        url: 'www.quizfever.com',
        blurb: 'take the quiz!! are you a puffle, a seal, or the one nobody picks? 10 questions. mostly accurate.',
        state: 'live',
      },
    ],
    didYouMean: 'am i emo quiz',
  },
  {
    terms: ['am i emo', 'emo quiz', 'scene quiz', 'are you emo', 'how 2000s', 'quizfever'],
    results: [
      {
        title: 'QuizFever!. How 2000s Are You?',
        url: 'www.quizfever.com',
        blurb: '8 questions. Sparkle cursors, away messages, burned CDs. Put your result in your profile.',
        state: 'live',
      },
      {
        title: 'Quizilla: Are You Emo? (the REAL quiz)',
        url: 'www.quizilla.com/emoquiz',
        blurb: 'this quiz has been removed by its creator',
        state: 'dead',
        display: 'quizilla.com/emoquiz',
      },
    ],
  },
  {
    terms: ['how to draw', 'draw a horse', 'draw a dragon', 'drawing tutorial', 'how 2 draw'],
    results: [
    ],
  },
  {
    terms: ['how to make slime', 'slime', 'how to make', 'borax', 'crafts'],
    results: [
      {
        title: 'Slime Recipe (ask a grownup first!!)',
        url: 'www.kidscraftcorner.com/slime',
        blurb: 'glue + the laundry stuff your mom said not to touch. results may vary. cleanup definitely will.',
        state: 'dead',
        display: 'kidscraftcorner.com/slime',
      },
    ],
  },
  {
    terms: ['kickflip', 'how to kickflip', 'ollie', 'skateboard', 'skateboarding tricks'],
    results: [
      {
        title: 'how to do a KICKFLIP (slow motion)',
        url: 'www.skatetips.com/kickflip',
        blurb: 'watch it 40 times. land it 0 times. the comments are all "first try" (they are lying).',
        state: 'live',
        display: 'videovault.com/kickflip',
      },
    ],
  },
  {
    terms: ['world record', 'longest', 'biggest', 'most ever', 'guinness'],
    results: [
      {
        title: 'RecordsZone. World Record: Most Pizza',
        url: 'www.recordszone.com/pizza',
        blurb: 'The largest pizza ever made, the most slices eaten in ten minutes, and the longest delivery on record.',
        state: 'live',
      },
    ],
  },
  {
    terms: ['funny pictures', 'funny cats', 'lol', 'funny gifs', 'cat pictures'],
    results: [
    ],
  },
  {
    terms: ['is santa real', 'santa', 'tooth fairy real', 'is the tooth fairy real'],
    results: [
      {
        title: 'KidsAnswers. Is Santa real? Serious answers only.',
        url: 'www.kidsanswers.com/santa',
        blurb: 'That is a conversation to have with your family. Here is what we can tell you about Saint Nicholas.',
        state: 'live',
      },
    ],
  },
  {
    terms: ['how to convince', 'convince your mom', 'convince my parents', 'how to stay up late', 'stay up til midnight'],
    results: [
      {
        title: 'FamilyLife Online. How to Ask Your Parents for Something (and Get a Yes)',
        url: 'www.familylife.com/asking',
        blurb: 'Pick your moment. Do your job first. Ask, then stop talking. Offer a trade.',
        state: 'live',
      },
      {
        title: 'FamilyLife Online. How Late Should Kids Stay Up?',
        url: 'www.familylife.com/bedtime',
        blurb: 'School age kids need 9 to 11 hours. Summer is a good time to let it slide an hour.',
        state: 'live',
      },
      {
        title: 'How To Convince Your Parents (works 30% of the time)',
        url: 'www.homeworkhelphq.com',
        blurb: 'step 1: do a chore first. step 2: pick a good mood. step 3: there is no step 3, just be normal about it.',
        state: 'live',
      },
    ],
  },
  {
    terms: ['free games', 'free online games', 'no download', 'games for free', 'flash games'],
    results: [
      {
        title: 'GameFort. Free Games',
        url: 'www.gamefort.com',
        blurb: 'Thousands of free games. The maze game, bubble pop, tank wars, and more. No download*.',
        state: 'live',
      },
    ],
  },
  {
    terms: ['how to type faster', 'typing', 'typing game', 'wpm', 'learn to type'],
    results: [
      {
        title: 'TypeQuest, the typing game where a fish chases you',
        url: 'www.typequest.com',
        blurb: 'type the words or the fish gets you. you will get faster out of pure fear. high score: your dad.',
        state: 'live',
        display: 'typequest.com',
      },
    ],
  },
  {
    terms: ['g2g', 'gtg', 'what does', 'brb', 'ttyl', 'chat speak'],
    results: [{ title: 'KidsAnswers. What does g2g mean?', url: 'www.kidsanswers.com/g2g', blurb: '"got to go." Plus brb, ttyl, lol, idk, jk and the rest, explained.', state: 'live' }],
  },
  {
    terms: ['can fish blink', 'fish blink', 'fish eyes', 'do fish'],
    results: [{ title: 'KidsAnswers. Can fish blink?', url: 'www.kidsanswers.com/fish-blink', blurb: 'Most fish cannot. They have no eyelids. Sharks are the exception.', state: 'live' }],
  },
  {
    terms: ['scary maze', 'scary maze game'],
    results: [{ title: 'GameFort: The Maze Game (the normal one)', url: 'www.gamefort.com/maze', blurb: 'Arrow keys, find the exit. Nothing jumps out. Do not click maze links that are not on GameFort.', state: 'live' }],
  },
  {
    terms: ['bubble pop', 'bubble pop deluxe', 'bubble shooter'],
    results: [{ title: 'GameFort. Bubble Pop Deluxe', url: 'www.gamefort.com/bubble', blurb: 'Aim, shoot, match three. Clear the board for the bonus. #1 on GameFort this week.', state: 'live' }],
  },
  {
    terms: ['tank wars', 'tank game'],
    results: [{ title: 'GameFort. Tank Wars', url: 'www.gamefort.com/tank', blurb: 'You vs. the computer. First to three hits.', state: 'live' }],
  },
  {
    terms: ['dress up', 'dress-up', 'dress up game'],
    results: [{ title: 'GameFort. Dress Up Studio', url: 'www.gamefort.com/dressup', blurb: 'Hair, tops, bottoms, shoes, backgrounds. Save your look.', state: 'live' }],
  },
  {
    terms: ['stick fighter', 'stick figure game', 'stickman'],
    results: [{ title: 'GameFort. Stick Fighter', url: 'www.gamefort.com/stick', blurb: 'How long can you last? Arrows, jump, punch.', state: 'live' }],
  },
  {
    terms: ['burger time', 'burger game'],
    results: [{ title: 'GameFort. Burger Time!', url: 'www.gamefort.com/burger', blurb: 'Catch the ingredients in ticket order before the kitchen closes.', state: 'live' }],
  },
  {
    terms: ['library', 'city library', 'public library', 'overdue', 'renew', 'summer reading'],
    results: [{ title: 'City Public Library. Read. Learn. Discover. Together.', url: 'www.citylibrary.org', blurb: 'Catalog, my account, events, Summer Reading Club. Main Library at 123 Main Street.', state: 'live' }],
  },
  {
    terms: ['cursor', 'cursors', 'free cursors', 'sparkle', 'cursorcastle'],
    results: [{ title: 'CursorCastle. FREE cursors for your computer!!', url: 'www.coolcursors.com', blurb: 'Sparkle Trail, Flaming Arrow, Rainbow Pointer and 2,000 more. No spyware (we promise).', state: 'live' }],
  },
  {
    terms: ['how to whistle', 'whistle', 'cant whistle'],
    results: [
      { title: 'HowDoI.com. Learn to Whistle in 5 Minutes', url: 'www.howdoi.com/whistle', blurb: 'Wet your lips. Tongue low and flat. Blow gently, not hard. Most people blow far too hard.', state: 'live' },
      { title: 'Ask Beeves Answers. why cant i whistle', url: 'answers.askbeeves.com/q/4471', blurb: 'Best answer: some people take weeks. Keep at it in the car where nobody can hear you.', state: 'live' },
    ],
  },
  {
    terms: ['paper towel', 'science fair', 'science project', 'absorbent'],
    results: [
      { title: 'ScienceBuddy.com. Which Paper Towel Absorbs the Most?', url: 'www.sciencebuddy.com/absorb', blurb: 'A classic. Same amount of water, same time, weigh each towel after. Remember a control.', state: 'live' },
      { title: 'Mrs. Kessler\u2019s 5th Grade Science Page', url: 'www.northside.k12.us/kessler/fair', blurb: 'Board layout, what judges look for, and how to write a hypothesis that is actually testable.', state: 'archived' },
      { title: 'FREE SCIENCE FAIR PROJECTS!!! CLICK HERE', url: 'www.projects4free.biz/fair', blurb: 'Download 1000+ projects instantly! Requires toolbar install.', state: 'broken' },
    ],
  },
  {
    terms: ['teach a dog', 'dog trick', 'tucker trick', 'shake', 'roll over', 'train dog'],
    results: [
      { title: 'PetPals. Teaching Shake in One Afternoon', url: 'www.petpals.com/shake', blurb: 'Hold a treat in a closed fist near the paw. Wait. The moment the paw lifts, say the word and open your hand.', state: 'live' },
      { title: 'PetPals Forums. my dog only does tricks for food', url: 'forums.petpals.com/t/8823', blurb: 'That is not a bug, that is the deal you made. Fade the treat slowly, one in three, then one in five.', state: 'live' },
    ],
  },
  {
    terms: ['fort', 'build a fort', 'backyard fort', 'treehouse'],
    results: [
      { title: 'BackyardBuilds.com. A Fort You Can Actually Finish', url: 'www.backyardbuilds.com/fort', blurb: 'Start smaller than you want to. A fort you finish beats a fort you draw. Ask before using the good tarp.', state: 'live' },
      { title: 'Treehouse plans (free)', url: 'www.woodworkpages.com/treehouse', blurb: 'This page has moved.', state: 'dead' },
    ],
  },
  {
    terms: ['lemonade stand', 'lemonade', 'how much to charge'],
    results: [
      { title: 'KidBiz.com. Running a Lemonade Stand', url: 'www.kidbiz.com/lemonade', blurb: 'Twenty five cents is the right price. Make a sign bigger than you think. Corner beats driveway.', state: 'live' },
    ],
  },
  {
    terms: ['fireflies', 'lightning bugs', 'jar'],
    results: [
      { title: 'BackyardBugs.com. Catching Fireflies Safely', url: 'www.backyardbugs.com/fireflies', blurb: 'Punch holes in the lid, add a damp leaf, and let them go the same night. They do not live long in a jar.', state: 'live' },
      { title: 'Why do fireflies light up?', url: 'www.backyardbugs.com/why-glow', blurb: 'It is a signal, and every species blinks in its own rhythm.', state: 'live' },
    ],
  },
  {
    terms: ['sister', 'annoying sister', 'sisters fight', 'she went in my room'],
    results: [
      { title: 'Ask Beeves Answers. my sister goes in my room', url: 'answers.askbeeves.com/q/9902', blurb: 'Best answer: ask for a rule instead of a punishment. Rules last longer than getting somebody in trouble.', state: 'live' },
      { title: 'FamilyTalk.com. Sharing a House With a Sibling', url: 'www.familytalk.com/siblings', blurb: 'Most sibling arguments are about territory, not the thing being argued about.', state: 'live' },
    ],
  },
  {
    terms: ['bubbler', 'drinking fountain', 'water fountain'],
    results: [
      { title: 'WordMap.com. Bubbler vs Drinking Fountain', url: 'www.wordmap.com/bubbler', blurb: 'Bubbler is concentrated in Wisconsin and parts of New England. Everywhere else says water fountain.', state: 'live' },
    ],
  },
  {
    terms: ['is the computer broken', 'computer slow', 'toolbar', 'popups', 'virus'],
    results: [
      { title: 'HomePCHelp.com. Why Your Computer Got Slow', url: 'www.homepchelp.com/slow', blurb: 'Nine times in ten it is toolbars. Do not install anything a website asks you to install to view it.', state: 'live' },
      { title: 'SPEED UP YOUR PC 300% FREE SCAN', url: 'www.pcboost-now.biz/scan', blurb: 'Your computer may be at risk! Click to begin your free scan!', state: 'broken' },
      { title: 'Bellwood Supply. Customer Support', url: 'www.bellwoodsupply.com/support', blurb: 'Hours, warranty information, and a number that rings in the back room.', state: 'live' },
    ],
  },
  {
    terms: ['moon pearl', 'moon pearls', 'finn the fish walkthrough', 'finn walkthrough'],
    results: [
      { title: 'Finn the Fish. Fan Walkthrough (in progress)', url: 'www.gamefort.com/finn/walkthrough', blurb: 'Coral Cove done. Bubble Bay mostly done. Still working out the trench. Email me if you get past the gate.', state: 'live' },
      { title: 'finn the fish CHEATS unlimited pearls', url: 'www.cheatvault.biz/finn', blurb: 'This page contains no cheats and three pop-ups.', state: 'broken' },
    ],
  },
  {
    terms: ['maple grove tickets', 'maple grove cheat', 'maple grove money', 'arcade tickets'],
    results: [
      { title: 'Maple Grove Forums. Best game for tickets?', url: 'forums.maplegrove.com/t/1180', blurb: 'Whichever one is the seasonal bonus that week. Check the Gazette before you play anything.', state: 'live' },
      { title: 'MAPLE GROVE UNLIMITED MONEY GENERATOR 2009', url: 'www.grovehax.biz/gen', blurb: 'Enter your password to begin! (Do not do this.)', state: 'broken' },
    ],
  },
  {
    terms: ['how do search engines work', 'how does the internet work', 'what is a url'],
    results: [
      { title: 'HowDoI.com. How a Search Engine Works', url: 'www.howdoi.com/search-engines', blurb: 'A program reads pages, keeps an index of the words, and ranks matches. Nobody is choosing your answer by hand.', state: 'live' },
    ],
  },
];

export function resultByUrl(u: string): SearchResult | undefined {
  const bare = u.replace(/^www\./, '');
  for (const e of SEARCH_DB) for (const r of e.results) if (r.url === u || r.url.replace(/^www\./, '') === bare) return r;
  return undefined;
}

const norm = (x: string) => x.toLowerCase().replace(/['\u2019]/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
const hasWords = (hay: string, needle: string) => (' ' + hay + ' ').includes(' ' + needle + ' ');

export function searchFor(query: string): SearchEntry | null {
  const q = norm(query);
  if (!q) return null;
  let best: SearchEntry | null = null; let bestScore = 0;
  for (const entry of SEARCH_DB) {
    for (const raw of entry.terms) {
      const t = norm(raw);
      if (!t) continue;
      const score = hasWords(q, t) ? 1000 + t.length : q.length >= 4 && hasWords(t, q) ? q.length : 0;
      if (score > bestScore) { best = entry; bestScore = score; }
    }
  }
  return best;
}

export const SEARCH_SUGGESTIONS: string[] = [
  'free online games no download',
  'cheats for penguin cove',
  'how to get to level 50 in penguin cove',
  'how to get unbanned from penguin cove',
  'penguin cove secret waterfall room',
  'best igloo layout',
  'how to get a puffle',
  'petville lighthouse update',
  'how to get more coins in petville',
  'how to name your pet',
  'maple grove how to get maple coins',
  'maple grove room ideas',
  'is maple grove shutting down',
  'the maze game',
  'bubble pop deluxe',
  'tank wars cheats',
  'dress up games',
  'am i cool quiz',
  'which penguin cove animal are you',
  'what is my spirit animal',
  'personality quiz',
  'how to draw a horse',
  'how to draw a dragon',
  'how to draw anime eyes',
  'how to draw a dog',
  'how to make slime',
  'how to make a friendship bracelet',
  'how to make a paper fortune teller',
  'how to do a kickflip',
  'how to ollie',
  'how to ride a ripstik',
  'how to do a cartwheel',
  'how to whistle with your fingers',
  'how to type faster',
  'typing games',
  'world record longest fingernails',
  'world record most pizza eaten',
  'biggest dog in the world',
  'funny cat pictures',
  'funny pictures',
  'is santa real serious answers only',
  'is the tooth fairy real',
  'can you dig to china',
  'can fish blink',
  'why is the sky blue',
  'how far away is the moon',
  'is the moon real',
  'what does g2g mean',
  'what does brb mean',
  'what does lol mean',
  'how to convince your mom',
  'how to convince your parents to get a dog',
  'how to stay up til midnight',
  'how to wake up early',
  'what is the answer to number 7',
  'what is a metaphor',
  'how to spell necessary',
  'the water cycle for kids',
  'fractions help',
  'long division help',
  'states and capitals quiz',
  'holes book report',
  'book report on holes louis sachar',
  'how to do a science fair project',
  'volcano science project',
  'how many planets are there',
  'is pluto a planet',
  'dinosaur facts',
  'biggest dinosaur',
  'how to make a volcano erupt',
  'pizza near me',
  'italian pie shoppe tuesday special',
  'best pizza toppings',
  'how to make pizza',
  'birthday party ideas',
  'sleepover ideas',
  'truth or dare questions',
  'would you rather questions',
  'knock knock jokes',
  'funny jokes',
  'how to do a magic trick',
  'card tricks for beginners',
  'how to solve a rubiks cube',
  'how to beat minesweeper',
  'solitaire tips',
  'how to win at checkers',
  'best free games',
  'games like penguin cove',
  'virtual pet games',
  'horse games',
  'dog games',
  'cooking games',
  'dress up games for girls',
  'racing games',
  'two player games',
  'how to get free stuff online',
  'how to make a website',
  'how to make a geocities page',
  'cool cursors',
  'glitter text generator',
  'myspace layouts',
  'how to put music on your page',
  'best screen names',
  'cool usernames not taken',
  'how to draw graffiti letters',
  'emoji faces text',
  'cute things to draw',
  'how to make money as a kid',
  'lemonade stand ideas',
  'how to take care of a hamster',
  'what to name a fish',
  'how to teach a dog to sit',
  'how old is my dog in human years',
  'when does summer end',
  'how many days until christmas',
  'how to make time go faster',
  'is it going to snow',
  'songs from 2009',
  'how to download music for free',
  'how to burn a cd',
  'why is the internet so slow',
  'how to whistle',
  'how to teach a dog to shake',
  'which paper towel absorbs the most water',
  'how to build a fort in your backyard',
  'how much should i charge for lemonade',
  'how to catch fireflies',
  'my sister goes in my room',
  'is it bubbler or drinking fountain',
  'why is the computer so slow',
  'finn the fish walkthrough',
  'maple grove tickets fast',
  'how do search engines work',
];

export function suggestQueries(prefix: string, limit = 7): string[] {
  const p = prefix.trim().toLowerCase();
  if (!p) return [];
  const starts: string[] = [];
  const contains: string[] = [];
  for (const s of SEARCH_SUGGESTIONS) {
    const sl = s.toLowerCase();
    if (sl.startsWith(p)) starts.push(s);
    else if (sl.includes(p)) contains.push(s);
    if (starts.length >= limit) break;
  }
  return [...starts, ...contains].slice(0, limit);
}
