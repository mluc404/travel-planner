"use server";

import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client();

export async function callAutocomplete(input: string) {
  try {
    const response = await client.placeAutocomplete({
      params: {
        input,
        key: process.env.GOOGLE_PLACE_API_KEY as string,
      },
    });
    return response.data.predictions;
  } catch (error) {
    console.log(error);
  }
}
