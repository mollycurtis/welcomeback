# Tests

Automated checks, all run against a **built** copy of the site with Playwright and Chromium.

## Setup

```bash
pip install playwright pillow numpy
playwright install chromium
npm run build                                   # static export into out/
python3 -m http.server 4321 --directory out     # serve it (any static server works)
```

Run each script from the project root, in a second terminal, while the site is being served.

## The checks

| Script | What it checks |
|---|---|
| `machine_qa.py` | The whole machine at 1440 by 900: boot, every program, documents, the Recycle Bin, mail, and a text sharpness check. 45 checks |
| `machine_qa_wide.py` | The same at 1905 by 910, where the blurred sides show |
| `chat_test.py` | Chatterbox: the starting badge, the waiting message, replies to typed lines, Maddie's five minute message, the too small screen |
| `fitcheck.py` | The whole room shows at eight screen sizes, with the screen and power button in view |
| `turnoff_test.py` | The Turn off computer box from the power button, Start and the login screen: Cancel, Stand By, Restart, Turn Off |
| `newplayer_checks.py` | A first visit: the power light, typing straight into Notepad, TypeRight and a chat, Sarah's answer, the iFind start card, the AskBeeves addresses, History, Log Off |
| `finn_audit.mjs` | Static check of `lib/finn/content.ts`: every item obtainable, every requirement satisfiable, no dangling references. Run with `node tools/tests/finn_audit.mjs`; it ends with "PROBLEMS: 0" |
| `finn_playthrough.py` | Finn the Fish from New Game to the ending: every puzzle, hand in, pickup and room change. 53 checks |
| `finn_minigames_test.py` | Wins all three Finn mini games and checks the Professor's map opens by itself |

Helpers: `lib.py` (boots the machine), `finn_helpers.py` (jumps a Finn save to any scene),
`shotlib.py` (screenshots for the playthrough).

## Settings

All optional: `BASE_URL` (default `http://localhost:4321/`), `SHOT_DIR` (where screenshots go;
default `tools/tests/screenshots/`, which is gitignored).

## Test hooks in the game

- `window.__FINN_FAST__` makes Finn's swims and item flights resolve instantly, so a click by
  click run takes minutes. The scripts set it; the game never does.
- `window.__FINN_FULL__` pins Finn's visual quality at full for screen recordings by switching
  off the runtime performance governor. Never set by the game.

## Last results (V15)

Whole machine 45 of 45 (text sharp), Chatterbox passed, room fit 8 of 8, turn off box passed,
first visit checks passed, Finn audit 0 problems, playthrough 53 of 53, all three mini games won.
