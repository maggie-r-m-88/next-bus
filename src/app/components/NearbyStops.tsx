"use client";

import { useState, useEffect } from "react";
import type { NormalizedStop } from "@/types/stop";

interface NearbyStopsProps {
  stops: NormalizedStop[];
}

export default function NearbyStops({ stops }: NearbyStopsProps) {
  const [openStops, setOpenStops] = useState<Set<string>>(new Set());

useEffect(() => {
  setOpenStops(new Set(stops.map((s) => s.stop_id)));
}, [stops]);

const toggleStop = (stopId: string) => {
  setOpenStops((prev) => {
    const next = new Set(prev);
    next.has(stopId) ? next.delete(stopId) : next.add(stopId);
    return next;
  });
};

  return (
    <div className="space-y-4">
      {stops.map((stop) => {
        const isOpen = openStops.has(stop.stop_id);
        return (
          <div
            key={stop.stop_id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <button onClick={() => toggleStop(stop.stop_id)}
              className="w-full flex items-center justify-between bg-gradient-to-r from-[var(--brand-dark-blue)] to-indigo-500 px-3 py-2 text-left"
            >
              <h3 className="font-semibold text-white text-base">
                {stop.stop_name}
              </h3>

              {/* Animated Plus / Minus icon */}
              <span
                className={`text-white font-bold text-lg transition-transform duration-300 ease-in-out transform ${
                  isOpen ? "rotate-180 scale-110" : "rotate-0 scale-100"
                }`}
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>

            {/* Content */}
            {isOpen && (
              <>
                {!stop.arrivals || stop.arrivals.length === 0 ? (
                  <div className="px-5 py-4 text-center text-gray-500 text-sm">
                    No arrivals available
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {stop.arrivals.map((arr, idx) => {
                      const minutes = Math.ceil(arr.estimateArrive / 60);
                      const isImmediate = minutes === 0;

                      const timeColor = isImmediate
                        ? "text-red-600"
                        : minutes <= 5
                        ? "text-green-600"
                        : "text-gray-600";

                      return (
                        <div
                          key={`${stop.stop_id}-${idx}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="bg-indigo-100 text-indigo-700 font-bold text-xs px-2.5 py-1 rounded-md min-w-[45px] text-center border border-indigo-200">
                            {arr.line}
                          </div>

                          <div className="flex-1 text-sm text-gray-700 font-medium">
                            {arr.destination}
                          </div>

                          <div
                            className={`text-sm font-bold ${timeColor} whitespace-nowrap`}
                          >
                            {isImmediate ? "Now" : `${minutes} min`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
