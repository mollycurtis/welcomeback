# Welcome Back: handoff

Where the project stands, the decisions that stay decided, and how it got here. Current
version: **V15** (October 2026), the version for launch.

## Status

Complete. The machine, every desktop program, the pretend internet, and three playable worlds
(Maple Grove, iFind, Finn the Fish). Petville and Penguin Cove are coming soon pages on purpose.
Next steps are deployment only: put the folder on GitHub, deploy it on Vercel with the
environment variables (`DEPLOYMENT.md`), test the idea form once on the live site, check it on a
phone and an iPad in Safari, then make the repository private.

## Standing decisions (do not reopen)

- No em dashes in visible text; short hyphens are fine in moderation.
- No comments in the code (only `eslint-disable` directives).
- Animations always play; no `prefers-reduced-motion` checks.
- The family lives in Minnesota: Peggy (mom), Daniel (dad), Sarah, and the player, whose
  screen name is macgruber7. Grandma lives in Fargo. Tucker is Maddie's dog, which the family
  sometimes dog sits.
- No hint for the login password: any password works, and that is the surprise. The only cue to
  start is the red power light, which turns green.
- On computers the whole room shows, with a dark blurred copy of the room around it; no edge
  blend. Tablets fill the screen.
- Every world resets when the computer shuts down. Saves are for the session only.
- Finn: no music, no voices, no travel map (the painted map is the Professor's map instead), three
  sea stars (one per mini game), mini games spaced early (shell game, Coco), middle (sea quiz,
  Professor Bubble) and late (fish count, Kelp at the festival).
- The copyright line reads 2027; Molly kept it.
- Every change updates the README, ARCHITECTURE, the notes and this file, and gets a bug pass with
  `tools/tests/`.

## Optional, not needed for launch

- Art for three more sea quiz animals (a whale, a dolphin, a stingray); prompts are in
  `docs/asset-prompts.md`. Each is one line in `CREATURES` in `components/apps/finn/MiniGames.tsx`.

## Version history

- **V13**: the original room photo kept (new room photos looked AI generated). Room fit and
  screen rectangle measured.
- **V14**: Finn rewritten for kids in the spirit of Freddi Fish (all player text), Island
  Shallows removed, sparkles, Finn's next step lines, the clay pot red glow, the Moon Shell
  settings. Chatterbox reply engine. Session only saves everywhere. Icons smoothed, too small
  screen reworded, under construction pages with the idea form. Finn's three mini games and the
  painted Professor's map from Molly's art; sea stars cut to three. Glasses free Gus until Finn
  returns his glasses. The power light, the Turn off computer box, Log Off confirmation, typing
  cursors, Chatterbox follow ups, AskBeeves addresses, lossless image compression, the link
  preview.
- **V15**: the swaying tree rebuilt without seams, rounded top screen corners, the cell phone
  icon for Sarah and Dad, nine emails, one clear pouch story, Finn's name on his own lines, the
  shell statue in the plaza, conversations that remember, the festival crowd, the fish count moved
  to Kelp, pearls at one size and a visible red pearl, Pixel Quest gnomes that find their way,
  Pinball that no longer lets the ball slip through (and slightly longer flippers), the Calendar
  opening on June's list with Sarah's piano shown as a practice, each email's To line (Aunt
  Jean's note about lefse at Grandma's), a smoother close look and zoom, the AskBeeves home page
  help removed, Sarah's waiting message stamped with the player's own time (and no "at 7"), a
  kinder Sarah, a slightly slower pinball, Pixel Quest gnomes that start apart and set off sooner,
  and a full audit of the code and documents.

## Tests

See `tools/tests/README.md`. Last results: whole machine 45 of 45, Chatterbox passed, room fit
8 of 8, turn off box passed, first visit checks passed, Finn audit 0 problems, playthrough 53 of
53, all three mini games won.
