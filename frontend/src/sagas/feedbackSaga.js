import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import {
  showFeedbackReq,
  submitFeedbackReq,
  deleteFeedbackReq,
} from "../api/feedbackRequests";
import {
  showFeedbackRequest,
  showFeedbackSuccess,
  showFeedbackError,
  submitFeedbackRequest,
  submitFeedbackSuccess,
  submitFeedbackError,
  deleteFeedbackRequest,
  deleteFeedbackSuccess,
  deleteFeedbackError,
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

export function* workerSubmitFeedback({ payload }) {
  try {
    const { feedbackType, feedback, demoId } = payload;
    yield call(submitFeedbackReq, feedbackType, feedback, demoId);
    yield put(submitFeedbackSuccess());
  } catch (error) {
    yield put(submitFeedbackError());
  }
}

export function* watcherSubmitFeedback() {
  yield takeEvery(submitFeedbackRequest, workerSubmitFeedback);
}

export function* workerDeleteFeedback({ payload }) {
  try {
    const { user_id, feedback_id } = payload;
    yield call(deleteFeedbackReq, user_id, feedback_id);
    yield put(deleteFeedbackSuccess());
    yield put(showFeedbackRequest());
  } catch (error) {
    yield put(deleteFeedbackError());
  }
}

export function* watcherDeleteFeedback() {
  yield takeEvery(deleteFeedbackRequest, workerDeleteFeedback);
}

export default function* rootSaga() {
  yield all([
    fork(watcherShowFeedback),
    fork(watcherSubmitFeedback),
    fork(watcherDeleteFeedback),
  ]);
}
