import React, { useEffect, useState } from 'react';
import { Map as MapIcon, List, MapPin, Check, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import LevelListView from '../components/journey/LevelListView';
import LockedLevelModal from '../components/journey/LockedLevelModal';
import { SideQuests } from '../components/JourneyWidgets';
import { unlockRequirement } from '../utils/journey';
import { preloadStageScenes } from '../components/stage/StageScene';

const VIEW_KEY = 'teklozyJourneyView';

/** A clean, responsive hotspot over a badge painted into the 4K map */
function MapHotspot({ milestone, position, onSelect, onHover, shaking }) {
  const st = milestone.status;
  return (
    <button
      type="button"
      className={`hm-hot is-${st} ${shaking ? 'is-shaking' : ''}`}
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      onClick={() => onSelect(milestone)}
      onMouseEnter={() => onHover(milestone)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(milestone)}
      onBlur={() => onHover(null)}
      aria-label={`Level ${milestone.level}: ${milestone.name}, ${st === 'current' ? 'in progress, you are here' : st === 'completed' ? 'completed' : st === 'locked' ? 'locked' : 'open'}`}
    >
      <span className="hm-hot__ring" aria-hidden="true" />
      {st === 'current' && (
        <span className="hm-hot__here" aria-hidden="true">
          <MapPin strokeWidth={2.4} />
          <small>You are here</small>
        </span>
      )}
      {st === 'completed' && (
        <span className="hm-hot__state is-done" aria-hidden="true">
          <Check strokeWidth={3.4} />
        </span>
      )}
      {st === 'locked' && (
        <span className="hm-hot__state is-locked" aria-hidden="true">
          <Lock strokeWidth={2.6} />
        </span>
      )}
    </button>
  );
}

/**
 * The 4K Home journey map (3840x3025). 
 * Coordinates match the original painted pedestals from Torii gate to summit temple.
 */
const MOUNTAIN_MAP = {
  image: '/illustrations/journey-map-4k.jpg',
  markers: {
    1: { x: 12.5, y: 85.5 }, // Discover
    2: { x: 31.5, y: 79.3 }, // Learn Basics
    3: { x: 54.5, y: 81.8 }, // Learn Advanced
    4: { x: 65.4, y: 60.2 }, // Level 4 (swapped with 5)
    5: { x: 79.3, y: 70.3 }, // Level 5 (swapped with 4)
    6: { x: 43.9, y: 54.8 }, // Advanced Building
    7: { x: 53.8, y: 40.4 }, // Interview Prep
    8: { x: 73.8, y: 36.7 }, // Apply
    9: { x: 88.7, y: 29.5 }, // Premium
    10: { x: 69.5, y: 18.8 }, // Alumni Connect
  },
};

const destinationFor = (level) => {
  if (level === 1) return 'discover';
  if (level === 2) return 'stage2';
  return `level/${level}`;
};

export default function HomePage() {
  const { milestones, navigate, displayName } = useApp();
  const [view, setView] = useState(() => {
    try {
      return localStorage.getItem(VIEW_KEY) || 'map';
    } catch {
      return 'map';
    }
  });
  const [hover, setHover] = useState(null);
  const [locked, setLocked] = useState(null);
  const [shaking, setShaking] = useState(null);

  useEffect(() => {
    try {
      preloadStageScenes();
    } catch (e) {}
  }, []);

  const changeView = (next) => {
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {}
  };

  const select = (m) => {
    if (m.status === 'locked') {
      setShaking(m.level);
      setTimeout(() => setShaking(null), 500);
      setLocked(m);
      return;
    }
    const to = destinationFor(m.level);
    navigate(to);
  };

  const goToCurrent = () => {
    const current = milestones.find((m) => m.status === 'current');
    setLocked(null);
    if (current) navigate(destinationFor(current.level));
  };

  const heading = (
    <div className="hm-heading">
      <span className="hm-kicker">Welcome back, {displayName || 'Guest Learner'}</span>
      <h1>
        The 10-Level Path <br />to <em>Get Hired</em>
      </h1>
      <p>A hands-on journey to learn, build, and launch your tech career.</p>
      <div className="hm-toggle" role="tablist" aria-label="Journey view">
        <button
          type="button"
          role="tab"
          aria-selected={view === 'map'}
          className={view === 'map' ? 'is-active' : ''}
          onClick={() => changeView('map')}
        >
          <MapIcon size={17} /> Map View
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === 'list'}
          className={view === 'list' ? 'is-active' : ''}
          onClick={() => changeView('list')}
        >
          <List size={17} /> List View
        </button>
      </div>
    </div>
  );

  return (
    <div className={`hm-page ${view === 'list' ? 'is-list-view' : 'is-fullscreen-map'}`}>
      {view === 'map' ? (
        <section className="hm-map-card" aria-label="Your 10-level journey">
          {heading}

          <div className="hm-stage">
            <div className="hm-world">
              <img
                className="hm-art"
                src={MOUNTAIN_MAP.image}
                alt="Teklozy 4K Mountain Career Journey"
                draggable="false"
              />
              <div className="hm-shade" aria-hidden="true" />

              {/* 10 Interactive Milestone Hotspots */}
              {milestones.map((m) => (
                <MapHotspot
                  key={m.level}
                  milestone={m}
                  position={MOUNTAIN_MAP.markers[m.level]}
                  onSelect={select}
                  onHover={setHover}
                  shaking={shaking === m.level}
                />
              ))}

              {/* Clean Lightweight Tooltip */}
              {hover && (
                <div
                  className={`hm-tip ${MOUNTAIN_MAP.markers[hover.level].x > 70 ? 'is-left' : ''}`}
                  style={{
                    left: `${MOUNTAIN_MAP.markers[hover.level].x}%`,
                    top: `${MOUNTAIN_MAP.markers[hover.level].y}%`,
                  }}
                  role="tooltip"
                >
                  <small>Level {hover.level} of 10</small>
                  <strong>{hover.name}</strong>
                  <span>
                    {hover.status === 'locked'
                      ? unlockRequirement(milestones, hover.level)
                      : hover.status === 'completed'
                      ? 'Completed — select to review'
                      : hover.status === 'available'
                      ? 'Open — select to visit'
                      : 'In progress — select to continue'}
                  </span>
                </div>
              )}
            </div>

            {/* Side Quests sitting directly on the image with zero white background */}
            <aside className="hm-floating-sidequests" aria-label="Side Quests">
              <SideQuests />
            </aside>
          </div>
        </section>
      ) : (
        <div className="hm-listwrap">
          <div className="hm-listwrap-top">
            {heading}
          </div>
          <LevelListView milestones={milestones} onSelect={select} />
        </div>
      )}

      {locked && (
        <LockedLevelModal
          milestone={locked}
          milestones={milestones}
          onClose={() => setLocked(null)}
          onGoToCurrent={goToCurrent}
        />
      )}
    </div>
  );
}
