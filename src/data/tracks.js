import outlineSvg from "../../outline_cropped.svg?raw";
import {
  extractSvgPathData,
  normalizePoints,
  parseSvgPathPoints,
  pointsToPath,
  projectPointsToGeo,
} from "../utils/trackGeometry.js";

const racelandKrskoPath = extractSvgPathData(outlineSvg);
const racelandKrskoPoints = parseSvgPathPoints(racelandKrskoPath);

export const racelandKrsko = {
  id: "raceland-krsko",
  name: "Raceland Krsko",
  location: "Krsko, Slovenia",
  lengthKm: 1.05,
  turns: 16,
  center: [15.535359, 45.93055],
  sourcePath: racelandKrskoPath,
  outline: racelandKrskoPoints,
  previewPath: pointsToPath(normalizePoints(racelandKrskoPoints)),
  geometry: {
    type: "LineString",
    coordinates: projectPointsToGeo(racelandKrskoPoints, [15.535359, 45.93055]),
  },
};

export const defaultTrackId = racelandKrsko.id;
