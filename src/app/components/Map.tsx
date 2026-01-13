"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import staticStops from "@/resources/static_stops.json";
import type { NormalizedStop } from "@/types/stop";

// Fix default icon issue


interface MapProps {
  userPosition: [number, number];
}

export default function Map({ userPosition }: MapProps) {
  return (
    <MapContainer
      center={userPosition}
      zoom={15}
      scrollWheelZoom={true}
      className="w-full h-full rounded-lg shadow-md"
     style={{ height: "500px" }}

    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* User marker */}
      <Marker position={userPosition}>
        <Popup>Your location</Popup>
      </Marker>

      {/* Stops from JSON */}
      {staticStops.map((stop: NormalizedStop) => (
        <Marker key={stop.stop_id} position={[stop.lat, stop.lon]}>
          <Popup>{stop.stop_name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
