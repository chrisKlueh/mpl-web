import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isGettingFeedback: false,
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
  },
});
export const { showFeedbackRequest, showFeedbackSuccess, showFeedbackError } =
  feedbackSlice.actions;

export default feedbackSlice.reducer;
