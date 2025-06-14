import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";

export interface LocationInputProps {
  inputPlace: string;
  setInputPlace: (value: string) => void;
  predictions: PlaceAutocompleteResult[];
  setIsSelecting: (value: boolean) => void;
  setSelectedPlace: (value: PlaceAutocompleteResult) => void;
  setPredictions: (value: PlaceAutocompleteResult[] | []) => void;
  updateTripInfo: (
    key: string,
    value: string | PlaceAutocompleteResult
  ) => void;
  setPhotoUrl: (value: string) => void;
}

export interface TripInfoType {
  location?: PlaceAutocompleteResult;
  days?: number | null;
  people?: string;
  budget?: string;
  photo?: string | null;
}

export interface PlaceInDayType {
  place_name: string;
  activity: string;
  time_to_spend: string;
  cost?: string;
}
export interface HotelType {
  hotel_name: string;
  hotel_address?: string;
  hotel_cost_per_night?: string;
}

export interface TripPlan0 {
  trip_name: string;
  destination: string;
  duration: string;
  travelers: number | string;
  budget?: string;
  place_list: string[];
}

export interface TripPlan1 {
  day: number;
  day_theme: string;
  places: PlaceInDayType[];
}

export interface Trip {
  id?: number;
  user_id?: string;
  created_at?: string;
  email?: string;
  destination_details: PlaceAutocompleteResult;
  plan: [TripPlan0, HotelType[], ...TripPlan1[]] | string;
  main_photo: string | null;
  place_photos: { [key: string]: string | null };
  hotel_photos: { [key: string]: string | null };
  isSaved?: boolean;
}
