import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import { uploadDemoReq, editDemoReq } from "../api/demoRequests";
import {
  uploadDemoRequest,
  uploadDemoSuccess,
  uploadDemoError,
  editDemoRequest,
  editDemoSuccess,
  editDemoError,
} from "../slices/demoSlice";
import { showDemosRequest } from "../slices/demosSlice";

export function* workerUploadDemo({ payload }) {
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

export function* workerEditDemo({ payload }) {
  const { id, created_by, title, short_desc, detail_desc, file } = payload;
  try {
    yield call(
      editDemoReq,
      id,
      created_by,
      title,
      short_desc,
      detail_desc,
      file
    );
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
  yield all([fork(watcherUploadDemo), fork(watcherEditDemo)]);
}
