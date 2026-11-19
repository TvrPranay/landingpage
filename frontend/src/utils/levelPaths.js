import {
  Activity, BarChart3, Blocks, Briefcase, CalendarDays, ClipboardList, Code2, Compass, FileText, FlaskConical,
  GitBranch, Globe, GraduationCap, Hammer, Handshake, HeartHandshake, Infinity as InfinityIcon, ListChecks,
  MessageCircle, MessageSquareCode, Mic, Network, Rocket, Server, ShieldCheck, Sparkles, Target, UserCheck,
  UserRound, Users, Gauge,
} from 'lucide-react';

/** Accent colour of each level, matching its badge and stage scene. */
export const LEVEL_COLORS = {
  1: '#22c55e', 2: '#2f7cf6', 3: '#8b5cf6', 4: '#f97316', 5: '#14b8a6',
  6: '#6366f1', 7: '#ef4444', 8: '#0ea5e9', 9: '#eab308', 10: '#ec4899',
};

/**
 * The full learning path of Levels 3–10: four groups each, with what the level gives the learner.
 * Level 3's groups are filled with the backend's Development Advanced modules; the later levels'
 * modules are not published yet, so their groups show as under development.
 */
export const LEVEL_PATHS = {
  3: {
    pill: 'Advanced Engineering', hero: 'Master Advanced Engineering', batchId: 'development-advanced',
    summary: 'Go deeper into architecture, performance, reliability and production delivery.',
    groups: [
      { title: 'Advanced Patterns', summary: 'Composition, state architecture and modular backends.', icon: Blocks },
      { title: 'Scale & Performance', summary: 'Profiling, caching, queues and real-time systems.', icon: Gauge },
      { title: 'Reliability & Security', summary: 'Testing at scale, observability and secure delivery.', icon: ShieldCheck },
      { title: 'Production Engineering', summary: 'Infrastructure, releases, recovery and cost.', icon: Server },
    ],
    gains: [['Clean Architecture', Blocks], ['Fast Systems', Gauge], ['Secure Delivery', ShieldCheck], ['Production Ready', Server]],
  },
  4: {
    pill: 'Project Workflow', hero: 'Build Real Projects',
    summary: 'Plan, build and ship a real product with a professional team workflow.',
    groups: [
      { title: 'Project Planning', summary: 'Scope a product, write user stories and plan milestones.', icon: ClipboardList },
      { title: 'Git & Team Workflow', summary: 'Branches, pull requests and reviews the way teams ship.', icon: GitBranch },
      { title: 'Build Your First Project', summary: 'Turn your plan into a working, deployed application.', icon: Hammer },
      { title: 'Code Review', summary: 'Give and receive reviews that improve real code.', icon: MessageSquareCode },
    ],
    gains: [['Product Planning', ClipboardList], ['Team Workflow', GitBranch], ['Shipped Project', Rocket], ['Code Quality', MessageSquareCode]],
  },
  5: {
    pill: 'Community', hero: 'Grow Your Network',
    summary: 'Connect with mentors, professionals and peers who help you grow faster.',
    groups: [
      { title: 'Your Developer Brand', summary: 'Profiles, portfolio and a story that stands out.', icon: UserRound },
      { title: 'Mentor Sessions', summary: 'Learn from engineers who have done it before.', icon: GraduationCap },
      { title: 'Study Groups', summary: 'Learn together and keep each other accountable.', icon: Users },
      { title: 'Community Events', summary: 'Meetups, talks and hackathons to join.', icon: CalendarDays },
    ],
    gains: [['Strong Profile', UserRound], ['Mentors', GraduationCap], ['Peer Network', Users], ['Events', CalendarDays]],
  },
  6: {
    pill: 'Production Builds', hero: 'Ship Production Projects',
    summary: 'Build larger, production-grade projects and contribute to team builds.',
    groups: [
      { title: 'Production-Grade Projects', summary: 'Projects with real users, data and constraints.', icon: Rocket },
      { title: 'Testing at Scale', summary: 'Automated tests that keep large codebases safe.', icon: FlaskConical },
      { title: 'Team Builds', summary: 'Ship features together inside a bigger codebase.', icon: Users },
      { title: 'Deploy & Monitor', summary: 'Release, observe and keep services healthy.', icon: Activity },
    ],
    gains: [['Large Projects', Rocket], ['Test Coverage', FlaskConical], ['Teamwork', Users], ['Operations', Activity]],
  },
  7: {
    pill: 'Interview Ready', hero: 'Ace Your Interviews',
    summary: 'Practise technical problems, system design and behavioural interviews.',
    groups: [
      { title: 'DSA Interview Practice', summary: 'Patterns and problems interviewers ask most.', icon: Code2 },
      { title: 'System Design Interviews', summary: 'Design scalable systems and explain trade-offs.', icon: Network },
      { title: 'Behavioural Interviews', summary: 'Tell clear stories about your work and impact.', icon: MessageCircle },
      { title: 'Mock Interviews', summary: 'Timed practice rounds with feedback.', icon: Mic },
    ],
    gains: [['Problem Solving', Code2], ['System Design', Network], ['Communication', MessageCircle], ['Confidence', Mic]],
  },
  8: {
    pill: 'Job Search', hero: 'Land the Right Role',
    summary: 'Apply to roles that match your verified skills, and track every application.',
    groups: [
      { title: 'Resume & Portfolio', summary: 'Show your verified skills and best projects.', icon: FileText },
      { title: 'Job Matching', summary: 'Find roles that fit your skills and goals.', icon: Target },
      { title: 'Application Tracker', summary: 'Keep every application and follow-up in one place.', icon: ListChecks },
      { title: 'Offer Negotiation', summary: 'Compare offers and negotiate with confidence.', icon: Handshake },
    ],
    gains: [['Standout Resume', FileText], ['Matched Roles', Target], ['Organised Search', ListChecks], ['Better Offers', Handshake]],
  },
  9: {
    pill: 'Career Coaching', hero: 'Accelerate Your Career',
    summary: 'Mentor coaching, salary benchmarks and one-to-one reviews.',
    groups: [
      { title: 'Mentor Coaching', summary: 'Regular sessions with an experienced mentor.', icon: GraduationCap },
      { title: 'Salary Benchmarks', summary: 'Know your market value for every role.', icon: BarChart3 },
      { title: 'One-to-One Reviews', summary: 'Personal reviews of your code, resume and plan.', icon: UserCheck },
      { title: 'Career Strategy', summary: 'Plan your next moves and long-term growth.', icon: Compass },
    ],
    gains: [['Personal Coach', GraduationCap], ['Market Insight', BarChart3], ['Expert Reviews', UserCheck], ['Clear Strategy', Compass]],
  },
  10: {
    pill: 'Alumni', hero: 'Give Back and Keep Growing',
    summary: 'Join the alumni network, mentor new learners and keep learning.',
    groups: [
      { title: 'Alumni Network', summary: 'Stay connected with Teklozy graduates worldwide.', icon: Globe },
      { title: 'Mentor New Learners', summary: 'Guide the next learners on their journey.', icon: HeartHandshake },
      { title: 'Give-Back Projects', summary: 'Build tools and content for the community.', icon: Sparkles },
      { title: 'Lifelong Learning', summary: 'Keep your skills current as tech evolves.', icon: InfinityIcon },
    ],
    gains: [['Global Network', Globe], ['Mentorship', HeartHandshake], ['Impact', Sparkles], ['Career Growth', Briefcase]],
  },
};

/** Splits a level's modules evenly across its four groups (Level 3 only, until later levels publish modules). */
export function groupModules(level, modules) {
  const groups = LEVEL_PATHS[level]?.groups ?? [];
  const size = Math.ceil(modules.length / Math.max(1, groups.length)) || 1;
  return groups.map((g, i) => ({ ...g, number: i + 1, modules: modules.slice(i * size, (i + 1) * size) }));
}
