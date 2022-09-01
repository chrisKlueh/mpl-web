import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import { showInstanceReq, spawnInstanceReq } from "../api/instanceRequests";
import {
  showInstanceRequest,
  showInstanceSuccess,
  showInstanceError,
  spawnInstanceRequest,
  spawnInstanceSuccess,
  spawnInstanceError,
} from "../slices/instanceSlice";

export function* workerShowInstance({ payload }) {
  try {
    let res = yield call(showInstanceReq, payload);
    yield put(showInstanceSuccess(res.data));
  } catch (error) {
    yield put(showInstanceError());
  }
}

export function* watcherShowInstance() {
  yield takeEvery(showInstanceRequest, workerShowInstance);
}

export function* workerSpawnInstance({ payload }) {
  try {
    let res = yield call(spawnInstanceReq, payload);
    yield put(spawnInstanceSuccess(res.data));
  } catch (error) {
    yield put(spawnInstanceError());
  }
}

export function* watcherSpawnInstance() {
  yield takeEvery(spawnInstanceRequest, workerSpawnInstance);
}

export default function* rootSaga() {
  yield all([fork(watcherShowInstance), fork(watcherSpawnInstance)]);
}
