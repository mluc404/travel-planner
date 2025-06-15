"use client";

import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { LocationPhoto } from "@/app/components/create-trip/LocationPhoto";
import { Trip, TripPlan0, TripPlan1 } from "@/app/types";
import { Auth } from "@/app/auth/Auth";
import { tripStorage } from "@/lib/trip-storage";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/context/SessionContext";

import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import RecommendPlaces from "@/app/components/view-trip/RecommendPlaces";
import RecommendHotels from "@/app/components/view-trip/RecommendHotels";

export default function TripDetailsContent({ tripId }: { tripId: string }) {
  const session = useSession();
  const [trip, setTrip] = useState<Trip | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (tripId) {
      if (tripId !== "temp") {
        // Fetch from Supabase
        const fetchSavedTrip = async () => {
          const { data, error } = await supabase
            .from("trips")
            .select()
            .eq("id", tripId)
            .single();

          if (data) {
            setTrip(data);
          }

          if (error) {
            console.error("Error fetching trip: ", error);
          }
        };
        fetchSavedTrip();
      } else {
        // Fetch from local storage
        const localStoredTrip = tripStorage.getTrip();
        if (localStoredTrip) {
          setTrip(localStoredTrip);
          console.log(localStoredTrip);
        }
      }
    }
  }, [tripId]);

  // Allow user to save the trip to supabase once they're signed in
  const handleSaveTrip = async () => {
    if (!session) return;

    const { error } = await supabase.from("trips").insert({
      ...trip,
      user_id: session.user.id,
      email: session.user.email,
      isSaved: true,
    });
    if (error) {
      console.error("Error saving trip: ", error);
    } else {
      tripStorage.saveTrip({ ...trip, isSaved: true } as Trip);
    }
    router.push("/trips");
  };

  const [isSignInOpen, setIsSignInOpen] = useState<boolean>(false);

  return (
    <div className="w-full min-w-[300px] px-3 pb-10 mt-8 sm:px-20 flex flex-col items-center">
      <div className="w-full md:w-[70%] flex flex-col gap-4 sm:gap-10 justify-center items-center">
        {/* Display main photo */}
        {trip && (
          <div className="flex flex-col gap-2 w-full">
            <div className="relative w-full h-[50vw] sm:h-[30vw]">
              <LocationPhoto
                photoUrl={trip.main_photo}
                selectedPlace={(trip.plan[0] as TripPlan0).destination}
              />
            </div>
            <div className="flex justify-between">
              <div className="font-semibold text-2xl">
                {(trip.plan[0] as TripPlan0).trip_name}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-4 items-center">
                <div className="bg-gray-500 px-2 rounded-xl">
                  {(trip.plan[0] as TripPlan0).duration}
                </div>
                <div className="bg-gray-500 px-2 rounded-xl">
                  {(trip.plan[0] as TripPlan0).travelers}
                </div>
                <div className="bg-gray-500 px-2 rounded-xl">
                  ${(trip.plan[0] as TripPlan0).budget}
                </div>
              </div>

              {/* Save Trip button */}
              {session && (
                <div>
                  {!trip.isSaved && (
                    <button
                      className="btn-second ml-4 text-[1rem]"
                      onClick={() => handleSaveTrip()}
                    >
                      <BookmarkAddIcon />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Display Itinerary */}
        <div className="w-full flex flex-wrap gap-4 sm:gap-8 justify-center ">
          {trip &&
            (trip.plan.slice(2) as TripPlan1[]).map((day, index) => (
              <div key={index} className="w-full sm:w-[90%] lg:w-[80%]">
                <RecommendPlaces day={day} index={index} trip={trip} />
              </div>
            ))}

          {/* Display Hotels */}
          {trip && (
            <div className="w-full sm:w-[80%]">
              <RecommendHotels trip={trip} />
            </div>
          )}
        </div>

        {/* CTA SignIn to save trip */}
        {!session && (
          <div className="mt-auto">
            <button
              className="btn-primary-2"
              onClick={() => setIsSignInOpen(!isSignInOpen)}
            >
              Sign in to save your trip
            </button>
          </div>
        )}
        {isSignInOpen && <Auth onClose={() => setIsSignInOpen(false)} />}
      </div>
    </div>
  );
}
