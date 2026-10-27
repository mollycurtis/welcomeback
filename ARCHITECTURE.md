# Welcome Back: architecture

The authoritative description of how the site is built and the rules for changing it. When
another document disagrees, this one wins.

## Shape

- **Next.js static export** (`output: 'export'`). No server. One route (`/`) renders
  `components/Machine.tsx`, the 2009 family computer.
- **The room is one composition.** The desk photo (`public/room.webp`), the screen, the
  clickable things and the power light are laid out in percentages of the photo
  (`lib/scene.ts`). Zooming in on the monitor applies a CSS `transform: scale(...)` to the
  whole composition; the factor is computed from the room's fit so the screen fills about 90%
  of the window height.
- **Layout pixels, not screen pixels.** Because of that zoom, measure with `offsetWidth`,
  `offsetHeight`, `clientWidth` and `clientHeight`. Where `getBoundingClientRect` is
  unavoidable, divide by `el.offsetWidth / rect.width` to get back to layout pixels.
- **No lasting `will-change`, 3D transforms or `backface-visibility` on the room composition or
  the screen container.** Each of those puts the screen on its own bitmap that the browser
  rescales inside the zoom, which made text go soft. The one exception is the zoom itself: the
  two zooming layers get `will-change: transform` for the 1.3 seconds of the zoom so it runs
  smoothly, and lose it as soon as the zoom ends. The whole machine regression includes a text
  sharpness check for this.

## State and saves

Everything is **session scoped**: it lives in `sessionStorage`, so closing the tab starts over,
and shutting the computer down resets every world.

- **The machine**: `store/save.ts` (`useSave`). `SAVE_SCOPE = 'session'`; flip it to `'local'`
  if the machine should ever remember across visits. It holds the desktop, files, the Recycle
  Bin, discoveries on the machine itself and display settings. It is not a place for world state.
- **The system**: `store/system.ts` (`useSystem`, not saved): power phase, the logged in user,
  dialogs, the Start menu, and the Turn off computer box (`turnOff`, `standby`, `restarting`).
- **Windows**: `store/windows.ts`.
- **Programs with state**: Chatterbox (`store/chatter.ts`, key `welcome-back/chatter`, version 3)
  and WelcomeMail (`store/mail.ts`, key `welcome-back/mail`).
- **Worlds**, each its own store, loaded on demand with `next/dynamic`:
  - Maple Grove: `store/maplegrove.ts` (`useMaple`, key `welcome-back/maple-grove`, version 3
    with `migrate`).
  - iFind: `store/ifind.ts` (key `welcome-back/ifind`).
  - Finn the Fish: `store/finn.ts` (key `welcome-back/finn`). Its text speed setting is
    `lib/finn/prefs.ts` (key `welcome-back/finn-prefs`).
  - `ShutdownScreen` calls each world's `resetAll()` when the computer turns off or restarts.
  - A future world follows the same pattern: `store/<world>.ts`, key `welcome-back/<world>`, a
    `version` with `migrate`, a dynamic import in `WorldWindow`, an entry in `lib/worlds.ts`.
- **Shared layer**: `store/discovery.ts` (`useDiscovery`, localStorage `welcome-back/discovery`)
  is reserved for facts shared between worlds. Nothing writes to it yet.

## The room

- **Fit** (`Machine.tsx`): on computers the whole room photo always shows (contain), and any
  space around it is filled with a dark, blurred copy of the room (`public/room-blur.jpg`, made
  in advance so no live filter sits under the screen). Touch devices (`pointer: coarse`, i.e.
  tablets) fill the window instead and show less of the sides.
- **The screen rectangle** (`SCREEN` in `lib/scene.ts`) covers the whole black glass, including
  the slight bulge at the middle of each side. Its top two corners are rounded to sit inside the
  monitor's rounded glass (`borderRadius: '1.25% 1.25% 6px 6px / 1.7% 1.7% 6px 6px'`).
