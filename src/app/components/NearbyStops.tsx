"use client";

import type { NormalizedStop } from "@/types/stop";

interface NearbyStopsProps {
  stops: NormalizedStop[];
}

export default function NearbyStops({ stops }: NearbyStopsProps) {
  return (
    <table className="mt-4 w-full table-auto border border-gray-300 text-sm">
      <thead>
        <tr className="bg-gray-100 dark:bg-gray-800">
          <th className="border px-2 py-1">Stop Name</th>
          <th className="border px-2 py-1">Line</th>
          <th className="border px-2 py-1">Direction</th>
          <th className="border px-2 py-1">ETA (min)</th>
          <th className="border px-2 py-1">Lat</th>
          <th className="border px-2 py-1">Lon</th>
        </tr>
      </thead>
      <tbody>
        {stops.map((stop) => {
          if (!stop.arrivals || stop.arrivals.length === 0) {
            return (
              <tr key={stop.stop_id} className="border">
                <td className="border px-2 py-1">{stop.stop_name}</td>
                <td colSpan={5} className="border px-2 py-1 text-center">
                  No arrivals
                </td>
              </tr>
            );
          }

          return stop.arrivals.map((arr, idx) => (
            <tr key={`${stop.stop_id}-${idx}`} className="border">
              <td className="border px-2 py-1">{stop.stop_name}</td>
              <td className="border px-2 py-1">{arr.line}</td>
              <td className="border px-2 py-1">{arr.destination}</td>
              <td className="border px-2 py-1">{Math.ceil(arr.estimateArrive / 60)}</td>
              <td className="border px-2 py-1">{stop.lat}</td>
              <td className="border px-2 py-1">{stop.lon}</td>
            </tr>
          ));
        })}
      </tbody>
    </table>
  );
}
