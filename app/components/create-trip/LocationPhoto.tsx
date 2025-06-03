import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import Image from "next/image";

interface LocationPhotoProps {
  photoUrl: string;
  // selectedPlace: PlaceAutocompleteResult | null;
  selectedPlace: string;
}
export function LocationPhoto({ photoUrl, selectedPlace }: LocationPhotoProps) {
  return (
    <div className="relative w-[300px] h-[300px] mt-4">
      <Image
        src={photoUrl}
        // alt={`Photo of ${selectedPlace?.description}`}
        alt={`Photo of ${selectedPlace}`}
        fill
        className="object-cover mt-4 rounded-lg shadow-lg shadow-gray-500"
      />
    </div>
  );
}
