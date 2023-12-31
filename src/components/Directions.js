import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AlertTitle,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  Switch,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { appActions } from "../store/store";
import AddressInput from "./AddressInput";
import classes from "./Directions.module.css";

const Directions = ({ origin, destination, onDirections, clearDirections }) => {
  const dispatch = useDispatch();

  /**
   * Form Data and Erro management
   */
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
  });

  const [formErrors, setFormErrors] = useState({
    origin: false,
    destination: false,
  });

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  /**
   * Handler function and refs for resetting the form
   */
  const setAddressHandler = (addressData, id) => {
    // Reset stuff on screen
    clearDirections();
    dispatch(appActions.setWaypoints(null));

    // Store address information for use in other components
    switch (id) {
      case "origin":
        dispatch(appActions.setOrigin(addressData));
        break;
      case "destination":
        dispatch(appActions.setDestination(addressData));
        break;
      default:
        break;
    }

    // Reflect value in form
    setFormData((prevData) => ({
      ...prevData,
      [id]: addressData.fullString,
    }));

    // Update errors
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [id]: !formData[id],
    }));
  };

  const clearAddressHandler = (id) => {
    // Reset stuff on screen
    clearDirections();
    dispatch(appActions.setWaypoints(null));

    // Clear stored value
    switch (id) {
      case "origin":
        dispatch(appActions.clearOrigin());
        break;
      case "destination":
        dispatch(appActions.clearDestination());
        break;
      default:
        break;
    }

    // Reflect changes in form
    setFormData((prevData) => ({
      ...prevData,
      [id]: "",
    }));
  };

  const resetHandler = () => {
    dispatch(appActions.clearOrigin());
    dispatch(appActions.clearDestination());
    dispatch(appActions.setWaypoints(null));
    clearDirections();
    setFormData({ origin: "", destination: "" });
    setError(null);
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
    setError(undefined);

    const newErrors = {
      origin: !origin,
      destination: !destination,
    };

    setFormErrors(newErrors);

    console.log(newErrors);

    if (newErrors.origin || newErrors.destination) return;

    try {
      setIsLoading(true);

      const token = await postRoute({
        origin: formData.origin,
        destination: formData.destination,
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
          optimizeWaypoints: optimizeTravel,
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

  /**
   * Handle optimization of waypoints if desired. Set to false by default to preserve order
   */
  const [optimizeTravel, setOptimizeTravel] = useState(false);
  const optimizeHandler = () => {
    setOptimizeTravel((prev) => !prev);
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
                setAddressHandler(addressData, "origin");
              }}
              clearAddress={() => {
                clearAddressHandler("origin");
              }}
              error={formErrors.origin}
              helperText={
                formErrors.origin
                  ? "Please select a valid address from the dropdown."
                  : ""
              }
              value={formData.origin}
              onChange={changeHandler}
            />
            <AddressInput
              label="Destination"
              id="destination"
              setAddress={(addressData) => {
                setAddressHandler(addressData, "destination");
              }}
              clearAddress={() => {
                clearAddressHandler("destination");
              }}
              error={formErrors.destination}
              helperText={
                formErrors.destination
                  ? "Please select a valid address from the dropdown."
                  : ""
              }
              value={formData.destination}
              onChange={changeHandler}
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
              <FormControlLabel
                control={
                  <Switch checked={optimizeTravel} onChange={optimizeHandler} />
                }
                label="Optimize Travel"
              />
            </Grid>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Directions;
