import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isLoggingIn: false,
  isLoggedIn: false,
  userId: null,
  loginToken: null,
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    loginRequest: (state, action) => {
      state.isLoggingIn = true;
    },
    loginSuccess: (state, action) => {
      const { userId, loginToken } = action.payload;
      state.isLoggingIn = false;
      state.isLoggedIn = true;
      state.userId = userId;
      state.loginToken = loginToken;
    },
    loginError: (state, action) => {
      state.isLoggingIn = false;
    },
  },
});
export const { loginRequest, loginSuccess, loginError } = loginSlice.actions;

export default loginSlice.reducer;
