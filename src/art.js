// All 2D artwork (inline SVG strings) + stage content for the Teklozy journey page.

export const STAGES = [
  { t: 'Career Awareness', s: 'Discover your path.', b: ['Interests & strengths', 'Explore tech careers', 'Career insights'], art: 'compass',
    say: "Stage 1 — let's find what lights you up!" },
  { t: 'Learning & Practice', s: 'Learn, practice, streak.', b: ['Curated resources', 'Coding challenges', 'Daily XP streaks'], art: 'laptop',
    say: 'Learn, practice, keep that streak alive!' },
  { t: 'Complete Ecosystem', s: 'Go deeper.', b: ['Advanced learning', 'System design', 'Skill tree'], art: 'cubes',
    say: 'Going deeper — unlock the whole skill tree!' },
  { t: 'Startup Experience', s: 'Build like a startup.', b: ['Real-world project', 'Jira workflow', 'Industry standards'], art: 'bulb',
    say: 'Now we build like a real startup!' },
  { t: 'Scaling & Deployment', s: 'Ship it. Scale it.', b: ['Cloud deployment', 'Autonomous testing', 'Metrics & monitoring'], art: 'cloud',
    say: 'Ship it. Scale it. Watch the metrics!' },
  { t: 'Professional Identity', s: 'Look hireable.', b: ['ATS-ready resume', 'LinkedIn & GitHub', 'Verified portfolio'], art: 'resume',
    say: "Let's make you look hireable!" },
  { t: 'Interview Preparation', s: 'Practice the pressure.', b: ['System design', 'Mock interviews', 'Expert sessions'], art: 'chat',
    say: "Pressure makes diamonds. You've got this!" },
  { t: 'Opportunity Ecosystem', s: 'Real jobs. Zero fakes.', b: ['Verified jobs', 'Freelancing bounties', 'Hackathons & certifications'], art: 'case',
    say: 'Real jobs only. Zero fakes!' },
  { t: 'Industry Immersion', s: 'Step into the real world.', b: ['Industry visits', 'Real-world projects', 'One-to-one experts'], art: 'city',
    say: 'Step into the real world with me!' },
  { t: 'Career Legacy', s: 'Your next chapter starts here.', b: ['Alumni stories', 'Mentorship', 'Guide the next generation'], art: 'trophy',
    say: 'Legacy unlocked. Now guide the next one!' },
];

export const FINISH_SAY = 'You made it! Your next chapter starts here.';
export const START_SAY = "Hi! I'm Teko. Let's find your path together!";

const base = `<path d="M6 76 L65 51 L124 76 L65 104 Z" fill="#fff" stroke="#d7e6ff" stroke-width="1.5"/>
<path d="M6 76 L65 104 L65 110 L6 82 Z" fill="#cddffb"/><path d="M124 76 L65 104 L65 110 L124 82 Z" fill="#b6cff6"/>`;

function cube(x, y, s, top, left, right) {
  const h = s * 0.5;
  return `<g><path d="M${x} ${y - s} L${x + s} ${y - s + h} L${x} ${y - s + 2 * h} L${x - s} ${y - s + h}Z" fill="${top}"/>
<path d="M${x - s} ${y - s + h} L${x} ${y - s + 2 * h} L${x} ${y + 2 * h} L${x - s} ${y + h}Z" fill="${left}"/>
<path d="M${x + s} ${y - s + h} L${x} ${y - s + 2 * h} L${x} ${y + 2 * h} L${x + s} ${y + h}Z" fill="${right}"/></g>`;
}

