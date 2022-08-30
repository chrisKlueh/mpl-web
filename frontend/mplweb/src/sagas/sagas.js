import { all } from "redux-saga/effects";
import counterSaga from "./counterSaga";
import loginSaga from "./loginSaga";
import demosSaga from "./demosSaga";
import demoSaga from "./demoSaga";
import feedbackSaga from "./feedbackSaga";

export default function* rootSaga() {
  yield all([
    counterSaga(),
    loginSaga(),
    demosSaga(),
    demoSaga(),
    feedbackSaga(),
  ]);
}
