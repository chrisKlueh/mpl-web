import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  notifications: [],
};

export const notifierSlice = createSlice({
  name: "notifier",
  initialState,
  reducers: {
    enqueueSnackbar: (state, action) => {
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            key: action.payload.options.key,
            ...action.payload,
          },
        ],
      };
    },
    closeSnackbar: (state, action) => {
      console.log(action);
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          action.dismissAll || notification.key === action.payload.options.key
            ? { ...notification, dismissed: true }
            : { ...notification }
        ),
      };
    },
    removeSnackbar: (state, action) => {
      console.log(action);
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.key !== action.payload
        ),
      };
    },
  },
});
export const { enqueueSnackbar, closeSnackbar, removeSnackbar } =
  notifierSlice.actions;

export default notifierSlice.reducer;
