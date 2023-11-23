import { useEffect, useState } from "react";

/**
 * Custom hook to use browser location feature
 *
 * @returns object - current location lat, long
 */
const useCurrentLocation = () => {
  const [currentLocation, setCurrentLocation] = useState(undefined);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          setCurrentLocation({ lat, lng });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return currentLocation;
};

export default useCurrentLocation;
