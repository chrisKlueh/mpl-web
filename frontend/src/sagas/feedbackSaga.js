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
import { snackbarNotification } from "../helpers/notifierHelper";

export function* workerShowFeedback() {
  try {
    const res = yield call(showFeedbackReq);
    yield put(showFeedbackSuccess(res.data));
  } catch (error) {
    yield put(showFeedbackError());
    yield put(snackbarNotification("Failed to load feedback.", "error"));
  }
}

export function* watcherShowFeedback() {
  yield takeEvery(showFeedbackRequest, workerShowFeedback);
}

export function* workerSubmitFeedback({ payload }) {
  try {
    const { feedbackType, feedback, demoId } = payload;
    if (payload.stacktrace) {
      yield call(
        submitFeedbackReq,
        feedbackType,
        feedback,
        demoId,
        payload.stacktrace
      );
    } else {
      yield call(submitFeedbackReq, feedbackType, feedback, demoId);
    }
    yield put(submitFeedbackSuccess());
    yield put(snackbarNotification("Feedback submitted.", "success"));
  } catch (error) {
    yield put(submitFeedbackError());
    yield put(snackbarNotification("Failed to submit feedback.", "error"));
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
    yield put(snackbarNotification("Feedback deleted.", "success"));
  } catch (error) {
    yield put(deleteFeedbackError());
    yield put(snackbarNotification("Failed to delete feedback.", "error"));
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
