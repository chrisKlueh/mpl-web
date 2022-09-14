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
import { showDemoRequest } from "../slices/demoSlice";

export function* workerShowInstance({ payload }) {
  try {
    let res = yield call(showInstanceReq, payload);
    yield put(showInstanceSuccess(res.data));
    yield put(showDemoRequest(res.data.demo));
  } catch (error) {
    yield put(showInstanceError());
  }
}

export function* watcherShowInstance() {
  yield takeEvery(showInstanceRequest, workerShowInstance);
}

export function* workerSpawnInstance({ payload }) {
  try {
    const { userId, demoId, navigate } = payload;
    let res = yield call(spawnInstanceReq, userId, demoId);
    yield put(spawnInstanceSuccess(res.data));
    yield navigate(`/instance/${res.data.id}`);
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
