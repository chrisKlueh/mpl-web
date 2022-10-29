import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import { persistor } from "../store";
import { loginReq, logoutReq } from "../api/loginRequests";
import {
  loginRequest,
  loginSuccess,
  loginError,
  logoutRequest,
  logoutSuccess,
  logoutError,
} from "../slices/loginSlice";
import { setToken, getToken, clearToken } from "../api/axiosApi";

export function* workerLogin({ payload }) {
  const { username, password } = payload;
  try {
    const res = yield call(loginReq, username, password);
    setToken(res.data.access, res.data.refresh);
    yield put(loginSuccess(res.data));
  } catch (error) {
    yield put(loginError());
  }
}

export function* watcherLogin() {
  yield takeEvery(loginRequest, workerLogin);
}

export function* workerLogout({ payload }) {
  try {
    const refreshToken = getToken("refresh_token");
    yield call(logoutReq, refreshToken);
    clearToken();
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
