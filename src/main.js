import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { STAGES, FINISH_SAY, START_SAY, art, bulletIcon, skyline, tree, mountain, island, icons } from './art.js';

/* ------------------------------------------------------------------ *
 *  Config
 * ------------------------------------------------------------------ */
const MODEL_YAW = 0;            // if Teko faces the wrong way, change to Math.PI
const FOCUS = 0.56;             // where (as fraction of viewport height) Teko walks while you scroll
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

const $ = (s, r = document) => r.querySelector(s);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const wrapPi = (a) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
const easeOutBounce = (x) => { const n = 7.5625, d = 2.75; if (x < 1 / d) return n * x * x; if (x < 2 / d) return n * (x -= 1.5 / d) * x + .75; if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + .9375; return n * (x -= 2.625 / d) * x + .984375; };

const journey = $('#journey'), jwrap = $('#jwrap'), hero = $('#hero'), road = $('#road'), stagesEl = $('#stages');
const decor = $('#decor'), archEl = $('#arch'), startSign = $('#startSign'), tomorrow = $('#tomorrow');
const bubble = $('#bubble'), toastEl = $('#toast'), barEl = $('#bar');
const canvas = $('#teko'), fxCanvas = $('#fx'), fx = fxCanvas.getContext('2d');

let vw = innerWidth, vh = innerHeight, dpr = Math.min(devicePixelRatio || 1, 2);
let W = 0, mobile = false, startX = 0, startY = 0, endX = 0, endY = 0, offY = 0;
let nodes = [], nodeLen = [], pathLen = 0, foxEnd = 0, LY = [], LL = [], pathEl = null, travEl = null;
const nodeEls = [], cardEls = [];

/* ------------------------------------------------------------------ *
 *  Build stage cards + nodes (once)
 * ------------------------------------------------------------------ */
STAGES.forEach((s, i) => {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.i = i;
  card.innerHTML = `<div class="badge">${i + 1}</div>
    <div class="txt"><h3>${s.t}</h3><p class="sub">${s.s}</p>
    <ul>${s.b.map((b) => `<li>${bulletIcon}<span>${b}</span></li>`).join('')}</ul></div>
    <div class="art">${art(s.art)}</div>`;
  card.addEventListener('click', () => scrollToStage(i + 1));
  stagesEl.appendChild(card); cardEls.push(card);

  const n = document.createElement('button');
  n.className = 'node'; n.textContent = i + 1; n.setAttribute('aria-label', `Go to stage ${i + 1}: ${s.t}`);
  n.addEventListener('click', () => scrollToStage(i + 1));
  stagesEl.appendChild(n); nodeEls.push(n);
});

const statsData = [['students', 10, 'K+', 'Students'], ['paths', 50, '+', 'Career paths'], ['projects', 500, '+', 'Projects'], ['community', 5, 'K+', 'Community']];
$('#stats').innerHTML = statsData.map(([ic, n, suf, label]) => `<div class="stat">${icons[ic]}<div><b data-n="${n}" data-s="${suf}">0${suf}</b><small>${label}</small></div></div>`).join('');

/* ------------------------------------------------------------------ *
 *  Layout (runs on load + resize)
 * ------------------------------------------------------------------ */
