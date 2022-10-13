import React, { Fragment } from "react";
import InfoDialogBase from "../general/InfoDialogBase";
import { DialogContentText } from "@mui/material";

const ErrorDialog = (props) => {
  const { open, errorDetails, handleClose, handleConfirm } = props;

  const errorDialogChildren = (
    <Fragment>
      <DialogContentText id="alert-dialog-description-1">
        {`Your demo instance encountered an error${errorDetails ? ":" : "."}`}
      </DialogContentText>
      {errorDetails && (
        <Fragment>
          <br />
          <DialogContentText id="alert-dialog-description-2">
            {errorDetails}
          </DialogContentText>
          <br />
        </Fragment>
      )}
      <DialogContentText id="alert-dialog-description-3">
        {"The instance might not work properly anymore."}
      </DialogContentText>
      <DialogContentText id="alert-dialog-description-4">
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
