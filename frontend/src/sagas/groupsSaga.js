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
import GroupCreationDialog from "../features/groups/GroupCreationDialog";

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

export function* workerDeleteGroup({ payload }) {
  try {
    console.log(payload);
    const { group_id, target_group } = payload;
    let res = yield call(deleteGroupReq, group_id, target_group);
    yield put(deleteGroupSuccess(res.data));
    yield put(showGroupsRequest());
  } catch (error) {
    yield put(deleteGroupError());
    yield put(snackbarNotification("Failed to delete group.", "error"));
  }
}

export function* watcherDeleteGroup() {
  yield takeEvery(deleteGroupRequest, workerDeleteGroup);
}

export default function* rootSaga() {
  yield all([fork(watcherShowGroups), fork(watcherDeleteGroup)]);
}