- **The window** (`components/RoomLife.tsx`): six sway frames of the tree outside
  (`public/fx/leaf-0.webp` to `leaf-5.webp`) crossfade in a 9.6 second loop. Each frame is the
  photo's window area, warped only where the tree is (a hand drawn mask keeps the lamp and the
  house plant still), with the warp fading to nothing at every edge so there are no seams. A soft
  sunlight wash runs at 55% in the room view; zoomed in, both sit at 25%. The layer is drawn after
  the composition, with the same position and zoom, and clipped at the screen's left edge; drawn
  inside the composition, its animation made text on the screen go soft. During a desk item close
  look (`components/InspectModal.tsx`) the layer fades out as the room dims and back in as it
  brightens (0.32 seconds each way), so the window darkens with everything else and nothing is
  dimmed twice. The close look's dimming is its own layer that fades, and the item glides back to
  its place on the desk as it closes.
- **The power light** is the small dot left of the power button: steady red until the computer is
  turned on, green from then on (through Stand By and Restart), red again after Turn Off. It never
  blinks. Nothing else hints at what to do, on purpose, and the password screen has no hint
  either: any password works, and that is meant to surprise the player.
- **Turn off computer** (`components/boot/TurnOffDialog.tsx`): pressing the power button while
  the computer is on zooms in and opens a box modelled on Windows XP's (no Windows logo, to stay
  clear of Microsoft's artwork). Start, Shut Down and the login screen's Turn off computer open
  the same box. The screen behind it fades to gray (a grayscale filter, removed when the box
  closes). Stand By blacks the screen until the mouse moves or a key is pressed; Turn Off runs
  the shutdown; Restart runs the shutdown and boots back to the login screen.
- **Log Off** asks first ("Log Off Windows", Log Off or Cancel), then returns to the Welcome
  screen.
- **Too small**: below 940 by 600, `components/SmallScreen.tsx` replaces the machine: a pitch
  page on phones, "turn it sideways" on upright tablets, "make the window bigger" on computers.
  Once the machine has been shown at full size it stays mounted underneath, so making the window
  big again brings it straight back. Phones never mount the machine.
- **Esc** steps back from the computer only from an empty desktop. With a window, a menu, a
  message box or the monitor menu open, Esc belongs to that.
- **Motion is never switched off.** There is no `prefers-reduced-motion` anywhere, by design.
- **Images**: the four biggest (`room.webp`, `petville-card.webp`, `drawing.webp`,
  `finn/ui/home.webp`) are lossless WebP, pixel for pixel identical to the original PNGs. Lossy
  compression was tried and rejected because it softened detail. Regenerate `room-blur.jpg` if
  the room photo ever changes.
- **Link preview**: `app/layout.tsx` sets Open Graph and Twitter tags with `public/og.jpg`
  (1200 by 630, the room with the computer on). `metadataBase` comes from
  `NEXT_PUBLIC_SITE_URL`, else Vercel's `VERCEL_PROJECT_PRODUCTION_URL`.

## The desktop

- **Icons** (`lib/desktopItems.ts`, laid out in `components/desktop/Desktop.tsx`): each item
  names its column. Left: My Documents, My Pictures, Notepad, WorldWindow, Scribble, Recycle
  Bin. Middle: Calculator, Chatterbox, WelcomeMail, Calendar, TypeRight, Solitaire. Right of
  that: Pinball, Minefield. The worlds run down the right edge.
- `lib/icons.tsx` maps every icon to a PNG (`IMAGE_ICONS`). PNG icons draw with smooth scaling
  (`imageRendering: auto`); the global pixelated rule would make them grainy. Check new icons at
  30px (desktop) and 17px (file lists).
- **WorldWindow** opens maximized (`store/windows.ts`); the square button restores it to a
  window about three quarters of the screen, centered.
- **Typing**: Notepad and TypeRight put the cursor in the typing box when they open, and clicking
  a buddy in Chatterbox puts it in the message box. Maddie's automatic message does not take the
  cursor, so it never interrupts a game.
