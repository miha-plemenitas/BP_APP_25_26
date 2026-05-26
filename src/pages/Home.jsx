import { Play } from "lucide-react";
import TrackPreview from "../components/TrackPreview.jsx";
import Button from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";

export default function Home({ onStart }) {
  return (
    <main className="home-shell">
      <section className="home-hero" aria-label="Raceland race start">
        <div className="home-copy">
          <p className="eyebrow">Live simulated telemetry</p>
          <h1>Raceland</h1>
          <p className="home-lead">
            Track the racing line, driver position, pedal pressure, g-force, and
            lap performance in one cockpit-style dashboard.
          </p>
          <Button onClick={onStart}>
            <Play size={20} />
            Start Race
          </Button>
        </div>
        <Card className="home-preview-card">
          <TrackPreview />
        </Card>
      </section>
    </main>
  );
}
