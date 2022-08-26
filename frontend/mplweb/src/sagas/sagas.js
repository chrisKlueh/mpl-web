import { all } from "redux-saga/effects";
import counterSaga from "./counterSaga";
import loginSaga from "./loginSaga";
export default function* rootSaga() {
  yield all([counterSaga(), loginSaga()]);
}
