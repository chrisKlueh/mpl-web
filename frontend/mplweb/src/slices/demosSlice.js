import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isGettingDemos: false,
  isDeletingDemo: false,
  isUploadingDemo: false,
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
    uploadDemoRequest: (state, action) => {
      state.isUploadingDemo = true;
    },
    uploadDemoSuccess: (state, action) => {
      state.isUploadingDemo = false;
    },
    uploadDemoError: (state, action) => {
      state.isUploadingDemo = false;
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
  uploadDemoRequest,
  uploadDemoSuccess,
  uploadDemoError,
} = demosSlice.actions;

export default demosSlice.reducer;
