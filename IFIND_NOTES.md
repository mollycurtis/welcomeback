# iFind: build notes

## The game
**Hidden object.** A cluttered photographic scene, a rhyming clue on a thin
strip below the picture, and every object named in the rhyme is somewhere in the photo.
Click it and the words are struck through. One round per scene: find everything named in
the rhyme, once.

Every rhyme opens "I find ...". Nothing in the game says "I spy": the game is iFind and
the copy matches it. (`kind: 'spy'` survives in the data as an internal name only.)

A second puzzle type, `compare` (spot the difference), is supported by the same engine
but is not the house style. It does not use the rhyme, because naming the differences
would give them away.

## Look
Deliberately nothing like Maple Grove. Dark stained wood, brass plaques, parchment, a
serif face for all reading text. No blue, no cartoon panels, no rounded sans serif.

**Body and riddle text: Trajan Pro, with Cinzel as the typeface that actually ships.**
`IF_SERIF` in `ui.tsx` names `'Trajan Pro', 'Trajan Pro 3', Cinzel, Georgia, ...` in that
order. Trajan Pro itself is a commercial Adobe face with no self-hostable web license, so
it is not and cannot be bundled the way `@fontsource/vt323` is for the BIOS text; the name
is there only so it renders for the rare visitor who happens to have it installed
locally. Cinzel is the real typeface: same Roman inscriptional capital tradition, open
SIL OFL license, self-hosted via `@fontsource/cinzel` in `app/layout.tsx`, so it works
offline with no font request at runtime.

## Homepage
The homepage is one piece of art, `public/ifind/ui/home.jpg` (1536x1024, same convention
as the scene photos), with the "iFind" wordmark and the "Start Exploring" button already
painted in. `IFind.tsx`'s `Home` component lays it full bleed with `useCoverBox` in
`'cover'` mode (the same hook `PuzzleScreen` uses for hotspots, in `'contain'` mode; see
Layout below) and places a real, invisible, accessible button over the painted button at
its measured box in picture space: x 0.322 to 0.678, y 0.517 to 0.598. Percentage CSS
would have drifted the moment the container's aspect ratio stopped matching the photo's,
which it always does on the CRT, so this goes through the same cover maths as everything
else rather than eyeballed percentages. A solved-progress line ("N of 6 solved, M stars")
sits on the bare tabletop just under the button once there is any progress to show;
nothing renders there before the first scene is solved.

## Adding a scene
1. Put the picture at `public/ifind/<id>/scene.jpg`
2. Add a record to `PUZZLES` in `lib/ifind/puzzles.ts`, including a `difficulty`
   (`'easy' | 'medium' | 'hard'`); the picker sorts and colour codes on this
3. One `target` per object named in the rhyme, with its normalized box (0 to 1 against
   the full photo; see Layout below for why there is no keep out band to worry about)
4. Write the `riddle` as **one flowing sentence** (a single string in the array). Each
   target's `label` must appear verbatim in the text, in lower case. That is how the
   strike through finds it.

Coordinates are normalized 0 to 1, so hotspots stay right at any window size.
No new components are ever needed for a new scene.

**Six scenes are installed:** The Busy Desk, The Office, The Bedroom, The Kitchen, The
Antique Store, The Garage; one round each, 58 objects total. There used to be an
optional second, harder riddle over the same photo for every scene; that has been removed
on purpose, so a scene is one picture and one round. If it comes back later, or new
scenes get added, that shape is in git history rather than half-built here. The picker
still has a proper empty state for the case where the list is empty.

Two boxes are loose and worth tightening if the art ever changes: the shed's red tool
chest box is mostly the car lift's arm, and the office's wooden-chest-shaped box (long
since removed as a target) used to be offset; worth a fresh look if that scene's boxes
are ever revisited.

## Layout
The scene **letterboxes, it does not crop.** `useCoverBox(sceneW, sceneH, 'contain')` in
`ui.tsx` sizes the photo to fit entirely inside its space (pillarboxed or letterboxed as
the aspect ratio needs), the same hook and reasoning as the homepage's full-bleed
`'cover'` mode, just with `Math.min` instead of `Math.max` picking the scale. A click that
lands in the letterbox bars (real dead space now, not part of the photo) does nothing ; 
it is explicitly not scored as a miss.

The screen is a normal flex column, three stacked regions, nothing floating over anything
else:
- a 24px top bar (Menu, room name, Found n/N, timer, Hint)
- the scene, flex: 1, taking whatever space is left
- a thin clue strip below it, height set by its own content (small text, usually wraps to
  two lines on the longer riddles)

This replaced an earlier full-bleed `'cover'` layout where the header and the clue strip
floated on top of the picture, cropping part of it away and hiding another part under the
chrome. That meant a real, recurring fight: an object drawn near the bottom of a photo (a
cat on the floor, a book on the carpet) would end up physically underneath the clue strip,
unreachable, and the fix at the time was making the clue strip click-through and fade to
14% opacity under the pointer so a click could reach through it to the picture. That fade
was the whole cause of "the clue bar goes invisible when I try to click near it"; it was
worn as a workaround, not a bug in itself, and it is gone now along with the layout
problem that required it. With the photo fully visible in its own region and the chrome
in strips above and below rather than on top, **every pixel of every photo is on screen
and clickable, so there is no keep out band to author around at all.** Put a target
wherever its object actually is.

