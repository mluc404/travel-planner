"use client";

import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

interface TripPlan {
  trip_name: string;
  location: string;
  duration: string;
}

interface Trip {
  id: string;
  title: string;
  plan: TripPlan[];
  created_at: string;
}

export default function Trip() {
  const [trips, setTrips] = useState<Trip[]>([]);

  const fetchTrips = async () => {
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      const latestTrip = data[0];
      try {
        const parsedTrip = { ...latestTrip, plan: JSON.parse(latestTrip.plan) };
        setTrips([parsedTrip as Trip]);
        console.log(parsedTrip);
      } catch (e) {
        console.error("Failed to parse latest trip plan JSON:", e);
        setTrips([latestTrip as Trip]);
        console.log(latestTrip);
      }
    } else {
      setTrips([]);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <div>
      Trip Page
      <div>
        {trips.map((trip) => (
          <div key={trip.id}>
            {trip.plan && trip.plan[0] && (
              <div>
                <div className="font-semibold">
                  Trip Name: {trip.plan[0].trip_name}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
