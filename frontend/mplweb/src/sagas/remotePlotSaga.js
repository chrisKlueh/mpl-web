import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import {
  establishPeerConnectionRequest,
  establishPeerConnectionSuccess,
  establishPeerConnectionError,
  stopPeerConnectionRequest,
  stopPeerConnectionSuccess,
  stopPeerConnectionError,
} from "../slices/remotePlotSlice";
import {
  establishSocketConnection,
  stopPeerConnection,
} from "../helpers/webRtcHelper";

export function* workerEstablishPeerConnection({ payload }) {
  const {
    setSocket,
    setPeerConnection,
    setDataChannel,
    hostId,
    pid,
    videoRef,
  } = payload;
  try {
    const res = yield call(establishSocketConnection, hostId, pid, videoRef);
    console.log(res);
    setSocket(res.socket);
    setPeerConnection(res.peerConnection);
    setDataChannel(res.dataChannel);
    yield put(establishPeerConnectionSuccess());
  } catch (error) {
    yield put(establishPeerConnectionError());
  }
}

export function* watcherEstablishPeerConnection() {
  yield takeEvery(
    establishPeerConnectionRequest,
    workerEstablishPeerConnection
  );
}

export function* workerStopPeerConnection({ payload }) {
  const { peerConnection } = payload;
  try {
    console.log(peerConnection);
    yield call(stopPeerConnection, peerConnection);
    yield put(stopPeerConnectionSuccess());
  } catch (error) {
    yield put(stopPeerConnectionError());
  }
}

export function* watcherStopPeerConnection() {
  yield takeEvery(stopPeerConnectionRequest, workerStopPeerConnection);
}

export default function* rootSaga() {
  yield all([
    fork(watcherEstablishPeerConnection),
    fork(watcherStopPeerConnection),
  ]);
}
