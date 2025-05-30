"use client";
import { useState } from "react";
import Autocomplete from "react-google-autocomplete";

type PlaceResult = {
  place_id: string;
  name: string;
  formatted_address: string;
};

export default function CreateTrip() {
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  return (
    <div className="px-5 mt-8 sm:px-20 md:px-40">
      <h1 className="font-bold text-3xl">Trip Information</h1>
      <p className="text-gray-500 text-xl mt-2">
        Enter your trip information and we will generate a customized interary
      </p>
      <div className="mt-10">
        <div>
          <h2 className="text-xl font-semibold">Where would you like to go?</h2>
          <Autocomplete
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}
            onPlaceSelected={(place: PlaceResult) => {
              console.log(place);
              setSelectedPlace(place);
            }}
            options={{
              types: ["locality", "country"],
              fields: ["place_id", "name", "formatted_address"],
            }}
            placeholder="Enter a city or country"
            className="w-[100%] md:w-[80%] border-2 border-gray-500 p-2 rounded font-semibold text-gray-700 mt-2"
          />
          {selectedPlace && (
            <div className="mt-2">
              Selected: <strong>{selectedPlace.name}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
