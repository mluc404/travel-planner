"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Trip, TripPlan0 } from "../types";
import { LocationPhoto } from "../components/create-trip/LocationPhoto";
import { useSession } from "../context/SessionContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TripCard from "../components/view-trip/TripCard";

export default function UserPage() {
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

  //
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const goToTripDetails = (tripId: number) => {
    router.push(`/trip-details?saved=${tripId}`);
  };

  return (
    <div className="flex justify-center w-full pb-8">
      <div className="p-4 px-6 flex flex-col w-full">
        {/* <div className="flex gap-4">
            <div>{session?.user.email}</div>
            {session && (
              <button className="btn-primary" onClick={() => handleSignOut()}>
                Sign Out
              </button>
            )}
          </div> */}
        {/* <div>
            <Link href="/create-trip">
              <button className="btn-primary">Create Trip</button>
            </Link>
          </div> */}
        {/* show Loading state */}
        <h1 className="font-semibold text-2xl mb-6">My Trips</h1>
        {isLoading && <div> Loading... </div>}
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
                />
                {/* <button
                    className="btn-primary"
                    onClick={() => handleDelete(trip.id as number)}
                  >
                    Delete
                  </button> */}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
