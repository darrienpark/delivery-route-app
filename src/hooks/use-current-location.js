import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { appActions } from "../store";

const useCurrentLocation = () => {
  const [currentLocation, setCurrentLocation] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          setCurrentLocation({ lat, lng });
          dispatch(appActions.setOrigin(currentLocation));
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
