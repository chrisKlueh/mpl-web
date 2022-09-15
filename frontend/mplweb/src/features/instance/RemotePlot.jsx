import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { io } from "socket.io-client";

import styles from "./RemotePlot.module.css";
import LoadingFragment from "../general/LoadingFragment";

import { establishSocketConnectionRequest } from "../../slices/remotePlotSlice";

// import { establishSocketConnection } from "../../helpers/webRtcHelper";

const RemotePlot = (props) => {
  const { establishSocketConnectionRequest, hostId, pid } = props;
  useEffect(() => {
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
    });
    //return statement equals componentWillUnmount
    return () => {
      console.log("will unmount");
    };
  }, [establishSocketConnectionRequest, hostId, pid]);

  let isLoading = true;
  return (
    <Fragment>
      {isLoading ? (
        <div className={styles.loadingFragment}>
          <LoadingFragment message="Establishing connection.." />
        </div>
      ) : (
        <video id="video" className={styles.plotVideo} />
      )}
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.remotePlot.isEstablishingConnection,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    establishSocketConnectionRequest: (payload) =>
      dispatch(establishSocketConnectionRequest(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemotePlot);
