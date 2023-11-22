import { DirectionsRenderer, GoogleMap, MarkerF } from "@react-google-maps/api";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Directions from "./Directions.js";
import classes from "./Map.module.css";

const mapOptions = {
  disableDefaultUI: true,
  clickableIcons: false,
  mapId: "734f8096b3b6827e",
};

// Default: Hong Kong center. To use Google Maps location feature, check useCurrentLocation custom hook
const center = { lat: 22.3193, lng: 114.1694 };

const Map = () => {
  const origin = useSelector((state) => state.origin?.position);
  const destination = useSelector((state) => state.destination?.position);
  const waypoints = useSelector((state) => state.waypoints);
  const directions = useSelector((state) => state.directions);

  // Effect to adjust map view according to the markers
  const mapRef = useRef();
  const onLoad = useCallback((map) => (mapRef.current = map), []);

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
      if (waypoints) {
        waypoints.forEach((marker) => {
          bounds.extend({
            lat: marker.lat,
            lng: marker.lng,
          });
        });
      }
      mapRef.current?.fitBounds(bounds);
    }
  }, [origin, destination, waypoints]);

  return (
    <>
      <Directions />
      <GoogleMap
        zoom={14}
        center={center}
        mapContainerClassName={classes.map}
        options={mapOptions}
        onLoad={onLoad}
      >
        {directions && <DirectionsRenderer directions={directions} />}
        {origin && <MarkerF position={origin}></MarkerF>}
        {destination && <MarkerF position={destination}></MarkerF>}
        {waypoints &&
          waypoints.map((waypoint, index) => (
            <MarkerF key={index} position={waypoint}></MarkerF>
          ))}
      </GoogleMap>
    </>
  );
};

export default Map;
