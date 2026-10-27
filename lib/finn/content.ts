import type { Scene, Character, Item, NotebookEntry, Wonder } from './types';

export const FIRST_SCENE = 'moon-shell-plaza';

export const ITEMS: Item[] = [
  {
    id: 'shell-tool',
    name: 'Shell Opener',
    icon: '/finn/items/shell-tool.png',
    description: 'A little pry bar. Gus uses it to open his old shell.',
  },
  {
    id: 'spectacles',
    name: 'Gus\u2019s Glasses',
    icon: '/finn/items/spectacles.png',
    description: 'Gus\u2019s big, thick glasses. Everything looks HUGE through them!',
  },
  { id: 'blue-pouch',      name: 'Blue Pouch',   icon: '/finn/items/blue-pouch.png',      description: 'A blue pouch. It\u2019s tied shut, but it feels empty.' },
  { id: 'wrench-handle',   name: 'Wrench Handle',    icon: '/finn/items/wrench-handle.png',   description: 'Half of a wrench. This is the handle.',
    combine: { 'wrench-head': { into: 'wrench-fixed', say: ['Click! The two halves fit together.', 'Now it\u2019s one whole wrench!'] } } },
  { id: 'wrench-head',     name: 'Wrench Head',      icon: '/finn/items/wrench-head.png',     description: 'The heavy end of the wrench.' },
  { id: 'wrench-fixed',    name: 'Wrench', icon: '/finn/items/wrench-fixed.png', description: 'All fixed! It\u2019s only a tiny bit wobbly.' },
  { id: 'current-map',     name: 'Map',      icon: '/finn/items/current-map.png',     description: 'A map with blue lines that show where the water goes.' },
  { id: 'chest-key',       name: 'Key',      icon: '/finn/items/chest-key.png',       description: 'A fancy old key.' },
  { id: 'seaweed-rope',    name: 'Seaweed Rope',     icon: '/finn/items/seaweed-rope.png',    description: 'A long, strong rope made of seaweed. It smells a little fishy!' },
  { id: 'lantern',         name: 'Lantern',    icon: '/finn/items/lantern.png',         description: 'An old lantern. It\u2019s still glowing!' },
  { id: 'specimen-jar',    name: 'Jar',     icon: '/finn/items/specimen-jar.png',    description: 'A clean glass jar. Good for carrying water!' },
  { id: 'crowbar',         name: 'Crowbar',          icon: '/finn/items/crowbar.png',         description: 'A rusty old crowbar. Good for opening stuck things!' },
  { id: 'oil-can',         name: 'Oil Can',          icon: '/finn/items/oil-can.png',         description: 'An oil can. It helps stuck things move.' },
  { id: 'festival-banner', name: 'Banner',  icon: '/finn/items/festival-banner.png', description: 'A festival banner, all rolled up.' },
  { id: 'pearl-ruby',   name: 'Red Pearl',   icon: '/finn/items/pearl-ruby.png',   description: 'A shiny red pearl. It glows like a little fire!' },
  { id: 'pearl-ocean',  name: 'Blue Pearl',  icon: '/finn/items/pearl-ocean.png',  description: 'A shiny blue pearl, like a little bit of the ocean.' },
  { id: 'pearl-sun',    name: 'Gold Pearl',    icon: '/finn/items/pearl-sun.png',    description: 'A shiny gold pearl. It feels warm!' },
  { id: 'pearl-garden', name: 'Green Pearl', icon: '/finn/items/pearl-garden.png', description: 'A shiny green pearl, like a little leaf.' },
  { id: 'pearl-moon',   name: 'White Pearl',   icon: '/finn/items/pearl-moon.png',   description: 'A shiny white pearl. It glows like the moon!' },
];

export const itemById = (id: string) => ITEMS.find((i) => i.id === id);

