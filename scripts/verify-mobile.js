const assert = require('assert');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium, devices } = require('playwright');

const root = path.resolve(__dirname, '..');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.jpg': 'image/jpeg', '.mp4': 'video/mp4' };
const server = http.createServer((req, res) => {
  const rel = new URL(req.url, 'http://localhost').pathname === '/' ? 'index.html' : decodeURIComponent(new URL(req.url, 'http://localhost').pathname.slice(1));
  const file = path.resolve(root, rel);
  if (!file.startsWith(root) || !fs.existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ...devices['iPhone 13'], viewport: { width: 844, height: 390 }, screen: { width: 844, height: 390 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  try {
    await page.goto(`http://127.0.0.1:${port}/minecraft.html`, { waitUntil: 'domcontentloaded' });
    assert(await page.getByRole('button', { name: 'Solo Worlds' }).isVisible());
    assert.strictEqual(await page.evaluate(() => isTouchDevice()), true);
    await page.evaluate(() => { document.getElementById('hud').style.display = 'block'; document.getElementById('mobileControls').classList.add('active'); });
    assert.strictEqual(await page.locator('#mobileControls').evaluate(el => getComputedStyle(el).display), 'block');
    assert(await page.locator('#mobileMine').isVisible());
    assert(await page.locator('#mobileJoy').isVisible());

    await page.goto(`http://127.0.0.1:${port}/ww2tanks.html`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.body.setAttribute('data-state', 'game'));
    assert.strictEqual(await page.locator('#tank-touch-controls').evaluate(el => getComputedStyle(el).display), 'block');
    assert(await page.locator('#tank-fire').isVisible());
    assert(await page.locator('#tank-stick').isVisible());

    await page.goto(`http://127.0.0.1:${port}/command.html`, { waitUntil: 'domcontentloaded' });
    assert.strictEqual(await page.locator('#cv').evaluate(el => getComputedStyle(el).touchAction), 'none');
    assert.strictEqual(await page.locator('#bot').evaluate(el => getComputedStyle(el).overflowX), 'auto');
    assert(await page.locator('.mobile-help').isVisible());
    assert.strictEqual(errors.length, 0, `Mobile page errors:\n${errors.join('\n')}`);
    console.log('Verified mobile layouts and touch-control surfaces for all three games.');
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
