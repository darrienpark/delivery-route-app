import { useJsApiLoader } from "@react-google-maps/api";
import Map from "./components/Map";
import OverlaySpinner from "./components/OverlaySpinner";
import useCurrentLocation from "./hooks/useCurrentLocation";

const libraries = ["places"];

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_SECRET,
    libraries,
  });

  const currentLocation = useCurrentLocation();

  return (
    <>
      {(!currentLocation || !isLoaded) && <OverlaySpinner />}
      {currentLocation && (
        <>
          <Map currentLocation={currentLocation} />
        </>
      )}
    </>
  );
}

export default App;