export const CHARACTERS: Character[] = [
  {
    id: 'pearlina',
    name: 'Pearlina',
    sprite: '/finn/characters/pearlina-idle.png',
    spriteTalk: '/finn/characters/pearlina-react.png',
    x: 0.560, y: 0.395, w: 0.242, h: 0.420,
    dialogue: [
      {
        id: 'pearlina-blue',
        requires: { flags: ['gus-remembers'] },
        lines: [
          'Gus left my blue pouch at the Festival Grounds?',
          'Oh, Finn, thank you! Let\u2019s look there!',
        ],
      },
      {
        id: 'pearlina-waiting',
        requires: { flags: ['met-pearlina'] },
        lines: ['Any luck, Finn? Gus had the pouch last. I\u2019m sure of it!'],
        effects: { setFlags: ['knows-gus'], wonder: ['which-pouch'] },
      },
      {
        id: 'pearlina-first',
        lines: [
          'Finn! Oh, I\u2019m so glad you\u2019re here!',
          'The Moon Pearls are gone! All five of them!',
          'I put them in a little pouch last night. Now they\u2019re missing!',
        ],
        effects: {
          setFlags: ['met-pearlina'],
          notebook: ['moon-pearls'],
          wonder: ['where-pearls'],
        },
        replies: [
          { text: 'What kind of pouch?', to: 'pearlina-pouch' },
          { text: 'Who had it last?', to: 'pearlina-gus' },
        ],
      },
      {
        id: 'pearlina-pouch',
        lines: [
          'My soft blue pouch. All five pearls were inside it.',
          'I gave it to someone to carry for me.',
        ],
        replies: [{ text: 'Who had it last?', to: 'pearlina-gus' }],
      },
      {
        id: 'pearlina-gus',
        lines: [
          'I gave it to Gus the hermit crab. He was helping me carry things.',
          'He\u2019s out in the Coral Gardens. Can you go find him?',
        ],
        effects: { setFlags: ['knows-gus'], wonder: ['which-pouch'] },
      },
    ],
    refuse: [
      'Pearlina smiles. "That\u2019s sweet, Finn, but I don\u2019t need that."',
      'Maybe somebody else does!',
    ],
  },
  {
    id: 'gus',
    name: 'Gus',
    sprite: '/finn/characters/gus-idle.png',
    spriteBefore: { flag: 'gus-remembers', sprite: '/finn/characters/gus-noglasses-idle.png' },
    spriteTalk: '/finn/characters/gus-react.png',
    x: 0.330, y: 0.420, w: 0.203, h: 0.400,
    dialogue: [
      {
        id: 'gus-remembered',
        requires: { flags: ['gus-remembers'] },
        lines: ['Blue pouch. Festival Grounds. I dropped it there. I\u2019m so sorry, Finn!'],
      },
      {
        id: 'gus-needs-specs',
        requires: { flags: ['met-gus'] },
        lines: [
          'Everything is still blurry. I need my glasses!',
          'My glasses are in my old shell. But it\u2019s stuck shut!',
        ],
        effects: { setFlags: ['knows-shell'] },
      },
      {
        id: 'gus-first',
        lines: [
          'Finn! Hello! Hello there!',
          'Yes, Pearlina gave me her blue pouch to carry.',
          'I put it down somewhere, and I wrote down where on my list!',
          'But I can\u2019t read my list without my glasses.',
        ],
        effects: {
          setFlags: ['met-gus'],
          notebook: ['gus-carried'],
          wonder: ['gus-specs'],
        },
        replies: [{ text: 'Where are your glasses?', to: 'gus-specs-where' }],
      },
      {
        id: 'gus-specs-where',
        lines: [
          'In my old shell, over there. The one I used to live in.',
          'It\u2019s stuck shut. I used to have a little tool to open it.',
          'But I lost the tool too. Oh, what a week!',
        ],
        effects: { setFlags: ['knows-shell'] },
      },
    ],
    onGive: {
      spectacles: {
        say: [
          'Oh! Oh, now I can see!',
          'Let me read my list. \u201cBlue pouch: Festival Grounds.\u201d',
          'That\u2019s where I put it down! I\u2019m so sorry, Finn!',
        ],
        takeItems: ['spectacles'],
        setFlags: ['gus-remembers'],
        notebook: ['blue-pouch'],
        resolveWonder: ['which-pouch', 'gus-specs'],
        wonder: ['where-dropped'],
        sound: 'discover',
      },
    },
    refuse: ['Gus looks at it and hands it back. "That\u2019s not mine, I don\u2019t think."'],
  },
  {
    id: 'marina',
    name: 'Marina',
    sprite: '/finn/characters/marina-idle.png',
    spriteTalk: '/finn/characters/marina-react.png',
    x: 0.430, y: 0.395, w: 0.256, h: 0.420,
    dialogue: [
      {
        id: 'marina-first',
        lines: [
          'Finn! Watch out! I dropped something, and I don\u2019t know what!',
          'Eight arms, and I still can\u2019t hold on to my wrench!',
        ],
        replies: [
          { text: 'Have you seen a blue pouch?', to: 'marina-pouch' },
          { text: 'What are you building?', to: 'marina-building' },
        ],
      },
      {
        id: 'marina-pouch',
        lines: [
          'A blue pouch? No, sorry, Finn.',
          'Try the Festival Grounds. Everything ends up there!',
        ],
      },
      {
        id: 'marina-building',
        lines: [
          'I\u2019m fixing the reef gate! It\u2019s been stuck for years, and the festival is tonight.',
          'But I need my WRENCH. It broke into two pieces, and I lost them both!',
          'Ask Captain Barnacle at the Docks. He knows where everything ends up!',
        ],
        effects: { setFlags: ['knows-marina-wrench'], notebook: ['the-gate'], wonder: ['fix-the-gate'] },
      },
    ],
    onGive: {
      'wrench-fixed': {
        say: [
          'Marina grabs it with three arms at once!',
          'Oh, Finn! My WRENCH!',
          'Thank you! I\u2019ll go fix that gate right now. It will be open before the lanterns go up!',
        ],
        takeItems: ['wrench-fixed'],
        setFlags: ['gate-open'],
        notebook: ['gate-opened'],
        resolveWonder: ['fix-the-gate'],
        sound: 'discover',
      },
    },
    refuse: ['Marina looks at it. "That\u2019s not a wrench, Finn!"'],
  },
  {
    id: 'kelp',
    name: 'Kelp',
    sprite: '/finn/characters/kelp-idle.png',
    spriteTalk: '/finn/characters/kelp-react.png',
    x: 0.298, y: 0.511, w: 0.124, h: 0.187,
    dialogue: [
      {
        id: 'kelp-end',
        requires: { flags: ['finished'] },
        lines: ['We did it! Well, YOU did it. But I helped! Kind of!'],
      },
      {
        id: 'kelp-pearls',
        requires: { flags: ['knows-current'] },
        lines: [
          'Five pearls in five quiet places on the Professor\u2019s map!',
          'If you forget where to go, look in your Notebook. I do that all the time!',
        ],
      },
      {
        id: 'kelp-pouch',
        requires: { flags: ['found-pouch'] },
        lines: [
          'The pouch is empty, but it\u2019s still tied shut? That\u2019s weird, Finn!',
          'Somebody smart should look at it. Like Professor Bubble! He\u2019s in the Deep Cave, past the trench.',
        ],
      },
      {
        id: 'kelp-blue',
        requires: { flags: ['gus-remembers'] },
        lines: ['A blue pouch at the Festival Grounds! That\u2019s past Bubble Bay!'],
      },
      {
        id: 'kelp-knows-gus',
        requires: { flags: ['knows-gus'] },
        lines: ['Gus! I like Gus! He once called me four different names in one morning!'],
      },
      {
        id: 'kelp-first',
        lines: [
          'Finn! Finn! The pearls are gone!',
          'I looked twice. They were gone both times!',
        ],
      },
    ],
    refuse: ['Kelp looks at it. Then at you. Then at it again. "Is that for me? I don\u2019t think so!"'],
  },
  {
    id: 'seahorse-post', name: 'Nib',
    sprite: '/finn/characters/seahorse-post-idle.png',
    x: 0.700, y: 0.430, w: 0.112, h: 0.280,
    dialogue: [
      { id: 'nib-1', lines: [
        'Mail! Mail for everyone! Nothing for you today, Finn. I checked twice!',
        'But I do have a letter for Gus. It says "To Gus, from his friend the lamp fish." Hee hee!',
      ] },
    ],
    refuse: ['"I only carry mail!" says Nib, and off she swims.'],
  },
  {
    id: 'star-shop', name: 'Sandy',
    sprite: '/finn/characters/star-shop-idle.png',
    x: 0.075, y: 0.470, w: 0.151, h: 0.280,
    dialogue: [
      { id: 'sandy-1', lines: [
        'Welcome to Shells and Stuff! It\u2019s mostly stuff.',
        'You want a pearl? Everybody wants a pearl today! I only have shells.',
      ] },
    ],
    refuse: ['Sandy shakes her head. "No thanks! I\u2019m not buying today."'],
  },
  {
    id: 'twin-a', name: 'Coco',
    sprite: '/finn/characters/twin-a-idle.png',
    x: 0.245, y: 0.505, w: 0.142, h: 0.280,
    dialogue: [
      { id: 'coco-1', lines: [
        'We saw Gus this morning!',
        'He was carrying lots of stuff and talking to himself!',
        'Hey Finn! Want to play our shell game?',
      ], effects: { notebook: ['gus-at-market'] }, replies: [{ text: 'Yes! Let\u2019s play!', effects: { game: 'shells' } }, { text: 'Maybe later' }] },
    ],
    refuse: ['"Ask Bibi!" says Coco.'],
  },
  {
    id: 'twin-b', name: 'Bibi',
    sprite: '/finn/characters/twin-b-idle.png',
    x: 0.385, y: 0.505, w: 0.138, h: 0.280,
    dialogue: [
      { id: 'bibi-1', lines: [
        'And then he swam off to the Festival Grounds!',
        'Yep, the Festival Grounds! I think. Coco, was it the Festival Grounds?',
      ] },
    ],
    refuse: ['"Ask Coco!" says Bibi.'],
  },
  {
    id: 'lobster-grump', name: 'Mr Claw',
    sprite: '/finn/characters/lobster-grump-idle.png',
    x: 0.135, y: 0.470, w: 0.103, h: 0.280,
    dialogue: [
      { id: 'claw-1', lines: [
        'Hmph. A festival. Without the Moon Pearls?',
        'I\u2019ve been coming to this cafe for forty years, and it has never been this gloomy!',
      ] },
    ],
    refuse: ['Mr Claw just crosses his claws. "Hmph!"'],
  },
  {
    id: 'shrimp', name: 'Pip',
    sprite: '/finn/characters/shrimp-idle.png',
    x: 0.690, y: 0.500, w: 0.107, h: 0.220,
    dialogue: [
      { id: 'pip-2', requires: { flags: ['found-pouch'] }, lines: [
        'You found it! You really found it! I\u2019m going to tell EVERYBODY!',
      ] },
      { id: 'pip-1', lines: [
        'Finn! FINN! I\u2019m helping with the festival! I\u2019m carrying things!',
        'I saw Gus put something down by the crates. Then a big swoosh of water came, and I held on to a rock!',
      ], effects: { setFlags: ['pip-saw-crates'], notebook: ['pip-tip'], wonder: ['where-dropped'] } },
    ],
    refuse: ['Pip holds it with both claws, then gives it right back. "That\u2019s not mine!"'],
  },
  {
    id: 'crab-foreman', name: 'Foreman Dug',
    sprite: '/finn/characters/crab-foreman-idle.png',
    x: 0.285, y: 0.545, w: 0.159, h: 0.220,
    dialogue: [
      { id: 'dug-1', lines: [
        'The stage isn\u2019t done, the lanterns aren\u2019t up, and the reef gate is still stuck!',
        'Want to help? Talk to Marina about that gate.',
      ], effects: { setFlags: ['knows-gate-job'] } },
    ],
    onGive: {
      'festival-banner': {
        say: [
          'Dug unrolls it, and for the first time all day, he smiles!',
          '"Somebody made this by hand," he says. "It\u2019s beautiful!"',
          'He hangs it over the stage in a jiffy.',
          '"Thank you, Finn! You saved the festival banner!"',
        ],
        takeItems: ['festival-banner'],
        setFlags: ['banner-hung'],
        notebook: ['the-banner'],
        sound: 'discover',
      },
    },
    refuse: ['"Not right now, Finn," says Dug. "I\u2019m busy!"'],
  },
  {
    id: 'jellyfish', name: 'Drift',
    sprite: '/finn/characters/jellyfish-idle.png',
    x: 0.640, y: 0.330, w: 0.129, h: 0.280,
    dialogue: [
      { id: 'drift-1', lines: [
        'Ooh. Hello. I was thinking about something.',
        'It was very important. Now I forget what it was. Hee hee!',
      ] },
    ],
    refuse: ['Drift just floats away.'],
  },
  {
    id: 'barnacle', name: 'Captain Barnacle',
    sprite: '/finn/characters/barnacle-idle.png',
    spriteTalk: '/finn/characters/barnacle-react.png',
    x: 0.450, y: 0.510, w: 0.187, h: 0.340,
    dialogue: [
      { id: 'barnacle-2', requires: { flags: ['knows-gate-job'] }, lines: [
        'The reef gate! Now THAT is a story! Long ago, I was the last one to swim through it!',
        'Marina will need the whole wrench, though. Not just half! She\u2019s always losing the head.',
      ], effects: { setFlags: ['knows-wrench-halves'], notebook: ['the-wrench'] } },
      { id: 'barnacle-1', lines: [
        'Ahoy, Finn! Did I ever tell you about the day the tide went out and never came back?',
        'No? Well. It was a Tuesday. Or maybe a Thursday. I forget!',
      ] },
    ],
    refuse: ['"No thank you, matey!" says the Captain. "I\u2019ve got everything I need!"'],
  },
  {
    id: 'bubbles', name: 'Bubbles',
    sprite: '/finn/characters/bubbles-idle.png',
    spriteTalk: '/finn/characters/bubbles-react.png',
    x: 0.720, y: 0.400, w: 0.270, h: 0.340,
    dialogue: [
      { id: 'bubbles-2', requires: { flags: ['knows-wrench-halves'] }, lines: [
        'The wrench head? Oh no. Oh no, no, no!',
        'I dropped it over the edge! Something scared me, and I went POP!',
        'It\u2019s down on the first ledge. I\u2019m too scared to go down there!',
      ], effects: { setFlags: ['bubbles-dropped-head'], notebook: ['the-wrench-head'] } },
      { id: 'bubbles-1', lines: [
        'Eek! Oh, it\u2019s only you, Finn. I\u2019m fine! I\u2019m totally fine!',
        'I\u2019m not standing here because I\u2019m brave. I\u2019m standing here because I\u2019m too scared to move!',
      ] },
    ],
    refuse: ['Bubbles puffs up a little. "No thank you! I\u2019d rather not hold anything!"'],
  },
  {
    id: 'professor', name: 'Professor Bubble',
    sprite: '/finn/characters/professor-idle.png',
    spriteTalk: '/finn/characters/professor-react.png',
    x: 0.135, y: 0.400, w: 0.193, h: 0.340,
    dialogue: [
      { id: 'prof-2', requires: { flags: ['knows-current'] }, lines: [
        'Follow the map, Finn! Things stop where the water slows down.',
        'Five places. Five pearls. Off you go!',
        'Would you like to take my sea quiz?',
      ], replies: [{ text: 'Yes! Let\u2019s play!', effects: { game: 'quiz' } }, { text: 'Maybe later' }] },
      { id: 'prof-1', lines: [
        'Currents! Currents, Finn! The water down here is always moving!',
        'I\u2019ve been watching this current for nine whole years. It never does the same thing twice!',
        'Would you like to take my sea quiz?',
      ], effects: { notebook: ['the-current'] }, replies: [{ text: 'Yes! Let\u2019s play!', effects: { game: 'quiz' } }, { text: 'Maybe later' }] },
    ],
    onGive: {
      'specimen-jar': {
        requires: { flags: ['jar-full'] },
        say: [
          'The Professor holds up the jar. His eyes get very big.',
          '"I\u2019ve wanted to know why that pool glows for nine whole years!" he says.',
          'He writes something down and smiles a great big smile.',
          '"Thank you for helping science!" he says.',
        ],
        takeItems: ['specimen-jar'],
        setFlags: ['gave-sample'],
        notebook: ['the-sample-answer'],
        sound: 'discover',
      },
      'blue-pouch': {
        say: [
          'The Professor turns the pouch over and holds it up to the light.',
          'Aha! Finn, look at the BOTTOM!',
          'There\u2019s a hole! The stitches came apart.',
          'Nobody opened this pouch. Nobody took the pearls!',
          'The pearls fell out of the hole, and the water carried them away!',
          'Here, take my map. It shows where the water slows down. That\u2019s where the pearls will be!',
          'I put the map in my pouch. I can open it and look anytime!',
        ],
        takeItems: ['blue-pouch'],
        giveItems: ['current-map'],
        setFlags: ['knows-current'],
        notebook: ['the-seam'],
        resolveWonder: ['who-emptied', 'where-pearls'],
        wonder: ['find-five'],
        sound: 'discover',
      },
    },
    refuse: [
      'The Professor looks at it very closely. Then he hands it back.',
      '"Not for science," he says. "Bring me something mysterious!"',
    ],
  },
  {
    id: 'eel', name: 'Mr Sable',
    sprite: '/finn/characters/eel-idle.png',
    x: 0.135, y: 0.400, w: 0.185, h: 0.340,
    dialogue: [
      { id: 'sable-1', lines: [
        'Good evening, Finn. You\u2019re looking for the pearls, aren\u2019t you?',
        'I hope you find them! I know I look a little spooky, but I\u2019m really very friendly.',
      ], effects: { notebook: ['mr-sable'] } },
    ],
    refuse: ['"How kind of you," says Mr Sable, and he hands it back with a little bow.'],
  },
  {
    id: 'fest-pearlina', name: 'Pearlina', look: 'pearlina',
    sprite: '/finn/characters/pearlina-idle.png', spriteTalk: '/finn/characters/pearlina-react.png',
    requires: { flags: ['got-pearl-garden', 'got-pearl-ruby', 'got-pearl-moon', 'got-pearl-ocean', 'got-pearl-sun'] },
    x: 0.320, y: 0.470, w: 0.210, h: 0.365,
    dialogue: [
      { id: 'fest-pearlina-1', lines: [
        'Finn! You found all five pearls!',
        'Take them into the big shell stage. The Moon Shell is waiting inside!',
      ] },
    ],
    refuse: ['Pearlina smiles. "Keep it, Finn. You need those pearls for the Moon Shell!"'],
  },
  {
    id: 'fest-kelp', name: 'Kelp', look: 'kelp',
    sprite: '/finn/characters/kelp-idle.png', spriteTalk: '/finn/characters/kelp-react.png',
    requires: { flags: ['got-pearl-garden', 'got-pearl-ruby', 'got-pearl-moon', 'got-pearl-ocean', 'got-pearl-sun'] },
    x: 0.555, y: 0.670, w: 0.110, h: 0.166,
    dialogue: [
      { id: 'fest-kelp-1', lines: [
        'Finn! Look at all the lanterns!',
        'The fish parade is starting. Want to help me count the fish?',
      ], replies: [{ text: 'Yes! Let\u2019s play!', effects: { game: 'count' } }, { text: 'Maybe later' }] },
    ],
    refuse: ['"Ooh, nice!" says Kelp. "But you should keep it."'],
  },
  {
    id: 'fest-gus', name: 'Gus', look: 'gus',
    sprite: '/finn/characters/gus-idle.png',
    requires: { flags: ['got-pearl-garden', 'got-pearl-ruby', 'got-pearl-moon', 'got-pearl-ocean', 'got-pearl-sun'] },
    x: 0.775, y: 0.500, w: 0.180, h: 0.355,
    dialogue: [
      { id: 'fest-gus-1', lines: [
        'Finn! With my glasses on, I can see every lantern!',
        'I\u2019m sorry I lost the pouch. You saved the festival!',
      ] },
    ],
    refuse: ['"Thank you, Finn, but my shell is full!" says Gus.'],
  },
  {
    id: 'fest-professor', name: 'Professor Bubble', look: 'professor',
    sprite: '/finn/characters/professor-idle.png', spriteTalk: '/finn/characters/professor-react.png',
    requires: { flags: ['got-pearl-garden', 'got-pearl-ruby', 'got-pearl-moon', 'got-pearl-ocean', 'got-pearl-sun'] },
    x: 0.125, y: 0.530, w: 0.170, h: 0.300,
    dialogue: [
      { id: 'fest-professor-1', lines: [
        'Five pearls in five quiet places, just like the current said!',
        'Science, Finn! Well done!',
      ] },
    ],
    refuse: ['"Fascinating," says Professor Bubble. "But you keep it, Finn."'],
  },
];

