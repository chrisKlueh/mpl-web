import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { BugReport, Chat, ExpandMore } from "@mui/icons-material";
import { formatIsoDate } from "../../helpers/formatHelper";
import styles from "./FeedbackDetails.module.css";

const FeedbackDetails = (props) => {
  const { feedbackDetails, open, handleClose } = props;
  const [isAccordionOpen, setAccordionOpen] = useState(false);

  const collapseAndClose = () => {
    setAccordionOpen(false);
    handleClose();
  };

  return (
    feedbackDetails && (
      <Dialog
        open={open}
        onClose={collapseAndClose}
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
            {feedbackDetails.stacktrace && (
              <Accordion
                expanded={isAccordionOpen}
                onChange={() => setAccordionOpen(!isAccordionOpen)}
                className={styles.accordion}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <DialogContentText>
                    {`${isAccordionOpen ? "Hide" : "Show"} traceback`}
                  </DialogContentText>
                </AccordionSummary>
                <AccordionDetails className={styles.accordionDetails}>
                  <DialogContentText>
                    {feedbackDetails.stacktrace}
                  </DialogContentText>
                </AccordionDetails>
              </Accordion>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={collapseAndClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    )
  );
};

export default FeedbackDetails;
