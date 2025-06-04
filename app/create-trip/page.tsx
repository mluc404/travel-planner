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

import { API_PROMPT } from "../constants/options";
import { generateTrip } from "../service/AiModal";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import { getPlaceFromText } from "../components/FindPlaceFromText";
import { getPlacePhotoSmall } from "../api/places/getPlacePhotoSmall";

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

  const updateTripInfo = (
    name: string,
    value: string | PlaceAutocompleteResult | number
  ) => {
    setTripInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch location suggestions
  // Disable eslint bc it wants to add isSelecting to dependencies
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
        const responseJson = JSON.parse(response);
        const place_list = responseJson[0].place_list;
        const destination = responseJson[0].destination;

        const photoPromises = place_list.map(async (place_name: string) => {
          const placeDetails = await getPlaceFromText(
            `${place_name} in ${destination}`
          );
          if (placeDetails?.candidates?.[0]?.photos) {
            const photoRef =
              placeDetails.candidates[0].photos[0].photo_reference;
            const photo = await getPlacePhotoSmall(photoRef);
            return { place_name, photo };
          } else {
            console.log(`No photo found for ${place_name}`);
            return { place_name, photo: null };
          }
        });
        const fetchedPhotos = await Promise.all(photoPromises);
        console.log("fetchedPhotos:", fetchedPhotos);

        // create an obj place_photos to store the photos
        const place_photos_obj: { [key: string]: string | null } = {};
        fetchedPhotos.map((place) => {
          place_photos_obj[place.place_name] = place.photo;
        });
        console.log("place_photos_obj:", place_photos_obj);

        const { data, error } = await supabase
          .from("trips")
          .insert({
            destination_details: tripInfo.location,
            plan: response,
            main_photo: tripInfo.photo,
            place_photos: place_photos_obj,
          })
          .select()
          .single();

        if (error) console.log(error.message);

        // Navigate to the trip page
        router.push("/trip-details");
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="px-5 mt-4 sm:mt-8 sm:px-20 md:px-40 lg:px-80">
      <h1 className="font-bold text-3xl">Trip Information</h1>
      <p className="text-gray-500 text-xl mt-2">
        Enter your trip information and we will generate a customized itinerary
      </p>
      <div className="mt-2 sm:mt-8">
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

          <div className="flex flex-col items-center gap-2 justify-center">
            <button className="btn-primary" onClick={handleGenerateTrip}>
              Generate Trip
            </button>
            <div>Trips longer than 3 days require extra time</div>
            {isLoading && (
              // <div className="flex justify-center">
              <div>Loading...</div>
              // </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