export const characterById = (id: string) => CHARACTERS.find((c) => c.id === id);

export const SCENES: Scene[] = [
  {
    id: 'moon-shell-plaza',
    title: 'Moon Shell Plaza',
    region: 'Coral Cove',
    background: '/finn/scenes/moon-shell-plaza.jpg',
    bgW: 1536, bgH: 1024,
    characters: ['pearlina', 'kelp'],
    onEnter: { say: ['The plaza is all ready for the festival. But nobody looks happy.'], wonder: ['where-pearls'] },
    hotspots: [
      {
        id: 'moon-shell',
        label: 'The Shell Statue',
        kind: 'essential',
        cursor: 'look',
        x: 0.335, y: 0.155, w: 0.235, h: 0.290,
        onClick: {
          say: [
            'The big shell statue! Its three pearls are so pretty.',
            'The real Moon Shell is out at the festival, waiting for its five pearls.',
          ],
          setFlags: ['saw-empty-shell'],
        },
        repeat: [
          'Three pretty pearls. But the Moon Shell needs five!',
          'I like this statue. Now, where are those Moon Pearls?',
        ],
      },
      {
        id: 'festival-board',
        label: 'Festival Board',
        kind: 'optional',
        cursor: 'look',
        x: 0.155, y: 0.345, w: 0.130, h: 0.200,
        onClick: {
          say: [
            'It says MOONLIGHT FESTIVAL. TONIGHT!',
            'And in tiny letters: "Please do not eat the decorations." Ha!',
          ],
        },
        repeat: ['Who would eat the decorations? Oh. Probably Kelp.'],
      },
      {
        id: 'plaza-lanterns',
        label: 'Paper lanterns',
        kind: 'decorative',
        cursor: 'look',
        x: 0.255, y: 0.090, w: 0.180, h: 0.120,
        onClick: { say: ['Pretty paper lanterns! They wiggle in the water.'] },
        repeat: ['One of them is upside down! Shh. Let\u2019s not tell anybody.'],
      },
      {
        id: 'plaza-awning',
        label: 'The striped shop',
        kind: 'decorative',
        cursor: 'look',
        x: 0.680, y: 0.285, w: 0.105, h: 0.105,
        onClick: { say: ['A little shop with a stripy roof. The sign says BACK LATER.'] },
        repeat: ['Not back yet!'],
      },
    ],
    exits: [
      { id: 'to-home',    label: 'Home',          to: 'finn-home',    dir: 'left',  x: 0.000, y: 0.245, w: 0.115, h: 0.340 },
      { id: 'to-shops',   label: 'The Shops',     to: 'cove-shops',   dir: 'in',    x: 0.695, y: 0.340, w: 0.130, h: 0.220 },
      { id: 'to-gardens', label: 'Coral Gardens', to: 'coral-gardens', dir: 'right', x: 0.885, y: 0.245, w: 0.115, h: 0.340 },
    ],
  },
  {
    id: 'coral-gardens',
    title: 'Coral Gardens',
    region: 'Coral Cove',
    background: '/finn/scenes/coral-gardens.jpg',
    bgW: 1536, bgH: 1024,
    characters: ['gus'],
    hotspots: [
      {
        id: 'tool-in-anemone',
        label: 'Anemone',
        kind: 'essential',
        cursor: 'look',
        requires: { flags: ['knows-shell'], notFlags: ['got-tool'] },
        x: 0.750, y: 0.460, w: 0.230, h: 0.235,
        onClick: {
          say: [
            'Something shiny is down in the anemone!',
            'I reach in. The anemone gives my fin a little squeeze. Hee hee! That tickles!',
            'It\u2019s Gus\u2019s shell opener!',
          ],
          giveItems: ['shell-tool'],
          setFlags: ['got-tool'],
          sound: 'pickup',
        },
      },
      {
        id: 'anemone-empty',
        label: 'Anemone',
        kind: 'decorative',
        cursor: 'look',
        requires: { flags: ['got-tool'] },
        x: 0.750, y: 0.460, w: 0.230, h: 0.235,
        onClick: { say: ['The anemone opens and closes. There\u2019s nothing else inside.'] },
        repeat: ['It looks very happy with itself.'],
      },
      {
        id: 'old-shell',
        label: "Gus's old shell",
        kind: 'essential',
        cursor: 'look',
        x: 0.555, y: 0.385, w: 0.190, h: 0.200,
        onClick: {
          say: ['Gus\u2019s old shell. It\u2019s stuck shut!'],
        },
        onUse: {
          'shell-tool': {
            say: [
              'I wiggle the shell opener around the edge...',
              'POP! It\u2019s open!',
              'Inside are Gus\u2019s big, thick glasses!',
            ],
            giveItems: ['spectacles'],
            takeItems: ['shell-tool'],
            setFlags: ['opened-shell'],
            notebook: ['the-shell'],
            sound: 'discover',
          },
        },
        refuse: ['That won\u2019t open the shell.'],
        repeat: ['Stuck tight! I can hear something rattling inside.'],
      },
      {
        id: 'gardens-kelp',
        label: 'Tall kelp',
        kind: 'decorative',
        cursor: 'look',
        x: 0.020, y: 0.020, w: 0.120, h: 0.225,
        onClick: { say: ['Wow, this kelp is SO tall! It goes up, up, up!'] },
        repeat: ['Still swaying. Wiggle, wiggle!', 'I wonder how tall it really is.'],
      },
    ],
    exits: [
      { id: 'to-plaza',  label: 'Moon Shell Plaza', to: 'moon-shell-plaza',  dir: 'left',  x: 0.040, y: 0.210, w: 0.130, h: 0.255 },
      { id: 'to-market', label: 'Bubble Bay',       to: 'bubble-bay-market', dir: 'right', x: 0.870, y: 0.210, w: 0.125, h: 0.255 },
    ],
  },

  {
    id: 'finn-home',
    title: 'Finn\u2019s Neighborhood',
    region: 'Coral Cove',
    background: '/finn/scenes/finn-home.jpg',
    bgW: 1536, bgH: 1024,
    characters: ['seahorse-post'],
    onEnter: { say: ['Home sweet home! The orange house with the blue door is mine!'] },
    exits: [
      { id: 'to-plaza', label: 'Moon Shell Plaza', to: 'moon-shell-plaza', dir: 'left', x: 0.020, y: 0.290, w: 0.090, h: 0.230 },
    ],
  },
  {
    id: 'cove-shops',
    title: 'Coral Cove Shops',
    region: 'Coral Cove',
    background: '/finn/scenes/cove-shops.jpg',
    bgW: 1536, bgH: 1024,
    characters: ['star-shop'],
    exits: [
      { id: 'to-plaza', label: 'Moon Shell Plaza', to: 'moon-shell-plaza', dir: 'out', x: 0.588, y: 0.300, w: 0.120, h: 0.180 },
    ],
  },
  {
    id: 'bubble-bay-market',
    title: 'Bubble Bay Market',
    region: 'Bubble Bay',
    background: '/finn/scenes/bubble-bay-market.jpg',
    bgW: 1536, bgH: 1024,
    characters: ['twin-a', 'twin-b'],
    onEnter: { say: ['Bubble Bay! It\u2019s busy and SO noisy!'] },
    exits: [
      { id: 'to-gardens',  label: 'Coral Gardens',       to: 'coral-gardens',  dir: 'left',  x: 0.000, y: 0.330, w: 0.085, h: 0.300 },
      { id: 'to-marina',   label: "Marina's Repair Shop", to: 'marina-shop',   dir: 'in',    x: 0.700, y: 0.245, w: 0.130, h: 0.240 },
      { id: 'to-cafe',     label: 'The Caf\u00e9',           to: 'bubble-cafe',   dir: 'in',    x: 0.860, y: 0.245, w: 0.130, h: 0.240 },
      { id: 'to-docks',    label: 'The Docks',            to: 'bubble-docks',  dir: 'right', x: 0.905, y: 0.560, w: 0.095, h: 0.240 },
      { id: 'to-festival', label: 'Festival Grounds',     to: 'festival-grounds', dir: 'up', x: 0.470, y: 0.265, w: 0.105, h: 0.150 },
    ],
  },
  {
    id: 'marina-shop',
    title: "Marina's Repair Shop",
    region: 'Bubble Bay',
    background: '/finn/scenes/marina-shop.jpg',
    bgW: 1536, bgH: 1024,
    hotspots: [
      {
        id: 'ms-oilcan', label: 'Oil can', kind: 'optional', cursor: 'take',
        requires: { notFlags: ['got-oilcan'] },
        x: 0.100, y: 0.330, w: 0.090, h: 0.110,
        onClick: {
          say: ['A little red oil can. It helps stuck things move!', 'Marina won\u2019t mind if I borrow it.'],
          giveItems: ['oil-can'], setFlags: ['got-oilcan'], sound: 'pickup',
        },
      },
      { id: 'ms-bench', label: "Marina's workbench", kind: 'decorative', cursor: 'look',
        x: 0.300, y: 0.330, w: 0.190, h: 0.150,
        onClick: { say: ['Marina\u2019s tools! She knows where every single one goes.'] },
        repeat: ['I\u2019d better not touch anything!'] },
    ],
    characters: ['marina'],
    exits: [
      { id: 'to-market', label: 'Bubble Bay Market', to: 'bubble-bay-market', dir: 'out', x: 0.875, y: 0.275, w: 0.120, h: 0.390 },
    ],
  },
  {
    id: 'bubble-cafe',
    title: 'The Bubble Caf\u00e9',
    region: 'Bubble Bay',
    background: '/finn/scenes/bubble-cafe.jpg',
    bgW: 1536, bgH: 1024,
    characters: ['lobster-grump'],
    exits: [
      { id: 'to-market', label: 'Bubble Bay Market', to: 'bubble-bay-market', dir: 'out', x: 0.150, y: 0.230, w: 0.135, h: 0.260 },
    ],
  },
  {
    id: 'bubble-docks',
    title: 'The Docks',
    region: 'Bubble Bay',
    background: '/finn/scenes/bubble-docks.jpg',
    bgW: 1536, bgH: 1024,
    characters: ['barnacle'],
    hotspots: [
      {
        id: 'dk-handle',
        label: 'Under the boat',
        kind: 'essential',
        cursor: 'look',
        requires: { flags: ['knows-wrench-halves'], notFlags: ['got-handle'] },
        x: 0.735, y: 0.560, w: 0.150, h: 0.150,
        onClick: {
          say: [
            'Something is stuck under the boat!',
            'It\u2019s a wrench handle! Half of Marina\u2019s wrench!',
          ],
          giveItems: ['wrench-handle'],
          setFlags: ['got-handle'],
          sound: 'pickup',
        },
      },
      {
        id: 'dk-traps',
        label: 'Lobster traps',
        kind: 'decorative',
        cursor: 'look',
        x: 0.030, y: 0.700, w: 0.170, h: 0.170,
        onClick: { say: ['Lobster traps. They\u2019re all empty!'] },
        repeat: ['Still empty.'],
      },
    ],
    exits: [
      { id: 'to-market', label: 'Bubble Bay Market', to: 'bubble-bay-market', dir: 'left',  x: 0.070, y: 0.215, w: 0.115, h: 0.180 },
      { id: 'to-kelp',   label: 'Kelp Forest',       to: 'kelp-forest',       dir: 'right', x: 0.905, y: 0.330, w: 0.095, h: 0.280 },
    ],
  },
  {
    id: 'festival-grounds',
    title: 'Festival Grounds',
    region: 'Bubble Bay',
    background: '/finn/scenes/festival-grounds.jpg',
    bgW: 1536, bgH: 1024,
    characters: ['shrimp', 'crab-foreman'],
    onEnter: { say: ['The Festival Grounds! They\u2019re only half ready.', 'Gus said he put the pouch down somewhere around here.'] },
    hotspots: [
      {
        id: 'fg-banner', label: 'A rolled up banner', kind: 'optional', cursor: 'take',
        requires: { notFlags: ['got-banner'] },
        x: 0.770, y: 0.520, w: 0.130, h: 0.140,
        onClick: {
          say: ['A festival banner, all rolled up behind a crate!', 'Somebody made it and forgot it here. I\u2019ll take it!'],
          giveItems: ['festival-banner'], setFlags: ['got-banner'], sound: 'pickup',
        },
      },

      {
        id: 'fg-crates',
        label: 'Stacked crates',
        kind: 'essential',
        cursor: 'look',
        requires: { notFlags: ['found-pouch'] },
        x: 0.545, y: 0.545, w: 0.130, h: 0.150,
        onClick: {
          say: [
            'I squeeze in behind the crates...',
            'The water pushed lots of things back here.',
            'And look! A little blue pouch!',
            'But it\u2019s empty! And it\u2019s still tied shut. Hmm!',
          ],
          giveItems: ['blue-pouch'],
          setFlags: ['found-pouch'],
          notebook: ['pouch-empty'],
          resolveWonder: ['where-dropped'],
          wonder: ['who-emptied'],
          sound: 'discover',
        },
      },
      {
        id: 'fg-crates-after',
        label: 'Stacked crates',
        kind: 'decorative',
        cursor: 'look',
        requires: { flags: ['found-pouch'] },
        x: 0.545, y: 0.545, w: 0.130, h: 0.150,
        onClick: { say: ['Nothing else back here. Just sand and one very surprised snail!'] },
        repeat: ['The snail still hasn\u2019t moved. Hi, snail!'],
      },
      {
        id: 'fg-stage',
        label: 'The stage',
        kind: 'decorative',
        cursor: 'look',
        x: 0.185, y: 0.290, w: 0.230, h: 0.230,
        onClick: { say: ['A big stage shaped like a shell!'] },
        repeat: ['Somebody wrote "BREAK A FIN!" on the back. That means good luck!'],
      },
    ],
    exits: [
      { id: 'to-market', label: 'Bubble Bay Market', to: 'bubble-bay-market', dir: 'right', x: 0.600, y: 0.330, w: 0.150, h: 0.240 },
    ],
  },

  {
    id: 'kelp-forest',
    title: 'Kelp Forest',
    region: 'Sunken Garden',
    background: '/finn/scenes/kelp-forest.jpg',
    bgW: 1536, bgH: 1024,
    onEnter: { say: ['The kelp goes up and up! Everything looks green down here.'] },
    hotspots: [
      {
        id: 'kf-rope',
        label: 'Coiled seaweed',
        kind: 'essential',
        cursor: 'take',
        requires: { notFlags: ['got-rope'] },
        x: 0.075, y: 0.430, w: 0.130, h: 0.170,
        onClick: {
          say: [
            'Some long, strong seaweed. It\u2019s just like a rope!',
            'I\u2019ll roll it up and take it with me!',
          ],
          giveItems: ['seaweed-rope'],
          setFlags: ['got-rope'],
          sound: 'pickup',
        },
      },
      {
        id: 'kf-sign',
        label: 'Signpost',
        kind: 'decorative',
        cursor: 'look',
        x: 0.085, y: 0.430, w: 0.180, h: 0.190,
        requires: { flags: ['got-rope'] },
        onClick: { say: ['A sign with an arrow. It points the way I\u2019m already going!'] },
        repeat: ['Yep. Still pointing.'],
      },
    ],
    exits: [
      { id: 'to-docks',  label: 'The Docks',     to: 'bubble-docks',  dir: 'left',  x: 0.000, y: 0.275, w: 0.115, h: 0.370 },
      { id: 'to-garden', label: 'Flower Garden', to: 'flower-garden', dir: 'in', x: 0.415, y: 0.330, w: 0.150, h: 0.270 },
    ],
  },
  {
    id: 'flower-garden',
    title: 'Flower Garden',
    region: 'Sunken Garden',
    background: '/finn/scenes/flower-garden.jpg',
    bgW: 1536, bgH: 1024,
    hotspots: [
      { id: 'fg-fountain', label: 'The fountain', kind: 'optional', cursor: 'look',
        x: 0.430, y: 0.370, w: 0.150, h: 0.190,
        onClick: { say: ['A little stone fountain! It makes bubbles!', 'Somebody keeps it nice and clean.'] },
        repeat: ['The bubbles go up in threes! One, two, three!'] },
      { id: 'fg-arch', label: 'Flower arch', kind: 'decorative', cursor: 'look',
        x: 0.155, y: 0.175, w: 0.150, h: 0.230,
        onClick: { say: ['An arch covered in pink and yellow sea flowers!'] },
        repeat: ['One flower closed up when I got close! It\u2019s shy!'] },
      { id: 'fg-beds', label: 'Flower beds', kind: 'decorative', cursor: 'look',
        x: 0.690, y: 0.560, w: 0.180, h: 0.180,
        onClick: { say: ['Rows and rows of sea daisies. So pretty!'] },
        repeat: ['I\u2019d better not swim on them.'] },

      {
        id: 'fg-pearl', label: 'In the flowerbed', kind: 'essential', cursor: 'take',
        requires: { flags: ['knows-current'], notFlags: ['got-pearl-garden'] },
        x: 0.310, y: 0.460, w: 0.110, h: 0.110,
        onClick: {
          say: [
            'The map says the water slows down right here.',
            'And look! Sitting in the middle of a yellow flower...',
            'The Green Pearl!',
          ],
          giveItems: ['pearl-garden'], setFlags: ['got-pearl-garden'], sound: 'discover',
        },
      },
    ],
    characters: ['jellyfish'],
    exits: [
      { id: 'to-kelp',   label: 'Kelp Forest',   to: 'kelp-forest',   dir: 'left',  x: 0.000, y: 0.275, w: 0.115, h: 0.370 },
      { id: 'to-grotto', label: 'Hidden Grotto', to: 'hidden-grotto', dir: 'right', x: 0.885, y: 0.275, w: 0.115, h: 0.370 },
    ],
  },
  {
    id: 'hidden-grotto',
    title: 'Hidden Grotto',
    region: 'Sunken Garden',
    background: '/finn/scenes/hidden-grotto.jpg',
    bgW: 1536, bgH: 1024,
    hotspots: [
      {
        id: 'hg-pool', label: 'The glowing pool', kind: 'optional', cursor: 'look',
        x: 0.395, y: 0.470, w: 0.180, h: 0.140,
        onClick: { say: ['This pool glows from the bottom! I wonder why.'] },
        onUse: {
          'specimen-jar': {
            requires: { notFlags: ['jar-full'] },
            say: ['I dip the jar in the pool...', 'Wow! The water keeps glowing, even in the jar!'],
            setFlags: ['jar-full'], notebook: ['the-sample'], sound: 'discover',
          },
        },
        refuse: ['I need something to carry the glowing water in.'],
        repeat: ['Still glowing!'],
      },

      { id: 'hg-chest', label: 'An old chest', kind: 'optional', cursor: 'look',
        x: 0.055, y: 0.560, w: 0.175, h: 0.180,
        onClick: { say: ['An old treasure chest, full of gold coins and jewels!', 'Wow! But it\u2019s not mine. I\u2019ll leave it right here.'] },
        repeat: ['Still full of treasure. Still not mine!'] },
      { id: 'hg-crystals', label: 'Blue crystals', kind: 'decorative', cursor: 'look',
        x: 0.700, y: 0.390, w: 0.085, h: 0.110,
        onClick: { say: ['Blue crystals, growing right out of the rock!'] },
        repeat: ['If I hold very still, I can hear them hum!'] },
      { id: 'hg-falls', label: 'The waterfall', kind: 'decorative', cursor: 'look',
        x: 0.185, y: 0.240, w: 0.140, h: 0.260,
        onClick: { say: ['A waterfall, under the water! How does that work?'] },
        repeat: ['Still falling!'] },

      {
        id: 'hg-crack', label: 'An old clay pot', kind: 'essential', cursor: 'look',
        requires: { flags: ['knows-current'], notFlags: ['grotto-lit', 'got-pearl-ruby'] },
        x: 0.800, y: 0.500, w: 0.125, h: 0.140,
        onClick: {
          say: [
            'The map points to this old clay pot!',
            'Something is inside, but it\u2019s too dark to see. I need a light!',
          ],
        },
        onUse: {
          lantern: {
            say: [
              'I hold the lantern up to the pot...',
              'A red glow shines back at me! There\u2019s a pearl in there!',
            ],
            takeItems: ['lantern'], glow: '#ff3b30', setFlags: ['grotto-lit'], sound: 'discover',
          },
        },
        refuse: ['That won\u2019t help me see inside.'],
        repeat: ['It\u2019s dark in there. I need a light!'],
      },
      {
        id: 'hg-pearl', label: 'The Red Pearl', kind: 'essential', cursor: 'take',
        requires: { flags: ['grotto-lit'], notFlags: ['got-pearl-ruby'] },
        x: 0.835, y: 0.530, w: 0.060, h: 0.060,
        onClick: { say: ['It\u2019s the Red Pearl! I\u2019ll take it!'], giveItems: ['pearl-ruby'], setFlags: ['got-pearl-ruby'], sound: 'discover' },
      },
    ],
    onEnter: { say: ['A secret grotto! It\u2019s so pretty in here!'] },
    exits: [
      { id: 'to-garden', label: 'Flower Garden', to: 'flower-garden', dir: 'left',  x: 0.000, y: 0.275, w: 0.115, h: 0.370 },
      { id: 'to-trench', label: 'Trench Edge',   to: 'trench-edge',   dir: 'out', x: 0.655, y: 0.235, w: 0.135, h: 0.280 },
    ],
  },

  {
    id: 'trench-edge',
    title: 'Trench Edge',
    region: 'Deep Trench',
    background: '/finn/scenes/trench-edge.jpg',
    bgW: 1536, bgH: 1024,
    characters: ['bubbles'],
    onEnter: { say: ['Whoa! It\u2019s a long, long way down. And it\u2019s very dark!'] },
    hotspots: [
      {
        id: 'te-ledge',
        label: 'The first ledge',
        kind: 'essential',
        cursor: 'look',
        requires: { flags: ['bubbles-dropped-head'], notFlags: ['got-head'] },
        x: 0.560, y: 0.560, w: 0.170, h: 0.160,
        onClick: {
          say: [
            'I peek over the edge. The ledge isn\u2019t very far down.',
            'But it\u2019s too deep and dark to go down without a rope!',
          ],
        },
        onUse: {
          'seaweed-rope': {
            say: [
              'I tie the seaweed rope to the post and go down, down, down...',
              'Brr! It\u2019s cold down here!',
              'And there it is! The wrench head!',
            ],
            takeItems: ['seaweed-rope'], giveItems: ['wrench-head'],
            setFlags: ['got-head'],
            sound: 'discover',
          },
        },
        refuse: ['That won\u2019t help me get down there.'],
        repeat: ['It\u2019s too far down. I need a rope!'],
      },
      {
        id: 'te-sign',
        label: 'Warning sign',
        kind: 'decorative',
        cursor: 'look',
        x: 0.075, y: 0.120, w: 0.220, h: 0.170,
        onClick: { say: ['DEEP TRENCH. STAY ON THE PATH.', 'Somebody wrote "good idea" under it.'] },
        repeat: ['Still a good idea!'],
      },
    ],
    exits: [
      { id: 'to-grotto', label: 'Hidden Grotto',    to: 'hidden-grotto',  dir: 'left',  x: 0.000, y: 0.275, w: 0.115, h: 0.370 },
      { id: 'to-tunnel', label: 'Abandoned Tunnel', to: 'trench-tunnel',  dir: 'in', x: 0.430, y: 0.120, w: 0.170, h: 0.260 },
    ],
  },
  {
    id: 'trench-tunnel',
    title: 'Abandoned Tunnel',
    region: 'Deep Trench',
    background: '/finn/scenes/trench-tunnel.jpg',
    bgW: 1536, bgH: 1024,
    hotspots: [
      {
        id: 'tt-lantern', label: 'Old lantern', kind: 'essential', cursor: 'take',
        requires: { notFlags: ['got-lantern'] },
        x: 0.095, y: 0.400, w: 0.090, h: 0.140,
        onClick: {
          say: ['An old lantern, and it\u2019s still glowing!', 'I\u2019ll take it with me!'],
          giveItems: ['lantern'], setFlags: ['got-lantern'], sound: 'pickup',
        },
      },
      { id: 'tt-pipe', label: 'Broken pipe', kind: 'decorative', cursor: 'look',
        x: 0.360, y: 0.520, w: 0.130, h: 0.120,
        onClick: { say: ['A broken old pipe. Nothing comes out of it.'] },
        repeat: ['Still nothing!'] },
    ],
    exits: [
      { id: 'to-edge', label: 'Trench Edge', to: 'trench-edge', dir: 'left', x: 0.000, y: 0.275, w: 0.115, h: 0.370 },
      { id: 'to-cave', label: 'Deep Cave',   to: 'deep-cave',   dir: 'in',   x: 0.630, y: 0.300, w: 0.190, h: 0.290 },
    ],
  },
  {
    id: 'deep-cave',
    title: 'Deep Cave',
    region: 'Deep Trench',
    background: '/finn/scenes/deep-cave.jpg',
    bgW: 1536, bgH: 1024,
    characters: ['professor'],
    onEnter: { say: ['So many crystals! They hum very softly.'] },
    exits: [
      { id: 'to-tunnel', label: 'Abandoned Tunnel', to: 'trench-tunnel', dir: 'out',   x: 0.000, y: 0.275, w: 0.115, h: 0.370 },
      { id: 'to-gate',   label: 'The Reef Gate',    to: 'reef-gate',     dir: 'right', x: 0.885, y: 0.275, w: 0.115, h: 0.370 },
    ],
  },

  {
    id: 'reef-gate',
    title: 'The Reef Gate',
    region: 'Pearl Reef',
    background: '/finn/scenes/reef-gate.jpg',
    bgW: 1536, bgH: 1024,
    onEnter: { say: ['A big green gate. It\u2019s stuck shut!'] },
    hotspots: [
      {
        id: 'rg-gate',
        label: 'The reef gate',
        kind: 'essential',
        cursor: 'look',
        x: 0.360, y: 0.180, w: 0.400, h: 0.480,
        requires: { notFlags: ['gate-open'] },
        onClick: {
          say: [
            'The gate is old and green, and the hinge is stuck.',
            'It won\u2019t move at all!',
            'Marina can fix it. But she needs her wrench!',
          ],
          setFlags: ['saw-gate'],
          wonder: ['fix-the-gate'],
          notebook: ['the-gate'],
        },
        repeat: ['Still stuck. Marina needs her wrench!'],
      },
      {
        id: 'rg-gate-open',
        label: 'The reef gate',
        kind: 'decorative',
        cursor: 'look',
        x: 0.360, y: 0.180, w: 0.400, h: 0.480,
        requires: { flags: ['gate-open'] },
        onClick: { say: ['The gate is open! Marina fixed it!'] },
        repeat: ['It goes squeak! Ha!'],
      },
    ],
    exits: [
      { id: 'to-cave', label: 'Deep Cave',    to: 'deep-cave',    dir: 'left',  x: 0.000, y: 0.275, w: 0.115, h: 0.370 },
      { id: 'to-reef', label: 'Ancient Reef', to: 'ancient-reef', dir: 'right', x: 0.885, y: 0.275, w: 0.115, h: 0.370,
        requires: { flags: ['gate-open'] },
        blocked: ['The gate is stuck shut. Nobody can get through until it\u2019s fixed!'] },
    ],
  },
  {
    id: 'ancient-reef',
    title: 'Ancient Reef',
    region: 'Pearl Reef',
    background: '/finn/scenes/ancient-reef.jpg',
    bgW: 1536, bgH: 1024,
    characters: ['eel'],
    exits: [
      { id: 'to-gate',   label: 'The Reef Gate', to: 'reef-gate',    dir: 'left',  x: 0.000, y: 0.275, w: 0.115, h: 0.370 },
      { id: 'to-shrine', label: 'Pearl Shrine',  to: 'pearl-shrine', dir: 'right', x: 0.880, y: 0.300, w: 0.110, h: 0.260 },
    ],
  },
  {
    id: 'pearl-shrine',
    title: 'Pearl Shrine',
    region: 'Pearl Reef',
    background: '/finn/scenes/pearl-shrine.jpg',
    bgW: 1536, bgH: 1024,
    hotspots: [
      {
        id: 'ps-altar', label: 'The altar', kind: 'essential', cursor: 'look',
        requires: { flags: ['knows-current'], notFlags: ['got-pearl-moon'] },
        x: 0.400, y: 0.430, w: 0.200, h: 0.150,
        onClick: {
          say: [
            'Five round spots in the old stone, just like the Moon Shell!',
            'And in the last one...',
            'The White Pearl! The water carried it all the way here!',
          ],
          giveItems: ['pearl-moon'], setFlags: ['got-pearl-moon'], notebook: ['all-five'], sound: 'discover',
        },
      },
    ],
    onEnter: { say: ['Five round spots in the old stone. This is where the pearls came from!'] },
    exits: [
      { id: 'to-reef', label: 'Ancient Reef',  to: 'ancient-reef',  dir: 'left',  x: 0.000, y: 0.275, w: 0.115, h: 0.370 },
      { id: 'to-ship', label: 'The Sunken Ship', to: 'ship-exterior', dir: 'up', x: 0.430, y: 0.250, w: 0.135, h: 0.230 },
    ],
  },

  {
    id: 'ship-exterior',
    title: 'The Sunken Ship',
    region: 'Sunken Ship',
    background: '/finn/scenes/ship-exterior.jpg',
    bgW: 1536, bgH: 1024,
    onEnter: { say: ['A big old ship, lying on its side in the sand! The door is open.'] },
    exits: [
      { id: 'to-shrine', label: 'Pearl Shrine', to: 'pearl-shrine', dir: 'left', x: 0.000, y: 0.275, w: 0.115, h: 0.370 },
      { id: 'to-cargo',  label: 'Cargo Hold',   to: 'ship-cargo',   dir: 'in',   x: 0.470, y: 0.445, w: 0.130, h: 0.280 },
    ],
    hotspots: [
      {
        id: 'se-pearl', label: 'In the sand', kind: 'essential', cursor: 'take',
        requires: { flags: ['knows-current'], notFlags: ['got-pearl-ocean'] },
        x: 0.330, y: 0.585, w: 0.090, h: 0.090,
        onClick: {
          say: [
            'The map points to the sand next to the old ship.',
            'Something is shining in the sand. It\u2019s the Blue Pearl!',
          ],
          giveItems: ['pearl-ocean'], setFlags: ['got-pearl-ocean'], sound: 'discover',
        },
      },
    ],
  },
  {
    id: 'ship-cargo',
    title: 'Cargo Hold',
    region: 'Sunken Ship',
    background: '/finn/scenes/ship-cargo.jpg',
    bgW: 1536, bgH: 1024,
    hotspots: [
      {
        id: 'sc-strongbox', label: 'A locked strongbox', kind: 'optional', cursor: 'look',
        requires: { notFlags: ['got-jar'] },
        x: 0.120, y: 0.470, w: 0.130, h: 0.140,
        onClick: { say: ['A little iron box with a lock on it.'] },
        onUse: {
          'chest-key': {
            say: [
              'I turn the key... click!',
              'Inside is a clean glass jar.',
              'Somebody wanted to collect something in it.',
            ],
            giveItems: ['specimen-jar'], setFlags: ['got-jar'],
            takeItems: ['chest-key'], sound: 'discover',
          },
        },
        refuse: ['It needs a key!'],
        repeat: ['Still locked. It needs a key!'],
      },

      {
        id: 'sc-crowbar', label: 'Among the crates', kind: 'essential', cursor: 'take',
        requires: { notFlags: ['got-crowbar'] },
        x: 0.170, y: 0.560, w: 0.130, h: 0.130,
        onClick: {
          say: ['A rusty old crowbar, stuck between two crates.', 'I pull and pull... got it!'],
          giveItems: ['crowbar'], setFlags: ['got-crowbar'], sound: 'pickup',
        },
      },
      { id: 'sc-barrels', label: 'Barrels', kind: 'decorative', cursor: 'look',
        x: 0.700, y: 0.520, w: 0.160, h: 0.180,
        onClick: { say: ['Big barrels, all stuck shut.'] },
        repeat: ['I\u2019ll leave those alone.'] },
    ],
    exits: [
      { id: 'to-outside',  label: 'The Sunken Ship',       to: 'ship-exterior',  dir: 'out',   x: 0.000, y: 0.275, w: 0.115, h: 0.370 },
      { id: 'to-cabin',    label: "The Captain's Cabin", to: 'ship-cabin',   dir: 'up',    x: 0.600, y: 0.330, w: 0.130, h: 0.230 },
      { id: 'to-treasure', label: 'Treasure Room',     to: 'ship-treasure',  dir: 'right', x: 0.885, y: 0.275, w: 0.115, h: 0.370 },
    ],
  },
  {
    id: 'ship-cabin',
    title: "The Captain's Cabin",
    region: 'Sunken Ship',
    background: '/finn/scenes/ship-cabin.jpg',
    bgW: 1536, bgH: 1024,
    hotspots: [
      {
        id: 'sc-drawer', label: 'A stuck drawer', kind: 'optional', cursor: 'look',
        requires: { notFlags: ['got-chestkey'] },
        x: 0.290, y: 0.560, w: 0.140, h: 0.120,
        onClick: { say: ['One drawer in the captain\u2019s desk is stuck.', 'It\u2019s been stuck for a long, long time!'] },
        onUse: {
          'oil-can': {
            say: [
              'I put some oil on it and pull...',
              'Creeeak! It opens!',
              'Inside is a fancy old key!',
            ],
            takeItems: ['oil-can'], giveItems: ['chest-key'], setFlags: ['got-chestkey'],
            notebook: ['the-key'], sound: 'discover',
          },
        },
        refuse: ['That won\u2019t help. Maybe something slippery would.'],
        repeat: ['Still stuck!'],
      },
      { id: 'sc-charts', label: 'Wall of charts', kind: 'decorative', cursor: 'look',
        x: 0.050, y: 0.190, w: 0.180, h: 0.230,
        onClick: { say: ['Old maps of faraway places, pinned to the wall.'] },
        repeat: ['Somebody drew a sea monster in the corner! Cool!'] },
    ],
    exits: [
      { id: 'to-cargo',  label: 'Cargo Hold',      to: 'ship-cargo',      dir: 'out',   x: 0.000, y: 0.275, w: 0.115, h: 0.370 },
      { id: 'to-island', label: 'Moonlight Island', to: 'moonlight-festival', dir: 'right', x: 0.905, y: 0.300, w: 0.095, h: 0.280 },
    ],
  },
  {
    id: 'ship-treasure',
    title: 'Treasure Room',
    region: 'Sunken Ship',
    background: '/finn/scenes/ship-treasure.jpg',
    bgW: 1536, bgH: 1024,
    onEnter: { say: ['Wow! Gold everywhere!'] },
    hotspots: [
      {
        id: 'tr-chest', label: 'A shut chest', kind: 'essential', cursor: 'look',
        requires: { flags: ['knows-current'], notFlags: ['got-pearl-sun'] },
        x: 0.615, y: 0.500, w: 0.190, h: 0.190,
        onClick: {
          say: [
            'This chest is shut tight, and the map points right at it!',
            'The lid is stuck!',
          ],
        },
        onUse: {
          crowbar: {
            say: [
              'I push the crowbar under the lid and pull...',
              'POP! It opens!',
              'And there, on top of the gold...',
              'The Gold Pearl! It feels warm!',
            ],
            takeItems: ['crowbar'], giveItems: ['pearl-sun'], setFlags: ['got-pearl-sun'], sound: 'discover',
          },
        },
        refuse: ['The lid won\u2019t budge.'],
        repeat: ['Still stuck shut. Something is inside!'],
      },
    ],
    exits: [
      { id: 'to-cargo', label: 'Cargo Hold', to: 'ship-cargo', dir: 'out', x: 0.000, y: 0.275, w: 0.115, h: 0.370 },
    ],
  },

  {
    id: 'moonlight-festival',
    title: 'The Moonlight Festival',
    region: 'Moonlight Island',
    background: '/finn/scenes/moonlight-festival.jpg',
    bgW: 1536, bgH: 1024,
    onEnter: { say: ['They lit the lanterns anyway! Everyone is waiting!'] },
    characters: ['fest-pearlina', 'fest-kelp', 'fest-gus', 'fest-professor'],
    exits: [
      { id: 'to-shallows', label: 'The Sunken Ship',  to: 'ship-cabin', dir: 'left', x: 0.000, y: 0.275, w: 0.115, h: 0.370 },
      { id: 'to-chamber',  label: 'Moon Shell Chamber', to: 'moon-chamber',  dir: 'in',   x: 0.610, y: 0.330, w: 0.150, h: 0.230 },
    ],
  },
  {
    id: 'moon-chamber',
    title: 'Moon Shell Chamber',
    region: 'Moonlight Island',
    background: '/finn/scenes/moon-chamber.jpg',
    bgW: 1536, bgH: 1024,
    hotspots: [
      {
        id: 'mc-shell', label: 'The Moon Shell', kind: 'essential', cursor: 'look', autoUse: true,
        requires: { notFlags: ['finished'] },
        x: 0.440, y: 0.400, w: 0.200, h: 0.200,
        onClick: {
          say: [
            'The real Moon Shell, under the real moon! It has five empty spots.',
            'It needs all five pearls.',
          ],
        },
        onUse: {
          'pearl-ruby': {
            requires: { items: ['pearl-ruby', 'pearl-ocean', 'pearl-sun', 'pearl-garden', 'pearl-moon'] },
            say: [
              'I put them in one at a time. Red. Blue. Gold. Green. White.',
              'The last one clicks in, and the whole room lights up!',
              'Out across the water, all the festival lanterns light up too!',
              'We did it! Pearlina is going to be SO happy!',
            ],
            takeItems: ['pearl-ruby', 'pearl-ocean', 'pearl-sun', 'pearl-garden', 'pearl-moon'],
            setFlags: ['finished'],
            notebook: ['the-end'],
            resolveWonder: ['find-five'],
            sound: 'discover',
          },
          'pearl-ocean': {
            requires: { items: ['pearl-ruby', 'pearl-ocean', 'pearl-sun', 'pearl-garden', 'pearl-moon'] },
            say: [
              'I put them in one at a time. Red. Blue. Gold. Green. White.',
              'The last one clicks in, and the whole room lights up!',
              'Out across the water, all the festival lanterns light up too!',
              'We did it! Pearlina is going to be SO happy!',
            ],
            takeItems: ['pearl-ruby', 'pearl-ocean', 'pearl-sun', 'pearl-garden', 'pearl-moon'],
            setFlags: ['finished'],
            notebook: ['the-end'],
            resolveWonder: ['find-five'],
            sound: 'discover',
          },
          'pearl-sun': {
            requires: { items: ['pearl-ruby', 'pearl-ocean', 'pearl-sun', 'pearl-garden', 'pearl-moon'] },
            say: [
              'I put them in one at a time. Red. Blue. Gold. Green. White.',
              'The last one clicks in, and the whole room lights up!',
              'Out across the water, all the festival lanterns light up too!',
              'We did it! Pearlina is going to be SO happy!',
            ],
            takeItems: ['pearl-ruby', 'pearl-ocean', 'pearl-sun', 'pearl-garden', 'pearl-moon'],
            setFlags: ['finished'],
            notebook: ['the-end'],
            resolveWonder: ['find-five'],
            sound: 'discover',
          },
          'pearl-garden': {
            requires: { items: ['pearl-ruby', 'pearl-ocean', 'pearl-sun', 'pearl-garden', 'pearl-moon'] },
            say: [
              'I put them in one at a time. Red. Blue. Gold. Green. White.',
              'The last one clicks in, and the whole room lights up!',
              'Out across the water, all the festival lanterns light up too!',
              'We did it! Pearlina is going to be SO happy!',
            ],
            takeItems: ['pearl-ruby', 'pearl-ocean', 'pearl-sun', 'pearl-garden', 'pearl-moon'],
            setFlags: ['finished'],
            notebook: ['the-end'],
            resolveWonder: ['find-five'],
            sound: 'discover',
          },
          'pearl-moon': {
            requires: { items: ['pearl-ruby', 'pearl-ocean', 'pearl-sun', 'pearl-garden', 'pearl-moon'] },
            say: [
              'I put them in one at a time. Red. Blue. Gold. Green. White.',
              'The last one clicks in, and the whole room lights up!',
              'Out across the water, all the festival lanterns light up too!',
              'We did it! Pearlina is going to be SO happy!',
            ],
            takeItems: ['pearl-ruby', 'pearl-ocean', 'pearl-sun', 'pearl-garden', 'pearl-moon'],
            setFlags: ['finished'],
            notebook: ['the-end'],
            resolveWonder: ['find-five'],
            sound: 'discover',
          },
        },
        refuse: ['I need all five pearls first!'],
        repeat: ['Five empty spots. I need all five pearls!'],
      },
      {
        id: 'mc-shell-done', label: 'The Moon Shell', kind: 'decorative', cursor: 'look',
        requires: { flags: ['finished'] },
        x: 0.440, y: 0.400, w: 0.200, h: 0.200,
        onClick: { say: ['All five pearls, back where they belong!'] },
        repeat: ['I could look at this all night!'],
      },
    ],
    onEnter: { say: ['The real Moon Shell, under the real moon!', 'Five spots, still empty.'] },
    exits: [
      { id: 'to-festival', label: 'The Festival', to: 'moonlight-festival', dir: 'out', x: 0.000, y: 0.275, w: 0.115, h: 0.370 },
    ],
  },
];

