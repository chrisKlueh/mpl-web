import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { Provider } from "react-redux";
import { store, persistor } from "./store";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { StyledEngineProvider } from "@mui/material/styles";

import { PersistGate } from "redux-persist/integration/react";

import CustomSnackbarProvider from "./features/general/CustomSnackbarProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  //strict mode intentionally triggers componentDidMount twice (in development)
  //https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects
  // <React.StrictMode>
  <StyledEngineProvider injectFirst>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CustomSnackbarProvider>
          <App />
        </CustomSnackbarProvider>
      </PersistGate>
    </Provider>
  </StyledEngineProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
