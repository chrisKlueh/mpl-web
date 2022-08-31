import React from "react";
import { connect } from "react-redux";
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

import { uploadDemoRequest } from "../../slices/demoSlice";
import UploadDropzone from "./UploadDropzone";
import DemoDetailsForm from "./DemoDetailsForm";
import styles from "./DemoUploadDialog.module.css";

const steps = ["Upload demo files", "Enter demo details"];

const DemoUploadDialog = (props) => {
  const [open, setOpen] = React.useState(false);
  const [demoFiles, setDemoFiles] = React.useState([]);
  const [activeStep, setActiveStep] = React.useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const resetStepper = () => setActiveStep(0);

  const handleClose = () => {
    setOpen(false);
    setDemoFiles([]);
    resetStepper();
  };

  const handleSubmit = (title, short_desc, detail_desc) => {
    const { uploadDemoRequest } = props;
    uploadDemoRequest({
      //wegen mangelndem login-verfahren gibts aktuell keine userid zurück,
      //daher hier eine statische userid als temporäre lösung
      created_by: 12,
      title: title,
      short_desc: short_desc,
      detail_desc: detail_desc,
      file: demoFiles[0],
    });
    handleClose();
    resetStepper();
  };

  const checkFirstStepComplete = () => demoFiles.length > 0;

  const handleOpenStep = (index) => {
    if (checkFirstStepComplete()) {
      setActiveStep(index);
    }
  };

  const { isUploadingDemo } = props;
  return (
    <div>
      <Tooltip title="Upload a demo">
        <Fab
          size="medium"
          color="primary"
          aria-label="add"
          onClick={handleClickOpen}
          style={{ float: "right", margin: "0 10px 5px 0" }}
          disabled={isUploadingDemo}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Upload demo</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} className={styles.stepper}>
            {steps.map((label, index) => {
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
              files={demoFiles}
              setFiles={setDemoFiles}
            />
          ) : (
            <DemoDetailsForm
              handleClose={handleClose}
              handleSubmit={handleSubmit}
              demoFiles={demoFiles}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    isUploadingDemo: state.demos.isUploadingDemo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    uploadDemoRequest: (file) => dispatch(uploadDemoRequest(file)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DemoUploadDialog);
