# Daniele Bros Games — project instructions

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

- `index.html` — the **games hub** (landing page). It is NOT a copy of a game.
  Games are listed in the `GAMES` array at the bottom of the file; when you
  add a new game file, add one entry there so it shows up on the site.
- `ww2tanks.html` — **Iron Front**, WW2 top-down tank combat.
- `command.html` — **Iron Battle**, flat-map real-time strategy.
- `minecraft.html` — **Ironcraft**, Minecraft-style voxel survival (WebGL2).

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
