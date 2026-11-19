import React, { useId } from 'react';

const TONES = {
  navy: ['#33456b', '#0e1d3d', '#c9d3e6'],
  green: ['#4bd36f', '#11973a', '#d8ffe2'],
  blue: ['#3e8bff', '#0a4fd8', '#d6e7ff'],
  grey: ['#a7b1c3', '#727e95', '#eef2f8'],
  gold: ['#ffd25a', '#e59a00', '#fff3c9'],
};

/** Pointy-top hexagon badge used for levels, ranks and rewards. */
export default function HexBadge({ size = 56, tone = 'navy', icon: Icon, text, glow = false, className = '', iconSize }) {
  const id = useId().replace(/:/g, '');
  const [from, to, rim] = TONES[tone] ?? TONES.navy;
  return (
    <span className={`tk-hex ${className}`} style={{ width: size, height: size * 1.08 }} aria-hidden="true">
      <svg className="tk-hex__shape" viewBox="0 0 100 108">
        <defs>
          <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={from} />
            <stop offset="1" stopColor={to} />
          </linearGradient>
          {glow && (
            <filter id={`f${id}`} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          )}
        </defs>
        <polygon points="50,2 96,28 96,80 50,106 4,80 4,28" fill={rim} filter={glow ? `url(#f${id})` : undefined} />
        <polygon points="50,9 90,32 90,76 50,99 10,76 10,32" fill={`url(#g${id})`} />
        <polygon points="50,9 90,32 90,44 50,22 10,44 10,32" fill="#fff" opacity="0.12" />
      </svg>
      {Icon ? (
        <span className="tk-hex__icon"><Icon size={iconSize ?? Math.round(size * 0.42)} strokeWidth={2.2} /></span>
      ) : (
        <span className="tk-hex__text" style={{ fontSize: Math.round(size * 0.27) }}>{text}</span>
      )}
    </span>
  );
}
