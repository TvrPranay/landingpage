/**
 * Guest preview backend. When a visitor enters the guest workspace, every `/api/v1/*` call is
 * answered here, in the browser, with the same response shapes as the Teklozy API. Progress is
 * kept in localStorage so the whole journey can be walked through without a server:
 * Discover (Level 1) → choose the Development path → Stage 2 modules, lessons and tickets → tunnels.
 *
 * Nothing here is sent anywhere. Real accounts never use this module.
 */

import CURRICULUM from './curriculumData.js';

const KEY = 'teklozyDemoState';
const VERSION = 3;

const DAY = 86_400_000;
const isoDay = (d = new Date()) => new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function fresh() {
  return {
    version: VERSION,
    xp: 0,
    days: [],
    publicName: '',
    journeyView: 'map',
    leaderboardVisible: false,
    welcomeDone: false,
    exploring: null,
    enrolledCourses: {},
    lessonsDone: {},
    finalized: null,
    s2Enrolled: false,
    s2Done: {},
    s2Passed: {},
    attempts: {},
    drafts: {},
    hints: {},
    notes: {},
    challengePassed: {},
    notifications: [],
  };
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && saved.version === VERSION) return { ...fresh(), ...saved };
  } catch { /* corrupt state starts over */ }
  return fresh();
}
function save(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage full or blocked */ }
}

/** Clears the guest's saved progress (used when the guest signs out). */
export function resetDemo() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}

const fail = (status, code, message, details) => ({ __demoError: true, status, code, message, details });

function award(s, xp, type) {
  s.xp += xp;
  const today = isoDay();
  if (!s.days.includes(today)) s.days.push(today);
  if (type) s.notifications.unshift({ id: `n${Date.now()}${Math.random().toString(16).slice(2, 6)}`, type, created_at: new Date().toISOString(), read_at: null });
}

/* ------------------------------------------------------------------ catalog */

const LEVEL_TITLES = ['Discover', 'Learn Basics', 'Learn Advanced', 'Start Building', 'Networking', 'Advanced Building', 'Interview Prep', 'Apply', 'Premium', 'Alumni Connect'];

const PATHWAYS = [
  {
    id: 'software-development', title: 'Software Development', displayTitle: 'Development', xpReward: 25,
    description: 'Discover how software is designed, developed and deployed, and the careers it leads to.',
    domains: [{ id: 'fe', title: 'Frontend' }, { id: 'be', title: 'Backend' }, { id: 'db', title: 'Database' }, { id: 'dep', title: 'Deployment' }],
  },
  {
    id: 'ai-engineering', title: 'Artificial Intelligence', displayTitle: 'Artificial Intelligence', xpReward: 25,
    description: 'Discover how machines learn, generate content and perform intelligent tasks.',
    domains: [{ id: 'ml', title: 'Machine Learning' }, { id: 'dl', title: 'Deep Learning' }, { id: 'gen', title: 'GenAI' }, { id: 'ag', title: 'Agentic AI' }],
  },
];

const COURSE = {
  'software-development': {
    id: 'cv-dev',
    description: 'Explore how software is designed, developed and deployed, and the careers it leads to.',
    objectives: ['How software is designed and built', 'Frontend, backend and databases', 'Deployment and the cloud', 'Developer career roles and a roadmap'],
    modules: [
      ['How Software Is Built', 'From idea to running product: the software lifecycle.', 'What is software?', 6, 25, 'visual'],
      ['Frontend, Backend & Databases', 'What each layer does and how they talk to each other.', 'The three layers of an app', 8, 25, 'visual'],
      ['Shipping to Production', 'Deployment, cloud and keeping apps running.', 'From laptop to the cloud', 8, 25, 'reading'],
      ['Careers in Development', 'Roles, skills, tools and a roadmap to get started.', 'Development careers check', 6, 50, 'quiz'],
    ],
  },
  'ai-engineering': {
    id: 'cv-ai',
    description: 'Explore Artificial Intelligence, understand how it works, its real-world uses, and the career opportunities it offers.',
    objectives: ['AI basics and key concepts', 'Core areas: ML, DL, GenAI, Agentic AI', 'Real-world applications and impact', 'AI career roles and a beginner roadmap'],
    modules: [
      ['Introduction to AI', 'What is AI, why it matters, and where it is used.', 'What is AI?', 6, 25, 'visual'],
      ['Core Areas of AI', 'Explore ML, DL, GenAI and Agentic AI in simple terms.', 'Four areas of AI', 8, 25, 'visual'],
      ['Real-World Applications', 'See how AI is used in products, industries and everyday life.', 'AI around you', 8, 25, 'reading'],
      ['Careers in AI', 'Roles, skills, tools and a roadmap to get started.', 'AI careers check', 6, 50, 'quiz'],
    ],
  },
};
const versionToPath = { 'cv-dev': 'software-development', 'cv-ai': 'ai-engineering' };
/** Every module has three lessons: a video lesson, key notes and a quick quiz (placeholders in the preview). */
const LESSONS_PER_MODULE = 3;
const lessonId = (pathId, i, j = 0) => `${pathId === 'ai-engineering' ? 'ai' : 'dev'}-m${i + 1}-l${j + 1}`;
const parseLesson = (id) => { const m = String(id).match(/-m(\d+)-l(\d+)$/); return m ? { i: Number(m[1]) - 1, j: Number(m[2]) - 1 } : { i: 0, j: 0 }; };
const moduleDone = (s, pathId, i) => Array.from({ length: LESSONS_PER_MODULE }, (_, j) => lessonId(pathId, i, j)).every((id) => s.lessonsDone[id]);
const lessonOwner = (id) => (id.startsWith('ai-') ? 'ai-engineering' : 'software-development');

