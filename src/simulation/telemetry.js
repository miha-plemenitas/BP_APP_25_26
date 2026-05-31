import { racelandKrsko } from "../data/tracks.js";
import { clamp } from "../utils/math.js";

export const TICK_MS = 90;
export const HISTORY_LIMIT = 90;

export const initialSample = {
  lap: 1,
  progress: 0,
  speed: 0,
  throttle: 0,
  brake: 0,
  lateralG: 0,
  longitudinalG: 0,
  lapTime: 0,
  totalTime: 0,
  lapTopSpeed: 0,
  lapTopBrake: 0,
  lapTopG: 0,
  topSpeed: 0,
  topBrake: 0,
  topG: 0,
  lapBias: 1,
  paceLabel: "Baseline",
  paceDelta: 0,
  completedLap: false,
  completedLapSummary: null,
};

function getTrack() {
  return racelandKrsko;
}

function getSimulationOutline(track) {
  return track.reverseOutline ?? [...track.outline].reverse();
}

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function normalizeAngle(angle) {
  let result = angle;

  while (result <= -Math.PI) {
    result += Math.PI * 2;
  }

  while (result > Math.PI) {
    result -= Math.PI * 2;
  }

  return result;
}

function buildSegments(track) {
  const points = getSimulationOutline(track);
  const total = points.length;
  const closed = [...points, points[0], points[1]];

  return points.map((_, index) => {
    const prev = closed[index];
    const current = closed[index + 1];
    const next = closed[index + 2];

    const inbound = Math.atan2(current[1] - prev[1], current[0] - prev[0]);
    const outbound = Math.atan2(next[1] - current[1], next[0] - current[0]);
    const turn = normalizeAngle(outbound - inbound);
    const curvature = clamp(Math.abs(turn) / toRadians(95), 0, 1);
    const direction = turn === 0 ? 1 : Math.sign(turn);
    const baseSpeed = 96 - curvature * 34 - (curvature > 0.8 ? 4 : 0);

    return {
      index,
      start: index / total,
      end: (index + 1) / total,
      curvature,
      direction,
      baseSpeed: clamp(baseSpeed, 40, 96),
      baseThrottle: clamp(88 - curvature * 54, 18, 88),
      baseBrake: clamp(38 + curvature * 34, 34, 88),
      baseLateral: clamp(0.16 + curvature * 1.3, 0.16, 1.65),
    };
  });
}

function getSegment(progress, segments) {
  return segments.find((segment) => progress >= segment.start && progress < segment.end) ?? segments[0];
}

function getNextSegment(segment, segments) {
  return segments[(segment.index + 1) % segments.length];
}

function getLapPaceFactor(lap) {
  if (lap <= 1) {
    return 1;
  }

  const swing = 0.05 + Math.min(Math.floor((lap - 2) / 2) * 0.008, 0.03);
  return lap % 2 === 0 ? 1 - swing : 1 + swing;
}

function segmentIntensity(segment, progress) {
  const span = Math.max(segment.end - segment.start, 0.01);
  const local = clamp((progress - segment.start) / span, 0, 1);
  return Math.sin(local * Math.PI);
}

