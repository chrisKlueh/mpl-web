import React, { Fragment } from "react";
import InfoDialogBase from "../general/InfoDialogBase";
import { DialogContentText } from "@mui/material";

import styles from "./ErrorDialog.module.css";

const ErrorDialog = (props) => {
  const { open, isAdmin, errorDetails, handleClose, handleConfirm } = props;

  const printTracebackAndClose = () => {
    if (isAdmin && errorDetails && errorDetails.stacktrace) {
      console.log(errorDetails.stacktrace);
    }
    handleClose();
  };

  const errorDialogChildren = (
    <Fragment>
      <DialogContentText id="alert-dialog-description">
        {`Your demo instance encountered an internal error${
          errorDetails !== null && isAdmin ? ":" : "."
        }`}
      </DialogContentText>
      {errorDetails && errorDetails.description && isAdmin && (
        <DialogContentText className={styles.errorDescription}>
          {errorDetails.description}
        </DialogContentText>
      )}
      <DialogContentText>
        {"The instance might not work properly anymore."}
      </DialogContentText>
      {errorDetails && errorDetails.stacktrace && isAdmin && (
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
    <InfoDialogBase
      title="Instance Error"
      handleClose={printTracebackAndClose}
      handleConfirm={handleConfirm}
      open={open}
      confirmString={"Terminate now"}
    >
      {errorDialogChildren}
    </InfoDialogBase>
  );
};

export default ErrorDialog;
