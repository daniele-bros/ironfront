// Ironcraft Mod Maker photo check: a tiny Cloudflare Worker that asks Claude whether a photo is
// suitable for a family game and, when it is, suggests a name and a one-line description.
// The Anthropic API key lives here as a secret; the game page never sees it.
import Anthropic from "@anthropic-ai/sdk";

const ALLOWED_ORIGINS = ["https://irongames.win", "https://www.irongames.win"];
const MAX_BODY = 1_200_000; // ~1.2 MB JSON: the game sends a 256x256 JPEG
const RATE = { windowMs: 60_000, max: 12 }; // per IP per minute
const hits = new Map();

function cors(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
}

function limited(ip) {
  const now = Date.now();
  const rec = hits.get(ip) || { t: now, n: 0 };
  if (now - rec.t > RATE.windowMs) { rec.t = now; rec.n = 0; }
  rec.n++;
  hits.set(ip, rec);
  return rec.n > RATE.max;
}

const SYSTEM = `You check photos that players upload to Ironcraft, a free browser game played by families and children.
The photo becomes 16x16 pixel art used as a block, an item or a creature's face inside the game.
Decide whether the photo is suitable for a children's game. Refuse nudity or sexual content, gore or real injuries,
weapons pointed at people, hate symbols, drugs, alcohol, tobacco, text with slurs or profanity, and anything meant to
harass or mock a real person. Ordinary photos of people, pets, food, places, objects, drawings and logos are fine.
Reply with JSON only, no prose:
{"allowed": true|false, "reason": "<short, friendly, child-safe reason when refused, empty when allowed>",
 "name": "<a fun 1-3 word in-game name for the piece when allowed>", "description": "<one short line, child-safe>"}`;


const DESIGN_SYSTEM = `You design pieces for Ironcraft, a free browser voxel game played by families and children. A player describes
something they want (a creature, a vehicle, an armor set or a weapon) and you turn it into a design spec the game renders.
First decide whether the request is suitable for a children's game: refuse anything sexual, gory, hateful, drug or
alcohol related, slurs, or anything mocking a real person. Ordinary fantasy, animals, robots, vehicles, knights, monsters,
dragons, military-style gear without real-world violence against people, and silly ideas are all fine.
Reply with JSON only, no prose. Shape:
{"allowed": true|false, "reason": "<child-safe reason when refused, empty otherwise>",
 "spec": {"kind": "creature"|"vehicle"|"armor"|"weapon", "name": "<1-3 words>",
   "shape": creature: "biped"|"quadruped"|"flyer"|"serpent"|"blob"; vehicle: "heli"|"plane"|"car"|"tank"|"boat"|"ufo",
   "size": 0.5-2.5, "main": [r,g,b], "second": [r,g,b], "eye": [r,g,b],
   "features": subset of ["horns","wings","spikes","tail","halo","crown","armor","glow","crest"],
   "hostile": bool, "neutral": bool, "hp": 4-200, "dmg": 1-25, "speed": 1-6 (creature) or 5-28 (vehicle), "fly": bool,
   "ranged": null|"fireball"|"arrow", "drops": [["<item name such as sift_crystal, leather, iron_ingot, diamond, bread>", count]],
   armor only: "tier": "god"|"military"|"steel"|"gold"|"leather"|"diamond"|"netherite"|"iron", "points": [helmet,chest,legs,boots] each 1-10,
     "dur": [4 numbers], "perks": subset of ["fireproof","regen","feather"],
   weapon only: "tool": "sword"|"spear"|"axe"|"pickaxe", "dmg": 2-25, "fire": bool, "dur": [number]}}
Keep "god" tier things strong but not absurd (armor points at most 5/10/8/5, weapon damage at most 25).`;

async function design(body, env, headers) {
  const description = String(body.description || "").slice(0, 300);
  if (description.length < 3) return new Response(JSON.stringify({ allowed: false, reason: "Describe it first." }), { status: 400, headers });
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  try {
    const response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 900,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" },
      system: DESIGN_SYSTEM,
      messages: [{ role: "user", content: `Design this: ${description}\nJSON only.` }],
    });
    if (response.stop_reason === "refusal") {
      return new Response(JSON.stringify({ allowed: false, reason: "That idea is not suitable for Ironcraft." }), { headers });
    }
    const text = response.content.filter(b => b.type === "text").map(b => b.text).join("");
    const json = /\{[\s\S]*\}/.exec(text);
    const out = json ? JSON.parse(json[0]) : null;
    if (!out) return new Response(JSON.stringify({ allowed: false, reason: "The design helper gave no answer. Try again." }), { headers });
    return new Response(JSON.stringify({ allowed: out.allowed === true, reason: String(out.reason || "").slice(0, 160), spec: out.allowed === true ? out.spec : null }), { headers });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) return new Response(JSON.stringify({ allowed: false, reason: "The design helper is busy. Try again in a minute." }), { status: 503, headers });
    if (err instanceof Anthropic.APIError) return new Response(JSON.stringify({ allowed: false, reason: "The design helper failed (" + err.status + ")." }), { status: 502, headers });
    return new Response(JSON.stringify({ allowed: false, reason: "The design helper failed." }), { status: 500, headers });
  }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = cors(origin);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "POST") return new Response(JSON.stringify({ error: "POST only" }), { status: 405, headers });
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (limited(ip)) return new Response(JSON.stringify({ allowed: false, reason: "Too many photos at once. Wait a minute and try again." }), { status: 429, headers });

    let body;
    try {
      const text = await request.text();
      if (text.length > MAX_BODY) throw new Error("too large");
      body = JSON.parse(text);
    } catch {
      return new Response(JSON.stringify({ allowed: false, reason: "That request could not be read." }), { status: 400, headers });
    }
    if (body.mode === "design") return design(body, env, headers);
    const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(body.image || "");
    if (!m) return new Response(JSON.stringify({ allowed: false, reason: "That photo could not be read." }), { status: 400, headers });
    const kind = String(body.kind || "block").slice(0, 20);
    const name = String(body.name || "").slice(0, 40);

    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    try {
      const response = await client.beta.messages.create({
        model: "claude-opus-5-5",
        max_tokens: 400,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        output_config: { effort: "low" },
        system: SYSTEM,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: m[1], data: m[2] } },
            { type: "text", text: `The player wants to turn this photo into a ${kind}${name ? ` called "${name}"` : ""}. Is it suitable? JSON only.` },
          ],
        }],
      });
      if (response.stop_reason === "refusal") {
        return new Response(JSON.stringify({ allowed: false, reason: "That photo is not suitable for Ironcraft." }), { headers });
      }
      const text = response.content.filter(b => b.type === "text").map(b => b.text).join("");
      const json = /\{[\s\S]*\}/.exec(text);
      const out = json ? JSON.parse(json[0]) : { allowed: false, reason: "The photo check gave no answer. Try again." };
      return new Response(JSON.stringify({
        allowed: out.allowed === true,
        reason: String(out.reason || "").slice(0, 160),
        name: String(out.name || "").slice(0, 24),
        description: String(out.description || "").slice(0, 120),
      }), { headers });
    } catch (err) {
      if (err instanceof Anthropic.RateLimitError) {
        return new Response(JSON.stringify({ allowed: false, reason: "The photo check is busy. Try again in a minute." }), { status: 503, headers });
      }
      if (err instanceof Anthropic.APIError) {
        return new Response(JSON.stringify({ allowed: false, reason: "The photo check failed (" + err.status + ")." }), { status: 502, headers });
      }
      return new Response(JSON.stringify({ allowed: false, reason: "The photo check failed." }), { status: 500, headers });
    }
  },
};
