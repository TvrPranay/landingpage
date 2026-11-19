import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeft, BookOpen, LayoutDashboard, MessagesSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import JourneyMarker from '../journey/JourneyMarker';
import JourneyProgressBar from '../journey/JourneyProgressBar';
import LockedLevelModal from '../journey/LockedLevelModal';
import { levelInfo } from '../../utils/journey';

const TABS = [
  { id: 'overview', label: 'Level Overview', icon: LayoutDashboard },
  { id: 'resources', label: 'Resources', icon: BookOpen },
  { id: 'discussion', label: 'Discussion', icon: MessagesSquare },
];

export const levelRoute = (n) => (n === 1 ? 'level/1' : n === 2 ? 'stage2' : `level/${n}`);

const PANEL_OUT_MS = 380;
const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Preloads every stage scene so moving between stages never waits for an image. */
export function preloadStageScenes() {
  if (typeof Image === 'undefined') return;
  for (let n = 1; n <= 10; n += 1) { const img = new Image(); img.src = `/illustrations/stages/scene-${n}.jpg`; }
}

/**
 * Places the artwork inside its box like object-fit: cover, nudged by `alignY`
 * (or zoomed so `focus` lands on `target`).
 */
function useArtFit(ref, art) {
  const [box, setBox] = useState({ width: 0, height: 0, left: 0, top: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      if (!w || !h) return;
      const s = Math.max(w / art.width, h / art.height) * (art.zoom ?? 1);
      const W = art.width * s;
      const H = art.height * s;
      const fx = (art.focus?.x ?? 50) / 100;
      const fy = (art.focus?.y ?? 50) / 100;
      const tx = art.target?.x ?? 0.5;
      const ty = art.target?.y ?? 0.5;
      const clamp = (v, min) => Math.min(0, Math.max(min, v));
      const left = art.focus ? clamp(tx * w - fx * W, w - W) : (w - W) / 2;
      const top = art.focus ? clamp(ty * h - fy * H, h - H) : (h - H) * (art.alignY ?? 0.2);
      setBox({ width: W, height: H, left, top });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, art.width, art.height, art.zoom, art.focus?.x, art.focus?.y, art.target?.x, art.target?.y, art.alignY]);
  return box;
}

/* ------------------------------------------------------------------ frame */

const FrameContext = createContext(null);

/**
 * The persistent stage frame. It stays mounted while the learner moves between levels, so the
 * scene crossfades into the next one and the right panel slides out and back in with the new data.
 * Each level page publishes its content with <StageScene/>.
 */