function layout() {
  vw = innerWidth; vh = innerHeight;
  W = jwrap.clientWidth;
  mobile = vw < 761;
  foxH = mobile ? 108 : clamp(vh * 0.2, 128, 178);
  offY = mobile ? hero.offsetHeight + 8 : 0;
  const rowH = mobile ? 262 : clamp(W * 0.145, 128, 172);
  startX = W * (mobile ? 0.3 : 0.5); startY = offY + (mobile ? 140 : 275);
  const n1Y = offY + (mobile ? 330 : 452);
  const oddX = W * (mobile ? 0.74 : 0.625), evenX = W * (mobile ? 0.26 : 0.44);

  nodes = STAGES.map((_, i) => ({ x: i % 2 === 0 ? oddX : evenX, y: n1Y + i * rowH }));
  endX = W * 0.5; endY = nodes[9].y + (mobile ? 400 : 470);
  const H = endY + 150;
  jwrap.style.height = H + 'px';
  journey.style.height = H + 'px';

  /* road */
  const pts = [{ x: startX, y: startY }, ...nodes, { x: endX, y: endY }];
  let d = `M${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], dy = b.y - a.y;
    d += ` C${a.x} ${a.y + dy * 0.5} ${b.x} ${b.y - dy * 0.5} ${b.x} ${b.y}`;
  }
  d += ` L${endX} ${endY + 140}`;
  const rw = mobile ? 40 : clamp(W * 0.05, 40, 58);
  road.setAttribute('width', W); road.setAttribute('height', H); road.style.width = W + 'px'; road.style.height = H + 'px';
  road.innerHTML = `<defs>
    <linearGradient id="gTrav" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6aa8ff"/><stop offset="1" stop-color="#1f6bff"/></linearGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <path d="${d}" transform="translate(0 9)" fill="none" stroke="#a8c3ee" stroke-opacity=".45" stroke-width="${rw + 6}" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${d}" fill="none" stroke="#b9d3fb" stroke-width="${rw + 6}" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${d}" fill="none" stroke="#dcebff" stroke-width="${rw}" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${d}" fill="none" stroke="#f4f9ff" stroke-opacity=".9" stroke-width="${rw * 0.62}" stroke-linecap="round" stroke-linejoin="round"/>
    <path id="roadPath" d="${d}" fill="none" stroke="#8fb9f7" stroke-opacity=".75" stroke-width="2.4" stroke-dasharray="1 15" stroke-linecap="round"/>
    <path id="trav" d="${d}" fill="none" stroke="url(#gTrav)" stroke-width="${mobile ? 5 : 7}" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>`;
  pathEl = $('#roadPath', road); travEl = $('#trav', road);
  pathLen = pathEl.getTotalLength();
  travEl.style.strokeDasharray = pathLen;

  /* y → length lookup (path is monotonic in y) */
  LY = []; LL = [];
  const step = 3;
  for (let l = 0; l <= pathLen; l += step) { LL.push(l); LY.push(pathEl.getPointAtLength(l).y); }
  foxEnd = lenAtY(endY);
  nodeLen = nodes.map((n) => lenAtY(n.y));

  /* nodes + cards */
  const cw = mobile ? Math.min(W * 0.64, 300) : clamp(W * 0.3, 250, 340);
  nodes.forEach((n, i) => {
    const el = nodeEls[i]; el.style.left = n.x + 'px'; el.style.top = n.y + 'px';
    const card = cardEls[i];
    const right = i % 2 === 0;
    let w, left;
    if (mobile) { w = cw; left = right ? 10 : W - 10 - w; }
    else if (right) { left = n.x + 52; w = Math.min(cw, W - left - 8); }
    else { w = Math.min(cw, n.x - 52 - 8); left = n.x - 52 - w; }
    card.style.width = w + 'px'; card.style.left = left + 'px';
    card.style.top = (n.y - card.offsetHeight / 2 + (mobile ? 0 : 0)) + 'px';
  });

  /* signs + arch */
  startSign.style.left = (startX - (mobile ? 112 : 168)) + 'px'; startSign.style.top = (startY - 58) + 'px';
  tomorrow.style.display = mobile ? 'none' : '';
  tomorrow.style.left = (W * 0.7) + 'px'; tomorrow.style.top = (offY + 78) + 'px';
  const aw = mobile ? 118 : 150;
  archEl.style.width = aw + 'px'; archEl.style.height = aw * 1.14 + 'px'; archEl.style.borderRadius = aw / 2 + 'px ' + aw / 2 + 'px 0 0';
  archEl.style.left = (endX - aw / 2) + 'px'; archEl.style.top = (endY - aw * 1.14 - foxH * 0.98 - 14) + 'px';

  buildDecor();
  sizeRenderer();
}

function lenAtY(y) {
  if (y <= LY[0]) return 0;
  if (y >= LY[LY.length - 1]) return LL[LL.length - 1];
  let lo = 0, hi = LY.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (LY[m] < y) lo = m; else hi = m; }
  const t = (y - LY[lo]) / (LY[hi] - LY[lo] || 1);
  return lerp(LL[lo], LL[hi], t);
}

/* ------------------------------------------------------------------ *
 *  Decorations (2D illustration layers)
 * ------------------------------------------------------------------ */
const parallax = [];
function put(html, css, cls = '', par = 0) {
  const el = document.createElement('div');
  el.className = 'd ' + cls; el.style.cssText = css; el.innerHTML = html;
  decor.appendChild(el);
  if (par) parallax.push([el, par]);
  return el;
}
function buildDecor() {
  decor.innerHTML = ''; parallax.length = 0;
  const jl = (journey.clientWidth - W) / 2, Jw = journey.clientWidth, H = parseFloat(jwrap.style.height);

  /* big soft mountains on the page edges */
  [[-4, 1.6, 'l', 420], [100, 3.4, 'r', 380], [-6, 5.8, 'l', 360], [100, 7.4, 'r', 420], [-4, 9.4, 'l', 380]].forEach(([x, row, side, w], k) => {
    const y = nodes[0].y + row * (nodes[1].y - nodes[0].y) - 60;
    put(mountain(k % 2 ? '#d5e4fb' : '#dbe8fd'), `top:${y}px;${side === 'l' ? 'left:' + (x - 6) + 'px' : 'right:-6px'};width:${w}px;height:${w * 0.4}px;opacity:.7`, '', 0.03);
  });

  if (mobile) {
    put(skyline(260, 120, 7), `left:${jl + W * 0.38}px;top:${offY - 8}px;width:${W * 0.62}px`, 'sk');
  } else {
    put(skyline(420, 220, 3), `left:${jl + W * 0.6}px;top:${offY + 6}px;width:${W * 0.4}px`, 'sk skr', 0.02);
    put(skyline(300, 150, 11, false), `left:${jl + W * 0.56}px;top:${offY + 70}px;width:${W * 0.28}px;opacity:.45`, 'sk');
    /* floating islands on the free side of every stage */
    nodes.forEach((n, i) => {
      const left = i % 2 === 1;                 // even stages (cards on left) → island on the right
      const x = jl + (left ? W * 0.86 : W * 0.1), y = n.y + (i % 3 === 0 ? 34 : 12);
      const w = 96 + (i % 3) * 14;
      const isle = put(`${island(w)}<div class="on-isle" style="width:${w * 0.34}px">${tree(i % 2 ? '#78bdb4' : '#6fb3ab', i % 2 ? '#559a93' : '#4a8c87')}</div>`, `left:${x - w / 2}px;top:${y}px;width:${w}px`, 'isle');
      isle.style.animationDelay = (-i * 1.3) + 's';
      put(`<div style="width:${w * 0.22}px;margin-left:${left ? -w * .52 : w * .48}px">${tree('#8ccdc2', '#66aba2')}</div>`, `left:${x}px;top:${y - 22}px;width:1px`, 'tree');
    });
  }

  /* city + ground at the end */
  const bw = mobile ? W : Math.min(W * 0.78, 860), bx = jl + endX - bw / 2;
  put(skyline(560, 250, 21), `left:${bx}px;top:${endY - 232}px;width:${bw}px;opacity:.6`, 'sk');
  put(skyline(560, 220, 5), `left:${bx + bw * 0.06}px;top:${endY - 190}px;width:${bw * 0.88}px`, 'sk');
  put('', `left:${jl + endX - Math.min(W, 1000) * .6}px;top:${endY - 30}px;width:${Math.min(W, 1000) * 1.2}px;height:260px;border-radius:50%;background:radial-gradient(closest-side,#fff 40%,rgba(255,255,255,0))`, '');
  [[-0.38, 0], [-0.3, 20], [0.33, 4], [0.4, 24], [-0.45, 40], [0.47, 44]].forEach(([dx, dy], k) => {
    if (mobile && Math.abs(dx) > 0.4) return;
    put(tree(k % 2 ? '#78bdb4' : '#6fb3ab', k % 2 ? '#559a93' : '#4a8c87'), `left:${jl + endX + dx * W - 16}px;top:${endY + dy - 20}px;width:${mobile ? 24 : 34}px`, 'tree');
  });
  put(mountain('#d3e3fb'), `left:${jl + endX - W * .62}px;top:${endY + 20}px;width:${W * .4}px;height:${W * .12}px;opacity:.7`, '');
  put(mountain('#d3e3fb'), `left:${jl + endX + W * .24}px;top:${endY + 24}px;width:${W * .42}px;height:${W * .12}px;opacity:.7`, '');
}

/* ------------------------------------------------------------------ *
 *  Three.js — Teko
 * ------------------------------------------------------------------ */
let renderer, scene, cam, root, tilt, spinG, shadow, modelReady = false, foxH = 150;
try {
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  cam = new THREE.OrthographicCamera(0, vw, vh, 0, -2000, 2000);
  cam.position.z = 10;

  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(-1.2, 1.8, 2.4); scene.add(key);
  const rim = new THREE.DirectionalLight(0x7fb2ff, 1.6); rim.position.set(1.4, 0.8, -2); scene.add(rim);
  scene.add(new THREE.HemisphereLight(0xeaf3ff, 0xbcd0f5, 0.9));

  root = new THREE.Group(); tilt = new THREE.Group(); spinG = new THREE.Group();
  root.add(tilt); tilt.add(spinG); scene.add(root); root.visible = false;

  const sc = document.createElement('canvas'); sc.width = sc.height = 128;
  const g = sc.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(25,60,140,.55)'); gr.addColorStop(.55, 'rgba(25,60,140,.22)'); gr.addColorStop(1, 'rgba(25,60,140,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }));
  shadow.position.z = -100; shadow.visible = false; scene.add(shadow);
} catch (err) { console.warn('WebGL unavailable — Teko disabled', err); renderer = null; }

