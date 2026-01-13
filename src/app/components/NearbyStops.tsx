"use client";
import type { Stop } from "@/types/stop";

export default function NearbyStops({ stops }: { stops: Stop[] }) {
  if (stops.length === 0) {
    return <p>No stops found nearby.</p>;
  }

  return (
    <ul className="mt-4 text-center">
      {stops.map((stop) => (
        <li key={stop.stop_id}>
          {stop.stop_name} ({(stop.distance! / 1000).toFixed(2)} km)
        </li>
      ))}
    </ul>
  );
}