export const sceneById = (id: string) => SCENES.find((s) => s.id === id);

export const NOTEBOOK: NotebookEntry[] = [
  {
    id: 'moon-pearls',
    title: 'The Moon Pearls',
    lines: [
      'All five pearls are missing from the Moon Shell.',
      'Pearlina put them in her blue pouch last night.',
      'Somebody was carrying the pouch for her.',
    ],
  },
  {
    id: 'gus-carried',
    title: 'Gus Had the Pouch',
    lines: [
      'Gus wrote down where he put the blue pouch.',
      'He can\u2019t read his list without his glasses.',
    ],
  },
  {
    id: 'the-shell',
    title: "Gus's Old Shell",
    lines: [
      'His glasses were stuck inside his old shell.',
      'The shell opener was in the anemone.',
    ],
  },
  {
    id: 'blue-pouch',
    title: 'It Was the Blue One',
    lines: [
      'Gus remembers now! It was the BLUE pouch.',
      'He took it to the Festival Grounds and put it down.',
    ],
  },
  { id: 'gus-at-market', title: 'The Twins Saw Him', lines: [
    'Coco and Bibi saw Gus at the market.',
    'He swam off to the Festival Grounds.'] },
  { id: 'pip-tip', title: 'Pip Was Watching', lines: [
    'Pip saw Gus put something down by the crates.',
    'Then a big swoosh of water came by.'] },
  { id: 'pouch-empty', title: 'The Pouch Is Empty', lines: [
    'The blue pouch was behind the crates.',
    'It\u2019s empty, but it\u2019s still tied SHUT!',
    'So how did the pearls get out?'] },
  { id: 'the-gate', title: 'The Reef Gate', lines: [
    'The reef gate is stuck shut.',
    'Marina can fix it. She needs her wrench.'] },
  { id: 'the-wrench', title: "Marina's Wrench", lines: [
    'Marina\u2019s wrench broke in two.',
    'One half is the handle. The other half is the head.'] },
  { id: 'the-wrench-head', title: 'Bubbles Dropped It', lines: [
    'Bubbles dropped the wrench head over the edge.',
    'It landed on the first ledge.'] },
  { id: 'gate-opened', title: 'The Gate Is Open', lines: [
    'Marina fixed the gate!',
    'Now I can get to the Pearl Reef.'] },
  { id: 'the-current', title: 'Professor Bubble', lines: [
    'He has watched the water here for nine years.',
    'It never does the same thing twice.'] },
  { id: 'mr-sable', title: 'Mr Sable', lines: [
    'An eel at the Ancient Reef. Very polite.',
    'He wants me to find the pearls too.'] },
  { id: 'the-seam', title: 'Nobody Took Them', lines: [
    'The pouch had a hole in the bottom!',
    'The pearls fell out, and the water carried them away.',
    'Professor Bubble gave me his map.'] },
  { id: 'all-five', title: 'All Five', lines: [
    'Red, Blue, Gold, Green, and White.',
    'The water carried each one to a quiet place.'] },
  { id: 'the-end', title: 'The Festival', lines: [
    'I put all five pearls back in the Moon Shell!',
    'Then all the lanterns lit up!'] },
  { id: 'the-key', title: 'The Captain\u2019s Key', lines: [
    'I oiled the stuck drawer in the captain\u2019s cabin.',
    'There was a fancy key inside!'] },
  { id: 'the-sample', title: 'The Glowing Water', lines: [
    'I filled the jar with glowing water from the pool.',
    'It keeps glowing, even in the jar!'] },
  { id: 'the-sample-answer', title: 'For Science', lines: [
    'I gave the glowing water to Professor Bubble.',
    'He was SO happy!'] },
  { id: 'the-banner', title: 'The Banner', lines: [
    'I found the festival banner behind a crate.',
    'Foreman Dug hung it over the stage!'] },
];

