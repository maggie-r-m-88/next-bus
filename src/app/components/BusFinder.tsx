"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import stops from "@/resources/madrid_emt_stops.json";
import type { NormalizedStop } from "@/types/stop";
import NearbyStops from "./NearbyStops";
import OutOfArea from "./OutOfArea";

const DynamicMap = dynamic(() => import("./Map"), {
    loading: () => <p>Loading map...</p>,
    ssr: false,
});

// TEST MODE - Set to true to use static coordinates
const IS_TEST_MODE = false;
// Test coordinates (Madrid city center - Puerta del Sol)
const TEST_COORDS = { lat: 33.75, lon: 84.3 };

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

interface BusFinderProps {
    radiusMeters: number;
    onOpenSettings?: () => void;
}

export default function BusFinder({ radiusMeters, onOpenSettings }: BusFinderProps) {
    const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
        IS_TEST_MODE ? TEST_COORDS : null
    );
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

    // Auto-fetch location on mount (skip in test mode)
    useEffect(() => {
        if (IS_TEST_MODE) {
            console.log("🧪 Test mode enabled - using static coordinates:", TEST_COORDS);
            return; // Exit early - coords already set in initial state
        }

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

        const stopsWithDistance = stops.map((s) => ({
            ...s,
            distance: getDistance(coords.lat, coords.lon, s.stop_lat, s.stop_lon),
        }));

        const filtered = stopsWithDistance.filter((s) => s.distance! <= radiusMeters);

        if (IS_TEST_MODE) {
            console.log(`🧪 Test mode: Found ${filtered.length} stops within ${radiusMeters}m of`, coords);
            if (filtered.length === 0) {
                console.log("🧪 No stops found - this is expected for non-Madrid coordinates");
            }
        }

        return filtered.sort((a, b) => a.distance! - b.distance!);
    }, [coords, radiusMeters]);

    // Fetch arrivals
    useEffect(() => {
        if (nearbyStops.length === 0) {
            if (coords) {
                if (IS_TEST_MODE) {
                    console.log("🧪 Test mode: No nearby stops, clearing arrivals");
                }
                setStopsWithArrivals([]);
            }
            return;
        }

        const fetchArrivals = async () => {
            try {
                if (IS_TEST_MODE) {
                    console.log(`🧪 Test mode: Fetching arrivals for ${nearbyStops.length} stops`);
                }
                setLoading(true);
                const res = await fetch("/api/emt/arrivals", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ stopIds: nearbyStops.map((s) => s.stop_id) }),
                });

                if (!res.ok) throw new Error("Failed to fetch arrivals");

                const data: NormalizedStop[] = await res.json();
                if (IS_TEST_MODE) {
                    console.log(`🧪 Test mode: Received ${data.length} stops with arrivals`);
                }
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
    }, [nearbyStops, coords]);

    // Refetch location
    const handleUseMyLocation = () => {
        if (IS_TEST_MODE) {
            console.log("🧪 Test mode - refreshing with static coordinates");
            setStopsWithArrivals([]);
            // Force re-render by setting to null first, then to test coords
            setCoords(null);
            setTimeout(() => {
                setCoords(TEST_COORDS);
            }, 0);
            return;
        }

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

    const MapIcon = ({ className = "" }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" />
            <path d="M9 4v14" />
            <path d="M15 6v14" />
        </svg>
    );


    const ListIcon = ({ className = "" }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="5" cy="6" r="1.5" />
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="5" cy="18" r="1.5" />
            <line x1="9" y1="6" x2="21" y2="6" />
            <line x1="9" y1="12" x2="21" y2="12" />
            <line x1="9" y1="18" x2="21" y2="18" />
        </svg>
    );


    // Check if user is out of area (no nearby stops and coords are set)
    const isOutOfArea = coords && nearbyStops.length === 0 && !loading;

    // Check if there are any arrivals across all stops
    const hasAnyArrivals = stopsWithArrivals.some(stop => stop.arrivals && stop.arrivals.length > 0);

    return (


        <div className="flex flex-col flex-1 min-h-0">
            {/* Tabs + Button - Only show if in area */}
            {!isOutOfArea && (
                <div className="flex-shrink-0 z-40 px-2 md:px-0 py-2 touch-none">
                    <div className="flex items-center justify-between py-2">
                        {/* Left tabs */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab("map")}
                                className={`flex items-center gap-2 px-4 py-2 -mb-px font-medium text-base md:text-lg ${activeTab === "map"
                                        ? "border-b-3 border-[var(--brand-blue)] text-[var(--brand-blue)] font-semibold"
                                        : "text-gray-500 dark:text-gray-400"
                                    }`}
                            >
                                <MapIcon className="h-5 w-5" />
                                <span>Map</span>
                            </button>

                            <button
                                onClick={() => setActiveTab("stops")}
                                className={`flex items-center gap-2 px-4 py-2 -mb-px font-medium text-base md:text-lg ${activeTab === "stops"
                                        ? "border-b-3 border-[var(--brand-blue)] text-[var(--brand-blue)] font-semibold"
                                        : "text-gray-500 dark:text-gray-400"
                                    }`}
                            >
                                <ListIcon className="h-5 w-5" />
                                <span>List</span>
                            </button>

                        </div>

                        {/* Right button */}
                        <button
                            onClick={handleUseMyLocation}
                            disabled={loading}
                            className="flex items-center gap-2 rounded-md bg-[var(--brand-dark-blue)] px-4 py-2 text-white text-base md:text-lg shadow-sm hover:bg-[#3F425D] font-semibold disabled:opacity-60"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z" />
                            </svg>
                            {loading ? "Loading…" : IS_TEST_MODE ? "🧪 Test" : "Search"}
                        </button>
                    </div>
                </div>
            )}

            {/* Content area - flex-1 takes remaining space */}
            <div className="flex-1 min-h-0">
                {isOutOfArea ? (
                    <OutOfArea
                        onRetry={handleUseMyLocation}
                        isTestMode={IS_TEST_MODE}
                        onGoToSettings={onOpenSettings}
                    />
                ) : (
                    <>
                        {coords && activeTab === "map" && (
                            <>
                                {loading ? (
                                    <div className="w-full h-full flex justify-center px-3 md:px-8 bg-[#ecf1f7]/70 dark:bg-[#020024]/70 py-3 md:py-8 md:rounded-lg">
                                        <p className="text-gray-500 text-center text-lg">Loading arrivals…</p>
                                    </div>
                                ) : !hasAnyArrivals ? (
                                    <div className="w-full h-full flex justify-center px-3 md:px-8 bg-[#ecf1f7]/70 dark:bg-[#020024]/70 py-3 md:py-8 md:rounded-lg">
                                        <p className="text-gray-500 text-center text-lg">No arrivals found at nearby stops.</p>
                                    </div>
                                ) : (
                                    <div className="w-full h-[600px]">
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
                            </>
                        )}

                        {coords && activeTab === "stops" && (
                            <div className="w-full h-full overflow-y-auto text-center bg-[#ecf1f7]/70 dark:bg-[#020024]/70 py-3 px-3 md:px-0 md:py-8 md:rounded-lg">
                                {loading ? (
                                    <p className="text-gray-500 text-lg">Loading arrivals…</p>
                                ) : !hasAnyArrivals ? (
                                    <p className="text-gray-500 text-lg">No arrivals found at nearby stops.</p>
                                ) : (
                                    <NearbyStops
                                        stops={stopsWithArrivals.filter(stop => stop.arrivals && stop.arrivals.length > 0)}
                                    />
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>


    );
}
