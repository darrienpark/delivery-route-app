import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialState = {
  currentLocation: undefined,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setCurrentLocation(state, action) {
      state.currentLocation = action.payload;
    },
  },
});

const store = configureStore({
  reducer: appSlice.reducer,
});

export const appActions = appSlice.actions;
export default store;
