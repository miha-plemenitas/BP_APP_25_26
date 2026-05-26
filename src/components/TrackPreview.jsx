import { racelandKrsko } from '../data/tracks.js';
import { pointsToPath } from '../utils/math.js';

function normalizePoints(points) {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = maxX - minX || 1;
  const height = maxY - minY || 1;

  return points.map(([x, y]) => [
    10 + ((x - minX) / width) * 80,
    10 + ((y - minY) / height) * 80
  ]);
}

export default function TrackPreview() {
  const path = pointsToPath(normalizePoints(racelandKrsko.outline));

  return (
    <div className="preview-panel" aria-hidden="true">
      <svg viewBox="0 0 104 104" role="img">
        <path d={path} className="preview-track-line" />
        <circle cx="14" cy="82" r="2.4" className="preview-car" />
      </svg>
    </div>
  );
}
