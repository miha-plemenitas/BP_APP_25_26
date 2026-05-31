import { Play } from "lucide-react";
import TrackPreview from "../components/TrackPreview.jsx";
import Button from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";

export default function Home({ onStart }) {
  return (
    <main className="home-shell">
      <section className="home-hero" aria-label="GridGhost Raceland race start">
        <div className="home-copy">
          <p className="eyebrow">GridGhost / live telemetry</p>
          <h1>Raceland Krsko, rendered like a pulse.</h1>
          <p className="home-lead">
            Follow the ghost line, watch the marker breathe through the lap, and
            compare every run with believable pace swings across the same
            Raceland circuit.
          </p>
          <div className="home-actions">
            <Button onClick={onStart}>
              <Play size={20} />
              Start Session
            </Button>
            <span className="home-chip">Raceland only</span>
          </div>
        </div>
        <Card className="home-preview-card">
          <div className="preview-copy">
            <span>Track ghost</span>
            <strong>SVG line source</strong>
          </div>
          <TrackPreview />
        </Card>
      </section>
    </main>
  );
}
