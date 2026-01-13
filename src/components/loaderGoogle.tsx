"use client";

import { useLoadScript } from "@react-google-maps/api";
import { createContext, useContext, ReactNode } from "react";

const libraries: ("places")[] = ["places"];

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: Error | undefined;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: undefined,
});

export const useGoogleMaps = () => useContext(GoogleMapsContext);

export const GoogleMapsProvider = ({ children }: { children: ReactNode }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
    language: "en",
  });

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};