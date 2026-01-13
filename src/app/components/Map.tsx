"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import stops from "@/resources/madrid_emt_stops.json";

interface MapProps {
  userPosition?: [number, number];
}

export default function MyMap({ userPosition }: MapProps) {
  // Combine user position with stops
  const markers = [
    ...(userPosition ? [{ lat: userPosition[0], lon: userPosition[1], name: "You" }] : []),
    ...stops.map((stop) => ({
      lat: stop.stop_lat,
      lon: stop.stop_lon,
      name: stop.stop_name,
    })),
  ];

  // Center map on first marker or default
  const initialCenter: [number, number] = markers.length
    ? [markers[0].lat, markers[0].lon]
    : [40.47, -3.78];

  return (
    <MapContainer
      center={initialCenter}
      zoom={13}
      scrollWheelZoom={true}
      className="w-full rounded-lg shadow-md"
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markers.map((m, i) => (
        <Marker key={i} position={[m.lat, m.lon]}>
          <Popup>{m.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
