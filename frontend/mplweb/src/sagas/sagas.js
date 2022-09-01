import { all } from "redux-saga/effects";
import loginSaga from "./loginSaga";
import demosSaga from "./demosSaga";
import demoSaga from "./demoSaga";
import feedbackSaga from "./feedbackSaga";
import instanceSaga from "./instanceSaga";

export default function* rootSaga() {
  yield all([
    loginSaga(),
    demosSaga(),
    demoSaga(),
    feedbackSaga(),
    instanceSaga(),
  ]);
}
