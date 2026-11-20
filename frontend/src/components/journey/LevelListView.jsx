import React from 'react';
import { Check, Lock, ChevronRight, Zap, Play, Sparkles } from 'lucide-react';
import { stageTile, unlockRequirement } from '../../utils/journey';

export default function LevelListView({ milestones, onSelect }) {
  return (
    <div className="pro-level-list-container">
      <div className="pro-level-list-header">
        <div>
          <span className="pro-list-kicker">Structured Career Roadmap</span>
          <h2 className="pro-list-heading">10-Level Path to Get Hired</h2>
          <p className="pro-list-subtext">
            Complete each milestone to unlock the next level, build real-world projects, and prepare for top-tier tech roles.
          </p>
        </div>
      </div>

      <ol className="pro-level-items-list" aria-label="Career levels">
        {milestones.map((m) => {
          const isCompleted = m.status === 'completed';
          const isCurrent = m.status === 'current';
          const isLocked = m.status === 'locked';

          return (
            <li key={m.level}>
              <button
                type="button"
                className={`pro-level-card is-${m.status}`}
                onClick={() => onSelect(m)}
                aria-label={`Level ${m.level}: ${m.name}, status: ${m.status}`}
              >
                {/* Left: Number & Icon */}
                <div className="pro-level-card-left">
                  <div className={`pro-level-num-badge is-${m.status}`}>
                    {String(m.level).padStart(2, '0')}
                  </div>
                  <img
                    className="pro-level-tile-art"
                    src={stageTile(m.level)}
                    alt=""
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div className="pro-level-card-info">
                    <div className="pro-level-meta-row">
                      <span className="pro-level-tag">LEVEL {m.level}</span>
                      {isCurrent && <span className="pro-current-pulse-badge">Active Milestone</span>}
                    </div>
                    <h3 className="pro-level-name">{m.name}</h3>
                    <p className="pro-level-desc">
                      {isLocked ? unlockRequirement(milestones, m.level) : m.desc || 'Explore guided modules, interactive coding environments, and verified challenges.'}
                    </p>
                  </div>
                </div>

                {/* Right: XP, Status & Chevron */}
                <div className="pro-level-card-right">
                  {m.rewardXp > 0 && (
                    <div className="pro-level-xp-pill">
                      <Zap size={14} className="text-amber-500" />
                      <span>+{m.rewardXp} XP</span>
                    </div>
                  )}

                  <div className={`pro-level-status-pill is-${m.status}`}>
                    {isCompleted ? (
                      <>
                        <Check size={14} strokeWidth={3} />
                        <span>Completed</span>
                      </>
                    ) : isCurrent ? (
                      <>
                        <Play size={13} fill="currentColor" />
                        <span>In Progress</span>
                      </>
                    ) : isLocked ? (
                      <>
                        <Lock size={13} />
                        <span>Locked</span>
                      </>
                    ) : (
                      <span>Available</span>
                    )}
                  </div>

                  <ChevronRight size={18} className="pro-level-chevron" />
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
