import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import {
  showDemoReq,
  uploadDemoReq,
  editDemoReq,
  deleteDemoReq,
} from "../api/demoRequests";
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
  deleteDemoRequest,
  deleteDemoSuccess,
  deleteDemoError,
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
  const { user_group, title, short_desc, detail_desc, file, user_groups } =
    payload;
  try {
    yield call(
      uploadDemoReq,
      user_group,
      title,
      short_desc,
      detail_desc,
      file,
      user_groups
    );
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
  const { id, user_group, title, short_desc, detail_desc, file, user_groups } =
    payload;
  try {
    yield call(
      editDemoReq,
      id,
      user_group,
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

export function* workerDeleteDemo({ payload }) {
  try {
    const { user_id, demo_id } = payload;
    yield call(deleteDemoReq, user_id, demo_id);
    yield put(deleteDemoSuccess());
    yield put(snackbarNotification("Demo deleted.", "success"));
    yield put(showDemosRequest());
  } catch (error) {
    yield put(deleteDemoError());
    yield put(snackbarNotification("Failed to delete demo.", "error"));
  }
}

export function* watcherDeleteDemo() {
  yield takeEvery(deleteDemoRequest, workerDeleteDemo);
}

export default function* rootSaga() {
  yield all([
    fork(watcherShowDemo),
    fork(watcherUploadDemo),
    fork(watcherEditDemo),
    fork(watcherDeleteDemo),
  ]);
}
