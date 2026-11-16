import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass, Layers, Check, Lock, Sparkles, ArrowRight,
  ChevronRight, Zap, MapPin, Trophy, Flag, Bell, Calendar,
  Users, ChevronDown, ChevronUp, X, Award, ExternalLink, RefreshCw, AlertCircle
} from 'lucide-react';

export default function MountainMap() {
  const { milestones, selectedPath, navigate, displayName, xp, triggerToast } = useApp();
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'list'
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Travel / Zoom Animation State (Requirement 7)
  const [isTraveling, setIsTraveling] = useState(false);
  const [travelingLevel, setTravelingLevel] = useState(null);
  const [travelOffset, setTravelOffset] = useState({ x: 0, y: 0 });
  const [lockedShakeIndex, setLockedShakeIndex] = useState(null);

  // Floating Right-Side Panels State (Requirement 6)
  // Default: clean floating dock pills so mountain is fully visible
  const [panels, setPanels] = useState(() => {
    try {
      const saved = localStorage.getItem('teklozy_home_panels');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      announcements: false,
      events: false,
      leaderboard: false
    };
  });

  // Track Switch Confirmation Modal (Requirement 11)
  const [switchModalOpen, setSwitchModalOpen] = useState(false);

  // Persist panel preferences
  const togglePanel = (panelName) => {
    setPanels(prev => {
      const next = { ...prev, [panelName]: !prev[panelName] };
      localStorage.setItem('teklozy_home_panels', JSON.stringify(next));
      return next;
    });
  };

  const closePanel = (panelName) => {
    setPanels(prev => {
      const next = { ...prev, [panelName]: false };
      localStorage.setItem('teklozy_home_panels', JSON.stringify(next));
      return next;
    });
  };

  const closeAllPanels = () => {
    const allClosed = { announcements: false, events: false, leaderboard: false };
    setPanels(allClosed);
    localStorage.setItem('teklozy_home_panels', JSON.stringify(allClosed));
  };

  // Exact coordinates (% left, % top) calibrated to align directly on glowing 3D artwork platforms
  const nodePositions = [
    { left: 10.8, top: 77.2 },   // Level 1: Discover (Basecamp tent with green completed disc)
    { left: 21.6, top: 69.5 },   // Level 2: Learn Basics (Current waypoint on trailhead platform)
    { left: 39.8, top: 62.2 },   // Level 3: Learn Advanced (Villa terrace glowing cyan disc)
    { left: 51.5, top: 55.5 },   // Level 4: Start Building (Waterfall canyon bridge platform)
    { left: 52.6, top: 43.0 },   // Level 5: Networking (Observatory ridge glowing circle)
    { left: 60.8, top: 38.5 },   // Level 6: Showcase (High ridge mountain pass)
    { left: 74.0, top: 33.8 },   // Level 7: Interview Prep (Alpine stone chalet waypoint)
    { left: 78.8, top: 46.8 },   // Level 8: Apply & Match (Lower switchback cliff terrace)
    { left: 81.2, top: 27.2 },   // Level 9: Premium Access (Upper glacial ice bridge)
    { left: 87.8, top: 22.5 }    // Level 10: Alumni Connect (Summit gateway platform)
  ];

  const isCompleted = (index) => {
    if (index === 0) return Boolean(selectedPath);
    return false;
  };

  const isCurrent = (index) => {
    if (index === 0) return !selectedPath;
    if (index === 1) return Boolean(selectedPath);
    return false;
  };

  // Interactive milestone click with smooth travel/zoom transition
  const handleNodeClick = (index) => {
    const done = isCompleted(index);
    const current = isCurrent(index);
    const locked = !done && !current;

    // Requirement 7: Do not make locked milestones navigable; show unlock requirement
    if (locked) {
      setLockedShakeIndex(index);
      setTimeout(() => setLockedShakeIndex(null), 600);
      triggerToast(`🔒 Level ${index + 1}: ${milestones[index]?.name || ''} is locked. Complete Level ${index} milestones to ascend!`);
      return;
    }

    // Unlocked milestone: Trigger smooth zoom & camera travel transition
    const pos = nodePositions[index];
    const offsetX = (50 - pos.left) * 0.45;
    const offsetY = (50 - pos.top) * 0.45;

    setIsTraveling(true);
    setTravelingLevel(index + 1);
    setTravelOffset({ x: offsetX, y: offsetY });

    // After animation duration, navigate to the target
    setTimeout(() => {
      setIsTraveling(false);
      if (index === 0) {
        if (selectedPath) {
          navigate('path/' + selectedPath.id);
        } else {
          navigate('discover');
        }
      } else {
        navigate('level/' + (index + 1));
      }
    }, 550);
  };

  const completedCount = selectedPath ? 1 : 0;
  const progressPercent = Math.round((completedCount / 10) * 100);

  return (
    <div className="mountain-card full-viewport-mountain">
      {/* =====================================================================
          1. INTEGRATED WELCOME & CAREER ROADMAP HEADER (Requirement 3 & 4)
          ===================================================================== */}
      <div className="mountain-card-header integrated-welcome-header">
        <div className="mountain-header-left">
          <h1 className="mountain-welcome-heading">
            Welcome back, <span className="user-name-highlight">{displayName}</span> — The 10-Level Mountain Ascent
          </h1>

          <p className="mountain-header-desc">
            {selectedPath
              ? `You are on the ${selectedPath.title} summit track. Advance along the mountain ridge to unlock each career milestone.`
              : 'Begin at Level 1: Discover to define your career specialization and start your ascent.'}
          </p>
        </div>

        {/* View Mode & Right Controls */}
        <div className="mountain-header-right-controls">
          <div className="view-toggle-group" role="tablist" aria-label="View mode">
            <button
              className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
              role="tab"
              aria-selected={viewMode === 'map'}
            >
              <Compass size={14} />
              <span>Summit Map</span>
            </button>
            <button
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              role="tab"
              aria-selected={viewMode === 'list'}
            >
              <Layers size={14} />
              <span>Milestone List</span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          2. MAIN FULL-SCREEN MOUNTAIN CANVAS (Requirement 5 & 7)
          ===================================================================== */}
      {viewMode === 'map' ? (
        <div
          className="summit-canvas-container photorealistic-mode full-screen-mode"
          role="region"
          aria-label="Interactive 3D mountain journey map"
          onClick={(e) => {
            if (
              !e.target.closest('.mountain-floating-dock') &&
              !e.target.closest('.mountain-floating-panels-stack') &&
              !e.target.closest('.milestone-node-wrapper') &&
              !e.target.closest('.summit-shrine-marker')
            ) {
              closeAllPanels();
            }
          }}
        >
          
          {/* Zoom & Travel Transform Wrapper */}
          <div
            className={`summit-zoom-container ${isTraveling ? 'is-traveling' : ''}`}
            style={{
              transform: isTraveling ? `scale(1.48) translate(${travelOffset.x}%, ${travelOffset.y}%)` : 'scale(1) translate(0, 0)',
              transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* 3D Mountain Artwork Canvas */}
            <div className="summit-artwork-wrapper">
              <img
                src="/teklozy-mountain-journey.jpg"
                alt="Teklozy 10-Level Mountain Journey Map"
                className="summit-artwork-img"
              />
              <div className="summit-artwork-vignette" />
            </div>

            {/* Interactive Summit Destination Halo Marker */}
            <div
              className="summit-shrine-marker"
              style={{ left: '85.3%', top: '15.2%' }}
              onClick={() => handleNodeClick(9)}
              title="The Teklozy Summit · Career Placement & Alumni Network"
            >
              <div className="summit-temple-beacon" />
              <div className="summit-temple-badge">
                <Trophy size={14} className="trophy-icon" />
                <span>SUMMIT</span>
              </div>
            </div>

            {/* Interactive Milestone Nodes directly aligned to glowing platforms */}
            {milestones.map((m, idx) => {
              const pos = nodePositions[idx];
              const done = isCompleted(idx);
              const current = isCurrent(idx);
              const locked = !done && !current;
              const isShaking = lockedShakeIndex === idx;

              return (
                <div
                  key={m.level}
                  className={`milestone-node-wrapper photo-node ${done ? 'is-done' : ''} ${current ? 'is-current' : ''} ${locked ? 'is-locked' : ''} ${isShaking ? 'is-shaking' : ''} ${activeTooltip === idx ? 'has-active-tooltip' : ''}`}
                  style={{
                    left: `${pos.left}%`,
                    top: `${pos.top}%`,
                    zIndex: activeTooltip === idx ? 99 : 6
                  }}
                  onMouseEnter={() => setActiveTooltip(idx)}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  {/* Floating Pin Marker for Current Level */}
                  {current && (
                    <div className="active-station-pin-indicator" aria-hidden="true">
                      <MapPin size={22} className="floating-pin-icon" />
                    </div>
                  )}

                  <button
                    className="milestone-badge-btn photo-badge"
                    onClick={() => handleNodeClick(idx)}
                    aria-label={`Level ${m.level}: ${m.name} (${done ? 'Completed' : current ? 'Current' : 'Locked'})`}
                  >
                    <span className="badge-pulse-ring" />
                    <span className="badge-inner">
                      {done ? (
                        <Check size={14} strokeWidth={3} />
                      ) : locked ? (
                        <Lock size={12} />
                      ) : (
                        <span className="badge-num">{m.level}</span>
                      )}
                    </span>
                  </button>

                  <div className="node-caption photo-caption">
                    <span className="node-caption-lvl">LVL {m.level}</span>
                    <span className="node-caption-name">{m.name}</span>
                  </div>

                  {/* Non-Clipping Interactive Popover Tooltip */}
                  {activeTooltip === idx && (() => {
                    const isTopHalf = pos.top < 45;
                    const isRightEdge = pos.left > 75;
                    const isLeftEdge = pos.left < 25;
                    const popoverClass = [
                      'node-hover-popover',
                      isTopHalf ? 'placement-down' : 'placement-up',
                      isRightEdge ? 'align-right' : isLeftEdge ? 'align-left' : 'align-center'
                    ].join(' ');

                    return (
                      <div className={popoverClass} role="tooltip">
                        <div className="popover-badge">LEVEL {m.level} OF 10</div>
                        <h4>{m.name}</h4>
                        <p>{m.desc}</p>
                        <div className="popover-meta">
                          <span className="popover-status">
                            {done ? '✓ Completed' : current ? '● In Progress' : '🔒 Locked Milestone'}
                          </span>
                          <span className="popover-action">
                            {done ? 'Review Station →' : current ? 'Continue Ascent →' : 'Complete previous levels'}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>

          {/* Traveling Indicator Overlay (Requirement 7) */}
          {isTraveling && (
            <div className="mountain-travel-overlay" aria-live="assertive">
              <div className="travel-pill">
                <Sparkles size={16} className="travel-sparkle-spin" />
                <span>Ascending to Level {travelingLevel}...</span>
              </div>
            </div>
          )}

          {/* =====================================================================
              3. FLOATING RIGHT-SIDE PANELS & DOCK TOOLBAR (Requirement 6)
              ===================================================================== */}
          
          {/* Floating Pill Toolbar Dock */}
          <aside className="mountain-floating-dock" aria-label="Floating dashboard panels">
            <button
              className={`dock-pill-btn ${panels.announcements ? 'is-active' : ''}`}
              onClick={() => togglePanel('announcements')}
              title="Toggle Announcements"
            >
              <Bell size={14} className="dock-icon" />
              <span>Announcements</span>
              <span className="dock-count-badge">2</span>
            </button>

            <button
              className={`dock-pill-btn ${panels.events ? 'is-active' : ''}`}
              onClick={() => togglePanel('events')}
              title="Toggle Next Events"
            >
              <Calendar size={14} className="dock-icon" />
              <span>Events</span>
              <span className="dock-count-badge gold">1</span>
            </button>

            <button
              className={`dock-pill-btn ${panels.leaderboard ? 'is-active' : ''}`}
              onClick={() => togglePanel('leaderboard')}
              title="Toggle Leaderboard"
            >
              <Trophy size={14} className="dock-icon" />
              <span>Leaderboard</span>
              <span className="dock-rank-badge">#14</span>
            </button>
          </aside>

          {/* Floating Panel Stack on the Right */}
          <div className="mountain-floating-panels-stack">
            
            {/* Panel A: Announcements */}
            {panels.announcements && (
              <div className="floating-card-panel announcement-panel" role="region" aria-label="Announcements">
                <div className="panel-header-strip">
                  <div className="panel-title-group">
                    <Bell size={14} className="panel-header-icon" />
                    <strong>Announcements</strong>
                    <span className="panel-tag-pill">2 New</span>
                  </div>
                  <button
                    className="panel-close-btn"
                    onClick={() => closePanel('announcements')}
                    aria-label="Close Announcements"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="panel-body-content">
                  <div className="announcement-item">
                    <div className="item-header-row">
                      <span className="item-kicker">FEATURE UPDATE</span>
                      <span className="item-date">Today</span>
                    </div>
                    <h5>Teklozy CodeLab Sandbox is Live</h5>
                    <p>Real-time Python code execution, automated tests, and pedagogical AI Mentor are now available in the Build tab.</p>
                    <button className="panel-action-link" onClick={() => navigate('build')}>
                      <span>Open CodeLab</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>

                  <div className="announcement-item">
                    <div className="item-header-row">
                      <span className="item-kicker">CURRICULUM</span>
                      <span className="item-date">Nov 15</span>
                    </div>
                    <h5>Level 2 Milestone Modules Ready</h5>
                    <p>Core algorithmic thinking, arrays, hash maps, and two-pointer techniques added to your track.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Panel B: Next Events */}
            {panels.events && (
              <div className="floating-card-panel events-panel" role="region" aria-label="Next Events">
                <div className="panel-header-strip">
                  <div className="panel-title-group">
                    <Calendar size={14} className="panel-header-icon gold" />
                    <strong>Next Events</strong>
                    <span className="panel-tag-pill gold">Upcoming</span>
                  </div>
                  <button
                    className="panel-close-btn"
                    onClick={() => closePanel('events')}
                    aria-label="Close Events"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="panel-body-content">
                  <div className="event-item-box">
                    <div className="event-badge-circle">
                      <Trophy size={16} />
                    </div>
                    <div className="event-info">
                      <span className="event-timing">DEC 12–14 · 48H SPRINT</span>
                      <h5>Teklozy Hackathon '26</h5>
                      <p>Form squads, deploy production apps, and get scouted by technology partners.</p>
                      <div className="event-meta-tags">
                        <span><Zap size={11} /> +1,000 XP Bounty</span>
                        <span><Award size={11} /> Verified Badge</span>
                      </div>
                    </div>
                  </div>

                  <button className="btn-panel-primary" onClick={() => navigate('challenges')}>
                    <span>Explore Hackathon & Sprints</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* Panel C: Cohort Leaderboard */}
            {panels.leaderboard && (
              <div className="floating-card-panel leaderboard-panel" role="region" aria-label="Cohort Leaderboard">
                <div className="panel-header-strip">
                  <div className="panel-title-group">
                    <Trophy size={14} className="panel-header-icon" />
                    <strong>Cohort Standings</strong>
                    <span className="panel-tag-pill">Beta Cohort</span>
                  </div>
                  <button
                    className="panel-close-btn"
                    onClick={() => closePanel('leaderboard')}
                    aria-label="Close Leaderboard"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="panel-body-content leaderboard-scroll">
                  <div className="leaderboard-item top-rank">
                    <span className="rank-num medal-1">🥇 1</span>
                    <div className="leader-info">
                      <strong>Alex Chen</strong>
                      <small>Level 3 · Full-Stack</small>
                    </div>
                    <span className="leader-xp">4,850 XP</span>
                  </div>

                  <div className="leaderboard-item top-rank">
                    <span className="rank-num medal-2">🥈 2</span>
                    <div className="leader-info">
                      <strong>Priya Sharma</strong>
                      <small>Level 2 · AI Track</small>
                    </div>
                    <span className="leader-xp">4,200 XP</span>
                  </div>

                  <div className="leaderboard-item top-rank">
                    <span className="rank-num medal-3">🥉 3</span>
                    <div className="leader-info">
                      <strong>Marcus Vance</strong>
                      <small>Level 2 · AI Track</small>
                    </div>
                    <span className="leader-xp">3,950 XP</span>
                  </div>

                  <div className="leaderboard-divider" />

                  {/* Current User Row */}
                  <div className="leaderboard-item current-user-rank">
                    <span className="rank-num user-num">#14</span>
                    <div className="leader-info">
                      <strong>{displayName} (You)</strong>
                      <small>Level 1 · Tech Apprentice</small>
                    </div>
                    <span className="leader-xp highlight">{xp.toLocaleString()} XP</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      ) : (
        /* =====================================================================
            4. TABULAR LIST VIEW (Preserved Alternative View)
            ===================================================================== */
        <div className="milestones-list-container full-list-mode" role="tabpanel" aria-label="10-Level Career Milestones">
          {milestones.map((m, idx) => {
            const done = isCompleted(idx);
            const current = isCurrent(idx);
            const locked = !done && !current;

            return (
              <div
                key={m.level}
                className={`milestone-list-card ${done ? 'card-done' : ''} ${current ? 'card-current' : ''} ${locked ? 'card-locked' : ''}`}
                onClick={() => handleNodeClick(idx)}
                role="button"
                tabIndex={0}
              >
                <div className="list-card-num">
                  {done ? (
                    <Check size={16} strokeWidth={3} />
                  ) : locked ? (
                    <Lock size={14} />
                  ) : (
                    <span>{m.level}</span>
                  )}
                </div>

                <div className="list-card-info">
                  <div className="list-card-title-row">
                    <h3>Level {m.level} · {m.name}</h3>
                    {done && <span className="status-pill pill-done">Completed</span>}
                    {current && <span className="status-pill pill-current">In Progress</span>}
                    {locked && <span className="status-pill pill-locked">Locked</span>}
                  </div>
                  <p title={m.desc}>{m.desc}</p>
                </div>

                <div className="list-btn">
                  <span>{done ? 'Review' : current ? 'Continue' : 'Locked'}</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =====================================================================
          5. INTENTIONAL CAREER PATH SWITCH CONFIRMATION MODAL (Requirement 11)
          ===================================================================== */}
      {switchModalOpen && (
        <div className="modal-backdrop-overlay" role="dialog" aria-modal="true">
          <div className="modal-card-box">
            <div className="modal-header-icon-row">
              <AlertCircle size={28} className="modal-warning-icon" />
              <h3>Change Career Trajectory?</h3>
            </div>
            <p>
              You are currently enrolled in <strong>{selectedPath ? selectedPath.title : 'Discover'}</strong>.
            </p>
            <p>
              Switching paths will adjust your curriculum roadmap. Your completed lessons, CodeLab solutions, and earned XP are permanently preserved.
            </p>
            <div className="modal-actions-dual">
              <button
                className="btn-modal-secondary"
                onClick={() => setSwitchModalOpen(false)}
              >
                Keep Current Track
              </button>
              <button
                className="btn-modal-danger"
                onClick={() => {
                  setSwitchModalOpen(false);
                  navigate('discover');
                }}
              >
                Change Career Track
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
