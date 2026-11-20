import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { parseRoute, navigate as routerNavigate } from '../router';
import { Code2, Sparkles } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const DEFAULT_PATHS = [
  {
    id: 'development',
    name: 'Development',
    title: 'Software Engineering & Full-Stack',
    desc: 'Master how modern web software is designed, engineered, tested and deployed at scale.',
    icon: Code2,
    badge: 'SOFTWARE ENGINEERING',
    modulesCount: 5,
    estimatedTime: '25 min',
    totalXp: 500,
    tags: ['React & TypeScript', 'Node.js & Python', 'Databases & SQL', 'CI/CD & Cloud'],
    skills: ['Frontend Architecture', 'REST & GraphQL APIs', 'Database Schemas', 'Cloud Deployment'],
    modules: [
      { id: 'dev-1', title: 'The Modern Web — How the Internet Actually Works', desc: 'Understand clients, servers, HTTP/3, and distributed cloud systems.', duration: '6 min', type: 'Video', xp: 125 },
      { id: 'dev-2', title: 'Component Architecture & Declarative UI', desc: 'Design systems, state management, and component trees.', duration: '4 min', type: 'Visual', xp: 125 },
      { id: 'dev-3', title: 'Why Full-Stack Engineering Matters', desc: 'Connect database models, business logic and client applications.', duration: '4 min', type: 'Reading', xp: 125 },
      { id: 'dev-4', title: 'Production APIs & Data Flows', desc: 'Build performant endpoints, relational schemas, and indexing strategies.', duration: '5 min', type: 'Reading', xp: 125 },
      { id: 'dev-5', title: 'Deployment, CI/CD & Cloud Infrastructure', desc: 'Containerization with Docker, automated pipelines, and cloud hosting.', duration: '7 min', type: 'Video', xp: 125 }
    ]
  },
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    title: 'Introduction to AI & Intelligent Systems',
    desc: 'Discover how machine learning models learn from data, reason with LLMs and automate complex workflows.',
    icon: Sparkles,
    badge: 'INTELLIGENCE SYSTEMS',
    modulesCount: 5,
    estimatedTime: '22 min',
    totalXp: 625,
    tags: ['Machine Learning', 'Deep Learning', 'Generative AI & LLMs', 'Agentic AI'],
    skills: ['Statistical Learning', 'Neural Network Architectures', 'LLM Prompt Engineering', 'Autonomous Agents'],
    modules: [
      { id: 'ai-1', title: 'The Big Question — Why Are We Building Machines That Can Think?', desc: 'The fundamental idea behind intelligent machines and why this question started the AI journey.', duration: '6 min', type: 'Video', xp: 125 },
      { id: 'ai-2', title: 'What is AI?', desc: 'Defining intelligence, algorithmic reasoning, and the shift from rules to pattern recognition.', duration: '3 min', type: 'Visual', xp: 125 },
      { id: 'ai-3', title: 'Why AI Exists?', desc: 'AI was created to help solve real-world problems that are too complex, repetitive or time-consuming for humans.', duration: '4 min', type: 'Reading', xp: 125 },
      { id: 'ai-4', title: 'AI Around You', desc: 'Explore recommendations, search algorithms, autonomous perception and conversational intelligence in daily life.', duration: '4 min', type: 'Reading', xp: 125 },
      { id: 'ai-5', title: 'How AI Learns?', desc: 'Discover how neural networks process training datasets, optimize loss functions, and make predictions.', duration: '5 min', type: 'Video', xp: 125 }
    ]
  }
];

