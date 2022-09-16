import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import {
  establishSocketConnectionRequest,
  establishSocketConnectionSuccess,
  establishSocketConnectionError,
  startWebRtcRequest,
  startWebRtcSuccess,
  startWebRtcError,
  negotiateWebRtcRequest,
  negotiateWebRtcSuccess,
  negotiateWebRtcError,
  stopPeerConnectionRequest,
  stopPeerConnectionSuccess,
  stopPeerConnectionError,
} from "../slices/remotePlotSlice";
import {
  establishSocketConnection,
  stopPeerConnection,
  // startWebRtc,
  // negotiateWebRtc,
} from "../helpers/webRtcHelper";

export function* workerEstablishConnection({ payload }) {
  const {
    client_io,
    hostId,
    pid,
    peerConnection,
    dataChannel,
    videoRef,
    setSocket,
    setPeerConnection,
    setDataChannel,
  } = payload;
  try {
    const res = yield call(
      establishSocketConnection,
      client_io,
      hostId,
      pid,
      peerConnection,
      dataChannel,
      videoRef
    );
    console.log(res);
    setSocket(res.socket);
    setPeerConnection(res.peerConnection);
    setDataChannel(res.dataChannel);
    yield put(establishSocketConnectionSuccess());
    // yield put(
    //   startWebRtcRequest({
    //     socket: client_io,
    //     peerConnection: peerConnection,
    //     dataChannel: dataChannel,
    //     myRoom: res,
    //   })
    // );
  } catch (error) {
    yield put(establishSocketConnectionError());
  }
}

export function* watcherEstablishConnection() {
  yield takeEvery(establishSocketConnectionRequest, workerEstablishConnection);
}

export function* workerStopPeerConnection({ payload }) {
  const { peerConnection } = payload;
  try {
    console.log(peerConnection);
    // const res = yield call(stopPeerConnection, peerConnection);
    // console.log("stop peer conn res:" + res);
    peerConnection.close();
    yield put(stopPeerConnectionSuccess());
  } catch (error) {
    yield put(stopPeerConnectionError());
  }
}

export function* watcherStopPeerConnection() {
  yield takeEvery(stopPeerConnectionRequest, workerStopPeerConnection);
}

// export function* workerStartWebRtc({ payload }) {
//   const { socket, peerConnection, dataChannel, myRoom } = payload;
//   try {
//     const res = yield call(
//       startWebRtc,
//       socket,
//       peerConnection,
//       dataChannel,
//       myRoom
//     );
//     console.log(res);
//     yield put(startWebRtcSuccess());
//     yield put(
//       negotiateWebRtcRequest({
//         socket: socket,
//         peerConnection: peerConnection,
//         myRoom: myRoom,
//       })
//     );
//   } catch (error) {
//     yield put(startWebRtcError());
//   }
// }

// export function* watcherStartWebRtc() {
//   yield takeEvery(startWebRtcRequest, workerStartWebRtc);
// }

// export function* workerNegotiateWebRtc({ payload }) {
//   const { socket, peerConnection, myRoom } = payload;
//   try {
//     const res = yield call(negotiateWebRtc, socket, peerConnection, myRoom);
//     console.log(res);
//     yield put(negotiateWebRtcSuccess());
//   } catch (error) {
//     yield put(negotiateWebRtcError());
//   }
// }

// export function* watcherNegotiateWebRtc() {
//   yield takeEvery(negotiateWebRtcRequest, workerNegotiateWebRtc);
// }

export default function* rootSaga() {
  yield all([
    fork(watcherEstablishConnection),
    fork(watcherStopPeerConnection),
    // fork(watcherStartWebRtc),
    // fork(watcherNegotiateWebRtc),
  ]);
}
