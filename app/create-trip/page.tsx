"use client";
import { useEffect, useState } from "react";
import { callAutocomplete } from "../api/places/callAutocomplete";
import {
  FindPlaceFromTextResponseData,
  PlaceAutocompleteResult,
} from "@googlemaps/google-maps-services-js";
import debounce from "lodash.debounce";

import { LocationInput } from "../components/create-trip/LocationInput";
import { TripInfoType } from "../types";
import { PeopleCount } from "../components/create-trip/PeopleCount";
import { TripDuration } from "../components/create-trip/TripDuration";
import { TripBudget } from "../components/create-trip/TripBudget";
import { LocationPhoto } from "../components/create-trip/LocationPhoto";

import { API_PROMPT } from "../constants/options";
import { generateTrip } from "../service/AiModal";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getPlaceFromText } from "../components/FindPlaceFromText";
import { getPlacePhoto } from "../api/places/getPlacePhoto";
import Image from "next/image";

export default function CreateTrip() {
  // States for LocationInput
  const [inputPlace, setInputPlace] = useState<string>("");
  const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([]);
  const [selectedPlace, setSelectedPlace] =
    useState<PlaceAutocompleteResult | null>(null);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // States for TripDuration
  const [dates, setDates] = useState<Date[] | null>(null);
  const [tripDays, setTripDays] = useState<number>(0);

  // State to store Trip Info
  const [tripInfo, setTripInfo] = useState<TripInfoType>({});
  // const[generatedPlan, setGeneratedPlan]=useState<>

  const updateTripInfo = (
    name: string,
    value: string | PlaceAutocompleteResult | number
  ) => {
    setTripInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch location suggestions
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to generate trip
  const handleGenerateTrip = async () => {
    if (
      !tripInfo.location ||
      !tripInfo.days ||
      !tripInfo.people ||
      !tripInfo.budget
    ) {
      alert("Please fill in the trip details");
    } else {
      setIsLoading(true);
      const FINAL_PROMPT = API_PROMPT.replace(
        "{TripLocation}",
        tripInfo?.location?.description ?? ""
      )
        .replace("{TripPeople}", tripInfo.people ?? "")
        .replace("{TripDuration}", tripInfo.days?.toString() ?? "")
        .replace("{TripBudget}", tripInfo.budget ?? "");

      console.log(FINAL_PROMPT);
      console.log(tripInfo);

      const response = await generateTrip(FINAL_PROMPT);
      console.log(response);

      // Insert the trip to supabase
      if (response) {
        const { data, error } = await supabase
          .from("trips")
          .insert({
            title: tripInfo.location,
            plan: response,
            main_photo: tripInfo.photo,
          })
          .select()
          .single();

        if (error) console.log(error.message);

        // Navigate to the trip page
        router.push("/trip");
        setIsLoading(false);
      }
      // if (response) {
      //   router.push("/trip");
      //   setIsLoading(false);
      // }
    }
  };

  // Testing find place photo from text
  const [data, setData] = useState<FindPlaceFromTextResponseData | null>(null);
  const [newPhoto, setNewPhoto] = useState<string | null>(null);
  useEffect(() => {
    const fetchPhoto = async () => {
      const response = await getPlaceFromText("St. James's Park");
      setData(response);
      const photo = await getPlacePhoto(
        response.candidates[0].photos[0].photo_reference
      );
      setNewPhoto(photo);
    };
    fetchPhoto();
  }, []);

  return (
    <div className="px-5 mt-8 sm:px-20 md:px-40 lg:px-80">
      <h1 className="font-bold text-3xl">Trip Information</h1>
      <p className="text-gray-500 text-xl mt-2">
        Enter your trip information and we will generate a customized itinerary
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

          <div className="flex justify-center">
            <button className="btn-primary" onClick={handleGenerateTrip}>
              Generate Trip
            </button>
          </div>
          {isLoading && <div>Loading...</div>}
          {photoUrl && (
            <LocationPhoto photoUrl={photoUrl} selectedPlace={selectedPlace} />
          )}

          {newPhoto && (
            <div className="relative w-full h-[200px] mt-4 sm:h-[300px] md:h-[400px]">
              This is from GetPlaceFromText
              <Image
                src={newPhoto}
                alt={`Photo of ${selectedPlace}`}
                fill
                className="object-cover mt-4 rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
