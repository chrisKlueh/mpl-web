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
    interval,
    handleSetInterval,
    isAutomatedEventEnabled,
    handleClearAutomatedEvent,
  } = props;

  const handleSwitchChange = (event) => {
    if (!event.target.checked) {
      handleClearAutomatedEvent();
    }
    handleEnableAutomatedEvent(event.target.checked);
  };

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
                    checked={isAutomatedEventEnabled}
                    onChange={handleSwitchChange}
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
              disabled={!isAutomatedEventEnabled}
              InputProps={{
                inputProps: {
                  min: "0.5",
                  max: "60.0",
                  step: "0.5",
                  value: interval,
                },
              }}
              onChange={(event) =>
                handleSetInterval(parseFloat(event.target.value))
              }
            />
          </div>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default DebugMenu;
