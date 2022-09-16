import React, { Fragment, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { io } from "socket.io-client";

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
    console.log("did mount");
    handleConnect();
  }, []);

  useEffect(() => {
    //return statement equals componentWillUnmount
    return () => {
      console.log("will unmount");
      handleDisconnect();
    };
  }, []);

  const handleKeyDown = (event) => {
    captureKeyRelated(event, dataChannel);
  };

  const handleKeyUp = (event) => {
    captureKeyRelated(event, dataChannel);
  };

  const handleMouseDown = (event) => {
    captureMouseRelated(event, dataChannel);
  };

  const handleMouseUp = (event) => {
    captureMouseRelated(event, dataChannel);
  };

  const handleFigureEnter = (event) => {
    captureMouseRelated(event, dataChannel);
  };

  const handleFigureLeave = (event) => {
    captureMouseRelated(event, dataChannel);
  };

  const handleMouseMove = (event) => {
    captureMouseRelated(event, dataChannel);
  };

  const handleMouseWheel = (event) => {
    captureMouseRelated(event, dataChannel);
  };

  const suppressContextMenu = (event) => {
    handleContextMenu(event, dataChannel);
  };

  const addEventListeners = () => {
    console.log("mouseenter: adding event listeners");
    videoRef.current.addEventListener("mousedown", handleMouseDown);
    videoRef.current.addEventListener("mouseup", handleMouseUp);
    videoRef.current.addEventListener("keydown", handleKeyDown);
    videoRef.current.addEventListener("keyup", handleKeyUp);
    videoRef.current.addEventListener("mousemove", handleMouseMove);
    videoRef.current.addEventListener("wheel", handleMouseWheel);
    videoRef.current.addEventListener("contextmenu", suppressContextMenu);
    videoRef.current.addEventListener("mouseenter", handleFigureEnter);
    videoRef.current.addEventListener("mouseleave", handleFigureLeave);
  };

  const removeEventListeners = () => {
    console.log("mouseleave: removing event listeners");
    videoRef.current.removeEventListener("mousedown", handleMouseDown);
    videoRef.current.removeEventListener("mouseup", handleMouseUp);
    videoRef.current.removeEventListener("keydown", handleKeyDown);
    videoRef.current.removeEventListener("keyup", handleKeyUp);
    videoRef.current.removeEventListener("mousemove", handleMouseMove);
    videoRef.current.removeEventListener("wheel", handleMouseWheel);
    videoRef.current.removeEventListener("contextmenu", suppressContextMenu);
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
