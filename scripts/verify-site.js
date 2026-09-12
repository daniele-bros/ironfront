const assert = require('assert');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const mime = {
  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg', '.js': 'text/javascript; charset=utf-8', '.mp4': 'video/mp4',
  '.png': 'image/png', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
};

const server = http.createServer((req, res) => {
  const requestPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const relative = requestPath === '/' ? 'index.html' : requestPath.replace(/^\//, '');
  const file = path.resolve(root, relative);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404).end('Not found');
    return;
  }
  const stat = fs.statSync(file);
  const range = req.headers.range;
  if (range && path.extname(file) === '.mp4') {
    const [startText, endText] = range.replace(/bytes=/, '').split('-');
    const start = Number(startText);
    const end = endText ? Number(endText) : stat.size - 1;
    res.writeHead(206, {
      'Accept-Ranges': 'bytes', 'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Content-Length': end - start + 1, 'Content-Type': 'video/mp4',
    });
    fs.createReadStream(file, { start, end }).pipe(res);
    return;
  }
  res.writeHead(200, { 'Content-Length': stat.size, 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const browser = await chromium.launch({ headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });

  try {
    await page.goto(`http://127.0.0.1:${port}/index.html?short-url-check=1`, { waitUntil: 'networkidle' });
    assert.strictEqual(await page.evaluate(() => location.pathname), '/');
    assert.strictEqual(await page.evaluate(() => location.search), '?short-url-check=1');
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    assert.strictEqual(await page.locator('#games .card').first().locator('h2').textContent(), 'IRONCRAFT');
    assert.strictEqual(await page.locator('.card-art video').count(), 3);
    const videoStates = await page.locator('.card-art video').evaluateAll(videos => videos.map(video => ({
      currentTime: video.currentTime, paused: video.paused, muted: video.muted, readyState: video.readyState,
    })));
    for (const state of videoStates) {
      assert(state.currentTime > 0, `Video did not advance: ${JSON.stringify(state)}`);
      assert(!state.paused && state.muted && state.readyState >= 2, `Video did not autoplay: ${JSON.stringify(state)}`);
    }
    await page.screenshot({ path: path.join(root, '.preview-review', 'homepage.png'), fullPage: true });

    await page.goto(`http://127.0.0.1:${port}/activities.html`, { waitUntil: 'networkidle' });
    assert.strictEqual(await page.locator('.card').count(), 36);
    await page.screenshot({ path: path.join(root, '.preview-review', 'activities.png'), fullPage: true });

    const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
    const activityFiles = fs.readdirSync(root).filter(name => name.endsWith('.html') && ![
      'index.html', 'activities.html', 'minecraft.html', 'ww2tanks.html', 'command.html',
      'ironcraft-guide.html', 'iron-front-guide.html', 'iron-battle-guide.html',
    ].includes(name));
    assert.strictEqual(activityFiles.length, 36);

    for (const file of activityFiles) {
      const html = fs.readFileSync(path.join(root, file), 'utf8');
      assert(html.includes('<h1>'), `${file} has no h1`);
      assert(html.includes('<meta name="description"'), `${file} has no description`);
      assert(html.includes(`<link rel="canonical" href="https://irongames.win/${file}">`), `${file} has wrong canonical`);
      assert(sitemap.includes(`https://irongames.win/${file}`), `${file} missing from sitemap`);
      const words = html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').match(/[A-Za-z0-9][A-Za-z0-9’'-]*/g) || [];
      assert(words.length >= 430, `${file} is too short (${words.length} words)`);
    }

    const localRefs = new Set();
    for (const file of fs.readdirSync(root).filter(name => name.endsWith('.html'))) {
      const html = fs.readFileSync(path.join(root, file), 'utf8');
      assert(!html.includes('href="index.html'), `${file} links to the long homepage URL`);
      for (const match of html.matchAll(/(?:href|src)="([^"#?]+)"/g)) {
        const ref = match[1];
        if (/^(?:https?:|data:|mailto:)/.test(ref)) continue;
        localRefs.add(ref);
      }
    }
    for (const ref of localRefs) assert(fs.existsSync(path.join(root, ref)), `Broken local reference: ${ref}`);
    assert.deepStrictEqual([...new Set(errors)], [], `Browser errors:\n${[...new Set(errors)].join('\n')}`);
    console.log(`Verified homepage, 3 autoplay videos, activity hub, ${activityFiles.length} content pages, sitemap and local links.`);
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
