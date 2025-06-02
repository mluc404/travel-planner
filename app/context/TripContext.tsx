"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { TripInfoType } from "../types";

interface TripContextType {
  tripInfo: TripInfoType;
  updateTripInfo: (key: string, value: any) => void;
  tripResponse: string | null;
  setTripResponse: (response: string | null) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [tripInfo, setTripInfo] = useState<TripInfoType>({});
  const [tripResponse, setTripResponse] = useState<string | null>(null);

  const updateTripInfo = (key: string, value: any) => {
    setTripInfo((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <TripContext.Provider
      value={{
        tripInfo,
        updateTripInfo,
        tripResponse,
        setTripResponse,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error("useTrip must be used within a TripProvider");
  }
  return context;
}
