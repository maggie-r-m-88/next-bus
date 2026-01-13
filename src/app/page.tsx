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
  const [activeTab, setActiveTab] = useState<"map" | "stops">("map");

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
    <div className="flex min-h-screen justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full md:max-w-6xl flex flex-col gap-6 py-8 md:px-6 bg-white dark:bg-black rounded-lg shadow-lg">
        {/* Header row: title left, button right */}
        <div className="flex w-full justify-between items-center px-2 md:px-6 mt-4">
          <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
            NEXT BUS
          </h1>

          <button
            onClick={handleUseMyLocation}
            disabled={loading}
            className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-white text-md md:text-lg shadow-sm hover:bg-blue-700 font-semibold"
          >
            {loading ? "Locating..." : "Find Nearby Stops"}
          </button>
        </div>

        {error && <p className="text-red-600 mt-2">{error}</p>}

        {/* Tabs */}
        <div className="flex mt-4 border-b border-gray-300">
          <button
            onClick={() => setActiveTab("map")}
            className={`px-4 py-2 -mb-px font-medium ${
              activeTab === "map"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setActiveTab("stops")}
            className={`px-4 py-2 -mb-px font-medium ${
              activeTab === "stops"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            List
          </button>
        </div>

        {/* Content */}
        {coords && activeTab === "map" && (
          <div className="w-full h-full mt-[-20px]">
            <DynamicMap userPosition={[coords.lat, coords.lon]} />
          </div>
        )}

        {/* Commented out for now */}
        {/* {coords && activeTab === "stops" && (
          <div className="w-full mt-4">
            <NearbyStops stops={stopsWithArrivals} />
          </div>
        )} */}
      </main>
    </div>
  );
}
