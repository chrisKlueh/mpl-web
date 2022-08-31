import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isUploadingDemo: false,
  demo: {},
};

export const demoSlice = createSlice({
  name: "demo",
  initialState,
  reducers: {
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
  },
});
export const {
  uploadDemoRequest,
  uploadDemoSuccess,
  uploadDemoError,
  editDemoRequest,
  editDemoSuccess,
  editDemoError,
} = demoSlice.actions;

export default demoSlice.reducer;
