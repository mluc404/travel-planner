import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import Image from "next/image";

interface LocationPhotoProps {
  photoUrl: string;
  selectedPlace: PlaceAutocompleteResult | null | string;
}
export function LocationPhoto({ photoUrl, selectedPlace }: LocationPhotoProps) {
  return (
    // <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px]">
    <div className="relative w-full h-[30vh] md:h-[max(200px,50vh)]">
      <Image
        src={photoUrl}
        alt={`Photo of ${selectedPlace}`}
        fill
        className="object-cover rounded-lg"
      />
    </div>
  );
}
