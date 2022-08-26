// store.js
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import counterReducer from "./slices/counterSlice";
import loginReducer from "./slices/loginSlice";
import rootSaga from "./sagas/sagas";

// let sagaMiddleware = createSagaMiddleware();
// const middleware = [sagaMiddleware];

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

const store = configureStore({
  reducer: {
    counter: counterReducer,
    login: loginReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
});

sagaMiddleware.run(rootSaga);

export default store;
