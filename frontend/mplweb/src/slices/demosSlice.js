import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isGettingDemos: false,
  isDeletingDemo: false,
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
    deleteDemoRequest: (state, action) => {
      state.isDeletingDemo = true;
    },
    deleteDemoSuccess: (state, action) => {
      state.isDeletingDemo = false;
    },
    deleteDemoError: (state, action) => {
      state.isDeletingDemo = false;
    },
  },
});
export const {
  showDemosRequest,
  showDemosSuccess,
  showDemosError,
  deleteDemoRequest,
  deleteDemoSuccess,
  deleteDemoError,
} = demosSlice.actions;

export default demosSlice.reducer;
