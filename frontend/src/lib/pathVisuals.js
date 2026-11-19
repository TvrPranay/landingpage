import { Code2, Sparkles, BrainCircuit } from 'lucide-react';
import { LEVELS } from '../utils/journey';

const VISUALS = {
  'software-development': {
    icon: Code2,
    badge: 'SOFTWARE ENGINEERING',
    skills: ['Frontend Architecture', 'REST APIs', 'Database Design', 'Cloud Deployment'],
    stage2Batch: 'development-basics',
    kind: 'development',
    shortName: 'Development',
    accent: '#0b63f6',
    heroArt: '/illustrations/path-art-dev.svg',
    heroScene: '/illustrations/path-hero-temple.jpg',
  },
  'ai-engineering': {
    icon: BrainCircuit,
    badge: 'INTELLIGENCE SYSTEMS',
    skills: ['Statistical Learning', 'Neural Networks', 'LLM Workflows', 'Autonomous Agents'],
    stage2Batch: 'ai-basics',
    kind: 'ai',
    shortName: 'Artificial Intelligence',
    accent: '#7b3ff2',
    heroArt: '/illustrations/path-art-ai.png',
    heroScene: '/illustrations/path-hero-ai.jpg',
  },
};

export function toPath(item) {
  const visual = VISUALS[item.id] ?? { icon: Sparkles, badge: 'CAREER PATH', skills: [], stage2Batch: null, kind: 'other', shortName: item.displayTitle || item.title, accent: '#0b63f6', heroArt: '/illustrations/path-art-dev.svg', heroScene: '/illustrations/path-hero-temple.jpg' };
  return {
    id: item.id,
    name: item.displayTitle || item.title,
    title: item.title,
    desc: item.description,
    xpReward: item.xpReward ?? 0,
    tags: (item.domains ?? []).map((d) => d.title),
    domains: item.domains ?? [],
    ...visual,
  };
}

/** Level names now live with the journey helpers; kept here for existing imports. */
export const LEVEL_NAMES = LEVELS.map(({ level, name, desc }) => ({ level, name, desc }));
