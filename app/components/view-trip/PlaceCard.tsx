import { getPlacePhotoSmall } from "@/app/api/places/getPlacePhotoSmall";
import { FindPlaceFromTextResponseData } from "@googlemaps/google-maps-services-js";
import { useState, useEffect } from "react";
import { getPlaceFromText } from "../FindPlaceFromText";
import Image from "next/image";

interface PlaceCardProps {
  place: {};
  location: string;
}

export function PlaceCard({ place, location }: PlaceCardProps) {
  // Find place photo from text
  const [data, setData] = useState<FindPlaceFromTextResponseData | null>(null);
  const [newPhoto, setNewPhoto] = useState<string | null>(null);
  useEffect(() => {
    const fetchPhoto = async () => {
      const response = await getPlaceFromText(
        `${place.place_name} in ${location}`
      );
      setData(response);
      const photo = await getPlacePhotoSmall(
        response.candidates[0].photos[0].photo_reference
      );
      setNewPhoto(photo);
    };
    fetchPhoto();
  }, []);

  return (
    <div className="border-2 border-gray-400 w-full h-[120px] sm:w-[400px] rounded-2xl p-2 grid grid-cols-[100px_1fr] items-center">
      <div className="relative w-[100px] h-[100px] ">
        {newPhoto && (
          <Image
            src={newPhoto}
            alt={`photo of ${place.place_name}`}
            fill
            className="object-cover rounded-lg"
          />
        )}
      </div>
      <div className="px-2 sm:px-4 flex flex-col gap-0 sm:gap:2 self-start min-h-[100px] ">
        <div className="font-semibold leading-tight">{place.place_name}</div>
        <div className="leading-tight">{place.activity}</div>
        <div className="self-end mt-auto">&#x231B; {place.time_to_spend}</div>
      </div>
    </div>
  );
}
