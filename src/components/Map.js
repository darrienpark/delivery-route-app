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
  const [directions, setDirections] = useState();

  /**
   * Effect to adjust map view according to the markers
   */
  const mapRef = useRef();
  const onLoad = useCallback((map) => (mapRef.current = map), []);

  useEffect(() => {
    if (origin && !destination) {
      mapRef.current?.panTo(origin);
      mapRef.current?.setZoom(14);
    }
    if (!origin && destination) {
      mapRef.current?.panTo(destination);
      mapRef.current?.setZoom(14);
    }
    if (origin && destination) {
      const bounds = new window.google.maps.LatLngBounds();
      let markers = [origin, destination];
      if (waypoints) {
        const waypointPositions = waypoints.map((waypoint) => {
          return { lat: waypoint.location.lat, lng: waypoint.location.lng };
        });
        console.log(waypointPositions);
        markers = [...markers, ...waypointPositions];
      }

      markers.forEach((marker) => {
        bounds.extend({
          lat: marker.lat,
          lng: marker.lng,
        });
      });
      mapRef.current?.fitBounds(bounds);
    }
  }, [origin, destination, waypoints]);

  const onDirectionsHandler = (directions) => {
    setDirections(directions);
  };

  const resetHandler = () => {
    setDirections(null);
  };

  return (
    <>
      <Directions
        origin={origin}
        destination={destination}
        onDirections={(directions) => {
          onDirectionsHandler(directions);
        }}
        onReset={resetHandler}
      />
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
            <MarkerF
              key={index}
              position={{
                lat: waypoint.location.lat,
                lng: waypoint.location.lng,
              }}
            ></MarkerF>
          ))}
      </GoogleMap>
    </>
  );
};

export default Map;