function sizeRenderer() {
  foxH = mobile ? 108 : clamp(vh * 0.2, 128, 178);
  dpr = Math.min(devicePixelRatio || 1, 2);
  fxCanvas.width = vw * dpr; fxCanvas.height = vh * dpr;
  if (!renderer) return;
  renderer.setPixelRatio(dpr); renderer.setSize(vw, vh, false);
  cam.left = 0; cam.right = vw; cam.top = vh; cam.bottom = 0; cam.updateProjectionMatrix();
}

function injectScript(src) {
  return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
}
async function loadModel() {
  const loader = new GLTFLoader();
  if (location.protocol.startsWith('http')) {
    try { return await new Promise((res, rej) => loader.load('assets/teko.glb', res, undefined, rej)); } catch (e) { /* fall through to embedded copy */ }
  }
  await injectScript('js/teko-model.js');           // lets the site work from file:// too
  const bin = Uint8Array.from(atob(window.__TEKO_GLB__), (c) => c.charCodeAt(0)).buffer;
  window.__TEKO_GLB__ = null;
  return new Promise((res, rej) => loader.parse(bin, '', res, rej));
}
if (renderer) loadModel().then((gltf) => {
  const m = gltf.scene;
  m.traverse((o) => { if (o.isMesh) { o.material.envMapIntensity = 1.0; if (o.material.map) o.material.map.anisotropy = 8; } });
  const box = new THREE.Box3().setFromObject(m), size = box.getSize(new THREE.Vector3()), ctr = box.getCenter(new THREE.Vector3());
  const s = 1 / size.y;
  m.scale.setScalar(s);
  m.position.set(-ctr.x * s, -box.min.y * s, -ctr.z * s);
  spinG.add(m);
  modelReady = true; root.visible = true; shadow.visible = true;
  document.documentElement.classList.add('ready');
  st.intro = 0;
}).catch((e) => console.warn('Could not load Teko model', e));

