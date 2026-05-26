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
  completedLap: false,
  completedLapSummary: null,
};

function getTrack() {
  return racelandKrsko;
}

function buildSegments(track) {
  const segmentCount = 9;
  const speedProfile = [108, 56, 66, 102, 58, 64, 111, 73, 61];
  const throttleProfile = [94, 14, 40, 90, 15, 34, 96, 74, 46];
  const brakeProfile = [3, 92, 22, 5, 89, 26, 4, 12, 20];
  const lateralProfile = [0.18, 0.88, 1.42, 0.24, 1.28, 1.12, 1.5, 0.2, 1.22];
  const directionProfile = [1, 1, 1, -1, -1, -1, 1, 1, 1];

  return Array.from({ length: segmentCount }, (_, index) => {
    const start = index / segmentCount;
    const end = (index + 1) / segmentCount;
    return {
      start,
      end,
      type: index % 3 === 0 ? "straight" : index % 3 === 1 ? "brake" : "corner",
      maxSpeed: speedProfile[index],
      throttle: throttleProfile[index],
      brake: brakeProfile[index],
      lateral: lateralProfile[index],
      direction: directionProfile[index],
    };
  });
}

function getSegment(progress, segments) {
  return segments.find((segment) => progress >= segment.start && progress < segment.end) ?? segments[0];
}

function segmentIntensity(segment, progress) {
  const span = Math.max(segment.end - segment.start, 0.01);
  const local = clamp((progress - segment.start) / span, 0, 1);
  return Math.sin(local * Math.PI);
}

function getTelemetryTargets(segment, progress, previousSpeed) {
  const intensity = segmentIntensity(segment, progress);
  const speedDrop = segment.type === "straight" ? 0 : intensity * 8;
  const targetSpeed = segment.maxSpeed - speedDrop;
  const speed = previousSpeed === 0 ? targetSpeed * 0.72 : previousSpeed + (targetSpeed - previousSpeed) * 0.2;
  const brakingDelta = Math.max(previousSpeed - speed, 0);
  const accelerationDelta = Math.max(speed - previousSpeed, 0);
  const throttle = clamp(segment.throttle + accelerationDelta * 2.8 - segment.brake * 0.14, 0, 100);
  const brake = clamp(segment.brake + brakingDelta * 4.6, 0, 100);
  const lateralG = segment.direction * clamp((speed / 95) * segment.lateral + intensity * 0.18, 0, 1.9);
  const longitudinalG = clamp(accelerationDelta * 0.07 - brakingDelta * 0.12, -1.35, 0.75);

  return { speed, throttle, brake, lateralG, longitudinalG };
}

export function createNextSample(previous, elapsedSeconds) {
  const track = getTrack();
  const segments = buildSegments(track);
  const segment = getSegment(previous.progress, segments);
  const targets = getTelemetryTargets(segment, previous.progress, previous.speed);
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
    completedLap,
    completedLapSummary,
  };
}

export function createLapSummary(lapState) {
  return {
    lap: lapState.lap,
    time: lapState.lapTime,
    topSpeed: lapState.lapTopSpeed,
    topBrake: lapState.lapTopBrake,
    topG: lapState.lapTopG,
    averageSpeed: getTrack().lengthKm / (lapState.lapTime / 3600),
  };
}
