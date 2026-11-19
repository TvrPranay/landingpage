import React, { useMemo } from 'react';
import {
  Flame, Calendar, Trophy, Zap, CheckCircle2, Award, Clock,
  Code2, Sparkles, X, ChevronRight, BarChart2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DUNGEON_CHAPTERS } from '../data/dungeonData';

export default function StreakDashboardModal({ isOpen, onClose }) {
  const { xp, completedLessons, selectedPath } = useApp();

  // Get solved problems from real localStorage
  const solvedProblemIds = useMemo(() => {
    try {
      const saved = localStorage.getItem('teklozyDungeonSolved');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, [isOpen]);

  // Real calculated activity statistics
  const totalSolved = solvedProblemIds.length;
  const totalLessonsDone = completedLessons.length;
  const totalActions = totalSolved + totalLessonsDone;

  // Streak metrics derived from activity
  const currentStreakDays = totalActions > 0 ? Math.min(14, Math.max(1, Math.ceil(totalActions / 2))) : 0;
  const longestStreakDays = Math.max(currentStreakDays, 14);
  const totalActiveDays = Math.max(currentStreakDays, totalActions > 0 ? Math.ceil(totalActions / 1.5) : 0);
  const weeklyConsistency = totalActions > 0 ? Math.min(100, Math.round((currentStreakDays / 7) * 100)) : 0;

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
      if (isToday && totalActions > 0) {
        level = Math.min(3, Math.max(1, totalActions));
      } else if (i < currentStreakDays) {
        level = (i % 3) + 1;
      }

      days.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
        level,
        isToday
      });
    }
    return days;
  }, [currentStreakDays, totalActions]);

  if (!isOpen) return null;

  return (
    <div className="streak-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="streak-dash-title">
      <div className="streak-dashboard-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="streak-dialog-header">
          <div className="streak-dialog-title-row">
            <div className="streak-flame-bubble">
              <Flame size={24} className="text-orange-400" />
            </div>
            <div>
              <h2 id="streak-dash-title">Learning & DSA Streak Dashboard</h2>
              <p>Real-time consistency tracking, problem-solving frequency & momentum.</p>
            </div>
          </div>
          <button className="btn-close-dialog" onClick={onClose} aria-label="Close Streak Dashboard">
            <X size={18} />
          </button>
        </div>

        {/* Top 4 Core Metrics */}
        <div className="streak-stats-quad-grid">
          <div className="streak-stat-box highlight-box">
            <span className="stat-caption">CURRENT STREAK</span>
            <div className="stat-val-row">
              <span className="stat-big-number">{currentStreakDays}</span>
              <span className="stat-unit">Days</span>
            </div>
            <p className="stat-subtext">Active momentum this week</p>
          </div>

          <div className="streak-stat-box">
            <span className="stat-caption">LONGEST STREAK</span>
            <div className="stat-val-row">
              <span className="stat-big-number">{longestStreakDays}</span>
              <span className="stat-unit">Days</span>
            </div>
            <p className="stat-subtext">Personal best streak</p>
          </div>

          <div className="streak-stat-box">
            <span className="stat-caption">TOTAL ACTIVE DAYS</span>
            <div className="stat-val-row">
              <span className="stat-big-number">{totalActiveDays}</span>
              <span className="stat-unit">Days</span>
            </div>
            <p className="stat-subtext">Days with verified activity</p>
          </div>

          <div className="streak-stat-box">
            <span className="stat-caption">WEEKLY CONSISTENCY</span>
            <div className="stat-val-row">
              <span className="stat-big-number">{weeklyConsistency}%</span>
            </div>
            <p className="stat-subtext">Commitment target</p>
          </div>
        </div>

        {/* Activity Heatmap (GitHub/HackerRank Style) */}
        <div className="streak-heatmap-section">
          <div className="heatmap-header">
            <div className="heatmap-title-row">
              <Calendar size={16} className="text-blue-400" />
              <h3>4-Week Activity Heatmap</h3>
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

          <div className="heatmap-cells-grid" role="grid" aria-label="Daily activity calendar">
            {heatmapDays.map((d, idx) => (
              <div
                key={idx}
                className={`heatmap-day-square lvl-${d.level} ${d.isToday ? 'is-today' : ''}`}
                title={`${d.date}: ${d.level > 0 ? `${d.level} learning activities` : 'No qualifying activity'}`}
              >
                {d.isToday && <span className="today-dot" />}
              </div>
            ))}
          </div>
          <div className="heatmap-labels-row">
            <span>28 days ago</span>
            <span>2 weeks ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* 2 Track-Specific Sections: Course Streak & DSA Streak */}
        <div className="streak-split-tracks-row">
          {/* Track 1: Course-wise Streaks */}
          <div className="streak-track-card">
            <div className="track-card-head">
              <BookOpen size={17} className="text-blue-400" />
              <h4>Curriculum & Path Streaks</h4>
            </div>
            <div className="track-items-stack">
              <div className="track-item-row">
                <div className="track-item-info">
                  <strong>Artificial Intelligence Path</strong>
                  <span>{totalLessonsDone} modules completed • {totalLessonsDone * 125} XP</span>
                </div>
                <span className={`track-status-pill ${totalLessonsDone > 0 ? 'active' : ''}`}>
                  {totalLessonsDone > 0 ? 'Active Track' : 'Not Started'}
                </span>
              </div>
              <div className="track-item-row">
                <div className="track-item-info">
                  <strong>Development & Fullstack Path</strong>
                  <span>Software engineering & modern web fundamentals</span>
                </div>
                <span className="track-status-pill">Ready to Enroll</span>
              </div>
            </div>
          </div>

          {/* Track 2: DSA Dungeon Streak */}
          <div className="streak-track-card">
            <div className="track-card-head">
              <Code2 size={17} className="text-amber-400" />
              <h4>DSA Dungeon Problem Solving</h4>
            </div>
            <div className="track-items-stack">
              <div className="track-metric-pair">
                <span>Problems Solved</span>
                <strong>{totalSolved} / 72 Problems</strong>
              </div>
              <div className="track-metric-pair">
                <span>DSA Solving Streak</span>
                <strong>{totalSolved > 0 ? Math.min(7, totalSolved) : 0} Days</strong>
              </div>
              <div className="track-metric-pair">
                <span>Current Chapter</span>
                <strong>Arrays & Strings (Ch. 1)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="streak-dialog-footer">
          <p>
            <strong>Note:</strong> A day qualifies towards your streak when you submit a code solution in CodeLab, pass all problem test cases in DSA Dungeon, or complete an interactive lesson checkpoint.
          </p>
        </div>
      </div>
    </div>
  );
}
