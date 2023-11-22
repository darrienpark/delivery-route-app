import { useJsApiLoader } from "@react-google-maps/api";
import Map from "./components/Map";
import OverlaySpinner from "./components/OverlaySpinner";

const libraries = ["places"];

function App() {
  // Load Google Maps API and relevant libraries
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_SECRET,
    libraries,
  });

  if (!isLoaded) {
    return <OverlaySpinner />;
  }

  return <Map />;
}

export default App;
