import React from 'react';
import { Check } from 'lucide-react';
import { nextMilestone } from '../../utils/journey';

function TargetIcon() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true" className="tk-jprogress__icon">
      <circle cx="22" cy="26" r="17" fill="none" stroke="#3aa0ff" strokeWidth="3.4" />
      <circle cx="22" cy="26" r="10" fill="none" stroke="#3aa0ff" strokeWidth="3.4" />
      <circle cx="22" cy="26" r="3.6" fill="#3aa0ff" />
      <path d="M22 26 L40 8" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M34 6 l7 1 1 7" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg viewBox="0 0 48 48" width="46" height="46" aria-hidden="true" className="tk-jprogress__icon">
      <path d="M28 8c6-3 11-3 12-2 1 1 1 6-2 12L26 30l-8-8L28 8z" fill="none" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="31" cy="17" r="3.2" fill="none" stroke="#fff" strokeWidth="2.8" />
      <path d="M18 22l-7 1-4 5 8 1M26 30l-1 7-5 4-1-8" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinejoin="round" />
      <path d="M14 34l-6 6M11 30l-4 4M18 37l-4 4" stroke="#3aa0ff" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

/** Full-width navy journey summary; every value comes from the milestone states. */
export default function JourneyProgressBar({ milestones, onSelect, compact = false }) {
  const total = milestones.length || 10;
  const done = milestones.filter((m) => m.status === 'completed').length;
  const currentIndex = milestones.findIndex((m) => m.status === 'current');
  const reach = currentIndex >= 0 ? currentIndex : Math.max(0, done - 1);
  const fill = total > 1 ? reach / (total - 1) : 0;
  const next = nextMilestone(milestones);
  return (
    <section className={`tk-jprogress ${compact ? 'tk-jprogress--compact' : ''}`} aria-label="Your journey progress">
      <div className="tk-jprogress__lead">
        <TargetIcon />
        <div>
          <strong>Your Journey Progress</strong>
          <span className="tk-jprogress__sub">{done} / {total} Levels Completed</span>
        </div>
      </div>
      <div className="tk-jprogress__track" style={{ '--fill': fill }}>
        <span className="tk-jprogress__rail" aria-hidden="true" />
        <span className="tk-jprogress__fill" aria-hidden="true" />
        {milestones.map((m) => (
          <button
            type="button"
            key={m.level}
            className={`tk-jdot ${m.status === 'completed' ? 'tk-jdot--done' : m.status === 'current' ? 'tk-jdot--current' : ''}`}
            onClick={() => onSelect?.(m)}
            aria-label={`Level ${m.level}: ${m.name} (${m.status === 'current' ? 'in progress' : m.status})`}
            title={`Level ${m.level}: ${m.name}`}
          >
            {m.status === 'completed' && <Check size={13} strokeWidth={3.6} />}
          </button>
        ))}
      </div>
      <span className="tk-jprogress__sep" aria-hidden="true" />
      <div className="tk-jprogress__next">
        <RocketIcon />
        <div>
          <strong>Next Milestone</strong>
          <span className="tk-jprogress__sub" aria-live="polite">
            {next.message} {next.target && <em>{next.target.name}</em>}
          </span>
        </div>
      </div>
    </section>
  );
}
