import { racelandKrsko } from '../data/tracks.js';

export default function TrackPreview() {
  const path = racelandKrsko.previewPath;

  return (
    <div className="preview-panel" aria-hidden="true">
      <svg viewBox="0 0 104 104" role="img">
        <path d={path} className="preview-track-line preview-track-line-glow" />
        <path d={path} className="preview-track-line preview-track-line-core" />
        <g className="preview-car-wrap">
          <circle cx="14" cy="82" r="3" className="preview-car-pulse" />
          <circle cx="14" cy="82" r="2.2" className="preview-car" />
        </g>
      </svg>
    </div>
  );
}
