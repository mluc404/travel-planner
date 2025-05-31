"use server";

import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client();

export async function getPlaceDetails(placeId: string) {
  const response = await client.placeDetails({
    params: {
      place_id: placeId,
      key: process.env.GOOGLE_PLACE_API_KEY as string,
      fields: ["photos"],
    },
  });

  return response.data.result;
}
