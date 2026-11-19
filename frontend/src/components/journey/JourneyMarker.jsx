import React from 'react';
import { Check, Lock, MapPin } from 'lucide-react';
import { stageBadge } from '../../utils/journey';

const STATE_TEXT = { completed: 'completed', current: 'in progress', available: 'open', locked: 'locked' };

/**
 * One live milestone on an illustration. `position` is the hexagon centre in % of the artwork,
 * so the marker stays glued to its platform at every size. `label` overrides the level name.
 */
export default function JourneyMarker({ milestone, position, onSelect, onHover, shaking = false, label, number, labelSide = 'below', youAreHere = false }) {
  const status = milestone.status;
  return (
    <button
      type="button"
      className={`jm-marker is-${status} label-${labelSide} ${shaking ? 'is-shaking' : ''}`}
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      onClick={() => onSelect(milestone)}
      onMouseEnter={() => onHover?.(milestone)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(milestone)}
      onBlur={() => onHover?.(null)}
      aria-label={`Level ${milestone.level}: ${milestone.name}, ${STATE_TEXT[status] ?? status}${youAreHere ? ', you are here' : ''}`}
    >
      {youAreHere && <span className="jm-here" aria-hidden="true"><MapPin strokeWidth={2.4} /><small>You are here</small></span>}
      <span className="jm-hex" aria-hidden="true">
        <img className="jm-hex__img" src={stageBadge(milestone.level)} alt="" draggable="false" />
        {status === 'completed' && <span className="jm-state jm-state--done"><Check strokeWidth={3.5} /></span>}
        {status === 'locked' && <span className="jm-state jm-state--locked"><Lock strokeWidth={2.6} /></span>}
      </span>
      <span className="jm-label" aria-hidden="true">
        <span className="jm-label__num">{number ?? milestone.level}</span>
        <span className="jm-label__text">{label ?? milestone.name}</span>
      </span>
    </button>
  );
}
