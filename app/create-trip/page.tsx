"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

type PlaceOption = {
  label: string;
  value: {
    description: string;
    place_id: string;
    reference: string;
  };
};

export default function CreateTrip() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceOption | null>(null);

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      setIsScriptLoaded(true);
    }
  }, []);

  console.log(selectedPlace);

  return (
    <div className="px-5 mt-8 sm:px-20 md:px-40">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}&libraries=places&loading=async`}
        onLoad={() => setIsScriptLoaded(true)}
      />

      <h1 className="font-bold text-3xl">Trip Information</h1>
      <p className="text-gray-500 text-xl mt-2">
        Enter your trip information and we will generate a customized interary
      </p>
      <div className="mt-10">
        <div>
          <h2 className="text-xl font-semibold">Where would you like to go?</h2>
          {isScriptLoaded && (
            <GooglePlacesAutocomplete
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}
              selectProps={{
                value: selectedPlace,
                onChange: (newValue) => {
                  setSelectedPlace(newValue);
                },
              }}
            />
          )}
          {selectedPlace && (
            <p className="mt-2 text-gray-600">
              Selected: {selectedPlace.label}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
