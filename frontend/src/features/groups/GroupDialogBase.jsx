import React, { Fragment, useState } from "react";
import {
  Fab,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import styles from "./GroupDialogBase.module.css";
import LoadingFragment from "../general/LoadingFragment";
import GroupDetailsForm from "./GroupDetailsForm";
import DemoAccessForm from "./DemoAccessForm";

const GroupDialogBase = (props) => {
  const {
    hasFab,
    isLoading,
    open,
    handleOpen,
    activeStep,
    handleSubmit,
    initValues,
    title,
    stepTitles,
    setGroupName,
    setPassword,
    setConfirmPassword,
    availableDemos,
  } = props;

  const handleOpenStep = (index) => {
    const { handleOpenStep } = props;
    handleOpenStep(index);
  };

  const handleClose = () => {
    const { handleClose } = props;
    handleClose();
  };

  return (
    <div>
      {hasFab && (
        <Tooltip title="Create a new group">
          <Fab
            size="medium"
            color="primary"
            aria-label="add"
            onClick={handleOpen}
            disabled={isLoading}
            className={styles.fab}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          {isLoading ? (
            <LoadingFragment message={"Loading group details.."} />
          ) : (
            <Fragment>
              <Stepper activeStep={activeStep} className={styles.stepper}>
                {stepTitles.map((label, index) => {
                  const stepProps = {};
                  const labelProps = {};
                  return (
                    <Step
                      key={label}
                      {...stepProps}
                      onClick={() => handleOpenStep(index)}
                    >
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              {activeStep === 0 ? (
                <GroupDetailsForm
                  handleClose={handleClose}
                  handleNext={() => handleOpenStep(1)}
                  setGroupName={setGroupName}
                  setPassword={setPassword}
                  setConfirmPassword={setConfirmPassword}
                />
              ) : (
                <DemoAccessForm
                  handleSubmit={handleSubmit}
                  handleClose={handleClose}
                  availableDemos={availableDemos}
                />
              )}
            </Fragment>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupDialogBase;
