import { enqueueSnackbar } from "../slices/notifierSlice";

export const snackbarNotification = (message, variant) =>
  enqueueSnackbar({
    message: message,
    options: {
      key: new Date().getTime() + Math.random(),
      variant: variant,
    },
  });
