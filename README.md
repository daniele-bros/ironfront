# Iron Games

Browser games, each a single self-contained HTML file with no build step and no dependencies.
The site is hosted with GitHub Pages at https://daniele-bros.github.io/ironfront/ and serves from `main`.

| File | Game |
|------|------|
| `index.html` | **Iron Games hub** – the landing page that lists and links every game |
| `ww2tanks.html` | **Iron Front** – top-down WW2 tank combat |
| `command.html` | **Iron Battle** – flat-map real-time strategy with troops, tanks, rockets and aircraft |
| `minecraft.html` | **Ironcraft** – a Minecraft-style voxel survival game |

## Adding a game to the Iron Games hub

1. Drop the game's HTML file in this folder (for example `mygame.html`).
2. Open `index.html` and add one entry to the `GAMES` array near the bottom:

```js
{
  title: 'MY GAME',
  subtitle: 'One-line hook',
  icon: '🎮',
  url: 'mygame.html',
  description: 'What the game is about.',
  tags: ['Puzzle', 'Mouse only']
}
```

The card, play button, and game counter update automatically.

## Ironcraft

Multiplayer: the title screen has a Multiplayer button showing a live list of public worlds other players have open (click to join, no code), a Create New Public World button that uses the normal create-world screen, and private rooms by code. There is no game server: players connect to each other directly through the browser (PeerJS), the first person into a public server hosts it and later arrivals join them. Players see each other with name tags, block changes and chat (press T) are shared.

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
- The End: throw an eye of ender (blaze powder + ender pearl) and it flies towards the nearest stronghold, a stone-brick maze underground with a library and a portal room. Fill all twelve frames with eyes to open the portal. The End is an end-stone island in the void with ten obsidian pillars topped by crystals that heal the Ender Dragon (200 hp, boss bar). The dragon circles, dives, perches and smashes through blocks; kill it for a mountain of XP, the dragon egg and an open exit portal home.
- The End's outer islands (150+ blocks out) hold End Cities: purpur towers with end rods, loot chests and shulkers, plus an End Ship whose bow chest always holds an Elytra. Killing the dragon opens an End Gateway beside the exit portal; step in to reach the outer islands, and every city has a gateway back.
- Elytra: wear it in the chest slot and press Space while falling to glide. Dive to gain speed, pull up to climb; slamming into a wall hurts and each second of flight costs durability.
- Shulkers hide in their shells, teleport when hit and fire homing bullets that deal damage and Levitation. They drop shulker shells: two shells around a chest make a Shulker Box, a chest that keeps its contents when broken and carried.
- Command console: press / (or T) in game for /give <item> [count] [enchant:level], /kit enchanting|end|netherite|diamond|food|builder, /build enchanting (places an enchanting table with 15 bookshelves in front of you), /tp, /time, /gamemode, /spawn, /heal, /xp, /kill and /help.
- Wither skeletons patrol nether fortresses: tall black skeletons with stone swords whose hits inflict the Wither effect (slow draining damage). They rarely drop their skull. Build a T of four soul sand with three skulls on top to summon the Wither: a three-headed boss (300 hp, boss bar) that charges up, explodes, hovers, fires exploding skulls, heals itself, shrugs off arrows below half health and smashes every block it touches. It drops a Nether Star, which with glass and obsidian makes a beacon: stand it on a 3x3 of iron, gold, diamond, emerald or netherite blocks for Speed and Regeneration nearby.
- Blazes: nether fortresses now have blaze spawners and patrols. Blazes hover and fire bursts of three fireballs; they drop blaze rods.
- Evokers live on the top floor of mansions, cast rows or rings of fangs and summon vexes (ghosts that fly through walls). They drop a Totem of Undying: keep it in your hotbar and it saves you from death once.
- Archers (skeletons, strays, pillagers, witches, blazes) only fire when they can actually see you. Nights are busier: more hostile spawns while the sun is down. Arrows slow sharply in water and catch fire in lava. Enchanted books carry exactly one enchantment.
- Fun Mods (the Fun Mods button when creating a world) can be mixed freely: **Weather** (thunderstorms with lightning strikes and block-throwing tornadoes), **Horror** (pitch-black nights, monsters that never burn, whispers, and a Stalker that only moves when you look away), **Random Blocks**, **Hardcore** (one life, the world is deleted on death), **Structure Chaos** (a random structure every hundred blocks) **Zombie Apocalypse** (the dead attack in ever bigger waves, day or night, with a wave counter on screen) **Guns** (pistol, full-auto rifle, shotgun, a scoped sniper rifle and a ghillie suit that keeps mobs from noticing you until you are close, ammo crafted from iron and leather or dropped by monsters).
- Random Blocks mode (Fun Mods > Random Blocks): every block you break, mob you kill and chest slot gives a fresh surprise item, re-rolled on every single break (the same birch log can give TNT one time and something else the next), spawn eggs included. About one break in thirty is a jackpot that drops a whole set at once: netherite or diamond armor, a full tool set, an elytra with eyes of ender, or an enchanting table with 15 bookshelves and lapis. Spawn eggs for all 24 mobs are also in the creative list.
- Trial chambers are buried complexes of tuff and copper (a copper ring on the surface marks the ladder shaft down). Trial spawners wake when you come close and summon a trial of mobs; beat every one and the spawner ejects a Trial Key that opens a vault of loot. Breezes (bouncing wind spirits that lob wind charges) guard some spawners and drop Breeze Rods; one rod makes four throwable Wind Charges that blast you and anything nearby into the air. The ominous vault in the centre holds a Heavy Core: put it over a Breeze Rod for a Mace, whose smash attack turns the height you fall from into damage and knocks everything nearby flying, and cancels your fall damage. Ominous vaults can also hold a Wind Burst book: on a mace it launches you back into the air after every smash so you can chain them. Tridents (three prismarine over two sticks) hit hard in melee and can be thrown; Loyalty brings them flying back and Channeling calls lightning down during a storm.
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
