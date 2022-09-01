import React from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import FeedbackForm from "./FeedbackForm";

const FeedbackDialog = (props) => {
  const { open, handleClose, handleSubmit } = props;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Leave Feedback</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {
            "Feel free to report a bug or just leave a comment. Please select the feedback type accordingly."
          }
        </DialogContentText>
        <FeedbackForm handleSubmit={handleSubmit} handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
