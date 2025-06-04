import Image from "next/image";

interface PlaceCardProps {
  place: {};
  photo: string;
}

export function PlaceCard({ place, photo }: PlaceCardProps) {
  return (
    <div className="border-2 border-gray-400 w-full  sm:w-[400px] rounded-2xl p-2 grid grid-cols-[100px_1fr] items-center">
      <div className="relative w-[100px] h-[100px]  ">
        {photo && (
          <Image
            src={photo}
            alt={`photo of ${place.place_name}`}
            fill
            className="object-cover rounded-lg"
          />
        )}
      </div>
      <div className="px-2 sm:px-4 flex flex-col gap-0 sm:gap:2 self-start min-h-[100px] ">
        <div className="font-semibold leading-tight">{place.place_name}</div>
        <div className="leading-tight text-[.9rem]">{place.activity}</div>
        <div className="self-end mt-auto text-[.9rem]">
          &#x231B; {place.time_to_spend}
        </div>
      </div>
    </div>
  );
}
