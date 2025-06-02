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
  photo?: string;
}
