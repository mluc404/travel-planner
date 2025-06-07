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
  days?: number;
  people?: string;
  budget?: string;
  photo?: string | null;
}

export interface PlaceInDayType {
  place_name: string;
  activity: string;
  time_to_spend: string;
}

export interface TripPlan0 {
  trip_name: string;
  destination: string;
  duration: string;
  travelers: number;
  place_list: string[];
}

export interface TripPlan1 {
  day: number;
  day_theme: string;
  places: PlaceInDayType[];
}

// export interface Trip {
//   id: string;
//   title: { description: string };
//   plan: [TripPlan0, ...TripPlan1[]];
//   created_at: string;
//   main_photo: string;
//   place_photos: { [key: string]: string };
//   email?: string;
// }

export interface Trip {
  id?: string;
  created_at?: string;
  email?: string;
  destination_details: PlaceAutocompleteResult;
  plan: [TripPlan0, ...TripPlan1[]] | string;
  main_photo: string | null;
  place_photos: { [key: string]: string | null };
}
