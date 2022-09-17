import React, { Fragment, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";

import styles from "./RemotePlot.module.css";
import LoadingFragment from "../general/LoadingFragment";
import PlotControlBar from "./PlotControlBar";

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

  const [socket, setSocket] = useState(null);
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
    videoElement,
    isLoading,
    handleTerminate,
    handleComment,
    handleRestart,
  } = props;

  const handleConnect = () => {
    establishPeerConnectionRequest({
      setSocket: setSocket,
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
    console.log(videoElement);
    //equals componentDidMount
    handleConnect();
  }, []);

  useEffect(() => {
    //return statement equals componentWillUnmount
    return () => {
      handleDisconnect();
    };
  }, []);

  useEffect(() => {
    if (dataChannel !== null) {
      generateEventListeners(eventListeners, dataChannel);
    }
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
    });
  };

  const addEventListeners = () => {
    eventListeners.map((item) => {
      videoRef.current.addEventListener(item.event, item.listener);
    });
    videoRef.current.addEventListener("mouseenter", handleFigureEnter);
    videoRef.current.addEventListener("mouseleave", handleFigureLeave);
    if (DEBUG_MOCK_EVENT) {
      videoRef.current.addEventListener("mousedown", handleToggleMockedEvent);
      videoRef.current.addEventListener("mousedown", handleMockedEvent);
    }
  };

  const removeEventListeners = () => {
    eventListeners.map((item) => {
      videoRef.current.removeEventListener(item.event, item.listener);
    });
    if (DEBUG_MOCK_EVENT) {
      videoRef.current.removeEventListener(
        "mousedown",
        handleToggleMockedEvent
      );
      videoRef.current.removeEventListener("mousedown", handleMockedEvent);
    }
  };

  return (
    <Fragment>
      <div className={styles.videoContainer}>
        {isLoading ? (
          <div className={styles.loadingFragment}>
            <LoadingFragment message="Establishing connection.." />
          </div>
        ) : (
          <video
            className={styles.plotVideo}
            ref={videoRef}
            autoPlay
            onMouseEnter={addEventListeners}
            onMouseLeave={removeEventListeners}
          />
        )}
      </div>
      <PlotControlBar
        handleTerminate={handleTerminate}
        handleSave={handleSavePlot}
        handleComment={handleComment}
        handleRestart={handleRestart}
        disabled={isLoading}
      />
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.remotePlot.isEstablishingPeerConnection,
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
