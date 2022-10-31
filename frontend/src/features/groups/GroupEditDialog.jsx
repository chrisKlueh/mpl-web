import React, { useState } from "react";
import { connect } from "react-redux";

import { showDemosRequest } from "../../slices/demosSlice";
import { editGroupRequest } from "../../slices/groupsSlice";
import { showGroupRequest } from "../../slices/groupSlice";
import GroupDialogBase from "./GroupDialogBase";

const GroupEditDialog = (props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [groupName, setGroupName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { isLoading, demos, open, setOpen, group } = props;

  const resetStepper = () => setActiveStep(0);

  const closeDialog = () => {
    setOpen(false);
    resetStepper();
  };

  const submitRequest = (hasAdminPrivileges, accessibleDemos) => {
    const { createGroupRequest, userGroup } = props;
    const reqParams = {
      groupId: userGroup,
      groupName: groupName,
      password: password,
      //möglicherweise gar nicht nötig, auch ich im state
      confirmPassword: confirmPassword,
      hasAdminPrivileges: hasAdminPrivileges,
      accessibleDemos: accessibleDemos,
    };
    console.log(reqParams);
    createGroupRequest(reqParams);
    closeDialog();
  };

  return (
    <GroupDialogBase
      title={"Edit Group"}
      stepTitles={["Provide group details", "Manage demo access"]}
      isLoading={isLoading}
      open={open}
      handleClose={closeDialog}
      handleSubmit={submitRequest}
      activeStep={activeStep}
      handleOpenStep={(index) => setActiveStep(index)}
      setGroupName={setGroupName}
      setPassword={setPassword}
      setConfirmPassword={setConfirmPassword}
      availableDemos={demos}
      initValues={group}
    />
  );
};
const mapStateToProps = (state) => {
  return {
    isLoading: state.group.isEditingGroup || state.demos.isGettingDemos,
    userGroup: state.login.userId,
    demos: state.demos.demos,
    group: state.group.group,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    editGroupRequest: (payload) => dispatch(editGroupRequest(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupEditDialog);
