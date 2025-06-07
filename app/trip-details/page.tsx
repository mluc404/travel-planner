"use client";

import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { LocationPhoto } from "../components/create-trip/LocationPhoto";
import { PlaceCard } from "../components/view-trip/PlaceCard";
import { Trip, TripPlan0, TripPlan1 } from "../types";
import { Auth } from "../components/auth";
import { tripStorage } from "@/lib/trip-storage";

export default function TripDetails() {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [session, setSession] = useState<any>(null);

  // Fetch user session logic
  const fetchSession = async () => {
    const currentSession = await supabase.auth.getSession();
    console.log("current session in Trip Details page", currentSession.data);
    setSession(currentSession.data.session);
  };
  useEffect(() => {
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );
    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Fetch trip logic
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

  // useEffect(() => {
  //   fetchTrip();
  // }, []);

  // Fetch local stored trip
  useEffect(() => {
    const localStoredTrip = tripStorage.getTrip();
    if (localStoredTrip) {
      const parsedTrip = {
        ...localStoredTrip,
        plan: JSON.parse(localStoredTrip.plan),
      };
      setTrip(parsedTrip);
      console.log(parsedTrip);
    }
  }, []);

  const handleSaveTrip = async () => {
    const { error } = await supabase
      .from("trips")
      .insert({ ...trip, email: session.user.email });
    if (error) {
      console.error("Error saving trip: ", error);
    }
    // will think about if I need to clear local storage at this point
    // after saving to supabse sucessfully, router.push to user account page?
  };

  // Set the drop down toggle feature for each day itinerary
  const [visibility, setVisibility] = useState<{ [key: number]: boolean }>({});
  const toggleDay = (dayNumber: number) => {
    setVisibility((prev) => ({ ...prev, [dayNumber]: !prev[dayNumber] }));
  };

  useEffect(() => {
    if (trip?.plan) {
      const initialVis: { [key: number]: boolean } = {};
      (trip.plan.slice(1) as TripPlan1[]).forEach((day) => {
        initialVis[day.day] = true;
      });
      setVisibility(initialVis);
    }
  }, [trip]);

  // console.log(visibility);

  const [isSignInOpen, setIsSignInOpen] = useState<boolean>(false);

  return (
    <div className="px-5 pb-10 mt-8 sm:px-20 min-w-[300px]">
      <div className="flex justify-around items-center p-4">
        <div className="font-semibold">
          User: {session ? <span>{session.user.email}</span> : <span></span>}
        </div>
        <div>
          {session && (
            <div>
              <button className="btn-primary" onClick={() => handleLogout()}>
                Logout
              </button>
              <button
                className="btn-primary ml-4"
                onClick={() => handleSaveTrip()}
              >
                Save Trip
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:gap-10 justify-center items-center min-h-[70vh]">
        {/* Display main photo */}
        {trip && (
          <div className="flex flex-col gap-2 w-full md:px-10 xl:px-40">
            <div className="">
              <LocationPhoto
                photoUrl={trip.main_photo}
                selectedPlace={(trip.plan[0] as TripPlan0).destination}
              />
            </div>
            <div className="font-semibold text-2xl">
              {(trip.plan[0] as TripPlan0).trip_name}
            </div>
          </div>
        )}

        {/* Display Itinerary */}
        <div className="flex flex-wrap gap-4 sm:gap-8 justify-center w-full md:px-4">
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

                {/* Toggling requires setting height to prevent screen jumping back to top */}
                <div
                  key={index}
                  className={`${
                    visibility[day.day]
                      ? "opacity-100 "
                      : "opacity-0 h-0 overflow-hidden "
                  } flex flex-col gap-2 transition-all duration-500 ease-in-out`}
                >
                  {/* No toggling doesnt cause screen jumping*/}
                  {/* <div
                  key={index}
                  className="flex flex-col gap-2 transition-all duration-600 ease-in-out"
                > */}
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

        {/* Button to SignIn */}
        <div className="mt-auto">
          <button
            className="btn-primary"
            onClick={() => setIsSignInOpen(!isSignInOpen)}
          >
            Sign in to save your trip
          </button>
        </div>
        {isSignInOpen && <Auth onClose={() => setIsSignInOpen(false)} />}
      </div>
    </div>
  );
}
