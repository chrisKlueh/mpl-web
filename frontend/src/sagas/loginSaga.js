import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import { persistor } from "../store";
import { loginReq } from "../api/loginRequests";
import {
  loginRequest,
  loginSuccess,
  loginError,
  logoutRequest,
  logoutSuccess,
  logoutError,
} from "../slices/loginSlice";

export function* workerLogin({ payload }) {
  const { username, password } = payload;
  try {
    const res = yield call(loginReq, username, password);
    yield put(loginSuccess(res.data));
  } catch (error) {
    yield put(loginError());
  }
}

export function* watcherLogin() {
  yield takeEvery(loginRequest, workerLogin);
}

export function* workerLogout({ payload }) {
  const { userId } = payload;
  console.log("logging out user " + userId);
  try {
    //const res = yield call(logoutReq, userId);
    yield put(logoutSuccess());
    persistor.purge();
  } catch (error) {
    yield put(logoutError());
  }
}

export function* watcherLogout() {
  yield takeEvery(logoutRequest, workerLogout);
}

export default function* rootSaga() {
  yield all([fork(watcherLogin), fork(watcherLogout)]);
}
