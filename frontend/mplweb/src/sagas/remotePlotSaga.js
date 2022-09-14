import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import {
  establishConnectionRequest,
  establishConnectionSuccess,
  establishConnectionError,
} from "../slices/remotePlotSlice";
import { establishSocketConnection } from "../helpers/webRtcHelper";

export function* workerEstablishConnection({ payload }) {
  const { hostId, pid } = payload;
  try {
    yield call(establishSocketConnection, hostId, pid);
    yield put(establishConnectionSuccess());
  } catch (error) {
    yield put(establishConnectionError());
  }
}

export function* watcherEstablishConnection() {
  yield takeEvery(establishConnectionRequest, workerEstablishConnection);
}

export default function* rootSaga() {
  yield all([fork(watcherEstablishConnection)]);
}
