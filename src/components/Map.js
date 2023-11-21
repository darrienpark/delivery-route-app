import { GoogleMap, MarkerF } from "@react-google-maps/api";
import classes from "./Map.module.css";
import { useSelector } from "react-redux";

const Map = ({ currentLocation }) => {
  const mapOptions = {
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: false,
    mapId: "734f8096b3b6827e",
  };

  return (
    <>
      <GoogleMap
        zoom={14}
        center={currentLocation}
        mapContainerClassName={classes.map}
        options={mapOptions}
      ></GoogleMap>
    </>
  );
};

export default Map;
