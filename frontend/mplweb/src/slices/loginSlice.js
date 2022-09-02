import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isLoggingIn: false,
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
      const { id, name, created_at, is_admin } = action.payload;
      state.isLoggingIn = false;
      state.isLoggedIn = true;
      state.userId = id;
      state.userName = name;
      state.createdAt = created_at;
      state.isAdmin = is_admin;
    },
    loginError: (state, action) => {
      state.isLoggingIn = false;
    },
  },
});
export const { loginRequest, loginSuccess, loginError } = loginSlice.actions;

export default loginSlice.reducer;
