"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, LatLngBounds } from "leaflet";

interface Arrival {
  line: string;
  destination: string;
  arrivalTimeInMinutes: number;
}

interface Stop {
  stop_id: number;
  stop_name: string;
  lat: number;
  lon: number;
  arrivals?: Arrival[];
}

interface MapProps {
  userPosition: [number, number];
  stops?: Stop[]; // optional, can override static stopsData
}

export default function MyMap({ userPosition, stops }: MapProps) {
  const stopsToUse = stops || [];

  return (
    <MapContainer
      center={userPosition}
      zoom={20}
      scrollWheelZoom={true}
      className="w-full h-[100vh] rounded-lg shadow-md"
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <AutoFitBounds userPosition={userPosition} stops={stopsToUse} />

      {stopsToUse
        .filter((stop) => stop.arrivals && stop.arrivals.length > 0)
        .map((stop: Stop) => (
          <Marker
            key={stop.stop_id}
            position={[stop.lat, stop.lon]}
            icon={
              new Icon({
                iconUrl: "/leaflet/marker-icon.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              })
            }
          >
            {/* Tooltip: quick summary of lines */}
            <Tooltip permanent direction="top" offset={[0, -10]} className="tooltipContainer">
              {stop.arrivals!.map((a) => a.line).join(", ")}
            </Tooltip>

            {/* Popup: full details */}
            <Popup className="popupContainer">
              <div className="overflow-hidden rounded-lg shadow-lg">
                {/* Header */}
                <div className="bg-gradient-to-r from-[var(--brand-dark-blue)] to-indigo-500 px-3 py-2">
                  <div className="font-semibold text-white text-base">{stop.stop_name}</div>
                </div>

                {/* Routes List */}
                <div className="bg-white">
                  {stop.arrivals!.map((arr, idx) => {
                    const minutes = arr.arrivalTimeInMinutes;
                    const isImmediate = minutes === 0;

                    const timeColor = isImmediate
                      ? "text-red-600"
                      : minutes <= 5
                      ? "text-green-600"
                      : "text-gray-600";

                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                      >
                        {/* Line Badge */}
                        <div className="bg-indigo-100 text-indigo-700 font-bold text-xs px-2.5 py-1 rounded-md min-w-[45px] text-center border-2 border-indigo-200">
                          {arr.line}
                        </div>

                        {/* Destination */}
                        <div className="flex-1 text-sm text-gray-700 font-medium">{arr.destination}</div>

                        {/* Time */}
                        <div className={`text-sm font-bold ${timeColor} whitespace-nowrap`}>
                          {isImmediate ? "Now" : `${minutes} min`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}

/* -------------------------------------------------------
   Auto-fit map bounds to include user + stops
------------------------------------------------------- */
interface FitBoundsProps {
  userPosition: [number, number];
  stops: Stop[];
}

function AutoFitBounds({ userPosition, stops }: FitBoundsProps) {
  const map = useMap();

  useEffect(() => {
    const bounds = new LatLngBounds([userPosition]);

    stops
      .filter((s) => s.arrivals && s.arrivals.length > 0)
      .forEach((stop) => bounds.extend([stop.lat, stop.lon]));

    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 20 });
  }, [userPosition, stops, map]);

  return null;
}
