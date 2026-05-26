import { clamp } from '../utils/math.js';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card.jsx';

export default function BarSummary({ sample }) {
  const rows = [
    { label: 'Speed', value: sample.speed, max: 130, unit: ' km/h', color: '#111111' },
    { label: 'Gas', value: sample.throttle, max: 100, unit: '%', color: '#52525b' },
    { label: 'Brake', value: sample.brake, max: 100, unit: '%', color: '#7f1d1d' },
    { label: 'Lap progress', value: sample.progress * 100, max: 100, unit: '%', color: '#b91c1c' }
  ];

  return (
    <Card className="bars-panel">
      <CardHeader>
        <div>
          <p className="eyebrow">Bars</p>
          <CardTitle>Current Load</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bar-list">
          {rows.map((row) => (
            <div className="bar-row" key={row.label}>
              <div>
                <span>{row.label}</span>
                <strong>{Math.round(row.value)}{row.unit}</strong>
              </div>
              <div className="bar-track">
                <i style={{ width: `${clamp((row.value / row.max) * 100, 0, 100)}%`, background: row.color }} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
