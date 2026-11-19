import React from 'react';
import { Check, Lock, ChevronRight, Zap } from 'lucide-react';
import { stageTile, unlockRequirement } from '../../utils/journey';

export default function LevelListView({ milestones, onSelect }) {
  return (
    <ol className="tk-levellist" aria-label="Career levels">
      {milestones.map((m) => {
        return (
          <li key={m.level}>
            <button className={`tk-levelrow is-${m.status}`} onClick={() => onSelect(m)} aria-label={`Level ${m.level}: ${m.name}, ${m.status}`}>
              <img className="tk-levelrow__tile" src={stageTile(m.level)} alt="" />
              <span className="tk-levelrow__text">
                <small>LEVEL {m.level}</small>
                <strong>{m.name}</strong>
                <span>{m.status === 'locked' ? unlockRequirement(milestones, m.level) : m.desc}</span>
              </span>
              <span className={`tk-levelrow__status is-${m.status}`}>
                {m.status === 'completed' ? <><Check size={14} /> Completed</> : m.status === 'current' ? 'In progress' : m.status === 'available' ? 'Open' : <><Lock size={13} /> Locked</>}
              </span>
              {m.rewardXp > 0 && <span className="tk-chip tk-chip--xp tk-levelrow__xp"><Zap size={14} /> +{m.rewardXp} XP</span>}
              <ChevronRight size={20} className="tk-levelrow__chev" />
            </button>
          </li>
        );
      })}
    </ol>
  );
}
