# Iron Front — project instructions

WW2 top-down tank combat game. Single self-contained HTML file: all markup,
CSS, and JavaScript (game loop, rendering, audio, tank/map data) live in one
file. No build step, no dependencies — open the file in a browser to play.

## Branching — work off `main`

- **Develop directly on `main`.** Commit and push changes to `main`; keep it
  up to date as the single source of truth. Do not spin up long-lived feature
  branches unless explicitly asked.
- `git push -u origin main` after committing.
- `main` is the deploy branch — GitHub Pages serves from it, so anything pushed
  to `main` goes live.

## Files

- `ww2tanks.html` — the game (the file that gets edited).
- `index.html` — an identical copy so the Pages root URL (`/`) works. **Keep it
  in sync with `ww2tanks.html`** — after editing the game, copy it over:
  `cp ww2tanks.html index.html` and commit both.

## Verifying changes

There is no test suite. Verify in a headless browser with Playwright:

```js
// launch Chromium (pre-installed), load file:///…/ww2tanks.html,
// call startGame() in page context, drive with WASD + mouse,
// screenshot, and assert no console/pageerror events.
```

Watch for `pageerror`/`console.error` — a clean run with the battlefield
rendering is the bar. Capture a screenshot to eyeball graphics changes.

## Code orientation

- Tank stats/roster: `TANK_DEFS` array. Tank silhouettes: `TANK_PROFILES` +
  `drawTankFull` / `_hull` / `_turret` / `_casemate`.
- Terrain: `buildGround` → `_renderTile` (per-terrain tiles) + `_addWorldVariation`
  (decals) + `_drawRoads`.
- The **P.1000 Ratte** is an **enemy-only boss** (RATTE WAVES mode). It is not a
  playable tank — keep it out of the garage, tech tree, and default loadout.
