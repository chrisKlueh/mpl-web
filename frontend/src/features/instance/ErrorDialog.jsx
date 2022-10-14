import React, { Fragment } from "react";
import InfoDialogBase from "../general/InfoDialogBase";
import { DialogContentText } from "@mui/material";

import styles from "./ErrorDialog.module.css";

const ErrorDialog = (props) => {
  const { open, isAdmin, errorDetails, handleClose, handleConfirm } = props;

  const getTitle = (errorName) => {
    switch (errorName) {
      case "timeout_error":
        return "Connection Timeout";
      case "peer_connection_error":
        return "Peer Connection Lost";
      case "demo_error":
        return "Instance Error";
      default:
        return;
    }
  };

  const printTracebackAndClose = () => {
    if (
      isAdmin &&
      errorDetails &&
      errorDetails.generatedDetails &&
      errorDetails.errorType === "demo_error"
    ) {
      console.log(errorDetails.generatedDetails);
    }
    handleClose();
  };

  const errorDialogChildrenTimeoutError = errorDetails !== null && (
    <Fragment>
      <DialogContentText id="alert-dialog-description">
        {`A timeout occurred when establishing the peer connection${
          isAdmin ? ":" : "."
        }`}
      </DialogContentText>
      {errorDetails.description && isAdmin && (
        <DialogContentText className={styles.errorDescription}>
          {errorDetails.description}
        </DialogContentText>
      )}
      <DialogContentText>
        {"Try to spawn a new instance of this demo."}
      </DialogContentText>
    </Fragment>
  );

  const errorDialogChildrenConnectionError = errorDetails !== null && (
    <Fragment>
      <DialogContentText id="alert-dialog-description">
        {`The peer connection to your instance was lost${isAdmin ? ":" : "."}`}
      </DialogContentText>
      {errorDetails.description && isAdmin && (
        <DialogContentText className={styles.errorDescription}>
          {errorDetails.description}
        </DialogContentText>
      )}
      <DialogContentText>
        {"Try to spawn a new instance of this demo."}
      </DialogContentText>
    </Fragment>
  );

  const errorDialogChildrenDemoError = errorDetails !== null && (
    <Fragment>
      <DialogContentText id="alert-dialog-description">
        {`Your demo instance encountered an internal error${
          errorDetails !== null && isAdmin ? ":" : "."
        }`}
      </DialogContentText>
      {errorDetails.description && isAdmin && (
        <DialogContentText className={styles.errorDescription}>
          {errorDetails.description}
        </DialogContentText>
      )}
      <DialogContentText>
        {"The instance might not work properly anymore."}
      </DialogContentText>
      {errorDetails.generatedDetails && isAdmin && (
        <DialogContentText>
          {"The exception's traceback will be printed to your console."}
        </DialogContentText>
      )}
      <DialogContentText>
        {"Do you want to terminate it now?"}
      </DialogContentText>
    </Fragment>
  );

  const getChildren = (errorName) => {
    switch (errorName) {
      case "timeout_error":
        return errorDialogChildrenTimeoutError;
      case "peer_connection_error":
        return errorDialogChildrenConnectionError;
      case "demo_error":
        return errorDialogChildrenDemoError;
      default:
        return;
    }
  };

  return (
    errorDetails !== null && (
      <InfoDialogBase
        title={getTitle(errorDetails.errorType)}
        handleClose={printTracebackAndClose}
        handleConfirm={handleConfirm}
        open={open}
        confirmString={"Terminate now"}
        cancelAllowed={errorDetails.errorType === "demo_error"}
      >
        {getChildren(errorDetails.errorType)}
      </InfoDialogBase>
    )
  );
};

export default ErrorDialog;
