import { useEffect, useState } from 'react';

/** Width-based scale factor so markers keep their size relative to the illustration. */
export default function useElementScale(ref, baseWidth, { min = 0.62, max = 1.25 } = {}) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w) setScale(Math.max(min, Math.min(max, w / baseWidth)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, baseWidth, min, max]);
  return scale;
}