/** Stage 2 Development Basics: four groups, some modules published, the rest awaiting content. */
/* Module slots and authored concepts come from the backend registries (see curriculumData.js). */
const BATCHES = CURRICULUM.batches;
const CONCEPTS = CURRICULUM.concepts;
const GROUPS = [
  { number: 1, title: 'Core Concepts', summary: 'How browsers, servers and design decisions really work.' },
  { number: 2, title: 'Build & Compose', summary: 'Data, components and APIs that fit together.' },
  { number: 3, title: 'Workflows & Tools', summary: 'Testing, debugging, security and the tools teams use.' },
  { number: 4, title: 'Real Development', summary: 'Reliability, performance and shipping to production.' },
];
const range = (p, a, b) => Array.from({ length: b - a + 1 }, (_, i) => `${p}${String(a + i).padStart(2, '0')}`);
const TUNNELS = {
  dsa: {
    id: 'dsa', batchId: 'dsa-tunnel', title: 'DSA Tunnel', startHere: 'DSA01', optional: true, project: null,
    purpose: 'Practise data structures and algorithms through engineering problems: reconciliation, scheduling, deduplication, dependency ordering and budgets.',
    whenToEnter: 'Open any time. Each module names the Development lesson it supports, such as heaps for job priority or graphs for deployment order.',
    levels: [{ id: 'dsa', title: 'Core', readiness: null, modules: range('DSA', 1, 10) }],
  },
  ai: {
    id: 'ai', batchId: 'ai-basics', title: 'AI Tunnel', startHere: 'AI01', optional: true,
    project: { id: 'ai-document-assistant', title: 'Document Q&A Assistant', summary: 'Parse, search and answer over a policy library with page citations, abstention, controlled tools and an evaluation report.' },
    purpose: 'Build a document assistant step by step: Python foundations, evaluation, retrieval, cited answers, controlled tools and safe releases.',
    whenToEnter: 'Open any time. Development Backend modules BE01–BE02 make AI10 (FastAPI) easier; nothing here blocks the main course.',
    levels: [
      { id: 'foundations', title: 'Foundations', readiness: null, modules: range('AI', 1, 10) },
      { id: 'advanced', title: 'Advanced', readiness: 'Complete AI10 (FastAPI, streaming and tracing) to open the advanced missions.', modules: range('AI', 11, 20) },
    ],
  },
};
const BATCH_TITLES = { 'development-basics': 'Development Basics', 'development-advanced': 'Development Advanced', 'dsa-tunnel': 'DSA Tunnel', 'ai-basics': 'AI Tunnel' };
const slotsOf = (batchId) => BATCHES[batchId] ?? [];
const slotOf = (batchId, moduleId) => slotsOf(batchId).find((m) => m.id === moduleId);
const isPublished = (slot) => slot.concepts.length > 0 && slot.concepts.every((c) => CONCEPTS[c.id]);
function batchModules(batchId) {
  return slotsOf(batchId).map((m) => ({ ...m, published: isPublished(m) }));
}

/* ------------------------------------------------------------------ derived state */

function stageModules(s) {
  const base = [
    ['welcome', 'Welcome to Teklozy', 'Get familiar with the platform and your journey', 6, 'orientation', s.welcomeDone],
    ['developer-profile', 'Set Up Your Developer Profile', 'Create your profile and personalise your path', 8, 'profile_setup', Boolean(s.publicName)],
    ['explore-paths', 'Explore the Learning Paths', 'Understand the 10-level journey and key outcomes', 7, 'path_exploration', Object.keys(s.lessonsDone).length > 0],
    ['plan-career', 'Plan Your Tech Career', 'Set your goals and unlock the next level', 10, 'path_finalization', Boolean(s.finalized)],
  ];
  let open = true;
  const modules = base.map(([key, title, description, estimatedMinutes, completionRule, done], i) => {
    // Guest preview: nothing is locked, so every step can be opened while testing.
    const m = { key, position: i + 1, title, description, estimatedMinutes, completionRule, isCompleted: done, isLocked: false };
    if (!done) open = false;
    if (completionRule === 'path_exploration') {
      m.paths = PATHWAYS.filter((p) => p.id === 'software-development').map((p) => ({ pathwayId: p.id, title: p.displayTitle, courseVersionId: COURSE[p.id].id, isCompleted: coursePercent(s, p.id) === 100, percent: coursePercent(s, p.id) }));
      m.finalizedPathwayId = s.finalized;
    }
    return m;
  });
  const completed = modules.filter((m) => m.isCompleted).length;
  return { stageNumber: 1, completedModules: completed, totalModules: 4, percent: completed * 25, current: modules.find((m) => !m.isCompleted)?.key ?? null, modules };
}
const level1Done = (s) => stageModules(s).completedModules === 4;

function coursePercent(s, pathId) {
  const n = COURSE[pathId].modules.length;
  return Math.round((COURSE[pathId].modules.filter((_, i) => moduleDone(s, pathId, i)).length * 100) / n);
}

function course(s, pathId) {
  const c = COURSE[pathId];
  // Guest preview: the course is always enrolled and every lesson is open.
  const enrolled = true;
  let open = true;
  const modules = c.modules.map(([title, description, lessonTitle, minutes, xp, format], i) => {
    const plan = [
      { title: lessonTitle, kind: 'reading', minutes, contentFormat: format === 'reading' ? null : 'visual' },
      { title: 'Key notes', kind: 'reading', minutes: 3, contentFormat: null },
      { title: 'Quick quiz', kind: 'quiz', minutes: 3, contentFormat: null },
    ];
    const lessons = plan.map((l, j) => {
      const id = lessonId(pathId, i, j);
      const done = Boolean(s.lessonsDone[id]);
      return {
        id, title: l.title, kind: l.kind, position: j + 1, estimatedMinutes: l.minutes, xp: j === 2 ? xp : 0, required: true, isCompleted: done,
        access: { allowed: open || done, nextAction: null }, contentFormat: l.contentFormat,
      };
    });
    const done = lessons.every((l) => l.isCompleted);
    return { id: `${pathId}-m${i + 1}`, title, description, position: i + 1, estimatedMinutes: minutes + 6, xp, isCompleted: done, isLocked: false, lessons };
  });
  const completedModules = modules.filter((m) => m.isCompleted).length;
  return {
    id: c.id, title: pathId === 'ai-engineering' ? 'AI Path' : 'Development Path', description: c.description, objectives: c.objectives,
    estimatedMinutes: c.modules.reduce((n, m) => n + m[3], 0), difficulty: 'foundation',
    enrollmentId: enrolled ? `demo-enr-${pathId}` : null, enrollmentState: enrolled ? 'enrolled' : null,
    totalModules: modules.length, completedModules, percent: Math.round((completedModules * 100) / modules.length), modules,
  };
}

