"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { callAutocomplete } from "../api/places/callAutocomplete";
import { getPlaceFromText } from "../api/places/FindPlaceFromText";
import { getPlacePhotoSmall } from "../api/places/getPlacePhotoSmall";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import debounce from "lodash.debounce";

import { TripInfoType, Trip } from "../types";
import { LocationInput } from "../components/create-trip/LocationInput";
import { PeopleCount } from "../components/create-trip/PeopleCount";
import { TripDuration } from "../components/create-trip/TripDuration";
import { TripBudget } from "../components/create-trip/TripBudget";

import { API_PROMPT } from "../constants/options";
import { generateTrip } from "../../lib/AiModal";
import { tripStorage } from "@/lib/trip-storage";
import Button from "@mui/material/Button";

export default function CreateTrip() {
  // States for LocationInput
  const [inputPlace, setInputPlace] = useState<string>("");
  const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([]);
  const [selectedPlace, setSelectedPlace] =
    useState<PlaceAutocompleteResult | null>(null);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // States for TripDuration
  const [tripDays, setTripDays] = useState<number>(0);

  // State to store Trip Info
  const [tripInfo, setTripInfo] = useState<TripInfoType>({});

  // State for submmit button
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

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
    }, 100);
    inputPlace.length >= 2 && isSelecting && fetchPredictions();
  }, [inputPlace]);

  useEffect(() => {
    console.log("number of days: ", tripDays);
    setTripDays(tripDays);
    updateTripInfo("days", tripDays);
  }, [tripDays]);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to generate trip
  const handleGenerateTrip = async () => {
    if (tripInfo.days) {
      if (tripInfo.days > 5) {
        alert("Please select trip duration 5 days or less");
        return;
      } else if (tripInfo.days <= 0) {
        alert("Please select an end date");
        return;
      }
    }

    if (
      tripInfo.budget?.split("").every((char) => char === "0") ||
      parseFloat(tripInfo.budget ?? "0") <= 0
    ) {
      alert("Please set a budget");
      return;
    }

    if (
      !tripInfo.location ||
      !tripInfo.people ||
      !tripInfo.budget ||
      !tripInfo.days
    ) {
      alert("Please fill in the trip details");
      return;
    } else {
      setIsLoading(true);
      setIsSubmitted(true);
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

      // Process response from gemini
      if (response) {
        const responseJson = JSON.parse(response);
        const place_list = responseJson[0].place_list;
        const hotel_list = responseJson[0].hotel_list;
        const destination = responseJson[0].destination;

        // Get photos of the places in itinerary
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

        // create an obj place_photos to store the photos
        const place_photos_obj: { [key: string]: string | null } = {};
        fetchedPhotos.map((place) => {
          place_photos_obj[place.place_name] = place.photo;
        });

        // Get photos of hotels in itinerary
        const hotelPhotoPromises = hotel_list.map(
          async (hotel_name: string) => {
            const placeDetails = await getPlaceFromText(
              `${hotel_name} in ${destination}`
            );
            if (placeDetails?.candidates?.[0]?.photos) {
              const photoRef =
                placeDetails.candidates[0].photos[0].photo_reference;
              const photo = await getPlacePhotoSmall(photoRef);
              return { hotel_name, photo };
            } else {
              console.log(`No photo found for ${hotel_name}`);
              return { hotel_name, photo: null };
            }
          }
        );
        const fetchedHotelPhotos = await Promise.all(hotelPhotoPromises);

        // create an obj hotels_photos to store the photos
        const hotel_photos_obj: { [key: string]: string | null } = {};
        fetchedHotelPhotos.map((hotel) => {
          hotel_photos_obj[hotel.hotel_name] = hotel.photo;
        });

        // Save pending trip to local storage
        const pendingTrip: Trip = {
          destination_details: tripInfo.location,
          plan: responseJson,
          main_photo: tripInfo.photo ?? null,
          place_photos: place_photos_obj,
          hotel_photos: hotel_photos_obj,
          isSaved: false,
        };
        tripStorage.saveTrip(pendingTrip);
        const localStoredTrip = tripStorage.getTrip();
        console.log("Local Stored Trip", localStoredTrip);

        // Navigate to the trip page
        router.push("/trips/temp");
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="px-5 mt-4 sm:mt-6 sm:px-20 md:px-40 lg:px-60 xl:px-80">
      {/* <h1 className="font-bold text-3xl">Craft Your Perfect Trip</h1> */}
      <h1 className="font-bold text-3xl">Plan Your Next Getaway</h1>
      {/* <h1 className="font-bold text-3xl">Plan Your Dream Getaway</h1> */}
      <p className="text-gray-300 text-[1.1rem] mt-2">
        Share a few details, and we&apos;ll recommend travel spots and hotels
        for you!
      </p>
      <div className="mt-4 sm:mt-6">
        <div className="flex flex-col gap-3">
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
          <TripDuration setDates={setTripDays} />
          <PeopleCount tripInfo={tripInfo} updateTripInfo={updateTripInfo} />
          <TripBudget updateTripInfo={updateTripInfo} />

          <div className="flex justify-center mt-4">
            <Button
              loading={isSubmitted}
              variant="outlined"
              sx={{
                color: "white",
                // borderColor: "white",
                backgroundColor: "rgba(59, 130, 246, 0.8)",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: "600",
                "&:hover": {
                  backgroundColor: "rgba(59, 130, 246, 1)",
                },
                "& .MuiCircularProgress-root": {
                  color: "white",
                },
              }}
              onClick={handleGenerateTrip}
            >
              Launch My Adventure &#x2708;
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
