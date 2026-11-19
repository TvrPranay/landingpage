import React, { useState } from 'react';
import {
  ArrowLeft, Code2, Trophy, BarChart2, CheckCircle2, Lock,
  Play, Sparkles, ChevronRight, Award, FileText, ChevronLeft,
  PanelRightClose, PanelRightOpen, Shield, Flame
} from 'lucide-react';
import { DUNGEON_CHAPTERS, TOTAL_DUNGEON_PROBLEMS } from '../data/dungeonData';

export default function DungeonHub({
  solvedProblemIds,
  unlockedChapterIds,
  onOpenChapter,
  onContinueQuest,
  onGoBack,
  triggerToast
}) {
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [hoveredGate, setHoveredGate] = useState(null);
  const [lockedShakeId, setLockedShakeId] = useState(null);
  const [isTraveling, setIsTraveling] = useState(false);
  const [travelingChapter, setTravelingChapter] = useState(null);

  // Calculate statistics from actual progress
  const completedChaptersCount = DUNGEON_CHAPTERS.filter(ch => {
    const solvedInCh = ch.problems.filter(p => solvedProblemIds.includes(p.id)).length;
    return solvedInCh >= ch.requiredProblemsToUnlockNext;
  }).length;

  const totalSolvedCount = solvedProblemIds.length;
  const questProgressPercent = Math.round((completedChaptersCount / DUNGEON_CHAPTERS.length) * 100);

  // Handle gate click
  const handleGateClick = (chapter) => {
    const isUnlocked = unlockedChapterIds.includes(chapter.id);
    if (!isUnlocked) {
      setLockedShakeId(chapter.id);
      setTimeout(() => setLockedShakeId(null), 600);
      const prevCh = DUNGEON_CHAPTERS.find(c => c.id === chapter.id - 1);
      triggerToast(`🔒 ${chapter.name} is locked. Solve ${prevCh?.requiredProblemsToUnlockNext || 8} problems in ${prevCh?.name || 'previous chapter'} to enter!`);
      return;
    }

    // Unlocked: trigger camera zoom & travel transition
    setIsTraveling(true);
    setTravelingChapter(chapter);
    setTimeout(() => {
      setIsTraveling(false);
      onOpenChapter(chapter.id);
    }, 450);
  };

  return (
    <div className="dungeon-hub-experience">
      {/* Background artwork canvas */}
      <div className={`dungeon-canvas-viewport ${isTraveling ? 'is-traveling-to-gate' : ''}`}>
        <img
          src="/dungeon-map-clean.jpg"
          alt="Teklozy DSA Dungeon Realm"
          className="dungeon-artwork-bg"
        />
        <div className="dungeon-ambient-overlay" />

        {/* Traveling Zoom Indicator */}
        {isTraveling && (
          <div className="dungeon-travel-indicator">
            <Sparkles size={20} className="travel-sparkle-spin" />
            <span>Entering Chapter {travelingChapter?.id}: {travelingChapter?.name}...</span>
          </div>
        )}

        {/* Top-Left Overlay Header & Feature Pills */}
        <div className="dungeon-top-left-overlay">
          <button className="btn-dungeon-back" onClick={onGoBack} title="Return to Side Quests">
            <ArrowLeft size={15} />
            <span>Side Quest</span>
          </button>

          <div className="dungeon-title-group">
            <h1 className="dungeon-main-heading">DSA <span className="highlight-gold">Dungeon</span></h1>
            <p className="dungeon-subheading">
              A gamified quest to master Data Structures and Algorithms with LeetCode.
            </p>
          </div>

          <div className="dungeon-feature-pills-row">
            <div className="dungeon-feature-pill">
              <Code2 size={15} className="pill-icon text-cyan" />
              <span>LeetCode Problems</span>
            </div>
            <div className="dungeon-feature-pill">
              <Trophy size={15} className="pill-icon text-gold" />
              <span>Quests & Levels</span>
            </div>
            <div className="dungeon-feature-pill">
              <BarChart2 size={15} className="pill-icon text-blue" />
              <span>Track Progress</span>
            </div>
          </div>
        </div>

        {/* Interactive Topic Gates Hotspots */}
        <div className="dungeon-gates-layer">
          {DUNGEON_CHAPTERS.map((ch) => {
            const isUnlocked = unlockedChapterIds.includes(ch.id);
            const solvedCount = ch.problems.filter(p => solvedProblemIds.includes(p.id)).length;
            const isCompleted = solvedCount >= ch.requiredProblemsToUnlockNext;
            const isShaking = lockedShakeId === ch.id;
            const isHovered = hoveredGate === ch.id;

            return (
              <div
                key={ch.id}
                className={`dungeon-gate-anchor gate-${ch.id} ${isUnlocked ? 'is-unlocked' : 'is-locked'} ${isCompleted ? 'is-completed' : ''} ${isShaking ? 'is-shaking' : ''}`}
                style={{ left: `${ch.gateCoords.left}%`, top: `${ch.gateCoords.top}%` }}
                onMouseEnter={() => setHoveredGate(ch.id)}
                onMouseLeave={() => setHoveredGate(null)}
                onClick={() => handleGateClick(ch)}
              >
                {/* Gate Aura & Beacon */}
                <div className={`gate-aura-ring ${isUnlocked ? 'aura-glow' : ''}`} />

                {/* Gate Click Target Button */}
                <button
                  className="gate-interactive-trigger"
                  aria-label={`Chapter ${ch.id}: ${ch.name} (${isUnlocked ? 'Unlocked' : 'Locked'})`}
                >
                  {/* Gate Card Label Overlay */}
                  <div className="gate-floating-card">
                    <div className="gate-card-badge-row">
                      <span className="gate-number-badge">{ch.gateBadge}</span>
                      <span className="gate-card-name">{ch.name}</span>
                      {!isUnlocked && <Lock size={12} className="gate-lock-icon" />}
                    </div>

                    {/* Progress Bar for Unlocked Gate */}
                    {isUnlocked && (
                      <div className="gate-card-progress-wrap">
                        <div className="gate-card-progress-bar">
                          <div
                            className="gate-card-progress-fill"
                            style={{ width: `${Math.round((solvedCount / ch.problems.length) * 100)}%` }}
                          />
                        </div>
                        <span className="gate-card-count-text">{solvedCount} / {ch.problems.length}</span>
                      </div>
                    )}
                  </div>
                </button>

                {/* Hover Popover Tooltip */}
                {isHovered && (
                  <div className="gate-hover-tooltip" role="tooltip">
                    <div className="tooltip-top-row">
                      <span className="tooltip-ch-pill">CHAPTER {ch.id}</span>
                      <span className={`tooltip-status-pill ${isCompleted ? 'completed' : isUnlocked ? 'active' : 'locked'}`}>
                        {isCompleted ? '✓ Completed' : isUnlocked ? '● Available' : '🔒 Locked'}
                      </span>
                    </div>
                    <h4>{ch.name}</h4>
                    <p>{ch.description}</p>
                    <div className="tooltip-meta-row">
                      <span><strong>{solvedCount}</strong> of {ch.problems.length} Solved</span>
                      <span className="tooltip-xp-bounty">+{ch.xpReward} XP</span>
                    </div>
                    <div className="tooltip-action-cta">
                      {isUnlocked ? (
                        <span>Enter Dungeon Gate →</span>
                      ) : (
                        <span>Prerequisite: Finish Previous Chapter</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Master Portal Beacon at Top */}
          <div
            className="dungeon-master-portal-anchor"
            style={{ left: '51.0%', top: '16.0%' }}
            onClick={() => {
              if (completedChaptersCount >= 5) {
                onOpenChapter(6);
              } else {
                triggerToast('⚡ The Master Portal unlocks once you conquer Chapters 1 through 5!');
              }
            }}
            title="The Grandmaster DSA Portal"
          >
            <div className="master-portal-glow" />
            <div className="master-portal-code-symbol">&lt;/&gt;</div>
          </div>
        </div>

        {/* Bottom Prominent Continue Quest Button */}
        <div className="dungeon-bottom-action-bar">
          <button className="btn-continue-quest-glow" onClick={onContinueQuest}>
            <Play size={18} fill="currentColor" />
            <span>Continue Quest</span>
          </button>
        </div>
      </div>

      {/* Right Floating Collapsible Quest Information Panel */}
      <aside className={`dungeon-right-quest-panel ${panelCollapsed ? 'is-collapsed' : ''}`}>
        <button
          className="btn-toggle-panel"
          onClick={() => setPanelCollapsed(!panelCollapsed)}
          title={panelCollapsed ? 'Expand Quest Panel' : 'Collapse Panel for Full Canvas View'}
        >
          {panelCollapsed ? <PanelRightOpen size={16} /> : <PanelRightClose size={16} />}
        </button>

        {!panelCollapsed && (
          <div className="quest-panel-inner-scroll">
            {/* 1. Quest Progress Card */}
            <div className="quest-panel-card quest-progress-card">
              <div className="quest-card-header">
                <div className="quest-header-title">
                  <span className="quest-card-icon text-gold">🎯</span>
                  <h3>Your Quest Progress</h3>
                </div>
              </div>

              <div className="quest-metrics-row">
                <div className="quest-ratio-stat">
                  <span className="metric-large">{completedChaptersCount}</span>
                  <span className="metric-divider">/</span>
                  <span className="metric-total">{DUNGEON_CHAPTERS.length}</span>
                  <span className="metric-label">Topics Completed</span>
                </div>
                <div className="quest-percentage-stat">
                  <span>{questProgressPercent}%</span>
                </div>
              </div>

              <div className="quest-progress-bar-wrap">
                <div className="quest-progress-bar-track">
                  <div
                    className="quest-progress-bar-fill"
                    style={{ width: `${Math.max(6, questProgressPercent)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 2. Quest Goal Card */}
            <div className="quest-panel-card quest-goal-card">
              <div className="quest-card-header">
                <div className="quest-header-title">
                  <span className="quest-card-icon text-gold">🚩</span>
                  <h3>Your Quest Goal</h3>
                </div>
              </div>

              <p className="quest-goal-subtext">
                Solve 150+ problems and complete all DSA topics.
              </p>

              <div className="quest-checklist-list">
                {DUNGEON_CHAPTERS.map((ch) => {
                  const isUnlocked = unlockedChapterIds.includes(ch.id);
                  const solvedCount = ch.problems.filter(p => solvedProblemIds.includes(p.id)).length;
                  const isDone = solvedCount >= ch.requiredProblemsToUnlockNext;

                  return (
                    <div
                      key={ch.id}
                      className={`quest-checklist-item ${isDone ? 'is-done' : ''} ${isUnlocked ? 'is-unlocked' : 'is-locked'}`}
                      onClick={() => isUnlocked && onOpenChapter(ch.id)}
                      role={isUnlocked ? 'button' : undefined}
                      tabIndex={isUnlocked ? 0 : -1}
                    >
                      <div className="checklist-left">
                        {isDone ? (
                          <div className="checklist-check-circle completed">
                            <CheckCircle2 size={16} />
                          </div>
                        ) : (
                          <div className={`checklist-check-circle ${isUnlocked ? 'active' : 'locked'}`} />
                        )}
                        <span className="checklist-topic-name">{ch.name}</span>
                      </div>

                      <div className="checklist-right">
                        {isUnlocked ? (
                          <span className="checklist-counter-pill">{solvedCount} / {ch.problems.length}</span>
                        ) : (
                          <Lock size={13} className="checklist-lock-icon" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Rewards Card */}
            <div className="quest-panel-card quest-rewards-card">
              <div className="quest-card-header">
                <div className="quest-header-title">
                  <span className="quest-card-icon text-gold">🎁</span>
                  <h3>Rewards</h3>
                </div>
              </div>

              <div className="quest-rewards-grid">
                <div className="reward-badge-card">
                  <div className="reward-badge-icon xp-cube">
                    <span className="reward-xp-text">XP</span>
                  </div>
                  <span className="reward-badge-title">+1,000 XP</span>
                </div>

                <div className="reward-badge-card">
                  <div className="reward-badge-icon badge-medal">
                    <Award size={20} className="reward-star-icon" />
                  </div>
                  <span className="reward-badge-title">DSA Badge</span>
                </div>

                <div className="reward-badge-card">
                  <div className="reward-badge-icon certificate-doc">
                    <FileText size={18} className="reward-cert-icon" />
                  </div>
                  <span className="reward-badge-title">Certificate</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
