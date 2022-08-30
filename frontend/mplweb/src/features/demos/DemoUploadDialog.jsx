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
import styles from "./UploadDemoDialog.module.css";

const steps = ["Upload demo files", "Enter demo details"];

const DemoUploadDialog = (props) => {
  const [open, setOpen] = React.useState(false);
  const [demoFiles, setDemoFile] = React.useState([]);
  const [activeStep, setActiveStep] = React.useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const resetStepper = () => setActiveStep(0);

  const handleClose = () => {
    setOpen(false);
    setDemoFile([]);
    resetStepper();
  };

  const handleSubmit = (title, short_desc, detail_desc) => {
    const { uploadDemoRequest } = props;
    uploadDemoRequest({
      created_by: 1,
      title: title,
      short_desc: short_desc,
      detail_desc: detail_desc,
      file: demoFiles,
    });
    handleClose();
    resetStepper();
  };

  const step1Complete = () => demoFiles.length > 0;

  const handleForward = (index) => {
    if (step1Complete()) {
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
                  onClick={() => handleForward(index)}
                >
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === 0 ? (
            <UploadDropzone
              handleClose={handleClose}
              onChange={(files) => setDemoFile((prev) => [...prev, ...files])}
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
