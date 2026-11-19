import { useEffect, useState } from 'react';

/**
 * Size of a box with the illustration's aspect ratio that covers its container
 * (like object-fit: cover), so % marker positions stay glued to the artwork.
 */
export default function useCoverBox(ref, ratio, { alignY = 0.35, fitWidth = false } = {}) {
  const [box, setBox] = useState({ width: 0, height: 0, left: 0, top: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      if (!w || !h) return;
      if (w / h > ratio) {
        const height = w / ratio;
        setBox({ width: w, height, left: 0, top: (h - height) * alignY });
      } else if (fitWidth) {
        // Keep the whole width visible; the area below is filled by the container's backdrop.
        setBox({ width: w, height: w / ratio, left: 0, top: 0 });
      } else {
        const width = h * ratio;
        setBox({ width, height: h, left: (w - width) / 2, top: 0 });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, ratio, alignY]);
  return box;
}
