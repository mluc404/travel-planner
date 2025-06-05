"use client";

import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { LocationPhoto } from "../components/create-trip/LocationPhoto";
import { PlaceCard } from "../components/view-trip/PlaceCard";
import { Trip, TripPlan1 } from "../types";

export default function TripDetails() {
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

  const [isDayOn, setIsDayOn] = useState<boolean>(false);
  const [visibility, setVisibility] = useState<{ [key: number]: boolean }>({
    1: true,
  });
  const toggleDay = (dayNumber: number) => {
    setVisibility((prev) => ({ ...prev, [dayNumber]: !prev[dayNumber] }));
  };

  console.log(visibility);

  return (
    <div className="px-5 pb-10 mt-8 sm:px-20 ">
      <div className="flex flex-col gap-4 sm:gap-10 justify-center items-center">
        {/* Display main photo */}
        {trip && (
          <div className="flex flex-col gap-2 w-full md:px-10 xl:px-40">
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

        {/* Display Itinerary */}
        <div className="flex flex-wrap gap-4 justify-center w-full md:px-4">
          {trip &&
            (trip.plan.slice(1) as TripPlan1[]).map((day, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 w-full sm:w-[350px] lg:w-[400px]"
              >
                <div
                  className="font-semibold text-white hover:cursor-pointer
                  text-lg bg-gray-600 px-2 py-1 rounded "
                  onClick={() => toggleDay(day.day)}
                >
                  {visibility[day.day] ? "\u25BD" : "\u25B7"} Day {day.day}:{" "}
                  {day.day_theme}
                </div>
                <div
                  key={index}
                  className={`${
                    visibility[day.day]
                      ? "max-h-screen opacity-100"
                      : "max-h-0 opacity-0"
                  } overflow-hidden flex flex-col gap-2 transition-all duration-500 ease-in-out`}

                  // className={`${visibility[day.day] ? "visible" : "hidden"}  }
                  //   flex flex-col gap-2 transition-all duration-200 ease-in-out`}
                >
                  {day.places.map((place, index) => (
                    <PlaceCard
                      key={index}
                      place={place}
                      photo={trip.place_photos[place.place_name]}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
