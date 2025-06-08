import { Trip } from "@/app/types";
import { TripPlan0 } from "@/app/types";
import { LocationPhoto } from "../create-trip/LocationPhoto";

export default function TripCard({ trip }: { trip: Trip }) {
  return (
    <div>
      <div
        className="border-2 border-gray-400 w-full md:w-[50%] sm:h-[140px]
    rounded-2xl p-2 grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr]
    items-center cursor-pointer hover:scale-105 hover:bg-gray-200
    transition-all duration-300 ease-in-out"
      >
        <div className="relative w-[100px] h-[100px] sm:w-[120px] sm:h-[120px]">
          <LocationPhoto
            photoUrl={trip.main_photo}
            selectedPlace={(trip.plan[0] as TripPlan0).destination}
          />
        </div>
        {/* px units are temporary */}
        <div className="px-4 h-[100px] sm:h-[120px]">
          <div className="font-semibold">
            {(trip.plan[0] as TripPlan0).trip_name}
          </div>
          <div>{(trip.plan[0] as TripPlan0).duration}</div>
          <div>{(trip.plan[0] as TripPlan0).travelers}</div>
        </div>
      </div>
    </div>
  );
}
