import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isGettingFeedback: false,
  isDeletingFeedback: false,
  feedback: [],
};

export const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    showFeedbackRequest: (state, action) => {
      state.isGettingFeedback = true;
    },
    showFeedbackSuccess: (state, action) => {
      state.feedback = action.payload;
      state.isGettingFeedback = false;
    },
    showFeedbackError: (state, action) => {
      state.isGettingFeedback = false;
    },
    deleteFeedbackRequest: (state, action) => {
      state.isDeletingFeedback = true;
    },
    deleteFeedbackSuccess: (state, action) => {
      state.isDeletingFeedback = false;
    },
    deleteFeedbackError: (state, action) => {
      state.isDeletingFeedback = false;
    },
  },
});
export const {
  showFeedbackRequest,
  showFeedbackSuccess,
  showFeedbackError,
  deleteFeedbackRequest,
  deleteFeedbackSuccess,
  deleteFeedbackError,
} = feedbackSlice.actions;

export default feedbackSlice.reducer;
