"use client";
import { useEffect, useState } from "react";
import { callAutocomplete } from "../api/places/callAutocomplete";
import { getPlaceDetails } from "../api/places/getPlaceDetails";
import { getPlacePhoto } from "../api/places/getPlacePhoto";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import debounce from "lodash.debounce";
import Image from "next/image";
import { Calendar } from "primereact/calendar";
import { travelParty } from "../constants/options";

export default function CreateTrip() {
  const [inputPlace, setInputPlace] = useState<string>("");
  const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([]);
  const [selectedPlace, setSelectedPlace] =
    useState<PlaceAutocompleteResult | null>(null);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const [dates, setDates] = useState<Date[] | null>(null);
  const [tripDays, setTripDays] = useState<number>(0);

  type TripInfoType = {
    location?: PlaceAutocompleteResult;
    days?: number;
    people?: string;
    budget?: string;
    photo?: string;
  };

  const [tripInfo, setTripInfo] = useState<TripInfoType>({});

  const updateTripInfo = (name: string, value: any) => {
    setTripInfo((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    console.log(tripInfo);
  }, [tripInfo]);

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
      console.log(daysDiff);
      setTripDays(daysDiff);
      updateTripInfo("days", daysDiff);
    }
  }, [dates]);

  // Function to handle when user selects a location
  const handleSelect = async (place: PlaceAutocompleteResult) => {
    setInputPlace(place.description);
    setSelectedPlace(place);
    setPredictions([]);
    setIsSelecting(false);
    console.log(place);

    // Get the photo data for that location
    const placeDetails = await getPlaceDetails(place.place_id);
    if (placeDetails.photos) {
      const photoRef = placeDetails.photos[0].photo_reference;
      const placePhoto = await getPlacePhoto(photoRef);
      setPhotoUrl(placePhoto);
      updateTripInfo("photo", placePhoto);
    }
  };

  // console.log(typeof photoUrl);

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
                    onClick={() => {
                      handleSelect(place);
                      updateTripInfo("location", place);
                    }}
                  >
                    {place.description}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col gap-2 ">
            <h2 className="text-xl font-semibold">How long is your trip</h2>
            <Calendar
              value={dates}
              onChange={(e) => {
                setDates(e.value as Date[] | null);
              }}
              selectionMode="range"
              // showIcon
              className="input-primary"
            />
          </div>
          <div className="flex flex-col gap-2 ">
            <h2 className="text-xl font-semibold">How many people</h2>
            <div className="w-full flex justify-around">
              {travelParty.map((item, index) => (
                <div
                  key={index}
                  className={`border-2 p-2 flex justify-center rounded cursor-pointer font-semibold ${
                    tripInfo.people === item.value &&
                    "bg-gray-500 text-white border-2 border-black"
                  } `}
                  onClick={() => updateTripInfo("people", item.value)}
                >
                  {item.title}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 ">
            <h2 className="text-xl font-semibold">Your budget</h2>
            <input
              type="texr"
              className="input-primary"
              placeholder="Estimated trip budget in USD"
              onChange={(e) => updateTripInfo("budget", e.target.value)}
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
