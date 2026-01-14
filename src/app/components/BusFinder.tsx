"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import stops from "@/resources/madrid_emt_stops.json";
import type { NormalizedStop } from "@/types/stop";
import NearbyStops from "./NearbyStops";

const DynamicMap = dynamic(() => import("./Map"), {
    loading: () => <p>Loading map...</p>,
    ssr: false,
});

const RADIUS_METERS = 200;

// Haversine formula
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

export default function BusFinder() {
    const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<"map" | "stops">("map");
    const [stopsWithArrivals, setStopsWithArrivals] = useState<NormalizedStop[]>([]);

    // Authenticate on load
    useEffect(() => {
        const authenticate = async () => {
            try {
                await fetch("/api/emt/auth");
            } catch (err) {
                console.warn("EMT auth error:", err);
            }
        };
        authenticate();
    }, []);

    // Auto-fetch location on mount
    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation not supported");
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
                setLoading(false);
            },
            () => {
                setError("Unable to retrieve your location. Click the button to retry.");
                setLoading(false);
            },
            { enableHighAccuracy: true }
        );
    }, []);

    // Nearby stops
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

    // Fetch arrivals
    useEffect(() => {
        if (nearbyStops.length === 0) {
            if (coords) setStopsWithArrivals([]);
            return;
        }

        const fetchArrivals = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/emt/arrivals", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ stopIds: nearbyStops.map((s) => s.stop_id) }),
                });

                if (!res.ok) throw new Error("Failed to fetch arrivals");

                const data: NormalizedStop[] = await res.json();
                setStopsWithArrivals(data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch arrivals");
            } finally {
                setLoading(false);
            }
        };

        fetchArrivals();
    }, [nearbyStops, coords]);

    // Refetch location
    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation not supported");
            return;
        }

        setError("");
        setLoading(true);
        setStopsWithArrivals([]);
        setCoords(null);

        navigator.geolocation.getCurrentPosition(
            (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
            () => {
                setError("Unable to retrieve your location");
                setLoading(false);
            },
            { enableHighAccuracy: true }
        );
    };

    return (
        <div className="flex flex-col flex-1">
            {/* Fixed Tabs & Button - not sticky, just fixed position */}
            <div className=" sticky top-0 flex-shrink-0 bg-white dark:bg-black px-2 md:px-6 border-b border-gray-200 z-40">
                <div className="flex items-center justify-between py-2">
                    {/* Left: Tabs */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab("map")}
                            className={`px-4 py-2 -mb-px font-medium ${activeTab === "map"
                                    ? "border-b-3 border-[var(--brand-blue)] text-blue-600 font-semibold"
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

                    {/* Right: Button */}
                    <button
                        onClick={handleUseMyLocation}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-full bg-[var(--brand-blue)] px-4 py-2 text-white text-base md:text-lg shadow-sm hover:bg-indigo-500 font-semibold disabled:opacity-60"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z" />
                        </svg>
                        {loading ? "Loading…" : "Buses Near Me"}
                    </button>
                </div>
            </div>

            {/* Content area - takes remaining space */}
            <div className="flex-1 min-h-0">
                {coords && activeTab === "map" && (
                    <div className="h-full w-full">
                        <DynamicMap
                            userPosition={[coords.lat, coords.lon]}
                            stops={stopsWithArrivals.map((s) => ({
                                ...s,
                                stop_id: Number(s.stop_id),
                                lat: s.lat,
                                lon: s.lon,
                            }))}
                        />
                    </div>
                )}

                {coords && activeTab === "stops" && (
                    <div className="h-full overflow-y-auto px-3 md:px-8 bg-[#ecf1f7] py-3 md:py-8">
                        {loading ? (
                            <p className="text-gray-500">Loading arrivals…</p>
                        ) : stopsWithArrivals.length === 0 ? (
                            <p className="text-gray-500">No nearby stops found.</p>
                        ) : (
                            <NearbyStops stops={stopsWithArrivals} />
                        )}
                    </div>
                )}
            </div>
        </div>

    );
}
