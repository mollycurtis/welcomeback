# Welcome Back

A browser recreation of sitting down at the family computer in 2009.

You turn on a CRT monitor on a cluttered desk, wait through the boot screen, log in as
Owner, and land on a desktop. From there you can open Solitaire, draw in Scribble, read
the family's files in My Documents, play Pinball, chat on Chatterbox, or open WorldWindow and
browse a small pretend internet, where three full games live as websites: **Maple Grove**, a
cozy town game; **iFind**, a hidden object game; and **Finn the Fish**, an animated underwater
mystery.

Built with Next.js as a static export. No backend, no accounts, no database.

## The documents

| File | What it covers |
|---|---|
| `README.md` | This tour |
| `ARCHITECTURE.md` | How everything is built, and the rules for changing it. When a document disagrees with it, ARCHITECTURE.md wins |
| `DEPLOYMENT.md` | Putting the site on Vercel, the environment settings, the visitor counter, the link preview |
| `FINN_NOTES.md` | Finn the Fish: story, route, main path, mini games, writing voice |
| `IFIND_NOTES.md` | iFind: build notes and scene authoring rules |
| `docs/HANDOFF.md` | Where the project stands, the standing decisions and the version history |
| `docs/asset-prompts.md` | The image prompts used for Finn's mini game art |
| `tools/tests/README.md` | The automated checks and how to run them |
| `COPYRIGHT` | Rights notice |

---

## What's in it

### The machine
A photographed desk with a working CRT. The little light left of the power button is red
until you press power, then green. Boot sequence, a Windows flavoured login (any password
works for Owner, and nothing says so), a desktop with icons and a Start menu, a taskbar with a
clock, a screensaver, and Display Properties where you can turn the CRT scanlines and flicker
on. They are **off by default**. Pressing the power button while the computer is on opens a
"Turn off computer" box with Stand By, Turn Off and Restart, like Windows XP.

Things on the desk are clickable too: a stack of CDs, a Petville adoption card, a family photo
and a kid's drawing, plus the monitor's own Menu, brightness and Degauss buttons. The tree
outside the window sways gently.

### Desktop apps
| App | What it is |
|---|---|
| My Documents | The family's files: spelling words, a permission slip, mom's recipes, a budget, a password locked time capsule, and a letter from the person who made this |
| My Pictures | Four kid made pictures |
| Notepad | Opens any text file; the cursor is in the page as soon as it opens |
| Scribble | A Paint clone with pencil, eraser, fill and a colour grid |
| Solitaire | Klondike with drag and drop, a Hint button, and auto finish once every card is face up |
| Minefield | Minesweeper |
| Pinball | A physics pinball table with flippers, bumpers, slingshots and a high score already on the board |
| Recycle Bin | Empty until you delete something. Documents, folders, pictures and drawings can be deleted (Delete key, the Delete button or a right click) and brought back with Restore |
| Calculator | A calculator, mouse or keyboard |
| WelcomeMail | The family inbox, nine emails, one unread |
| Chatterbox Messenger | A buddy list of five: dad, mom, Sarah, Maddie and grandma, with old conversations to scroll back through. Sarah has a message waiting when you log in, stamped with your own time, and five minutes in Maddie messages you and her chat opens. Everyone answers what you actually type, in their own voice, and answers the question they just asked. Sarah and dad show a tiny cell phone icon once they message you |
| Calendar | All of 2009, about 120 family entries, colour coded, opening on June |
| TypeRight | A typing game |
| Display Properties | Five tabs: Desktop, Screen Saver, Appearance, Settings (scanlines and flicker) and System |
| WorldWindow | The browser. It opens full screen; the square button makes it a smaller window |

### WorldWindow, the pretend internet
A period accurate browser with Back, Forward, Home, History, an address bar, bookmarks, and a
search engine (**AskBeeves**) whose results include live sites, dead links, and one archived
snapshot.