const partKey = (conceptId, part) => `${conceptId}:${part}`;
const sKey = (batchId, conceptId) => `${batchId}|${conceptId}`;
function moduleState(s, batchId, m) {
  if (!m.published) return 'awaiting_content';
  const passed = m.concepts.every((c) => s.s2Passed[sKey(batchId, c.id)]);
  if (passed) return 'completed';
  const started = m.concepts.some((c) => s.s2Done[partKey(sKey(batchId, c.id), 'lesson')] || s.s2Passed[sKey(batchId, c.id)]);
  return started ? 'in_progress' : 'available';
}
/** Guest preview: every published module is open; slots without content are "under development". */
function curriculum(s, batchId) {
  return batchModules(batchId).sort((a, b) => a.order - b.order).map((m) => ({
    id: m.id, code: m.code, order: m.order, title: m.title, label: m.title, track: m.track, trackTitle: m.trackTitle,
    state: moduleState(s, batchId, m), status: m.published ? 'published' : 'awaiting_content', kind: 'written',
    concepts: m.concepts.map((c) => ({ id: c.id, title: c.title })), prerequisites: m.prerequisites,
  }));
}
function progress(s, batchId) {
  const mods = curriculum(s, batchId);
  const done = mods.filter((m) => m.state === 'completed').length;
  return {
    batchId, modulesCompleted: done, modulesTotal: mods.length, modulesPublished: mods.filter((m) => m.status === 'published').length,
    percent: Math.floor((done * 100) / Math.max(1, mods.length)), modules: mods.map((m) => ({ moduleId: m.id, state: m.state, bestScore: null })),
  };
}
const s2Complete = (s) => curriculum(s, 'development-basics').filter((m) => m.status === 'published').every((m) => m.state === 'completed');

function journeyLevels(s) {
  const l1 = level1Done(s);
  return LEVEL_TITLES.map((title, i) => {
    const number = i + 1;
    let state = 'locked';
    if (number === 1) state = l1 ? 'completed' : 'available';
    else if (number === 2) state = s2Complete(s) ? 'completed' : 'available';
    else if (number === 3 && s2Complete(s)) state = 'upcoming';
    return {
      number, title, state, courseVersionId: null, rewardXp: number === 1 ? 25 : number === 2 ? 50 : 0,
      badge: number === 1 ? 'Discover' : number === 2 ? 'Foundations' : null, estimatedMinutes: 40,
      description: number === 1 ? 'Start your journey in tech. Explore the platform, set up your path, and build a strong foundation for what\'s ahead.' : '',
    };
  });
}

const LEVEL_XP = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500];
const LEVEL_NAMES = ['Tech Explorer', 'Code Cadet', 'Tech Apprentice', 'Junior Builder', 'Builder', 'Engineer', 'Senior Engineer', 'Architect', 'Tech Lead', 'Tech Master'];
function gamification(s) {
  let level = 1;
  while (level < LEVEL_XP.length - 1 && s.xp >= LEVEL_XP[level]) level += 1;
  const st = streak(s);
  return {
    totalXp: s.xp, platformLevel: level, xpForCurrentLevel: LEVEL_XP[level - 1], xpForNextLevel: LEVEL_XP[level],
    xpToNextLevel: LEVEL_XP[level] - s.xp, levelTitle: LEVEL_NAMES[level - 1], streakDays: st.currentDays, longestStreakDays: st.longestDays,
    achievements: level1Done(s) ? [{ key: 'discover', title: 'Discover' }] : [],
  };
}

function streak(s) {
  const today = isoDay();
  const t = Math.round(Date.parse(`${today}T00:00:00Z`) / DAY);
  const days = new Set(s.days.map((d) => Math.round(Date.parse(`${d}T00:00:00Z`) / DAY)));
  const todayDone = days.has(t);
  const anchor = todayDone ? t : days.has(t - 1) ? t - 1 : null;
  let currentDays = 0;
  while (anchor !== null && days.has(anchor - currentDays)) currentDays += 1;
  const weekday = (new Date(`${today}T00:00:00Z`).getUTCDay() + 6) % 7;
  const week = WEEKDAYS.map((w, i) => {
    const n = t - weekday + i;
    return { date: new Date(n * DAY).toISOString().slice(0, 10), weekday: w, done: days.has(n), isToday: n === t, isFuture: n > t };
  });
  const message = currentDays === 0 ? 'Complete a lesson today to start your streak.'
    : !todayDone ? `Learn today to keep your ${currentDays}-day streak going.`
    : currentDays === 1 ? 'Great start! Come back tomorrow to build your streak.'
    : 'Keep the momentum! Learn daily, practice and build consistently.';
  return { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, today, currentDays, longestDays: currentDays, todayDone, atRisk: currentDays > 0 && !todayDone, lastActiveDay: s.days[s.days.length - 1] ?? null, week, message };
}

const EVENTS = [
  { id: 'demo-e1', title: 'DSA Tunnel: Kickoff', description: 'Start your DSA quest and earn XP', starts_at: new Date(Date.now() + 5 * DAY).toISOString(), ends_at: null, capacity: 200, location: 'Online', registrationState: null },
  { id: 'demo-e2', title: 'Expert Session: System Design', description: 'Learn from industry experts', starts_at: new Date(Date.now() + 9 * DAY).toISOString(), ends_at: null, capacity: 100, location: 'Online', registrationState: null },
];

function dashboard(s) {
  const levels = journeyLevels(s);
  const completedLevels = levels.filter((l) => l.state === 'completed').length;
  return {
    identity: { unreadNotifications: s.notifications.filter((n) => !n.read_at).length },
    journey: { pathwayId: s.finalized ?? s.exploring, levels, completedLevels, nextMilestone: null },
    gamification: gamification(s),
    preferences: prefs(s),
    announcements: [{ id: 'demo-a1', title: 'Welcome to the guest preview', body: 'Your progress is saved in this browser only.', starts_at: new Date().toISOString() }],
    upcomingEvents: EVENTS,
    featuredEvent: EVENTS[0],
    streak: streak(s),
    quests: [],
    journeyProgress: { completedLevels, totalLevels: 10, nextMilestone: null },
    leaderboard: { period: 'week', items: [{ rank: 1, publicName: 'Rohit Varma', xp: 5420, isMe: false }, { rank: 2, publicName: 'Sreeja K.', xp: 4980, isMe: false }, { rank: 3, publicName: 'Karthik R.', xp: 4760, isMe: false }], me: { rank: 14, xp: s.xp } },
  };
}
const prefs = (s) => ({ journey_view: s.journeyView, leaderboard_visible: s.leaderboardVisible, public_name: s.publicName });

