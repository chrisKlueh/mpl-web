import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isEstablishingPeerConnection: false,
  isStoppingPeerConnection: false,
};

export const remotePlotSlice = createSlice({
  name: "remotePlot",
  initialState,
  reducers: {
    establishPeerConnectionRequest: (state, action) => {
      state.isEstablishingPeerConnection = true;
    },
    establishPeerConnectionSuccess: (state, action) => {
      state.isEstablishingPeerConnection = false;
    },
    establishPeerConnectionError: (state, action) => {
      state.isEstablishingPeerConnection = false;
    },
    stopPeerConnectionRequest: (state, action) => {
      state.isStoppingPeerConnection = true;
    },
    stopPeerConnectionSuccess: (state, action) => {
      state.isStoppingPeerConnection = false;
    },
    stopPeerConnectionError: (state, action) => {
      state.isStoppingPeerConnection = false;
    },
  },
});
export const {
  establishPeerConnectionRequest,
  establishPeerConnectionSuccess,
  establishPeerConnectionError,
  stopPeerConnectionRequest,
  stopPeerConnectionSuccess,
  stopPeerConnectionError,
} = remotePlotSlice.actions;

export default remotePlotSlice.reducer;
