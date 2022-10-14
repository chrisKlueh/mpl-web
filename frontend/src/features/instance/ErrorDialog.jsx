import React, { Fragment } from "react";
import InfoDialogBase from "../general/InfoDialogBase";
import { DialogContentText } from "@mui/material";

import styles from "./ErrorDialog.module.css";

const ErrorDialog = (props) => {
  const { open, isAdmin, errorDetails, handleClose, handleConfirm } = props;

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

  return (
    errorDetails !== null && (
      <InfoDialogBase
        title={
          errorDetails.errorType === "peer_connection_error"
            ? "Peer Connection Lost"
            : "Instance Error"
        }
        handleClose={printTracebackAndClose}
        handleConfirm={handleConfirm}
        open={open}
        confirmString={"Terminate now"}
        cancelAllowed={errorDetails.errorType !== "peer_connection_error"}
      >
        {errorDetails.errorType === "peer_connection_error"
          ? errorDialogChildrenConnectionError
          : errorDialogChildrenDemoError}
      </InfoDialogBase>
    )
  );
};

export default ErrorDialog;