**Geometry note, still true and still the thing to get right first:** the machine applies
a CSS scale transform when you zoom into the computer. All hotspot maths uses
`offsetWidth`/`offsetHeight` (layout pixels) and converts pointer coordinates back into
layout space, so the overlays never get scaled twice. Using `getBoundingClientRect` here
put every ring in the wrong place on the live site, the first time this was built, and
separately caused GameShell's arcade Stage to never shrink games to fit the screen the
second time a variant of the same bug showed up elsewhere in the project. If a future
overlay problem shows up as "off by some scale factor," check this first.

**The hint ring is sized to the actual object**, not a fixed dot at its centre. A 10px dot
at the exact centre of, say, a coffee mug rendered fine and animated fine, but was easy to
miss entirely on a busy photo; it looked like the Hint button did nothing. It has a white
halo via `filter: drop-shadow(...)` (deliberately not `box-shadow`, which the `.ifind-hint`
pulse animation in `globals.css` already owns and would otherwise fight with).

## Rules as built
- **Countdown clock: 12 seconds to read the rhyme, plus 10 / 9 / 8 seconds per object by
  difficulty, rounded to the nearest 5.** It used to be a flat 45 / 90 / 120 per
  difficulty, which made the EASY scenes the harshest, because easy scenes have the fewest
  objects: 45 seconds over 8 objects is 5.6 seconds each, while a hard scene got 10 seconds
  each. Deriving it from the object count also means the clock stays right by itself when
  a scene gains or loses an object. These numbers are reasoned, not play-tested cold.
  Worth timing yourself once.
- Out of time ends the round and offers Try again. No lives, no lockout.
- A wrong click costs 2 seconds. A hint costs 5, highlights the object's real size and
  shape for about two seconds, and cannot be re-used while one is already showing.
- **Sound.** iFind has its own voice in `lib/sounds.ts` (`ifindFound`, `ifindWrong`,
  `ifindHint`, `ifindTick`, `ifindWin`, `ifindTimeUp`) rather than borrowing the desktop's
  generic blips. The find chime climbs in pitch with the streak and resets on a miss. The
  clock only becomes audible in the last ten seconds and tightens in the last five; a tick
  running the whole round would be unbearable. `ifindFold` is still defined but unused
  now that the clue strip has no fold button.
- Stars from time left and mistakes. No score number.
- Nothing is locked. All scenes playable from the start. The picker sorts easiest to
  hardest (`PUZZLES_BY_DIFFICULTY` in `puzzles.ts`) and colour codes the label green
  (easy), gold (medium), red (hard); plain Easy / Medium / Hard, no flavour words.
- Session scoped save (`welcome-back/ifind`), matching Maple Grove, so the machine
  still forgets on shutdown. `ShutdownScreen` calls `useIFind.getState().resetAll()`
  next to the Maple Grove one.
- **Overlapping boxes: the smallest box the click lands in wins.** Some objects sit
  wholly inside another, the glasses lie on the newspaper, the tool chest stands under
  the car lift. Before this, whichever was listed first swallowed the other and the
  inner object could only be found in one particular order.

## Fixed in V9 review
- **"Next scene" left the win card on screen.** `IFind.tsx` renders `<PuzzleScreen>` with
  a `key={puzzle.id}`. Without it React kept the same instance when the puzzle prop
  changed, so `status` stayed `'won'` and the finished card sat over the new room with no
  way out. Any future round-switching must keep that key.
- **Found rings are solid now**: thicker, a dark outer edge and a faint gold fill. Thin
  translucent rings were unreadable on a busy photo and blurred together where two finds
  were close.
- **The Office lost two targets.** The computer mouse overlapped the printer and the
  cordless phone, and "a potted plant" was ambiguous in a room with four of them. Seven
  targets now, riddle updated.
- **The Antique Store birdcage box** was too short to hit; taller and re-centred. "A
  carriage clock" and "a stone jug" renamed to "a small gold clock" and "a tall clay pot",
  which is what they actually look like.
- **The Garage tool chest box** narrowed so its ring stops enclosing the black box beside it.

## October 2026 fixes

Four boxes were measured again off the photos and checked by clicking them in the game:
the kitchen rag in The Office (it hangs on the oven door through the doorway, not by the
patio door), the polaroid in The Busy Desk (on the book stack, not the laptop), the old
camera in The Antique Store (on the shelf, not the books below it), and in The Kitchen
"a bowl of fruit" is gone (the photo has two bowls) and "a bird" on the windowsill takes
its place. Wording: "a boom box" is now "a CD player" and "a small gold clock" is now
"a gold clock". Still 58 objects.

## Why the photos have bars down the sides
They are 3:2 and the scene area is about 2:1. Filling the width would crop **28.5% off the
height of every photo**, and in a hidden object game that means losing objects outright:
the antique store's brass elephant sits at y 0.86 and would be cut in half. So the photo
stays contained and the bars are dressed as the frame they are, dark wood with a vignette
and a drop shadow on the plate.

**To get true full width, the six scenes need regenerating at 2:1 (1536x768).** Everything
else would then need remeasuring against the new crops, the same contact-sheet pass as
before.

## Open question
The GDD specified spot the difference; the reference images are all hidden object. This build
makes hidden object primary. If some scenes should still be compare puzzles, they can be, with
no code changes.

## Start card and clue strip

The start card shows the scene name, the count and time, and one line on how to play: "Find
each thing from the riddle below and click it." The clue strip under the picture is 11.5px and
semibold so the riddle is easy to read.
