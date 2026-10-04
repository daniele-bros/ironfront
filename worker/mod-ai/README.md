# Ironcraft Mod Maker photo check

The Mod Maker in Ironcraft turns a dropped photo into pixel art (a block, an item or a
creature face). The game itself runs on GitHub Pages with no server, so by default photos
stay on the player's device and are never shared.

This folder is the optional server piece that lets Claude check every photo before it is
accepted and suggest a name. It is a Cloudflare Worker holding the Anthropic API key as a
secret, so the key is never in the page.

## Deploy

```bash
cd worker/mod-ai
npm install
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY   # paste a key from console.anthropic.com
npx wrangler deploy                         # prints https://ironcraft-mod-ai.<you>.workers.dev
```

Then open `minecraft.html` and set the printed URL:

```js
const MOD_AI_ENDPOINT='https://ironcraft-mod-ai.<you>.workers.dev';
```

Push to `main` and the Mod Maker switches to checked mode: every photo goes to the
worker, Claude (claude-opus-5-5, low effort, server-side refusal fallbacks on) answers
whether it is suitable for a family game, and unsuitable photos are refused with a
friendly reason. Allowed photos get a suggested name when the player left the name
blank.

## Limits and cost

- Requests are limited to 12 per minute per IP inside the worker, and only
  `https://irongames.win` may call it (edit `ALLOWED_ORIGINS` for other hosts).
- Each check sends one 256x256 JPEG and a few hundred tokens: a fraction of a cent.
- If the worker is down, the game refuses new photos rather than skipping the check.
