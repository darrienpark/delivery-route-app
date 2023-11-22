import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { useCallback, useEffect, useRef } from "react";
import classes from "./Map.module.css";
import RouteSearch from "./RouteSearch";
import { useSelector } from "react-redux";

const mapOptions = {
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  zoomControl: false,
  mapId: "734f8096b3b6827e",
};

const Map = ({ currentLocation }) => {
  const origin = useSelector((state) => state.origin);
  const destination = useSelector((state) => state.destination);

  useEffect(() => {
    if (origin && !destination) {
      mapRef.current?.panTo(origin);
      return;
    }
    if (!origin && destination) {
      mapRef.current?.panTo(destination);
      return;
    }

    if (origin && destination) {
      const bounds = new window.google.maps.LatLngBounds();
      [origin, destination].forEach((marker) => {
        bounds.extend({
          lat: marker.lat,
          lng: marker.lng,
        });
      });
      mapRef.current?.fitBounds(bounds);
    }
  }, [origin, destination]);

  const mapRef = useRef();
  const onLoad = useCallback((map) => (mapRef.current = map), []);

  return (
    <>
      <RouteSearch />
      <GoogleMap
        zoom={14}
        center={currentLocation}
        mapContainerClassName={classes.map}
        options={mapOptions}
        onLoad={onLoad}
      >
        {origin && <MarkerF position={origin}></MarkerF>}
        {destination && <MarkerF position={destination}></MarkerF>}
      </GoogleMap>
    </>
  );
};

export default Map;
