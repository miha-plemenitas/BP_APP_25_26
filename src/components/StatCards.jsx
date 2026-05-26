import { Activity, Gauge, Timer, Zap } from 'lucide-react';
import { Card } from './ui/Card.jsx';
import { formatTime } from '../utils/format.js';

export default function StatCards({ sample }) {
  const stats = [
    { label: 'Top speed', value: `${Math.round(sample.topSpeed)} km/h`, icon: Gauge },
    { label: 'Top g', value: `${sample.topG.toFixed(2)} g`, icon: Activity },
    { label: 'Top brake', value: `${Math.round(sample.topBrake)}%`, icon: Zap },
    { label: `Lap ${sample.lap}`, value: formatTime(sample.lapTime), icon: Timer }
  ];

  return (
    <section className="stats-grid" aria-label="Session highlights">
      {stats.map(({ label, value, icon: Icon }) => (
        <Card className="stat-card" key={label}>
          <Icon size={20} />
          <span>{label}</span>
          <strong>{value}</strong>
        </Card>
      ))}
    </section>
  );
}
