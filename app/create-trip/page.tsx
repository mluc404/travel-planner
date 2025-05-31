"use client";
import { useEffect, useState } from "react";
import { callAutocomplete } from "../api/places/callAutocomplete";
import { getPlaceDetails } from "../api/places/getPlaceDetails";
import { getPlacePhoto } from "../api/places/getPlacePhoto";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import debounce from "lodash.debounce";
import Image from "next/image";

export default function CreateTrip() {
  const [input, setInput] = useState<string>("");
  const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([]);
  const [selectedPlace, setSelectedPlace] =
    useState<PlaceAutocompleteResult | null>(null);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictions = debounce(async () => {
      const preds = await callAutocomplete(input);
      setPredictions(preds ?? []);
    }, 300);
    input.length > 2 && isSelecting && fetchPredictions();
  }, [input]);

  const handleSelect = async (place: PlaceAutocompleteResult) => {
    setInput(place.description);
    setSelectedPlace(place);
    setPredictions([]);
    setIsSelecting(false);
    console.log(place);

    const placeDetails = await getPlaceDetails(place.place_id);
    if (placeDetails.photos) {
      const photoRef = placeDetails.photos[0].photo_reference;
      const placePhoto = await getPlacePhoto(photoRef);
      setPhotoUrl(placePhoto);
    }
  };

  return (
    <div className="px-5 mt-8 sm:px-20 md:px-40">
      <h1 className="font-bold text-3xl">Trip Information</h1>
      <p className="text-gray-500 text-xl mt-2">
        Enter your trip information and we will generate a customized interary
      </p>
      <div className="mt-10">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 relative">
            <h2 className="text-xl font-semibold">
              Where would you like to go?
            </h2>
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
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
                    onClick={() => {
                      handleSelect(place);
                    }}
                  >
                    {place.description}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">How long is your trip</h2>
            <input
              type="text"
              className="input-primary"
              placeholder="Enter a number"
            />
          </div>
          {photoUrl && (
            <div className="relative w-[300px] h-[300px] mt-4">
              <Image
                src={photoUrl}
                alt={`Photo of ${selectedPlace?.description}`}
                fill
                className="object-cover mt-4 rounded-lg shadow-lg shadow-gray-500"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
