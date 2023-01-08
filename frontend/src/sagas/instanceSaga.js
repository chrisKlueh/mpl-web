import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import { spawnInstanceReq, deleteInstanceReq } from "../api/instanceRequests";
import {
  spawnInstanceRequest,
  spawnInstanceSuccess,
  spawnInstanceError,
  deleteInstanceRequest,
  deleteInstanceSuccess,
  deleteInstanceError,
} from "../slices/instanceSlice";
import { snackbarNotification } from "../helpers/notifierHelper";

export function* workerSpawnInstance({ payload }) {
  try {
    const { userId, demoId, navigate } = payload;
    let res = yield call(spawnInstanceReq, userId, demoId);
    yield put(spawnInstanceSuccess(res.data));
    yield navigate(`/instance/${res.data.id}`);
  } catch (error) {
    yield put(spawnInstanceError());
    yield put(snackbarNotification("Failed to spawn instance.", "error"));
  }
}

export function* watcherSpawnInstance() {
  yield takeEvery(spawnInstanceRequest, workerSpawnInstance);
}

export function* workerDeleteInstance({ payload }) {
  try {
    const { userId, instanceId } = payload;
    yield call(deleteInstanceReq, userId, instanceId);
    yield put(deleteInstanceSuccess());
  } catch (error) {
    yield put(deleteInstanceError());
    yield put(snackbarNotification("Failed to terminate instance.", "error"));
  }
}

export function* watcherDeleteInstance() {
  yield takeEvery(deleteInstanceRequest, workerDeleteInstance);
}

export default function* rootSaga() {
  yield all([fork(watcherSpawnInstance), fork(watcherDeleteInstance)]);
}