- **Calendar** opens on June 2009 with the month's whole list beside it.
- **Files and the Recycle Bin**: `store/save.ts` keeps what was deleted this session:
  `hiddenDocs` (built in documents by path, folders as `dir:<id>`), `hiddenBuiltinPics`, and
  `recycled`, one entry per deletion with its original location. Saved Notepad files and Scribble
  drawings move into their bin entry. Restore puts each kind back; a name taken since gets
  " (2)". The bin starts empty. Program shortcuts cannot be deleted (dad protected them); desktop
  New Folders can be deleted, renamed and dragged onto the bin.
- **Pinball** steps its physics in four small moves per frame, so a fast ball cannot skip
  through a flipper or slingshot; the flipper kick is applied once per frame. The flippers are
  62 pixels long, which narrows the gap between them. The ball moves at 88% pace (`PACE`):
  positions advance at 88% and gravity is scaled by the square, so it follows the same paths, just
  a little slower; the flippers keep their full speed.

## Chatterbox

- Buddies, old conversations and waiting messages are in `lib/chatterData.ts`; replies come from
  `lib/chatterBrain.ts`.
- What you type is read for what it is (hello, goodbye, love you, sorry, what are you doing,
  where are you, where is something, can I, huh, an activity like "swimming", a place, food,
  Tucker, family, games, school, yes, no, nothing, fine, a question), and each buddy answers from
  their own lines, never repeating until they run out. Activities and places are echoed back
  ("swimming?? without me??"). A buddy's own name and a leading "hi" are ignored.
