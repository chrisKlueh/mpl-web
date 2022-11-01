import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import { showGroupsReq } from "../api/groupsRequests";
import {
  showGroupsRequest,
  showGroupsSuccess,
  showGroupsError,
} from "../slices/groupsSlice";
import { snackbarNotification } from "../helpers/notifierHelper";

export function* workerShowGroups({ payload }) {
  try {
    let res = yield call(showGroupsReq, payload);
    yield put(showGroupsSuccess(res.data));
  } catch (error) {
    yield put(showGroupsError());
    yield put(snackbarNotification("Failed to load groups.", "error"));
  }
}

export function* watcherShowGroups() {
  yield takeEvery(showGroupsRequest, workerShowGroups);
}

export default function* rootSaga() {
  yield all([fork(watcherShowGroups)]);
}
