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
    frequency,
    handleSetFrequency,
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
        </DialogContentText>
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
            id="frequency"
            label="Frequency"
            type="number"
            disabled={!isAutomatedEventEnabled}
            InputProps={{
              inputProps: {
                min: "0.5",
                max: "60.0",
                step: "0.5",
                value: frequency,
              },
            }}
            onChange={(event) =>
              handleSetFrequency(parseFloat(event.target.value))
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DebugMenu;
