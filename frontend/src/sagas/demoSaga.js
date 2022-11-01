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
import { snackbarNotification } from "../helpers/notifierHelper";

export function* workerShowDemo({ payload }) {
  try {
    let res = yield call(showDemoReq, payload);
    yield put(showDemoSuccess(res.data));
  } catch (error) {
    yield put(showDemoError());
    yield put(snackbarNotification("Failed to load demo details.", "error"));
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
    yield put(snackbarNotification("Demo uploaded.", "success"));
  } catch (error) {
    yield put(uploadDemoError());
    yield put(snackbarNotification("Failed to upload demo.", "error"));
  }
}

export function* watcherUploadDemo() {
  yield takeEvery(uploadDemoRequest, workerUploadDemo);
}

export function* workerEditDemo({ payload }) {
  const { id, user_id, title, short_desc, detail_desc, file, user_groups } =
    payload;
  try {
    yield call(
      editDemoReq,
      id,
      user_id,
      title,
      short_desc,
      detail_desc,
      file,
      user_groups
    );
    yield put(editDemoSuccess());
    yield put(showDemosRequest());
    yield put(snackbarNotification("Demo edited.", "success"));
  } catch (error) {
    yield put(editDemoError());
    yield put(snackbarNotification("Failed to edit demo.", "error"));
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
