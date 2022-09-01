import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import styles from "./InstanceContainer.module.css";
import WrapperContainer from "../general/WrapperContainer";
import InstanceDescription from "./InstanceDescription";
import PlotControlBar from "./PlotControlBar";
import FeedbackDialog from "./FeedbackDialog";
import {
  showInstanceRequest,
  resetInstanceState,
} from "../../slices/instanceSlice";

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

  const handleSubmitFeedback = () => console.log("submitting feedback :)");

  const { isLoading, demo } = props;
  return (
    <WrapperContainer pageTitle={isLoading ? "Instance" : demo.title}>
      <div className={styles.root}>
        <InstanceDescription isLoading={isLoading} description={demo} />
        <div className={styles.videoContainer}>
          <video />
        </div>
        <PlotControlBar handleComment={() => setFeedbackDialogOpen(true)} />
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InstanceContainer);
