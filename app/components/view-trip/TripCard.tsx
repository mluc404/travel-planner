import { Trip } from "@/app/types";
import { TripPlan0 } from "@/app/types";
import { LocationPhoto } from "../create-trip/LocationPhoto";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";

interface TripCardProps {
  trip: Trip;
  handleClick: () => void;
  removeTrip: (e: React.MouseEvent) => void;
}

export default function TripCard({
  trip,
  handleClick,
  removeTrip,
}: TripCardProps) {
  return (
    <div
      className=" flex flex-col gap-2
      cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
      onClick={() => handleClick()}
    >
      <div className="relative w-full aspect-[3/2]">
        <LocationPhoto
          photoUrl={trip.main_photo}
          selectedPlace={(trip.plan[0] as TripPlan0).destination}
        />
      </div>
      <div className="flex justify-between items-center">
        <div>
          <div className="font-semibold text-[1.1rem]">
            {(trip.plan[0] as TripPlan0).trip_name}
          </div>
          <div>
            <span>{(trip.plan[0] as TripPlan0).duration} • </span>
            <span>
              {(trip.plan[0] as TripPlan0).travelers === "1 person"
                ? "Solo "
                : (trip.plan[0] as TripPlan0).travelers}{" "}
              •{" "}
            </span>
            <span>${(trip.plan[0] as TripPlan0).budget} </span>
          </div>
        </div>
        <div className="">
          <button
            className="btn-second"
            onClick={(e) => {
              e.stopPropagation();
              removeTrip(e);
            }}
          >
            {/* <RemoveIcon /> */}
            <BookmarkRemoveIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