/* ------------------------------------------------------------------ *
 *  Particles (2D canvas under Teko)
 * ------------------------------------------------------------------ */
const parts = [];
const BLUES = ['#2f7bff', '#5a9bff', '#8ec5ff', '#b7d8ff'], CONF = ['#2f7bff', '#6aa8ff', '#ffd36b', '#ff8fb1', '#59d6bd', '#9b8cff'];
function spark(x, y, sp) {
  parts.push({ k: Math.random() < .6 ? 's' : 'o', x: x + (Math.random() - .5) * 26, y: y + 4 + Math.random() * 6, vx: (Math.random() - .5) * 26, vy: -14 - Math.random() * 30 * sp, g: -4,
    life: 0, max: .7 + Math.random() * .8, size: 3 + Math.random() * 6, c: BLUES[(Math.random() * BLUES.length) | 0], rot: Math.random() * 6 });
}
function burst(x, y, n = 46) {
  if (REDUCED) n = 10;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, v = 120 + Math.random() * 260, r = Math.random();
    parts.push({ k: r < .4 ? 's' : r < .75 ? 'r' : 'o', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 180, g: 520, life: 0, max: 1.1 + Math.random() * .9,
      size: 4 + Math.random() * 7, c: CONF[(Math.random() * CONF.length) | 0], rot: Math.random() * 6, vr: (Math.random() - .5) * 14 });
  }
  ring = { x, y, t: 0 };
}
let ring = null;
function drawStar(x, y, r, rot) {
  fx.save(); fx.translate(x, y); fx.rotate(rot); fx.beginPath();
  for (let i = 0; i < 8; i++) { const rr = i % 2 ? r * .28 : r, a = (i * Math.PI) / 4; fx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  fx.closePath(); fx.fill(); fx.restore();
}
function drawParts(dt) {
  fx.setTransform(dpr, 0, 0, dpr, 0, 0); fx.clearRect(0, 0, vw, vh);
  if (ring) {
    ring.t += dt; const u = ring.t / .7;
    if (u >= 1) ring = null; else { fx.strokeStyle = `rgba(47,123,255,${.55 * (1 - u)})`; fx.lineWidth = 4 * (1 - u) + 1; fx.beginPath(); fx.ellipse(ring.x, ring.y, 20 + u * 130, (20 + u * 130) * .32, 0, 0, 7); fx.stroke(); }
  }
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]; p.life += dt;
    if (p.life >= p.max) { parts.splice(i, 1); continue; }
    p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= (1 - dt * .6);
    if (p.vr) p.rot += p.vr * dt;
    const u = p.life / p.max, a = u < .15 ? u / .15 : 1 - (u - .15) / .85;
    fx.globalAlpha = clamp(a, 0, 1); fx.fillStyle = p.c;
    if (p.k === 's') drawStar(p.x, p.y, p.size * (1 - u * .5), p.rot + u * 2);
    else if (p.k === 'r') { fx.save(); fx.translate(p.x, p.y); fx.rotate(p.rot); fx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2); fx.restore(); }
    else { fx.beginPath(); fx.arc(p.x, p.y, p.size * .5 * (1 - u * .4), 0, 7); fx.fill(); }
  }
  fx.globalAlpha = 1;
}

