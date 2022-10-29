import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import {
  showGroupsReq,
  createGroupReq,
  editGroupReq,
  deleteGroupReq,
} from "../api/groupsRequests";
import {
  showGroupsRequest,
  showGroupsSuccess,
  showGroupsError,
  createGroupRequest,
  createGroupSuccess,
  createGroupError,
  editGroupRequest,
  editGroupSuccess,
  editGroupError,
  deleteGroupRequest,
  deleteGroupSuccess,
  deleteGroupError,
} from "../slices/groupsSlice";
import { snackbarNotification } from "../helpers/notifierHelper";

export function* workerShowGroups({ payload }) {
  try {
    let res = yield call(showGroupsReq, payload);
    yield put(showGroupsSuccess(res.data));
  } catch (error) {
    yield put(showGroupsError());
    yield put(snackbarNotification("Failed to load demo details.", "error"));
  }
}

export function* watcherShowGroups() {
  yield takeEvery(showGroupsRequest, workerShowGroups);
}

export default function* rootSaga() {
  yield all([fork(watcherShowGroups)]);
}
