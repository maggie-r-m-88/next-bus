// src/types/stop.ts
export interface Arrival {
  line: string;
  destination: string;
  estimateArrive: number;
    arrivalTimeInMinutes: number;
}

export interface NormalizedStop {
  stop_id: string;
  stop_name: string;
  lat: number;
  lon: number;
  arrivals: Arrival[];
}
