import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import { loginReq } from "../api/loginRequests";
import { loginRequest, loginSuccess, loginError } from "../slices/loginSlice";

export function* workerLogin({ payload }) {
  const { username, password } = payload;
  try {
    const res = yield call(loginReq, username, password);
    console.log(res.data);
    yield put(loginSuccess(res.data));
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
