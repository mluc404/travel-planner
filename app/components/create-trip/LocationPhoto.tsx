import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import Image from "next/image";

interface LocationPhotoProps {
  photoUrl: string;
  selectedPlace: PlaceAutocompleteResult | null | string;
  // selectedPlace: string;
}
export function LocationPhoto({ photoUrl, selectedPlace }: LocationPhotoProps) {
  return (
    <div className="relative w-full h-[200px] mt-4 sm:h-[300px] md:h-[400px]">
      <Image
        src={photoUrl}
        // alt={`Photo of ${selectedPlace?.description}`}
        alt={`Photo of ${selectedPlace}`}
        fill
        className="object-cover mt-4 rounded-lg"
      />
    </div>
  );
}
