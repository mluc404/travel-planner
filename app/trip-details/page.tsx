"use client";

import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { LocationPhoto } from "../components/create-trip/LocationPhoto";
import { getPlaceDetails } from "../api/places/getPlaceDetails";
import { getPlacePhoto } from "../api/places/getPlacePhoto";

import { getPlaceFromText } from "../components/FindPlaceFromText";
import { FindPlaceFromTextResponseData } from "@googlemaps/google-maps-services-js";

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

    // if (data && data.length > 0) {
    //   const latestTrip = data[0];
    //   try {
    //     const parsedTrip = {
    //       ...latestTrip,
    //       title: JSON.parse(latestTrip.title),
    //       plan: JSON.parse(latestTrip.plan),
    //     };
    //     setTrips(parsedTrip);
    //     console.log(parsedTrip);
    //   } catch (e) {
    //     console.error("Failed to parse latest trip plan JSON:", e);
    //     setTrips(latestTrip as Trip);
    //     console.log(latestTrip);
    //   }
    // } else {
    //   setTrips(null);
    // }
  };

  useEffect(() => {
    fetchTrip();
    findPhoto();
  }, []);

  // Fetch location photos
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const morningLocation1_id = "ChIJtV5bzSAFdkgRpwLZFPWrJgo";

  const findPhoto = async () => {
    const placeDetails = await getPlaceDetails(morningLocation1_id);
    if (placeDetails.photos) {
      const photoRef = placeDetails.photos[0].photo_reference;
      const placePhoto = await getPlacePhoto(photoRef);
      setPhotoUrl(placePhoto);
    }
  };

  // Fetch photo for the places in itinerary
  if (trip) {
    console.log(trip.plan[1].places);
    const itinerary = trip.plan.slice(1);
    console.log(itinerary);
  }

  return (
    <div className="px-5 pb-10 mt-8 sm:px-20 md:px-40">
      <div className="flex flex-col gap-4 sm:gap-10 justify-center items-center">
        {/* Display main photo */}
        {trip && (
          <div className="flex flex-col gap-2 w-full">
            <div className="">
              <LocationPhoto
                photoUrl={trip.main_photo}
                selectedPlace={trip.plan[0].location}
              />
            </div>

            <div className="font-semibold text-2xl">
              {trip.plan[0].trip_name}
            </div>
          </div>
        )}

        <div className="flex gap-4 flex-wrap justify-center">
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
                      location={trip.title.description}
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
