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
    const { user_id, demo_id } = payload;
    yield call(deleteDemoReq, user_id, demo_id);
    yield put(deleteDemoSuccess());
    yield put(showDemosRequest());
  } catch (error) {
    yield put(deleteDemoError());
  }
}

export function* watcherDeleteDemo() {
  yield takeEvery(deleteDemoRequest, workerDeleteDemo);
}

export default function* rootSaga() {
  yield all([fork(watcherShowDemos), fork(watcherDeleteDemo)]);
}
