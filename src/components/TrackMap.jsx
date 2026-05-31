import { useMemo } from "react";
import { racelandKrsko } from "../data/tracks.js";
import { interpolatePose, normalizePoints } from "../utils/trackGeometry.js";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card.jsx";

export default function TrackMap({ sample }) {
  const trackPoints = useMemo(() => normalizePoints(racelandKrsko.reverseOutline), []);
  const trackPath = racelandKrsko.previewPath;
  const pose = useMemo(
    () => interpolatePose(trackPoints, sample.progress),
    [sample.progress, trackPoints],
  );

  return (
    <Card className="track-panel">
      <CardHeader>
        <div>
          <p className="eyebrow">Track</p>
          <CardTitle>{racelandKrsko.name}</CardTitle>
        </div>
        <span>{Math.round(sample.progress * 100)}%</span>
      </CardHeader>
      <CardContent>
        <div className="track-map track-map--svg" role="img" aria-label="Raceland Krsko raceline with moving marker">
          <svg viewBox="0 0 104 104" preserveAspectRatio="xMidYMid meet">
            <path d={trackPath} className="track-route track-route-glow" />
            <path d={trackPath} className="track-route track-route-core" />
            <g transform={`translate(${pose.coordinates[0]} ${pose.coordinates[1]}) rotate(${pose.bearing})`}>
              <path
                d="M 0 -5 L 4.5 5 L 0 3.5 L -4.5 5 Z"
                className="track-marker"
              />
            </g>
          </svg>
        </div>
        <div className="track-meta">
          <span>{racelandKrsko.lengthKm.toFixed(3)} km</span>
          <span>{racelandKrsko.turns} turns</span>
          <span>{racelandKrsko.location}</span>
        </div>
      </CardContent>
    </Card>
  );
}
