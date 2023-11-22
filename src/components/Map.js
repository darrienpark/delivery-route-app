import { DirectionsRenderer, GoogleMap, MarkerF } from "@react-google-maps/api";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import classes from "./Map.module.css";
import RouteSearch from "./RouteSearch";

const mapOptions = {
  disableDefaultUI: true,
  clickableIcons: false,
  mapId: "734f8096b3b6827e",
};

const Map = ({ currentLocation }) => {
  const origin = useSelector((state) => state.origin);
  const destination = useSelector((state) => state.destination);
  const mapRef = useRef();
  const onLoad = useCallback((map) => (mapRef.current = map), []);
  const [directions, setDirections] = useState();

  useEffect(() => {
    if (origin && !destination) {
      mapRef.current?.panTo(origin);
    }
    if (!origin && destination) {
      mapRef.current?.panTo(destination);
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
    setDirections(null);
  }, [origin, destination]);

  const fetchDirectionsHandler = () => {
    // eslint-disable-next-line no-undef
    const service = new google.maps.DirectionsService();
    service.route(
      // eslint-disable-next-line no-undef
      { origin, destination, travelMode: google.maps.TravelMode.DRIVING },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        }
      }
    );
  };

  return (
    <>
      <RouteSearch fetchDirections={fetchDirectionsHandler} />
      <GoogleMap
        zoom={14}
        center={currentLocation}
        mapContainerClassName={classes.map}
        options={mapOptions}
        onLoad={onLoad}
      >
        {directions && <DirectionsRenderer directions={directions} />}
        {origin && <MarkerF position={origin}></MarkerF>}
        {destination && <MarkerF position={destination}></MarkerF>}
      </GoogleMap>
    </>
  );
};

export default Map;