- **Follow ups** (`FOLLOW`): when a buddy's last line was a question or a reply on a topic
  (Sarah's "r u almost done on the computer??", Maddie's "r u on yourworld?", Mom's "did you eat",
  Dad's "want to help?" and about 30 more), an answer like "almost done", "5 more min", "not yet",
  "why" or "idk" gets a reply that fits.
- Sarah starts with a waiting message (`WAITING`: "r u almost done on the computer?? i need it").
  Today's conversations are headed with the machine's date and the player's real time
  (`startedAt` in `store/chatter.ts`, the same clock as the taskbar), so her message feels like it
  just arrived. Dad and Sarah start online (`ONLINE_AT_START`). Maddie's five minute message (`IDLE_MESSAGE`) marks her unread and opens
  Chatterbox on her chat.
- Sarah and Dad show a tiny cell phone icon (`MOBILE`) once they have messaged today: in the
  buddy list, in the chat header ("On a cell phone") and on their messages from today. Their
  older conversations have none. It explains how they can message while the player is on the
  family computer.
- Tucker is Maddie's dog, which the family sometimes dog sits. Every line about him says so.
- Sarah teases like a big sister but is kind: her replies are warm, and her older conversations
  (written by Molly) are unchanged.

## WelcomeMail

Nine messages in `lib/mailData.ts`, newest first; Aunt Jean's is the one unread. Every message
opens in the preview pane and shows who it was sent to (`to`): the family is Peggy (mom,
`peggy.curtis@quickmail.net`), Daniel (dad, `daniel.curtis@quickmail.net`), Sarah
(`scurtis97@quickmail.net`) and the player (`macgruber7@quickmail.net`). Things a grown up buys
or books go to Peggy (the video rental, the library notice, the photo prints, the dentist, the
pediatrician) or Daniel (the Bright Buy order, the father daughter dance tickets); Mom's swim
note goes to both girls; Aunt Jean's note about lefse at Grandma's in Fargo goes to everyone.

## WorldWindow and AskBeeves

- Every site is routed in `components/apps/WorldWindow.tsx`; written pages are `ARTICLES` in
  `components/apps/web/Pages.tsx`.
- AskBeeves pages show real addresses: the idea form is `www.askbeeves.com/suggest` and a search
  is `www.askbeeves.com/search?q=...`; both also work typed into the address bar. The idea form
  posts to Formspree.
- `lib/search.ts` matches whole words, not letters. A query containing a whole term wins; a query
  of four letters or more can also match a term that contains it. Results marked `broken` load the
  broken page on purpose, and `dead` ones are not listed.

## Worlds

- The Lobby (`lib/worlds.ts`) lists Finn the Fish, Maple Grove, iFind, Petville and Penguin Cove.
  Petville and Penguin Cove are coming soon pages with the idea form and links to the three games.

### Maple Grove rules
- A new resident can pick any of the sixteen looks. After moving in, only owned looks can be worn
  (Threads sells the rest).
- Nine districts, fixed: Downtown, Rosemount, Lakeville, Farmington, Woodbury, Grove Park,
  Bloomington, Eagan, Apple Valley (internal ids in `lib/maplegrove/districts.ts` keep older names
  for save compatibility). Do not rename, remove or merge them.
- Avatars are finished presets (`avatar-0..15.png`, residents `resident-0..16.png`). No paper doll.
- Every scene is a painting in `public/maplegrove/bg/` rendered by `Backdrop` (cover cropped,
  hotspots in painting percentages). Panels and the talk card go in `overlay`, never inside the
  cropped painting.
- Arcade: six games, all through `games/GameShell.tsx`. Pixel Quest (`games/MazeChase.tsx`) reads
  the hedges from the maze painting; the squirrel slides around corners, and the gnomes find their
  way with a breadth first search over the open paths. They start well away from the squirrel,
  leave home one at a time (after 1.2, 2.2 and 3.2 seconds), and wander for a few seconds now and
  then.
- Economy: daily activities go through `doDaily(key)`; classes are `class_<Subject>` per day; the
  arcade is unlimited. Stickers come through `sticker()`, card sets through `checkSets()`.

### Finn the Fish rules
- No music and no voices. The click gags keep their sound effects; no new click gags.
- The dialogue scroll sits at the bottom, centres its text and shows no hint text. A click anywhere
  continues a conversation.
- **Conversations remember** (`heard` in the Finn save): a question already answered disappears;
  after an answer the remaining questions come back, with "Goodbye for now."; talking to someone
  again repeats only the last line of what they said.
- **Who is talking**: Finn's own hint lines (`FINN_LINE` in `AdventureScreen.tsx`) show "Finn"
  inside a conversation and no name when he is alone. A hint that becomes due during a
  conversation waits until it ends.
- Characters can share another character's blink and mouth art (`look`) and appear only when
  their `requires` are met; that is how Pearlina, Kelp, Gus and Professor Bubble join the
  Moonlight Festival once all five pearls are found.
- Mini games (`components/apps/finn/MiniGames.tsx`): a reply with `effects.game` opens one; the
  first win sets `won-<game>` and adds the sea star `star-<game>` (`SEA_STARS_PLACED` is 3). The
  same file draws the painted Professor's map, which opens by itself once (`map-seen`).
- Anything that gives Finn something glows and twinkles until it is taken; pearls lying in the
  open are drawn at one size and bob.
- The Notebook's "What should I do next?" reads `NEXT_STEPS` in `lib/finn/content.ts`. Any change
  to the puzzle chain must be mirrored there.
- Finn stops beside what he is dealing with and never on top of another character
  (`besideTarget` in `staging.ts`).

## Conventions and working rules

- **No comments in the code**, by Molly's choice. The documents carry the explanations. Build
  directives the tools need (`eslint-disable` lines) stay.
- **No em dashes in anything a player reads.** Short hyphens are fine in moderation.
- Finish with existing assets first, and prefer editing an existing screen over adding a system.
- Keep `store/save.ts` about the machine only.
- Dependency upgrades (Next, React) are a separate, deliberate task.
- Every change updates the README, this file, the notes and `docs/HANDOFF.md` in the same pass.
- Every big change gets a bug pass with `tools/tests/` (see its README): at least the whole
  machine regression, and for Finn the playthrough and the content audit.
