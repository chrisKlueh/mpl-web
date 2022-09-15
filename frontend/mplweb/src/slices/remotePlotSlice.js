import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isEstablishingSocketConnection: false,
  isStartingWebRtc: false,
  isNegotiatingWebRtc: false,
};

export const remotePlotSlice = createSlice({
  name: "remotePlot",
  initialState,
  reducers: {
    establishSocketConnectionRequest: (state, action) => {
      state.isEstablishingSocketConnection = true;
    },
    establishSocketConnectionSuccess: (state, action) => {
      state.isEstablishingSocketConnection = false;
    },
    establishSocketConnectionError: (state, action) => {
      state.isEstablishingSocketConnection = false;
    },
    startWebRtcRequest: (state, action) => {
      state.isStartingWebRtc = true;
    },
    startWebRtcSuccess: (state, action) => {
      state.isStartingWebRtc = false;
    },
    startWebRtcError: (state, action) => {
      state.isStartingWebRtc = false;
    },
    negotiateWebRtcRequest: (state, action) => {
      state.isNegotiatingWebRtc = true;
    },
    negotiateWebRtcSuccess: (state, action) => {
      state.isNegotiatingWebRtc = false;
    },
    negotiateWebRtcError: (state, action) => {
      state.isNegotiatingWebRtc = false;
    },
  },
});
export const {
  establishSocketConnectionRequest,
  establishSocketConnectionSuccess,
  establishSocketConnectionError,
  startWebRtcRequest,
  startWebRtcSuccess,
  startWebRtcError,
  negotiateWebRtcRequest,
  negotiateWebRtcSuccess,
  negotiateWebRtcError,
} = remotePlotSlice.actions;

export default remotePlotSlice.reducer;
