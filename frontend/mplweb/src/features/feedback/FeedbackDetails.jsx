import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
  Typography,
} from "@mui/material";
import { BugReport, Chat } from "@mui/icons-material";
import { formatIsoDate } from "../../helpers/formatHelper";
import styles from "./FeedbackDetails.module.css";

const FeedbackDetails = (props) => {
  const { feedbackDetails, open, handleClose } = props;
  return (
    feedbackDetails && (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className={styles.root}>
          <DialogTitle
            id="alert-dialog-title"
            className={styles.titleContainer}
          >
            <Avatar className={styles.avatar}>
              {feedbackDetails.type === 1 ? <BugReport /> : <Chat />}
            </Avatar>
            <div>
              <Typography>
                {feedbackDetails.type === 1 ? "Bug Report" : "Comment"}
              </Typography>
              <Typography sx={{ typography: "subtitle2" }}>
                {`${feedbackDetails.demo_title}, ${formatIsoDate(
                  feedbackDetails.created_at
                )}`}
              </Typography>
            </div>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {feedbackDetails.details}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    )
  );
};

export default FeedbackDetails;
