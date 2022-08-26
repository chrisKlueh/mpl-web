// saga.js
import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import { getUserDetailReq } from "../api/apitest";
import {
  getUserDetail,
  getUserDetailSuccess,
  getUserDetailError,
} from "../slices/counterSlice";

export function* workerGetUserDetail({ payload }) {
  const { id } = payload;
  try {
    yield call(getUserDetailReq, id);
    yield put(getUserDetailSuccess());
  } catch (error) {
    yield put(getUserDetailError());
    // SPOILER?
    // yield put(
    //   enqueueSnackbarAct({
    //     message: error.message,
    //     options: {
    //       key: new Date().getTime() + Math.random(),
    //       variant: "error",
    //     },
    //   })
    // );
  }
}

export function* watcherGetUserDetail() {
  yield takeEvery(getUserDetail, workerGetUserDetail);
}

export default function* rootSaga() {
  yield all([fork(watcherGetUserDetail)]);
}
