import { PlaceInDayType } from "@/app/types";
import Image from "next/image";
import backupBG from "@/public/backupBG.svg";

interface PlaceCardProps {
  place: PlaceInDayType;
  destination: string;
  photo: string | null;
}

export function PlaceCard({ place, destination, photo }: PlaceCardProps) {
  const clickPlaceCard = () => {
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(
        place.place_name + " in " + destination
      )}`,
      "_blank"
    );
  };
  return (
    <div
      className="border-2 border-gray-400 w-full sm:h-[140px] 
    rounded-2xl p-2 grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr]
    items-center cursor-pointer hover:scale-105 hover:bg-gray-700
    transition-all duration-300 ease-in-out"
      onClick={() => clickPlaceCard()}
    >
      <div className="relative w-[100px] sm:w-[120px] h-[100px] sm:h-[120px]">
        <Image
          src={photo ? photo : backupBG}
          alt={`photo of ${place.place_name}`}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div className="px-2 sm:px-4 flex flex-col gap-0 sm:gap:2 self-start min-h-[100px] sm:h-[120px] ">
        <div className="font-semibold leading-tight">{place.place_name}</div>
        <div className="leading-tight text-[.9rem]">{place.activity}</div>
        <div className="mt-auto flex justify-between">
          <div className="text-[.9rem]">$ {place.cost}</div>
          <div className="text-[0.9rem]"> &#x231B; {place.time_to_spend}</div>
        </div>
      </div>
    </div>
  );
}