/* ------------------------------------------------------------------ Stage 2 content (backend shapes) */

/** Items of one module, in the backend's order: every lesson and guided problem, then the tickets. */
function moduleItems(s, batchId, slot) {
  const published = isPublished(slot);
  const lessons = slot.concepts.flatMap((c) => ['lesson', 'guided'].map((part) => {
    const k = sKey(batchId, c.id);
    const authored = CONCEPTS[c.id];
    const minutes = authored ? authored.lesson.minutes[part] : null;
    return {
      itemId: `${c.id}:${part}`, kind: part, conceptId: c.id,
      title: part === 'guided' ? `Guided problem: ${(authored?.lesson.guided?.title ?? c.guidedBrief ?? c.title).replace(/^Workplace simulation: /, '')}` : c.title,
      minutes, format: 'reading', status: published ? 'published' : 'awaiting_content',
      media: authored && part === 'lesson' ? { visual: authored.media.visual.status, video: authored.media.video.status } : null,
      state: !published ? 'awaiting_content' : s.s2Done[partKey(k, part)] ? 'completed' : 'available',
    };
  }));
  const tickets = slot.concepts.map((c) => {
    const authored = CONCEPTS[c.id];
    const k = sKey(batchId, c.id);
    return {
      itemId: `${c.id}:challenge`, kind: 'challenge', conceptId: c.id,
      title: authored ? `Ticket: ${authored.challenge.title}` : `Ticket: ${c.independentBrief ?? c.title}`,
      moduleId: authored?.challenge.moduleId ?? slot.id, challengeId: authored?.challenge.challengeId ?? null,
      workspace: { type: authored?.challenge.workspace ?? 'written', tools: [] }, status: published ? 'published' : 'awaiting_content',
      state: !published ? 'awaiting_content' : s.s2Passed[k] ? 'completed' : (s.attempts[k] ?? []).length ? 'in_progress' : 'available',
    };
  });
  return [...lessons, ...tickets].map((i, n) => ({ ...i, position: n + 1 }));
}

function outline(s, batchId, moduleId) {
  const slot = slotOf(batchId, moduleId);
  if (!slot) throw fail(404, 'NOT_FOUND', 'Module not found in this batch.');
  const published = isPublished(slot);
  const items = moduleItems(s, batchId, slot);
  const done = items.filter((i) => i.state === 'completed').length;
  const next = items.find((i) => i.state === 'available' || i.state === 'in_progress') ?? null;
  const lessonsDone = items.filter((i) => i.kind !== 'challenge' && i.state === 'completed').length;
  return {
    module: {
      id: slot.id, code: slot.code, batchId, title: slot.title, order: slot.order, track: slot.track, trackTitle: slot.trackTitle,
      prerequisites: slot.prerequisites, status: published ? 'published' : 'awaiting_content',
      state: published ? moduleState(s, batchId, { ...slot, published }) : 'awaiting_content', missingPrerequisites: [],
      concepts: slot.concepts.map((c) => ({ ...c, outcome: CONCEPTS[c.id]?.outcome ?? null, authored: Boolean(CONCEPTS[c.id]) })),
    },
    progress: { itemsCompleted: done, itemsTotal: items.length, percent: Math.round((done * 100) / Math.max(1, items.length)), lessonsCompleted: lessonsDone, lessonsTotal: slot.concepts.length * 2, challengesUnlocked: published },
    items,
    next: next ? { itemId: next.itemId, kind: next.kind, title: next.title } : null,
  };
}

function findConcept(batchId, conceptId) {
  for (const slot of slotsOf(batchId)) {
    const c = slot.concepts.find((x) => x.id === conceptId);
    if (c) return { slot, concept: c };
  }
  return null;
}

/** GET stage2/lessons — same fields as the backend's lessonPart (or its "awaiting content" placeholder). */
function lessonPart(s, batchId, conceptId, part) {
  const found = findConcept(batchId, conceptId);
  if (!found) throw fail(404, 'NOT_FOUND', 'Lesson not found in this batch.');
  const { slot, concept } = found;
  const authored = CONCEPTS[conceptId];
  const items = moduleItems(s, batchId, slot).filter((i) => i.kind !== 'challenge');
  const index = items.findIndex((i) => i.itemId === `${conceptId}:${part}`);
  const neighbour = (i) => (items[i] ? { itemId: items[i].itemId, kind: items[i].kind, title: items[i].kind === 'lesson' ? items[i].title : 'Guided problem' } : null);
  const base = {
    itemId: `${conceptId}:${part}`, conceptId, moduleId: slot.id, moduleCode: slot.code, moduleTitle: slot.title,
    title: concept.title, kind: part, position: { index: index + 1, of: items.length },
    previous: neighbour(index - 1), next: neighbour(index + 1) ?? { itemId: `${slot.concepts[0].id}:challenge`, kind: 'challenge', title: 'Module ticket' },
  };
  if (!authored || !isPublished(slot)) {
    return {
      ...base, status: 'awaiting_content', minutes: null, completed: false,
      media: { text: { status: 'pending' }, visual: { status: 'pending', brief: null }, video: { status: 'pending', brief: null } },
      guided: { brief: part === 'guided' ? concept.guidedBrief : concept.independentBrief },
      tabs: { about: { outcome: null, learn: [] }, takeaways: [], resources: [], notes: { body: '', revision: 0, updatedAt: null } },
    };
  }
  const l = authored.lesson;
  const body = part === 'lesson' ? {
    opening: l.opening,
    sections: [
      { id: 'what-it-does', title: 'What it does', body: l.whatItDoes },
      { id: 'how-it-works', title: 'How it works', body: l.howItWorks },
      { id: 'why-it-matters', title: 'Why it matters', body: l.whyItMatters },
      { id: 'evidence', title: 'Evidence a practitioner inspects', body: l.evidenceToInspect },
      { id: 'trade-off', title: 'Trade-off', body: l.tradeOff },
      { id: 'misconception', title: 'Common misconception', body: l.misconception },
    ].filter((x) => x.body),
    example: l.example, issues: l.issues,
  } : { guided: l.guided };
  return {
    ...base, status: 'published', version: authored.version, minutes: part === 'lesson' ? l.minutes.lesson : l.minutes.guided,
    completed: Boolean(s.s2Done[partKey(sKey(batchId, conceptId), part)]),
    media: { text: { status: 'published' }, visual: authored.media.visual, video: authored.media.video },
    ...body,
    tabs: { about: { outcome: authored.outcome, learn: l.takeaways }, takeaways: l.takeaways, resources: l.sources, notes: s.notes[sKey(batchId, conceptId)] ?? { body: '', revision: 0, updatedAt: null } },
  };
}

