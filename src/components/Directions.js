import {
  Alert,
  AlertTitle,
  Button,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { appActions } from "../store/store";
import AddressInput from "./AddressInput";
import CalculateButton from "./CalculateButton";
import classes from "./MapRouteSearch.module.css";

const Directions = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState();

  const errorHandler = (error) => {
    setError(error);
  };

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

  const resetHandler = () => {
    dispatch(appActions.clearOrigin());
    dispatch(appActions.clearDestination());
    dispatch(appActions.setWaypoints(null));
    originRef.current.value = "";
    destinationRef.current.value = "";
  };

  const originRef = useRef();
  const destinationRef = useRef();

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
              inputRef={originRef}
              setAddress={(addressData) => {
                setAddressHandler("origin", addressData);
              }}
              clearAddress={() => {
                clearAddressHandler("origin");
              }}
            />
            <AddressInput
              label="Destination"
              id="destination"
              inputRef={destinationRef}
              setAddress={(addressData) => {
                setAddressHandler("destination", addressData);
              }}
              clearAddress={() => {
                clearAddressHandler("destination");
              }}
            />

            <Grid container justifyContent="flex-end" spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  type="button"
                  variant="outlined"
                  fullWidth
                  onClick={resetHandler}
                >
                  Reset
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                {" "}
                <CalculateButton
                  onError={(error) => {
                    errorHandler(error);
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
