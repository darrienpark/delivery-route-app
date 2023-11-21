import { useJsApiLoader } from "@react-google-maps/api";

import Map from "./components/Map";
import OverlaySpinner from "./components/UI/OverlaySpinner";
import { useSelector } from "react-redux";
import useCurrentLocation from "./hooks/use-current-location";

function App() {
  useCurrentLocation();
  const currentLocation = useSelector((state) => state.currentLocation);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_SECRET,
  });

  if (!isLoaded) {
    return <OverlaySpinner />;
  }

  return (
    <>
      {!currentLocation && <OverlaySpinner />}
      {currentLocation && <Map currentLocation={currentLocation} />}
    </>
  );
}

export default App;
