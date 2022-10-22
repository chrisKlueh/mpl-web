import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isGettingDemo: false,
  isUploadingDemo: false,
  demo: {},
};

export const demoSlice = createSlice({
  name: "demo",
  initialState,
  reducers: {
    showDemoRequest: (state, action) => {
      state.isGettingDemo = true;
    },
    showDemoSuccess: (state, action) => {
      state.isGettingDemo = false;
      state.demo = action.payload;
    },
    showDemoError: (state, action) => {
      state.isGettingDemo = false;
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
    editDemoRequest: (state, action) => {
      state.isUploadingDemo = true;
    },
    editDemoSuccess: (state, action) => {
      state.isUploadingDemo = false;
    },
    editDemoError: (state, action) => {
      state.isUploadingDemo = false;
    },
    resetDemoState: (state, action) => initialState,
  },
});
export const {
  showDemoRequest,
  showDemoSuccess,
  showDemoError,
  uploadDemoRequest,
  uploadDemoSuccess,
  uploadDemoError,
  editDemoRequest,
  editDemoSuccess,
  editDemoError,
  resetDemoState,
} = demoSlice.actions;

export default demoSlice.reducer;