Sites you can visit:
- **The Lobby**, the homepage, with a real visitor counter
- **GameFort**, a free games portal with six playable games: The Maze Game, Tank Wars,
  Burger Time!, Stick Fighter, Bubble Pop Deluxe and Makeover Studio
- **City Public Library**: catalogue, an account with an overdue copy of *Holes*, events,
  homework help
- **Italian Pie Shoppe**, a pizza place's 2007 website
- **QuizFever**, a ten question "How 2000s are you?" quiz
- **CursorCastle**, free cursors (the download is blocked by parental controls)
- **AskBeeves**, search, plus a page at `www.askbeeves.com/suggest` for telling Molly about a
  game you remember
- Plus article pages, forum threads, and Q&A pages that turn up in search results

### The five worlds
Bookmarked in the browser: **Maple Grove**, Petville, iFind, Finn the Fish, Penguin Cove.

**Maple Grove, iFind and Finn the Fish are complete and playable.** Petville and Penguin
Cove are coming soon pages on purpose, each with the idea form and links to the three games
you can play.

---

## Maple Grove

A cozy small town game in the spirit of Millsberry. You create a resident, move into a
house on Rosemount, and spend a day in town.

- **Nine districts**: Downtown, Rosemount, Lakeville, Farmington, Woodbury, Grove Park,
  Bloomington, Eagan, Apple Valley, every one a painted scene
- **15 residents** with their own conversations, friendship hearts, gift preferences and
  letters they mail you
- **An arcade** with six games: Acorn Catch, Treasure Match, Burger Rush, Skee Ball,
  Pixel Quest, Block Drop, all paying Maple Bucks and arcade tickets
- **Your house**: three rooms, furniture you buy and place, and wallpaper you can change
  in the living room and bedroom
- **Collecting**: 50 groceries, 36 stickers, 23 trading cards in two sets, 6 fish
- **Daily things**: classes at Maple Academy, fishing at Lakeville, the orchard harvest,
  the prize wheel at the fair, a trail hunt in Woodbury, stone skipping at Apple Valley
- **Seasons and festivals** that change what is on in Grove Park

**Maple Grove resets when you shut the computer down.** That is deliberate. It is a day
at the family computer, not a save file.

---

## iFind

A hidden object game. A cluttered photographic scene, a rhyming clue on a strip below it, and
every object named in the rhyme is somewhere in the picture. Click it and the words are struck
through. The start card says how to play: find each thing from the riddle below and click it.

- **Six photographic scenes**: The Bedroom, The Busy Desk, The Office, The Kitchen, The
  Antique Store, The Garage. 58 objects between them, one round per scene
- **Sorted easiest to hardest** in the picker, colour coded Easy / Medium / Hard
- **A countdown clock** sized to the work: 12 seconds to read the rhyme plus a per object
  budget by difficulty
- A wrong click costs 2 seconds. A hint costs 5 and rings the object
- **Stars, not scores**, from time left and mistakes
- Its own look and its own sound: dark wood, brass, parchment, an inscriptional serif face

Like Maple Grove, **iFind forgets when the computer shuts down.** Build notes and the scene
authoring rules are in `IFIND_NOTES.md`.

---

## Finn the Fish

A point and click underwater mystery in the spirit of Freddi Fish: the Moon Pearls are
missing on the night of the festival.

- **24 scenes in seven regions**: Coral Cove, Bubble Bay, Sunken Garden, Deep Trench, Pearl
  Reef, Sunken Ship, Moonlight Island
- **16 characters and 19 items**, a main path of 26 steps from the first clue to the ending in
  the Moon Shell Chamber, a Notebook, an optional side quest, and **three mini games** spaced
  through the game (a shell game, a sea quiz and a fish count), each winning one sea star.
  About 35 to 45 minutes
- **Fully animated** from the existing art: Finn swims to what you click, turns, blinks and
  reacts; the characters blink, talk and fidget; the water is alive in every scene; scenery
  reacts to clicks
