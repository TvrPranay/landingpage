import React, { useEffect, useState } from 'react';
import { Map as MapIcon, List, MapPin, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import LevelListView from '../components/journey/LevelListView';
import LockedLevelModal from '../components/journey/LockedLevelModal';
import { SideQuests } from '../components/JourneyWidgets';
import { unlockRequirement } from '../utils/journey';
import { preloadStageScenes } from '../components/stage/StageScene';

const VIEW_KEY = 'teklozyJourneyView';

/** Clean, transparent interactive hotspot over each painted pedestal */
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
        <span className="hm-hot__check-subtle" aria-hidden="true">
          <Check strokeWidth={3} size={14} />
        </span>
      )}
    </button>
  );
}

/**
 * 4K Journey Map Artwork (3840 x 2160, 16:9)
 * Exact hit area centers for each of the 10 fantasy mountain pathway markers:
 * 1. Discover
 * 2. Learn Basics
 * 3. Learn Advanced
 * 4. Start Building
 * 5. Advanced Building
 * 6. Networking
 * 7. Interview Prep
 * 8. Apply
 * 9. Premium
 * 10. Alumni Connect
 */
const MOUNTAIN_MAP = {
  image: '/illustrations/journey-map-clean-4k.jpg',
  markers: {
    1: { x: 20.51, y: 87.15 },  // Discover (Compass)
    2: { x: 32.23, y: 78.47 },  // Learn Basics (Layers)
    3: { x: 49.61, y: 74.65 },  // Learn Advanced (Code)
    4: { x: 67.38, y: 69.79 },  // Start Building (Cloud)
    5: { x: 39.26, y: 59.90 },  // Advanced Building (Grid)
    6: { x: 61.23, y: 52.78 },  // Networking (Network)
    7: { x: 38.87, y: 42.01 },  // Interview Prep (Trophy)
    8: { x: 55.18, y: 35.94 },  // Apply (Document)
    9: { x: 69.53, y: 31.25 },  // Premium (Crown)
    10: { x: 55.47, y: 20.83 }, // Alumni Connect (Summit Temple)
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

              {/* Clean Floating Tooltip on Hover */}
              {hover && (
                <div
                  className={`hm-tip ${MOUNTAIN_MAP.markers[hover.level].x > 65 ? 'is-left' : ''}`}
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
                      ? 'Completed — click to review'
                      : hover.status === 'available'
                      ? 'Open — click to visit'
                      : 'In progress — click to continue'}
                  </span>
                </div>
              )}
            </div>

            {/* Side Quests Floating directly on the image with ZERO white space */}
            <aside className="hm-floating-sidequests" aria-label="Side Quests">
              <SideQuests />
            </aside>
          </div>
        </section>
      ) : (
        <div className="hm-listwrap">
          <div className="hm-listwrap-top">{heading}</div>
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
