import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import { showDemoReq, uploadDemoReq, editDemoReq } from "../api/demoRequests";
import {
  showDemoRequest,
  showDemoSuccess,
  showDemoError,
  uploadDemoRequest,
  uploadDemoSuccess,
  uploadDemoError,
  editDemoRequest,
  editDemoSuccess,
  editDemoError,
} from "../slices/demoSlice";
import { showDemosRequest } from "../slices/demosSlice";

export function* workerShowDemo({ payload }) {
  try {
    let res = yield call(showDemoReq, payload);
    yield put(showDemoSuccess(res.data));
  } catch (error) {
    yield put(showDemoError());
  }
}

export function* watcherShowDemo() {
  yield takeEvery(showDemoRequest, workerShowDemo);
}

export function* workerUploadDemo({ payload }) {
  const { user_id, title, short_desc, detail_desc, file } = payload;
  try {
    yield call(uploadDemoReq, user_id, title, short_desc, detail_desc, file);
    yield put(uploadDemoSuccess());
    yield put(showDemosRequest());
  } catch (error) {
    yield put(uploadDemoError());
  }
}

export function* watcherUploadDemo() {
  yield takeEvery(uploadDemoRequest, workerUploadDemo);
}

export function* workerEditDemo({ payload }) {
  const { id, user_id, title, short_desc, detail_desc, file } = payload;
  try {
    yield call(editDemoReq, id, user_id, title, short_desc, detail_desc, file);
    yield put(editDemoSuccess());
    yield put(showDemosRequest());
  } catch (error) {
    yield put(editDemoError());
  }
}

export function* watcherEditDemo() {
  yield takeEvery(editDemoRequest, workerEditDemo);
}

export default function* rootSaga() {
  yield all([
    fork(watcherShowDemo),
    fork(watcherUploadDemo),
    fork(watcherEditDemo),
  ]);
}
