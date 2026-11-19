import React from 'react';

export default function MarkerTooltip({ milestone, position, requirement }) {
  if (!milestone || !position) return null;
  const status = milestone.status;
  return (
    <div className="tk-marker-tip" style={{ left: `${position.x}%`, top: `${position.y}%` }} role="tooltip">
      <small>LEVEL {milestone.level} OF 10</small>
      <strong>{milestone.name}</strong>
      <p>{milestone.desc}</p>
      <div className={`tk-marker-tip__status ${status === 'completed' ? 'is-done' : status === 'current' ? 'is-current' : 'is-locked'}`}>
        {status === 'completed' ? '✓ Completed — click to review' : status === 'current' ? '● In progress — click to continue' : `🔒 ${requirement}`}
      </div>
    </div>
  );
}
