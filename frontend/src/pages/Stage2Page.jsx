import React, { useEffect, useState } from 'react';
import {
  ArrowRight, BookOpen, ChevronRight, Code2, FlaskConical, Layers, Lock, Play, Rocket, Target, Trophy, Clock3, CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import useAsync from '../hooks/useAsync';
import { ErrorState, LoadingState } from '../components/shared/States';
import { SideQuests, StreakCard } from '../components/JourneyWidgets';

const GROUP_ART = ['core', 'build', 'tools', 'dev'];
const GAIN_ICONS = { fundamentals: Code2, projects: Layers, tools: FlaskConical, 'ai-ready': Rocket };
/** Shown before enrollment, when the server has no learning path for the learner yet. */
const PREVIEW_GROUPS = [
  { number: 1, title: 'Core Concepts', summary: 'Understand the fundamentals that power real products.' },
  { number: 2, title: 'Build & Compose', summary: 'Learn how different parts work together.' },
  { number: 3, title: 'Workflows & Tools', summary: 'Use industry tools and development workflows.' },
  { number: 4, title: 'Real Development', summary: 'Apply your knowledge by building real solutions.' },
];
const STATE_LABEL = { completed: 'Completed', in_progress: 'In progress', available: 'Available', locked: 'Locked', awaiting_content: 'Content coming soon' };

function HeroTitle({ text }) {
  const words = (text || 'Build a Strong Foundation').trim().split(/\s+/);
  const last = words.pop();
  return <h1>{words.join(' ')} <em>{last}</em></h1>;
}

export default function Stage2Page() {
  const { stage2, run, navigate } = useApp();
  const overview = useAsync(() => api.get('stage2/overview'), [stage2?.batch?.id, stage2?.enrolled]);
  const data = overview.data;
  const qualification = useAsync(() => api.get('stage3/eligibility'), [data?.batch?.id], { enabled: Boolean(data?.enrolled) });
  const [busy, setBusy] = useState(false);
  const groups = data?.learningPath?.groups ?? null;
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!groups || selected !== null) return;
    const open = groups.findIndex((g) => g.state === 'in_progress' || g.state === 'available');
    setSelected(open >= 0 ? open : 0);
  }, [groups, selected]);

  const openModule = (moduleId) => navigate('stage2/module', { batch: data.batch.id, module: moduleId });
  const scrollToPath = () => document.getElementById('s2-path')?.scrollIntoView({ block: 'start', behavior: 'smooth' });

  async function primary() {
    switch (data?.cta?.action) {
      case 'module': openModule(data.cta.moduleId); return;
      case 'curriculum': scrollToPath(); return;
      case 'enroll':
        setBusy(true);
        try { await run(() => api.post('stage2/enrollment'), 'Welcome to Stage 2.'); await overview.reload(); }
        catch { /* AppContext shows the API error. */ }
        finally { setBusy(false); }
        return;
      default: navigate('level/1');
    }
  }

  const cards = groups ?? PREVIEW_GROUPS.map((g) => ({ ...g, state: 'locked', modules: [], lessonCount: null, moduleCount: null, modulesCompleted: 0 }));
  const active = groups && selected !== null ? groups[selected] : null;
  const milestoneText = !data ? '' : !data.enrolled ? data.nextMilestone?.title
    : qualification.data?.eligible ? 'Level 3 is unlocked. Open it from your journey map.'
    : data.nextMilestone?.title;
  const missing = qualification.data?.missingModules?.length ?? 0;

  return (
    <div className="s2-page">
      <div className="s2-grid">
        <div className="s2-main">
          <header className="s2-hero">
            <img className="s2-hero__art" src="/illustrations/level2-hero-scene.png" alt="" />
            <div className="s2-hero__copy">
              <span className="s2-levelpill">Level {data?.level?.number ?? 2} <span aria-hidden="true">•</span> {data?.level?.title ?? 'Core Foundations'}</span>
              <HeroTitle text={data?.hero?.title} />
              <p>{data?.hero?.summary ?? 'Master the core concepts, tools and building blocks to create real solutions.'}</p>
              {data?.cta && (
                <button type="button" className="s2-cta" onClick={primary} disabled={busy}>
                  <Play size={22} fill="currentColor" /> {busy ? 'Joining…' : data.cta.label} <ArrowRight size={22} />
                </button>
              )}
            </div>
          </header>

          {overview.error ? (
            <ErrorState message={overview.error} onRetry={overview.reload} />
          ) : overview.loading && !data ? <LoadingState label="Loading Stage 2…" /> : data && (
            <>
              <section className="s2-path" id="s2-path" aria-labelledby="s2-path-title">
                <header className="s2-path__head">
                  <h2 id="s2-path-title"><Layers size={34} /> Your Learning Path</h2>
                  <span className="s2-countpill">
                    {data.learningPath ? `${data.learningPath.groupsCompleted} / ${data.learningPath.groupsTotal}` : `0 / ${PREVIEW_GROUPS.length}`} Modules Completed
                  </span>
                </header>

                {!data.enrolled && (
                  <div className="s2-gate" role="status">
                    <Lock size={20} />
                    <span>
                      {data.enrollment?.eligible
                        ? 'Your Level 2 batch is ready. Start learning to open your modules.'
                        : data.enrollment?.reason === 'PATH_FINALIZATION_REQUIRED'
                          ? 'Choose your career path in Level 1 to unlock Level 2.'
                          : 'Complete Level 1 to unlock Level 2.'}
                    </span>
                  </div>
                )}

                <ol className="s2-groups">
                  {cards.map((g, i) => {
                    const isActive = groups && selected === i;
                    return (
                      <li key={g.number ?? g.title}>
                        <button
                          type="button"
                          className={`s2-group is-${g.state} ${isActive ? 'is-selected' : ''}`}
                          disabled={!groups}
                          aria-pressed={groups ? isActive : undefined}
                          aria-controls={groups ? 's2-modules' : undefined}
                          onClick={() => setSelected(i)}
                        >
                          <img src={`/illustrations/level2-card${i + 1}-${GROUP_ART[i % 4]}.png`} alt="" />
                          <strong>{g.number ?? i + 1}. {g.title}</strong>
                          <span className="s2-group__summary">{g.summary}</span>
                          <span className="s2-group__foot">
                            {g.lessonCount != null ? <><BookOpen size={19} /> {g.lessonCount} Lessons</> : <><Lock size={17} /> Unlocks with Level 2</>}
                            {groups && <ChevronRight size={20} className="s2-group__chev" />}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>

                {active && (
                  <div className="s2-modules" id="s2-modules" aria-live="polite">
                    <div className="s2-modules__head">
                      <h3>{active.number}. {active.title}</h3>
                      <span>{active.modulesCompleted} / {active.moduleCount} modules completed</span>
                    </div>
                    <ul>
                      {active.modules.map((m) => {
                        const awaiting = m.status === 'awaiting_content' || m.state === 'awaiting_content';
                        const locked = m.state === 'locked';
                        const state = awaiting ? 'awaiting_content' : m.state;
                        return (
                          <li key={m.id}>
                            <button type="button" className={`s2-module is-${state}`} onClick={() => openModule(m.id)} disabled={awaiting || locked}>
                              <span className="s2-module__icon" aria-hidden="true">
                                {state === 'completed' ? <CheckCircle2 size={20} /> : awaiting ? <Clock3 size={19} /> : locked ? <Lock size={18} /> : <Play size={16} fill="currentColor" />}
                              </span>
                              <span className="s2-module__text">
                                <strong>{m.title || m.id}</strong>
                                <small>{m.id} · {STATE_LABEL[state] ?? state.replaceAll('_', ' ')}</small>
                              </span>
                              {!awaiting && !locked && <ArrowRight size={18} className="s2-module__go" />}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </section>

              {data.gains?.length > 0 && (
                <section className="s2-gains" aria-label={`What you'll gain in Level ${data.level?.number ?? 2}`}>
                  <h2><Target size={36} /> What You&apos;ll Gain in Level {data.level?.number ?? 2}</h2>
                  <ul>
                    {data.gains.map((g) => {
                      const Icon = GAIN_ICONS[g.id] ?? Code2;
                      return <li key={g.id} title={g.description}><Icon size={30} /> <span>{g.title}</span></li>;
                    })}
                  </ul>
                </section>
              )}

              {data.practice?.items?.length > 0 && (
                <section className="s2-practice" aria-labelledby="s2-practice-title">
                  <h2 id="s2-practice-title">Practice challenges</h2>
                  <ul>{data.practice.items.map((item) => (
                    <li key={item.conceptId ?? item.challengeId ?? item.moduleId}>
                      <button type="button" onClick={() => navigate(
                        item.conceptId ? 'stage2/module' : 'stage2/ticket',
                        { batch: data.batch.id, module: item.slotId ?? item.moduleId, challenge: item.conceptId ? undefined : item.challengeId },
                      )}>{item.title} <ArrowRight size={16} /></button>
                    </li>
                  ))}</ul>
                </section>
              )}
            </>
          )}
        </div>

        <aside className="s2-rail" aria-label="Streak, side quests and next milestone">
          <StreakCard streak={data?.streak} loading={overview.loading} error={overview.error} reload={overview.reload} />
          <SideQuests from="stage2" />
          {data && (
            <section className="rail-card s2-milestone" aria-labelledby="s2-ms-title">
              <img src="/illustrations/level2-gate-clean.png" alt="" className="s2-milestone__art" />
              <h2 id="s2-ms-title"><Trophy size={28} /> Next Milestone</h2>
              <p>{milestoneText}</p>
              {data.enrolled && !qualification.data?.eligible && missing > 0 && (
                <small>{missing} module{missing === 1 ? '' : 's'} left before the qualification ticket.</small>
              )}
              {!data.enrolled && !data.enrollment?.eligible && (
                <button type="button" className="s2-linkbtn" onClick={() => navigate('level/1')}>Go to Level 1 <ArrowRight size={16} /></button>
              )}
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
