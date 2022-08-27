import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import { showDemosReq } from "../api/demosRequests";
import {
  showDemosRequest,
  showDemosSuccess,
  showDemosError,
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

export default function* rootSaga() {
  yield all([fork(watcherShowDemos)]);
}
