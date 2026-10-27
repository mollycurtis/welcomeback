# Finn the Fish

**Status: complete and playable.** 24 scenes in seven regions, 16 characters, 19 items, a main
path of 26 steps from the first clue to the ending, an optional side quest and 3 mini games, each worth one sea star.
About 35 to 45 minutes. Everything below describes the game as it is now; this file is updated
with every change.

## The story

The five Moon Pearls are missing from the Moon Shell on the day of the Moonlight Festival.
Finn asks around, follows Pearlina's blue pouch (all five pearls were in it; Gus carried it and wrote down where he left it, but can't read his list without his glasses) from Pearlina to Gus to the Festival Grounds, and
takes it to Professor Bubble, who spots the hole in the bottom: nobody stole the pearls, the
water carried them away. The Professor's map shows five quiet places where the water slows
down, and Finn finds a pearl in each one, then puts all five back in the Moon Shell.

## How it plays

- **Click** anything; most things say something back. **Talk** to everyone, then talk again.
- **The pouch** (bottom left) holds what Finn picks up. Click an item, then click where it
  goes. Two items can be put together the same way (the wrench halves).
- **Sparkles**: things you can pick up sparkle, and so does the place a carried item goes,
  while you carry it. The how to play card and the Notebook both say so.
- **Finn says what is next.** The moment a step is done, Finn adds a line about the next one.
- **The Notebook** keeps pages of what Finn has learned, wondering questions with three hints
  each (gentlest first), and a "What should I do next?" button.
- **The map** from Professor Bubble opens when clicked in the pouch: the five pearl places,
  crossed off as they are found.
- **Tools are used up** on their last job (rope, lantern, crowbar, oil can). On the main path
  the pouch ends with just the map.
- **The Moon Shell** takes any pearl, or a plain click once all five are in the pouch. The
  pearls appear in its settings one by one, then the ending card plays (Keep swimming or Back
  to the title).
- **Conversations remember.** A question already answered disappears; after an answer the
  other questions come back, with "Goodbye for now."; talking to someone again repeats only the
  last line of what they said.
- **Saves** last for the session only; shutting the computer down or closing the tab resets.
- **Clicking a line that is still typing** shows the whole line; the next click moves on.

## The route

1. **Coral Cove**: Moon Shell Plaza (Pearlina, Kelp), Coral Gardens (Gus; the shell opener is
   in the anemone, his glasses are in his old shell), Finn's Neighborhood (Nib), Coral Cove
   Shops (Sandy).
2. **Bubble Bay**: Market (Coco and Bibi), Marina's Repair Shop (Marina; the oil can), The
   Bubble Cafe (Mr Claw), The Docks (Captain Barnacle; the wrench handle under the boat),
   Festival Grounds (Pip, Foreman Dug; the blue pouch behind the stacked crates; the banner).
3. **Sunken Garden**: Kelp Forest (the seaweed rope), Flower Garden (Drift; the Green Pearl in
   the flowerbed), Hidden Grotto (the Red Pearl in the old clay pot, found with the lantern; the
   glowing pool for the jar). The lantern lights the pot, then the Red Pearl appears and is
   picked up.
4. **Deep Trench**: Trench Edge (Bubbles; the wrench head on the first ledge, reached with the
   rope), Abandoned Tunnel (the lantern), Deep Cave (Professor Bubble: the pouch gets the map).
5. **Pearl Reef**: The Reef Gate (open once Marina has her wrench), Ancient Reef (Mr Sable),
   Pearl Shrine (the White Pearl on the altar).
6. **Sunken Ship**: the ship (the Blue Pearl in the sand), Cargo Hold (the crowbar; the
   strongbox), The Captain's Cabin (the stuck drawer), Treasure Room (the Gold Pearl in the shut
   chest, opened with the crowbar).
7. **Moonlight Island**: The Moonlight Festival (Pearlina, Kelp, Gus and Professor Bubble once
   all five pearls are found; Kelp hosts the fish count), Moon Shell Chamber (the ending).

## The main path

Pearlina, then Gus, the shell opener, his old shell, his glasses back to Gus, the blue pouch
behind the crates, the pouch to Professor Bubble for the map, the Green Pearl, the lantern and
the Red Pearl, Foreman Dug, Captain Barnacle, the wrench handle, Bubbles, the seaweed rope and
the wrench head, the wrench put together and given to Marina, the White Pearl, the Blue Pearl,
the crowbar and the Gold Pearl, then the Moon Shell. The exact steps, with the Notebook hint
and Finn's line for each, are `NEXT_STEPS` in `lib/finn/content.ts`.

## The side quest

Optional. The oil can opens the stuck drawer for a key; the key opens the strongbox for a jar;
the jar is filled at the glowing pool and given to Professor Bubble, who thanks Finn. The banner
from the Festival Grounds goes to Foreman Dug, who thanks him too. Neither gives a sea star.

## Conversations that could not be finished

Two talks used to be a dead end if the player said "Goodbye for now." before asking the key
question: Pearlina's (who had the pouch) and Gus's (where his glasses are). Their follow up
lines now set the same flags (`knows-gus`, `knows-shell`), so the story always continues.

## The shell in Moon Shell Plaza

The big shell in the plaza is a statue (label "The Shell Statue"), painted with three pearls. Finn admires it and says the real Moon Shell is out at the festival, waiting for its five pearls. The real Moon Shell, with its five spots, is in the Moon Shell Chamber at the end.

## Who is talking

