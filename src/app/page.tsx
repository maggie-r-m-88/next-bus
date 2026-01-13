"use client";

import { useState, useMemo } from "react";
import NearbyStops from "./components/NearbyStops";
import dynamic from "next/dynamic";
import stops from "@/resources/madrid_emt_stops.json";
import type { Stop, NormalizedStop } from "../types/stop";

const DynamicMap = dynamic(() => import("./components/Map"), {
  loading: () => <p>Loading map...</p>,
  ssr: false,
});

// Haversine formula (meters)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function Home() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stopsWithArrivals, setStopsWithArrivals] = useState<NormalizedStop[]>([]);
  const radiusMeters = 300;

  // Nearby stops based on user location
  const nearbyStops = useMemo(() => {
    if (!coords) return [];
    return stops
      .map((s) => ({
        ...s,
        distance: getDistance(coords.lat, coords.lon, s.stop_lat, s.stop_lon),
      }))
      .filter((s) => s.distance! <= radiusMeters)
      .sort((a, b) => a.distance! - b.distance!);
  }, [coords]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const userCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setCoords(userCoords);
        setLoading(false);

        // Fetch arrivals for nearby stops
        if (nearbyStops.length === 0) return;

        try {
          const res = await fetch("/api/emt/arrivals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              stopIds: nearbyStops.map((s) => s.stop_id),
            }),
          });

          if (!res.ok) throw new Error("Failed to fetch arrivals");

          const data: NormalizedStop[] = await res.json();
          console.log("Normalized arrivals:", data);

          setStopsWithArrivals(data);
        } catch (err) {
          console.error("Arrival fetch error", err);
          setError("Failed to fetch arrivals");
        }
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

        {/* Nearby stops table */}
        {stopsWithArrivals.length > 0 && (
          <NearbyStops stops={stopsWithArrivals} />
        )}

        {/* Map (commented for now) */}
        {/*
        {stopsWithArrivals.length > 0 && (
          <div className="w-full max-w-3xl h-[500px] mt-6">
            <DynamicMap
              userPosition={coords ? [coords.lat, coords.lon] : [0, 0]}
              stops={stopsWithArrivals}
            />
          </div>
        )}
        */}
      </main>
    </div>
  );
}
