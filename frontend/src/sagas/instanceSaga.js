import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import {
  showInstanceReq,
  spawnInstanceReq,
  deleteInstanceReq,
} from "../api/instanceRequests";
import {
  showInstanceRequest,
  showInstanceSuccess,
  showInstanceError,
  spawnInstanceRequest,
  spawnInstanceSuccess,
  spawnInstanceError,
  deleteInstanceRequest,
  deleteInstanceSuccess,
  deleteInstanceError,
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

export function* workerDeleteInstance({ payload }) {
  try {
    const { userId, instanceId, hostId, pid } = payload;
    yield call(deleteInstanceReq, userId, instanceId, hostId, pid);
    yield put(deleteInstanceSuccess());
  } catch (error) {
    yield put(deleteInstanceError());
  }
}

export function* watcherDeleteInstance() {
  yield takeEvery(deleteInstanceRequest, workerDeleteInstance);
}

export default function* rootSaga() {
  yield all([
    fork(watcherShowInstance),
    fork(watcherSpawnInstance),
    fork(watcherDeleteInstance),
  ]);
}