const ART = {
  compass: `${base}
<ellipse cx="65" cy="80" rx="26" ry="8" fill="#9db8e8" opacity=".35"/>
<rect x="58" y="14" width="14" height="9" rx="3" fill="#8fa6cf"/><rect x="52" y="9" width="26" height="6" rx="3" fill="#a9bddd"/>
<circle cx="65" cy="52" r="29" fill="#fff" stroke="#8db4f5" stroke-width="6"/><circle cx="65" cy="52" r="21" fill="#eaf3ff" stroke="#c7dbfb" stroke-width="1.5"/>
<g stroke="#9bb9ea" stroke-width="2" stroke-linecap="round"><path d="M65 33v4M65 67v4M46 52h4M80 52h4"/></g>
<path d="M65 36 L71.5 52 L65 68 L58.5 52Z" fill="#cfd9ea" transform="rotate(38 65 52)"/>
<path d="M65 36 L71.5 52 L58.5 52Z" fill="#2f7bff" transform="rotate(38 65 52)"/><circle cx="65" cy="52" r="3.4" fill="#fff" stroke="#2f7bff" stroke-width="2"/>`,

  laptop: `${base}
<path d="M30 70 L96 56 L110 63 L44 79Z" fill="#cfe0fb"/><path d="M34 69 L95 56 L104 60 L43 74Z" fill="#e9f1ff"/>
<path d="M32 32 L88 18 L102 56 L44 68Z" fill="#162f73"/><path d="M36 35 L85 23 L97 53 L46 64Z" fill="#1f46a8"/>
<g stroke="#8fc0ff" stroke-width="2.4" stroke-linecap="round"><path d="M45 38l22-5M48 45l14-3M52 52l26-6M56 59l12-2"/></g>
<g stroke="#ffd36b" stroke-width="2.4" stroke-linecap="round"><path d="M66 45l10-2M72 52l9-2"/></g>`,

  cubes: `${base}
${cube(50, 66, 17, '#cfe0ff', '#4f86f3', '#2f63d6')}
${cube(86, 68, 14, '#d9e8ff', '#7db0ff', '#4a86f0')}
${cube(68, 46, 17, '#dfe9ff', '#1d3f9e', '#122c75')}
<g fill="#7fb0ff"><circle cx="66" cy="52" r="1.6"/><circle cx="62" cy="56" r="1.6"/><circle cx="72" cy="56" r="1.6"/></g>`,

  bulb: `${base}
<ellipse cx="65" cy="76" rx="20" ry="6" fill="#9db8e8" opacity=".3"/>
<rect x="52" y="64" width="26" height="12" rx="4" fill="#92a4c4"/><path d="M54 68h22M54 72h22" stroke="#6f83a8" stroke-width="2"/>
<path d="M65 12 C44 12 36 30 44 44 C48 51 51 54 51 62 H79 C79 54 82 51 86 44 C94 30 86 12 65 12Z" fill="#e6f1ff" stroke="#bcd6fb" stroke-width="2"/>
<path d="M65 14 C48 14 40 30 47 42 C50 47 54 52 54 60 H76 C76 52 80 47 83 42 C90 30 82 14 65 14Z" fill="#fff" opacity=".7"/>
<path d="M58 60 L60 40 L65 46 L70 40 L72 60" fill="none" stroke="#ffb02e" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="65" cy="36" r="8" fill="#ffd36b" opacity=".55"/>`,

  cloud: `${base}
${cube(76, 80, 20, '#d8e7ff', '#3b78ee', '#2559c9')}
${cube(76, 64, 20, '#d8e7ff', '#4a86f3', '#2c63d8')}
${cube(76, 48, 20, '#e4eeff', '#2f6be8', '#1d4cb8')}
<g fill="#cfe3ff"><circle cx="70" cy="58" r="1.6"/><circle cx="70" cy="74" r="1.6"/><circle cx="70" cy="90" r="1.6"/></g>
<g><circle cx="34" cy="36" r="11" fill="#fff"/><circle cx="48" cy="30" r="14" fill="#fff"/><circle cx="60" cy="38" r="10" fill="#fff"/><rect x="26" y="36" width="42" height="11" rx="5.5" fill="#fff"/></g>
<path d="M30 36c0-6 5-10 10-9" stroke="#d3e4ff" stroke-width="2" fill="none"/>`,

  resume: `${base}
<path d="M30 74 L58 62 L96 76 L68 90Z" fill="#cfe0fb" opacity=".0"/>
<g transform="rotate(-6 62 50)"><rect x="34" y="12" width="56" height="72" rx="6" fill="#fff" stroke="#cfe0fb" stroke-width="2"/>
<circle cx="50" cy="30" r="8" fill="#9fc3ff"/><path d="M38 46c2-8 20-8 24 0z" fill="#9fc3ff"/>
<rect x="64" y="25" width="20" height="4" rx="2" fill="#2f7bff"/><rect x="64" y="33" width="14" height="3" rx="1.5" fill="#bcd3f8"/>
<rect x="40" y="52" width="44" height="3" rx="1.5" fill="#cfe0fb"/><rect x="40" y="60" width="38" height="3" rx="1.5" fill="#cfe0fb"/><rect x="40" y="68" width="42" height="3" rx="1.5" fill="#cfe0fb"/></g>
<circle cx="96" cy="70" r="12" fill="#2f7bff" stroke="#fff" stroke-width="3"/><path d="M90 70l4 4 8-9" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,

  chat: `${base}
<path d="M30 20 h50 a8 8 0 0 1 8 8 v22 a8 8 0 0 1 -8 8 h-30 l-14 12 v-12 h-6 a8 8 0 0 1 -8 -8 v-22 a8 8 0 0 1 8 -8Z" fill="#2f7bff"/>
<path d="M30 20 h50 a8 8 0 0 1 8 8 v4 h-66 v-4 a8 8 0 0 1 8 -8Z" fill="#5a9bff"/>
<g fill="#fff"><circle cx="44" cy="40" r="4"/><circle cx="58" cy="40" r="4"/><circle cx="72" cy="40" r="4"/></g>
<path d="M82 52 h26 a7 7 0 0 1 7 7 v14 a7 7 0 0 1 -7 7 h-3 v10 l-12 -10 h-11 a7 7 0 0 1 -7 -7 v-14 a7 7 0 0 1 7 -7Z" fill="#fff" stroke="#cfe0fb" stroke-width="2"/>
<g fill="#2f7bff"><circle cx="86" cy="66" r="3"/><circle cx="96" cy="66" r="3"/><circle cx="106" cy="66" r="3"/></g>`,

  case: `${base}
<ellipse cx="65" cy="82" rx="30" ry="8" fill="#9db8e8" opacity=".3"/>
<path d="M52 34 v-8 a6 6 0 0 1 6 -6 h14 a6 6 0 0 1 6 6 v8" fill="none" stroke="#1b49b8" stroke-width="6" stroke-linecap="round"/>
<rect x="30" y="32" width="70" height="46" rx="9" fill="#2f7bff"/><rect x="30" y="32" width="70" height="20" rx="9" fill="#5a9bff"/>
<rect x="30" y="50" width="70" height="4" fill="#1b49b8" opacity=".5"/><rect x="58" y="46" width="14" height="14" rx="3" fill="#ffd36b" stroke="#e7a92c" stroke-width="2"/>
<path d="M36 36h58" stroke="#fff" opacity=".35" stroke-width="2" stroke-linecap="round"/>`,

  city: `${base}
<g><path d="M30 76V40l14-6v42Z" fill="#9cc0ff"/><path d="M44 78V34l16 6v38Z" fill="#6ea4ff"/>
<path d="M60 84V22l16-8v70Z" fill="#2f63d6"/><path d="M76 84V14l18 8v62Z" fill="#1d4cb8"/>
<path d="M94 80V44l12 6v30Z" fill="#8db4f5"/></g>
<g fill="#cfe3ff" opacity=".9"><rect x="64" y="28" width="3" height="3"/><rect x="64" y="38" width="3" height="3"/><rect x="64" y="48" width="3" height="3"/><rect x="64" y="58" width="3" height="3"/><rect x="70" y="28" width="3" height="3"/><rect x="70" y="38" width="3" height="3"/><rect x="70" y="48" width="3" height="3"/><rect x="70" y="58" width="3" height="3"/>
<rect x="81" y="26" width="3" height="3"/><rect x="81" y="38" width="3" height="3"/><rect x="81" y="50" width="3" height="3"/><rect x="87" y="26" width="3" height="3"/><rect x="87" y="38" width="3" height="3"/><rect x="87" y="50" width="3" height="3"/></g>
<path d="M68 14 v-8" stroke="#5a9bff" stroke-width="2"/>`,

  trophy: `${base}
<ellipse cx="65" cy="84" rx="26" ry="7" fill="#9db8e8" opacity=".3"/>
<path d="M44 26 H36 a4 4 0 0 0 -4 4 c0 12 8 20 18 21" fill="none" stroke="#e7a92c" stroke-width="6" stroke-linecap="round"/>
<path d="M86 26 H94 a4 4 0 0 1 4 4 c0 12 -8 20 -18 21" fill="none" stroke="#e7a92c" stroke-width="6" stroke-linecap="round"/>
<path d="M44 18 H86 V38 C86 54 76 62 65 62 C54 62 44 54 44 38Z" fill="#ffcf4a"/>
<path d="M44 18 H58 V60 C50 56 44 48 44 38Z" fill="#ffe08a"/><path d="M72 18 H86 V38 C86 50 80 58 72 61Z" fill="#f0b021"/>
<rect x="59" y="62" width="12" height="12" fill="#e7a92c"/><rect x="48" y="72" width="34" height="10" rx="3" fill="#2f63d6"/><rect x="48" y="72" width="34" height="4" rx="2" fill="#5a9bff"/>
<text x="65" y="46" text-anchor="middle" font-family="Plus Jakarta Sans,sans-serif" font-weight="800" font-size="18" fill="#fff" opacity=".9">0</text>`,
};

export function art(name) {
  return `<svg viewBox="0 0 130 112" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${ART[name]}</svg>`;
}

export const bulletIcon = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.4l5.6 3.2v6.8L8 14.6l-5.6-3.2V4.6z" fill="#eaf2ff" stroke="#3a82ff" stroke-width="1.3" stroke-linejoin="round"/><circle cx="8" cy="8" r="2" fill="#3a82ff"/></svg>`;

// ---- decorative generators ------------------------------------------------
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

export function skyline(w, h, seed = 1, windows = true) {
  const r = rng(seed); let x = 0, out = '';
  const id = 'sk' + seed;
  while (x < w - 6) {
    const bw = 14 + r() * 26, bh = h * (0.25 + r() * 0.7), y = h - bh;
    const tall = bh > h * 0.75;
    out += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="2" fill="url(#${id})" opacity="${0.55 + r() * 0.45}"/>`;
    if (tall) out += `<rect x="${x + bw / 2 - 1}" y="${y - 16}" width="2" height="16" fill="#8db4f5"/>`;
    if (windows) for (let wy = y + 8; wy < h - 8; wy += 9) {
      if (r() > 0.45) out += `<rect x="${x + 4}" y="${wy}" width="${Math.max(2, bw - 8)}" height="2" fill="#fff" opacity=".6"/>`;
    }
    x += bw + 2 + r() * 4;
  }
  return `<svg viewBox="0 -16 ${w} ${h + 16}" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a9bff"/><stop offset="1" stop-color="#cfe2ff"/></linearGradient></defs>${out}</svg>`;
}

export function tree(c1 = '#6fb3ab', c2 = '#4f958f') {
  return `<svg viewBox="0 0 40 60" aria-hidden="true"><rect x="18.5" y="40" width="3" height="16" rx="1.5" fill="#7a8fb0"/><ellipse cx="20" cy="26" rx="14" ry="22" fill="${c2}"/><ellipse cx="17" cy="24" rx="9" ry="17" fill="${c1}"/></svg>`;
}

export function mountain(c = '#cfe0fb') {
  return `<svg viewBox="0 0 400 160" preserveAspectRatio="none" aria-hidden="true"><path d="M0 160 L70 70 L110 105 L190 20 L270 110 L320 70 L400 160Z" fill="${c}"/><path d="M190 20 L215 62 L190 52 L172 66Z" fill="#fff" opacity=".7"/></svg>`;
}

export function island(w = 110) {
  return `<svg viewBox="0 0 120 80" width="${w}" aria-hidden="true"><path d="M4 22 Q60 -2 116 22 Q112 34 100 38 L70 74 Q60 82 50 74 L20 38 Q8 34 4 22Z" fill="#e4eefc"/><path d="M4 22 Q60 -2 116 22 Q60 44 4 22Z" fill="#fff"/><path d="M20 38 L50 74 Q60 82 70 74 L100 38 Q60 50 20 38Z" fill="#cfe0f8"/></svg>`;
}

export const icons = {
  students: `<svg viewBox="0 0 48 48"><circle cx="24" cy="18" r="7" fill="#fff" stroke="#2f7bff" stroke-width="3"/><path d="M10 40c1-9 7-13 14-13s13 4 14 13" fill="#e6f0ff" stroke="#2f7bff" stroke-width="3" stroke-linecap="round"/><circle cx="24" cy="18" r="13" fill="none" stroke="#bcd3f8" stroke-width="2" stroke-dasharray="3 4"/></svg>`,
  paths: `<svg viewBox="0 0 48 48"><path d="M24 5l16 9v20l-16 9-16-9V14z" fill="#e6f0ff" stroke="#2f7bff" stroke-width="3" stroke-linejoin="round"/><path d="M8 14l16 9 16-9M24 23v20" stroke="#2f7bff" stroke-width="3" fill="none"/></svg>`,
  projects: `<svg viewBox="0 0 48 48"><path d="M24 5l16 9v20l-16 9-16-9V14z" fill="#e6f0ff" stroke="#2f7bff" stroke-width="3" stroke-linejoin="round"/><path d="M8 14l16 9 16-9M24 23v20" stroke="#2f7bff" stroke-width="3" fill="none"/><circle cx="24" cy="23" r="4" fill="#2f7bff"/></svg>`,
  community: `<svg viewBox="0 0 48 48"><circle cx="14" cy="24" r="5" fill="#e6f0ff" stroke="#2f7bff" stroke-width="3"/><circle cx="34" cy="24" r="5" fill="#e6f0ff" stroke="#2f7bff" stroke-width="3"/><circle cx="24" cy="12" r="5" fill="#e6f0ff" stroke="#2f7bff" stroke-width="3"/><circle cx="24" cy="36" r="5" fill="#e6f0ff" stroke="#2f7bff" stroke-width="3"/><path d="M19 24h5M24 17v14" stroke="#2f7bff" stroke-width="2" opacity=".5"/></svg>`,
};