export const LEVEL_MILESTONES = [
  { level: 1, name: 'Discover', desc: 'Explore tech disciplines and set your primary career trajectory.', status: 'completed' },
  { level: 2, name: 'Learn Basics', desc: 'Build foundational programming and algorithmic reasoning skills.', status: 'current' },
  { level: 3, name: 'Learn Advanced', desc: 'Deep-dive into architecture, systems design and performance optimization.', status: 'locked' },
  { level: 4, name: 'Start Building', desc: 'Craft real-world, production-ready portfolio software applications.', status: 'locked' },
  { level: 5, name: 'Advanced Building', desc: 'Ship larger, production-grade applications and systems.', status: 'locked' },
  { level: 6, name: 'Networking', desc: 'Connect with mentors, industry professionals, and peer study cohorts.', status: 'locked' },
  { level: 7, name: 'Interview Prep', desc: 'Master technical whiteboard problems and behavioral interview cases.', status: 'locked' },
  { level: 8, name: 'Apply', desc: 'Target curated high-growth roles aligned with your verified competencies.', status: 'locked' },
  { level: 9, name: 'Premium', desc: 'Access elite mentor coaching, salary benchmarking and 1-on-1 reviews.', status: 'locked' },
  { level: 10, name: 'Alumni Connect', desc: 'Join the alumni network, mentor junior learners, and accelerate growth.', status: 'locked' }
];

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Routing State
  const [currentRoute, setCurrentRoute] = useState(() => parseRoute());

  // Listen to hash change & popstate
  useEffect(() => {
    const handleHash = () => {
      setCurrentRoute(parseRoute());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHash);
    window.addEventListener('popstate', handleHash);

    // Initial route validation
    const isGuest = localStorage.getItem('teklozyGuestSession') === 'true';
    const isUser = localStorage.getItem('teklozyUserId');
    if (!window.location.hash || window.location.hash === '#' || window.location.hash === '#/') {
      if (isGuest || isUser) {
        routerNavigate('home', {}, true);
      } else {
        routerNavigate('signin', {}, true);
      }
    }

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('popstate', handleHash);
    };
  }, []);

  const navigate = useCallback((path, query = {}, replace = false) => {
    routerNavigate(path, query, replace);
  }, []);

  // User State
  const [displayName, setDisplayName] = useState(() => {
    return localStorage.getItem('teklozyUserName') || (localStorage.getItem('teklozyGuestSession') === 'true' ? 'Guest Learner' : 'Learner');
  });
  const [email, setEmail] = useState(() => localStorage.getItem('teklozyUserEmail') || '');
  const [xp, setXp] = useState(() => {
    const guestProgress = JSON.parse(localStorage.getItem('teklozyGuestProgress') || '{}');
    return Number.isFinite(guestProgress.xp) ? guestProgress.xp : 2700;
  });
  const [completedLessons, setCompletedLessons] = useState(() => {
    const guestProgress = JSON.parse(localStorage.getItem('teklozyGuestProgress') || '{}');
    return Array.isArray(guestProgress.completed) ? guestProgress.completed : [0, 1];
  });
  const [selectedPath, setSelectedPathState] = useState(() => {
    const savedId = localStorage.getItem('teklozySelectedPath');
    return DEFAULT_PATHS.find(p => p.id === savedId) || DEFAULT_PATHS[1]; // default to AI
  });

  // Track Level Unlock Progression
  const totalLevel1Modules = selectedPath?.modules?.length || 5;
  const isLevel1Complete = completedLessons.length >= totalLevel1Modules;

  const [unlockedLevel, setUnlockedLevel] = useState(() => {
    const saved = Number(localStorage.getItem('teklozyUnlockedLevel'));
    if (saved && saved >= 1) return saved;
    const guestProgress = JSON.parse(localStorage.getItem('teklozyGuestProgress') || '{}');
    const completed = Array.isArray(guestProgress.completed) ? guestProgress.completed : [0, 1];
    return completed.length >= 5 ? 2 : 1;
  });

  const unlockLevel = useCallback((lvl) => {
    setUnlockedLevel(prev => {
      const next = Math.max(prev, lvl);
      localStorage.setItem('teklozyUnlockedLevel', String(next));
      return next;
    });
  }, []);

  // Automatically ensure Level 2 unlocks whenever all Level 1 modules are finished
  useEffect(() => {
    if (isLevel1Complete && unlockedLevel < 2) {
      setUnlockedLevel(2);
      localStorage.setItem('teklozyUnlockedLevel', '2');
    }
  }, [isLevel1Complete, unlockedLevel]);

  const setSelectedPath = useCallback(async (pathObj) => {
    setSelectedPathState(pathObj);
    localStorage.setItem('teklozySelectedPath', pathObj.id);
    try {
      const { supabase } = await import('../lib/supabase.js');
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('user_path_selection').upsert(
            { user_id: user.id, path_id: pathObj.id, selected_at: new Date().toISOString() },
            { onConflict: 'user_id' }
          );
        }
      }
    } catch (e) {
      console.warn('Path persisted locally.', e);
    }
  }, []);

  // UI state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');

  const triggerToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(m => (m === msg ? '' : m));
    }, 3200);
  }, []);

  // Check backend health
  useEffect(() => {
    fetch(`${API}/health`)
      .then(r => r.ok ? setApiStatus('connected') : setApiStatus('offline'))
      .catch(() => setApiStatus('offline'));
  }, []);

  // Supabase sync
  useEffect(() => {
    (async () => {
      try {
        const { supabase } = await import('../lib/supabase.js');
        if (!supabase) return;

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const u = session.user;
          const name = u.user_metadata?.full_name || u.email?.split('@')[0] || 'Learner';
          setDisplayName(name);
          setEmail(u.email || '');
          localStorage.setItem('teklozyUserName', name);
          localStorage.setItem('teklozyUserEmail', u.email || '');

          // Check selected path
          const { data: pathRow } = await supabase.from('user_path_selection').select('path_id').eq('user_id', u.id).maybeSingle();
          if (pathRow?.path_id) {
            const found = DEFAULT_PATHS.find(p => p.id === pathRow.path_id);
            if (found) setSelectedPathState(found);
          }

          // Check progress
          const { data: progRows } = await supabase.from('lesson_progress').select('lesson_id').eq('user_id', u.id).eq('completed', true);
          if (progRows?.length) {
            setCompletedLessons(progRows.map(r => Number(r.lesson_id)));
          }

          // Check stats
          const { data: stats } = await supabase.from('user_stats').select('xp').eq('user_id', u.id).maybeSingle();
          if (stats?.xp) setXp(stats.xp);
        }
      } catch (err) {
        console.info('Using local session state.');
      }
    })();
  }, []);

  // Complete lesson handler
  const markLessonComplete = useCallback(async (moduleIndex) => {
    let nowCompleted = [];
    setCompletedLessons(prev => {
      if (prev.includes(moduleIndex)) {
        nowCompleted = prev;
        return prev;
      }
      const updated = [...prev, moduleIndex];
      nowCompleted = updated;

      // Automatically unlock Level 2 if all level 1 modules are completed
      const total = selectedPath?.modules?.length || 5;
      if (updated.length >= total) {
        setUnlockedLevel(lvl => {
          const nextLvl = Math.max(lvl, 2);
          localStorage.setItem('teklozyUnlockedLevel', String(nextLvl));
          return nextLvl;
        });
        triggerToast('🎉 Milestone Achieved! All Level 1 modules finished. Level 2: Learn Basics is UNLOCKED!');
      } else {
        triggerToast('Lesson completed! +125 XP added to your career journey.');
      }

      // Sync guest progress
      if (localStorage.getItem('teklozyGuestSession') === 'true') {
        const saved = JSON.parse(localStorage.getItem('teklozyGuestProgress') || '{}');
        saved.completed = updated;
        saved.xp = xp + 125;
        localStorage.setItem('teklozyGuestProgress', JSON.stringify(saved));
      }
      return updated;
    });

    setXp(x => x + 125);

    try {
      const { supabase } = await import('../lib/supabase.js');
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.rpc('award_lesson_xp', { lesson_key: moduleIndex + 1 });
          return;
        }
      }

      const id = localStorage.getItem('teklozyUserId');
      if (id && id !== 'guest-demo') {
        await fetch(`${API}/api/progress/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lesson_id: moduleIndex, completed: true })
        });
      }
    } catch (e) {
      console.warn('Progress synced locally.', e);
    }
  }, [xp, triggerToast]);

  const awardXp = useCallback((amount) => {
    setXp(prev => {
      const next = prev + amount;
      try {
        const guestProgress = JSON.parse(localStorage.getItem('teklozyGuestProgress') || '{}');
        guestProgress.xp = next;
        localStorage.setItem('teklozyGuestProgress', JSON.stringify(guestProgress));
      } catch (e) {}
      return next;
    });
  }, []);

  // Guest login
  const loginAsGuest = useCallback(() => {
    localStorage.setItem('teklozyGuestSession', 'true');
    localStorage.setItem('teklozyUserId', 'guest-demo');
    localStorage.setItem('teklozyUserEmail', 'guest@teklozy.demo');
    localStorage.setItem('teklozyUserName', 'Guest Learner');
    if (!localStorage.getItem('teklozyGuestProgress')) {
      localStorage.setItem('teklozyGuestProgress', JSON.stringify({ completed: [0, 1], xp: 2700 }));
    }
    setDisplayName('Guest Learner');
    setEmail('guest@teklozy.demo');
    triggerToast('Welcome to Teklozy! Guest workspace loaded.');
    navigate('home');
  }, [navigate, triggerToast]);

  // Logout
  const logout = useCallback(async () => {
    try {
      const { supabase } = await import('../lib/supabase.js');
      if (supabase) await supabase.auth.signOut();
    } catch (e) {}

    ['teklozyUserId', 'teklozyUserEmail', 'teklozyUserName', 'teklozyGuestSession', 'teklozyGuestProgress', 'teklozySelectedPath'].forEach(k => {
      localStorage.removeItem(k);
    });

    setDisplayName('Learner');
    setEmail('');
    triggerToast('Signed out successfully.');
    navigate('signin');
  }, [navigate, triggerToast]);

  const dynamicMilestones = LEVEL_MILESTONES.map((m) => {
    if (m.level < unlockedLevel) {
      return { ...m, status: 'completed' };
    } else if (m.level === unlockedLevel) {
      return { ...m, status: 'current' };
    } else {
      return { ...m, status: 'locked' };
    }
  });

  const value = {
    currentRoute,
    navigate,
    displayName,
    setDisplayName,
    email,
    xp,
    awardXp,
    completedLessons,
    selectedPath,
    setSelectedPath,
    markLessonComplete,
    unlockedLevel,
    unlockLevel,
    isLevel1Complete,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileMenuOpen,
    setMobileMenuOpen,
    toastMessage,
    triggerToast,
    apiStatus,
    loginAsGuest,
    logout,
    paths: DEFAULT_PATHS,
    milestones: dynamicMilestones
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}
