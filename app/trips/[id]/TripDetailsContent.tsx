"use client";

import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { LocationPhoto } from "@/app/components/create-trip/LocationPhoto";
import { PlaceCard } from "@/app/components/view-trip/PlaceCard";
import { HotelType, Trip, TripPlan0, TripPlan1 } from "@/app/types";
import { Auth } from "@/app/auth/Auth";
import { tripStorage } from "@/lib/trip-storage";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/app/context/SessionContext";
import HotelCard from "@/app/components/view-trip/HotelCard";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";

export default function TripDetailsContent({ tripId }: { tripId: string }) {
  const session = useSession();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
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
            setIsSaved(true);
          }
        };
        fetchSavedTrip();
      } else {
        // Fetch from local storage
        const localStoredTrip = tripStorage.getTrip();
        if (localStoredTrip) {
          //   const parsedTrip = {
          //     ...localStoredTrip,
          //     plan: JSON.parse(localStoredTrip.plan),
          //   };
          //   setTrip(parsedTrip);
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
      setIsSaved(true);
      //   tripStorage.clearTrip();
      tripStorage.saveTrip({ ...trip, isSaved: true } as Trip);
    }
    // will think about if I need to clear local storage at this point
    // after saving to supabse sucessfully, router.push to user account page?
    router.push("/trips");
    // router.push("/user-page");
  };

  const [isSignInOpen, setIsSignInOpen] = useState<boolean>(false);

  return (
    <div className="w-full min-w-[300px] px-3 pb-10 mt-8 sm:px-20 flex flex-col items-center">
      <div className="w-full md:w-[70%] flex flex-col gap-4 sm:gap-10 justify-center items-center">
        {/* Display main photo */}
        {trip && (
          // <div className="flex flex-col gap-2 w-full md:px-10 xl:px-40">
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
              </div>
              {session && (
                <div>
                  {!trip.isSaved && (
                    <button
                      className="btn-second ml-4 text-[1rem]"
                      onClick={() => handleSaveTrip()}
                    >
                      {/* Save Trip */}
                      <BookmarkAddIcon />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Display Itinerary using Accordion */}
        <div className="w-full flex flex-wrap gap-4 sm:gap-8 justify-center ">
          {trip &&
            (trip.plan.slice(2) as TripPlan1[]).map((day, index) => (
              <div key={index} className="w-full sm:w-[80%]">
                <Accordion
                  defaultExpanded={index === 0}
                  sx={{ backgroundColor: "#202327" }}
                >
                  <AccordionSummary
                    expandIcon={<ArrowDownwardIcon className="text-white" />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <div className="font-semibold text-white text-[1.05rem]">
                      Day {day.day}: {day.day_theme}
                    </div>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      padding: 1,
                      paddingBottom: 2,
                      "@media (min-width: 600px)": { padding: 2 },
                    }}
                    className="flex flex-col gap-2 text-white items-center "
                  >
                    {day.places.map((place, index) => (
                      // <div className="sm:w-[90%]">
                      <PlaceCard
                        key={index}
                        place={place}
                        photo={trip.place_photos[place.place_name]}
                      />
                      // </div>
                    ))}
                  </AccordionDetails>
                </Accordion>
              </div>
            ))}

          {/* Display Hotels */}
          {trip && (
            <div className="w-full sm:w-[80%]">
              <Accordion defaultExpanded sx={{ backgroundColor: "#202327" }}>
                <AccordionSummary
                  expandIcon={<ArrowDownwardIcon className="text-white" />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <div className="font-semibold text-white text-[1.05rem]">
                    Hotel Suggestions
                  </div>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    padding: 1,
                    paddingBottom: 2,
                    "@media (min-width: 600px)": { padding: 2 },
                  }}
                  className="flex flex-col gap-2 text-white items-center "
                >
                  {(trip.plan[1] as HotelType[]).map((hotel, index) => (
                    <HotelCard key={index} place={hotel} />
                  ))}
                </AccordionDetails>
              </Accordion>
            </div>
          )}

          {/* {trip && 
            (trip.plan[1] as HotelType[]).map((hotel, index) => (
              
            ))} */}
        </div>

        {/* Button to SignIn */}
        {!session && (
          <div className="mt-auto">
            <button
              className="btn-primary"
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
