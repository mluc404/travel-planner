"use client";

import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { LocationPhoto } from "../components/create-trip/LocationPhoto";
import { PlaceCard } from "../components/view-trip/PlaceCard";

interface TripPlan0 {
  trip_name: string;
  location: string;
  duration: string;
  travelers: number;
}
interface TripPlan1 {
  itinerary: [any];
}

interface Trip {
  id: string;
  title: { description: string };
  // plan: TripPlan[];
  plan: [TripPlan0, TripPlan1];
  created_at: string;
  main_photo: string;
}

export default function Trip() {
  const [trip, setTrip] = useState<Trip | null>(null);

  const fetchTrip = async () => {
    try {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        const parsedTrip = {
          ...data[0],
          plan: JSON.parse(data[0].plan),
          title: JSON.parse(data[0].title),
        };
        setTrip(parsedTrip);
        console.log(parsedTrip);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, []);

  return (
    <div className="px-5 pb-10 mt-8 sm:px-20 md:px-40">
      <div className="flex flex-col gap-4 sm:gap-10 justify-center items-center">
        {/* Display main photo */}
        {trip && (
          <div className="flex flex-col gap-2 w-full">
            <div className="">
              <LocationPhoto
                photoUrl={trip.main_photo}
                selectedPlace={trip.plan[0].destination}
              />
            </div>

            <div className="font-semibold text-2xl">
              {trip.plan[0].trip_name}
            </div>
          </div>
        )}

        <div className="flex gap-4 md:gap-8 flex-wrap justify-around lg:px-10">
          {trip &&
            trip.plan.slice(1).map((day, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="font-semibold text-gray-600">
                  Day {day.day}: {day.day_theme}
                </div>
                {day.places.map((place, index) => (
                  <div key={index}>
                    <PlaceCard
                      place={place}
                      photo={trip.place_photos[place.place_name]}
                    />
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
