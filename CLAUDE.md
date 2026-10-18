# Iron Games — project instructions

A collection of browser games plus a landing page that links them. Every game
is a single self-contained HTML file: all markup, CSS, and JavaScript (game
loop, rendering, audio, data) live in one file. No build step, no
dependencies — open the file in a browser to play.

## Branching — work off `main`

- **Develop directly on `main`.** Commit and push changes to `main`; keep it
  up to date as the single source of truth.
- **No pull requests.** Do not create PRs and do not suggest creating them.
  Do not spin up feature branches. Work only on `main`.
- `git push -u origin main` after committing.
- `main` is the deploy branch — GitHub Pages serves from it, so anything pushed
  to `main` goes live.

## Files

- `index.html` — the **Iron Games hub** (landing page). It is NOT a copy of a game.
  Games are static `<article class="card">` blocks inside `#games` (kept as
  plain HTML so search and AI crawlers that do not run JavaScript can read
  them); when you add a new game file, copy one card. Also add the game to the
  FAQ/structured data in `index.html`, `sitemap.xml` and `llms.txt`.
- `ww2tanks.html` — **Iron Front**, WW2 top-down tank combat.
- `command.html` — **Iron Battle**, flat-map real-time strategy.
- `minecraft.html` — **Ironcraft**, Minecraft-style voxel survival (WebGL2). Fun mods live in `MODN` + `modsOf`/`applyModsLive` defaults + a `.modbtn` in the fun menu; a recipe gated by a mod carries `mod:"key"` (Leaf Doors: block 145, recipe from any leaves). Multiplayer: host runs the mobs and streams them (`mpMobTick`/`mpMobsIn`), guests mirror them (`Mob.remote`) and send hits (`mh`) and interactions (`mset`) back.
- `ironhook.html` — **Iron Hook**, canvas fishing game (cast, sink, bite, reel minigame, species log, shop).
- `worker/mod-ai/` — optional Cloudflare Worker (not served by Pages) that checks Mod Maker photos with Claude; the game calls it only when `MOD_AI_ENDPOINT` in `minecraft.html` is set.
- `ironjaws.html` — **Iron Jaws**, Hunt-the-Wumpus style shark hunt on the classic 20-cave dodecahedron.
- `irontrail.html` — **Iron Trail**, Oregon Trail style wagon journey (canvas scene + side panel, hunting minigame, rivers, forts, events).
- `ironrocks.html` — **Iron Rocks**, Asteroids style vector shooter (saucers, hyperspace, touch buttons).
- `ironserpent.html` — **Iron Serpent**, snake with golden apples, mushrooms and iron walls (solid or wrap edges).
- `ironhammer.html` — **Iron Hammer**, mine (side-view digging) → forge (smelt + hammer timing minigame) → army (side-scrolling medieval battles); localStorage save `ih_save`.
- `ironpaws.html` — **Iron Paws**, cozy pet shelter (needs bars, bubble/ball minigames, tricks, pet shows, decor); save `ip_save`.
- `ironbakery.html` — **Iron Bakery**, cake shop time management (orders, ovens, icing/topping, upgrades by day); save `ib_save`.
- `ironstyle.html` — **Iron Style**, fashion studio dress-up (parts + colours, backdrops, runway challenge scoring, PNG download); save `is_style`.
- `irongarden.html` — **Iron Garden**, cozy garden (plots, seeds by level, water/plant/harvest/dig tools, snails, weather, day cycle, shop); save `ig_save`.
- `ironaquarium.html` — **Iron Aquarium**, fish tank (FISH/DECOR tables, tap-to-feed flakes, algae overlay + wipe tool, happiness → coins); save `ia_save`.
- `ironbouquet.html` — **Iron Bouquet**, flower shop (FLOWERS with hue/mood/lvl, WRAPS/RIBBONS, random orders, `score()` → stars/pay/xp); save `ibq_save`.
- `ironroom.html` — **Iron Room**, room designer (WALLS/FLOORS, ITEMS incl. wall-only items, drag/select/flip/recolour/front/remove, saved rooms, PNG); save `iroom`.
- `ironjigsaw.html` — **Iron Jigsaw**, jigsaw (6 `paintScene` scenes, sizes 3-6, drag-and-snap, peek, timer); best times `ij_best`.
- `ironmemory.html` — **Iron Memory**, memory pairs (DOM cards, emoji themes, 4 sizes, CSS flip, moves/time); best `im_best`.
- `ironcolors.html` — **Iron Colors**, colour-by-number (16x16 PICS + blank, PAL palette, hints, fill-all, progress, PNG); save `ic_colors`.
- `irontunes.html` — **Iron Tunes**, music grid (16 steps x 9 rows, INST bells/harp/organ/synth, SONGS presets, tempo, random); save `it_tunes`.
- `irongems.html` — **Iron Gems**, match-3 (8x8, `matches()`, `findMove()`, async `trySwap` cascades/chains, level targets); best `igm_best`.
- `ironmeadow.html` — **Iron Meadow**, butterfly catching (12 SPECIES by rarity/time, TIMES cycle, net swing radius, scare radius, book, shop); save `imd_save`.
- `ironguns.html` — **Iron Guns**, top-down turtle battle royale (WEAPONS/RAR tables, chests + items, trees/rocks → wood/stone, Q builds walls, tide circle in `tickTide`, bot AI in `botThink`); save `igun_save`.

## Verifying changes

There is no test suite. Verify in a headless browser with Playwright:

```js
// launch Chromium (pre-installed), load file:///…/ww2tanks.html,
// call startGame() in page context, drive with WASD + mouse,
// screenshot, and assert no console/pageerror events.
```

Watch for `pageerror`/`console.error` — a clean run with the battlefield
rendering is the bar. Capture a screenshot to eyeball graphics changes.

## Code orientation (Iron Front)

- Tank stats/roster: `TANK_DEFS` array. Tank silhouettes: `TANK_PROFILES` +
  `drawTankFull` / `_hull` / `_turret` / `_casemate`.
- Terrain: `buildGround` → `_renderTile` (per-terrain tiles) + `_addWorldVariation`
  (decals) + `_drawRoads`.
- The **P.1000 Ratte** is an **enemy-only boss** (RATTE WAVES mode). It is not a
  playable tank — keep it out of the garage, tech tree, and default loadout.
