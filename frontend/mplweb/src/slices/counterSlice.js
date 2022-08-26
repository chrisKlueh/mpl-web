// counterSlice.js
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  value: 0,
  status: "idle",
  isLoading: false,
  user: null,
};

// Redux Toolkit slice
export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    getUserDetail: (state, action) => {
      const { id, param2, param3 } = action.payload;
      console.log(id, param2, param3);
      state.isLoading = true;
    },
    getUserDetailSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.user;
    },
    getUserDetailError: (state, action) => {
      state.isLoading = false;
    },
  },
});
export const {
  increment,
  decrement,
  incrementByAmount,
  getUserDetail,
  getUserDetailSuccess,
  getUserDetailError,
} = counterSlice.actions;

export default counterSlice.reducer;
