import React, { Fragment } from "react";
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

import styles from "./DemoDialogBase.module.css";
import UploadDropzone from "./UploadDropzone";
import DemoDetailsForm from "./DemoDetailsForm";
import LoadingFragment from "../general/LoadingFragment";

const DemoDialogBase = (props) => {
  const {
    hasFab,
    isLoading,
    open,
    handleOpen,
    activeStep,
    handleSubmit,
    files,
    setFiles,
    initValues,
    title,
    stepTitles,
  } = props;

  const checkFirstStepComplete = () => files.length > 0;

  const handleOpenStep = (index) => {
    const { handleOpenStep } = props;
    if (checkFirstStepComplete()) {
      handleOpenStep(index);
    }
  };

  const handleClose = () => {
    const { handleClose } = props;
    handleClose();
  };

  return (
    <div>
      {hasFab && (
        <Tooltip title="Upload a new demo">
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
            <LoadingFragment message={"Loading demo details.."} />
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
                <UploadDropzone
                  handleClose={handleClose}
                  handleNext={() => handleOpenStep(1)}
                  disableNext={!checkFirstStepComplete()}
                  files={files}
                  setFiles={setFiles}
                  allowMultipleFiles={false}
                />
              ) : (
                <DemoDetailsForm
                  handleClose={handleClose}
                  handleSubmit={handleSubmit}
                  initValues={initValues}
                />
              )}
            </Fragment>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DemoDialogBase;