- Conversations remember what you have asked, and the festival fills with friends once all
  five pearls are found
- No music and no voices. Options, on the title screen and in the in game Menu, has a sound
  switch, text speed and how to play
- Written for kids, in Finn's own voice. Everything you can pick up sparkles, Finn says what to
  do next, the Professor's painted map shows where the pearls are, and the Notebook always has
  an answer to "What should I do next?"
- Data driven: scenes, characters, items and puzzles are all records rather than components

Like the other two worlds, **Finn forgets when the computer shuts down** or the tab closes.
See `FINN_NOTES.md` for how it plays and how it is put together.

---

## Phones, tablets and small windows

The machine needs a screen of at least 940 by 600. A phone gets a short page about the game,
with screenshots and a "Send myself the link" button. A tablet held upright is asked to turn
sideways, and plays once it is. A computer with a small browser window is asked to make it
bigger. The phone page screenshots live in `public/mobile/`.

On a computer the whole room photo always shows, with a dark blurred copy of the room filling
any space around it. Tablets fill the screen instead.

Every animation plays for everyone. There are no reduce motion checks anywhere, on purpose.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static export to out/
```

The live site is deployed on Vercel from GitHub; `DEPLOYMENT.md` has the steps. Any static
host also works by uploading `out/`.

### Environment
Optional settings, all read at **build time**:

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX        # Google Analytics 4
NEXT_PUBLIC_COUNTER_URL=https://...   # CounterAPI endpoint for the Lobby counter
NEXT_PUBLIC_COUNTER_OFFSET=0          # subtracted from the displayed count
NEXT_PUBLIC_SITE_URL=https://...      # only for your own domain; used by the link preview
```

Copy `.env.example` to `.env.local` and fill them in. `.env.local` is never committed.
**A build without these silently ships with no analytics and no visitor counter.**

### Testing
`tools/tests/README.md` explains the automated checks: the whole machine, Chatterbox, the room
fit, Finn's full playthrough, content audit and mini games, and more.

---

## Conventions worth knowing

- **No em dashes in anything a player reads.** Short hyphens are fine in moderation.
- **No comments in the code.** The documents carry the explanations.
- Scenes are paintings with invisible hotspots laid over them in percentage coordinates.
  Characters sit in a click through layer so they never block a hotspot.
- Furniture is drawn at a consistent three quarter angle and anchored base to floor.
- Prefer editing an existing screen over adding a system. Data with no gameplay hookup
  should not be added.

## Project layout

```
app/                     Next.js app router (one route), layout and globals.css
components/
  Machine.tsx            the desk, the CRT, the whole machine
  RoomLife.tsx           the swaying tree and sunlight in the window
  SmallScreen.tsx        what phones, upright tablets and small windows see instead
  InspectModal.tsx       the close look at things on the desk
  boot/                  boot, login, shutdown, and the Turn off computer box
  desktop/               desktop, taskbar, start menu, screensaver
  apps/                  every desktop program
    WorldWindow.tsx      the browser: address bar, history, routing to every site
    web/                 the pretend internet: GameFort and its games, the Library, the Pie Shoppe
    maplegrove/          Maple Grove
    ifind/               iFind
    finn/                Finn the Fish
    Messenger.tsx        Chatterbox Messenger
    WelcomeMail.tsx      WelcomeMail
lib/                     data: the virtual filesystem, search results, icons, sounds
  chatterData.ts         Chatterbox buddies, old conversations and waiting messages
  chatterBrain.ts        how each buddy answers what you type
  mailData.ts            the WelcomeMail inbox
  maplegrove/ ifind/ finn/   each world's content
store/                   one Zustand store per world or program; save.ts is the machine only
public/                  every image, all of them in use
docs/                    handoff and asset prompts
tools/tests/             automated checks
```

---

Made by Molly Curtis.
