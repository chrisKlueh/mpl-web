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
  //to send a mocked mousedown event every mocketEventDelay ms
  //mouse over plot and press middle mouse btn
  //then leave plot
  //then mouse over plot again and press left mouse btn
  const DEBUG_MOCK_EVENT = false;
  const [allowMockedEvent, setAllowMockedEvent] = useState(false);
  const [hasMockedEvent, setHasMockedEvent] = useState(false);
  const mockedEventDelay = 1000;
  const handleToggleMockedEvent = (event) => {
    console.log(event.buttons);
    if (event.buttons === 4) {
      setAllowMockedEvent(!allowMockedEvent);
      console.log("toggled mockEvent");
    }
  };

  const handleMockedEvent = (event) => {
    console.log(event.buttons);
    console.log(hasMockedEvent);
    console.log(allowMockedEvent);
    if (!hasMockedEvent && event.buttons === 1 && allowMockedEvent) {
      setHasMockedEvent(true);
      console.log("set first mouse down event");
      console.log(event);
      console.log("setting timeout");
      setTimeout(() => {
        sendMockedEvent(event);
      }, mockedEventDelay);
    }
  };

  const sendMockedEvent = (event) => {
    console.log(dataChannel);
    if (dataChannel.readyState !== "closed") {
      captureMouseRelated(event, dataChannel);
      console.log("sent mocket event");
      setTimeout(() => {
        sendMockedEvent(event);
      }, mockedEventDelay);
    } else {
      console.log("stopped sending mocked events");
    }
  };

  ///////////////////////////////////
  const [isDebugMenuOpen, setDebugMenuOpen] = useState(false);
  const [isAutoEventEnabled, setAutoEventEnabled] = useState(false);
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
    stopPeerConnectionRequest({ peerConnection: peerConnectionMonitor() });
  };

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
    if (DEBUG_MOCK_EVENT) {
      videoRef.current.addEventListener("mousedown", handleToggleMockedEvent);
      videoRef.current.addEventListener("mousedown", handleMockedEvent);
    }
  };

  console.log(isAutoEventEnabled);
  console.log(autoEventInterval);
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
        handleSetInterval={setAutoEventInterval}
        isAutomatedEventEnabled={!isAutoEventEnabled}
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
