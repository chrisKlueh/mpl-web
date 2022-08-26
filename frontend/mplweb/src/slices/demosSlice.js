import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isGettingDemos: false,
  demos: [],
};

export const demosSlice = createSlice({
  name: "demos",
  initialState,
  reducers: {
    showDemosRequest: (state, action) => {
      state.isGettingDemos = true;
    },
    showDemosSuccess: (state, action) => {
      state.demos = action.payload;
      state.isGettingDemos = false;
    },
    showDemosError: (state, action) => {
      state.isGettingDemos = false;
    },
  },
});
export const { showDemosRequest, showDemosSuccess, showDemosError } =
  demosSlice.actions;

export default demosSlice.reducer;
