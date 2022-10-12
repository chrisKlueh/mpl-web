import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import { showDemosReq, deleteDemoReq } from "../api/demosRequests";
import {
  showDemosRequest,
  showDemosSuccess,
  showDemosError,
  deleteDemoRequest,
  deleteDemoSuccess,
  deleteDemoError,
} from "../slices/demosSlice";
import { snackbarNotification } from "../helpers/notifierHelper";

export function* workerShowDemos() {
  try {
    const res = yield call(showDemosReq);
    yield put(showDemosSuccess(res.data));
  } catch (error) {
    yield put(showDemosError());
    yield put(snackbarNotification("Failed to load demos.", "error"));
  }
}

export function* watcherShowDemos() {
  yield takeEvery(showDemosRequest, workerShowDemos);
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
  yield all([fork(watcherShowDemos), fork(watcherDeleteDemo)]);
}