function getTelemetryTargets(segment, nextSegment, progress, previousSpeed, lapBias) {
  const intensity = segmentIntensity(segment, progress);
  const approach = 1 - Math.abs(0.5 - intensity) * 2;
  const cornerPressure = clamp(segment.curvature * 0.75 + nextSegment.curvature * 0.25, 0, 1);
  const targetSpeed = clamp(
    (segment.baseSpeed - approach * cornerPressure * 8 - nextSegment.curvature * 5) * lapBias,
    38,
    96,
  );
  const speed = previousSpeed === 0
    ? targetSpeed * 0.72
    : previousSpeed + (targetSpeed - previousSpeed) * 0.18;
  const speedDelta = speed - previousSpeed;
  const brakingDelta = Math.max(-speedDelta, 0);
  const accelerationDelta = Math.max(speedDelta, 0);
  const lapOffset = lapBias - 1;
  const throttleBias = clamp(
    segment.baseThrottle * 0.24 + (1 - cornerPressure) * 36 + accelerationDelta * 3.8 + lapOffset * 14,
    0,
    100,
  );
  const brakeBias = clamp(
    segment.baseBrake * 0.22 + cornerPressure * 42 + brakingDelta * 7.2 - lapOffset * 10,
    0,
    100,
  );
  const accelPhase = clamp((accelerationDelta / 8) + (1 - cornerPressure) * 0.55 + (1 - approach) * 0.2, 0, 1);
  const brakePhase = clamp((brakingDelta / 8) + cornerPressure * 0.7 + approach * 0.2, 0, 1);
  let throttle = clamp(
    throttleBias + accelPhase * 52 - brakePhase * 74 - nextSegment.curvature * 7,
    0,
    100,
  );
  let brake = clamp(
    brakeBias + brakePhase * 62 - accelPhase * 58 + nextSegment.curvature * 10,
    0,
    100,
  );

  const overlap = Math.min(throttle, brake);
  if (overlap > 8) {
    if (brake >= throttle) {
      throttle = clamp(throttle - overlap * 0.85, 0, 100);
    } else {
      brake = clamp(brake - overlap * 0.85, 0, 100);
    }
  }

  if (brake > 18 && throttle > 18) {
    if (brakePhase >= accelPhase) {
      throttle = clamp(throttle * 0.35, 0, 100);
    } else {
      brake = clamp(brake * 0.35, 0, 100);
    }
  }

  const lateralG = segment.direction * clamp(
    (speed / 100) * segment.baseLateral + intensity * segment.curvature * 0.36 + lapOffset * 0.1,
    0,
    1.7,
  );
  const longitudinalG = clamp(accelerationDelta * 0.058 - brakingDelta * 0.13, -1.3, 0.62);

  return { speed, throttle, brake, lateralG, longitudinalG };
}

export function createNextSample(previous, elapsedSeconds) {
  const track = getTrack();
  const segments = buildSegments(track);
  const segment = getSegment(previous.progress, segments);
  const nextSegment = getNextSegment(segment, segments);
  const lapBias = getLapPaceFactor(previous.lap);
  const targets = getTelemetryTargets(segment, nextSegment, previous.progress, previous.speed, lapBias);
  const progressGain = (targets.speed / (track.lengthKm * 3600)) * elapsedSeconds;
  const rawProgress = previous.progress + progressGain;
  const completedLap = rawProgress >= 1;
  const progress = rawProgress % 1;
  const lapTime = previous.lapTime + elapsedSeconds;
  const sampleG = Math.max(Math.abs(targets.lateralG), Math.abs(targets.longitudinalG));
  const lapTopSpeed = Math.max(previous.lapTopSpeed, targets.speed);
  const lapTopBrake = Math.max(previous.lapTopBrake, targets.brake);
  const lapTopG = Math.max(previous.lapTopG, sampleG);
  const completedLapSummary = completedLap
    ? createLapSummary({
        lap: previous.lap,
        lapTime,
        lapTopSpeed,
        lapTopBrake,
        lapTopG,
      })
    : null;

  return {
    lap: completedLap ? previous.lap + 1 : previous.lap,
    progress,
    speed: targets.speed,
    throttle: targets.throttle,
    brake: targets.brake,
    lateralG: targets.lateralG,
    longitudinalG: targets.longitudinalG,
    lapTime: completedLap ? 0 : lapTime,
    totalTime: previous.totalTime + elapsedSeconds,
    lapTopSpeed: completedLap ? targets.speed : lapTopSpeed,
    lapTopBrake: completedLap ? targets.brake : lapTopBrake,
    lapTopG: completedLap ? sampleG : lapTopG,
    topSpeed: completedLap ? targets.speed : lapTopSpeed,
    topBrake: completedLap ? targets.brake : lapTopBrake,
    topG: completedLap ? sampleG : lapTopG,
    lapBias,
    paceLabel: previous.lap === 1 ? "Baseline" : previous.lap % 2 === 0 ? "Slower" : "Faster",
    paceDelta: Number(((lapBias - 1) * 100).toFixed(1)),
    completedLap,
    completedLapSummary,
  };
}

export function createLapSummary(lapState) {
  const paceLabel = lapState.lap === 1 ? "Baseline" : lapState.lap % 2 === 0 ? "Slower" : "Faster";
  const paceDelta = ((lapState.lapBias - 1) * 100).toFixed(1);

  return {
    lap: lapState.lap,
    time: lapState.lapTime,
    topSpeed: lapState.lapTopSpeed,
    topBrake: lapState.lapTopBrake,
    topG: lapState.lapTopG,
    averageSpeed: getTrack().lengthKm / (lapState.lapTime / 3600),
    paceLabel,
    paceDelta: Number(paceDelta),
  };
}
