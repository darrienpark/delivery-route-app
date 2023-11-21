import { useState, useEffect } from "react";

const useCurrentLocation = () => {
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setLoading(false);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          setLoading(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  }, []);

  return { currentLocation, loading };
};

export default useCurrentLocation;
