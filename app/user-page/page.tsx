"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { Trip, TripPlan0 } from "../types";
import { LocationPhoto } from "../components/create-trip/LocationPhoto";

export default function UserPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [allTrips, setAllTrips] = useState<Trip[] | null>(null);
  useEffect(() => {
    fetchSession();
  }, []);

  const fetchSession = async () => {
    const currentSession = await supabase.auth.getSession();
    if (currentSession) {
      console.log(currentSession.data.session);
      setSession(currentSession.data.session);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session]);
  const fetchData = async () => {
    if (session) {
      const email = session.user.email;
      const { data, error } = await supabase
        .from("trips")
        .select()
        .eq("email", email);

      if (data && data.length > 0) {
        setAllTrips(data);
      }
      if (error) {
        console.error("Error fetching trips");
      }
    }
  };

  return (
    <div className="p-4">
      User Account Page
      <div>User: {session?.user.email}</div>
      <div className="flex flex-col gap-4">
        {allTrips &&
          allTrips.map((trip, index) => (
            <div key={index}>
              <div className="font-semibold">
                {(trip.plan[0] as TripPlan0).trip_name}
              </div>
              <div className="w-[300px]">
                <LocationPhoto
                  photoUrl={trip.main_photo}
                  selectedPlace={(trip.plan[0] as TripPlan0).destination}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
