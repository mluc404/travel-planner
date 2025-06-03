"use server";

import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client();

export async function getPlacePhotoSmall(photoRef: string) {
  const response = await client.placePhoto({
    params: {
      photoreference: photoRef,
      maxwidth: 400,
      key: process.env.GOOGLE_PLACE_API_KEY as string,
    },
    responseType: "arraybuffer",
  });

  // Convert the arraybuffer to a base64 string so <Image> can use
  const base64 = Buffer.from(response.data).toString("base64");
  return `data:image/jpeg;base64,${base64}`;
}
