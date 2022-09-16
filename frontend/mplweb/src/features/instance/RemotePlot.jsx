import React, { Fragment, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";

import styles from "./RemotePlot.module.css";
import LoadingFragment from "../general/LoadingFragment";

import {
  establishSocketConnectionRequest,
  stopPeerConnectionRequest,
} from "../../slices/remotePlotSlice";

import {
  captureKeyRelated,
  captureMouseRelated,
  handleContextMenu,
} from "../../helpers/inputCaptureHelper";

const RemotePlot = (props) => {
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
    establishSocketConnectionRequest,
    stopPeerConnectionRequest,
    hostId,
    pid,
    videoElement,
    isLoading,
  } = props;

  const handleConnect = () => {
    establishSocketConnectionRequest({
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
  };

  const removeEventListeners = () => {
    eventListeners.map((item) => {
      videoRef.current.removeEventListener(item.event, item.listener);
    });
  };

  return (
    <Fragment>
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
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.remotePlot.isEstablishingSocketConnection,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    establishSocketConnectionRequest: (payload) =>
      dispatch(establishSocketConnectionRequest(payload)),
    stopPeerConnectionRequest: (payload) =>
      dispatch(stopPeerConnectionRequest(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemotePlot);
