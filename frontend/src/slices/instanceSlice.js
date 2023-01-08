import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isSpawningInstance: false,
  isDeletingInstance: false,
  instance: {},
};

export const instanceSlice = createSlice({
  name: "instance",
  initialState,
  reducers: {
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
    deleteInstanceRequest: (state, action) => {
      state.isDeletingInstance = true;
    },
    deleteInstanceSuccess: (state, action) => {
      state.isDeletingInstance = false;
    },
    deleteInstanceError: (state, action) => {
      state.isDeletingInstance = false;
    },
    resetInstanceState: (state, action) => initialState,
  },
});
export const {
  spawnInstanceRequest,
  spawnInstanceSuccess,
  spawnInstanceError,
  deleteInstanceRequest,
  deleteInstanceSuccess,
  deleteInstanceError,
  resetInstanceState,
} = instanceSlice.actions;

export default instanceSlice.reducer;
