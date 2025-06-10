import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import Image from "next/image";
import backupBG from "@/public/backupBG.svg";

interface LocationPhotoProps {
  photoUrl: string | null;
  selectedPlace: PlaceAutocompleteResult | null | string;
}
export function LocationPhoto({ photoUrl, selectedPlace }: LocationPhotoProps) {
  return (
    <>
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt={`Photo of ${selectedPlace}`}
          fill
          className="object-cover rounded-lg"
        />
      ) : (
        <Image
          src={backupBG}
          alt={`Back up background photo`}
          fill
          className="object-cover rounded-lg"
        />
      )}
    </>
  );
}
