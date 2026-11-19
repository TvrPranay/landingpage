import React, { useRef, useState } from 'react';
import LevelMarker from './LevelMarker';
import MarkerTooltip from './MarkerTooltip';
import { HOME_MAP } from './mapLayouts';
import useElementScale from './useElementScale';
import { unlockRequirement } from '../../utils/journey';

/**
 * The illustrated 10-level mountain. The artwork is a separate, replaceable image;
 * every marker is a live button bound to the learner's milestone state.
 */
export default function JourneyMap({ milestones, onSelect, shakingLevel, layout = HOME_MAP, children }) {
  const ref = useRef(null);
  const scale = useElementScale(ref, layout.width);
  const [hover, setHover] = useState(null);
  return (
    <div className="tk-map" ref={ref} style={{ aspectRatio: `${layout.width} / ${layout.height}` }}>
      <img className="tk-map__art" src={layout.image} alt="Illustrated mountain path with a temple at the summit and ten level markers" draggable="false" />
      <div className="tk-map__shade" aria-hidden="true" />
      {milestones.map((m) => (
        <LevelMarker
          key={m.level}
          milestone={m}
          position={layout.markers[m.level]}
          onSelect={onSelect}
          onHover={setHover}
          scale={scale}
          shaking={shakingLevel === m.level}
        />
      ))}
      {hover && (
        <MarkerTooltip milestone={hover} position={layout.markers[hover.level]} requirement={unlockRequirement(milestones, hover.level)} />
      )}
      {children}
    </div>
  );
}
