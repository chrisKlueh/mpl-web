// store.js
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import loginReducer from "./slices/loginSlice";
import demosReducer from "./slices/demosSlice";
import demoReducer from "./slices/demoSlice";
import feedbackReducer from "./slices/feedbackSlice";
import rootSaga from "./sagas/sagas";

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

const store = configureStore({
  reducer: {
    login: loginReducer,
    demos: demosReducer,
    demo: demoReducer,
    feedback: feedbackReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
});

sagaMiddleware.run(rootSaga);

export default store;
