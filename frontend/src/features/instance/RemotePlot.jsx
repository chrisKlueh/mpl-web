import React, { Fragment, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";

import styles from "./RemotePlot.module.css";
import LoadingFragment from "../general/LoadingFragment";
import PlotControlBar from "./PlotControlBar";
import DebugMenu from "./DebugMenu";

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

const RemotePlot = (props) => {
  const [isDebugMenuOpen, setDebugMenuOpen] = useState(false);
  const [isAutoEventEnabled, setAutoEventEnabled] = useState(false);
  const [autoEventInterval, setAutoEventInterval] = useState(1);
  const [autoEventTimeout, setAutoEventTimeout] = useState(null);
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
    hostId,
    pid,
    isLoading,
    handleTerminate,
    handleComment,
    handleRestart,
    isAdmin,
  } = props;

  useEffect(() => {
    //equals componentDidMount
    handleConnect();
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
        if (autoEventTimeout === null) {
          videoRef.current.addEventListener(
            "mousedown",
            handleAutoSendMocketEvent,
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
    setAutoEventTimeout(
      setTimeout(() => {
        captureMouseRelated(event, dataChannel);
        setMockedEventLoop(event);
      }, autoEventInterval * 1000)
    );
  };

  const handleAutoSendMocketEvent = (event) => {
    if (event.buttons === 1 && isAutoEventEnabled) {
      console.log(
        "Sending mocked event every " + autoEventInterval + " seconds."
      );
      setMockedEventLoop(event);
    } else {
      console.log("Automated sending of mocked events not allowed.");
    }
  };

  const handleClearMockedEvent = () => {
    console.log("Clearing mocked event timeout.");
    clearTimeout(autoEventTimeout);
    setAutoEventTimeout(null);
  };

  const handleConnect = () => {
    establishPeerConnectionRequest({
      setPeerConnection: setPeerConnection,
      setDataChannel: setDataChannel,
      hostId: hostId,
      pid: pid,
      videoRef: videoRef,
    });
  };

  const handleDisconnect = () => {
    handleClearMockedEvent();
    stopPeerConnectionRequest({ peerConnection: peerConnectionMonitor() });
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

  return (
    <Fragment>
      <div className={styles.videoContainer}>
        {isLoading ? (
          <div className={styles.loadingFragment}>
            <LoadingFragment message="Establishing connection.." />
          </div>
        ) : (
          <video className={styles.plotVideo} ref={videoRef} autoPlay />
        )}
      </div>
      <PlotControlBar
        handleTerminate={handleTerminate}
        handleSave={handleSavePlot}
        handleComment={handleComment}
        handleRestart={handleRestart}
        handleOpenDebugMenu={() => setDebugMenuOpen(true)}
        disabled={isLoading}
        isAdmin={isAdmin}
      />
      <DebugMenu
        open={isDebugMenuOpen}
        handleClose={() => setDebugMenuOpen(false)}
        handleEnableAutomatedEvent={setAutoEventEnabled}
        interval={autoEventInterval}
        handleSetInterval={setAutoEventInterval}
        handleClearAutomatedEvent={handleClearMockedEvent}
        isAutomatedEventEnabled={isAutoEventEnabled}
      />
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.remotePlot.isEstablishingPeerConnection,
    isAdmin: state.login.isAdmin,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    establishPeerConnectionRequest: (payload) =>
      dispatch(establishPeerConnectionRequest(payload)),
    stopPeerConnectionRequest: (payload) =>
      dispatch(stopPeerConnectionRequest(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemotePlot);