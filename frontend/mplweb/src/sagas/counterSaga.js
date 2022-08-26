// saga.js
import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import Axios from "axios";
import { incrementByAmount } from "../slices/counterSlice";
import { sagaActions } from "../actions/sagaActions";
import { getUserDetailReq } from "../api/apitest";
import {
  getUserDetail,
  getUserDetailSuccess,
  getUserDetailError,
} from "../slices/counterSlice";

// function uses axios to fetch data from our api
let callAPI = async ({ url, method, data }) => {
  return await Axios({
    url,
    method,
    data,
  });
};

export function* workerFetchNumberSaga() {
  try {
    let result = yield call(() =>
      callAPI({
        url: "http://www.randomnumberapi.com/api/v1.0/random?min=100&max=1000&count=1",
      })
    );
    yield put(incrementByAmount(result.data[0]));
  } catch (e) {
    yield put({ type: "NUMBER_SAGA_FAILED" });
  }
}

export function* watcherFetchNumberSaga() {
  yield takeEvery(sagaActions.FETCH_NUMBER_SAGA, workerFetchNumberSaga);
}

export function* workerGetUserDetail({ payload }) {
  const { id } = payload;
  try {
    yield call(getUserDetailReq, id);
    yield put(getUserDetailSuccess());
  } catch (error) {
    yield put(getUserDetailError());
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
  yield all([fork(watcherFetchNumberSaga), fork(watcherGetUserDetail)]);
}
