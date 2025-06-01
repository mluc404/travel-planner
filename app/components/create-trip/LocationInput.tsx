import { LocationInputProps } from "@/app/types";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import { getPlaceDetails } from "../../api/places/getPlaceDetails";
import { getPlacePhoto } from "../../api/places/getPlacePhoto";

export function LocationInput({
  inputPlace,
  setInputPlace,
  predictions,
  setIsSelecting,
  setSelectedPlace,
  setPredictions,
  updateTripInfo,
  setPhotoUrl,
}: LocationInputProps) {
  // Function to handle when user selects a location
  const handleSelect = async (place: PlaceAutocompleteResult) => {
    setInputPlace(place.description);
    setSelectedPlace(place);
    setPredictions([]);
    setIsSelecting(false);
    updateTripInfo("location", place);

    // Get the photo data for that location
    const placeDetails = await getPlaceDetails(place.place_id);
    if (placeDetails.photos) {
      const photoRef = placeDetails.photos[0].photo_reference;
      const placePhoto = await getPlacePhoto(photoRef);
      setPhotoUrl(placePhoto);
      updateTripInfo("photo", placePhoto);
    }
  };
  return (
    <div className="flex flex-col gap-2 relative">
      <h2 className="text-xl font-semibold">Where would you like to go?</h2>
      <input
        type="text"
        value={inputPlace}
        onChange={(e) => {
          setInputPlace(e.target.value);
          setIsSelecting(true);
        }}
        placeholder="Enter a city or a country"
        className="input-primary"
      />
      {predictions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 z-10 flex flex-col border-2 rounded">
          {predictions.map((place, index) => (
            <li
              key={index}
              className="cursor-pointer bg-white hover:bg-gray-600 hover:text-white
                  p-2 text-[1rem] font-semibold text-gray-700
                  border-b-2 border-gray-200 last:border-b-0"
              onClick={() => handleSelect(place)}
            >
              {place.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
