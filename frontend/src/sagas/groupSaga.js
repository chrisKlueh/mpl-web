import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import {
  showGroupReq,
  editGroupReq,
  deleteGroupReq,
  createGroupReq,
} from "../api/groupRequests";
import {
  showGroupRequest,
  showGroupSuccess,
  showGroupError,
  editGroupRequest,
  editGroupSuccess,
  editGroupError,
  deleteGroupRequest,
  deleteGroupSuccess,
  deleteGroupError,
  createGroupRequest,
  createGroupSuccess,
  createGroupError,
} from "../slices/groupSlice";
import { snackbarNotification } from "../helpers/notifierHelper";
import { showGroupsRequest } from "../slices/groupsSlice";

export function* workerShowGroup({ payload }) {
  try {
    let res = yield call(showGroupReq, payload);
    yield put(showGroupSuccess(res.data));
  } catch (error) {
    yield put(showGroupError());
    yield put(snackbarNotification("Failed to load group details.", "error"));
  }
}

export function* watcherShowGroups() {
  yield takeEvery(showGroupRequest, workerShowGroup);
}

export function* workerEditGroup({ payload }) {
  try {
    const {
      groupId,
      targetGroupId,
      groupName,
      password,
      hasAdminPrivileges,
      accessibleDemos,
    } = payload;
    let res = yield call(
      editGroupReq,
      groupId,
      targetGroupId,
      groupName,
      password,
      hasAdminPrivileges,
      accessibleDemos
    );
    yield put(editGroupSuccess(res.data));
    yield put(showGroupsRequest());
    yield put(snackbarNotification("Group updated.", "success"));
  } catch (error) {
    yield put(editGroupError());
    yield put(snackbarNotification("Failed to edit group.", "error"));
  }
}

export function* watcherEditGroup() {
  yield takeEvery(editGroupRequest, workerEditGroup);
}

export function* workerDeleteGroup({ payload }) {
  try {
    const { group_id, target_group } = payload;
    let res = yield call(deleteGroupReq, group_id, target_group);
    yield put(deleteGroupSuccess(res.data));
    yield put(showGroupsRequest());
    yield put(snackbarNotification("Group deleted.", "success"));
  } catch (error) {
    yield put(deleteGroupError());
    yield put(snackbarNotification("Failed to delete group.", "error"));
  }
}

export function* watcherDeleteGroup() {
  yield takeEvery(deleteGroupRequest, workerDeleteGroup);
}

export function* workerCreateGroup({ payload }) {
  try {
    const {
      groupId,
      groupName,
      password,
      hasAdminPrivileges,
      accessibleDemos,
    } = payload;
    let res = yield call(
      createGroupReq,
      groupId,
      groupName,
      password,
      hasAdminPrivileges,
      accessibleDemos
    );
    yield put(createGroupSuccess(res.data));
    yield put(showGroupsRequest());
    yield put(snackbarNotification("Group created.", "success"));
  } catch (error) {
    yield put(createGroupError());
    yield put(snackbarNotification("Failed to create group.", "error"));
  }
}

export function* watcherCreateGroup() {
  yield takeEvery(createGroupRequest, workerCreateGroup);
}

export default function* rootSaga() {
  yield all([
    fork(watcherShowGroups),
    fork(watcherEditGroup),
    fork(watcherDeleteGroup),
    fork(watcherCreateGroup),
  ]);
}
