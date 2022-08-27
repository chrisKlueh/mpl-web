import React, { Component } from "react";
import { connect } from "react-redux";

import WrapperContainer from "../wrapper/WrapperContainer";
import { showFeedbackRequest } from "../../slices/feedbackSlice";

class FeedbackContainer extends Component {
  componentDidMount() {
    this.handleShowFeedback();
  }

  handleShowFeedback = () => {
    const { showFeedbackRequest } = this.props;
    showFeedbackRequest();
  };

  renderFeedback = (feedback, isLoading) => {
    if (isLoading) {
      return <div>LOADING...</div>;
    } else {
      return feedback.map((feedback) => {
        return (
          <div>
            <div>
              id: {feedback.id} created_at: {feedback.created_at} type:{" "}
              {feedback.type} demo: {feedback.demo}
            </div>
            <div>details: {feedback.details}</div>
            <br />
          </div>
        );
      });
    }
  };

  render() {
    const { isLoading, feedback } = this.props;
    return (
      <WrapperContainer pageTitle="FeedbackContainer">
        {this.renderFeedback(feedback, isLoading)}
      </WrapperContainer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    feedback: state.feedback.feedback,
    isLoading: state.feedback.isGettingFeedback,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showFeedbackRequest: () => dispatch(showFeedbackRequest()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackContainer);
