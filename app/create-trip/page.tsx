"use client";
import { useEffect, useState } from "react";
import { callAutocomplete } from "../api/places/callAutocomplete";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import debounce from "lodash.debounce";

import { LocationInput } from "../components/create-trip/LocationInput";
import { TripInfoType } from "../types";
import { PeopleCount } from "../components/create-trip/PeopleCount";
import { TripDuration } from "../components/create-trip/TripDuration";
import { TripBudget } from "../components/create-trip/TripBudget";
import { LocationPhoto } from "../components/create-trip/LocationPhoto";

export default function CreateTrip() {
  const [inputPlace, setInputPlace] = useState<string>("");
  const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([]);
  const [selectedPlace, setSelectedPlace] =
    useState<PlaceAutocompleteResult | null>(null);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const [dates, setDates] = useState<Date[] | null>(null);
  const [tripDays, setTripDays] = useState<number>(0);

  const [tripInfo, setTripInfo] = useState<TripInfoType>({});

  const updateTripInfo = (name: string, value: any) => {
    setTripInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch location suggestions
  useEffect(() => {
    const fetchPredictions = debounce(async () => {
      const preds = await callAutocomplete(inputPlace);
      setPredictions(preds ?? []);
    }, 300);
    inputPlace.length > 2 && isSelecting && fetchPredictions();
  }, [inputPlace]);

  // Calculate days when dates change
  useEffect(() => {
    if (dates && dates.length === 2) {
      const startDate = new Date(dates[0]);
      const endDate = new Date(dates[1]);
      const timeDiff = endDate.getTime() - startDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
      setTripDays(daysDiff);
      updateTripInfo("days", daysDiff);
    }
  }, [dates]);

  return (
    <div className="px-5 mt-8 sm:px-20 md:px-80">
      <h1 className="font-bold text-3xl">Trip Information</h1>
      <p className="text-gray-500 text-xl mt-2">
        Enter your trip information and we will generate a customized interary
      </p>
      <div className="mt-8">
        <div className="flex flex-col gap-4">
          <LocationInput
            inputPlace={inputPlace}
            setInputPlace={setInputPlace}
            predictions={predictions}
            setIsSelecting={setIsSelecting}
            setSelectedPlace={setSelectedPlace}
            setPredictions={setPredictions}
            updateTripInfo={updateTripInfo}
            setPhotoUrl={setPhotoUrl}
          />
          <TripDuration dates={dates} setDates={setDates} />
          <PeopleCount tripInfo={tripInfo} updateTripInfo={updateTripInfo} />
          <TripBudget updateTripInfo={updateTripInfo} />
          <div>
            <button
              className="btn-primary"
              onClick={() => console.log(tripInfo)}
            >
              Generate Trip
            </button>
          </div>
          {photoUrl && (
            <LocationPhoto photoUrl={photoUrl} selectedPlace={selectedPlace} />
          )}
        </div>
      </div>
    </div>
  );
}
