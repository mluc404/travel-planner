import { LocationInputProps } from "@/app/types";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import { getPlaceDetails } from "../../api/places/getPlaceDetails";
import { getPlacePhoto } from "../../api/places/getPlacePhoto";
import { useEffect, useState } from "react";

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
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // Listen to key press event while selecting a location
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (predictions.length === 0) return;
      switch (e.key) {
        case "ArrowDown":
          console.log("down");
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < predictions.length ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          console.log("up");
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          console.log("enter");

          if (selectedIndex >= 0 && selectedIndex < predictions.length) {
            console.log("selected:", selectedIndex);
            handleSelect(predictions[selectedIndex]);
          }
          break;
      }
    };
    window.addEventListener("keydown", handleKeydown);

    return () => window.removeEventListener("keydown", handleKeydown);
  }, [selectedIndex, predictions]);

  // Reset selected index when predictions changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [predictions]);

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
              className={`cursor-pointer
                  p-2 text-[1rem] font-semibold text-gray-700
                  border-b-2 border-gray-200 last:border-b-0
                  ${
                    selectedIndex === index
                      ? "bg-gray-600 text-white"
                      : " bg-white hover:bg-gray-600 hover:text-white"
                  }
                  `}
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
