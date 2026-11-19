import React from 'react';

/** Accessible tab list. `items`: [{ id, label, icon }]. */
export default function Tabs({ items, value, onChange, variant = 'panel', label }) {
  const onKey = (e, index) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = (index + (e.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length;
    onChange(items[next].id);
    e.currentTarget.parentElement?.children[next]?.focus();
  };
  return (
    <div className={variant === 'segment' ? 'tk-segment' : 'tk-tabs'} role="tablist" aria-label={label}>
      {items.map((t, i) => {
        const Icon = t.icon;
        const active = t.id === value;
        return (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={active}
            aria-controls={`panel-${t.id}`}
            tabIndex={active ? 0 : -1}
            className={`tk-tab ${active ? 'is-active' : ''}`}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {Icon && <Icon size={18} />}
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
