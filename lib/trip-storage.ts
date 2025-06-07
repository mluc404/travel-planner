import { Trip } from "@/app/types";

export const tripStorage = {
  saveTrip: (trip: Trip) => {
    localStorage.setItem("pendingTrip", JSON.stringify(trip));
  },

  getTrip: () => {
    const trip = localStorage.getItem("pendingTrip");
    return trip ? JSON.parse(trip) : null;
  },

  clearTrip: () => {
    localStorage.removeItem("pendingTrip");
  },
};
