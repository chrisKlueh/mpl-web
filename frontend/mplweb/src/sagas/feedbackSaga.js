import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import { showFeedbackReq } from "../api/feedbackRequests";
import {
  showFeedbackRequest,
  showFeedbackSuccess,
  showFeedbackError,
} from "../slices/feedbackSlice";

export function* workerShowFeedback() {
  try {
    const res = yield call(showFeedbackReq);
    yield put(showFeedbackSuccess(res.data));
  } catch (error) {
    yield put(showFeedbackError());
  }
}

export function* watcherShowFeedback() {
  yield takeEvery(showFeedbackRequest, workerShowFeedback);
}

export default function* rootSaga() {
  yield all([fork(watcherShowFeedback)]);
}
