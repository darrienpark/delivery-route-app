import { LoadingButton } from "@mui/lab";
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
import classes from "./MapRouteSearch.module.css";

const Directions = ({ origin, destination, onDirections, onReset }) => {
  const dispatch = useDispatch();

  /**
   * Handler function and refs for resetting the form
   */
  const originRef = useRef();
  const destinationRef = useRef();

  const setOriginHandler = (addressData) => {
    onReset();
    dispatch(appActions.setWaypoints(null));
    dispatch(appActions.setOrigin(addressData));
  };

  const setDestinationHandler = (addressData) => {
    onReset();
    dispatch(appActions.setWaypoints(null));
    dispatch(appActions.setDestination(addressData));
  };

  const clearOriginHandler = () => {
    originRef.current.value = "";
    dispatch(appActions.clearOrigin());
    dispatch(appActions.setWaypoints(null));
    onReset();
  };

  const clearDestinationHandler = () => {
    destinationRef.current.value = "";
    dispatch(appActions.clearDestination());
    dispatch(appActions.setWaypoints(null));
    onReset();
  };

  const resetHandler = () => {
    dispatch(appActions.clearOrigin());
    dispatch(appActions.clearDestination());
    dispatch(appActions.setWaypoints(null));
    originRef.current.value = "";
    destinationRef.current.value = "";
    onReset();
  };

  /**
   * Handle http calls for submitting the route
   *
   * Use the correct url depending on testing scenario
   */
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const postRoute = async (payload) => {
    // const url = "https://sg-mock-api.lalamove.com/route";
    // const url = "https://sg-mock-api.lalamove.com/mock/route/500";
    const url = "https://sg-mock-api.lalamove.com/mock/route/success";

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Token retrieval error, failed to get route.`);
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      throw error;
    }
  };

  const getRoute = async (token) => {
    // const url = `https://sg-mock-api.lalamove.com/route/${token}`;
    const url = "https://sg-mock-api.lalamove.com/mock/route/success";
    // const url = "https://sg-mock-api.lalamove.com/mock/route/500";
    // const url = "https://sg-mock-api.lalamove.com/mock/route/inprogress";
    // const url = "https://sg-mock-api.lalamove.com/mock/route/failure";

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Route retrieval error, failed to get route.`);
      }

      const data = await response.json();

      if (data.status === "in progress") {
        return getRoute(token);
      } else if (data.status === "failure") {
        throw new Error(data.error);
      } else {
        // Save waypoints in store to be used for map markers but also need to return for directions api
        const waypoints = data.path.map((position) => {
          return {
            location: {
              lat: Number(position[0]),
              lng: Number(position[1]),
              stopover: true,
            },
          };
        });
        dispatch(appActions.setWaypoints(waypoints));
        return waypoints;
      }
    } catch (error) {
      throw error;
    }
  };

  const submitHandler = async () => {
    try {
      setIsLoading(true);
      setError(undefined);

      const token = await postRoute({
        origin: originRef.current.value,
        destination: destinationRef.current.value,
      });

      const waypoints = await getRoute(token);

      // eslint-disable-next-line no-undef
      const service = new google.maps.DirectionsService();
      service.route(
        {
          origin,
          destination,
          waypoints,
          travelMode: "DRIVING",
        },
        (result, status) => {
          if (status === "OK" && result) {
            onDirections(result);
          } else {
            setError(
              "Driving directions are not available for the selected addresses and/or waypoints."
            );
          }
        }
      );

      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
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
              inputRef={originRef}
              setAddress={(addressData) => {
                setOriginHandler(addressData);
              }}
              clearAddress={clearOriginHandler}
            />
            <AddressInput
              label="Destination"
              id="destination"
              inputRef={destinationRef}
              setAddress={(addressData) => {
                setDestinationHandler(addressData);
              }}
              clearAddress={clearDestinationHandler}
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
                <LoadingButton
                  loading={isLoading}
                  type="button"
                  variant="contained"
                  fullWidth
                  onClick={submitHandler}
                >
                  Calculate Route
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Directions;
