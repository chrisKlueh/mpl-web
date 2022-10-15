import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import styles from "./InstanceContainer.module.css";
import WrapperContainer from "../general/WrapperContainer";
import ConfirmationDialog from "../general/ConfirmationDialog";
import InstanceDescription from "./InstanceDescription";
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
      });
      resetInstanceState();
    };
  }, [
    showDemoRequest,
    resetInstanceState,
    deleteInstanceRequest,
    userId,
    instance,
  ]);

  const handleTerminate = () => {
    navigate("/demos/");
  };

  const handleSubmitFeedback = (feedbackType, feedback) => {
    const { submitFeedbackRequest, demo } = props;
    const { id } = demo;
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
        <RemotePlot
          instanceId={instance.id}
          handleTerminate={() => setTerminateDialogOpen(true)}
          handleComment={() => setFeedbackDialogOpen(true)}
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
