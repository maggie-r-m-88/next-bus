"use client";

import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import stopsData from "@/resources/static_stops.json";
import { Icon } from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";

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
}

export default function MyMap({ userPosition }: MapProps) {
  return (
    <MapContainer
      center={userPosition}
      zoom={20}
      scrollWheelZoom={true}
      className="w-full h-[500px] rounded-lg shadow-md"
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {stopsData
        .filter((stop) => stop.arrivals && stop.arrivals.length > 0)
        .map((stop: Stop) => (
          <Marker
            key={stop.stop_id}
            position={[stop.lat, stop.lon]}
            icon={new Icon({
              iconUrl: markerIconPng,
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          >
            {/* Tooltip: quick summary of lines */}
            <Tooltip permanent direction="top" offset={[0, -10]}>
              {stop.arrivals!.map((a) => a.line).join(", ")}
            </Tooltip>

            {/* Popup: full details */}
            <Popup>
              <div className="text-sm font-medium">
                <div className="font-semibold mb-1">{stop.stop_name}</div>
                <ul className="list-disc ml-4">
                  {stop.arrivals!.map((arr, idx) => (
                    <li key={idx}>
                      {arr.line} {arr.destination} - {arr.arrivalTimeInMinutes} min
                    </li>
                  ))}
                </ul>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
