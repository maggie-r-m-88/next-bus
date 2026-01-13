import { NextResponse } from "next/server";
import { getEmtAccessToken } from "@/lib/emtAuth";
import type { NormalizedStop } from "@/types/stop";

export async function POST(req: Request) {
  const { stopIds } = await req.json();

  if (!Array.isArray(stopIds) || stopIds.length === 0) {
    return NextResponse.json({ error: "stopIds must be a non-empty array" }, { status: 400 });
  }

  try {
    const token = await getEmtAccessToken();
    const stopsMap: Record<string, NormalizedStop> = {};

    for (const stopId of stopIds) {
      const res = await fetch(`https://openapi.emtmadrid.es/v2/transport/busemtmad/stops/${stopId}/arrives/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          accessToken: token
        },
        body: JSON.stringify({
          cultureInfo: "EN",
          Text_StopRequired_YN: "Y",
          Text_EstimationsRequired_YN: "Y",
          Text_IncidencesRequired_YN: "N"
        }),
      });
      console.log(res);
      if (!res.ok) {
        console.error(`Failed arrivals for stop ${stopId}:`, res.status);
        continue;
      }

      const data = await res.json();
      const stopObj = data.data?.[0];

      if (!stopObj) continue;

      const stopInfo = stopObj.StopInfo?.[0];
      const arriveArray = stopObj.Arrive || [];

      if (!stopInfo) continue;

      const lat = stopInfo.geometry.coordinates[1];
      const lon = stopInfo.geometry.coordinates[0];
      const stopName = stopInfo.stopName;

      if (!stopsMap[stopId]) {
        stopsMap[stopId] = {
          stop_id: stopId,
          stop_name: stopName,
          lat,
          lon,
          arrivals: [],
        };
      }

      for (const a of arriveArray) {
        stopsMap[stopId].arrivals.push({
          line: a.line,
          destination: a.destination,
          estimateArrive: a.estimateArrive,
          arrivalTimeInMinutes: Math.floor(a.estimateArrive / 60),
        });
      }
    }

    return NextResponse.json(Object.values(stopsMap));
  } catch (err) {
    console.error("EMT arrivals error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
