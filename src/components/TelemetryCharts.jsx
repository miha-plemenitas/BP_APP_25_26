import LineChart from './LineChart.jsx';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card.jsx';

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
        <LineChart
          history={history}
          series={[
            { key: 'throttle', label: 'Gas', color: '#111111', max: 100 },
            { key: 'brake', label: 'Brake', color: '#7f1d1d', max: 100 }
          ]}
        />
        <LineChart
          history={history}
          series={[{ key: 'speed', label: 'Speed', color: '#991b1b', max: 130 }]}
        />
      </CardContent>
    </Card>
  );
}
