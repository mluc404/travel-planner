import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import Image from "next/image";

interface LocationPhotoProps {
  photoUrl: string | null;
  selectedPlace: PlaceAutocompleteResult | null | string;
}
export function LocationPhoto({ photoUrl, selectedPlace }: LocationPhotoProps) {
  return (
    // <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px]">
    // <div className="relative w-full h-[50vw] sm:h-[30vw]">
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
    // </div>
  );
}
