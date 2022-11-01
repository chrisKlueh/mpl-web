import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import { showGroupReq, editGroupReq } from "../api/groupRequests";
import {
  showGroupRequest,
  showGroupSuccess,
  showGroupError,
  editGroupRequest,
  editGroupSuccess,
  editGroupError,
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
    console.log(payload);
    const {
      groupId,
      targetGroupId,
      groupName,
      password,
      confirmPassword,
      hasAdminPrivileges,
      accessibleDemos,
    } = payload;
    let res = yield call(
      editGroupReq,
      groupId,
      targetGroupId,
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
  yield all([fork(watcherShowGroups), fork(watcherEditGroup)]);
}
