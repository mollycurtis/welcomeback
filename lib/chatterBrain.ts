type Intent =
  | 'bye' | 'love' | 'sorry' | 'thanks' | 'insult' | 'greet' | 'howru' | 'wyd' | 'where' | 'confused'
  | 'act' | 'place' | 'food' | 'pets' | 'sad' | 'happy' | 'people' | 'games' | 'school' | 'laugh'
  | 'yes' | 'no' | 'question' | 'other' | 'fine' | 'nothing' | 'whereis';

type Pool = Partial<Record<Intent, string[]>>;

const RULES: [Intent, RegExp][] = [
  ['bye', /\b(bye+|bai|gtg|g2g|got ?to go|gotta go|cya|see ya|see you|ttyl|good ?night|gn|nite)\b/],
  ['love', /\b(love|luv|ily|miss)\b/],
  ['sorry', /\b(sorry|sry|srry|my bad)\b/],
  ['thanks', /\b(thanks|thank you|thank u|thx|ty)\b/],
  ['insult', /\b(bish|stupid|dumb|ugly|loser|shut ?up|idiot|weirdo|poop|hate you|hate u|annoying)\b/],
  ['howru', /(how (are|r) (you|u)|how u doin|hows it going|how is it going|\bwbu\b|\bhbu\b|and you\b|how r things)/],
  ['wyd', /(\bwyd\b|wat r u doin|what (are|r) (you|u) doing|what u doing|whatcha doing|watcha doing|what (are|r) (you|u) up to|wut r u doin)/],
  ['where', /\bwhere (are|r) (you|u)\b/],
  ['whereis', /\bwhere(s|'s| is| did| does)\b/],
  ['confused', /^(huh|what|wat|wut|wdym|what do you mean|hm+|um+|uh+|\?+)[.!? ]*$/],
];

const LATE: [Intent, RegExp][] = [
  ['food', /\b(hungry|hungwy|starving|food|eat|eating|ate|snack|pizza|dinner|lunch|breakfast|candy|ice ?cream|cookies?|cake|gushers|mac and cheese)\b/],
  ['pets', /\b(tucker|dog|doggy|puppy|cat|kitty|pets?)\b/],
  ['sad', /\b(sad|bored|boring|tired|sick|mad|angry|scared|hurt|crying|cry|lonely|upset|grumpy)\b/],
  ['happy', /\b(happy|excited|yay|awesome|cool|fun|great|amazing|best)\b/],
  ['people', /\b(mom|mommy|mama|dad|daddy|sarah|maddie|grandma|grandpa|sister|aunt|uncle)\b/],
  ['games', /\b(yourworld|webkinz|game|games|computer|maple ?grove|ifind|finn|petville|penguin|pinball|minefield|solitaire)\b/],
  ['school', /\b(school|homework|teacher|class|recess|summer|test)\b/],
  ['laugh', /\b(lol|lmao|rofl|haha+|hehe+|jk|lolol)\b/],
  ['yes', /^(yes+|yeah|yea|ya|yep|yup|ok|okay|k|kk|sure|uh huh|mhm|totally)[.! ]*$/],
  ['no', /^(no+|nope|nah|naw|not really|nuh uh)[.! ]*$/],
];

const GREET = /^(hi+|hey+|hello|hiya|sup|yo|wassup|whats up|what's up|howdy|heyo|hai)\b/;
const NOT_ACT = new Set(['thing', 'nothing', 'something', 'anything', 'everything', 'morning', 'evening', 'king', 'ring', 'wing', 'spring', 'sing', 'bring', 'string']);
const ACT = /\b(?:i went|went|i was|was|im|i'm|i am|we went|we were|been|go)\s+([a-z]{4,}ing)\b/;
const LONE = /^([a-z]{4,}ing)[.!? ]*$/;
const PLACE = /\b(?:i went|went|we went|im at|i'm at|i am at|going) (?:to )?the ([a-z]+)\b/;
const ASK = /(\?$|^(can|could|will|would|do|does|did|is|are|r|what|why|when|who|how|should|wanna|want to)\b)/;

const POOLS: Record<string, Pool> = {
  maddie: {
    greet: ['HI. finally. where were u', 'hiii!!', 'heyyy whats up'],
    bye: ['nooo dont leave', 'ok bye!! talk tmrw', 'byeee'],
    love: ['aww luv u too', 'ur my best friend', 'miss u too!! come over'],
    sorry: ['its ok', 'lol its fine'],
    thanks: ['ur welcome!!', 'np'],
    insult: ['rude!!', 'um ok rude', 'im telling ur mom lol'],
    howru: ['good!! wbu', 'bored. wbu'],
    wyd: ['on yourworld duh', 'eating gushers and on yourworld', 'nothin. wyd'],
    where: ['at home. where r u', 'in my room'],
    confused: ['lol nvm', 'never mind', 'ur so random lol'],
    act: ['{act}?? without me??', '{act}! where??', 'omg i love {act}. next time invite me'],
    place: ['omg the {place}! was it fun', 'the {place}?? without me??'],
    food: ['im eating gushers rn', 'now i want pizza', 'food is the best'],
    pets: ['tucker says hi!!', 'tucker licked my face like 100 times today', 'u guys can dog sit tucker again soon!'],
    sad: ['awww', 'want to come over?', 'thats so sad. i would give u a hug'],
    happy: ['yayyy', 'thats so cool', 'omg yay'],
    people: ['say hi to ur mom for me', 'is sarah being mean again lol', 'ur family is so funny'],
    games: ['get on yourworld!!', 'meet me in the pet park on yourworld', 'have u played maple grove yet'],
    school: ['dont talk about school its summer', 'i miss recess', 'i hope we get the same teacher next year'],
    laugh: ['lol', 'LOL', 'hahaha ur so funny'],
    yes: ['yay!!', 'ok cool', 'k'],
    no: ['awww why', 'ok fine', 'ur no fun lol'],
    question: ['idk', 'maybe', 'hmm idk ask ur mom'],
    other: ['ok wait what', 'lol ok', 'cool', 'omg same', 'wait really?'],
    fine: ['yay', 'good!!', 'same'],
    nothing: ['same lol', 'boring lol. get on yourworld'],
    whereis: ['idk lol', 'no idea. ask ur mom'],
  },
  sarah: {
    greet: ['hey', 'hiii', 'hey whats up'],
    bye: ['bye!', 'byeee', 'k bye'],
    love: ['aw love u too', 'love u too dork', 'ok fine love u too'],
    sorry: ['its ok', 'its fine dont worry'],
    thanks: ['ur welcome!', 'np'],
    insult: ['wow rude', 'hey thats mean', 'im telling mom lol'],
    howru: ['good! wbu', 'busy but good'],
    wyd: ['on the phone w amber', 'doing my nails', 'homework ugh'],
    where: ['in my room', 'the next room lol'],
    confused: ['nvm lol', 'never mind'],
    act: ['{act}? fun!', 'ooh {act}', 'u went {act}? without me?'],
    place: ['u went to the {place}? fun', 'the {place}! cool'],
    food: ['theres pizza rolls in the freezer', 'save me some', 'make me a snack too lol'],
    pets: ['when r we dog sitting tucker again', 'tucker ate my sock last time we dog sat him'],
    sad: ['aw whats wrong?', 'want me to get mom?', 'want to watch a movie later?'],
    happy: ['yay good', 'nice!'],
    people: ['mom is downstairs', 'dad is in the garage again', 'tell mom i said hi lol'],
    games: ['ur so good at that game', 'can i use the computer after u?', 'ok but dont stay on too long'],
    school: ['its summer! no school talk', 'middle school is fun u will see'],
    laugh: ['lol', 'haha ok that was funny'],
    yes: ['k', 'ok'],
    no: ['ok', 'no worries'],
    question: ['idk ask mom', 'hmm idk'],
    other: ['lol ok', 'haha', 'wait what', 'cool'],
    fine: ['yay', 'cool'],
    nothing: ['same lol', 'k'],
    whereis: ['hmm check the kitchen', 'idk lol'],
  },
  mom: {
    greet: ['hi honey. did you eat', 'hi sweetie!', 'hi honey'],
    bye: ['bye honey. love you', 'ok sweetie. off the computer soon'],
    love: ['love you more', 'i love you too honey', 'miss you too sweetie. im just downstairs'],
    sorry: ['thank you for saying sorry', 'its ok honey'],
    thanks: ['youre welcome sweetie', 'anytime honey'],
    insult: ['we dont talk like that', 'be nice please'],
    howru: ['im good honey. how are you', 'busy but good!'],
    wyd: ['making dinner', 'folding laundry. want to help?', 'on the phone with grandma'],
    where: ['in the kitchen', 'downstairs'],
    confused: ['never mind honey', 'ill tell you later'],
    act: ['{act}? that sounds fun honey', 'did you have fun {act}?', 'be careful {act}, ok?'],
    place: ['the {place}? fun! who did you go with', 'did you have fun at the {place}?'],
    food: ['im making dinner. come set the table', 'you can have a snack but just one', 'dinner is at 6'],
    pets: ['is maddie bringing tucker over again?', 'we can dog sit tucker again sometime'],
    sad: ['oh no honey. come give me a hug', 'whats wrong sweetie', 'do you want to talk about it'],
    happy: ['thats great honey!', 'yay! im proud of you'],
    people: ['your sister is on the phone', 'dad is in the garage', 'grandma called today'],
    games: ['30 more minutes on the computer ok?', 'dont stay on too long honey'],
    school: ['school starts in august', 'did you finish your summer reading'],
    laugh: ['haha you are so silly', 'lol. i know what that means now'],
    yes: ['ok sweetie', 'good'],
    no: ['ok honey', 'are you sure'],
    question: ['ask me after dinner', 'maybe honey', 'we will see'],
    other: ['ok sweetie', 'thats nice honey', 'ok honey'],
    fine: ['good honey', 'glad to hear it sweetie'],
    nothing: ['then come help me set the table', 'ok honey'],
    whereis: ['did you check your room honey', 'look in the kitchen'],
  },
  dad: {
    greet: ['hey kiddo!', 'hey kiddo. arent you supposed to be doing something', 'well hello there'],
    bye: ['later kiddo', 'see ya later alligator'],
    love: ['love you kid', 'miss you too kiddo. im just in the garage haha'],
    sorry: ['its ok kiddo', 'apology accepted'],
    thanks: ['anytime kiddo', 'youre welcome. that will be one hug'],
    insult: ['hey now. be nice', 'watch it kiddo haha'],
    howru: ['im great. fixing the lawn mower', 'doing good kiddo. you?'],
    wyd: ['fixing the lawn mower. want to help?', 'watching the race', 'looking for my keys. again'],
    where: ['in the garage', 'on the couch'],
    confused: ['never mind kiddo haha', 'the lawn mower. it makes the grass short', 'just come to the garage haha'],
    act: ['{act}? nice! did you have fun?', '{act}! thats my kid', '{act}? i used to love {act}'],
    place: ['the {place}? fun! who did you go with', 'the {place}! did you bring me anything'],
    food: ['ask your mother what is for dinner', 'grilling burgers tonight', 'dont tell mom but there are cookies in the garage'],
    pets: ['maddies dog? that dog loves my garage', 'we can dog sit tucker again if maddies mom asks'],
    sad: ['aw kiddo. want to go get ice cream later?', 'come here and tell me about it', 'thats no fun. want to play farkle after dinner?'],
    happy: ['thats my kid!', 'awesome!'],
    people: ['your mom is the boss', 'is your sister being nice', 'say hi to grandma for me'],
    games: ['farkle after dinner?', 'get off the computer and go outside kiddo', 'who is winning?'],
    school: ['school is out! go play outside', 'no homework in summer. thats the rule'],
    laugh: ['whats so funny', 'haha good one'],
    yes: ['great!', 'ok then'],
    no: ['hmm ok', 'no? ok kiddo'],
    question: ['did you ask your mother', 'maybe. we will see', 'ask me at dinner'],
    other: ['uh huh', 'sounds good kiddo', 'haha ok', 'one sec'],
    fine: ['glad to hear it kiddo', 'great!'],
    nothing: ['then come help me in the garage haha', 'sounds relaxing kiddo'],
    whereis: ['ask your mother haha', 'probably in the garage'],
  },
  grandma: {
    greet: ['Hello sweetheart. Is this thing working? I cannot tell.', 'Hi honey! Grandma is here.', 'Hello dear!'],
    bye: ['Goodbye sweetheart! Grandma loves you.', 'Bye bye, honey. Be good for your mom.'],
    love: ['I love you too, sweetheart!', 'Grandma misses you so much. Come visit soon!'],
    sorry: ['That is all right, dear.', 'No need to be sorry, honey.'],
    thanks: ['You are very welcome, sweetheart.', 'Anything for you, dear.'],
    insult: ['Oh my! Be nice, dear.', 'Where did you learn that word?'],
    howru: ['I am doing just fine, dear. How are you?', 'My knees are a little sore, but I am happy!'],
    wyd: ['I am baking cookies!', 'Watching my shows.', 'Trying to figure out this computer.'],
    where: ['At home, in my chair.', 'In the kitchen, dear.'],
    confused: ['Oh, never mind, dear.', 'Grandma is a little confused too!'],
    act: ['{Act}! How fun!', '{Act}? When I was your age I loved {act}.', 'Be careful {act}, sweetheart!'],
    place: ['The {place}! How fun, dear.', 'Did you have a nice time at the {place}?'],
    food: ['I will make you cookies when you visit.', 'Are you eating your vegetables?'],
    pets: ['Tucker is Maddie\u2019s dog, right? Such a sweet boy.', 'Do you still help take care of Tucker?'],
    sad: ['Oh, sweetheart. Grandma is sending you a big hug.', 'Do you want me to call your mother?'],
    happy: ['How wonderful!', 'That makes Grandma so happy!'],
    people: ['Tell your mother I said hello.', 'Your grandfather says hello. He will not type.', 'Is your sister being nice to you?'],
    games: ['I do not understand these computer games, dear.', 'Do not stay on the computer too long. It is bad for your eyes.'],
    school: ['Are you reading any good books this summer?', 'Grandma always loved school.'],
    laugh: ['What does LOL mean? Lots of love?', 'Ha ha!'],
    yes: ['Good!', 'Wonderful, dear.'],
    no: ['Oh, all right.', 'Hmm, okay dear.'],
    question: ['You will have to ask your mother, dear.', 'I do not know, sweetheart. Ask Grandpa?'],
    other: ['How about that!', 'Oh my!', 'Hold on. Your aunt is showing me something.', 'That is nice, dear.'],
    fine: ['Good! That makes Grandma happy.', 'Wonderful, dear.'],
    nothing: ['Nothing? Then come visit Grandma!', 'That is all right, dear.'],
    whereis: ['Oh, I do not know, dear.', 'Did you check the kitchen?'],
  },
};

type Answer = 'yes' | 'no' | 'why' | 'fine' | 'nothing';
type Follow = { q: RegExp } & Partial<Record<Answer | Intent, string[]>>;

const FOLLOW: Record<string, Follow[]> = {
  maddie: [
    { q: /r u on yourworld/, yes: ['yay!! meet me at the pet park', 'ok im on!! where r u'], no: ['get on!! pleaseee', 'awww ok. get on when u can'], why: ['bc its fun duh', 'bc i want to play with u'], greet: ['hiii!! r u getting on yourworld?'], nothing: ['then get on yourworld!!'], other: ['so r u getting on or not lol'] },
    { q: /pet park|r u getting on|im on!!|where r u/, whereis: ['on yourworld!! by the fountain', 'its by the fountain. hurry'], where: ['at the pet park on yourworld', 'by the fountain!!'], yes: ['yay!!', 'ok see u there'], no: ['awww ok', 'ok fine lol'] },
    { q: /where were u/, nothing: ['lol ok well ur here now'], other: ['oh ok', 'lol ok'] },
    { q: /whats up|wyd/, nothing: ['same lol', 'boring lol. get on yourworld'] },
    { q: /want to come over/, yes: ['yay!! ask ur mom', 'omg yes. ask ur mom first'], no: ['awww ok', 'ok maybe tmrw'], why: ['bc im bored lol'] },
    { q: /was it fun/, yes: ['im so jealous', 'next time bring me!!'], no: ['aw that stinks', 'oh no what happened'] },
    { q: /have u played maple grove/, yes: ['isnt it so fun', 'my resident has a horse lol'], no: ['play it!! its so fun', 'u have to try it'] },
    { q: /awww why/, other: ['oh ok', 'ok fine lol'] },
  ],
  sarah: [
    { q: /almost done on the computer/, yes: ['ok good thx!', 'yay thank u!!', 'ok thx'], no: ['ok but pls hurry', 'ok just let me know when', 'aw ok. hurry pls'], why: ['i have a project due', 'i have to finish my project'], greet: ['hi! r u almost done on the computer?'], nothing: ['ok just let me know when ur done'], other: ['lol ok but r u almost done?', 'ok but i need it soon pls'] },
    { q: /thx|thank u|hurry|let me know when|project/, why: ['i have a project due tmrw', 'its for science class'], question: ['its for my science project', 'bc my project is due tmrw'], yes: ['thx!!', 'ok cool'], no: ['ok just hurry pls'], other: ['ok lol'] },
    { q: /can i use the computer after u/, yes: ['yay thx', 'ok thank u'], no: ['aw ok', 'ok later then'], why: ['i have a project due'] },
    { q: /want me to get mom/, yes: ['MOM!! come here', 'ok hold on'], no: ['ok. feel better', 'ok. im here if u need me'] },
    { q: /whats wrong/, other: ['oh no. im sorry', 'aw that stinks. want me to get mom?'], nothing: ['ok. im here if u want to talk'] },
    { q: /watch a movie/, yes: ['yay ok after dinner', 'ok u pick'], no: ['ok maybe tmrw'] },
    { q: /without me/, yes: ['no fair lol', 'next time take me'], no: ['ok good lol'] },
  ],
  mom: [
    { q: /did you eat/, food: ['yum. put your dish in the sink please', 'good. dinner is at 6 tho'], yes: ['good. put your dish in the sink please', 'good honey'], no: ['there are leftovers in the fridge', 'go make a sandwich honey'] },
    { q: /want to help/, yes: ['thank you honey! come downstairs', 'yay. thank you sweetie'], no: ['ok but you are folding your own clothes', 'ok honey'] },
    { q: /did you have fun/, yes: ['im so glad honey', 'good!'], no: ['oh no. what happened', 'aw honey'] },
    { q: /who did you go with/, other: ['that sounds fun honey', 'oh good'] },
    { q: /whats wrong/, other: ['oh honey. come give me a hug', 'im sorry sweetie. want to talk about it?'], nothing: ['ok honey. im here if you need me'] },
    { q: /want to talk about it/, yes: ['ok honey. come downstairs', 'im listening sweetie'], no: ['ok honey. im here if you need me', 'ok. love you'] },
    { q: /summer reading/, yes: ['good job honey!', 'im proud of you'], no: ['please do it after the computer', 'ok. before bed then'] },
    { q: /bringing tucker over/, yes: ['ok but no dogs on the couch', 'ok honey'], no: ['ok. i like that dog', 'ok sweetie'] },
    { q: /are you sure/, yes: ['ok honey', 'ok sweetie'], no: ['ok then. let me know'] },
  ],
  dad: [
    { q: /want to help/, yes: ['great! grab the wrench', 'come out to the garage!'], no: ['ok kiddo. your loss haha', 'suit yourself'] },
    { q: /farkle/, yes: ['its a deal. im gonna win', 'ok! get ready to lose haha'], no: ['aw ok kiddo', 'maybe tomorrow then'] },
    { q: /ice cream later/, yes: ['deal! after dinner', 'ok kiddo. after dinner'], no: ['more for me haha', 'ok kiddo'] },
    { q: /supposed to be doing something/, yes: ['then go do it haha', 'thought so'], no: ['ok then haha', 'if you say so kiddo'], nothing: ['ok then haha'] },
    { q: /sister being nice/, yes: ['good', 'thats a first haha'], no: ['want me to talk to her?', 'ill talk to her kiddo'] },
    { q: /ask your mother/, yes: ['then its ok with me', 'and what did she say haha'], no: ['go ask her first kiddo', 'ask her first'] },
    { q: /who is winning/, other: ['haha nice', 'keep going kiddo'] },
    { q: /bring me anything/, yes: ['thats my kid!', 'yay'], no: ['aw man haha', 'next time kiddo'] },
    { q: /did you have fun/, yes: ['thats my kid!', 'awesome'], no: ['aw. next time will be better'] },
  ],
  grandma: [
    { q: /is this thing working/, yes: ['Oh good! Grandma figured it out!', 'Wonderful! Grandpa said I could not do it.'], no: ['Oh dear. Then how are you reading this?'], other: ['Oh good, it works!'] },
    { q: /vegetables/, yes: ['Good! You will grow big and strong.', 'That is my grandchild!'], no: ['Eat your vegetables, dear!', 'Oh dear. At least the carrots?'] },
    { q: /nice time/, yes: ['Oh, I am so glad!', 'Wonderful!'], no: ['Oh no. Next time will be better, dear.'] },
    { q: /call your mother/, yes: ['All right, dear. I am calling her now.', 'Okay. Grandma is calling her.'], no: ['All right. Grandma loves you.', 'Okay, dear.'] },
    { q: /good books/, yes: ['Wonderful! Tell Grandma all about it.', 'Good! Reading is so important.'], no: ['You should, dear. Grandma will send you one.'] },
    { q: /lots of love/, yes: ['Lots of love to you too!'], no: ['Oh! Then what does it mean?'], other: ['How about that! Grandma learned something.'] },
    { q: /sister being nice/, yes: ['Good! You two should be friends.'], no: ['I will talk to her, dear.'] },
    { q: /take care of tucker/, yes: ['Good! Dogs need lots of love.'], no: ['That is all right, dear.'] },
    { q: /maddie.s dog, right/, yes: ['I thought so! Give him a pat for me.'], no: ['Oh, Grandma gets mixed up.'] },
  ],
};

const NAMES: Record<string, RegExp> = {
  maddie: /\b(maddie|mads|madz|maddie_bug53353)\b/g,
  sarah: /\b(sarah|sar|sis|xxsarahxx97)\b/g,
  mom: /\b(mom|mommy|mama|mother)\b/g,
  dad: /\b(dad|daddy|father)\b/g,
  grandma: /\b(grandma|gma|grams|granny|nana)\b/g,
};

const LEAD = /^(hi+|hey+|hello|hiya|yo|heyo|hai|sup)\b[!,.\s]*/;
const YES = /^(yes+|yeah+|yea|ya|yep|yup|ok+|okay|k+|sure|mhm|uh huh|totally|of course|obviously|duh|definitely|almost|nearly|basically|kinda|i guess|i think so|soon|((i'?m|i am) )?(almost |nearly |basically |all )?done|in a (sec|second|min|minute|bit)|\d+ ?(more )?(min|mins|minute|minutes|sec|secs|seconds)|(two|five|ten|one) (more )?(min|mins|minute|minutes|sec|second|game|round))\b/;
const NO = /^(no+|nope|nah|naw|not yet|not really|nuh uh|later|never|no way|i (dont|don't) think so|not now|not right now|not today|maybe later|maybe tomorrow|i (cant|can't)|cant|can't|im busy|i'm busy)\b/;
const PERM = /^(can|could|may) (i|we|me|maddie|sarah|my friends?)\b|^(will|can) (you|u) let me\b/;
const WHY = /^(why|y|how come)\b/;
const FINE = /^((i'?m |i am )?(good|great|fine|alright|not bad|pretty good|awesome))\b/;
const NOTHING = /^(nothing|nothin|nm|not much|nothing much|idk|i (dont|don't) know|dunno)\b/;
const HOWRU_Q = /(wbu|hbu|how are you|how r u|and you|you\?)[.!? ]*$/;

function answerOf(t: string): Answer | null {
  if (NOTHING.test(t)) return 'nothing';
  if (NO.test(t)) return 'no';
  if (WHY.test(t)) return 'why';
  if (FINE.test(t)) return 'fine';
  if (YES.test(t)) return 'yes';
  return null;
}

const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

function read(t: string): { intent: Intent; act: string; place: string } {
  for (const [intent, re] of RULES) if (re.test(t)) return { intent, act: '', place: '' };
  if (GREET.test(t) && t.split(' ').length <= 5) return { intent: 'greet', act: '', place: '' };
  const place = t.match(PLACE);
  if (place) return { intent: 'place', act: '', place: place[1] };
  const act = t.match(ACT) ?? t.match(LONE);
  if (act && !NOT_ACT.has(act[1])) return { intent: 'act', act: act[1], place: '' };
  for (const [intent, re] of LATE) if (re.test(t)) return { intent, act: '', place: '' };
  if (ASK.test(t)) return { intent: 'question', act: '', place: '' };
  return { intent: 'other', act: '', place: '' };
}

export function pickReply(buddyId: string, typed: string, used: Set<string>, last?: string): string | null {
  const pool = POOLS[buddyId];
  if (!pool) return null;
  const choose = (lines: string[] | undefined, act = '', place = ''): string | null => {
    const filled = (lines ?? []).map((l) => l.replace(/\{act\}/g, act).replace(/\{Act\}/g, cap(act)).replace(/\{place\}/g, place));
    if (!filled.length) return null;
    const fresh = filled.filter((l) => !used.has(l));
    return fresh[0] ?? filled[Math.floor(Math.random() * filled.length)];
  };
  let t = typed.toLowerCase().replace(/\u2019/g, "'").replace(/\s+/g, ' ').trim();
  const own = NAMES[buddyId];
  if (own) t = t.replace(own, ' ').replace(/\s+/g, ' ').replace(/^[\s,!.]+/, '').trim();
  const lead = t.match(LEAD);
  const body = lead ? t.slice(lead[0].length).trim() : t;
  const ans = body ? answerOf(body) : null;
  const q = (last ?? '').toLowerCase();
  const follow = q ? (FOLLOW[buddyId] ?? []).find((f) => f.q.test(q)) : undefined;
  const asked = !!follow || (!!q && (q.includes('?') || ASK.test(q)));
  if (follow) {
    if (ans && follow[ans]) return choose(follow[ans]);
    if (!body && follow.greet) return choose(follow.greet);
  }
  if (asked && HOWRU_Q.test(q) && (ans === 'fine' || ans === 'yes')) return choose(pool.fine);
  if (asked && ans === 'nothing') return choose(pool.nothing ?? pool.other);
  if (body && PERM.test(body)) return choose(pool.question);
  const { intent, act, place } = read(body || t);
  if ((intent === 'other' || intent === 'question') && ans) {
    const k = ans === 'why' ? 'question' : ans;
    if (pool[k]) return choose(pool[k]);
  }
  const inContext = follow?.[intent];
  if (inContext) return choose(inContext, act, place);
  return choose(pool[intent] ?? pool.other, act, place);
}
