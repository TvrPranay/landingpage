/**
 * Marker positions for each illustration, in % of the image (anchor = hexagon centre).
 * Illustrations live in /public/illustrations and can be swapped without touching components:
 * update the image and these coordinates only.
 */
export const HOME_MAP = {
  image: '/illustrations/journey-map.jpg',
  width: 924,
  height: 728,
  markers: {
    1: { x: 13.1, y: 86.5 },
    2: { x: 23.4, y: 74.6 },
    3: { x: 37.1, y: 67.6 },
    4: { x: 49.5, y: 60.3 },
    5: { x: 65.5, y: 51.1 },
    6: { x: 77.5, y: 41.2 },
    7: { x: 50.5, y: 40.4 },
    8: { x: 87.5, y: 27.5 },
    9: { x: 64.5, y: 32.6 },
    10: { x: 67.5, y: 19.2 },
  },
  quest: { left: 66.0, top: 73.4, width: 32.3, height: 24.4 },
};

export const LEVEL1_SCENE = {
  image: '/illustrations/level1-scene.jpg',
  width: 918,
  height: 747,
  /** The scene's own pedestal badge (baked into the art) is made clickable through this hotspot. */
  badge: { left: 43.0, top: 43.8, width: 21.8, height: 39.5 },
  markers: {
    2: { x: 75.2, y: 38.2 },
    4: { x: 91.8, y: 27.3 },
  },
};
