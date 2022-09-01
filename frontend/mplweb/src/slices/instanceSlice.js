import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isSpawningInstance: false,
  isGettingInstance: false,
  instance: {},
};

export const instanceSlice = createSlice({
  name: "instance",
  initialState,
  reducers: {
    showInstanceRequest: (state, action) => {
      state.isGettingInstance = true;
    },
    showInstanceSuccess: (state, action) => {
      state.isGettingInstance = false;
      state.instance = action.payload;
    },
    showInstanceError: (state, action) => {
      state.isGettingInstance = false;
    },
    spawnInstanceRequest: (state, action) => {
      state.isSpawningInstance = true;
    },
    spawnInstanceSuccess: (state, action) => {
      state.isSpawningInstance = false;
      state.instance = action.payload;
    },
    spawnInstanceError: (state, action) => {
      state.isSpawningInstance = false;
    },
  },
});
export const {
  showInstanceRequest,
  showInstanceSuccess,
  showInstanceError,
  spawnInstanceRequest,
  spawnInstanceSuccess,
  spawnInstanceError,
} = instanceSlice.actions;

export default instanceSlice.reducer;
