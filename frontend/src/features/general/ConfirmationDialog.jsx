import React from "react";
import { DialogContentText } from "@mui/material";

import InfoDialogBase from "./InfoDialogBase";

const ConfirmationDialog = (props) => {
  const { open, title, description, handleClose, handleConfirm } = props;

  const confirmationDialogChildren = (
    <DialogContentText id="alert-dialog-description">
      {description}
    </DialogContentText>
  );

  return (
    <InfoDialogBase
      title={title}
      handleClose={handleClose}
      handleConfirm={handleConfirm}
      open={open}
      cancelAllowed
    >
      {confirmationDialogChildren}
    </InfoDialogBase>
  );
};

export default ConfirmationDialog;
