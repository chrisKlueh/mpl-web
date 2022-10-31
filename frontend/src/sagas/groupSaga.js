import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import {
  showGroupReq,
  /* createGroupReq, */
  editGroupReq,
  /* deleteGroupReq, */
} from "../api/groupRequests";
import {
  showGroupRequest,
  showGroupSuccess,
  showGroupError,
  /* createGroupRequest,
  createGroupSuccess,
  createGroupError, */
  editGroupRequest,
  editGroupSuccess,
  editGroupError,
  /* deleteGroupRequest,
  deleteGroupSuccess,
  deleteGroupError, */
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

/* export function* workerDeleteGroup({ payload }) {
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
} */

/* export function* workerCreateGroup({ payload }) {
  try {
    console.log(payload);
    const {
      groupId,
      groupName,
      password,
      confirmPassword,
      hasAdminPrivileges,
      accessibleDemos,
    } = payload;
    let res = yield call(
      createGroupReq,
      groupId,
      groupName,
      password,
      confirmPassword,
      hasAdminPrivileges,
      accessibleDemos
    );
    yield put(createGroupSuccess(res.data));
    yield put(showGroupsRequest());
  } catch (error) {
    yield put(createGroupError());
    yield put(snackbarNotification("Failed to create group.", "error"));
  }
}

export function* watcherCreateGroup() {
  yield takeEvery(createGroupRequest, workerCreateGroup);
} */

export function* workerEditGroup({ payload }) {
  try {
    console.log(payload);
    const {
      groupId,
      groupName,
      password,
      confirmPassword,
      hasAdminPrivileges,
      accessibleDemos,
    } = payload;
    let res = yield call(
      editGroupReq,
      groupId,
      groupName,
      password,
      confirmPassword,
      hasAdminPrivileges,
      accessibleDemos
    );
    yield put(editGroupSuccess(res.data));
    yield put(showGroupsRequest());
  } catch (error) {
    yield put(editGroupError());
    yield put(snackbarNotification("Failed to edit group.", "error"));
  }
}

export function* watcherEditGroup() {
  yield takeEvery(editGroupRequest, workerEditGroup);
}

export default function* rootSaga() {
  yield all([
    fork(watcherShowGroups),
    fork(watcherEditGroup),
    /* fork(watcherDeleteGroup),
    fork(watcherCreateGroup), */
  ]);
}
