import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { appActions } from "../store/index.js";

const useCurrentLocation = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          dispatch(appActions.setCurrentLocation({ lat, lng }));
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [dispatch]);
};

export default useCurrentLocation;
