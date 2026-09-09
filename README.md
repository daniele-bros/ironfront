# Daniele Bros Games

A small arcade of free browser games. The site is a single static page, hosted with GitHub Pages.

- **`index.html`** — the games hub. Lists every game with a play button.
- **`ww2tanks.html`** — Iron Front, a WW2 tank combat game.

## Adding a game

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

That's it. The card, play button, and game counter update automatically.
