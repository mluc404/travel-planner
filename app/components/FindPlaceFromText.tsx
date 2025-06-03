"use server";

import { Client, PlaceInputType } from "@googlemaps/google-maps-services-js";

const client = new Client();

export async function getPlaceFromText(placeName: string) {
  const response = await client.findPlaceFromText({
    params: {
      input: placeName,
      inputtype: PlaceInputType.textQuery,
      key: process.env.GOOGLE_PLACE_API_KEY as string,
      fields: ["photos", "place_id"],
    },
  });

  return response.data;
}
