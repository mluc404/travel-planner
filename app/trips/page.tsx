"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Trip } from "../types";
import { useSession } from "../context/SessionContext";
import { useRouter } from "next/navigation";
import TripCard from "../components/view-trip/TripCard";
import AddIcon from "@mui/icons-material/Add";

export default function AllTrips() {
  const session = useSession();
  const [allTrips, setAllTrips] = useState<Trip[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [session]);

  // Function to fetch all the trips for the user
  const fetchData = async () => {
    if (session) {
      const email = session.user.email;
      const { data, error } = await supabase
        .from("trips")
        .select()
        .order("created_at", { ascending: false })
        .eq("email", email); // safety net

      if (data && data.length > 0) {
        console.log("data from fetch", data);
        setAllTrips(data);
        setIsLoading(false);
      } else {
        console.log("data is null");
        setAllTrips(null);
        setIsLoading(false);
      }
      if (error) {
        console.error("Error fetching trips");
      }
    }
  };

  // Function to delete the trip from database
  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("trips").delete().eq("id", id);
    fetchData();
  };

  const goToTripDetails = (tripId: number) => {
    router.push(`/trips/${tripId}`);
  };

  return (
    <div className="flex justify-center w-full pb-8">
      <div className="p-4 px-6 flex flex-col w-full">
        <div className="flex gap-4"></div>

        {/* show Loading state */}
        <h1 className="font-semibold text-2xl mb-6">My Trips</h1>
        {session && isLoading && <div> Loading... </div>}
        {!allTrips && !isLoading && (
          <div className="flex flex-col items-start gap-4">
            <div>No trip found</div>
            <button
              className="btn-second text-[1rem]"
              onClick={() => {
                router.push("/create-trip");
              }}
            >
              <AddIcon fontSize="large" />
            </button>
          </div>
        )}
        {/* Display all trips */}
        <div className="flex flex-wrap gap-8 justify-center">
          {session &&
            allTrips &&
            allTrips.map((trip, index) => (
              <div
                key={index}
                className="w-full sm:w-[45%] md:w-[30%] lg:w-[25%]"
              >
                <TripCard
                  trip={trip}
                  handleClick={() => goToTripDetails(trip.id as number)}
                  removeTrip={() => handleDelete(trip.id as number)}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