/** GET stage2/challenges — the concept's ticket, in the backend's ticket shape. */
function ticket(s, batchId, conceptId) {
  const found = findConcept(batchId, conceptId);
  if (!found) throw fail(404, 'NOT_FOUND', 'Challenge not found in this batch.');
  const { slot, concept } = found;
  const authored = CONCEPTS[conceptId];
  if (!authored) {
    return { conceptId, conceptTitle: concept.title, moduleId: slot.id, moduleCode: slot.code, id: slot.id, status: 'awaiting_content',
      storage: { moduleId: slot.id, challengeId: null }, title: concept.title, summary: concept.independentBrief, ticket: null };
  }
  const ch = authored.challenge;
  return {
    conceptId, conceptTitle: concept.title, moduleId: slot.id, moduleCode: slot.code, id: slot.id,
    storage: { moduleId: ch.moduleId, challengeId: ch.challengeId }, title: ch.ticket.title.replace(/^Workplace simulation: /, ''),
    summary: concept.independentBrief, workspace: { type: ch.workspace, tools: [] }, xp: authored.xp, countsTowardProgress: true,
    ticket: { ...ch.ticket, kind: ch.workspace === 'written' ? 'written' : ch.ticket.kind, lab: null, evidence: ch.ticket.evidence ?? [], constraints: ch.ticket.constraints ?? [], acceptanceCriteria: ch.ticket.acceptanceCriteria ?? [] },
    rubric: ch.rubric,
  };
}

/** Tickets are stored by module; in the guest preview each module's concept tickets share it. */
const ticketKey = (q) => `${q.batchId}|${q.moduleId}|${q.challengeId ?? ''}`;
function conceptForTicket(q) {
  const slot = slotOf(q.batchId, q.moduleId) ?? slotsOf(q.batchId).find((m) => m.concepts.some((c) => CONCEPTS[c.id]?.challenge.moduleId === q.moduleId));
  return slot ? sKey(q.batchId, slot.concepts[0].id) : `${q.batchId}|${q.moduleId}`;
}
function ticketConcept(q) {
  const slot = slotOf(q.batchId, q.moduleId);
  return slot ? CONCEPTS[slot.concepts[0].id] : null;
}
const FALLBACK_HINTS = ['Start from the evidence: what changed, and what do users see?', 'Name one cause and the evidence that supports it.', 'Say how you will check the fix worked.'];

function gradeWritten(written = {}) {
  const fields = ['understanding', 'evidence', 'diagnosis', 'change', 'verification'];
  const dims = fields.map((f) => {
    const text = String(written[f] ?? '').trim();
    const met = text.length >= 30;
    return {
      dimension: f[0].toUpperCase() + f.slice(1), earned: met ? 20 : text.length >= 10 ? 10 : 0, max: 20,
      criteria: [{ id: f, description: `${f[0].toUpperCase() + f.slice(1)} is specific and complete`, met, feedback: met ? '' : 'Add more detail (at least a couple of sentences).' }],
    };
  });
  const score = dims.reduce((n, d) => n + d.earned, 0);
  return { score, passed: score >= 70, result: { dimensions: dims } };
}

/* ------------------------------------------------------------------ Discover quizzes and challenges */

const COURSE_QUIZ = {
  pass_percent: 70, instructions: 'Answer both questions.',
  questions: [
    { key: 'q1', kind: 'single', prompt: 'Which role builds the parts of an app users see and touch?', options: ['Frontend developer', 'Database administrator', 'Network engineer'], answer: ['Frontend developer'] },
    { key: 'q2', kind: 'single', prompt: 'What is a good first step when starting a tech career?', options: ['Pick a path and build small projects', 'Wait until you know everything', 'Only watch videos'], answer: ['Pick a path and build small projects'] },
  ],
};
const VISUAL = (title) => ({
  lessonId: 'x', format: 'visual', version: 1, title, description: `A visual tour: ${title.toLowerCase()}`,
  learningObjectives: ['Explain the idea in one sentence', 'Recognise it in everyday products'], estimatedMinutes: 6,
  sections: [
    { id: 's1', type: 'concept_explanation', title: 'In one sentence', content: { body: `${title.replace(/\?$/, '')}: the building blocks behind the products you use every day.`, highlights: ['Made of clear steps', 'Improves with feedback', 'Works at scale'] } },
    { id: 's2', type: 'input_process_output', title: 'How it flows', content: { input: { title: 'Input', description: 'What the user or data provides' }, process: { title: 'Process', description: 'The logic that runs' }, output: { title: 'Output', description: 'What the user gets back' } } },
    { id: 's3', type: 'key_takeaways', title: 'Key takeaways', content: { items: [{ id: 'k1', title: 'Every product is input → process → output.' }, { id: 'k2', title: 'Small steps are easier to test and fix.' }] } },
  ],
  keyTakeaways: [{ id: 'k1', title: 'Every product is input → process → output.' }, { id: 'k2', title: 'Small steps are easier to test and fix.' }],
  quickCheck: { sectionId: 'q', title: 'Quick check', questions: [{ id: 'q1', kind: 'single', prompt: 'What comes between input and output?', options: [{ id: 'o1', label: 'Process' }, { id: 'o2', label: 'Nothing' }] }] },
});