export function StageFrame({ children }) {
  const { navigate, milestones } = useApp();
  const [published, setPublished] = useState(null);
  const [shown, setShown] = useState(null);
  const [panelOut, setPanelOut] = useState(true);
  const [layers, setLayers] = useState([]);
  const [travel, setTravel] = useState(null);
  const [tab, setTab] = useState('overview');
  const [locked, setLocked] = useState(null);
  const artRef = useRef(null);
  const timers = useRef([]);
  const later = (fn, ms) => { timers.current.push(setTimeout(fn, ms)); };
  useEffect(() => { preloadStageScenes(); return () => timers.current.forEach(clearTimeout); }, []);

  // Swap in a new level: the panel slides out (if it is showing another level) and back in.
  useEffect(() => {
    if (!published) return;
    if (!shown) { setShown(published); later(() => setPanelOut(false), 40); return; }
    if (shown.level === published.level) { setShown(published); return; }
    setPanelOut(true);
    later(() => { setShown(published); setTab('overview'); later(() => setPanelOut(false), 30); }, reducedMotion() ? 0 : PANEL_OUT_MS);
  }, [published]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scene layers: the new scene settles in on top while the previous one fades away.
  const level = published?.level;
  const art = published?.art;
  useEffect(() => {
    if (!level || !art) return;
    setTravel(null);
    setLayers((prev) => {
      if (prev.length && prev[prev.length - 1].level === level) return prev;
      return [...prev.slice(-1), { level, art, key: `${level}-${Date.now()}`, first: prev.length === 0 }];
    });
    later(() => setLayers((prev) => prev.slice(-1)), 1000);
  }, [level, art?.image]); // eslint-disable-line react-hooks/exhaustive-deps

  const top = layers[layers.length - 1];
  const box = useArtFit(artRef, top?.art ?? { width: 1836, height: 1494, alignY: 0.5 });

  function selectLevel(m) {
    if (m.status === 'locked') { setLocked(m); return; }
    if (travel || m.level === level) return;
    const pos = shown?.markers?.find((x) => x.n === m.level)?.pos ?? { x: 50, y: 50 };
    setTravel({ x: pos.x, y: pos.y });
    setPanelOut(true);
    later(() => navigate(levelRoute(m.level)), reducedMotion() ? 0 : 520);
  }

  const c = shown;
  return (
    <FrameContext.Provider value={setPublished}>
      {children}
      <div className={`l1-page st-page st-level-${c?.level ?? 0}`}>
        <div className="l1-scene">
          {layers.map((l) => (
            <div key={`bd-${l.key}`} className={`l1-backdrop ${l.first ? '' : 'st-layer-fade'}`} aria-hidden="true" style={{ backgroundImage: `url("${l.art.image}")` }} />
          ))}
          <div className="l1-artbox" ref={artRef}>
            {layers.map((l, i) => {
              const isTop = i === layers.length - 1;
              return (
                <div key={l.key} className={`l1-art st-layer ${isTop ? 'is-top' : 'is-old'} ${l.first ? 'is-first' : ''} ${isTop && travel ? 'is-traveling' : ''}`}
                  style={{ width: box.width, height: box.height, left: box.left, top: box.top, transformOrigin: isTop && travel ? `${travel.x}% ${travel.y}%` : undefined }}>
                  <img src={l.art.image} alt="" draggable="false" />
                  {isTop && box.width > 0 && c?.level === l.level && (c.markers ?? []).map(({ n, pos, labelSide }) => milestones[n - 1] && (
                    <JourneyMarker key={n} milestone={milestones[n - 1]} position={pos} onSelect={selectLevel}
                      label={levelInfo(n).short} labelSide={labelSide ?? 'below'} youAreHere={milestones[n - 1].status === 'current'} />
                  ))}
                </div>
              );
            })}
          </div>
          <div className="l1-shade" aria-hidden="true" />

          {c && (
            <header className={`l1-head st-head ${panelOut ? 'is-out' : ''}`} key={`head-${c.level}`}>
              <button type="button" className="l1-back" onClick={() => navigate('home')}>
                <ArrowLeft size={20} /> My Journey
              </button>
              <div className="l1-title">
                {c.heroIcon}
                <div>
                  <span className="l1-levelpill">{c.pill ?? `Level ${c.level} of ${milestones.length || 10}`}</span>
                  <h1>{c.title}</h1>
                </div>
              </div>
              {c.desc && <p className="l1-desc">{c.desc}</p>}
            </header>
          )}

          {c && (
            <section className={`l1-panel st-panel ${panelOut ? 'is-out' : ''}`} aria-label={`Level ${c.level} overview`} aria-busy={panelOut}>
              <div className="l1-tabs" role="tablist" aria-label={`Level ${c.level} sections`}>
                {TABS.map((t) => (
                  <button key={t.id} type="button" role="tab" id={`st-tab-${t.id}`} aria-selected={tab === t.id} aria-controls={`st-panel-${t.id}`}
                    className={tab === t.id ? 'is-active' : ''} onClick={() => setTab(t.id)}>
                    <t.icon size={17} /> {t.label}
                  </button>
                ))}
              </div>
              <div role="tabpanel" id={`st-panel-${tab}`} aria-labelledby={`st-tab-${tab}`} className="l1-panel__body">
                {tab === 'overview' && c.overview}
                {tab === 'resources' && c.resources}
                {tab === 'discussion' && (
                  <div className="l1-empty">
                    <MessagesSquare size={30} />
                    <strong>Level discussions are under development</strong>
                    <span>Questions and replies for Level {c.level} will appear here once discussions open.</span>
                  </div>
                )}
              </div>
            </section>
          )}

          <div className="l1-strip">
            <JourneyProgressBar milestones={milestones} onSelect={selectLevel} />
          </div>
        </div>

        {locked && (
          <LockedLevelModal milestone={locked} milestones={milestones} onClose={() => setLocked(null)}
            onGoToCurrent={() => { const cur = milestones.find((m) => m.status === 'current'); setLocked(null); if (cur) navigate(levelRoute(cur.level)); }} />
        )}
      </div>
    </FrameContext.Provider>
  );
}

/**
 * Publishes one level's content to the surrounding <StageFrame/>. Renders nothing itself.
 * Without a frame (e.g. in tests) it renders a minimal standalone layout.
 */
export default function StageScene(props) {
  const publish = useContext(FrameContext);
  useLayoutEffect(() => { publish?.(props); });
  if (publish) return null;
  return (
    <div className={`l1-page st-page st-level-${props.level}`}>
      <header className="l1-head"><span className="l1-levelpill">{props.pill ?? `Level ${props.level}`}</span><h1>{props.title}</h1>{props.desc && <p className="l1-desc">{props.desc}</p>}</header>
      <section className="l1-panel">{props.overview}{props.resources}</section>
    </div>
  );
}
