import { Trip } from "@/app/types";
import { TripPlan0 } from "@/app/types";
import { LocationPhoto } from "../create-trip/LocationPhoto";

interface TripCardProps {
  trip: Trip;
  handleClick: () => void;
}

export default function TripCard({ trip, handleClick }: TripCardProps) {
  return (
    <div
      className=" flex flex-col 
      cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
      onClick={() => handleClick()}
    >
      <div className="relative w-full aspect-[3/2]">
        <LocationPhoto
          photoUrl={trip.main_photo}
          selectedPlace={(trip.plan[0] as TripPlan0).destination}
        />
      </div>
      <div className="">
        <div className="font-semibold text-[1.1rem]">
          {(trip.plan[0] as TripPlan0).trip_name}
        </div>
        <div>
          <span>{(trip.plan[0] as TripPlan0).duration} - </span>
          <span>{(trip.plan[0] as TripPlan0).travelers}</span>
        </div>
      </div>
    </div>
  );
}
