import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const InfoDialogBase = (props) => {
  const {
    open,
    title,
    closeString,
    confirmString,
    handleClose,
    handleConfirm,
  } = props;

  const handleConfirmAndClose = () => {
    handleConfirm();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>{props.children}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {closeString ? closeString : "Cancel"}
        </Button>
        <Button onClick={handleConfirmAndClose} color="primary" autoFocus>
          {confirmString ? confirmString : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoDialogBase;
