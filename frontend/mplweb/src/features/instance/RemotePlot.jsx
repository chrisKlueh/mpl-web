import React, { Fragment, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { io } from "socket.io-client";

import styles from "./RemotePlot.module.css";
import LoadingFragment from "../general/LoadingFragment";

import {
  establishSocketConnectionRequest,
  stopPeerConnectionRequest,
} from "../../slices/remotePlotSlice";

// import { establishSocketConnection } from "../../helpers/webRtcHelper";

const RemotePlot = (props) => {
  const [socket, setSocket] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [dataChannel, setDataChannel] = useState(null);

  let videoRef = useRef(null);

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
      client_io: socket,
      hostId: hostId,
      pid: pid,
      peerConnection: peerConnection,
      dataChannel: dataChannel,
      videoRef: videoRef,
      setSocket: setSocket,
      setPeerConnection: setPeerConnection,
      setDataChannel: setDataChannel,
    });
  };

  const handleDisconnect = () => {
    stopPeerConnectionRequest({ peerConnection: peerConnection });
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
  });

  console.log(socket, peerConnection, dataChannel);
  return (
    <Fragment>
      {isLoading ? (
        <div className={styles.loadingFragment}>
          <LoadingFragment message="Establishing connection.." />
        </div>
      ) : (
        <video className={styles.plotVideo} ref={videoRef} autoPlay />
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
