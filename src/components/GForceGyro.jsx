import { clamp } from '../utils/math.js';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card.jsx';

export default function GForceGyro({ sample }) {
  const x = clamp(sample.lateralG / 2.2, -1, 1) * 38;
  const y = clamp(sample.longitudinalG / 1.5, -1, 1) * -38;

  return (
    <Card className="gyro-panel">
      <CardHeader>
        <div>
          <p className="eyebrow">Gyro</p>
          <CardTitle>G-Forces</CardTitle>
        </div>
        <strong>{Math.max(Math.abs(sample.lateralG), Math.abs(sample.longitudinalG)).toFixed(2)} g</strong>
      </CardHeader>
      <CardContent>
        <div className="gyro">
          <svg viewBox="-50 -50 100 100" role="img" aria-label="G-force gyro">
            <circle r="42" className="gyro-ring" />
            <circle r="24" className="gyro-inner" />
            <line x1="-44" x2="44" y1="0" y2="0" className="gyro-axis" />
            <line x1="0" x2="0" y1="-44" y2="44" className="gyro-axis" />
            <circle cx={x} cy={y} r="6.5" className="gyro-dot" />
          </svg>
        </div>
        <div className="gyro-values">
          <span>Lat {sample.lateralG.toFixed(2)} g</span>
          <span>Long {sample.longitudinalG.toFixed(2)} g</span>
        </div>
      </CardContent>
    </Card>
  );
}
