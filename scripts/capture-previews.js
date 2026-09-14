const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outputDir = path.join(root, 'media');
const scratchDir = path.join(root, '.preview-recordings');
const requestedSlugs = new Set(process.argv.slice(2));

fs.mkdirSync(outputDir, { recursive: true });
fs.rmSync(scratchDir, { recursive: true, force: true });
fs.mkdirSync(scratchDir, { recursive: true });

const games = [
  {
    slug: 'ironcraft',
    file: 'minecraft.html',
    warmup: 1500,
    duration: 1200,
    start: async (page) => {
      await page.evaluate(() => {
        localStorage.removeItem('ic_worlds');
        newWorld('Preview World', 'iron-games-preview', 'creative', 3, {
          apocalypse: true,
          guns: true,
        });
      });
      await page.waitForFunction(() => game.state === 'playing', null, { timeout: 60000 });
      await page.waitForTimeout(2000);
      await page.evaluate(() => {
        game.noLock = true;
        player.inv[0] = { id: 462, count: 1, dur: 500 };
        player.sel = 0;
        player.yaw = 0;
        player.pitch = -0.04;
        const arenaY = Math.floor(player.y) - 1;
        for (let dx = -14; dx <= 14; dx++) {
          for (let dz = -24; dz <= 6; dz++) {
            for (let dy = 1; dy <= 7; dy++) {
              getWorld().setBlock(Math.floor(player.x) + dx, arenaY + dy, Math.floor(player.z) + dz, 0, 0, { noDrop: true, silent: true });
            }
            getWorld().setBlock(Math.floor(player.x) + dx, arenaY, Math.floor(player.z) + dz, 2, 0, { noDrop: true, silent: true });
          }
        }
        player.y = arenaY + 1.01;
        const mobTypes = ['zombie', 'husk', 'skeleton', 'creeper', 'spider'];
        const wave = [];
        for (let i = 0; i < 24; i++) {
          const row = Math.floor(i / 6);
          const x = player.x + (i % 6 - 2.5) * 1.65;
          const z = player.z - 8 - row * 2.1;
          const mob = dbg.spawnMob(mobTypes[i % mobTypes.length], x, arenaY + 1.01, z);
          mob.angry = true;
          mob.waveMob = true;
          wave.push(mob);
        }
        game.ax.active = true;
        game.ax.wave = 10;
        game.ax.mobs = wave;
        game.ax.left = wave.length;
        game.ax.timeout = 240;
        if (document.pointerLockElement) document.exitPointerLock();
      });
      await page.waitForTimeout(250);
      await page.evaluate(() => {
        game.paused = false;
        game.gui = null;
        hideMenus();
      });
    },
    action: async (page) => {
      const yaws = [-0.16, 0.05, 0.2, -0.08, 0.12, -0.2, 0, 0.16, -0.05, 0.1];
      for (const yaw of yaws) {
        await page.evaluate((value) => {
          game.paused = false;
          game.gui = null;
          hideMenus();
          player.yaw = value;
          player.pitch = -0.04;
          dbg.mouse(false, true);
        }, yaw);
        await page.waitForTimeout(140);
        await page.evaluate(() => dbg.mouse(false, false));
        await page.waitForTimeout(810);
      }
    },
  },
  {
    slug: 'iron-front',
    file: 'ww2tanks.html',
    warmup: 1200,
    duration: 1200,
    start: async (page) => {
      await page.evaluate(() => {
        gameMode = '7v7';
        startGame();
      });
      await page.waitForTimeout(1800);
      await page.evaluate(() => {
        player.hp = player.maxHp = 5000;
        player.dmg = 800;
        player.pen = 999;
        player.reloadTime = 10;
        currentAmmo = totalAmmo = 999;
        enemies.forEach((enemy, i) => {
          enemy.x = player.x + 190 + (i % 3) * 70;
          enemy.y = player.y + (i - 3) * 58;
          enemy.shootCD = i * 4;
          enemy.state = 'attack';
        });
        allies.forEach((ally, i) => {
          ally.x = player.x - 120 - (i % 2) * 55;
          ally.y = player.y + (i - 2.5) * 62;
          ally.shootCD = i * 3;
        });
      });
    },
    action: async (page) => {
      await page.mouse.move(720, 270);
      await page.keyboard.down('w');
      await page.mouse.down();
      for (let i = 0; i < 6; i++) {
        await page.waitForTimeout(1550);
        await page.evaluate((index) => {
          const alive = enemies.filter((enemy) => enemy.hp > 0);
          const target = alive[index % Math.max(1, alive.length)];
          if (target) mortarExplode(target.x, target.y);
        }, i);
      }
      await page.mouse.up();
      await page.keyboard.up('w');
    },
  },
  {
    slug: 'iron-battle',
    file: 'command.html',
    warmup: 1000,
    duration: 1200,
    start: async (page) => {
      await page.evaluate(() => beginMission());
      await page.waitForTimeout(1400);
      await page.evaluate(() => {
        const cx = W / 2;
        const cy = H / 2;
        units.filter((unit) => unit.team === 0 && UT[unit.type].mobile).forEach((unit, i) => {
          unit.x = cx - 180 + (i % 3) * 38;
          unit.y = cy - 100 + i * 34;
          unit.path = [];
        });
        units.filter((unit) => unit.team === 1 && UT[unit.type].mobile).forEach((unit, i) => {
          unit.x = cx + 170 + (i % 4) * 35;
          unit.y = cy - 170 + (i % 8) * 48;
          unit.path = [];
          unit.cd = i * 0.04;
        });
        for (let i = 0; i < 8; i++) {
          const friendly = mkUnit(i % 3 === 0 ? 'tank' : 'rifle', 0, cx - 180 - (i % 3) * 38, cy - 150 + i * 42);
          const hostile = mkUnit(i % 2 === 0 ? 'tank' : 'rifle', 1, cx + 180 + (i % 3) * 38, cy - 150 + i * 42);
          friendly.cd = i * 0.03;
          hostile.cd = i * 0.03;
        }
        centerOn(cx, cy);
        selectAll();
        issueMove(cx + 120, cy);
      });
    },
    action: async (page) => {
      for (let i = 0; i < 5; i++) {
        await page.evaluate((index) => {
          const cx = W / 2;
          const cy = H / 2;
          launchRockets(index % 2, cx + (index % 2 ? -90 : 90), cy + (index - 2) * 45);
          if (index === 1) launchPlane('bomber', 0, cx + 100, cy);
          if (index === 2) launchPlane('bomber', 1, cx - 100, cy);
        }, i);
        await page.waitForTimeout(1900);
      }
    },
  },
];

