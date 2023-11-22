import { Button, Card, CardContent, Grid } from "@mui/material";
import AddressInput from "./AddressInput";
import classes from "./MapRouteSearch.module.css";
import { useDispatch } from "react-redux";
import { appActions } from "../store";

const RouteSearch = ({ fetchDirections }) => {
  const dispatch = useDispatch();

  const setAddressHandler = (addressType, position) => {
    if (addressType === "origin") {
      dispatch(appActions.setOrigin(position));
    }
    if (addressType === "destination") {
      dispatch(appActions.setDestination(position));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // const fd = new FormData(event.target);
    // const data = Object.fromEntries(fd.entries());
    fetchDirections();
  };

  return (
    <div className={classes["card-container"]}>
      <Card className={classes.card}>
        <CardContent>
          <form>
            <AddressInput
              label="Origin"
              id="origin"
              setAddress={(position) => {
                setAddressHandler("origin", position);
              }}
              required
            />
            <AddressInput
              label="Destination"
              id="destination"
              setAddress={(position) => {
                setAddressHandler("destination", position);
              }}
              required
            />

            <Grid container justifyContent="flex-end" spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  type="button"
                  variant="contained"
                  fullWidth
                  onClick={handleSubmit}
                >
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

export default RouteSearch;
