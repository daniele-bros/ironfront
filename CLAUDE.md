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
- `minecraft.html` — **Ironcraft**, Minecraft-style voxel survival (WebGL2). Fun mods live in `MODN` + `modsOf`/`applyModsLive` defaults + a `.modbtn` in the fun menu; a recipe gated by a mod carries `mod:"key"` (Leaf Doors: block 145, recipe from any leaves; Nukes: block 151, `NukeEntity` 10 s fuse, `nukeExplode` sets `game.nuke` and `tickNuke` carves the crater shell by shell, scorches the rim and spawns the mushroom cloud; synced in multiplayer by one `nuke` packet; nuke timers `game.nukeTimers` + `tickNukeTimers` + `#nukeTimerGui`, saved as `save.nukeT`; Missile Silo block 155 with `siloGui` map from `world.columnInfo`, `NukeMissile` entity, `missile` packet). World height `CH=228` (`GH=128` is the generator height; `cidx` is `(x<<12)|(z<<8)|y`, old saves migrated by `migrateSaveHeight`). Military: `/spawn airfield|military_base|bunker|missile_base` builders before `SPAWN_STRUCT`; tank = MOBDEF `tank` (egg item 450, `rideTank`/`renderTank`/`TankShell`). Fun mods also: `camping` (campfire 156, tent 157, lantern 158, items 456-459/465) and `war` (`KITS.war`, `vehScale`/`vehSpd` real-size vehicles, ships `boat_pt`/`destroyer` (eggs 445/446) with `SEATS[kind]`, `rideShip`/`renderShip`; war-only guns 517-526 + ammo 527/528, flak cannon item 159 = MOBDEF `flak`). Engine item 454 in every vehicle recipe; rocket launcher 451/rockets 452; silo map 64 chunks with zoom. Vehicles: `car`/`jet`/`bomber`/`tank`/`heli` (453, `rideHeli`)/`sub` (455, torpedo 447, `rideSub`)/`a10` (444, `fireGau8`)/`mortar` (442, shells 443, `rideMortar`)/`howitzer` (529, shells 530, `rideHowitzer`, `howSolve`, `/target`, towing `howHitch`) are MOBDEF entries with `vehicle:`; chase camera `vehCamUpdate`/`game.vcam` (P cycles); War campaign: MOBDEF `soldier` (`soldierTick`, `spawnWarSquad(team,n,x,z,opts)`, patrols in `soldierWarTick`, eggs 448/449), enemy AI aircraft `aiEnemy` + `aiPilotTick`/`spawnEnemyAircraft`, loot tiers `LOOT.common/rare/military` + `rollLoot('tier',n)`/`lootRich` on `setChest`, `SupplyDrop` entity + `supplyTick`, Loot Crate item 531, world map `WAR_NATIONS` + `#warMapGui` (`game.war`, `save.war`, `wmpTick`, M key, `warmap` packet); nation scenes `buildNationScene`/`NS_LM`/`NATION_CLIMATE` (hooked in `wmpPick`/`wmpAttack`, `/landmark`); soldier models `renderSoldier` + `SOLDIER_CAMO`; multiplayer shared seats `seatIds`/`seatTick`/`ridePassenger`; per-player spawns `mpSpawnFor`/`spawnpt` (saved `save.spawns`), per-player nations `game.war.players` + `wmpick`/`wmatk` packets, PvP duels `wmpPvpStart`/`#pvpHud`; public chat `mpPublicChat` + `/players`, title-screen lobby `LobbyChat` on `ironcraft-lobby-N` peers;  (bomber: `riders[4]`, `bay[]`, `crewTick`, `fireTurret`, seat cycle key V) (ridden via `Mob.rideVehicle`, drawn by `renderVehicle`, pitch rides in the render `roll` slot, bank/pitch/throttle synced as `pt/bk/th`). Multiplayer: host runs the mobs and streams them (`mpMobTick`/`mpMobsIn`), guests mirror them (`Mob.remote`) and send hits (`mh`) and interactions (`mset`) back.
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
- `irondoor.html` — **Iron Door**, backrooms horror: canvas 2D raycaster (400x240, `px` Uint32 buffer, textured floor/ceiling rows + DDA walls + z-buffered sprites), infinite map from `rawCell(x,y)` hashing (corridor lattice every `P` cells + rooms/pillars, cached per level in `cellCache`, `EXIT` cell = 2 drawn with `T.door`), `LEVELS` table (palette, fog, entity stats, drain), `startLevel` places spawn + exit `exitD` cells away, wall decals `wallTexFor` (arrows point at `EXIT`), entities wander/chase/retreat (`freeze` smilers only move unseen), almond water items, WebAudio hum/fear/steps in `snd`; record `idoor_best`.
- `ironguns.html` — **Iron Guns**, first-person 3D battle royale with rounded human characters on a big heightmapped island (WORLD 36000, radius 16400: `rawH`/`terrainH`/`surfaceH` heightfield with hills, lakes, town plateaus and bridge ramps, indexed terrain mesh `buildTerrainMesh` as one mesh with 32-bit indices (`UINT32`), per-cell grass `tuftCell`; ~60 towns of houses built from fixed walls + `M.pyr` roofs, bridges, towers; the airfield is a town entry with `air:true` built by `airfield()` (runway, two loot hangars, windsock, lamps); vehicles (cars in towns/countryside, fighter jets + B-27 bombers at the airfield): `VEHDEF`/`vehParts`/`drawParts` part lists with full 3-axis rotation via `vehR`/`drawMR`, `spawnVehicles`, `tickVehicles` (car driving, aircraft flight with takeoff/landing/crash, explode on 0 hp), `vehFire` (jet twin cannon; bomber bombs are shots with `bomb:true` and gravity); spatial `Grid` for trees/rocks/bushes/walls; raw WebGL renderer: procedural canvas textures in `makeTex`, sun shadow map (`dprog`, `drawWorld` runs twice), sky dome that darkens toward the storm, mode 8 storm-wall ring, overlay rain/thunder when `camStorm`; `drawPerson` for characters, mouse-look yaw/pitch; controls: E enter/exit vehicle, Shift ADS (`G.adsK`), Alt sniper scope (`G.scopeK`), Space `jump()` with `t.jz/t.jv`, sprint by double-tap W via `sprintTap`, touch JUMP/AIM/RIDE buttons; 3D bullets with absolute height `h` vs `gy`; WEAPONS/RAR tables, chests + items, trees/rocks → wood/stone, Q builds walls, storm in `tickStorm`/`planStorm`, bot AI in `botThink` with `routeTo` door routing); save `igun_save`.

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
