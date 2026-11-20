import React, { useState, useMemo } from 'react';
import {
  Flame, Trophy, Calendar, Target, Check, Play, Zap,
  Crown, BarChart2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function StreakPage() {
  const { navigate } = useApp();
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  // Solved count from localStorage to dynamically compute streak
  const solvedProblemIds = useMemo(() => {
    try {
      const saved = localStorage.getItem('teklozyDungeonSolved');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  const currentStreak = 12;
  const personalBest = 12;
  const totalActiveDays = 21;
  const weeklyConsistency = 86;

  // Weekly activity data (Mon - Sun)
  const weeklyData = [
    { day: 'Mon', value: 20, minutes: '20 min' },
    { day: 'Tue', value: 35, minutes: '35 min' },
    { day: 'Wed', value: 55, minutes: '55 min' },
    { day: 'Thu', value: 30, minutes: '30 min' },
    { day: 'Fri', value: 45, minutes: '45 min' },
    { day: 'Sat', value: 25, minutes: '25 min' },
    { day: 'Sun', value: 50, minutes: '50 min' }
  ];

  const maxValue = 60;

  // Streak Milestones
  const milestones = [
    {
      id: '7days',
      days: 7,
      title: '7 Days',
      subtitle: 'Build a weekly habit',
      icon: Flame,
      iconColor: '#ea580c',
      iconBg: '#ffedd5',
      completed: true,
      current: 7,
      target: 7
    },
    {
      id: '14days',
      days: 14,
      title: '14 Days',
      subtitle: 'Strengthen your consistency',
      icon: Zap,
      iconColor: '#d97706',
      iconBg: '#fef3c7',
      completed: false,
      current: 12,
      target: 14
    },
    {
      id: '30days',
      days: 30,
      title: '30 Days',
      subtitle: 'Commit to long-term learning',
      icon: Crown,
      iconColor: '#d97706',
      iconBg: '#fef3c7',
      completed: false,
      current: 12,
      target: 30
    },
    {
      id: '100days',
      days: 100,
      title: '100 Days',
      subtitle: 'Master the habit',
      icon: Trophy,
      iconColor: '#ea580c',
      iconBg: '#ffedd5',
      completed: false,
      current: 12,
      target: 100
    }
  ];

  return (
    <div className="streak-pro-container">
      {/* 1. Page Header */}
      <header className="streak-pro-header">
        <div className="streak-pro-header-row">
          <div className="streak-pro-badge-flame">
            <Flame size={24} className="flame-pulse-icon" />
          </div>
          <div>
            <h1 className="streak-pro-title">Streak</h1>
            <p className="streak-pro-subtitle">Keep your learning momentum going!</p>
          </div>
        </div>
      </header>

      {/* 2. Main 2-Column Responsive Dashboard */}
      <div className="streak-pro-grid">
        {/* Left Primary Column */}
        <div className="streak-pro-main-col">
          {/* A. Hero Banner Card */}
          <div className="streak-pro-hero-card">
            <div className="streak-hero-content-left">
              <div className="streak-hero-days-wrap">
                <span className="streak-hero-number">{currentStreak}</span>
                <span className="streak-hero-days-text">Days</span>
              </div>

              <div className="streak-hero-divider" />

              <div className="streak-hero-pb-pill">
                <Trophy size={15} className="streak-pb-icon" />
                <span>Personal best: <strong>{personalBest} days</strong></span>
              </div>
            </div>

            {/* Radiant 3D Bonfire Flame Art */}
            <div className="streak-hero-flame-zone" aria-hidden="true">
              <div className="streak-flame-aura-glow" />
              
              {/* Concentric Base Ripples */}
              <div className="streak-ripples-platform">
                <span className="ripple-ring-pro r-1" />
                <span className="ripple-ring-pro r-2" />
                <span className="ripple-ring-pro r-3" />
              </div>

              {/* Multi-layered Bonfire SVG */}
              <svg
                className="streak-bonfire-svg"
                viewBox="0 0 160 160"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Outer Flame Gradient */}
                  <linearGradient id="proFlameOuter" x1="80" y1="140" x2="80" y2="20" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#c2410c" />
                    <stop offset="35%" stopColor="#ea580c" />
                    <stop offset="70%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>

                  {/* Mid Flame Gradient */}
                  <linearGradient id="proFlameMid" x1="80" y1="130" x2="80" y2="40" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#ea580c" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#fef08a" />
                  </linearGradient>

                  {/* Hot Core Gradient */}
                  <linearGradient id="proFlameCore" x1="80" y1="120" x2="80" y2="60" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>

                  {/* Base Glow Filter */}
                  <filter id="flameBlurGlow" x="0" y="0" width="160" height="160" filterUnits="userSpaceOnUse">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                  </filter>
                </defs>

                {/* Soft ambient blur layer */}
                <path
                  d="M80 18C80 18 108 55 108 92C108 116 95 134 80 134C65 134 52 116 52 92C52 55 80 18 80 18Z"
                  fill="url(#proFlameOuter)"
                  opacity="0.45"
                  filter="url(#flameBlurGlow)"
                />

                {/* Layer 1: Outer Plume with licking tongues */}
                <path
                  d="M80 22C80 22 96 46 96 66C96 74 91 80 87 84C93 72 108 84 108 100C108 120 95 134 80 134C65 134 52 120 52 100C52 82 66 70 72 82C68 76 64 68 64 60C64 42 80 22 80 22Z"
                  fill="url(#proFlameOuter)"
                />

                {/* Layer 2: Mid Dynamic Tongue */}
                <path
                  d="M80 44C80 44 95 64 95 88C95 106 88 122 80 122C72 122 65 106 65 88C65 64 80 44 80 44Z"
                  fill="url(#proFlameMid)"
                />

                {/* Layer 3: Hot White-Hot Core */}
                <path
                  d="M80 68C80 68 90 82 90 98C90 110 85 116 80 116C75 116 70 110 70 98C70 82 80 68 80 68Z"
                  fill="url(#proFlameCore)"
                  opacity="0.95"
                />

                {/* Floating Energy Embers */}
                <circle cx="98" cy="46" r="2.5" fill="#fef08a" className="spark-particle sp-1" />
                <circle cx="62" cy="54" r="2" fill="#fbbf24" className="spark-particle sp-2" />
                <circle cx="82" cy="14" r="2.5" fill="#ffffff" className="spark-particle sp-3" />
                <circle cx="106" cy="72" r="1.5" fill="#f97316" className="spark-particle sp-4" />
              </svg>
            </div>
          </div>

          {/* B. 4 High-Precision Stat Cards */}
          <div className="streak-pro-stat-grid">
            {/* 1. Current Streak (Active Glow Highlight) */}
            <div className="streak-pro-stat-card card-active-highlight">
              <div className="stat-card-top">
                <span className="stat-card-label">CURRENT STREAK</span>
                <div className="stat-card-icon-pill icon-orange">
                  <Flame size={15} />
                </div>
              </div>
              <div className="stat-card-value-row">
                <span className="stat-number">{currentStreak}</span>
                <span className="stat-unit">Days</span>
              </div>
              <div className="stat-card-subtext active-pulse">
                <span className="status-dot-pulse" />
                <span>Active today • Keep it up!</span>
              </div>
            </div>

            {/* 2. Longest Streak */}
            <div className="streak-pro-stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">LONGEST STREAK</span>
                <div className="stat-card-icon-pill icon-amber">
                  <Trophy size={15} />
                </div>
              </div>
              <div className="stat-card-value-row">
                <span className="stat-number">{personalBest}</span>
                <span className="stat-unit">Days</span>
              </div>
              <p className="stat-card-subtext">All-time personal record</p>
            </div>

            {/* 3. Total Active Days */}
            <div className="streak-pro-stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">TOTAL ACTIVE DAYS</span>
                <div className="stat-card-icon-pill icon-blue">
                  <Calendar size={15} />
                </div>
              </div>
              <div className="stat-card-value-row">
                <span className="stat-number">{totalActiveDays}</span>
                <span className="stat-unit">Days</span>
              </div>
              <p className="stat-card-subtext">Verified learning sessions logged</p>
            </div>

            {/* 4. Weekly Consistency */}
            <div className="streak-pro-stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">WEEKLY CONSISTENCY</span>
                <div className="stat-card-icon-pill icon-emerald">
                  <Target size={15} />
                </div>
              </div>
              <div className="stat-card-value-row">
                <span className="stat-number">{weeklyConsistency}%</span>
              </div>
              <p className="stat-card-subtext">Target achieved this week</p>
            </div>
          </div>

          {/* C. Weekly Activity Bar Chart */}
          <div className="streak-pro-chart-card">
            <div className="chart-card-header">
              <div className="chart-title-group">
                <BarChart2 size={18} className="chart-header-icon" />
                <h3>Weekly Activity</h3>
              </div>
              <span className="chart-range-badge">Last 7 Days</span>
            </div>

            <div className="activity-chart-box">
              {/* Y-Axis Grid Lines & Reference Values */}
              <div className="chart-y-axis">
                {[60, 45, 30, 15, 0].map((val) => (
                  <div key={val} className="y-axis-step">
                    <span className="y-axis-num">{val}</span>
                    <div className="y-axis-line" />
                  </div>
                ))}
              </div>

              {/* 7 Columns */}
              <div className="chart-bars-container">
                {weeklyData.map((d, index) => {
                  const barHeightPct = Math.round((d.value / maxValue) * 100);
                  const isHovered = hoveredBarIndex === index;

                  return (
                    <div
                      key={d.day}
                      className="chart-col-unit"
                      onMouseEnter={() => setHoveredBarIndex(index)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                    >
                      <div className="chart-bar-slot">
                        {/* Hover Tooltip */}
                        {isHovered && (
                          <div className="chart-hover-bubble">
                            <strong>{d.minutes}</strong>
                            <span>{d.day}</span>
                          </div>
                        )}
                        <div
                          className={`chart-bar-pillar ${isHovered ? 'bar-hover' : ''}`}
                          style={{ height: `${barHeightPct}%` }}
                        />
                      </div>
                      <span className={`chart-col-label ${isHovered ? 'label-active' : ''}`}>
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Milestones Column */}
        <aside className="streak-pro-side-col">
          <div className="streak-milestones-card">
            <div className="milestones-card-header">
              <div className="milestones-title-group">
                <Trophy size={18} className="milestones-header-icon" />
                <h3>Streak Milestones</h3>
              </div>
            </div>

            <div className="milestones-pro-list">
              {milestones.map((m) => {
                const progressPct = Math.min(100, Math.round((m.current / m.target) * 100));
                const IconComponent = m.icon;

                return (
                  <div key={m.id} className={`milestone-pro-item ${m.completed ? 'is-completed' : ''}`}>
                    <div className="milestone-top-row">
                      <div className="milestone-left-info">
                        <div
                          className="milestone-icon-box"
                          style={{ backgroundColor: m.iconBg, color: m.iconColor }}
                        >
                          <IconComponent size={18} />
                        </div>
                        <div>
                          <h4 className="milestone-name">{m.title}</h4>
                          <p className="milestone-desc">{m.subtitle}</p>
                        </div>
                      </div>

                      <div className="milestone-right-status">
                        {m.completed ? (
                          <span className="badge-completed">
                            <Check size={13} strokeWidth={3} />
                            Completed
                          </span>
                        ) : (
                          <span className="badge-ratio">
                            {m.current} / {m.target} Days
                          </span>
                        )}
                      </div>
                    </div>

                    {!m.completed && (
                      <div className="milestone-track-wrap">
                        <div className="milestone-track-bg">
                          <div
                            className="milestone-track-fill"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* 3. Full-Width Bottom Anchor Banner: "Keep Your Streak Alive!" */}
      <section className="streak-pro-bottom-cta">
        <div className="cta-left-visual" aria-hidden="true">
          {/* 3D Modern Desk Calendar SVG */}
          <svg className="cta-calendar-svg" viewBox="0 0 110 90" fill="none">
            <rect x="18" y="22" width="74" height="60" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <rect x="24" y="28" width="62" height="50" rx="8" fill="#0f172a" />
            <path d="M18 38H92" stroke="#334155" strokeWidth="2" />
            <rect x="30" y="16" width="6" height="10" rx="3" fill="#f97316" />
            <rect x="74" y="16" width="6" height="10" rx="3" fill="#f97316" />
            <rect x="32" y="46" width="8" height="6" rx="2" fill="#334155" />
            <rect x="46" y="46" width="8" height="6" rx="2" fill="#334155" />
            <rect x="60" y="46" width="8" height="6" rx="2" fill="#334155" />
            <rect x="74" y="46" width="8" height="6" rx="2" fill="#334155" />
            <rect x="32" y="58" width="8" height="6" rx="2" fill="#334155" />
            {/* Golden checkmark badge */}
            <circle cx="64" cy="62" r="13" fill="#f59e0b" />
            <circle cx="64" cy="62" r="11" fill="#ea580c" />
            <path d="M59 62L62.5 65.5L69 58.5" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Sparkles */}
            <path d="M88 20L91 23M95 16L92 19" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <div className="cta-center-text">
          <h2 className="cta-headline">
            Keep Your <span className="cta-accent">Streak</span> Alive!
          </h2>
          <p className="cta-subtext">
            Stay consistent, practice daily, and turn your effort into long-term progress.
          </p>
        </div>

        <div className="cta-right-button">
          <button
            className="btn-streak-practice-now"
            onClick={() => navigate('dungeon')}
            title="Jump directly to DSA Dungeon Quests"
          >
            <Play size={16} fill="currentColor" />
            <span>Practice Now</span>
          </button>
        </div>
      </section>
    </div>
  );
}
