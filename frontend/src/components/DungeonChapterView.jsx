import React, { useState } from 'react';
import {
  ArrowLeft, Check, Lock, ExternalLink, Play, Award, FileText,
  BarChart2, Flame, Sparkles, ChevronRight, Shield, Trophy
} from 'lucide-react';
import { DUNGEON_CHAPTERS } from '../data/dungeonData';

export default function DungeonChapterView({
  chapterId = 1,
  solvedProblemIds = [],
  unlockedChapterIds = [1],
  onSelectProblem,
  onSwitchChapter,
  onBackToHub,
  triggerToast
}) {
  const [filterDifficulty, setFilterDifficulty] = useState('All'); // 'All' | 'Easy' | 'Medium' | 'Hard'

  const currentChapter = DUNGEON_CHAPTERS.find(ch => ch.id === Number(chapterId)) || DUNGEON_CHAPTERS[0];
  const problems = currentChapter.problems || [];

  // Filter problems by difficulty
  const filteredProblems = problems.filter(p => {
    if (filterDifficulty === 'All') return true;
    return p.difficulty === filterDifficulty;
  });

  const totalInChapter = problems.length;
  const solvedInChapter = problems.filter(p => solvedProblemIds.includes(p.id)).length;
  const chapterProgressPercent = Math.round((solvedInChapter / totalInChapter) * 100);

  // Counts for filter pills
  const easyCount = problems.filter(p => p.difficulty === 'Easy').length;
  const mediumCount = problems.filter(p => p.difficulty === 'Medium').length;
  const hardCount = problems.filter(p => p.difficulty === 'Hard').length;

  // Find next unsolved problem for "Continue Solving"
  const nextUnsolvedProblem = problems.find(p => !solvedProblemIds.includes(p.id)) || problems[0];

  const handleContinueSolving = () => {
    if (nextUnsolvedProblem) {
      onSelectProblem(currentChapter.id, nextUnsolvedProblem.id);
    }
  };

  return (
    <div className="dungeon-chapter-experience">
      {/* 1. TOP CHAPTER HERO BANNER (Item 8: Clean, Spacious, No Image Fragments) */}
      <header className="chapter-hero-banner">
        {/* Left: Back button & Title with Glowing Hexagon Badge */}
        <div className="chapter-hero-left">
          <button className="btn-banner-circle-back" onClick={onBackToHub} title="Return to Dungeon Hub">
            <ArrowLeft size={18} />
          </button>

          <div className="chapter-glowing-hex-badge">
            <div className="hex-outer-glow" />
            <div className="hex-inner-content">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </div>
          </div>

          <div className="chapter-titles-box">
            <h1 className="chapter-main-title">{currentChapter.name}</h1>
            <p className="chapter-sub-slug">
              DSA Dungeon &bull; Chapter {currentChapter.id} of {DUNGEON_CHAPTERS.length}
            </p>
          </div>
        </div>

        {/* Center: Medieval Code Portal Arch */}
        <div className="chapter-hero-center-arch" aria-hidden="true">
          <div className="hero-arch-glow" />
          <div className="hero-arch-badge">
            <span className="arch-code-symbol">&lt;/&gt;</span>
          </div>
        </div>

        {/* Right: Chapter Progress & Clean SVG Trophy Reward */}
        <div className="chapter-hero-right-progress">
          <div className="chapter-progress-metrics">
            <div className="chapter-progress-labels">
              <span className="cp-title">Chapter Progress</span>
              <span className="cp-fraction"><strong>{solvedInChapter}</strong> / {totalInChapter}</span>
              <span className="cp-percent">{chapterProgressPercent}%</span>
            </div>
            <div className="cp-progress-bar-track">
              <div
                className="cp-progress-bar-fill"
                style={{ width: `${Math.max(solvedInChapter > 0 ? 8 : 0, chapterProgressPercent)}%` }}
              />
            </div>
          </div>

          <div className="chapter-chest-svg-wrap" title={`${totalInChapter - solvedInChapter} problems remaining to unlock Chapter Rewards`}>
            <Trophy size={26} className={solvedInChapter >= 8 ? "text-gold" : "text-slate-400"} />
          </div>
        </div>
      </header>

      {/* 2. THREE-COLUMN CONTENT LAYOUT */}
      <div className="chapter-columns-grid">
        {/* LEFT COLUMN: Quest Track Stepper */}
        <aside className="chapter-col-quest-track">
          <div className="quest-track-panel-card">
            <div className="quest-track-header">
              <span className="qt-icon text-gold">🚩</span>
              <h3>Quest Track</h3>
            </div>

            <div className="quest-track-stepper-list">
              {DUNGEON_CHAPTERS.map((ch, idx) => {
                const isActive = ch.id === currentChapter.id;
                const isUnlocked = unlockedChapterIds.includes(ch.id);
                const isDone = ch.problems.filter(p => solvedProblemIds.includes(p.id)).length >= ch.requiredProblemsToUnlockNext;

                return (
                  <div
                    key={ch.id}
                    className={`stepper-node-item ${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''} ${isUnlocked ? 'is-unlocked' : 'is-locked'}`}
                  >
                    {idx < DUNGEON_CHAPTERS.length - 1 && (
                      <div className={`stepper-connector-line ${isDone ? 'done-line' : ''}`} />
                    )}

                    <button
                      className="stepper-node-btn"
                      onClick={() => {
                        if (isUnlocked) {
                          onSwitchChapter(ch.id);
                        } else {
                          triggerToast(`🔒 Chapter ${ch.id}: ${ch.name} is locked.`);
                        }
                      }}
                      title={isUnlocked ? `Open ${ch.name}` : 'Locked Chapter'}
                    >
                      <span className="stepper-num-bubble">{ch.gateBadge}</span>
                      <span className="stepper-label-text">{ch.name}</span>
                      {!isUnlocked && <Lock size={12} className="stepper-lock-icon" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* CENTER COLUMN: Practice Problems Table (Item 9: Clean, No Nested Scrollbars) */}
        <main className="chapter-col-problems-list">
          <div className="problems-panel-card">
            {/* Header & Filter Tabs Bar */}
            <div className="problems-panel-header">
              <div className="problems-header-text">
                <div className="problems-header-title-row">
                  <BarChart2 size={18} className="text-gold" />
                  <h2>Practice Problems</h2>
                </div>
                <p>Solve curated problems and strengthen your DSA skills.</p>
              </div>

              {/* Filter Pills */}
              <div className="problem-difficulty-tabs" role="tablist">
                <button
                  className={`diff-tab-btn ${filterDifficulty === 'All' ? 'is-active' : ''}`}
                  onClick={() => setFilterDifficulty('All')}
                >
                  All ({totalInChapter})
                </button>
                <button
                  className={`diff-tab-btn ${filterDifficulty === 'Easy' ? 'is-active' : ''}`}
                  onClick={() => setFilterDifficulty('Easy')}
                >
                  Easy ({easyCount})
                </button>
                <button
                  className={`diff-tab-btn ${filterDifficulty === 'Medium' ? 'is-active' : ''}`}
                  onClick={() => setFilterDifficulty('Medium')}
                >
                  Medium ({mediumCount})
                </button>
                <button
                  className={`diff-tab-btn ${filterDifficulty === 'Hard' ? 'is-active' : ''}`}
                  onClick={() => setFilterDifficulty('Hard')}
                >
                  Hard ({hardCount})
                </button>
              </div>
            </div>

            {/* Problems Rows List - Clean & Scrollbar-Free */}
            <div className="problems-items-container">
              {filteredProblems.map((prob) => {
                const isSolved = solvedProblemIds.includes(prob.id);

                return (
                  <div
                    key={prob.id}
                    className={`problem-row-item ${isSolved ? 'is-solved' : ''}`}
                    onClick={() => onSelectProblem(currentChapter.id, prob.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="problem-row-left">
                      {/* Solved checkmark or open circle */}
                      <div className={`problem-check-bubble ${isSolved ? 'completed' : 'unsolved'}`}>
                        {isSolved ? <Check size={14} strokeWidth={3} /> : null}
                      </div>

                      <span className="problem-row-title">{prob.title}</span>
                    </div>

                    <div className="problem-row-right">
                      {/* Difficulty Badge */}
                      <span className={`difficulty-badge-pill diff-${prob.difficulty.toLowerCase()}`}>
                        {prob.difficulty}
                      </span>

                      {/* Solve / External Link Icon */}
                      <button
                        className="btn-open-problem-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProblem(currentChapter.id, prob.id);
                        }}
                        title={`Solve ${prob.title}`}
                      >
                        <ExternalLink size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* RIGHT COLUMN: Chapter Rewards & Progress */}
        <aside className="chapter-col-sidebar-stats">
          {/* 1. Chapter Rewards Card */}
          <div className="chapter-rewards-card">
            <div className="rewards-card-header">
              <span className="text-gold">🎁</span>
              <h3>Chapter Rewards</h3>
            </div>

            <div className="rewards-badges-row">
              <div className="reward-badge-item">
                <div className="reward-icon-hex xp-hex">
                  <span className="badge-xp-text">XP</span>
                </div>
                <span className="reward-val">+{currentChapter.xpReward} XP</span>
              </div>

              <div className="reward-badge-item">
                <div className="reward-icon-hex badge-hex">
                  <span className="badge-star-icon">★</span>
                </div>
                <span className="reward-val">DSA Badge</span>
              </div>

              <div className="reward-badge-item">
                <div className="reward-icon-hex cert-hex">
                  <span className="badge-cert-icon">📜</span>
                </div>
                <span className="reward-val">Certificate</span>
              </div>
            </div>
          </div>

          {/* 2. Your Progress Card */}
          <div className="chapter-user-progress-card">
            <div className="user-progress-card-header">
              <span className="text-gold">🎯</span>
              <h3>Your Progress</h3>
            </div>

            <div className="progress-card-metric-row">
              <div className="metric-count-text">
                <strong>{solvedInChapter}</strong> / {totalInChapter}
                <span className="metric-caption">Problems Solved</span>
              </div>
              <span className="metric-percentage">{chapterProgressPercent}%</span>
            </div>

            <div className="user-progress-bar-track">
              <div
                className="user-progress-bar-fill"
                style={{ width: `${Math.max(solvedInChapter > 0 ? 8 : 0, chapterProgressPercent)}%` }}
              />
            </div>

            {/* Prominent Continue Solving CTA */}
            <button className="btn-continue-solving-glow" onClick={handleContinueSolving}>
              <Play size={18} fill="currentColor" />
              <span>Continue Solving</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
