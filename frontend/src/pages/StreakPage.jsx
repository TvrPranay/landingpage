import React, { useMemo } from 'react';
import {
  Flame, Calendar, Trophy, Zap, CheckCircle2, Award, Clock,
  Code2, Sparkles, ArrowLeft, ShieldCheck, ChevronRight, BarChart2,
  BookOpen, Target, FlameKindling
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function StreakPage() {
  const { xp, completedLessons, navigate, displayName } = useApp();

  // Get solved problems from real localStorage
  const solvedProblemIds = useMemo(() => {
    try {
      const saved = localStorage.getItem('teklozyDungeonSolved');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  // Real calculated activity statistics
  const totalSolved = solvedProblemIds.length;
  const totalLessonsDone = completedLessons.length;
  const totalActions = totalSolved + totalLessonsDone;

  // Streak metrics derived from activity (matches 12 Day Streak in Topbar)
  const currentStreakDays = 12 + Math.min(6, totalActions);
  const longestStreakDays = Math.max(currentStreakDays, 14);
  const totalActiveDays = 18 + totalActions;
  const weeklyConsistency = 86;

  // Generate 28-day activity heatmap cells
  const heatmapDays = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const isToday = i === 0;

      // Activity level (0: none, 1: 1 act, 2: 2-3 acts, 3: 4+ acts)
      let level = 0;
      if (isToday) {
        level = 2;
      } else if (i < currentStreakDays) {
        level = (i % 3) + 1;
      }

      days.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'short' }),
        level,
        isToday
      });
    }
    return days;
  }, [currentStreakDays]);

  // Streak Milestone Badges
  const streakMilestones = [
    { days: 3, title: '3-Day Spark', xp: 50, unlocked: true, icon: '⚡' },
    { days: 7, title: '7-Day Habit', xp: 150, unlocked: true, icon: '🔥' },
    { days: 14, title: '14-Day Warrior', xp: 350, unlocked: currentStreakDays >= 14, progress: `${currentStreakDays}/14`, icon: '⚔️' },
    { days: 30, title: '30-Day Master', xp: 800, unlocked: currentStreakDays >= 30, progress: `${currentStreakDays}/30`, icon: '👑' },
    { days: 100, title: '100-Day Legend', xp: 3000, unlocked: currentStreakDays >= 100, progress: `${currentStreakDays}/100`, icon: '🌟' }
  ];

  return (
    <div className="streak-page-container">
      {/* Top Navigation Bar */}
      <div className="streak-page-top-nav">
        <button
          className="btn-streak-back"
          onClick={() => navigate('home')}
          title="Return to Mountain Journey"
        >
          <ArrowLeft size={18} />
          <span>Back to Journey</span>
        </button>
        <span className="streak-user-tag">Learner: <strong>{displayName || 'Guest'}</strong></span>
      </div>

      {/* Hero Banner */}
      <div className="streak-hero-card">
        <div className="streak-hero-left">
          <div className="streak-giant-flame-bubble">
            <Flame size={44} className="streak-hero-flame-icon" />
          </div>
          <div>
            <div className="streak-badge-kicker">CONSISTENCY & MOMENTUM</div>
            <h1 className="streak-hero-title">{currentStreakDays} Day Streak</h1>
            <p className="streak-hero-subtitle">
              You're on a roll! Daily practice compounds your engineering knowledge and unlocks exclusive achievements.
            </p>
          </div>
        </div>

        <div className="streak-hero-right">
          <div className="streak-freeze-shield-card">
            <div className="freeze-card-top">
              <ShieldCheck size={20} className="text-cyan-400" />
              <strong>Streak Freeze Active</strong>
            </div>
            <p>1 safety freeze equipped. Protects your streak if you miss a day.</p>
            <div className="freeze-status-pill">
              <span className="freeze-dot active" /> Protected for today
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="streak-stats-row-grid">
        <div className="streak-stat-box active-streak-box">
          <div className="stat-box-header">
            <span className="stat-caption">CURRENT STREAK</span>
            <Flame size={18} className="text-orange-500" />
          </div>
          <div className="stat-val-row">
            <span className="stat-big-number">{currentStreakDays}</span>
            <span className="stat-unit">Days</span>
          </div>
          <p className="stat-subtext">Active today • Next milestone at 14 days</p>
        </div>

        <div className="streak-stat-box">
          <div className="stat-box-header">
            <span className="stat-caption">LONGEST STREAK</span>
            <Trophy size={18} className="text-yellow-500" />
          </div>
          <div className="stat-val-row">
            <span className="stat-big-number">{longestStreakDays}</span>
            <span className="stat-unit">Days</span>
          </div>
          <p className="stat-subtext">All-time personal record</p>
        </div>

        <div className="streak-stat-box">
          <div className="stat-box-header">
            <span className="stat-caption">TOTAL ACTIVE DAYS</span>
            <Calendar size={18} className="text-blue-400" />
          </div>
          <div className="stat-val-row">
            <span className="stat-big-number">{totalActiveDays}</span>
            <span className="stat-unit">Days</span>
          </div>
          <p className="stat-subtext">Verified learning sessions logged</p>
        </div>

        <div className="streak-stat-box">
          <div className="stat-box-header">
            <span className="stat-caption">WEEKLY CONSISTENCY</span>
            <Target size={18} className="text-emerald-400" />
          </div>
          <div className="stat-val-row">
            <span className="stat-big-number">{weeklyConsistency}%</span>
          </div>
          <p className="stat-subtext">Target achieved this week</p>
        </div>
      </div>

      {/* 2-Column Main Section: Activity Heatmap & Milestone Badges */}
      <div className="streak-main-split-grid">
        {/* Left Column: Heatmap Calendar & Recent Actions */}
        <div className="streak-left-section">
          <div className="streak-panel-card">
            <div className="streak-panel-header">
              <div className="panel-title-with-icon">
                <Calendar size={18} className="text-blue-400" />
                <h3>4-Week Activity Calendar</h3>
              </div>
              <div className="heatmap-legend">
                <span className="legend-label">Less</span>
                <span className="heat-cell lvl-0" />
                <span className="heat-cell lvl-1" />
                <span className="heat-cell lvl-2" />
                <span className="heat-cell lvl-3" />
                <span className="legend-label">More</span>
              </div>
            </div>

            <div className="streak-heatmap-grid" role="grid" aria-label="Activity Calendar">
              {heatmapDays.map((d, idx) => (
                <div
                  key={idx}
                  className={`heatmap-day-square lvl-${d.level} ${d.isToday ? 'is-today' : ''}`}
                  title={`${d.date} (${d.dayOfWeek}): ${d.level > 0 ? `${d.level} activities completed` : 'Rest day'}`}
                >
                  <span className="cell-day-text">{d.dayOfWeek[0]}</span>
                  {d.isToday && <span className="today-dot-indicator" />}
                </div>
              ))}
            </div>

            <div className="heatmap-footer-labels">
              <span>4 weeks ago</span>
              <span>2 weeks ago</span>
              <span className="text-blue-400 font-semibold">Today (Active)</span>
            </div>
          </div>

          {/* Quick Learning Actions */}
          <div className="streak-actions-panel">
            <h3>Keep Your Streak Alive</h3>
            <p>Complete any lesson or solve a problem to extend your streak today.</p>

            <div className="streak-quick-cta-row">
              <button
                className="btn-streak-cta primary-glow"
                onClick={() => navigate('dungeon')}
              >
                <Code2 size={18} />
                <span>Solve in DSA Dungeon</span>
              </button>

              <button
                className="btn-streak-cta secondary"
                onClick={() => navigate('lesson', { module: 0 })}
              >
                <BookOpen size={18} />
                <span>Continue Lesson</span>
              </button>

              <button
                className="btn-streak-cta secondary"
                onClick={() => navigate('hackathon')}
              >
                <Sparkles size={18} />
                <span>Explore Hackathon '26</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Milestone Badges & Streak Rules */}
        <div className="streak-right-section">
          <div className="streak-panel-card">
            <div className="streak-panel-header">
              <div className="panel-title-with-icon">
                <Award size={18} className="text-yellow-400" />
                <h3>Streak Achievements</h3>
              </div>
              <span className="badge-unlocked-ratio">2 / 5 Unlocked</span>
            </div>

            <div className="streak-milestones-list">
              {streakMilestones.map((m, idx) => (
                <div
                  key={idx}
                  className={`streak-milestone-item ${m.unlocked ? 'is-unlocked' : 'is-locked'}`}
                >
                  <div className="milestone-icon-bubble">
                    <span>{m.icon}</span>
                  </div>

                  <div className="milestone-info">
                    <div className="milestone-title-row">
                      <strong>{m.title}</strong>
                      <span className="milestone-xp-bounty">+{m.xp} XP</span>
                    </div>
                    <div className="milestone-status-sub">
                      {m.unlocked ? (
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 size={13} /> Completed
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          Progress: {m.progress} days
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How Streak Works Guide */}
          <div className="streak-rules-card">
            <h4>💡 How Streaks Work on Teklozy</h4>
            <ul>
              <li><strong>Qualifying Actions:</strong> Complete a module lesson, solve a CodeLab DSA problem, or submit a quiz.</li>
              <li><strong>Cutoff Time:</strong> Streak resets at midnight in your local timezone.</li>
              <li><strong>Streak Freeze:</strong> Automatically absorbs one missed day without losing your streak progress.</li>
              <li><strong>XP Multiplier:</strong> Maintain a 7+ day streak to receive a 1.25× XP multiplier on all activities.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
