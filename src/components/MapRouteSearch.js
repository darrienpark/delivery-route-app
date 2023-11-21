import { Button, Card, CardContent, Grid } from "@mui/material";
import { Autocomplete } from "@react-google-maps/api";
import { createRef } from "react";
import classes from "./MapRouteSearch.module.css";
import { useDispatch } from "react-redux";
import { appActions } from "../store";

const MapRouteSearch = () => {
  const dispatch = useDispatch();

  const handleOriginSelect = () => {
    if (originRef.current) {
      const location = originRef.current.getPlace().geometry.location;
      const position = { lat: location.lat(), lng: location.lng() };
      dispatch(appActions.setOrigin(position));
    }
  };

  const handleDestinationSelect = () => {
    if (destinationRef.current) {
      const location = destinationRef.current.getPlace().geometry.location;
      const position = { lat: location.lat(), lng: location.lng() };
      dispatch(appActions.setDestination(position));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());
    console.log(data);
  };

  const originRef = createRef(null);
  const destinationRef = createRef(null);

  return (
    <div className={classes["card-container"]}>
      <Card className={classes.card}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Autocomplete
              onLoad={(auto) => (originRef.current = auto)}
              onPlaceChanged={handleOriginSelect}
            >
              <p className={classes.control}>
                <label htmlFor="origin">Origin</label>
                <input id="origin" name="origin" type="text" required />
              </p>
            </Autocomplete>
            <Autocomplete
              onLoad={(auto) => (destinationRef.current = auto)}
              onPlaceChanged={handleDestinationSelect}
            >
              <p className={classes.control}>
                <label htmlFor="destination">Destination</label>
                <input
                  id="destination"
                  name="destination"
                  type="text"
                  required
                />
              </p>
            </Autocomplete>
            <Grid container justifyContent="flex-end" spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button type="submit" variant="contained" fullWidth>
                  Calculate Route
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapRouteSearch;
