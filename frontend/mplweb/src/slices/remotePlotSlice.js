import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isEstablishingConnection: false,
};

export const remotePlotSlice = createSlice({
  name: "remotePlot",
  initialState,
  reducers: {
    establishConnectionRequest: (state, action) => {
      state.isEstablishingConnection = true;
    },
    establishConnectionSuccess: (state, action) => {
      state.isEstablishingConnection = false;
    },
    establishConnectionError: (state, action) => {
      state.isEstablishingConnection = false;
    },
  },
});
export const {
  establishConnectionRequest,
  establishConnectionSuccess,
  establishConnectionError,
} = remotePlotSlice.actions;

export default remotePlotSlice.reducer;
