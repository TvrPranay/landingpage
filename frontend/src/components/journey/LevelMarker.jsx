import React from 'react';
import { Check, Lock } from 'lucide-react';
import HexBadge from '../shared/HexBadge';
import { levelInfo } from '../../utils/journey';

const TONE = { completed: 'green', current: 'blue', locked: 'navy' };

/** One interactive level on an illustrated journey. Position is a % of the illustration. */
export default function LevelMarker({ milestone, position, onSelect, onHover, scale = 1, shaking = false, shortLabel = false, numberOverride }) {
  const info = levelInfo(milestone.level);
  const status = milestone.status;
  const size = Math.round((status === 'current' ? 66 : 56) * scale);
  const stateText = status === 'completed' ? 'completed' : status === 'current' ? 'in progress' : 'locked';
  return (
    <button
      type="button"
      className={`tk-marker tk-marker--${status === 'completed' ? 'done' : status} ${shaking ? 'is-shaking' : ''}`}
      // Anchor the hexagon centre (not the whole button) on the illustration point.
      style={{ left: `${position.x}%`, top: `${position.y}%`, transform: `translate(-50%, -${Math.round((size * 1.08) / 2)}px)`, fontSize: `${Math.round(16 * Math.max(0.72, scale))}px` }}
      onClick={() => onSelect(milestone)}
      onMouseEnter={() => onHover?.(milestone)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(milestone)}
      onBlur={() => onHover?.(null)}
      aria-label={`Level ${milestone.level}: ${milestone.name}, ${stateText}`}
    >
      <span className="tk-marker__hex" style={{ position: 'relative', display: 'inline-flex' }}>
        <HexBadge size={size} tone={TONE[status] ?? 'navy'} icon={info.icon} glow={status === 'current'} />
        {status === 'completed' && <span className="tk-marker__state tk-marker__state--done"><Check size={15} strokeWidth={3.5} /></span>}
        {status === 'locked' && <span className="tk-marker__state tk-marker__state--locked"><Lock size={13} strokeWidth={2.6} /></span>}
      </span>
      <span className="tk-marker__label">
        <span className="tk-marker__num">{numberOverride ?? milestone.level}</span>
        {shortLabel ? info.short : milestone.name}
      </span>
    </button>
  );
}