The name above a line is whoever says it. Finn's own hint lines (the "say" of each next step)
are tagged in code (`FINN_LINE` in `AdventureScreen.tsx`): inside a conversation or right after
someone gives Finn a reaction they show as "Finn"; when Finn is on his own they show no name.
A hint that becomes due during a conversation waits until the conversation ends, and is only said
if it still applies, so Finn never says "I should ask Pearlina..." while talking to Pearlina.

## Mini games and sea stars

There are exactly three sea stars, one for winning each mini game the first time. Each game is
offered by its host in conversation ("Yes! Let's play!" or "Maybe later") and can be played
again any time, without another star. They sit early, middle and late in the game:

- Shell game, Coco at the Market: watch the pearl go under a shell, the shells swap seven
  times, then pick the right one. One find wins.
- Sea quiz, Professor Bubble in the Deep Cave: "Which one is a jellyfish?" with three pictures
  on his chalkboard, five questions in a row. Crabs and lobsters are never asked against each
  other. The animals are the game's own characters (Marina, Captain Barnacle, Drift, Foreman
  Dug, Sandy, Bubbles, Mr Sable, Mr Claw) plus a seahorse.
- Fish count, Kelp at the Moonlight Festival: three rounds of counting fish, the last one counting
  only the purple ones. The fish are Molly's yellow fish recoloured orange, purple and green
  (only the body changes; eyes and smile stay).

A wrong answer just says to try again. Each game opens with bubbles rising over a blue wash
while it fades in (opacity only, no zoom). In the shell game the pearl sits fully under its
shell and a lifted shell rises high enough to show it. How to play mentions that friends have
games to play, and the Notebook and the ending say "Sea stars won: x of 3".

## The Professor's map

The map item opens Molly's painted map of the whole sea with the five pearl spots pinned on it:
Flower Garden and Hidden Grotto on the garden island, Pearl Shrine on the reef, the Sunken Ship
and the Treasure Room by the ship. A found pearl's spot is ticked and crossed off. The map opens
by itself the first time Finn gets it, so every player sees it; after that it opens from the
pouch, as Finn says ("I can open it and look anytime!"). There is no travel map; Molly decided
against one because the seven regions hold 24 places and picking one would get messy.

## Writing voice

Every line is written for kids, in the spirit of Freddi Fish. New lines follow the same rules:

- Short sentences and simple words. No big words.
- Finn speaks for himself about what he sees and does: "A gold pearl! I'll take it!"
- Other characters talk simply and warmly, each with one clear personality: Pearlina worried
  and kind, Kelp excited, Gus forgetful and sweet, the twins finishing each other's sentences,
  Marina busy, Mr Claw grumpy, Captain Barnacle full of silly stories, Pip excited, Foreman Dug
  busy, Drift dreamy, Bubbles scared, Professor Bubble thrilled by science, Mr Sable polite.
- Silly and earnest, never sarcastic. Simple questions are fine.
- No dashes or hyphens in visible text, and typographic apostrophes.

## Clickpoints and staging

- The dialogue card covers the picture from y 0.64 to 0.81 and sits above hotspots, so
  clickpoints are kept above y 0.64.
- Finn never parks on an essential clickpoint, including one that has not appeared yet, and
  floats above a character when both sides are taken. Pip, Captain Barnacle and Bubbles stand
  clear of the crates, the boat and the ledge.
- Hover labels clear when the room changes.

## Art and animation

The title screen has slow rising bubbles over the home painting.

Gus has no glasses until Finn gives them back: his character has `spriteBefore` (`gus-noglasses-idle.png`, Molly's glasses-free painting, lined up with the old sprite by his eyes so his blinking and talking still fit) until the flag `gus-remembers`. He only uses his idle sprite, because his mouth is animated.

- Scenes: 24 paintings, 1536 x 1024, in `public/finn/scenes/`.
- Characters: one sprite each with blink and mouth overlays; they blink, talk and fidget.
- 11 click gags with sound effects. No new click gags.
- Every scene has its own ambience (bubbles, fish, light); the festival and the chamber also
  twinkle. Pearls lying in the open are drawn in the scene at one size and bob slightly.
- The festival crowd reuses the characters' art: each festival character names the original in
  `look`, so its blinking and talking work, and appears only once all five pearls are found.

## Files

- `lib/finn/content.ts`: every scene, character, item, line, Notebook page, wondering question
  and step.
- `lib/finn/types.ts`, `lib/finn/engine.ts`: the data shapes and the rules that apply effects.
- `components/apps/finn/MiniGames.tsx`: the shell game, the sea quiz, the fish count and the
  painted Professor's map. Their art is in `public/finn/minigames/`.
- `components/apps/finn/AdventureScreen.tsx`: the game screen, the pouch, conversations, the
  ending.
- `components/apps/finn/FinnActor.tsx`: Finn himself: swimming, turning, blinking, gestures.
- `components/apps/finn/ambient.ts`: the live bubbles, specks and sparkles.
- `components/apps/finn/staging.ts`: where Finn swims to.
- `lib/finn/ambience.ts`, `lib/finn/gags.ts`: the moving water and the click gags.
- `components/apps/finn/Finn.tsx`, `components/apps/finn/ui.tsx`: the title screen, options and
  how to play.
- `store/finn.ts`: the save, kept for the session.

## Testing

The full playthrough (`tools/tests/finn_playthrough.py`) plays the main path start to finish in
53 checks, `finn_audit.mjs` checks every exit, item, flag and scene is connected, and
`finn_minigames_test.py` wins all three mini games. Last run: 53 of 53, 0 problems, all three
games won.

## In progress

- Optional art: a whale, a dolphin and a stingray for the sea quiz. Each one is a single line
  in `CREATURES` in `components/apps/finn/MiniGames.tsx` once it arrives.
