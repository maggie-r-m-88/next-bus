"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import stops from "@/resources/madrid_emt_stops.json";
import type { Stop, NormalizedStop } from "@/types/stop";
import NearbyStops from "./components/NearbyStops";

const DynamicMap = dynamic(() => import("./components/Map"), {
  loading: () => <p>Loading map...</p>,
  ssr: false,
});

const RADIUS_METERS = 200;

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
  const [activeTab, setActiveTab] = useState<"map" | "stops">("map");

  const [stopsWithArrivals, setStopsWithArrivals] = useState<NormalizedStop[]>([]);

  /* -------------------------------------------------------
   0. Authenticate with EMT on page load (warm token)
------------------------------------------------------- */
  useEffect(() => {
    const authenticate = async () => {
      try {
        const res = await fetch("/api/emt/auth");
        if (!res.ok) {
          console.warn("EMT auth failed on page load");
        }
      } catch (err) {
        console.warn("EMT auth error:", err);
      }
    };

    authenticate();
  }, []);

  /* -------------------------------------------------------
     1. Compute nearby stops (PURE, synchronous)
  ------------------------------------------------------- */
  const nearbyStops = useMemo(() => {
    if (!coords) return [];

    return stops
      .map((s) => ({
        ...s,
        distance: getDistance(coords.lat, coords.lon, s.stop_lat, s.stop_lon),
      }))
      .filter((s) => s.distance! <= RADIUS_METERS)
      .sort((a, b) => a.distance! - b.distance!);
  }, [coords]);

  /* -------------------------------------------------------
     2. Fetch arrivals AFTER nearbyStops exists
  ------------------------------------------------------- */
  useEffect(() => {
    if (nearbyStops.length === 0) return;

    const fetchArrivals = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/emt/arrivals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stopIds: nearbyStops.map((s) => s.stop_id),
          }),
        });

        console.log(res);

        if (!res.ok) throw new Error("Failed to fetch arrivals");

        const data: NormalizedStop[] = await res.json();
        setStopsWithArrivals(data);
        console.log(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch arrivals");
      } finally {
        setLoading(false);
      }
    };

    fetchArrivals();
  }, [nearbyStops]);

  /* -------------------------------------------------------
     3. Button handler = LOCATION ONLY
  ------------------------------------------------------- */
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setError("");
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      () => {
        setError("Unable to retrieve your location");
        setLoading(false);
      }
    );
  };

  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full md:max-w-6xl flex flex-col py-8 md:px-6 bg-white dark:bg-black rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex w-full justify-between items-center px-2 md:px-6 mt-4">
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
            NEXT BUS
          </h1>

          <button
            onClick={handleUseMyLocation}
            disabled={loading}
            className="flex items-center gap-2 rounded-full bg-[var(--brand-blue)] px-4 py-2 text-white text-base md:text-lg shadow-sm hover:bg-indigo-500 font-semibold disabled:opacity-60"
          >
            {loading ? "Loading…" : "Find Nearby Stops"}
          </button>
        </div>

        {error && <p className="text-red-600 px-6">{error}</p>}

        {/* Tabs */}
        <div className="flex mt-4 border-b border-gray-300 px-2 md:px-6">
          <button
            onClick={() => setActiveTab("map")}
            className={`px-4 py-2 -mb-px font-medium ${activeTab === "map"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
              }`}
          >
            Map
          </button>
          <button
            onClick={() => setActiveTab("stops")}
            className={`px-4 py-2 -mb-px font-medium ${activeTab === "stops"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
              }`}
          >
            List
          </button>
        </div>

        {/* Content */}
        {coords && activeTab === "map" && (
          <div className="w-full h-full">
            <DynamicMap userPosition={[coords.lat, coords.lon]} />
          </div>
        )}

        {coords && activeTab === "stops" && (
          <div className="w-full px-2 md:px-6 bg-[#ecf1f7] pt-4 md:pt-8">
            {loading ? (
              <p className="text-gray-500">Loading arrivals…</p>
            ) : stopsWithArrivals.length === 0 ? (
              <p className="text-gray-500">No nearby stops found.</p>
            ) : (
              <NearbyStops stops={stopsWithArrivals} />
            )}
          </div>
        )}

      </main>
    </div>
  );
}
