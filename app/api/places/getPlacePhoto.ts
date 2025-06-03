"use server";

import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client();

export async function getPlacePhoto(photoRef: string) {
  const response = await client.placePhoto({
    params: {
      photoreference: photoRef,
      maxwidth: 2000,
      key: process.env.GOOGLE_PLACE_API_KEY as string,
    },
    responseType: "arraybuffer",
  });

  // Convert the arraybuffer to a base64 string so <Image> can use
  const base64 = Buffer.from(response.data).toString("base64");
  return `data:image/jpeg;base64,${base64}`;
}
