export function extractSvgPathData(svgText) {
  const match = svgText.match(/<path[^>]*\sd="([^"]+)"/i);

  if (!match) {
    throw new Error("Could not find track path in SVG.");
  }

  return match[1];
}

export function parseSvgPathPoints(pathData) {
  const tokens = pathData.match(/[A-Za-z]|-?\d*\.?\d+(?:e[+-]?\d+)?/gi) ?? [];
  const points = [];
  let index = 0;
  let command = null;
  let current = [0, 0];

  const readNumber = () => {
    const value = Number(tokens[index]);
    index += 1;
    return value;
  };

  while (index < tokens.length) {
    const token = tokens[index];

    if (/^[A-Za-z]$/.test(token)) {
      command = token;
      index += 1;
      if (command === "Z" || command === "z") {
        continue;
      }
    }

    if (!command) {
      index += 1;
      continue;
    }

    switch (command) {
      case "M":
      case "m": {
        const x = readNumber();
        const y = readNumber();
        current = command === "m" ? [current[0] + x, current[1] + y] : [x, y];
        points.push(current);
        command = command === "m" ? "l" : "L";
        break;
      }
      case "L":
      case "l": {
        const x = readNumber();
        const y = readNumber();
        current = command === "l" ? [current[0] + x, current[1] + y] : [x, y];
        points.push(current);
        break;
      }
      case "H":
      case "h": {
        const x = readNumber();
        current = command === "h" ? [current[0] + x, current[1]] : [x, current[1]];
        points.push(current);
        break;
      }
      case "V":
      case "v": {
        const y = readNumber();
        current = command === "v" ? [current[0], current[1] + y] : [current[0], y];
        points.push(current);
        break;
      }
      default: {
        index += 1;
        break;
      }
    }
  }

  if (points.length > 1) {
    const [firstX, firstY] = points[0];
    const [lastX, lastY] = points[points.length - 1];
    if (firstX === lastX && firstY === lastY) {
      points.pop();
    }
  }

  return points;
}

export function normalizePoints(points, padding = 10, size = 80) {
  if (points.length === 0) {
    return [];
  }

  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = maxX - minX || 1;
  const height = maxY - minY || 1;

  return points.map(([x, y]) => [
    padding + ((x - minX) / width) * size,
    padding + ((y - minY) / height) * size,
  ]);
}

export function pointsToPath(points) {
  if (points.length === 0) {
    return "";
  }

  return `${points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`)
    .join(" ")} Z`;
}

export function reversePoints(points) {
  return [...points].reverse();
}

export function projectPointsToGeo(points, center, lonSpan = 0.0023, latSpan = 0.0017) {
  if (points.length === 0) {
    return [];
  }

  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = maxX - minX || 1;
  const height = maxY - minY || 1;

  return points.map(([x, y]) => [
    center[0] + (((x - minX) / width) - 0.5) * lonSpan,
    center[1] - (((y - minY) / height) - 0.5) * latSpan,
  ]);
}

export function interpolatePose(points, progress) {
  if (points.length < 2) {
    return {
      coordinates: points[0] ?? [0, 0],
      bearing: 0,
    };
  }

  const closed = [...points, points[0]];
  const segments = [];
  let totalLength = 0;

  for (let index = 0; index < closed.length - 1; index += 1) {
    const [x1, y1] = closed[index];
    const [x2, y2] = closed[index + 1];
    const length = Math.hypot(x2 - x1, y2 - y1);
    segments.push({ start: closed[index], end: closed[index + 1], length });
    totalLength += length;
  }

  if (totalLength === 0) {
    return {
      coordinates: points[0],
      bearing: 0,
    };
  }

  const targetDistance = ((((progress % 1) + 1) % 1) * totalLength);
  let accumulated = 0;

  for (const segment of segments) {
    if (targetDistance <= accumulated + segment.length) {
      const local = segment.length === 0 ? 0 : (targetDistance - accumulated) / segment.length;
      const [x1, y1] = segment.start;
      const [x2, y2] = segment.end;
      const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI) + 90;

      return {
        coordinates: [x1 + (x2 - x1) * local, y1 + (y2 - y1) * local],
        bearing: angle,
      };
    }

    accumulated += segment.length;
  }

  const last = segments[segments.length - 1];
  const [x1, y1] = last.start;
  const [x2, y2] = last.end;

  return {
    coordinates: [x2, y2],
    bearing: Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI) + 90,
  };
}
