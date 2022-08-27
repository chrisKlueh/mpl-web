// store.js
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import counterReducer from "./slices/counterSlice";
import loginReducer from "./slices/loginSlice";
import demosReducer from "./slices/demosSlice";
import feedbackReducer from "./slices/feedbackSlice";
import rootSaga from "./sagas/sagas";

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

const store = configureStore({
  reducer: {
    counter: counterReducer,
    login: loginReducer,
    demos: demosReducer,
    feedback: feedbackReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
});

sagaMiddleware.run(rootSaga);

export default store;
