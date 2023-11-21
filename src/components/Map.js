import { GoogleMap, Marker } from "@react-google-maps/api";
import useCurrentLocation from "../hooks/use-current-location";
import classes from "./Map.module.css";

const Map = () => {
  const { currentLocation, loading } = useCurrentLocation();

  const mapOptions = {
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  };

  return (
    <>
      {!loading && (
        <GoogleMap
          zoom={14}
          center={currentLocation}
          mapContainerClassName={classes["map-container"]}
          options={mapOptions}
        >
          <Marker position={currentLocation}></Marker>
        </GoogleMap>
      )}
    </>
  );
};

export default Map;
