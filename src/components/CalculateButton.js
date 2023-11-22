import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { appActions } from "../store/store";

const CalculateButton = ({ onError }) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const origin = useSelector((state) => state.origin);
  const destination = useSelector((state) => state.destination);

  const postRoute = async (payload) => {
    const baseUrl = "https://sg-mock-api.lalamove.com/route";
    // const baseUrl = "https://sg-mock-api.lalamove.com/mock/route/success";

    setIsLoading(true);
    setError(undefined);

    try {
      const response = await fetch(baseUrl, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Something went wrong, failed to send request.`);
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      throw error;
    }
  };

  const getRoute = async (token) => {
    const baseUrl = `https://sg-mock-api.lalamove.com/route/${token}`;
    // const baseUrl = "https://sg-mock-api.lalamove.com/mock/route/success";

    try {
      const response = await fetch(baseUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Something went wrong, failed to send request.`);
      }

      const data = await response.json();

      if (data.status === "in progress") {
        console.log("retrying...");
        return getRoute(token);
      } else if (data.status === "failure") {
        setError(data.error);
      } else {
        const waypoints = data.path.map((position) => {
          return { lat: Number(position[0]), lng: Number(position[1]) };
        });
        dispatch(appActions.setWaypoints(waypoints));
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  useEffect(() => {
    onError(error);
  }, [error, onError]);

  const clickHandler = async () => {
    postRoute({
      origin: origin?.fullString,
      destination: destination?.fullString,
    })
      .then((token) => {
        getRoute(token);
      })
      .catch(() => {
        console.error("Failed to retrieve route data.");
      });
  };

  return (
    <LoadingButton
      loading={isLoading}
      type="button"
      variant="contained"
      fullWidth
      onClick={clickHandler}
    >
      Calculate Route
    </LoadingButton>
  );
};

export default CalculateButton;
