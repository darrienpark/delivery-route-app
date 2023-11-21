import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialState = {
  origin: undefined,
  destination: undefined,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setOrigin(state, action) {
      state.origin = action.payload;
    },
    setDestination(state, action) {
      state.destination = action.payload;
    },
  },
});

const store = configureStore({
  reducer: appSlice.reducer,
});

export const appActions = appSlice.actions;
export default store;
