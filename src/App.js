import { useJsApiLoader } from "@react-google-maps/api";

import Map from "./components/Map";
import OverlaySpinner from "./components/UI/OverlaySpinner";
import useCurrentLocation from "./hooks/use-current-location";

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_SECRET,
  });

  const currentLocation = useCurrentLocation();

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
