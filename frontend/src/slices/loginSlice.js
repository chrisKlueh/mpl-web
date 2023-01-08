import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isLoggingIn: false,
  isLoggingOut: false,
  isLoggedIn: false,
  userId: null,
  createdAt: null,
  userName: "",
  isAdmin: false,
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    loginRequest: (state, action) => {
      state.isLoggingIn = true;
    },
    loginSuccess: (state, action) => {
      const { group_id, group_name, created_at, is_admin } = action.payload;
      state.isLoggingIn = false;
      state.isLoggedIn = true;
      state.userId = group_id;
      state.userName = group_name;
      state.createdAt = created_at;
      state.isAdmin = is_admin;
    },
    loginError: (state, action) => {
      state.isLoggingIn = false;
    },
    logoutRequest: (state, action) => {
      state.isLoggingOut = true;
    },
    logoutSuccess: (state, action) => initialState,
    logoutError: (state, action) => {
      state.isLoggingOut = false;
    },
  },
});
export const {
  loginRequest,
  loginSuccess,
  loginError,
  logoutRequest,
  logoutSuccess,
  logoutError,
} = loginSlice.actions;

export default loginSlice.reducer;
