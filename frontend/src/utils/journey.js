import {
  Compass, Layers, Code2, CloudUpload, Network, Blocks, Trophy, FileText, Crown, GraduationCap,
} from 'lucide-react';

/** The 10-level career journey, in the order of the reference design. */
export const LEVELS = [
  { level: 1, name: 'Discover', short: 'Discover', icon: Compass, desc: 'Explore both career paths, set up your profile and choose the direction you want to grow in.' },
  { level: 2, name: 'Learn Basics', short: 'Learn', icon: Layers, desc: 'Development Basics or AI Basics, with hands-on tickets and labs.' },
  { level: 3, name: 'Learn Advanced', short: 'Advanced', icon: Code2, desc: 'Deep-dive into architecture, systems design and performance.' },
  { level: 4, name: 'Start Building', short: 'Build', icon: CloudUpload, desc: 'Build real-world projects with a professional engineering workflow.' },
  { level: 5, name: 'Networking', short: 'Network', icon: Network, desc: 'Connect with mentors, professionals and peer study groups.' },
  { level: 6, name: 'Advanced Building', short: 'Advanced Build', icon: Blocks, desc: 'Ship larger, production-grade projects and contribute to team builds.' },
  { level: 7, name: 'Interview Prep', short: 'Interview', icon: Trophy, desc: 'Practise technical problems and behavioural interviews.' },
  { level: 8, name: 'Apply', short: 'Apply', icon: FileText, desc: 'Apply to roles that match your verified skills.' },
  { level: 9, name: 'Premium', short: 'Premium', icon: Crown, desc: 'Mentor coaching, salary benchmarks and one-to-one reviews.' },
  { level: 10, name: 'Alumni Connect', short: 'Alumni', icon: GraduationCap, desc: 'Join the alumni network and mentor new learners.' },
];

/** Name shown on the level crest (Level 2's stage is called Core Foundations in the product). */
const CREST_TITLES = { 1: 'Discover', 2: 'Core Foundations' };
export const crestTitle = (n) => CREST_TITLES[n] ?? LEVELS.find((l) => l.level === Number(n))?.name ?? '';

/** Glossy stage badge (transparent) and the badge on a tile with a background. */
export const stageBadge = (n) => `/illustrations/stages/badge-${n}.webp`;
export const stageTile = (n) => `/illustrations/stages/tile-${n}.webp`;

/** Each stage's scene: its own badge on the pedestal; the next two levels wait up the path. */
export const stageScene = (n) => ({ image: `/illustrations/stages/scene-${n}.jpg`, width: 1836, height: 1494, alignY: 0.5 });
const NEXT_SPOTS = [{ x: 76.4, y: 40.5 }, { x: 92.6, y: 31.5 }];
export const stageNextMarkers = (n) => [n + 1, n + 2].filter((k) => k <= 10)
  .map((k, i) => ({ n: k, pos: NEXT_SPOTS[i], labelSide: i === 1 ? 'left' : 'below' }));

export const levelInfo = (n) => LEVELS.find((l) => l.level === Number(n)) ?? LEVELS[0];

/** Display rank names for the XP platform level (cosmetic; the level number itself comes from the backend). */
const RANKS = ['Tech Explorer', 'Code Cadet', 'Tech Apprentice', 'Junior Builder', 'Builder', 'Engineer', 'Senior Engineer', 'Architect', 'Tech Lead', 'Tech Master'];
export const rankTitle = (platformLevel = 1) => RANKS[Math.min(RANKS.length, Math.max(1, platformLevel)) - 1];

/** XP progress inside the current platform level, using the backend's level thresholds. */
export function xpProgress(gamification) {
  const xp = gamification?.totalXp ?? 0;
  const from = gamification?.xpForCurrentLevel ?? 0;
  const to = gamification?.xpForNextLevel ?? 100;
  const span = Math.max(1, to - from);
  return { xp, from, to, percent: Math.max(0, Math.min(100, Math.round(((xp - from) / span) * 100))) };
}

const BACKEND_STATE_REASON = {
  enrollment_required: 'Explore a career path to open this level.',
  finalization_required: 'Choose your career path to open this level.',
  upcoming: 'This level is being prepared and will open soon.',
};

/** Human-readable unlock requirement for a locked milestone. */
export function unlockRequirement(milestones, level) {
  const m = milestones.find((x) => x.level === level);
  if (!m || m.status !== 'locked') return '';
  if (m.backendState && BACKEND_STATE_REASON[m.backendState] && level > 1) {
    const prev = milestones.find((x) => x.level === level - 1);
    if (prev && prev.status !== 'completed') return `Complete Level ${prev.level}: ${prev.name} to unlock ${m.name}.`;
    return BACKEND_STATE_REASON[m.backendState];
  }
  const prev = milestones.find((x) => x.level === level - 1);
  return prev ? `Complete Level ${prev.level}: ${prev.name} to unlock ${m.name}.` : '';
}

/** Next milestone after the current one, and the message for the progress bar. */
export function nextMilestone(milestones) {
  const current = milestones.find((m) => m.status === 'current');
  if (!current) {
    const allDone = milestones.length && milestones.every((m) => m.status === 'completed');
    return allDone ? { target: null, message: 'Every level is complete. Welcome to the alumni network!' } : { target: null, message: '' };
  }
  const target = milestones.find((m) => m.level === current.level + 1) ?? null;
  return {
    current,
    target,
    message: target ? `Complete Level ${current.level} to Unlock` : `Complete Level ${current.level} to finish your journey`,
  };
}

/** First lesson the learner can open: the first unfinished allowed one, else the first allowed. */
export function nextLesson(course) {
  const lessons = (course?.modules ?? []).flatMap((m) => m.lessons ?? []);
  return lessons.find((l) => l.access?.allowed && !l.isCompleted) ?? lessons.find((l) => l.access?.allowed) ?? null;
}

export const pad2 = (n) => String(n).padStart(2, '0');
