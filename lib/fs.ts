import type { IconName } from './icons';

export interface VFile {
  path: string;
  name: string;
  icon: IconName;
  sizeLabel: string;
  protected?: boolean;
  kind?: 'text' | 'exe' | 'media';
  song?: boolean;
  content: string;
}

export interface VFolder {
  id: string;
  name: string;
  locked?: boolean;
}

export const FOLDERS: VFolder[] = [
  { id: 'school', name: 'school' },
  { id: 'recipes', name: 'recipes (mom)' },
  { id: 'downloads', name: 'Downloads' },
];

export const DOC_FILES: VFile[] = [
  {
    path: 'mydocs/summer-plans',
    name: 'summer plans!!.txt',
    icon: 'notepad',
    sizeLabel: '1 KB',
    content: `SUMMER PLANS!!!

1. bike to maddie's every weekend
2. teach tucker a trick
3. go to the pool EVERY day it's open
4. build a fort in the backyard (a real one)
5. catch fireflies in a jar (let them go after)
6. run through the sprinkler
7. sleepover at maddie's
8. learn to whistle
9. sell lemonade (charge 25 cents)
10. stay up until midnight

so far: 0/10. it's only june.`,
  },
  {
    path: 'mydocs/grocery-list',
    name: 'grocery list (mom).txt',
    icon: 'notepad',
    sizeLabel: '1 KB',
    content: `milk (2%)
bread
eggs
butter
bananas
apples
chicken breasts
ground beef
potatoes
carrots + onions
shredded cheese
tortillas
cereal
juice boxes
yogurt
paper towels
dish soap
laundry detergent
cat treats
cat litter

- return library books`,
  },
  {
    path: 'mydocs/phone-numbers',
    name: 'phone numbers IMPORTANT.txt',
    icon: 'notepad',
    sizeLabel: '1 KB',
    content: `home: 612-555-0100
mom's cell: 612-555-0187
dad's work: 651-555-0133
grandma: 701-555-0119
grandpa (shop): 701-555-0120
maddie's house: 952-555-0163
italian pie shoppe: 952-555-0142
school office: 952-555-0186
dr. hansen (dentist): 651-555-0174
the valentines: 612-555-0151
library: 952-555-0129
poison control: 1-800-222-1222`,
  },
  {
    path: 'mydocs/birthday-list',
    name: 'birthday list.txt',
    icon: 'notepad',
    sizeLabel: '1 KB',
    content: `MINE (november 10):
- shrek movie
- more webkinz!!
- power rangers tshirt
- nora drake #5 cd

mom: january 9
dad: october 7
sister: january 31
maddie: november 17
grandma: march 15
grandpa: august 14
mari: january 26
alex: september 2
breishen: december 29`,
  },
  {
    path: 'mydocs/report-card',
    name: 'report card.txt',
    icon: 'lock',
    sizeLabel: '1 KB',
    protected: true,
    content: `THIRD QUARTER REPORT

Math .......... B-  ("applies self when interested")
History ....... C+  ("a daydreamer")
Reading ....... A   (obviously)
Science ....... B   (the volcano helped)
Gym ........... A   (dodgeball)

Conduct: "talks during computer lab."`,
  },
  {
    path: 'mydocs/website',
    name: 'a letter to you.txt',
    icon: 'notepad',
    sizeLabel: '2 KB',
    content: `hi player,

there are probably a hundred little things in Welcome Back that you could miss, so i'm glad you ended up here.

i built Welcome Back because i missed the feeling of being a kid at the family computer. when games felt endless, afternoons felt longer, and there was always something else to discover.

nostalgia is the whole idea behind this. the feeling of being young, having nowhere to be, and getting lost in whatever was in front of you.

i created this game with all the things i remember loving: the weird little details, the things tucked away where you wouldn't think to look, the stuff that only becomes meaningful when you take the time to notice it.

this took me about a year to make. a year of building, refining, adding little details, and obsessing over things most people might never notice.

if you made it all the way to this file, thank you for being curious enough to look and welcome back.

- molly curtis`,
  },
  {
    path: 'mydocs/time-capsule',
    name: 'time capsule (open in 2027).txt',
    icon: 'lock',
    protected: true,
    sizeLabel: '2 KB',
    content: `TIME CAPSULE
do not open until the year 2027!!!

dear future me,

by the time you read this you'll be a grown up. that is so weird to type. i'm sitting at the family computer right now and dad just said "ten more minutes" for the third time.

here is what i think 2027 is like:
- everyone has a phone that's also a computer and a camera and you never have to print directions again
- the internet is instant. no dial tone. no waiting for the picture to load one line at a time
- you can watch any movie you want without going to the store to rent it
- cars might drive themselves. maybe not. but maybe. OR FLY??
- you can talk to your computer and it talks back
- music is not on CDs anymore. i don't know what it's on

here is what i hope is still the same:
- mom still makes enchiladas
- tucker is still around (he'd be really old. that's ok)
- you still bike to maddie's. or call her. or something
- the lake is still there and dad still takes the gravel road too fast
- you still remember this computer

things i love right now: summer, my friends, this computer, staying up late, the lake, the way the house sounds when everyone is home.

i hope you still love some of those. i hope you're happy. i hope you did the things you said you would.

if you found this on the old computer, it still works. that means someone kept it. thank you for keeping it.

- you (the younger one)`,
  },
  {
    path: 'mydocs/budget',
    name: 'budget (do not touch) v2 FINAL(2).xls',
    icon: 'file',
    sizeLabel: '31 KB',
    content: `*** SPREADSHEET PRO 2004 (text preview) ***

MONTHLY BUDGET 2004

INCOME
take-home pay ............ 3,250

FIXED
mortgage ................. 1,150
car payment .............. 285
car insurance ............ 110
electric ................. 95
gas / heat ............... 60
phone .................... 40
internet (dial up) ....... 22
cable .................... 45

EVERYDAY
groceries ................ 480
gasoline ................. 120
kids / school ............ 90

SAVINGS
savings .................. 200

left over ................ 553`,
  },
  {
    path: 'mydocs/lake-directions',
    name: 'directions to the lake.txt',
    icon: 'notepad',
    sizeLabel: '1 KB',
    content: `DIRECTIONS TO THE LAKE

1. RIGHT out of the driveway (you know this part)
2. ROUTE 9 NORTH - 24.6 mi
3. LEFT at the gas station (the one that closed)
4. follow the lake signs - 8.1 mi
5. gravel road. slow down.
6. if you see the diner you went too far.

if it's dark out, watch the road for frogs. after it rains there are hundreds of them and you WILL run them over. roll the windows up.`,
  },

  {
    path: 'mydocs/recipes/enchiladas',
    name: 'enchiladas (the good ones).txt',
    icon: 'notepad',
    sizeLabel: '1 KB',
    content: `MOM'S ENCHILADAS

- corn tortillas (the small ones)
- chicken, cooked and shredded
- tomatillos (the little green ones)
- a couple green chiles
- onion + garlic
- cheese (lots)
- sour cream on the side

roast the tomatillos and chiles until soft, then blend with the onion and garlic into the green sauce. dip each tortilla, fill with chicken, roll, line them up. pour the rest of the sauce over the top, cover in cheese.

350 until bubbly and the edges go crispy.

serves: 6. (somehow never leftovers.)`,
  },
  {
    path: 'mydocs/recipes/bloody-mary',
    name: "dad's bloody mary.txt",
    icon: 'notepad',
    sizeLabel: '1 KB',
    content: `DAD'S BLOODY MARY
(he was very proud of these)

- tomato juice
- a good squeeze of fresh lemon
- a few shakes of worcestershire
- hot sauce (more than you think)
- a little horseradish
- celery salt + cracked pepper
- the celery stalk

stir, don't shake. rim the glass with celery salt. garnish like you mean it.

"the secret is the horseradish." - dad`,
  },
  {
    path: 'mydocs/recipes/tuesday-pot-roast',
    name: 'tuesday pot roast.txt',
    icon: 'notepad',
    sizeLabel: '1 KB',
    content: `TUESDAY POT ROAST

- 3 lb chuck roast
- salt + pepper
- 2 onions, quartered
- carrots, cut big
- potatoes, halved
- 2 cups beef broth
- a packet of onion soup mix
- bay leaf

brown the roast on all sides. put it in the crock pot with everything else. low for 8 hours.

serves: the whole week.`,
  },
  {
    path: 'mydocs/recipes/banana-bread',
    name: "banana bread (grandma's).txt",
    icon: 'notepad',
    sizeLabel: '1 KB',
    content: `GRANDMA'S BANANA BREAD

- 3 very ripe bananas, mashed
- 1/3 cup melted butter
- 3/4 cup sugar
- 1 egg, beaten
- 1 tsp vanilla
- 1 tsp baking soda
- pinch of salt
- 1 1/2 cups flour

mix the bananas and butter, then the sugar, egg and vanilla. sprinkle in the baking soda and salt, then stir in the flour. pour into a greased loaf pan.

350 for 60 minutes. cool before slicing.

good with the brown bananas nobody will eat.`,
  },
  {
    path: 'mydocs/recipes/pizza-dough',
    name: 'pizza dough (attempt 3).txt',
    icon: 'notepad',
    sizeLabel: '1 KB',
    content: `HOMEMADE PIZZA DOUGH

- 1 packet active dry yeast
- 1 cup warm water (not hot)
- 1 tsp sugar
- 2 1/2 cups flour
- 1 tsp salt
- 1 tbsp olive oil

stir the yeast and sugar into the warm water. let it sit 5 minutes until foamy. add the flour, salt and oil. knead about 8 minutes until smooth. cover and let rise 1 hour.

stretch onto a greased pan. sauce, cheese, toppings.

450 for 12-15 minutes.`,
  },

  {
    path: 'mydocs/school/book-report',
    name: 'book report. HOLES.doc',
    icon: 'file',
    sizeLabel: '14 KB',
    content: `BOOK REPORT

The book I read was Holes by Louis Sachar. It is about a kid named Stanley who gets sent to a camp where you have to dig holes all day, which is unfair because he didn't even do anything. The holes are probably a metaphor.

Or it's about digging your own grave.`,
  },
  {
    path: 'mydocs/school/spelling-words',
    name: 'spelling words week 14.txt',
    icon: 'notepad',
    sizeLabel: '1 KB',
    content: `necessary
beautiful
because (b-e-c-a-u-s-e)
neighbor
definately
rhythm (???)
separate
mischievous
unfortunately

TEST FRIDAY.`,
  },
  {
    path: 'mydocs/school/science-fair',
    name: 'science fair ideas.txt',
    icon: 'notepad',
    sizeLabel: '1 KB',
    content: `SCIENCE FAIR IDEAS

1. volcano (everyone does volcano)
2. does music make plants grow
3. the mentos thing (mom said no. inside OR outside.)
4. which fish is smartest (finn the fish has fish facts)
5. volcano but BIGGER

doing volcano.`,
  },
  {
    path: 'mydocs/school/city-report',
    name: 'city report - EAU CLAIRE.doc',
    icon: 'file',
    sizeLabel: '12 KB',
    content: `CITY REPORT
by Molly Curtis, Room 12

The city I picked is Eau Claire, Wisconsin. It is about an hour and a half from our house. I picked it because it has a French name and I wanted to find out why.

FACTS ABOUT EAU CLAIRE:

The name means "clear water" in French. Two rivers meet right in the middle of town, the Chippewa River and the Eau Claire River. There is a park at the spot where they join up and you can stand there and see both of them.

It used to be a lumber town. Logs got cut down up north and floated down the river to the sawmills in Eau Claire. There was so much sawdust that people called it Sawdust City. That is a real nickname.

There is a big park called Carson Park. It is on a peninsula, which means it has water on three sides. It has a baseball stadium, a logging camp museum with a giant Paul Bunyan, and a little train you can ride on.

A famous baseball player named Hank Aaron played for the Eau Claire team in 1952 before he was famous. There is a statue of him by the stadium.

About 60,000 people live there. It is the biggest city in that part of Wisconsin.

It snows a lot, like here.

THE END`,
  },
  {
    path: 'mydocs/school/math-practice',
    name: 'math practice.txt',
    icon: 'notepad',
    sizeLabel: '1 KB',
    content: `long division practice

144 / 12 = 12
156 / 13 = 12
168 / 14 = 12

ok i see the pattern now

228 / 19 = 12
264 / 22 = 12

MRS ALVAREZ these are all 12. is that on purpose or did you run out of ideas

(do not actually send this)

87 / 3 = 29
92 / 4 = 23
105 / 5 = 21
132 / 6 = 22`,
  },
  {
    path: 'mydocs/school/field-trip',
    name: 'field trip notes.txt',
    icon: 'notepad',
    sizeLabel: '1 KB',
    content: `ZOO FIELD TRIP - things I saw

- a turtle (did not move the whole time)
- a hawk with one wing that cannot fly anymore, they keep it
- 4 deer, or the same deer 4 times
- a big frog behind glass, Maddie would not look at it
- a log with mushrooms growing in a perfect line

the guide said the elephants remember every person who was mean to them. I thought about that on the bus.

lunch was outside by the monkeys. Kinda gross.`,
  },
  {
    path: 'mydocs/school/permission-slip',
    name: 'permission slip PRINT THIS.doc',
    icon: 'file',
    sizeLabel: '8 KB',
    content: `FIELD TRIP PERMISSION FORM

Destination: THE ZOO
Date: Friday, May 8
Bring: $5 for lunch, a jacket

Student name: ______________________

Parent signature: ______________________

(return by WEDNESDAY or you stay back with the kindergartners.)`,
  },

  {
    path: 'mydocs/downloads/smiley-cursor',
    name: 'smiley_cursor_setup.exe',
    icon: 'file',
    sizeLabel: '412 KB',
    kind: 'exe',
    content: '',
  },
  {
    path: 'mydocs/downloads/song1-real',
    name: 'song(1)(REAL)(not virus).mp3',
    icon: 'file',
    sizeLabel: '28 KB',
    kind: 'media',
    song: true,
    content: '',
  },
  {
    path: 'mydocs/downloads/screensaver',
    name: 'flying_toasters_FREE.scr',
    icon: 'file',
    sizeLabel: '888 KB',
    kind: 'exe',
    content: '',
  },
  {
    path: 'mydocs/downloads/maze',
    name: 'the_maze_game.exe',
    icon: 'file',
    sizeLabel: '1,204 KB',
    kind: 'exe',
    content: '',
  },
  {
    path: 'mydocs/downloads/aim',
    name: 'BuddyLine_Setup_5.1.exe',
    icon: 'file',
    sizeLabel: '4,096 KB',
    kind: 'exe',
    content: '',
  },

];

export const DIARY: VFile = {
  path: 'notepad/diary',
  name: 'diary.txt',
  icon: 'notepad',
  sizeLabel: '2 KB',
  content: `june 8 - nothing happened today.

june 10 - pizza day AND we had a sub who let us play computer games the whole period. best day of my life so far.

june 11 - mom said "we'll see" which everyone knows means no.

june 12 - SCHOOL'S OUT!!!!! summer rules. going to go play outside right after I check my games real quick.`,
};

const ALL: VFile[] = [...DOC_FILES, DIARY];

export function findFile(path: string): VFile | undefined {
  return ALL.find((f) => f.path === path);
}

export function filesIn(folder: string): VFile[] {
  const prefix = folder ? 'mydocs/' + folder + '/' : 'mydocs/';
  return DOC_FILES.filter((f) => {
    if (!f.path.startsWith(prefix)) return false;
    return !f.path.slice(prefix.length).includes('/');
  });
}
