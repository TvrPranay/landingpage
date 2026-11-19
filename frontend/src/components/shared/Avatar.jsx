import React from 'react';

const PALETTE = ['#0b1a38', '#0b63f6', '#7b3ff2', '#15963b', '#e8590c', '#c2255c', '#0c8599'];
const hash = (s = '') => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

/** Initials avatar — the backend stores no profile photos. */
export default function Avatar({ name = '', size = 40, tone }) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('') || 'T';
  const bg = tone ?? PALETTE[hash(name) % PALETTE.length];
  return (
    <span className="tk-avatar" style={{ width: size, height: size, fontSize: Math.round(size * 0.38), background: bg }} aria-hidden="true">
      {initials}
    </span>
  );
}
