import { useState } from "react";
import AppHeader from "./components/AppHeader.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Home from "./pages/Home.jsx";

export default function App() {
  const [view, setView] = useState("home");

  return (
    <>
      <AppHeader activeView={view} onNavigate={setView} />
      {view === "dashboard" ? (
        <Dashboard onReset={() => setView("home")} />
      ) : (
        <Home onStart={() => setView("dashboard")} />
      )}
    </>
  );
}
