import { NextResponse } from "next/server";
import { getEmtAccessToken } from "@/lib/emtAuth";
import type { NormalizedStop } from "@/types/stop";

export async function POST(req: Request) {

    function normalizeArrivals(rawData: any): NormalizedStop[] {
    const stopsMap: Record<string, NormalizedStop> = {};

    for (const stopObj of rawData.data) {
        const stopInfo = stopObj.StopInfo?.[0];
        const arriveArray = stopObj.Arrive || [];

        if (!stopInfo) continue;

        const stopId = stopInfo.stopId;
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

        // Add each arrival for this stop
        for (const a of arriveArray) {
            stopsMap[stopId].arrivals.push({
                line: a.line,
                destination: a.destination,
                estimateArrive: a.estimateArrive,
                arrivalTimeInMinutes: Math.round(a.estimateArrive / 60), // new field
            });
        }
    }

    return Object.values(stopsMap);
}



    try {
        const { stopIds } = await req.json();


        if (!Array.isArray(stopIds) || stopIds.length === 0) {
            return NextResponse.json(
                { error: "stopIds must be a non-empty array" },
                { status: 400 }
            );
        }

        const token = await getEmtAccessToken();

        const results: Record<number, any> = {};

        for (const stopId of stopIds) {
            const res = await fetch(
                `https://openapi.emtmadrid.es/v2/transport/busemtmad/stops/${stopId}/arrives/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        accessToken: token, // ✅ EMT-specific
                    },
                    body: JSON.stringify({
                        cultureInfo: "EN",
                        Text_StopRequired_YN: "Y",
                        Text_EstimationsRequired_YN: "Y",
                        Text_IncidencesRequired_YN: "N"

                    }),
                }
            );

            if (!res.ok) {
                console.error(`Failed arrivals for stop ${stopId}`, res.status);
                continue;
            }

            const data = await res.json();
            const normalized = normalizeArrivals(data);

            results[stopId] = normalized[0]; // each stopId key has one normalized object
            console.log(`Arrivals for stop ${stopId}:`, normalized);
        }

        return NextResponse.json(results);
    } catch (error) {
        console.error("EMT arrivals error:", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
