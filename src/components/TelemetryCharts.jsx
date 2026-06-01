import { clamp } from '../utils/math.js';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card.jsx';

function BarHistory({ history, series, max }) {
  return (
    <div className="bar-history">
      <div className="bar-history-chart" aria-hidden="true">
        {history.map((sample, index) => {
          const value = clamp(sample[series.key], 0, max);
          return (
            <div
              className="bar-history-column"
              key={`${series.key}-${index}`}
              style={{ height: `${(value / max) * 100}%`, background: series.color }}
            />
          );
        })}
      </div>
      <div className="chart-legend">
        <span>
          <i style={{ background: series.color }} />
          {series.label}
        </span>
      </div>
    </div>
  );
}

export default function TelemetryCharts({ history }) {
  return (
    <Card className="charts-panel">
      <CardHeader>
        <div>
          <p className="eyebrow">Pedals</p>
          <CardTitle>Brake / Gas Pressure</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="pedal-bars">
          <BarHistory history={history} series={{ key: 'throttle', label: 'Gas', color: '#111111' }} max={100} />
          <BarHistory history={history} series={{ key: 'brake', label: 'Brake', color: '#7f1d1d' }} max={100} />
        </div>
      </CardContent>
    </Card>
  );
}
