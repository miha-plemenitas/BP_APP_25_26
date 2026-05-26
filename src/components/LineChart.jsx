import { clamp } from '../utils/math.js';

export default function LineChart({ history, series }) {
  const width = 320;
  const height = 112;
  const paths = series.map((item) => {
    const points = history.map((sample, index) => {
      const x = history.length === 1 ? 0 : (index / (history.length - 1)) * width;
      const y = height - (clamp(sample[item.key], 0, item.max) / item.max) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return { ...item, points: points.join(' ') };
  });

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <line x1="0" x2={width} y1={height * 0.5} y2={height * 0.5} className="chart-guide" />
        <line x1="0" x2={width} y1={height * 0.75} y2={height * 0.75} className="chart-guide" />
        {paths.map((path) => (
          <polyline key={path.key} points={path.points} fill="none" stroke={path.color} strokeWidth="3" strokeLinecap="round" />
        ))}
      </svg>
      <div className="chart-legend">
        {series.map((item) => (
          <span key={item.key}>
            <i style={{ background: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
