"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("./components/Map"), {
  loading: () => <p>Loading map...</p>,
  ssr: false,
});

export default function Home() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLoading(false);
      },
      () => {
        setError("Unable to retrieve your location");
        setLoading(false);
      }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-6xl flex flex-col items-center gap-6 py-32 px-16 bg-white dark:bg-black rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-black dark:text-zinc-50">
          EMT ETAs Near Me
        </h1>

        <button
          onClick={handleUseMyLocation}
          disabled={loading}
          className="mt-4 flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white text-lg shadow-sm hover:bg-blue-700"
        >
          {loading ? "Locating..." : "Find Nearby Stops"}
        </button>

        {error && <p className="text-red-600 mt-2">{error}</p>}

        {coords && (
          <div className="w-full max-w-3xl h-[500px] mt-6">
            <DynamicMap userPosition={[coords.lat, coords.lon]} />
          </div>
        )}
      </main>
    </div>
  );
}
