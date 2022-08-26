import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import { loginReq } from "../api/loginRequests";
import { loginRequest, loginSuccess, loginError } from "../slices/loginSlice";

export function* workerLogin({ payload }) {
  const { username, password } = payload;
  try {
    yield call(loginReq, username, password);
    yield put(loginSuccess({ userId: 1, loginToken: "hans" }));
  } catch (error) {
    yield put(loginError());
  }
}

export function* watcherLogin() {
  yield takeEvery(loginRequest, workerLogin);
}

export default function* rootSaga() {
  yield all([fork(watcherLogin)]);
}
