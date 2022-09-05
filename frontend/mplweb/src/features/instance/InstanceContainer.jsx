import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import styles from "./InstanceContainer.module.css";
import WrapperContainer from "../general/WrapperContainer";
import LoadingFragment from "../general/LoadingFragment";
import InstanceDescription from "./InstanceDescription";
import PlotControlBar from "./PlotControlBar";
import FeedbackDialog from "./FeedbackDialog";
import {
  showInstanceRequest,
  resetInstanceState,
} from "../../slices/instanceSlice";
import { submitFeedbackRequest } from "../../slices/feedbackSlice";

const InstanceContainer = (props) => {
  const [isFeedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const { showInstanceRequest, resetInstanceState } = props;
  useEffect(() => {
    //equals componentDidMount
    showInstanceRequest();
    //return statement equals componentWillUnmount
    return () => {
      resetInstanceState();
    };
  }, [showInstanceRequest, resetInstanceState]);

  const handleTerminate = () => console.log("terminating webrtc stream");
  const handleSave = () => console.log("saving current plot");
  const handleRestart = () => console.log("restarting instance");

  const handleSubmitFeedback = (feedbackType, feedback) => {
    const { submitFeedbackRequest, demo } = props;
    const { id } = demo;
    console.log(id);
    submitFeedbackRequest({
      feedbackType: feedbackType,
      feedback: feedback,
      demoId: id,
    });
  };

  const { isLoading, demo } = props;
  return (
    <WrapperContainer pageTitle={isLoading ? "Instance" : demo.title}>
      <div className={styles.root}>
        <InstanceDescription isLoading={isLoading} description={demo} />
        <div className={styles.videoContainer}>
          {isLoading ? (
            <div className={styles.loadingFragment}>
              <LoadingFragment message="Establishing connection.." />
            </div>
          ) : (
            <video />
          )}
        </div>
        <PlotControlBar
          handleTerminate={handleTerminate}
          handleSave={handleSave}
          handleComment={() => setFeedbackDialogOpen(true)}
          handleRestart={handleRestart}
          disabled={isLoading}
        />
      </div>
      <FeedbackDialog
        open={isFeedbackDialogOpen}
        handleSubmit={handleSubmitFeedback}
        handleClose={() => setFeedbackDialogOpen(false)}
      />
    </WrapperContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    instance: state.instance.instance,
    demo: state.demo.demo,
    isLoading: state.instance.isGettingInstance || state.demo.isGettingDemo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetInstanceState: () => dispatch(resetInstanceState()),
    showInstanceRequest: (id) => dispatch(showInstanceRequest(id)),
    submitFeedbackRequest: (feedbackType, feedback, id) =>
      dispatch(submitFeedbackRequest(feedbackType, feedback, id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InstanceContainer);
