# ironfront

Browser games, each a single self-contained HTML file with no build step and no dependencies.

| File | Game |
|------|------|
| `index.html` / `ww2tanks.html` | **Iron Front** – top-down WW2 tank combat |
| `minecraft.html` | **Ironcraft** – a Minecraft-style voxel survival game |

## Ironcraft

Open `minecraft.html` in a modern desktop browser (WebGL2 required). Everything is generated in code: textures, item icons, terrain, sounds.

What's in it, modelled on the real game:

- Infinite procedurally generated world (16×128 chunks) with plains, forest, birch forest, taiga, snowy taiga, desert, swamp, mountains, beaches and oceans; caves, lava lakes, and ores laid out by depth (coal, iron, copper, gold, lapis, redstone, diamond, emerald).
- Real block/sky lighting with smooth lighting and ambient occlusion, torches, a 20-minute day/night cycle with sun, moon, stars and clouds.
- Survival mechanics: health, hunger/saturation/exhaustion, natural regeneration, fall damage, drowning, fire and lava, sleeping in beds, death and respawn.
- Mining uses Minecraft's break-time formula with tool tiers (wood/stone/iron/diamond/gold) and drop rules; block placement for stairs, slabs, doors, ladders, torches, fences, beds, chests, furnaces and crops.
- Inventory with drag-and-drop, 2×2 and 3×3 crafting with the genuine recipes plus a recipe book, furnaces with fuel and smelting, chests, armor, XP and levels.
- Mobs: pig, cow, sheep (shearable), chicken (lays eggs), zombie and skeleton (burn in daylight), creeper (explodes), spider (climbs); breeding, bows and arrows, TNT.
- Farming (hoe, wheat, carrots, potatoes, bone meal), tree growth, grass spread, leaf decay, flowing water and lava, falling sand and gravel.
- Survival and Creative modes (creative flight and item palette), four difficulties, multiple worlds saved in the browser, options for render distance, FOV, sensitivity, brightness and sound.

Controls: WASD move, mouse look, Space jump, Shift sneak, Ctrl / double-tap W sprint, left click mine or attack, right click place or use, scroll or 1–9 select, E inventory, Q drop, F3 debug, Esc pause.
