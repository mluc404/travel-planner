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
    <div className="border-2 border-blue-400 rounded-2xl p-2 grid grid-cols-[150px_1fr]">
      <div className="relative w-[150px] h-[150px] border-red-400 border-2">
        {newPhoto && (
          <Image
            src={newPhoto}
            alt={`photo of ${place.place_name}`}
            // fill
            width={250}
            height={250}
            className="object-cotain rounded-lg"
          />
        )}
      </div>
      <div className="px-4">
        <div className="font-semibold">{place.place_name}</div>
        <div>{place.activity}</div>
        <div>{place.time_to_spend}</div>
      </div>
    </div>
  );
}
