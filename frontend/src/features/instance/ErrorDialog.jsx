import React, { Fragment } from "react";
import InfoDialogBase from "../general/InfoDialogBase";
import { DialogContentText } from "@mui/material";

const ErrorDialog = (props) => {
  const { open, isAdmin, errorDetails, handleClose, handleConfirm } = props;

  if (isAdmin && errorDetails && errorDetails.stacktrace) {
    console.log(errorDetails.stacktrace);
  }

  const errorDialogChildren = (
    <Fragment>
      <DialogContentText id="alert-dialog-description-1">
        {`Your demo instance encountered an internal error${
          errorDetails !== null && isAdmin ? ":" : "."
        }`}
      </DialogContentText>
      {errorDetails && errorDetails.description && isAdmin && (
        <Fragment>
          <br />
          <DialogContentText id="alert-dialog-description-2">
            {errorDetails.description}
          </DialogContentText>
          <br />
        </Fragment>
      )}
      <DialogContentText id="alert-dialog-description-3">
        {"The instance might not work properly anymore."}
      </DialogContentText>
      {errorDetails && errorDetails.stacktrace && isAdmin && (
        <DialogContentText id="alert-dialog-description-4">
          {"The exception's stack trace has been printed to your console."}
        </DialogContentText>
      )}
      <DialogContentText id="alert-dialog-description-5">
        {"Do you want to terminate it now?"}
      </DialogContentText>
    </Fragment>
  );

  return (
    <InfoDialogBase
      title="Instance Error"
      handleClose={handleClose}
      handleConfirm={handleConfirm}
      open={open}
      confirmString={"Terminate now"}
    >
      {errorDialogChildren}
    </InfoDialogBase>
  );
};

export default ErrorDialog;
