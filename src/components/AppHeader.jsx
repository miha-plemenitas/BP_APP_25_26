import { Gauge, Home } from 'lucide-react';

export default function AppHeader({ activeView, onNavigate }) {
  return (
    <nav className="app-header">
      <button className="app-brand" onClick={() => onNavigate('home')}>
        <span className="brand-mark">
          <img className="brand-mark-image" src="/icon.svg" alt="" aria-hidden="true" />
        </span>
        <span className="app-brand-copy">
          <strong>GridGhost</strong>
          <span>Raceland telemetry</span>
        </span>
      </button>
      <div className="nav-links" aria-label="Main navigation">
        <button
          className={activeView === 'home' ? 'is-active' : ''}
          onClick={() => onNavigate('home')}
        >
          <Home size={16} />
          Home
        </button>
        <button
          className={activeView === 'dashboard' ? 'is-active' : ''}
          onClick={() => onNavigate('dashboard')}
        >
          <Gauge size={16} />
          Dashboard
        </button>
      </div>
    </nav>
  );
}
