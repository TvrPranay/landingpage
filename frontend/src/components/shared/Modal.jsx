import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ title, icon, onClose, children, actions, wide = false, labelledBy }) {
  const ref = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    ref.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [onClose]);
  const headingId = labelledBy ?? 'tk-modal-title';
  return (
    <div className="tk-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className={`tk-modal ${wide ? 'tk-modal--wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby={headingId} tabIndex={-1} ref={ref}>
        <div className="tk-modal__head">
          {icon}
          <h2 id={headingId}>{title}</h2>
          {onClose && (
            <button className="tk-modal__close" onClick={onClose} aria-label="Close dialog">
              <X size={18} />
            </button>
          )}
        </div>
        {children}
        {actions && <div className="tk-modal__actions">{actions}</div>}
      </div>
    </div>
  );
}
