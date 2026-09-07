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
- Mobs: pig, cow, sheep (shearable), chicken (lays eggs), zombie and skeleton (burn in daylight), creeper (explodes), spider (climbs), husk (desert, causes hunger), stray (snow, slowing arrows), cave spider (mineshafts, poison), enderman (teleports, angered by staring), slime (splits, slime chunks and swamps), witch (throws potions, drinks to heal), wolves (packs in forests and taigas, tame them with bones, they sit, follow, teleport to you and fight what you fight), horses (plains; keep mounting until they accept you, feed them to speed it up, then saddle and ride: W A S D steer, Space jumps, Shift dismounts); breeding, bows and arrows, TNT.
- Structures also include woodland mansions (forests; three floors of rooms, loot and vindicators), ocean monuments (deep ocean; prismarine halls, sea lanterns, a sealed gold treasure room and laser-firing guardians) and shipwrecks (sea floor supply chests).
- Jungles are a new biome with tall wide-canopy trees. Jungle temples hide a trapped treasure room (step on the plate and the walls explode) and a second chest behind a mossy wall. Pillager outposts are four-storey watchtowers full of crossbow-firing pillagers with a loot chest at the top; they only appear near villages, 40 to 65 blocks from the well.
- Ruined nether portals are common (about one per 80 blocks), always carry one or two gold blocks and chests heavy with gold gear and ingots.
- Every world has a ruined nether portal about 10 blocks from the spawn point, with a loot chest (obsidian, flint and steel, gold) so you can repair it and reach the Nether early.
- Netherite: ancient debris hides deep in the Nether (y 8 to 22, sometimes higher). Smelt it into netherite scrap, combine 4 scrap with 4 gold ingots for an ingot, then combine any diamond tool, weapon, spear or armor piece with one ingot to upgrade it. Netherite items survive lava.
- Enchanting: sugar cane grows on shores; 3 make paper, 3 paper and leather make a book, books and planks make bookshelves. An enchanting table (book, 2 diamonds, 4 obsidian) surrounded by up to 15 bookshelves offers three enchantments per item for lapis and levels. An anvil (3 iron blocks, 4 ingots) merges enchanted books into gear, combines two items, and repairs.
- 30 enchantments with real effects: Sharpness, Smite, Bane of Arthropods, Knockback, Fire Aspect, Looting, Sweeping Edge, Efficiency, Silk Touch, Fortune, Unbreaking, Mending, Protection, Fire/Blast/Projectile Protection, Thorns, Respiration, Aqua Affinity, Feather Falling, Depth Strider, Frost Walker, Soul Speed, Swift Sneak, Power, Punch, Flame, Infinity, Curse of Binding and Curse of Vanishing. Enchanted books appear in every loot chest and librarians trade them.
- Saddles come from dungeon, temple and village chests or from 5 leather + 1 string.
- Spears (wood, stone, iron, gold, diamond): a material and two sticks on a diagonal. Long reach (5 blocks) and a charge attack: ride a horse at speed with a spear in hand and anything in front of you takes damage that scales with the horse's speed.
- Creative inventory has a boxed Armor section with the player preview; the screen scrolls if it does not fit.
- Options include a Keep Inventory on Death toggle (on by default); when off, the death message tells you where your items dropped.
- Villager trading with demand-based prices, limited stock, twice-daily restocks and five trading levels.
- Farming (hoe, wheat, carrots, potatoes, bone meal), tree growth, grass spread, leaf decay, flowing water and lava, falling sand and gravel.
- Survival and Creative modes (creative flight and item palette), four difficulties, multiple worlds saved in the browser, options for render distance, FOV, sensitivity, brightness and sound.

Controls: WASD move, mouse look, Space jump, Shift sneak, Ctrl / double-tap W sprint, left click mine or attack, right click place or use, scroll or 1–9 select, E inventory, Q drop, F3 debug, Esc pause.
