"use client";

import { useState } from "react";
import Header from "./components/Header";
import BusFinder from "./components/BusFinder";
import Settings from "./components/Settings";

export default function Home() {
  // Radius in meters (default: 250m)
  const [radiusMeters, setRadiusMeters] = useState(250);
  // Settings toggle
  const [showSettings, setShowSettings] = useState(false);

  const handleApplySettings = (newRadius: number) => {
    setRadiusMeters(newRadius);
  };

  return (
    <div className="flex h-screen justify-center overflow-hidden">
     <main className="w-full md:max-w-6xl flex flex-col md:px-6 rounded-lgh-full overflow-hidden">
        {/* Header */}
        <Header
          showSettings={showSettings}
          setShowSettings={setShowSettings}
        />

        {/* Conditional rendering: Settings or BusFinder */}
        {showSettings ? (
          <Settings radiusMeters={radiusMeters} onApply={handleApplySettings} />
        ) : (
          <BusFinder radiusMeters={radiusMeters} />
        )}
      </main>
    </div>
  );
}