/* ------------------------------------------------------------------ *
 *  Teko state machine
 * ------------------------------------------------------------------ */
const st = { len: 0, prev: 0, vel: 0, yaw: 0, dir: 1, phase: 0, idle: 0, intro: -1, celeb: null, reached: new Array(11).fill(false), emit: 0, hint: 0, greeted: false, t: 0 };
let mouseX = vw / 2, bubbleT = 0, bubbleW = 200, bubbleH = 40, curStage = 0;
addEventListener('pointermove', (e) => { mouseX = e.clientX; }, { passive: true });

function say(text, ms = 3400) {
  bubble.textContent = text; bubble.classList.add('show');
  bubbleW = bubble.offsetWidth; bubbleH = bubble.offsetHeight;
  clearTimeout(bubbleT); bubbleT = setTimeout(() => bubble.classList.remove('show'), ms);
}
function celebrate(x, y) {
  if (st.celeb) return;
  st.celeb = { t: 0, dur: REDUCED ? .4 : 1.15 };
  setTimeout(() => burst(x, y), 520);
}

function getSy() { return window.scrollY || document.documentElement.scrollTop || 0; }
function focusY(sy, jTop) {
  const fy0 = jTop + startY - 0;                         // viewport-y of START when scrollY = 0
  const t = smooth(clamp(sy / (vh * 0.5), 0, 1));
  return lerp(fy0, vh * FOCUS, t);
}

