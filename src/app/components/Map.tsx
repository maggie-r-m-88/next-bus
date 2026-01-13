"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import type { Stop } from "@/types/stop";

interface MapProps {
  userPosition: [number, number];
  stops: Stop[];
}

export default function MyMap({ userPosition, stops }: MapProps) {
  return (
    <MapContainer
      center={userPosition}
      zoom={15}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User */}
      <Marker position={userPosition}>
        <Popup>You are here</Popup>
      </Marker>

      {/* Nearby stops */}
      {stops.map((stop) => (
        <Marker
          key={stop.stop_id}
          position={[stop.stop_lat, stop.stop_lon]}
        >
          <Popup>{stop.stop_name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
