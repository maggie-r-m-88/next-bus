"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import stops from "@/resources/madrid_emt_stops.json";
import NearbyStops from "./components/NearbyStops";
import type { Stop } from "@/types/stop";



const DynamicMap = dynamic(() => import("./components/Map"), {
  loading: () => <p>Loading map...</p>,
  ssr: false,
});

// Haversine distance (meters)
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
  const [arrivals, setArrivals] = useState<Record<number, any>>({});
  const [arrivalsLoading, setArrivalsLoading] = useState(false);

  const radiusMeters = 300;

  const nearbyStops: Stop[] = useMemo(() => {
    if (!coords) return [];

    return stops
      .map((stop: Stop) => ({
        ...stop,
        distance: getDistance(coords.lat, coords.lon, stop.stop_lat, stop.stop_lon),
      }))
      .filter((stop) => stop.distance! <= radiusMeters)
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
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setLoading(false);
      },
      () => {
        setError("Unable to retrieve your location");
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    fetch("/api/emt/auth")
      .then((res) => res.json())
      .then((data) => {
        console.log("EMT token ready");
      })
      .catch(() => {
        console.error("Failed to authenticate EMT API");
      });
  }, []);

  useEffect(() => {
    if (nearbyStops.length === 0) return;

    const fetchArrivals = async () => {
      setArrivalsLoading(true);

      try {
        const res = await fetch("/api/emt/arrivals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stopIds: nearbyStops.map((s) => s.stop_id),
          }),
        });

        if (!res.ok) throw new Error("Failed to fetch arrivals");

        const data = await res.json();

        console.log("Arrivals data:", data);
        setArrivals(data);
      } catch (err) {
        console.error("Arrival fetch error", err);
      } finally {
        setArrivalsLoading(false);
      }
    };

    fetchArrivals();
  }, [nearbyStops]);


  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-6xl flex flex-col items-center gap-6 py-32 px-16 bg-white dark:bg-black rounded-lg shadow-lg">

        <h1 className="text-3xl font-semibold">EMT ETAs Near Me</h1>

        <button
          onClick={handleUseMyLocation}
          disabled={loading}
          className="rounded-full bg-blue-600 px-6 py-3 text-white"
        >
          {loading ? "Locating..." : "Find Nearby Stops"}
        </button>

        {error && <p className="text-red-600">{error}</p>}

        {coords && (
          <>
            <NearbyStops stops={nearbyStops} />

            <div className="w-full max-w-3xl h-[500px] mt-6">
              <DynamicMap
                userPosition={[coords.lat, coords.lon]}
                stops={nearbyStops}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
