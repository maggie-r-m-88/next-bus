// app/api/geocode/route.ts
import { NextResponse } from "next/server";
import { getEmtAccessToken } from "@/lib/emtAuth";

// Simple in-memory cache
const cache: Record<string, { lat: string; lon: string }> = {};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "Address query parameter is required" },
        { status: 400 }
      );
    }

    // Return cached result if available
    if (cache[address]) {
      return NextResponse.json({ ...cache[address], cached: true });
    }

    // Fetch from OpenStreetMap Nominatim
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch location" },
        { status: 502 }
      );
    }

    const data = await res.json();

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "No results found" },
        { status: 404 }
      );
    }

    // Take the first result
    const result = {
      lat: data[0].lat,
      lon: data[0].lon,
    };

    // Cache it
    cache[address] = result;

    return NextResponse.json({ ...result, cached: false });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
