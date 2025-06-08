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
        .eq("email", email); // safety net. not necessary since RLS already restricts, but just in case

      if (data && data.length > 0) {
        console.log("data from fetch", data);
        setAllTrips(data);
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

  return (
    <div className="p-4">
      User Account Page
      <div className="flex gap-4">
        <div>User: {session?.user.email}</div>
        {session && (
          <button className="btn-primary" onClick={() => handleSignOut()}>
            Sign Out
          </button>
        )}
      </div>
      <div>
        <Link href="/create-trip">
          <button className="btn-primary">Create Trip</button>
        </Link>
      </div>
      <div className="flex flex-col gap-4">
        {session &&
          allTrips &&
          allTrips.map((trip, index) => (
            <div key={index}>
              <TripCard trip={trip} />
              <button // button to delete a trip
                className="btn-primary"
                onClick={() => handleDelete(trip.id as number)}
              >
                Delete
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
