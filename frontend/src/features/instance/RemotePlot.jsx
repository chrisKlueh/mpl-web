import React, { Fragment, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import styles from "./RemotePlot.module.css";
import LoadingFragment from "../general/LoadingFragment";
import PlotControlBar from "./PlotControlBar";
import DebugMenu from "./DebugMenu";
import ErrorDialog from "./ErrorDialog";
import FeedbackDialog from "./FeedbackDialog";

import {
  establishPeerConnectionRequest,
  stopPeerConnectionRequest,
} from "../../slices/remotePlotSlice";

import {
  captureKeyRelated,
  captureMouseRelated,
  handleContextMenu,
  requestSnapshot,
} from "../../helpers/inputCaptureHelper";

import { submitFeedbackRequest } from "../../slices/feedbackSlice";
import { deleteInstanceRequest } from "../../slices/instanceSlice";

const RemotePlot = (props) => {
  const [isPeerDisconnected, setPeerDisconnected] = useState(false);
  const [isDebugMenuOpen, setDebugMenuOpen] = useState(false);
  const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorDialogDetails, setErrorDialogDetails] = useState(null);
  const [isBugReportDialogOpen, setBugReportDialogOpen] = useState(false);
  const [isAutoEventEnabled, setAutoEventEnabled] = useState(false);
  const [autoEventFrequency, setAutoEventFrequency] = useState(1);
  const [autoEventInterval, setAutoEventInterval] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [dataChannel, setDataChannel] = useState(null);
  const [eventListeners, setEventListeners] = useState([
    { event: "mousedown", handlerBase: "mouse", listener: null },
    { event: "mouseup", handlerBase: "mouse", listener: null },
    { event: "mousemove", handlerBase: "mouse", listener: null },
    { event: "wheel", handlerBase: "mouse", listener: null },
    { event: "keydown", handlerBase: "key", listener: null },
    { event: "keyup", handlerBase: "key", listener: null },
    { event: "contextmenu", handlerBase: "context", listener: null },
  ]);

  const navigate = useNavigate();

  const videoRef = useRef(null);
  const useStateMonitor = (state) => {
    const ref = useRef();
    ref.current = state;
    return () => ref.current;
  };
  const peerConnectionMonitor = useStateMonitor(peerConnection);

  const {
    establishPeerConnectionRequest,
    stopPeerConnectionRequest,
    instanceId,
    userId,
    isLoading,
    handleTerminate,
    handleComment,
    isAdmin,
    deleteInstanceRequest,
  } = props;

  useEffect(() => {
    //equals componentDidMount
    if (instanceId) {
      handleConnect();
    } else {
      setErrorDialogDetails({
        errorType: "user_error",
        description: "User error",
        generatedDetails:
          "The user tried to access an instance via URL or refreshed their current tab",
      });
      setErrorDialogOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //return statement equals componentWillUnmount
    return () => {
      handleDisconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (dataChannel !== null) {
      setEventListeners(generateEventListeners(eventListeners, dataChannel));
      addEventListeners();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataChannel]);

  useEffect(() => {
    if (!isDebugMenuOpen) {
      if (isAutoEventEnabled) {
        if (autoEventInterval === null) {
          videoRef.current.addEventListener(
            "mousedown",
            handleAutoSendMockedEvent,
            {
              once: true,
            }
          );
        } else {
          console.log(
            "Sending multiple automated events simultaneously not allowed."
          );
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDebugMenuOpen]);

  const setMockedEventLoop = (event) => {
    setAutoEventInterval(
      setInterval(() => {
        captureMouseRelated(event, dataChannel);
      }, autoEventFrequency * 1000)
    );
  };

  const handleAutoSendMockedEvent = (event) => {
    if (event.buttons === 1 && isAutoEventEnabled) {
      console.log(
        "Sending mocked event every " + autoEventFrequency + " seconds."
      );
      setMockedEventLoop(event);
    } else {
      console.log("Automated sending of mocked events not allowed.");
    }
  };

  const handleClearMockedEvent = () => {
    console.log("Clearing mocked event interval.");
    clearInterval(autoEventInterval);
    setAutoEventInterval(null);
  };

  const handleConnect = () => {
    establishPeerConnectionRequest({
      setPeerConnection: setPeerConnection,
      setDataChannel: setDataChannel,
      instanceId: instanceId,
      videoRef: videoRef,
      setErrorDialogDetails: setErrorDialogDetails,
      setErrorDialogOpen: setErrorDialogOpen,
      setPeerDisconnected: setPeerDisconnected,
    });
  };

  const handleDisconnect = () => {
    handleClearMockedEvent();
    if (peerConnectionMonitor()) {
      stopPeerConnectionRequest({ peerConnection: peerConnectionMonitor() });
    }
    if (instanceId) {
      deleteInstanceRequest({
        userId: userId,
        instanceId: instanceId,
      });
    }
  };

  const handleFigureEnter = (event) => {
    captureMouseRelated(event, dataChannel);
  };

  const handleFigureLeave = (event) => {
    captureMouseRelated(event, dataChannel);
  };

  const handleSavePlot = () => requestSnapshot(dataChannel);

  const generateEventListeners = (eventList, dataChannel) => {
    eventList.map((item) => {
      switch (item.handlerBase) {
        case "mouse":
          item.listener = (event) => captureMouseRelated(event, dataChannel);
          break;
        case "key":
          item.listener = (event) => captureKeyRelated(event, dataChannel);
          break;
        case "context":
          item.listener = (event) => handleContextMenu(event, dataChannel);
          break;
        default:
          break;
      }
      return eventList;
    });
  };

  const addEventListeners = () => {
    eventListeners.map((item) =>
      videoRef.current.addEventListener(item.event, item.listener)
    );

    videoRef.current.addEventListener("mouseenter", handleFigureEnter);
    videoRef.current.addEventListener("mouseleave", handleFigureLeave);
  };

  const handleSubmitBugReport = (feedbackType, feedback) => {
    const { submitFeedbackRequest, demo } = props;
    const { id } = demo;
    submitFeedbackRequest({
      feedbackType: feedbackType,
      feedback: feedback,
      demoId: id,
      generatedDetails: errorDialogDetails.generatedDetails,
    });
    navigate("/demos/");
  };

  const handleDismissBugReport = () => {
    setBugReportDialogOpen(false);
    navigate("/demos/");
  };

  const handleConfirmErrorDialog = (allowBugreport) => {
    if (allowBugreport) {
      setBugReportDialogOpen(true);
    } else {
      navigate("/demos/");
    }
  };

  return (
    <Fragment>
      <div className={styles.videoContainer}>
        {isLoading || isPeerDisconnected ? (
          <div className={styles.loadingFragment}>
            <LoadingFragment message="Establishing connection.." />
          </div>
        ) : (
          <video className={styles.plotVideo} ref={videoRef} autoPlay />
        )}
        <PlotControlBar
          handleTerminate={handleTerminate}
          handleSave={handleSavePlot}
          handleComment={handleComment}
          handleOpenDebugMenu={() => setDebugMenuOpen(true)}
          disabled={isLoading}
          isAdmin={isAdmin}
        />
      </div>
      <DebugMenu
        open={isDebugMenuOpen}
        handleClose={() => setDebugMenuOpen(false)}
        handleEnableAutomatedEvent={setAutoEventEnabled}
        frequency={autoEventFrequency}
        handleSetFrequency={setAutoEventFrequency}
        handleClearAutomatedEvent={handleClearMockedEvent}
        isAutomatedEventEnabled={isAutoEventEnabled}
      />
      <ErrorDialog
        open={isErrorDialogOpen}
        isAdmin={isAdmin}
        errorDetails={errorDialogDetails}
        handleClose={() => setErrorDialogOpen(false)}
        handleConfirm={handleConfirmErrorDialog}
      />
      <FeedbackDialog
        open={isBugReportDialogOpen}
        handleSubmit={handleSubmitBugReport}
        handleClose={handleDismissBugReport}
        bugReport
        cancelString={"Dismiss"}
      />
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.remotePlot.isEstablishingPeerConnection,
    isAdmin: state.login.isAdmin,
    demo: state.demo.demo,
    userId: state.login.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    establishPeerConnectionRequest: (payload) =>
      dispatch(establishPeerConnectionRequest(payload)),
    stopPeerConnectionRequest: (payload) =>
      dispatch(stopPeerConnectionRequest(payload)),
    submitFeedbackRequest: (payload) =>
      dispatch(submitFeedbackRequest(payload)),
    deleteInstanceRequest: (payload) =>
      dispatch(deleteInstanceRequest(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemotePlot);
