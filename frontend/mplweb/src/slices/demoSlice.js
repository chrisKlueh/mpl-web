import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isUploadingDemo: false,
  demos: {},
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
  },
});
export const { uploadDemoRequest, uploadDemoSuccess, uploadDemoError } =
  demoSlice.actions;

export default demoSlice.reducer;
