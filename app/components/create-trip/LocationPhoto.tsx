import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import Image from "next/image";

interface LocationPhotoProps {
  photoUrl: string | null;
  selectedPlace: PlaceAutocompleteResult | null | string;
}
export function LocationPhoto({ photoUrl, selectedPlace }: LocationPhotoProps) {
  return (
    <>
      {photoUrl && (
        <Image
          src={photoUrl}
          alt={`Photo of ${selectedPlace}`}
          fill
          className="object-cover rounded-lg"
        />
      )}
    </>
  );
}
