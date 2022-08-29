import React, { Component } from "react";
import { connect } from "react-redux";

import WrapperContainer from "../general/WrapperContainer";
import { showFeedbackRequest } from "../../slices/feedbackSlice";
import FeedbackList from "./FeedbackList";

class FeedbackContainer extends Component {
  componentDidMount() {
    this.handleShowFeedback();
  }

  handleShowFeedback = () => {
    const { showFeedbackRequest } = this.props;
    showFeedbackRequest();
  };

  render() {
    const { isLoading, feedback } = this.props;
    return (
      <WrapperContainer pageTitle="Feedback">
        <FeedbackList listItems={feedback} isLoadingFeedback={isLoading} />
      </WrapperContainer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    feedback: state.feedback.feedback,
    isLoading:
      state.feedback.isGettingFeedback || state.feedback.isDeletingFeedback,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showFeedbackRequest: () => dispatch(showFeedbackRequest()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackContainer);
