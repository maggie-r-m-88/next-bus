"use client";
import stops from "@/resources/madrid_emt_stops.json";
import { useMemo } from "react";

interface Stop {
  stop_id: number;
  stop_name: string;
  stop_lat: number;
  stop_lon: number;
}

// Haversine formula to calculate distance in meters
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000; // meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

interface NearbyStopsProps {
  lat: number;
  lon: number;
  radiusMeters?: number;
}

export default function NearbyStops({ lat, lon, radiusMeters = 1000 }: NearbyStopsProps) {
  const nearbyStops = useMemo(() => {
    return stops
      .map((stop: Stop) => {
        const distance = getDistance(lat, lon, stop.stop_lat, stop.stop_lon);
        return { ...stop, distance };
      })
      .filter((stop) => stop.distance <= radiusMeters)
      .sort((a, b) => a.distance - b.distance);
  }, [lat, lon, radiusMeters]);

  if (nearbyStops.length === 0) {
    return <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-center">No stops found nearby.</p>;
  }

  return (
    <ul className="mt-4 text-center">
      {nearbyStops.map((stop) => (
        <li key={stop.stop_id} className="text-black dark:text-zinc-50">
          {stop.stop_name} ({(stop.distance / 1000).toFixed(2)} km)
        </li>
      ))}
    </ul>
  );
}
