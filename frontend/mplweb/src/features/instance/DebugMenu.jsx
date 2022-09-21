import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Switch,
  FormGroup,
  FormControlLabel,
} from "@mui/material";

import styles from "./DebugMenu.module.css";

const DebugMenu = (props) => {
  const {
    open,
    handleClose,
    handleEnableAutomatedEvent,
    handleSetInterval,
    isAutomatedEventEnabled,
  } = props;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Send Automated Event</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This dialog allows you to send an event automatically to the instance.
          <br />
          Make sure to use this feature only for debugging!
          <div className={styles.enableEventContainer}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    onChange={(event) =>
                      handleEnableAutomatedEvent(event.target.checked)
                    }
                  />
                }
                label="Enable Automated Event"
                className={styles.switchContainer}
              />
            </FormGroup>
            <TextField
              id="interval"
              label="Interval"
              type="number"
              disabled={isAutomatedEventEnabled}
              InputProps={{
                inputProps: { min: "0.5", max: "60.0", step: "0.5" },
              }}
              onChange={(event) => handleSetInterval(event.target.value)}
            />
          </div>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default DebugMenu;
