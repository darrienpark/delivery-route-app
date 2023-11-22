import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialState = {
  origin: null,
  destination: null,
  directions: null,
  waypoints: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setOrigin(state, action) {
      state.origin = {
        fullString: action.payload.string,
        position: action.payload.position,
      };
    },
    setDestination(state, action) {
      state.destination = {
        fullString: action.payload.string,
        position: action.payload.position,
      };
    },
    clearOrigin(state) {
      state.origin = null;
    },
    clearDestination(state) {
      state.destination = null;
    },
    setWaypoints(state, action) {
      state.waypoints = action.payload;
    },
    setDirections(state, action) {
      state.directions = action.payload;
    },
  },
});

const store = configureStore({
  reducer: appSlice.reducer,
});

export const appActions = appSlice.actions;
export default store;
