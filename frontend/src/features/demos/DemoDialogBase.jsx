import React, { Fragment, useState } from "react";
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

import styles from "./DemoDialogBase.module.css";
import UploadDropzone from "./UploadDropzone";
import DemoDetailsForm from "./DemoDetailsForm";
import GroupAccessForm from "./GroupAccessForm";
import LoadingFragment from "../general/LoadingFragment";

const DemoDialogBase = (props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [demoFiles, setDemoFiles] = useState([]);
  const [demoTitle, setDemoTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [detailDesc, setDetailDesc] = useState("");
  const {
    hasFab,
    isLoading,
    open,
    handleOpen,
    availableGroups,
    initValues,
    title,
    stepTitles,
    request,
    id,
    handleClose,
  } = props;

  const resetStepper = () => setActiveStep(0);

  const resetLocalState = () => {
    setDemoFiles([]);
    setDemoTitle("");
    setShortDesc("");
    setDetailDesc("");
  };

  const closeDialog = () => {
    handleClose();
    resetStepper();
    resetLocalState();
  };

  const submitRequest = (user_groups) => {
    const { userGroup } = props;
    request({
      id: id,
      user_group: userGroup,
      title: demoTitle,
      short_desc: shortDesc,
      detail_desc: detailDesc,
      file: demoFiles[0],
      user_groups: user_groups,
    });
    closeDialog();
  };

  const checkFirstStepComplete = () => demoFiles.length > 0;

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
        onClose={closeDialog}
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
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              {activeStep === 0 && (
                <UploadDropzone
                  handleClose={closeDialog}
                  handleNext={() => setActiveStep(1)}
                  disableNext={!checkFirstStepComplete()}
                  files={demoFiles}
                  setFiles={(files) => setDemoFiles(files)}
                  allowMultipleFiles={false}
                />
              )}
              {activeStep === 1 && (
                <DemoDetailsForm
                  handleNext={() => setActiveStep(2)}
                  handleBack={() => setActiveStep(0)}
                  initValues={initValues}
                  demoTitleState={demoTitle}
                  shortDescState={shortDesc}
                  detailDescState={detailDesc}
                  setDemoTitleState={setDemoTitle}
                  setShortDescState={setShortDesc}
                  setDetailDescState={setDetailDesc}
                />
              )}
              {activeStep === 2 && (
                <GroupAccessForm
                  availableGroups={availableGroups}
                  handleSubmit={submitRequest}
                  handleBack={() => setActiveStep(1)}
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

const mapStateToProps = (state) => {
  return {
    userGroup: state.login.userId,
    /* demos: state.demos.demos, */
  };
};

export default connect(mapStateToProps, null)(DemoDialogBase);
