import {
  Alert,
  AlertTitle,
  Button,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { appActions } from "../store/store";
import AddressInput from "./AddressInput";
import classes from "./MapRouteSearch.module.css";
import CalculateButton from "./CalculateButton";
import { useState } from "react";

const Directions = ({ fetchDirections }) => {
  const dispatch = useDispatch();
  const [error, setError] = useState();

  const setAddressHandler = (addressType, addressData) => {
    if (addressType === "origin") {
      dispatch(appActions.setOrigin(addressData));
    }
    if (addressType === "destination") {
      dispatch(appActions.setDestination(addressData));
    }
  };

  const clearAddressHandler = (addressType) => {
    if (addressType === "origin") {
      dispatch(appActions.clearOrigin());
    }
    if (addressType === "destination") {
      dispatch(appActions.clearDestination());
    }
  };

  const onErrorHandler = (error) => {
    setError(error);
  };

  return (
    <div className={classes["card-container"]}>
      {error && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      <Card className={classes.card}>
        <CardContent>
          <form>
            <AddressInput
              label="Origin"
              id="origin"
              setAddress={(addressData) => {
                setAddressHandler("origin", addressData);
              }}
              clearAddress={() => {
                clearAddressHandler("origin");
              }}
              required
            />
            <AddressInput
              label="Destination"
              id="destination"
              setAddress={(addressData) => {
                setAddressHandler("destination", addressData);
              }}
              clearAddress={() => {
                clearAddressHandler("destination");
              }}
              required
            />

            <Grid container justifyContent="flex-end" spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button type="button" variant="outlined" fullWidth>
                  Reset
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                {" "}
                <CalculateButton
                  fetchDirections={() => {
                    fetchDirections();
                  }}
                  onError={(error) => {
                    onErrorHandler(error);
                  }}
                />
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Directions;
