import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import styles from "./InstanceContainer.module.css";
import WrapperContainer from "../general/WrapperContainer";
import ConfirmationDialog from "../general/ConfirmationDialog";
import InstanceDescription from "./InstanceDescription";
import PlotControlBar from "./PlotControlBar";
import FeedbackDialog from "./FeedbackDialog";
import RemotePlot from "./RemotePlot";

import {
  resetInstanceState,
  deleteInstanceRequest,
} from "../../slices/instanceSlice";
import { showDemoRequest } from "../../slices/demoSlice";
import { submitFeedbackRequest } from "../../slices/feedbackSlice";

const InstanceContainer = (props) => {
  const [isFeedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [isTerminateDialogOpen, setTerminateDialogOpen] = useState(false);
  const [isRestartDialogOpen, setRestartDialogOpen] = useState(false);

  const navigate = useNavigate();
  const {
    showDemoRequest,
    resetInstanceState,
    deleteInstanceRequest,
    instance,
    userId,
  } = props;
  useEffect(() => {
    //equals componentDidMount
    showDemoRequest(instance.demo);
    //return statement equals componentWillUnmount
    return () => {
      deleteInstanceRequest({
        userId: userId,
        instanceId: instance.id,
        hostId: instance.host,
        pid: instance.pid,
      });
      resetInstanceState();
    };
  }, [showDemoRequest, resetInstanceState]);

  const handleTerminate = () => {
    navigate("/demos/");
  };
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
          <RemotePlot />
        </div>
        <PlotControlBar
          handleTerminate={() => setTerminateDialogOpen(true)}
          handleSave={handleSave}
          handleComment={() => setFeedbackDialogOpen(true)}
          handleRestart={() => setRestartDialogOpen(true)}
          disabled={isLoading}
        />
      </div>
      <FeedbackDialog
        open={isFeedbackDialogOpen}
        handleSubmit={handleSubmitFeedback}
        handleClose={() => setFeedbackDialogOpen(false)}
      />
      <ConfirmationDialog
        title="Confirm instance termination"
        description="Do you really want to terminate this instance?"
        handleClose={() => setTerminateDialogOpen(false)}
        handleConfirm={handleTerminate}
        open={isTerminateDialogOpen}
      />
      <ConfirmationDialog
        title="Confirm instance restart"
        description="Do you really want to restart this instance?"
        handleClose={() => setRestartDialogOpen(false)}
        handleConfirm={handleRestart}
        open={isRestartDialogOpen}
      />
    </WrapperContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.login.userId,
    instance: state.instance.instance,
    demo: state.demo.demo,
    isLoading: state.demo.isGettingDemo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetInstanceState: () => dispatch(resetInstanceState()),
    deleteInstanceRequest: (payload) =>
      dispatch(deleteInstanceRequest(payload)),
    showDemoRequest: (id) => dispatch(showDemoRequest(id)),
    submitFeedbackRequest: (payload) =>
      dispatch(submitFeedbackRequest(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InstanceContainer);
