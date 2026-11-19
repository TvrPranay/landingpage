import React from 'react';

export function ProgressBar({ value = 0, tone, thin = false, label }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      className={`tk-progress ${tone === 'green' ? 'tk-progress--green' : ''} ${thin ? 'tk-progress--thin' : ''}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className="tk-progress__fill" style={{ width: `${Math.max(pct, pct ? 3 : 0)}%` }} />
    </div>
  );
}

export function RingProgress({ value = 0, size = 86, stroke = 9, label, fontSize }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="tk-ring" style={{ width: size, height: size }} role="img" aria-label={label ?? `${pct}% complete`}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5ebf5" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#tkRingGrad)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} style={{ transition: 'stroke-dashoffset 0.7s ease' }}
        />
        <defs>
          <linearGradient id="tkRingGrad" x1="0" x2="1">
            <stop offset="0" stopColor="#0b63f6" />
            <stop offset="1" stopColor="#3aa0ff" />
          </linearGradient>
        </defs>
      </svg>
      <span className="tk-ring__label" style={{ fontSize: fontSize ?? Math.round(size * 0.24) }}>{pct}%</span>
    </div>
  );
}
