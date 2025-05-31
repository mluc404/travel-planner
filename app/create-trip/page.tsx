"use client";
import { useEffect, useState } from "react";
import { callAutocomplete } from "../api/places/callAutocomplete";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";

export default function CreateTrip() {
  const [input, setInput] = useState<string>("");
  const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([]);
  const [selectedPlace, setSelectedPlace] =
    useState<PlaceAutocompleteResult | null>(null);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);

  useEffect(() => {
    const fetchPredictions = async () => {
      const preds = await callAutocomplete(input);
      setPredictions(preds ?? []);
      console.log(preds);
    };
    input.length > 2 && isSelecting && fetchPredictions();
  }, [input]);

  const handleSelect = (place: PlaceAutocompleteResult) => {
    setInput(place.description);
    setSelectedPlace(place);
    setPredictions([]);
    setIsSelecting(false);
  };
  return (
    <div className="px-5 mt-8 sm:px-20 md:px-40">
      <h1 className="font-bold text-3xl">Trip Information</h1>
      <p className="text-gray-500 text-xl mt-2">
        Enter your trip information and we will generate a customized interary
      </p>
      <div className="mt-10">
        <div>
          <h2 className="text-xl font-semibold">Where would you like to go?</h2>

          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setIsSelecting(true);
            }}
            placeholder="Enter a city or a country"
            className="cursor-pointer px-2 py-1 text-[1rem] font-semibold text-gray-700 border-2"
          />
        </div>
        <div>
          {predictions.length > 0 && (
            <ul className="flex flex-col gap-2 border-2 rounded">
              {predictions.map((place, index) => (
                <li
                  key={index}
                  className="cursor-pointer hover:bg-gray-600 hover:text-white px-2 py-1 text-[1rem] font-semibold text-gray-700"
                  onClick={() => {
                    handleSelect(place);
                  }}
                >
                  {place.description}
                </li>
              ))}
            </ul>
          )}
          <div>{selectedPlace?.description}</div>
        </div>
      </div>
    </div>
  );
}
