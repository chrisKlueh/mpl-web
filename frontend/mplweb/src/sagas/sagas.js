import { all } from "redux-saga/effects";
import counterSaga from "./counterSaga";
import loginSaga from "./loginSaga";
import demosSaga from "./demosSaga";
import feedbackSaga from "./feedbackSaga";

export default function* rootSaga() {
  yield all([counterSaga(), loginSaga(), demosSaga(), feedbackSaga()]);
}
