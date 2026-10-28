# Teklozy — "A journey to your future"

2D illustrated landing page + your 3D Teko fox (assets/teko.glb) that walks the road as you scroll.

## Run it
- **Just double-click `index.html`** — works offline (Teko is also embedded in js/teko-model.js).
- Or serve the folder (`npx serve .`) — then the lighter assets/teko.glb is loaded directly.

## What Teko does
- Drops in at START, then follows the path as you scroll (turns to face the direction of travel, hops, leans, leaves sparkles).
- Celebrates at each of the 10 stages: spin + hop + confetti + speech bubble; the stage card & node light up.
- Click a stage card / node / nav link and Teko walks there. Idle Teko looks toward your cursor.

## Customise
- Stage text & illustrations: `src/art.js` (STAGES array). Layout/animation: `src/main.js`. Styling: `css/style.css`.
- If Teko ever faces backwards, set `MODEL_YAW = Math.PI` at the top of `src/main.js`.
- Rebuild after editing src: `npm install && npm run build` (bundles to js/app.js).