let last = performance.now();
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - last) / 1000); last = now; st.t += dt;
  if (!pathLen) return;

  const rect = jwrap.getBoundingClientRect(), sy = getSy(), jTop = rect.top + sy;
  const targetY = sy + focusY(sy, jTop) - jTop;
  const targetLen = clamp(lenAtY(targetY), 0, foxEnd);
  st.len += (targetLen - st.len) * (1 - Math.exp(-dt * 5.2));
  if (Math.abs(targetLen - st.len) < 0.05) st.len = targetLen;
  const dL = st.len - st.prev; st.prev = st.len;
  st.vel += (dL / Math.max(dt, 1e-3) - st.vel) * (1 - Math.exp(-dt * 10));
  const sp = clamp(Math.abs(st.vel) / 260, 0, 1);

  const p = pathEl.getPointAtLength(st.len), p2 = pathEl.getPointAtLength(Math.min(pathLen, st.len + 4)), p0 = pathEl.getPointAtLength(Math.max(0, st.len - 4));
  let tx = p2.x - p0.x, ty = p2.y - p0.y; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
  const X = rect.left + p.x, Y = rect.top + p.y + 6;

  /* progress + stage activation ------------------------------------ */
  travEl.style.strokeDashoffset = pathLen - st.len;
  barEl.style.width = (st.len / foxEnd * 100).toFixed(2) + '%';
  let count = 0;
  nodes.forEach((n, i) => {
    const k = i + 1;
    if (!st.reached[k] && st.len >= nodeLen[i] - 8) {
      st.reached[k] = true; nodeEls[i].classList.add('on'); cardEls[i].classList.add('reached');
      if (st.vel > 8 && modelReady) { say(STAGES[i].say); celebrate(X, Y); }
    } else if (st.reached[k] && st.len < nodeLen[i] - 36) {
      st.reached[k] = false; nodeEls[i].classList.remove('on'); cardEls[i].classList.remove('reached');
    }
    if (st.reached[k]) count = k;
  });
  if (!st.reached[0] && st.len >= foxEnd - 6 && st.vel > 8 && modelReady) { st.reached[0] = true; say(FINISH_SAY, 5200); celebrate(X, Y); }
  if (st.reached[0] && st.len < foxEnd - 40) st.reached[0] = false;
  if (count !== curStage) { curStage = count; nodeEls.forEach((el, i) => el.classList.toggle('cur', i + 1 === count)); }
  document.querySelectorAll('.links a').forEach((a, i) => a.classList.toggle('on', i === (count === 0 ? 0 : count < 4 ? 1 : st.reached[0] ? 3 : 2)));

  /* parallax decor ---------------------------------------------------- */
  for (const [el, k] of parallax) el.style.transform = `translate3d(0,${(-sy * k).toFixed(1)}px,0)`;

  if (!renderer || !modelReady) { drawParts(dt); return; }

  /* heading ---------------------------------------------------------- */
  if (Math.abs(st.vel) > 14) { st.dir = Math.sign(st.vel); st.idle = 0; } else st.idle += dt;
  let yawMove = Math.atan2(tx, ty) + (st.dir < 0 ? Math.PI : 0);
  const atEnd = st.len >= foxEnd - 2;
  const yawIdle = atEnd ? 0 : clamp((mouseX - X) / vw, -1, 1) * 0.7;
  const wIdle = smooth(clamp((st.idle - 0.9) / 0.7, 0, 1));
  const yawT = yawMove + wrapPi(yawIdle - yawMove) * wIdle;
  st.yaw += wrapPi(yawT - st.yaw) * (1 - Math.exp(-dt * 9));

  /* motion ------------------------------------------------------------ */
  st.phase += Math.abs(dL) / (foxH * 0.46) * Math.PI;
  const walk = smooth(clamp(sp * 3, 0, 1));
  let hop = Math.abs(Math.sin(st.phase)) * foxH * (0.05 + 0.06 * sp) * walk;
  let roll = Math.sin(st.phase) * 0.12 * walk, pitch = 0.1 + 0.12 * sp;
  let sq = Math.cos(st.phase * 2) * 0.03 * walk + Math.sin(st.t * 2.4) * 0.014 * (1 - walk);
  let spin = 0, alpha = 1, drop = 0;

  if (st.celeb) {
    const c = st.celeb; c.t += dt; const u = clamp(c.t / c.dur, 0, 1);
    hop += Math.sin(Math.PI * clamp((u - .1) / .8, 0, 1)) * foxH * 0.62;
    spin = (u < .1 ? 0 : (1 - Math.pow(1 - clamp((u - .1) / .8, 0, 1), 3)) * Math.PI * 2);
    sq += u < .12 ? -0.16 * (u / .12) : u > .86 ? 0.14 * Math.sin((u - .86) / .14 * Math.PI) - 0.04 : 0.06;
    pitch += Math.sin(Math.PI * u) * 0.14;
    if (u >= 1) st.celeb = null;
  }
  if (st.intro >= 0) {
    st.intro += dt / (REDUCED ? .01 : 1.5); const u = clamp(st.intro, 0, 1);
    drop = (1 - easeOutBounce(u)) * vh * 0.65; spin += (1 - smooth(u)) * Math.PI * 2; alpha = clamp(u * 6, 0, 1);
    if (u >= 1) { st.intro = -1; if (!st.greeted) { st.greeted = true; say(START_SAY, 4200); burst(X, Y, 18); setTimeout(() => { if (getSy() < 40) say('Scroll down — I will lead the way!', 4000); }, 6200); } }
  }
  if (atEnd && st.intro < 0 && !st.celeb && st.idle > 3 && now > (st.nextWave || 0)) { st.nextWave = now + 6000; celebrate(X, Y); }

  /* apply ------------------------------------------------------------- */
  const H = foxH;
  root.scale.setScalar(H);
  root.position.set(X, vh - Y + hop + drop, 0);
  tilt.rotation.set(pitch, 0, roll);
  tilt.scale.set(1 + sq * 0.7, 1 - sq, 1 + sq * 0.7);
  spinG.rotation.y = st.yaw + MODEL_YAW + spin;
  if (alpha !== st.alpha) { st.alpha = alpha; root.traverse((o) => { if (o.isMesh && o !== shadow) { o.material.transparent = alpha < 1; o.material.opacity = alpha; o.material.needsUpdate = true; } }); }

  const lift = clamp((hop + drop) / (H * .6), 0, 1.4);
  shadow.position.set(X, vh - Y - 2, -100);
  shadow.scale.set(H * 0.8 * (1 - lift * 0.3), H * 0.22 * (1 - lift * 0.3), 1);
  shadow.material.opacity = (1 - clamp(lift, 0, 1) * 0.65) * alpha;

  /* trail sparkles ------------------------------------------------------ */
  if (!REDUCED && sp > 0.12) { st.emit += sp * dt * 34; while (st.emit > 1) { st.emit -= 1; spark(X - tx * st.dir * 14, Y, sp); } }
  drawParts(dt);
  renderer.render(scene, cam);

  /* speech bubble ---------------------------------------------------------- */
  const bx = clamp(X + H * 0.16, 10, vw - bubbleW - 10), by = Math.max(70, Y - hop - drop - H * 1.12 - bubbleH);
  bubble.style.transform = `translate3d(${bx.toFixed(1)}px,${by.toFixed(1)}px,0)`;
  if (sp > 0.55 && !st.celeb) bubble.classList.remove('show');
}

