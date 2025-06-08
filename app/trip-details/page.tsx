"use client";

import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { LocationPhoto } from "../components/create-trip/LocationPhoto";
import { PlaceCard } from "../components/view-trip/PlaceCard";
import { Trip, TripPlan0, TripPlan1 } from "../types";
import { Auth } from "../components/auth";
import { tripStorage } from "@/lib/trip-storage";
import { useRouter } from "next/navigation";
import { useSession } from "../context/SessionContext";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function TripDetails() {
  const session = useSession();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const router = useRouter();

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
      // tripStorage.clearTrip();
    }
    // will think about if I need to clear local storage at this point
    // after saving to supabse sucessfully, router.push to user account page?
    router.push("/user-page");
  };

  const [isSignInOpen, setIsSignInOpen] = useState<boolean>(false);

  return (
    <div className="w-full min-w-[300px] px-4 pb-10 mt-8 sm:px-20 flex flex-col items-center">
      <div className="w-full md:w-[70%] flex flex-col gap-4 sm:gap-10 justify-center items-center">
        {/* Display main photo */}
        {trip && (
          // <div className="flex flex-col gap-2 w-full md:px-10 xl:px-40">
          <div className="flex flex-col gap-2 w-full ">
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
              {session && (
                <div>
                  {!isSaved && (
                    <button
                      className="btn-primary ml-4"
                      onClick={() => handleSaveTrip()}
                    >
                      Save Trip
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
            (trip.plan.slice(1) as TripPlan1[]).map((day, index) => (
              <div key={index} className="w-full sm:w-[80%]">
                <Accordion
                  defaultExpanded={index === 0}
                  sx={{ backgroundColor: "white" }}
                >
                  <AccordionSummary
                    expandIcon={<ArrowDownwardIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <div className="font-semibold text-gray-700 text-[1.05rem]">
                      Day {day.day}: {day.day_theme}
                    </div>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      padding: 1,
                      "@media (min-width: 600px)": { padding: 2 },
                    }}
                    // className="flex flex-col gap-2 bg-[#2e3339]"
                    className="flex flex-col gap-2 bg-[#2e3339] text-white"
                  >
                    {day.places.map((place, index) => (
                      <PlaceCard
                        key={index}
                        place={place}
                        photo={trip.place_photos[place.place_name]}
                      />
                    ))}
                  </AccordionDetails>
                </Accordion>
              </div>
            ))}
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
