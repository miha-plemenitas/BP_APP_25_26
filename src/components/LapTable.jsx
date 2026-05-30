import { Flag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card.jsx';
import { formatTime } from '../utils/format.js';

export default function LapTable({ laps, currentSample }) {
  const rows = laps.length > 0 ? laps : [
    {
      lap: currentSample.lap,
      time: currentSample.lapTime,
      topSpeed: currentSample.topSpeed,
      topBrake: currentSample.topBrake,
      topG: currentSample.topG,
      averageSpeed: currentSample.speed,
      paceLabel: currentSample.paceLabel ?? "Baseline",
      paceDelta: currentSample.paceDelta ?? 0
    }
  ];

  return (
    <Card className="lap-panel">
      <CardHeader>
        <div>
          <p className="eyebrow">Lap rhythm</p>
          <CardTitle>Lap Ledger</CardTitle>
        </div>
        <Flag size={20} />
      </CardHeader>
      <CardContent>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Lap</th>
                <th>Time</th>
                <th>Pace</th>
                <th>Top speed</th>
                <th>Top brake</th>
                <th>Top g</th>
                <th>Avg speed</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((lap) => (
                <tr key={`${lap.lap}-${lap.time}`}>
                  <td>{lap.lap}</td>
                  <td>{formatTime(lap.time)}</td>
                  <td>
                    <span className={`lap-pace lap-pace-${lap.paceLabel?.toLowerCase() ?? "baseline"}`}>
                      {lap.paceLabel ?? "Baseline"}
                    </span>
                  </td>
                  <td>{Math.round(lap.topSpeed)} km/h</td>
                  <td>{Math.round(lap.topBrake)}%</td>
                  <td>{lap.topG.toFixed(2)} g</td>
                  <td>{Math.round(lap.averageSpeed)} km/h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