/* ------------------------------------------------------------------ *
 *  Navigation, reveal, counters, toasts
 * ------------------------------------------------------------------ */
function maxScroll() { return document.documentElement.scrollHeight - vh; }
function scrollToStage(i) {
  const jTop = jwrap.getBoundingClientRect().top + getSy(), target = jTop + nodes[i - 1].y;
  let lo = 0, hi = maxScroll();
  for (let k = 0; k < 30; k++) { const m = (lo + hi) / 2; if (m + focusY(m, jTop) < target) lo = m; else hi = m; }
  scrollTo({ top: Math.round(hi), behavior: REDUCED ? 'auto' : 'smooth' });
}
document.addEventListener('click', (e) => {
  const go = e.target.closest('[data-go]');
  if (go) {
    e.preventDefault(); const v = go.dataset.go;
    if (v === 'top') scrollTo({ top: 0, behavior: 'smooth' });
    else if (v === 'end') scrollTo({ top: maxScroll(), behavior: 'smooth' });
    else scrollToStage(+v);
  }
  const t = e.target.closest('[data-toast]');
  if (t) { toastEl.textContent = t.dataset.toast; toastEl.classList.add('show'); clearTimeout(toastEl._t); toastEl._t = setTimeout(() => toastEl.classList.remove('show'), 2400); }
});

const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  setTimeout(() => e.target.classList.add('in'), 60); io.unobserve(e.target);
}), { threshold: 0.12 });
cardEls.forEach((c) => io.observe(c));

const countIO = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return; countIO.unobserve(e.target);
  const n = +e.target.dataset.n, s = e.target.dataset.s, t0 = performance.now();
  (function tick(now) { const u = clamp((now - t0) / 1400, 0, 1), v = Math.round(n * (1 - Math.pow(1 - u, 3))); e.target.textContent = v + s; if (u < 1) requestAnimationFrame(tick); })(t0);
}), { threshold: 0.6 });
document.querySelectorAll('.stat b').forEach((b) => countIO.observe(b));

let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(layout, 120); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
new ResizeObserver(() => { if (mobile) layout(); }).observe(hero);

layout();
st.len = st.prev = 0;
requestAnimationFrame(frame);
if (!renderer) document.documentElement.classList.add('ready');
window.__teko = { st, scrollToStage, get foxEnd() { return foxEnd; } };   // handy for debugging in the console