(async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ['--window-position=-10000,-10000', '--autoplay-policy=no-user-gesture-required', '--mute-audio'],
  });

  try {
    for (const game of games) {
      if (requestedSlugs.size && !requestedSlugs.has(game.slug)) continue;
      const recordingDir = path.join(scratchDir, game.slug);
      fs.mkdirSync(recordingDir, { recursive: true });
      const context = await browser.newContext({
        viewport: { width: 960, height: 540 },
        recordVideo: { dir: recordingDir, size: { width: 960, height: 540 } },
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });

      await page.goto(`file:///${path.join(root, game.file).replace(/\\/g, '/')}`, {
        waitUntil: 'load',
        timeout: 60000,
      });
      await game.start(page);
      await page.waitForTimeout(game.warmup);
      await game.action(page);
      await page.waitForTimeout(game.duration);

      const video = page.video();
      await page.close();
      const rawPath = await video.path();
      await context.close();

      const mp4Path = path.join(outputDir, `${game.slug}-preview.mp4`);
      const posterPath = path.join(outputDir, `${game.slug}-preview.jpg`);
      execFileSync('ffmpeg', [
        '-y', '-sseof', '-10', '-i', rawPath,
        '-t', '10', '-an', '-vf', 'scale=720:404:force_original_aspect_ratio=decrease,pad=720:404:(ow-iw)/2:(oh-ih)/2',
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
        mp4Path,
      ], { stdio: 'inherit' });
      execFileSync('ffmpeg', [
        '-y', '-ss', '2', '-i', mp4Path, '-frames:v', '1', '-q:v', '3', '-update', '1', posterPath,
      ], { stdio: 'inherit' });

      const uniqueErrors = [...new Set(errors)].filter((message) => !message.includes('ERR_FILE_NOT_FOUND'));
      if (uniqueErrors.length) {
        console.warn(`${game.slug}: browser errors:`, uniqueErrors);
      }
      console.log(`${game.slug}: wrote ${path.relative(root, mp4Path)} and ${path.relative(root, posterPath)}`);
    }
  } finally {
    await browser.close();
    fs.rmSync(scratchDir, { recursive: true, force: true });
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
