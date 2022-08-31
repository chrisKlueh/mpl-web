import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import { uploadDemoReq } from "../api/demoRequests";
import {
  uploadDemoRequest,
  uploadDemoSuccess,
  uploadDemoError,
} from "../slices/demoSlice";
import { showDemosRequest } from "../slices/demosSlice";

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
  yield all([fork(watcherUploadDemo)]);
}