const DISCOVER_CHALLENGES = (pathwayId) => [
  { id: `${pathwayId}-ch1`, title: 'Foundations check', description: 'Five quick questions about the basics of this path.', difficulty: 'beginner', xpReward: 15, isMandatory: true },
  { id: `${pathwayId}-ch2`, title: 'Careers check', description: 'Match roles to what they do.', difficulty: 'beginner', xpReward: 15, isMandatory: false },
];
const CHALLENGE_QUESTIONS = [
  { key: 'c1', kind: 'single_choice', prompt: 'Which of these is part of building software?', options: ['Writing and testing code', 'Printing invoices', 'Painting walls'], answer: 'Writing and testing code' },
  { key: 'c2', kind: 'single_choice', prompt: 'Where does an app usually store user data?', options: ['A database', 'The browser tab title', 'A screenshot'], answer: 'A database' },
];

/* ------------------------------------------------------------------ router */

function route(method, path, q, body, s) {
  const get = method === 'GET';
  switch (path) {
    case 'me': return { id: 'guest-demo', name: 'Guest Learner', email: 'guest@teklozy.demo', roles: [] };
    case 'dashboard': return dashboard(s);
    case 'pathways': return { items: PATHWAYS.filter((p) => p.id === 'software-development') };
    case 'streaks/me': return streak(s);
    case 'notifications': return { items: s.notifications.slice(0, Number(q.limit) || 10) };
    case 'notifications/read': s.notifications = s.notifications.map((n) => (n.id === body.id ? { ...n, read_at: new Date().toISOString() } : n)); return { ok: true };
    case 'me/preferences':
      if (!get) {
        if (typeof body.publicName === 'string') {
          const had = Boolean(s.publicName);
          s.publicName = body.publicName.trim();
          if (!had && s.publicName) award(s, 25, 'LevelModuleCompleted');
        }
        if (body.journeyView) s.journeyView = body.journeyView;
        if (typeof body.leaderboardVisible === 'boolean') s.leaderboardVisible = body.leaderboardVisible && Boolean(s.publicName);
      }
      return prefs(s);
    case 'careers': return { items: [{ id: 'c1', title: 'Frontend Developer', summary: 'Builds user interfaces.', salaryRange: '₹5–18 LPA' }, { id: 'c2', title: 'Machine Learning Engineer', summary: 'Builds and ships ML models.', salaryRange: '₹8–25 LPA' }] };
    case 'careers/me':
      return {
        activeCareerPath: s.finalized ? { id: s.finalized, title: PATHWAYS.find((p) => p.id === s.finalized)?.displayTitle } : null,
        switchAvailable: false, switchTargets: [], switchDeadline: null,
        pathProgress: PATHWAYS.map((p) => ({ pathwayId: p.id, discoveryChallengesPassed: DISCOVER_CHALLENGES(p.id).filter((c) => s.challengePassed[c.id]).length, discoveryChallengesTotal: 2 })),
      };
    case 'careers/finalize':
      if (!s.finalized) { s.finalized = 'software-development'; award(s, 25, 'CareerPathFinalized'); if (level1Done(s)) award(s, 25, 'LevelCompleted'); }
      // Guest preview: starting the path also opens the Level 2 batch, so Learn is ready on arrival.
      s.s2Enrolled = true;
      return { activeCareerPath: { id: s.finalized } };
    case 'careers/switch': throw fail(409, 'SWITCH_UNAVAILABLE', 'Switching paths is not available in the guest preview.');
    case 'journey': return dashboard(s).journey;
    case 'journey/enrollment': s.exploring = body.pathwayId; return { ok: true };
    case 'journey/stage-modules': return stageModules(s);
    case 'journey/stage-modules/complete': {
      if (body.moduleKey !== 'welcome') throw fail(409, 'COMPLETED_BY_ACTION', 'This module completes when you do its action.');
      if (!s.welcomeDone) { s.welcomeDone = true; award(s, 25, 'LevelModuleCompleted'); }
      return stageModules(s);
    }
    case 'journey/level': {
      const levels = journeyLevels(s);
      const lvl = levels.find((l) => l.number === Number(q.number ?? 1));
      return { pathwayId: q.pathwayId ?? null, level: lvl, stageModules: stageModules(s), course: q.pathwayId && COURSE[q.pathwayId] ? course(s, q.pathwayId) : null };
    }
    case 'course-enrollments': {
      const pathId = versionToPath[body.versionId];
      if (!pathId) throw fail(404, 'NOT_FOUND', 'Course not found.');
      s.enrolledCourses[pathId] = true;
      return { id: `demo-enr-${pathId}` };
    }
    case 'courses/lessons/start': return { ok: true };
    case 'courses/material': {
      const pathId = versionToPath[q.versionId] ?? lessonOwner(q.lessonId ?? '');
      const { i } = parseLesson(q.lessonId);
      const [title, description, lessonTitle] = COURSE[pathId].modules[i] ?? [];
      return {
        lesson: { id: q.lessonId, title: lessonTitle, kind: 'reading', objectives: [description], estimated_minutes: 6, required: true },
        resources: [{ id: 'r1', kind: 'text', title, body: `${description}\n\nRead through the visual lesson, then write a short reflection in Notes to complete it.`, url: null }],
        structuredContent: { format: i < 2 ? 'visual' : 'reading' },
      };
    }
    case 'lessons/content': {
      const pathId = lessonOwner(q.lessonId ?? '');
      const { i } = parseLesson(q.lessonId);
      return VISUAL(COURSE[pathId].modules[i]?.[2] ?? 'Lesson');
    }
    case 'lessons/content/quick-check': {
      const results = (body.answers ?? []).map((a) => ({ questionId: a.questionId, correct: a.optionIds?.includes('o1'), explanation: 'The process step turns input into output.' }));
      return { results, correctCount: results.filter((r) => r.correct).length, questionCount: results.length };
    }
    case 'courses/lessons/complete': {
      if (!s.lessonsDone[body.lessonId]) { s.lessonsDone[body.lessonId] = true; award(s, 10, 'CourseLessonCompleted'); }
      return { ok: true };
    }
    case 'course-assessments': return { ...COURSE_QUIZ, questions: COURSE_QUIZ.questions.map(({ answer, ...rest }) => rest) };
    case 'course-attempts': return { id: `demo-att-${body.lessonId}` };
    case 'course-attempts/submit': {
      const right = COURSE_QUIZ.questions.filter((qq) => JSON.stringify(body.responses?.[qq.key] ?? []) === JSON.stringify(qq.answer)).length;
      const score = Math.round((right * 100) / COURSE_QUIZ.questions.length);
      const passed = score >= COURSE_QUIZ.pass_percent;
      const lesson = String(body.id).replace('demo-att-', '');
      if (passed && !s.lessonsDone[lesson]) { s.lessonsDone[lesson] = true; award(s, 20, 'AssessmentEvaluated'); }
      return { state: passed ? 'passed' : 'failed', score, feedback: passed ? 'Well done.' : 'Review the lesson and try again.' };
    }
    case 'challenges': return { items: DISCOVER_CHALLENGES(q.pathwayId).map((c) => ({ ...c, userPassed: Boolean(s.challengePassed[c.id]) })) };
    case 'challenges/details': {
      const c = PATHWAYS.flatMap((p) => DISCOVER_CHALLENGES(p.id)).find((x) => x.id === q.id);
      return { challenge: { ...c, passingScorePercent: 50, maxAttempts: 5 }, questions: CHALLENGE_QUESTIONS.map(({ answer, ...rest }) => rest), previousAttemptsCount: 0 };
    }
    case 'challenges/attempts': {
      const right = CHALLENGE_QUESTIONS.filter((qq) => (body.responses?.[qq.key] ?? [])[0] === qq.answer).length;
      const scorePercent = Math.round((right * 100) / CHALLENGE_QUESTIONS.length);
      const passed = scorePercent >= 50;
      let xpAwarded = 0;
      if (passed && !s.challengePassed[body.challengeId]) { s.challengePassed[body.challengeId] = true; xpAwarded = 15; award(s, 15, 'DiscoveryChallengeEvaluated'); }
      return { passed, scorePercent, xpAwarded };
    }
    case 'gamification/leaderboard': return dashboard(s).leaderboard;
    case 'gamification/achievements': return { items: gamification(s).achievements };
    case 'events': return { items: EVENTS, nextOffset: null };
    case 'announcements': return { items: dashboard(s).announcements, nextOffset: null };

    /* Stage 2 */
    case 'stage2/batches/me':
      if (s.s2Enrolled) return { enrolled: true, batch: { id: 'development-basics', title: 'Development Basics' } };
      return { enrolled: false, eligible: true, reason: null };
    case 'stage2/enrollment':
      if (!s.s2Enrolled) { s.s2Enrolled = true; award(s, 0, 'Stage2Enrolled'); }
      return { enrolled: true, batch: { id: 'development-basics', title: 'Development Basics' } };
    case 'stage2/overview': return stage2Overview(s);
    case 'stage2/progress': return progress(s, q.batchId ?? 'development-basics');
    case 'stage2/curriculum': {
      const mods = curriculum(s, q.batchId ?? 'development-basics');
      return { batchId: q.batchId, title: BATCH_TITLES[q.batchId], modulesTotal: mods.length, modulesPublished: mods.filter((m) => m.status === 'published').length, modules: mods };
    }
    case 'stage2/validation-challenges': return { items: [] };
    case 'stage3/eligibility': {
      const missing = curriculum(s, 'development-basics').filter((m) => m.status === 'published' && m.state !== 'completed').map((m) => m.id);
      return { eligible: false, missingModules: missing, requirements: [] };
    }
    case 'stage2/modules/outline': return outline(s, q.batchId, q.moduleId);
    case 'stage2/modules': return outline(s, q.batchId, q.moduleId);
    case 'stage2/lessons': return lessonPart(s, q.batchId, q.conceptId, q.part === 'guided' ? 'guided' : 'lesson');
    case 'stage2/lessons/complete': {
      const lp = lessonPart(s, body.batchId, body.conceptId, body.part);
      if (lp.status === 'awaiting_content') throw fail(409, 'AWAITING_CONTENT', 'This lesson is under development.');
      const k = partKey(sKey(body.batchId, body.conceptId), body.part);
      if (!s.s2Done[k]) { s.s2Done[k] = true; award(s, 10, 'CourseLessonCompleted'); }
      return { ok: true };
    }
    case 'stage2/lessons/notes': {
      const nk = sKey(body.batchId, body.conceptId);
      const prev = s.notes[nk] ?? { body: '', revision: 0 };
      if (body.revision !== prev.revision) throw fail(409, 'STALE_REVISION', 'These notes changed in another tab.');
      s.notes[nk] = { body: body.body, revision: prev.revision + 1, updatedAt: new Date().toISOString() };
      return s.notes[nk];
    }
    case 'stage2/challenges': return ticket(s, q.batchId, q.conceptId);
    case 'stage2/drafts': {
      const k = ticketKey(get ? q : body);
      if (get) return s.drafts[k] ?? { content: {}, revision: 0 };
      const prev = s.drafts[k] ?? { revision: 0 };
      if (body.revision !== prev.revision) throw fail(409, 'STALE_REVISION', 'Saved in another tab.');
      s.drafts[k] = { content: body.content, revision: prev.revision + 1 };
      return s.drafts[k];
    }
    case 'stage2/hints': {
      const k = ticketKey(get ? q : body);
      const hints = ticketConcept(get ? q : body)?.challenge.hints?.length ? ticketConcept(get ? q : body).challenge.hints : FALLBACK_HINTS;
      if (!get) s.hints[k] = Math.min(hints.length, (s.hints[k] ?? 0) + 1);
      return { total: hints.length, revealed: hints.slice(0, s.hints[k] ?? 0).map((text, index) => ({ index, text })) };
    }
    case 'stage2/attempts': {
      const c = conceptForTicket(get ? q : body);
      if (get) return { items: s.attempts[c] ?? [] };
      const graded = gradeWritten(body.written);
      const attempt = { id: `demo-a${Date.now()}`, state: 'graded', score: graded.score, passed: graded.passed, createdAt: new Date().toISOString(), challengeVersion: 1, result: graded.result };
      s.attempts[c] = [attempt, ...(s.attempts[c] ?? [])];
      if (graded.passed && !s.s2Passed[c]) {
        const slot = slotOf(body.batchId, body.moduleId);
        for (const x of slot?.concepts ?? []) s.s2Passed[sKey(body.batchId, x.id)] = true;
        s.s2Passed[c] = true;
        award(s, 25, 'AssessmentEvaluated');
      }
      return attempt;
    }
    case 'stage2/solutions': {
      const list = s.attempts[conceptForTicket(q)] ?? [];
      if (!list.some((a) => a.score >= 40) && list.length < 2) throw fail(403, 'SOLUTION_LOCKED', 'Submit an attempt scoring 40 or more, or two attempts, to unlock the solution.');
      const sol = ticketConcept(q)?.challenge.solution;
      if (!sol) throw fail(404, 'NOT_FOUND', 'This ticket has no instructor solution yet.');
      return { solution: { summary: sol.summary, steps: sol.steps ?? [], verification: sol.verification ?? '' } };
    }

    /* Tunnels */
    case 'tunnels':
      return { items: Object.values(TUNNELS).map((t) => ({ ...tunnelSummary(t), open: true, progress: progress(s, t.batchId) })) };
    case 'tunnels/overview': {
      const t = TUNNELS[q.tunnelId];
      if (!t) throw fail(404, 'NOT_FOUND', 'Tunnel not found.');
      const open = true;
      const cur = curriculum(s, t.batchId);
      return {
        ...tunnelSummary(t), open, ...(open ? {} : { reason: 'ONBOARDING_REQUIRED' }), legacy: null,
        levels: t.levels.map((l) => ({ ...l, modules: l.modules.map((id) => {
          const slot = slotOf(t.batchId, id);
          return { id, code: slot?.code ?? id, title: slot?.title ?? id, teaches: slot?.concepts[0]?.guidedBrief ?? null, independentProblem: slot?.concepts[0]?.independentBrief ?? null,
            prerequisites: slot?.prerequisites ?? [], relatedDevelopment: [], status: slot && isPublished(slot) ? 'published' : 'awaiting_content', state: cur.find((m) => m.id === id)?.state };
        }) })),
      };
    }

    default:
      if (path.startsWith('stage2/labs')) throw fail(503, 'LABS_UNAVAILABLE', 'Hands-on labs need the Teklozy lab runner, so they are not part of the guest preview. Written tickets work.');
      if (get) return {};
      return { ok: true };
  }
}

