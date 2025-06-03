"use client";

import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { LocationPhoto } from "../components/create-trip/LocationPhoto";
import { getPlaceDetails } from "../api/places/getPlaceDetails";
import { getPlacePhoto } from "../api/places/getPlacePhoto";

import { getPlaceFromText } from "../components/FindPlaceFromText";
import { FindPlaceFromTextResponseData } from "@googlemaps/google-maps-services-js";

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
  const [trips, setTrips] = useState<Trip | null>(null);

  const fetchTrips = async () => {
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    // const parsedTrip = JSON.parse(data[0]);
    // setTrips(parseTrip);
    // console.log(data[0].title);
    const titleObj = JSON.parse(data[0].title);
    // console.log(titleObj);
    const titleString = JSON.stringify(titleObj);
    console.log(titleString);

    const plan = data[0].plan;
    const planObj = JSON.parse(plan);
    // console.log(planObj);
    // console.log(data[0]);

    const parsedTrip = {
      ...data[0],
      plan: JSON.parse(data[0].plan),
      title: JSON.parse(data[0].title),
    };
    setTrips(parsedTrip);
    console.log(parsedTrip);
    // console.log(data[0].plan);
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
    fetchTrips();
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

  // Fetch photo for the places
  if (trips) {
    console.log(trips.plan[1].places);
  }
  return (
    <div className="px-5 mt-8 sm:px-20 md:px-40 lg:px-80">
      <div className="flex flex-col gap-4">
        {trips && (
          <div className="font-semibold text-2xl">
            {trips.plan[0].trip_name}
            <LocationPhoto
              photoUrl={trips.main_photo}
              // selectedPlace={trips.title.description}
              selectedPlace={trips.plan[0].location}
            />
          </div>
        )}
        {/* {trips &&
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
          ))} */}
      </div>
    </div>
  );
}
