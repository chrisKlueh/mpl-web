import React, { Fragment } from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import FeedbackForm from "./FeedbackForm";
import styles from "./FeedbackDialog.module.css";

const FeedbackDialog = (props) => {
  const {
    open,
    handleClose,
    handleSubmit,
    bugReport,
    cancelString,
    submitString,
  } = props;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {bugReport ? "Report Bug" : "Leave Feedback"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          className={styles.dialogContentText}
        >
          {bugReport ? (
            <Fragment>
              Feel free to report this bug. Note: a stack trace of the error
              will be added automatically.
              <br />
              Your feedback is anonymous and will only be linked to the demo
              this instance is based on.
            </Fragment>
          ) : (
            <Fragment>
              Feel free to report a bug or just leave a comment. Please select
              the feedback type accordingly. <br />
              Your feedback is anonymous and will only be linked to the demo
              this instance is based on.
            </Fragment>
          )}
        </DialogContentText>
        <FeedbackForm
          handleSubmit={handleSubmit}
          handleClose={handleClose}
          bugReport={bugReport}
          cancelString={cancelString}
          submitString={submitString}
        />
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
