"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import NearbyStops from "./components/NearbyStops";

// Dynamically import MapView to prevent server-side errors
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
    setCoords(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Unable to retrieve your location");
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black font-sans">
      <main className="flex flex-col items-center gap-6 py-32 px-16 bg-white dark:bg-black sm:items-center w-full max-w-6xl rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 text-center">
          EMT ETAs Near Me
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 text-center w-full">
          Click the button below to find buses arriving closest to you in real-time.
        </p>

        <button
          onClick={handleUseMyLocation}
          disabled={loading}
          className="mt-6 flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white text-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19.5 10.5c0 7.5-7.5 12-7.5 12s-7.5-4.5-7.5-12a7.5 7.5 0 1115 0z"
            />
          </svg>
          {loading ? "Locating..." : "Find Nearby Stops"}
        </button>

        {error && (
          <p className="mt-4 text-red-600 dark:text-red-400 text-center">{error}</p>
        )}

        {coords && <NearbyStops lat={coords.lat} lon={coords.lon} radiusMeters={300} />}

       {coords && (
  <div className="w-full max-w-3xl mt-6 border rounded-lg h-[500px]">
    <DynamicMap userPosition={[coords.lat, coords.lon]} />
  </div>
)}


      </main>
    </div>
  );
}
