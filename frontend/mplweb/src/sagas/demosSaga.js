import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import {
  showDemosReq,
  deleteDemoReq,
  uploadDemoReq,
} from "../api/demosRequests";
import {
  showDemosRequest,
  showDemosSuccess,
  showDemosError,
  deleteDemoRequest,
  deleteDemoSuccess,
  deleteDemoError,
  uploadDemoRequest,
  uploadDemoSuccess,
  uploadDemoError,
} from "../slices/demosSlice";

export function* workerShowDemos() {
  try {
    const res = yield call(showDemosReq);
    yield put(showDemosSuccess(res.data));
  } catch (error) {
    yield put(showDemosError());
  }
}

export function* watcherShowDemos() {
  yield takeEvery(showDemosRequest, workerShowDemos);
}

export function* workerDeleteDemo({ payload }) {
  try {
    yield call(deleteDemoReq, payload);
    yield put(deleteDemoSuccess());
    yield put(showDemosRequest());
  } catch (error) {
    yield put(deleteDemoError());
  }
}

export function* watcherDeleteDemo() {
  yield takeEvery(deleteDemoRequest, workerDeleteDemo);
}

export function* workerUploadDemo({ payload }) {
  console.log(payload);
  const { created_by, title, short_desc, detail_desc, file } = payload;
  try {
    yield call(uploadDemoReq, created_by, title, short_desc, detail_desc, file);
    yield put(uploadDemoSuccess());
    yield put(showDemosRequest());
  } catch (error) {
    yield put(uploadDemoError());
  }
}

export function* watcherUploadDemo() {
  yield takeEvery(uploadDemoRequest, workerUploadDemo);
}

export default function* rootSaga() {
  yield all([
    fork(watcherShowDemos),
    fork(watcherDeleteDemo),
    fork(watcherUploadDemo),
  ]);
}
