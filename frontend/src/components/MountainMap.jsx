import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass, Layers, Check, Lock, Sparkles, ArrowRight,
  ChevronRight, Zap, MapPin, Trophy, Flag
} from 'lucide-react';

export default function MountainMap() {
  const { milestones, selectedPath, navigate } = useApp();
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'list'
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Exact coordinates (% left, % top) mapped with sub-pixel precision to the 3D mountain landscape artwork
  const nodePositions = [
    { left: 12.8, top: 80.6 },   // Level 1: Discover (Basecamp tent with green completed disc)
    { left: 21.5, top: 70.8 },   // Level 2: Learn Basics (Current waypoint with pin platform)
    { left: 36.1, top: 60.8 },   // Level 3: Learn Advanced (Academy / villa platform)
    { left: 50.2, top: 54.8 },   // Level 4: Start Building (Waterfall canyon bridge platform)
    { left: 51.3, top: 42.2 },   // Level 5: Networking (Observatory cliff platform)
    { left: 63.1, top: 38.5 },   // Level 6: Showcase (High ridge mountain pass)
    { left: 73.1, top: 33.7 },   // Level 7: Interview Prep (Alpine stone chalet waypoint)
    { left: 78.6, top: 47.4 },   // Level 8: Apply & Match (Lower switchback cliff terrace)
    { left: 80.4, top: 27.6 },   // Level 9: Premium Access (Upper glacial ice bridge)
    { left: 87.6, top: 22.9 }    // Level 10: Alumni Connect (Summit gateway platform)
  ];

  const handleNodeClick = (index) => {
    if (index === 0) {
      if (selectedPath) {
        navigate('path/' + selectedPath.id);
      } else {
        navigate('discover');
      }
    } else {
      navigate('level/' + (index + 1));
    }
  };

  const isCompleted = (index) => {
    if (index === 0) return Boolean(selectedPath);
    return false;
  };

  const isCurrent = (index) => {
    if (index === 0) return !selectedPath;
    if (index === 1) return Boolean(selectedPath);
    return false;
  };

  const completedCount = selectedPath ? 1 : 0;
  const progressPercent = Math.round((completedCount / 10) * 100);

  return (
    <div className="mountain-card">
      {/* Top Header / View Toggle */}
      <div className="mountain-card-header">
        <div className="mountain-header-left">
          <span className="kicker-pill">CAREER ROADMAP</span>
          <h2>The 10-Level Mountain Ascent</h2>
          <p className="mountain-header-desc">
            {selectedPath
              ? `Current trajectory: ${selectedPath.title}. Advance along the summit ridge to unlock your career milestone.`
              : 'Begin at Level 1: Discover to define your career specialization.'}
          </p>
        </div>

        <div className="view-toggle-group" role="tablist" aria-label="View mode">
          <button
            className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => setViewMode('map')}
            role="tab"
            aria-selected={viewMode === 'map'}
          >
            <Compass size={15} />
            <span>Summit Map</span>
          </button>
          <button
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            role="tab"
            aria-selected={viewMode === 'list'}
          >
            <Layers size={15} />
            <span>Milestone List</span>
          </button>
        </div>
      </div>

      {/* Main Canvas / Photorealistic Map View */}
      {viewMode === 'map' ? (
        <div className="summit-canvas-container photorealistic-mode" role="region" aria-label="Interactive 3D mountain journey map">
          {/* Photorealistic 3D Mountain Artwork Canvas */}
          <div className="summit-artwork-wrapper">
            <img
              src="/teklozy-mountain-journey.jpg"
              alt="Teklozy 10-Level Mountain Journey Map"
              className="summit-artwork-img"
            />
            {/* Ambient vignette and cosmic edge shading */}
            <div className="summit-artwork-vignette" />
          </div>

          {/* Interactive Summit Destination Halo Marker */}
          <div
            className="summit-shrine-marker"
            style={{ left: '85.3%', top: '15.2%' }}
            onClick={() => navigate('level/10')}
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

            return (
              <div
                key={m.level}
                className={`milestone-node-wrapper photo-node ${done ? 'is-done' : ''} ${current ? 'is-current' : ''} ${locked ? 'is-locked' : ''}`}
                style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
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

                {/* Floating Rich Tooltip with Smart Non-Clipping Placement */}
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
                          {done ? '✓ Completed' : current ? '● Current Station' : '🔒 Locked'}
                        </span>
                        <span className="popover-action">Click to inspect →</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      ) : (
        /* Tabular List View */
        <div className="milestones-list-container" role="tabpanel" aria-label="10-Level Career Milestones">
          {milestones.map((m, idx) => {
            const done = isCompleted(idx);
            const current = isCurrent(idx);
            const locked = !done && !current;

            return (
              <div
                key={m.level}
                className={`milestone-list-card ${done ? 'card-done' : ''} ${current ? 'card-current' : ''}`}
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
                  <span>{done ? 'Review' : current ? 'Continue' : 'Details'}</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mountain Footer Bar */}
      <div className="mountain-card-footer">
        <div className="footer-progress-info">
          <Zap size={18} className="sparkle-icon" />
          <div className="footer-copy">
            <strong>Mountain Journey Progress</strong>
            <span>Level {completedCount + 1} of 10 ({progressPercent}% Completed) · {completedCount} / 10 Milestones</span>
          </div>
        </div>

        <div className="footer-progress-bar-wrap">
          <div className="footer-progress-bar" title={`${progressPercent}% completed`}>
            <div className="footer-progress-fill" style={{ width: `${Math.max(10, progressPercent)}%` }} />
          </div>
        </div>

        <button
          className="btn-next-action"
          onClick={() => {
            if (selectedPath) {
              navigate('path/' + selectedPath.id);
            } else {
              navigate('discover');
            }
          }}
        >
          <span>{selectedPath ? 'Continue Your Ascent' : 'Begin Level 1 · Discover'}</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