export const notebookById = (id: string) => NOTEBOOK.find((n) => n.id === id);

export const WONDERS: Wonder[] = [
  {
    id: 'where-pearls',
    question: 'Where did the Moon Pearls go?',
    hints: [
      'Somebody in the plaza saw them last. Try asking around!',
      'Pearlina put the pearls in a pouch. Ask her who she gave it to.',
      'Talk to Pearlina. Then find Gus in the Coral Gardens.',
    ],
  },
  {
    id: 'which-pouch',
    question: 'Where did Gus put the blue pouch?',
    hints: [
      'Gus wrote it down, but he can\u2019t read his own list.',
      'Gus can\u2019t see very well. Something of his is missing!',
      'Get Gus\u2019s glasses out of his old shell, then give them to him.',
    ],
  },
  {
    id: 'gus-specs',
    question: 'How do I get Gus\u2019s glasses?',
    hints: [
      'Gus told you where his glasses are. Talk to him again!',
      'His old shell is stuck shut. He used to have a tool to open it.',
      'The shell opener is in the anemone in the Coral Gardens. Use it on the old shell.',
    ],
  },
  {
    id: 'where-dropped',
    question: 'Where did Gus put the blue pouch down?',
    hints: [
      'He said he took it to the Festival Grounds.',
      'Somebody at the Festival Grounds was watching him.',
      'Look behind the stacked crates at the Festival Grounds. They sparkle!',
    ],
  },
  { id: 'who-emptied', question: 'How did the pearls get out of a pouch that\u2019s tied shut?',
    hints: [
      'Nobody untied it. Look at the pouch very closely.',
      'Somebody smart knows all about how water moves. He lives in the Deep Cave.',
      'Take the blue pouch to Professor Bubble in the Deep Cave and give it to him.'] },
  { id: 'fix-the-gate', question: 'How do I get the reef gate open?',
    hints: [
      'Marina can fix it, but she needs her wrench. It broke in two!',
      'Foreman Dug knows about the gate. Captain Barnacle knows about the wrench. Bubbles saw a piece fall!',
      'Talk to Dug, then Captain Barnacle. Find the handle under the boat at the Docks. Talk to Bubbles, then use the seaweed rope on the first ledge. Put the two halves together and give the wrench to Marina.'] },
  { id: 'find-five', question: 'Where did the water take the pearls?',
    hints: [
      'Open the map in your pouch. It shows where the water slows down.',
      'Five quiet places: a flowerbed, an old clay pot, the altar in the shrine, the sand by the old ship, and a shut chest.',
      'You need the lantern from the tunnel for the clay pot, and the crowbar from the ship for the chest.'] },
];

