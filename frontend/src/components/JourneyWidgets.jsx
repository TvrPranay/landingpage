import React from 'react';
import { ArrowRight, Check, Flame, Info, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import useAsync from '../hooks/useAsync';
import { ErrorState, LoadingState } from './shared/States';

/** The two optional tunnels. Copy is only a fallback until `GET tunnels` answers. */
export const TUNNEL_PREVIEWS = [
  { id: 'dsa', title: 'DSA Tunnel', purpose: 'Master DSA, solve challenges and earn XP.' },
  { id: 'ai', title: 'AI Tunnel', purpose: 'Explore and build with artificial intelligence.' },
];

/** Splits the server message into a bold lead ("Keep the momentum!") and the rest. */
function splitMessage(message = '') {
  const m = message.match(/^(.+?[!.])\s+(.*)$/);
  return m ? [m[1], m[2]] : [message, ''];
}

function StreakGauge({ days }) {
  // 270° arc; a 7-day week fills it, longer streaks stay full.
  const r = 52;
  const c = 2 * Math.PI * r;
  const arc = c * 0.75;
  const fill = arc * Math.min(1, days / 7);
  return (
    <div className="sk-gauge" role="img" aria-label={`${days} day streak`}>
      <svg viewBox="0 0 128 128" aria-hidden="true">
        <defs>
          <linearGradient id="skGaugeGrad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#0a5cf2" />
            <stop offset="1" stopColor="#3aa0ff" />
          </linearGradient>
        </defs>
        <circle cx="64" cy="64" r={r} fill="none" stroke="#e3ebf8" strokeWidth="11" strokeLinecap="round"
          strokeDasharray={`${arc} ${c}`} transform="rotate(135 64 64)" />
        {days > 0 && (
          <circle cx="64" cy="64" r={r} fill="none" stroke="url(#skGaugeGrad)" strokeWidth="11" strokeLinecap="round"
            strokeDasharray={`${fill} ${c}`} transform="rotate(135 64 64)" />
        )}
      </svg>
      <span className="sk-gauge__value"><strong>{days}</strong><small>{days === 1 ? 'Day' : 'Days'}</small></span>
    </div>
  );
}

export function StreakCard({ streak, error, loading, reload }) {
  const [lead, rest] = splitMessage(streak?.message);
  return (
    <section className="rail-card sk-card" aria-labelledby="sk-title">
      <header className="rail-card__head">
        <h2 id="sk-title"><Flame className="sk-flame" size={26} /> Your Streak</h2>
        <span className="rail-card__info" title="A day counts when you complete a lesson or activity."><Info size={20} /></span>
      </header>
      {loading && !streak ? <LoadingState label="Loading streak…" /> : error && !streak ? <ErrorState message={error} onRetry={reload} /> : streak ? (
        <>
          <div className="sk-body">
            <StreakGauge days={streak.currentDays ?? 0} />
            <p className="sk-message"><strong>{lead}</strong>{rest && <span> {rest}</span>}</p>
          </div>
          <ol className="sk-week" aria-label="This week">
            {streak.week.map((day) => (
              <li key={day.date} aria-current={day.isToday ? 'date' : undefined}>
                <span className={`sk-dot ${day.done ? 'is-done' : ''} ${day.isToday ? 'is-today' : ''}`}
                  aria-label={`${day.weekday}: ${day.done ? 'active' : day.isFuture ? 'upcoming' : 'no activity'}`}>
                  {day.done && <Check size={16} strokeWidth={3.2} />}
                </span>
                <span className="sk-day" aria-hidden="true">{day.weekday}</span>
              </li>
            ))}
          </ol>
        </>
      ) : <p className="rail-card__note">Sign in to track your learning streak.</p>}
    </section>
  );
}

export function HomeStreak() {
  const { gamification } = useApp();
  const query = useAsync(() => api.get('streaks/me'), [gamification?.totalXp]);
  return <StreakCard {...query} streak={query.data} />;
}

function questStatus(tunnel) {
  if (tunnel.open === false) return { locked: true, text: 'Choose your Development path to unlock.' };
  if (tunnel.progress) {
    const done = tunnel.progress.modulesCompleted ?? 0;
    const total = tunnel.progress.modulesTotal ?? tunnel.modulesTotal ?? 0;
    return { locked: false, text: `${done} / ${total} modules · ${tunnel.progress.percent ?? 0}% complete`, percent: tunnel.progress.percent ?? 0 };
  }
  return { locked: false, text: tunnel.purpose };
}

/** DSA and AI tunnels, from `GET tunnels`. Each opens its own route and returns to `from`. */
export function SideQuests({ from }) {
  const { navigate, finalizedPathId, currentRoute } = useApp();
  const { data, error, loading, reload } = useAsync(() => api.get('tunnels'), [finalizedPathId]);
  const items = TUNNEL_PREVIEWS.map((preview) => ({ ...preview, ...(data?.items?.find((item) => item.id === preview.id) ?? {}) }));
  const origin = from ?? (currentRoute.path === 'home' ? 'home' : 'stage2');
  return (
    <section className="rail-card sq-card" aria-labelledby="sq-title">
      <header className="rail-card__head">
        <h2 id="sq-title">Side quests</h2>
        <span className="sq-optional">Optional</span>
      </header>
      {error && <ErrorState message={error} onRetry={reload} />}
      <div className="sq-list" aria-busy={loading}>
        {items.map((tunnel) => {
          const status = questStatus(tunnel);
          return (
            <article key={tunnel.id} className={`sq-quest sq-quest--${tunnel.id} ${status.locked ? 'is-locked' : ''}`}>
              <div className="sq-quest__copy">
                <h3>{tunnel.title} <span>(Quest)</span></h3>
                <p>{status.text}</p>
                {status.percent > 0 && (
                  <span className="sq-quest__bar" role="progressbar" aria-label={`${tunnel.title} progress`} aria-valuenow={status.percent} aria-valuemin={0} aria-valuemax={100}>
                    <span style={{ width: `${status.percent}%` }} />
                  </span>
                )}
                <button type="button" className="sq-quest__btn" onClick={() => navigate(`tunnel/${tunnel.id}`, { from: origin })}>
                  {status.locked ? <><Lock size={15} /> View quest</> : <>Enter Quest <ArrowRight size={16} /></>}
                </button>
              </div>
              <img className="sq-quest__art" src={`/illustrations/quest-${tunnel.id}.png`} alt="" />
            </article>
          );
        })}
      </div>
    </section>
  );
}
