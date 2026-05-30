import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import BarSummary from "../components/BarSummary.jsx";
import Button from "../components/ui/Button.jsx";
import GForceGyro from "../components/GForceGyro.jsx";
import LapTable from "../components/LapTable.jsx";
import StatCards from "../components/StatCards.jsx";
import TelemetryCharts from "../components/TelemetryCharts.jsx";
import TrackMap from "../components/TrackMap.jsx";
import {
  createNextSample,
  HISTORY_LIMIT,
  initialSample,
  TICK_MS,
} from "../simulation/telemetry.js";

export default function Dashboard({ onReset }) {
  const [sample, setSample] = useState(initialSample);
  const [history, setHistory] = useState([initialSample]);
  const [laps, setLaps] = useState([]);
  const lastTick = useRef(performance.now());

  useEffect(() => {
    lastTick.current = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const elapsed = (now - lastTick.current) / 1000;
      lastTick.current = now;

      setSample((previous) => {
        const next = createNextSample(previous, elapsed);

        if (next.completedLapSummary) {
          setLaps((current) => {
            if (current[0]?.lap === next.completedLapSummary.lap) {
              return current;
            }

            return [next.completedLapSummary, ...current].slice(0, 8);
          });
        }

        setHistory((current) => [...current.slice(-(HISTORY_LIMIT - 1)), next]);
        return next;
      });
    }, TICK_MS);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <p className="eyebrow">GridGhost live session</p>
          <h1>Raceland telemetry grid</h1>
          <p className="dashboard-lead">
            A ghost line, live marker, and track-aware telemetry built to feel
            like one system.
          </p>
        </div>
        <Button variant="outline" onClick={onReset}>
          <RotateCcw size={18} />
          New Race
        </Button>
      </header>

      <div id="overview">
        <StatCards sample={sample} />
      </div>

      <section className="dashboard-grid" id="track">
        <TrackMap sample={sample} />
        <div className="telemetry-stack" id="telemetry">
          <TelemetryCharts history={history} />
          <BarSummary sample={sample} />
        </div>
        <GForceGyro sample={sample} />
      </section>

      <section id="laps">
        <LapTable laps={laps} currentSample={sample} />
      </section>
    </main>
  );
}