export const wonderById = (id: string) => WONDERS.find((w) => w.id === id);

type StepWorld = { flags: string[]; inventory: string[] };
const f = (w: StepWorld, ...ids: string[]) => ids.some((id) => w.flags.includes(id));
const has = (w: StepWorld, id: string) => w.inventory.includes(id);

export const NEXT_STEPS: { done: (w: StepWorld) => boolean; hint: string; say: string }[] = [
  { done: (w) => f(w, 'met-pearlina'), hint: 'Talk to Pearlina. She\u2019s right here by the Moon Shell!', say: '' },
  { done: (w) => f(w, 'knows-gus'), hint: 'Talk to Pearlina again. Ask who she gave the pouch to.', say: 'I should ask Pearlina who had the pouch!' },
  { done: (w) => f(w, 'met-gus'), hint: 'Swim to the Coral Gardens and talk to Gus.', say: 'Gus is in the Coral Gardens. Let\u2019s go find him!' },
  { done: (w) => f(w, 'knows-shell'), hint: 'Talk to Gus again. Ask where his glasses are.', say: 'I should ask Gus where his glasses are!' },
  { done: (w) => f(w, 'got-tool', 'opened-shell'), hint: 'The shell opener is hiding in the anemone in the Coral Gardens. Click the anemone!', say: 'Gus\u2019s shell opener must be around here. Maybe in that anemone?' },
  { done: (w) => f(w, 'opened-shell'), hint: 'Open your pouch, click the Shell Opener, then click Gus\u2019s old shell.', say: 'Now I can open Gus\u2019s old shell with the Shell Opener!' },
  { done: (w) => f(w, 'gus-remembers'), hint: 'Open your pouch, click Gus\u2019s Glasses, then click Gus to give them to him.', say: 'I should give Gus his glasses!' },
  { done: (w) => f(w, 'pip-saw-crates', 'found-pouch'), hint: 'Gus took the blue pouch to the Festival Grounds. Go there through Bubble Bay.', say: 'The pouch is at the Festival Grounds. Let\u2019s go look!' },
  { done: (w) => f(w, 'found-pouch'), hint: 'Look behind the stacked crates at the Festival Grounds. They sparkle.', say: 'Those sparkly crates look interesting!' },
  { done: (w) => f(w, 'knows-current'), hint: 'Take the Blue Pouch to Professor Bubble in the Deep Cave. Click the pouch, then click him.', say: 'Professor Bubble in the Deep Cave knows lots of things. Let\u2019s show him the pouch!' },
  { done: (w) => has(w, 'pearl-garden') || f(w, 'got-pearl-garden'), hint: 'Open the map in your pouch. The first pearl is in the Flower Garden!', say: 'The map says the first pearl is in the Flower Garden. Let\u2019s go!' },
  { done: (w) => has(w, 'lantern') || f(w, 'got-pearl-ruby'), hint: 'The next pearl is in a dark clay pot in the Hidden Grotto. You need a light! There\u2019s a lantern in the Abandoned Tunnel.', say: 'The next pearl is in the Hidden Grotto, but it\u2019s dark there. I need a light! I saw a lantern in the tunnel.' },
  { done: (w) => f(w, 'got-pearl-ruby'), hint: 'Go to the Hidden Grotto. Click the Lantern, then click the old clay pot.', say: 'Let\u2019s take the lantern to the clay pot in the Hidden Grotto!' },
  { done: (w) => f(w, 'knows-gate-job', 'gate-open'), hint: 'The other pearls are past the reef gate, but it\u2019s stuck. Talk to Foreman Dug at the Festival Grounds.', say: 'The other pearls are past the reef gate, and it\u2019s stuck! Foreman Dug at the Festival Grounds can help.' },
  { done: (w) => f(w, 'knows-wrench-halves', 'gate-open'), hint: 'Marina needs her wrench to fix the gate. Ask Captain Barnacle at the Docks.', say: 'Captain Barnacle at the Docks might know where Marina\u2019s wrench went!' },
  { done: (w) => f(w, 'got-handle', 'gate-open'), hint: 'Look under the boat at the Docks.', say: 'I should look under the boat at the Docks!' },
  { done: (w) => f(w, 'bubbles-dropped-head', 'gate-open'), hint: 'Ask Bubbles at the Trench Edge about the other half of the wrench.', say: 'Bubbles at the Trench Edge saw the other half fall. Let\u2019s ask!' },
  { done: (w) => has(w, 'seaweed-rope') || f(w, 'got-head', 'gate-open'), hint: 'You need a rope to reach the ledge. There\u2019s seaweed rope in the Kelp Forest.', say: 'I need a rope to reach that ledge. The seaweed in the Kelp Forest would work!' },
  { done: (w) => f(w, 'got-head', 'gate-open'), hint: 'At the Trench Edge, click the Seaweed Rope, then click the first ledge.', say: 'Now I can use the rope to get down to the ledge!' },
  { done: (w) => has(w, 'wrench-fixed') || f(w, 'gate-open'), hint: 'Open your pouch and put the two wrench halves together. Click one, then the other.', say: 'I should put the two halves of the wrench together!' },
  { done: (w) => f(w, 'gate-open'), hint: 'Give Marina her wrench at Marina\u2019s Repair Shop. Click the wrench, then click her.', say: 'Let\u2019s take the wrench to Marina!' },
  { done: (w) => f(w, 'got-pearl-moon'), hint: 'The reef gate is open! Swim to the Pearl Shrine and look at the altar.', say: 'The gate is open! The map says a pearl is in the Pearl Shrine.' },
  { done: (w) => f(w, 'got-pearl-ocean'), hint: 'The next pearl is in the sand by the Sunken Ship.', say: 'The map says a pearl is in the sand by the Sunken Ship!' },
  { done: (w) => has(w, 'crowbar') || f(w, 'got-pearl-sun'), hint: 'The last pearl is in a shut chest in the ship\u2019s Treasure Room. Find something to open it in the Cargo Hold.', say: 'The last pearl is in a shut chest in the ship. I need something to open it!' },
  { done: (w) => f(w, 'got-pearl-sun'), hint: 'Go to the Treasure Room. Click the Crowbar, then click the shut chest.', say: 'That crowbar can open the chest in the Treasure Room!' },
  { done: (w) => f(w, 'finished'), hint: 'You have all five pearls! Swim through the Captain\u2019s Cabin to Moonlight Island and click the Moon Shell.', say: 'I have all five pearls! Let\u2019s take them to the Moon Shell on Moonlight Island!' },
];

export const SEA_STARS_PLACED = 3;
