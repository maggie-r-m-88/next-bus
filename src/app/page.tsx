"use client";

import { useState } from "react";
import Header from "./components/Header";
import BusFinder from "./components/BusFinder";

export default function Home() {
  const [radiusMeters, setRadiusMeters] = useState(250);

  return (
    <div className="flex h-screen justify-center overflow-hidden">
     <main className="w-full md:max-w-6xl flex flex-col md:px-6 rounded-lgh-full overflow-hidden">
        {/* Header */}
        <Header radiusMeters={radiusMeters} setRadiusMeters={setRadiusMeters} />

        {/* Main bus finder component */}
      <BusFinder radiusMeters={radiusMeters} />
      </main>
    </div>
  );
}
