import { Activity, Gauge, Timer, Zap } from 'lucide-react';
import { Card } from './ui/Card.jsx';
import { formatTime } from '../utils/format.js';

export default function StatCards({ sample }) {
  const stats = [
    { label: 'Top speed', value: `${Math.round(sample.topSpeed)} km/h`, icon: Gauge, tone: 'speed' },
    { label: 'Top g', value: `${sample.topG.toFixed(2)} g`, icon: Activity, tone: 'gforce' },
    { label: 'Top brake', value: `${Math.round(sample.topBrake)}%`, icon: Zap, tone: 'brake' },
    { label: `Lap ${sample.lap}`, value: formatTime(sample.lapTime), icon: Timer, tone: 'lap' }
  ];

  return (
    <section className="stats-grid" aria-label="Session highlights">
      {stats.map(({ label, value, icon: Icon, tone }) => (
        <Card className={`stat-card stat-card-${tone}`} key={label}>
          <Icon size={20} />
          <span>{label}</span>
          <strong>{value}</strong>
        </Card>
      ))}
    </section>
  );
}
