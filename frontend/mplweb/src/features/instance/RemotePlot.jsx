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
  // const [url, setUrl] = useState(null);
  let videoRef = useRef(null);

  // useEffect(() => {
  //   console.log("VIDEOREF");
  //   console.log(videoRef);
  //   videoRef.current?.load();
  // }, [videoRef]);

  const {
    establishSocketConnectionRequest,
    stopPeerConnectionRequest,
    hostId,
    pid,
    videoElement,
    isLoading,
  } = props;
  useEffect(() => {
    console.log(videoElement);
    //equals componentDidMount
    console.log("did mount");
    let client_io = null;
    let peerConnection = null;
    let dataChannel = null;
    establishSocketConnectionRequest({
      client_io: client_io,
      hostId: hostId,
      pid: pid,
      peerConnection: peerConnection,
      dataChannel: dataChannel,
      videoRef: videoRef,
    });
    console.log(client_io, peerConnection, dataChannel);
    //return statement equals componentWillUnmount
    return () => {
      console.log("will unmount");
      stopPeerConnectionRequest({ peerConnection: peerConnection });
    };
  }, [
    establishSocketConnectionRequest,
    stopPeerConnectionRequest,
    hostId,
    pid,
  ]);

  return (
    <Fragment>
      {isLoading ? (
        <div className={styles.loadingFragment}>
          <LoadingFragment message="Establishing connection.." />
        </div>
      ) : (
        <video className={styles.plotVideo} ref={videoRef} autoPlay controls />
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
