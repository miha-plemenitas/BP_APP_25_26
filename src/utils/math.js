export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function interpolatePoint(points, progress) {
  const closed = [...points, points[0]];
  const scaled = progress * points.length;
  const index = Math.floor(scaled) % points.length;
  const local = scaled - Math.floor(scaled);
  const [x1, y1] = closed[index];
  const [x2, y2] = closed[index + 1];

  return {
    x: x1 + (x2 - x1) * local,
    y: y1 + (y2 - y1) * local,
  };
}

export function interpolatePose(points, progress) {
  const closed = [...points, points[0]];
  const scaled = progress * points.length;
  const index = Math.floor(scaled) % points.length;
  const local = scaled - Math.floor(scaled);
  const [x1, y1] = closed[index];
  const [x2, y2] = closed[index + 1];
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI) + 90;

  return {
    x: x1 + (x2 - x1) * local,
    y: y1 + (y2 - y1) * local,
    angle,
  };
}

export function pointsToPath(points) {
  return `${points.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`).join(" ")} Z`;
}
