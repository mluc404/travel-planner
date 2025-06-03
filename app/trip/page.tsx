"use client";

import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { LocationPhoto } from "../components/create-trip/LocationPhoto";

interface TripPlan {
  trip_name: string;
  location: string;
  duration: string;
}

interface Trip {
  id: string;
  title: string;
  // plan: TripPlan[];
  plan: [];
  created_at: string;
}

export default function Trip() {
  const [trips, setTrips] = useState<Trip | null>(null);

  const fetchTrips = async () => {
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      const latestTrip = data[0];
      try {
        const parsedTrip = {
          ...latestTrip,
          title: JSON.parse(latestTrip.title),
          plan: JSON.parse(latestTrip.plan),
        };
        setTrips(parsedTrip);
        console.log(parsedTrip);
      } catch (e) {
        console.error("Failed to parse latest trip plan JSON:", e);
        setTrips(latestTrip as Trip);
        console.log(latestTrip);
      }
    } else {
      setTrips(null);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <div className="p-4">
      <div className="flex flex-col gap-4">
        {trips && (
          <div className="font-semibold text-2xl">
            {trips.plan[0].trip_name}
            <LocationPhoto
              photoUrl={trips.main_photo}
              selectedPlace={trips.title.description}
            />
          </div>
        )}
        {trips &&
          trips.plan[1].itinerary.map((day) => (
            <div key={day.day} className="flex flex-col gap-2">
              <div className="flex gap-2 font-semibold">
                <div>Day {day.day}</div>
                <div>{day.theme}</div>
              </div>
              <div>Morning</div>
              <ul>
                {day.activities.morning.map((choice, index) => (
                  <li key={index}>
                    <div className="underline">Location: {choice.location}</div>
                    <div className="px-2">Activity: {choice.what_to_do}</div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
}
