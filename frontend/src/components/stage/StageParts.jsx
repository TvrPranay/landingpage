import React from 'react';
import { ArrowRight, Check, ChevronRight, Clock3, Gift, Lock, Play, Trophy, Zap } from 'lucide-react';
import { RingProgress, ProgressBar } from '../shared/Progress';
import { pad2, stageBadge } from '../../utils/journey';

/** "Complete Level N" card at the top of every stage panel. */
export function StageProgressCard({ level, percent = 0, done = 0, total = 0 }) {
  return (
    <div className="l1-complete">
      <RingProgress value={percent} size={92} stroke={10} fontSize={22} label={`Level ${level} ${percent}% complete`} />
      <div>
        <strong>Complete Level {level}</strong>
        <span>{done} of {total} Modules Completed</span>
        <ProgressBar value={percent} label={`Level ${level} progress`} />
      </div>
    </div>
  );
}

const STATE_LABEL = { done: 'Completed', next: 'Up next', open: 'Open', locked: 'Locked', soon: 'Under development' };

/**
 * The stage's learning modules. Each row: `{ key, position, title, description, meta, state, onClick }`
 * where state is done | next | open | locked | soon. Finished rows stay clickable so the learner can move on.
 */
export function StageModuleList({ title, rows, busy }) {
  return (
    <>
      <h2 className="l1-h2">{title ?? `Learning Modules (${rows.length})`}</h2>
      <ol className="l1-modules">
        {rows.map((r) => {
          const disabled = busy || r.state === 'locked' || r.state === 'soon' || !r.onClick;
          return (
            <li key={r.key}>
              <button type="button" className={`l1-module is-${r.state}`} disabled={disabled} onClick={r.onClick}
                aria-label={`${r.title}. ${r.meta ?? ''}. ${STATE_LABEL[r.state] ?? ''}`}>
                <span className="l1-module__state" aria-hidden="true">
                  {r.state === 'done' ? <Check size={18} strokeWidth={3} /> : r.state === 'locked' ? <Lock size={19} /> : r.state === 'soon' ? <Clock3 size={18} /> : <Play size={16} fill="currentColor" />}
                </span>
                <span className="l1-module__num" aria-hidden="true">{pad2(r.position)}</span>
                <span className="l1-module__text">
                  <strong>{r.title}</strong>
                  {r.description && <small>{r.description}</small>}
                </span>
                <span className="l1-module__time">{r.state === 'done' ? 'Done' : r.state === 'soon' ? 'Under development' : r.meta}</span>
                <ChevronRight className="l1-module__go" size={20} aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ol>
    </>
  );
}

export function StageCTA({ label, onClick, busy, done, disabled }) {
  return (
    <button type="button" className="l1-cta" onClick={onClick} disabled={busy || disabled}>
      {done ? <ArrowRight size={20} /> : <Play size={18} fill="currentColor" />} {busy ? 'Opening…' : label}
    </button>
  );
}

export function StageRewards({ level, rewardXp, badge }) {
  return (
    <div className="l1-rewards">
      <h3><Gift size={20} /> Level {level} Rewards</h3>
      <ul>
        {rewardXp > 0 && <li><Zap size={26} className="l1-rw-xp" /><span>+{rewardXp} XP</span></li>}
        <li><Trophy size={26} className="l1-rw-badge" /><span>{badge ? `${badge} Badge` : `Level ${level} Badge`}</span></li>
        {level < 10 && <li><Lock size={26} className="l1-rw-lock" /><span>Unlock Level {level + 1}</span></li>}
      </ul>
    </div>
  );
}

/** The level's own glossy badge next to the stage title. */
export function StageHeroIcon({ level }) {
  return (
    <span className="l1-hex st-heroicon" aria-hidden="true">
      <img src={stageBadge(level)} alt="" />
    </span>
  );
}

/**
 * Drill-in list of a group's modules inside the stage panel. `modules`: backend module rows
 * ({ id, code, title, state, status }). Modules without content are labelled "Under development".
 */
export function GroupModules({ group, modules, onBack, onOpen, busy }) {
  const rows = modules.map((m, i) => {
    const dev = m.status === 'awaiting_content' || m.state === 'awaiting_content';
    return {
      key: m.id, position: i + 1, title: m.title || m.label || m.id,
      description: dev ? `${m.code ?? m.id} · Under development` : `${m.code ?? m.id} · ${m.state === 'completed' ? 'Completed' : m.state === 'in_progress' ? 'In progress' : 'Open'}`,
      meta: dev ? '' : 'Open', state: dev ? 'soon' : m.state === 'completed' ? 'done' : 'open',
      onClick: dev || !onOpen ? undefined : () => onOpen(m),
    };
  });
  return (
    <>
      <button type="button" className="st-groupback" onClick={onBack}><ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} /> All groups</button>
      <StageModuleList title={`${group.number ? `${group.number}. ` : ''}${group.title} (${modules.length})`} rows={rows} busy={busy} />
    </>
  );
}
