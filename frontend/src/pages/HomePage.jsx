import React, { useEffect, useRef, useState } from 'react';
import { Map as MapIcon, List, MapPin, Check, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import JourneyProgressBar from '../components/journey/JourneyProgressBar';
import LevelListView from '../components/journey/LevelListView';
import LockedLevelModal from '../components/journey/LockedLevelModal';
import { HomeStreak, SideQuests } from '../components/JourneyWidgets';
import { unlockRequirement } from '../utils/journey';
import { preloadStageScenes } from '../components/stage/StageScene';

const VIEW_KEY = 'teklozyJourneyView';

/** A live, keyboard-reachable hotspot over a badge painted in the map, with its state on top. */
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
      {st === 'current' && <span className="hm-hot__here" aria-hidden="true"><MapPin strokeWidth={2.4} /><small>You are here</small></span>}
      {st === 'completed' && <span className="hm-hot__state is-done" aria-hidden="true"><Check strokeWidth={3.4} /></span>}
      {st === 'locked' && <span className="hm-hot__state is-locked" aria-hidden="true"><Lock strokeWidth={2.6} /></span>}
    </button>
  );
}

/**
 * The Home journey map (1366×1076). Its badges and name pills are painted into the artwork;
 * live hotspots sit exactly on them.
 */
const MOUNTAIN_MAP = {
  image: '/illustrations/journey-map-v2.jpg',
  /** Centre of each painted badge, in % of the artwork, following the path from the torii gate to the temple. */
  markers: {
    1: { x: 12.5, y: 85.5 },
    2: { x: 31.5, y: 79.3 },
    3: { x: 54.5, y: 81.8 },
    4: { x: 79.3, y: 70.3 },
    5: { x: 65.4, y: 60.2 },
    6: { x: 43.9, y: 54.8 },
    7: { x: 53.8, y: 40.4 },
    8: { x: 73.8, y: 36.7 },
    9: { x: 88.7, y: 29.5 },
    10: { x: 69.5, y: 18.8 },
  },
};

const destinationFor = (level) => {
  if (level === 1) return 'discover';
  if (level === 2) return 'stage2';
  return `level/${level}`;
};

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

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
  const [travel, setTravel] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    try {
      preloadStageScenes();
    } catch (e) {}
    return () => clearTimeout(timer.current);
  }, []);

  const changeView = (next) => {
    setView(next);
    try { localStorage.setItem(VIEW_KEY, next); } catch { /* storage unavailable */ }
  };

  const select = (m) => {
    if (m.status === 'locked') {
      setShaking(m.level);
      setTimeout(() => setShaking(null), 500);
      setLocked(m);
      return;
    }
    if (travel) return;
    const to = destinationFor(m.level);
    const pos = MOUNTAIN_MAP.markers[m.level];
    if (view !== 'map' || !pos) {
      navigate(to);
      return;
    }
    // Fly into the chosen platform, fade out, then open the level
    setHover(null);
    setTravel({ level: m.level, x: pos.x, y: pos.y, calm: reducedMotion() });
    timer.current = setTimeout(() => navigate(to), reducedMotion() ? 320 : 780);
  };

  const goToCurrent = () => {
    const current = milestones.find((m) => m.status === 'current');
    setLocked(null);
    if (current) navigate(destinationFor(current.level));
  };

  const heading = (
    <div className="hm-heading">
      <span className="hm-kicker">Welcome back, {displayName || 'Guest Learner'}</span>
      <h1>The 10-Level Path <br />to <em>Get Hired</em></h1>
      <p>A hands-on journey to learn, build, and launch your tech career.</p>
      <div className="hm-toggle" role="tablist" aria-label="Journey view">
        <button
          type="button"
          role="tab"
          aria-selected={view === 'map'}
          className={view === 'map' ? 'is-active' : ''}
          onClick={() => changeView('map')}
        >
          <MapIcon size={18} /> Map View
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === 'list'}
          className={view === 'list' ? 'is-active' : ''}
          onClick={() => changeView('list')}
        >
          <List size={18} /> List View
        </button>
      </div>
    </div>
  );

  return (
    <div className="hm-page">
      <section className={`hm-map-card ${view === 'list' ? 'is-list' : ''} ${travel ? 'is-leaving' : ''}`} aria-label="Your 10-level journey">
        {view === 'map' && heading}
        {view === 'map' && (
          <>
            <img className="hm-ext is-left" src={MOUNTAIN_MAP.image} alt="" aria-hidden="true" draggable="false" />
            <img className="hm-ext is-right" src={MOUNTAIN_MAP.image} alt="" aria-hidden="true" draggable="false" />
          </>
        )}
        {view === 'map' ? (
          <div className={`hm-stage ${travel ? (travel.calm ? 'is-fading' : 'is-flying') : ''}`}>
            <div
              className={`hm-world ${travel && !travel.calm ? 'is-traveling' : ''}`}
              style={travel ? { transformOrigin: `${travel.x}% ${travel.y}%` } : undefined}
            >
              <img className="hm-art" src={MOUNTAIN_MAP.image} alt="Teklozy Mountain Career Journey" draggable="false" />
              <div className="hm-shade" aria-hidden="true" />
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
              {hover && (
                <div
                  className={`hm-tip ${MOUNTAIN_MAP.markers[hover.level].x > 70 ? 'is-left' : ''}`}
                  style={{ left: `${MOUNTAIN_MAP.markers[hover.level].x}%`, top: `${MOUNTAIN_MAP.markers[hover.level].y}%` }}
                  role="tooltip"
                >
                  <small>Level {hover.level} of 10</small>
                  <strong>{hover.name}</strong>
                  <span>{hover.status === 'locked' ? unlockRequirement(milestones, hover.level) : hover.status === 'completed' ? 'Completed — select to review' : hover.status === 'available' ? 'Open — select to visit' : 'In progress — select to continue'}</span>
                </div>
              )}
            </div>
            {travel && <div className="hm-travel" aria-live="assertive">Travelling to Level {travel.level}…</div>}
          </div>
        ) : (
          <div className="hm-listwrap">
            {heading}
            <LevelListView milestones={milestones} onSelect={select} />
          </div>
        )}
      </section>

      <aside className="hm-rail" aria-label="Streak and side quests">
        <HomeStreak />
        <JourneyProgressBar milestones={milestones} onSelect={select} compact />
        <SideQuests />
      </aside>

      {locked && (
        <LockedLevelModal milestone={locked} milestones={milestones} onClose={() => setLocked(null)} onGoToCurrent={goToCurrent} />
      )}
    </div>
  );
}