function tunnelSummary(t) {
  const all = slotsOf(t.batchId);
  return { id: t.id, batchId: t.batchId, title: t.title, purpose: t.purpose, startHere: t.startHere, whenToEnter: t.whenToEnter, optional: true, modulesTotal: all.length, modulesPublished: all.filter(isPublished).length, project: t.project };
}

function stage2Overview(s) {
  const shared = {
    level: { number: 2, title: 'Core Foundations' },
    hero: { title: 'Build a Strong Foundation', summary: 'Master the core concepts, tools and building blocks to create real solutions.' },
    gains: [
      { id: 'fundamentals', title: 'Strong Fundamentals', description: 'Understand how each layer of an application works and why.' },
      { id: 'projects', title: 'Build Real Projects', description: 'Fix and extend working codebases through realistic tickets.' },
      { id: 'tools', title: 'Use Real Tools', description: 'Work in a real terminal, editor, database and request tool.' },
      { id: 'ai-ready', title: 'Be AI-Ready', description: 'Judge, test and improve code that AI tools produce.' },
    ],
    streak: streak(s), tools: [], competitions: [],
  };
  if (!s.s2Enrolled) {
    const eligible = true;
    return {
      ...shared, enrolled: false, enrollment: { enrolled: false, eligible, reason: null },
      learningPath: null, practice: null, projects: [],
      nextMilestone: { title: 'Complete Level 1 to unlock Level 2', unlocksLevel: 2 },
      cta: { label: eligible ? 'Start Learning' : 'Finish Level 1', action: eligible ? 'enroll' : 'level1' },
    };
  }
  const mods = curriculum(s, 'development-basics');
  const size = Math.ceil(mods.length / GROUPS.length) || 1;
  const groups = GROUPS.map((g, gi) => {
    const items = mods.slice(gi * size, (gi + 1) * size);
    const completed = items.filter((m) => m.state === 'completed').length;
    const published = items.filter((m) => m.status === 'published');
    const state = published.length && published.every((m) => m.state === 'completed') && published.length === items.length ? 'completed'
      : items.some((m) => m.state === 'in_progress' || m.state === 'completed') ? 'in_progress'
      : items.some((m) => m.state === 'available') ? 'available' : 'locked';
    return { number: g.number, title: g.title, summary: g.summary, lessonCount: items.reduce((n, m) => n + m.concepts.length, 0), moduleCount: items.length, modulesCompleted: completed, percent: Math.floor((completed * 100) / items.length), state, modules: items.map((m) => ({ id: m.id, title: m.title, state: m.state, status: m.status })) };
  });
  const done = groups.filter((g) => g.state === 'completed').length;
  const next = mods.find((m) => m.state === 'in_progress' || m.state === 'available');
  return {
    ...shared, enrolled: true, batch: { id: 'development-basics', title: 'Development Basics' },
    learningPath: { groupsCompleted: done, groupsTotal: groups.length, modulesCompleted: mods.filter((m) => m.state === 'completed').length, modulesTotal: mods.length, groups },
    practice: { items: [] }, projects: [],
    nextMilestone: done === groups.length ? { title: 'Level 2 complete. Level 3 is unlocked.', unlocksLevel: 3 } : { title: `Complete all ${groups.length} modules to unlock Level 3.`, unlocksLevel: 3 },
    cta: next ? { label: next.state === 'in_progress' ? 'Continue Learning' : 'Start Learning', action: 'module', moduleId: next.id } : { label: 'Review Modules', action: 'curriculum' },
  };
}

/**
 * Answers one API call for the guest workspace. Resolves with the `data` payload, or rejects
 * with `{ status, code, message }` like the real API.
 */
export async function demoRequest(method, path, query = {}, body = {}) {
  await new Promise((r) => setTimeout(r, 60));
  const s = load();
  try {
    const result = route(method, path, query ?? {}, body ?? {}, s);
    if (method !== 'GET') save(s);
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    if (e && e.__demoError) throw e;
    throw fail(500, 'DEMO_ERROR', e?.message || 'Something went wrong in the guest preview.');
  }
}
