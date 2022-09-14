import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";

import styles from "./RemotePlot.module.css";
import LoadingFragment from "../general/LoadingFragment";

import { establishConnectionRequest } from "../../slices/remotePlotSlice";

// import { establishSocketConnection } from "../../helpers/webRtcHelper";

const RemotePlot = (props) => {
  const { establishConnectionRequest, hostId, pid } = props;
  useEffect(() => {
    //equals componentDidMount
    establishConnectionRequest({ hostId: hostId, pid: pid });
    //return statement equals componentWillUnmount
    return () => {
      console.log("will unmount");
    };
  }, [establishConnectionRequest, hostId, pid]);

  let isLoading = true;
  return (
    <Fragment>
      {isLoading ? (
        <div className={styles.loadingFragment}>
          <LoadingFragment message="Establishing connection.." />
        </div>
      ) : (
        <video className={styles.plotVideo} />
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
    establishConnectionRequest: (payload) =>
      dispatch(establishConnectionRequest(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemotePlot);
