// store.js
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session";

import loginReducer from "./slices/loginSlice";
import demosReducer from "./slices/demosSlice";
import demoReducer from "./slices/demoSlice";
import feedbackReducer from "./slices/feedbackSlice";
import groupsReducer from "./slices/groupsSlice";
import groupReducer from "./slices/groupSlice";
import instanceReducer from "./slices/instanceSlice";
import remotePlotReducer from "./slices/remotePlotSlice";
import notifierReducer from "./slices/notifierSlice";
import rootSaga from "./sagas/sagas";

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

const persistConfig = {
  key: "root",
  version: 1,
  storage: sessionStorage,
};

const persistedReducer = persistReducer(persistConfig, loginReducer);

const store = configureStore({
  reducer: {
    login: persistedReducer,
    demos: demosReducer,
    demo: demoReducer,
    feedback: feedbackReducer,
    groups: groupsReducer,
    group: groupReducer,
    instance: instanceReducer,
    remotePlot: remotePlotReducer,
    notifier: notifierReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(middleware),
});

const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export { store, persistor };
