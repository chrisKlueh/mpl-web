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

import styles from "./GroupDialogBase.module.css";
import LoadingFragment from "../general/LoadingFragment";
import GroupDetailsForm from "./GroupDetailsForm";
import DemoAccessForm from "./DemoAccessForm";

const GroupDialogBase = (props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [groupName, setGroupName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    hasFab,
    isLoading,
    open,
    handleOpen,
    initValues,
    title,
    stepTitles,
    availableDemos,
    handleClose,
    request,
    id,
  } = props;

  const resetStepper = () => setActiveStep(0);

  const resetLocalState = () => {
    setGroupName("");
    setPassword("");
    setConfirmPassword("");
  };

  const closeDialog = () => {
    handleClose();
    resetStepper();
    resetLocalState();
  };

  const submitRequest = (hasAdminPrivileges, accessibleDemos) => {
    const { userGroup } = props;
    request({
      targetGroupId: id,
      groupId: userGroup,
      groupName: groupName,
      password: password,
      hasAdminPrivileges: hasAdminPrivileges,
      accessibleDemos: accessibleDemos,
    });
    closeDialog();
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
        onClose={closeDialog}
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
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              {activeStep === 0 ? (
                <GroupDetailsForm
                  handleClose={closeDialog}
                  handleNext={() => setActiveStep(1)}
                  groupNameState={groupName}
                  passwordState={password}
                  confirmPasswordState={confirmPassword}
                  setGroupNameState={setGroupName}
                  setPasswordState={setPassword}
                  setConfirmPasswordState={setConfirmPassword}
                  initValues={initValues}
                />
              ) : (
                <DemoAccessForm
                  handleBack={() => setActiveStep(0)}
                  handleSubmit={submitRequest}
                  availableDemos={availableDemos}
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

export default connect(mapStateToProps, null)(GroupDialogBase);
