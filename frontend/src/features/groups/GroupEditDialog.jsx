import React, { useState } from "react";
import { connect } from "react-redux";

import { editGroupRequest } from "../../slices/groupSlice";
import GroupDialogBase from "./GroupDialogBase";

const GroupEditDialog = (props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [groupName, setGroupName] = useState("");
  const [password, setPassword] = useState("");

  const { isLoading, demos, open, group, id, handleClose } = props;

  const resetStepper = () => setActiveStep(0);

  const closeDialog = () => {
    handleClose();
    resetStepper();
  };

  const submitRequest = (hasAdminPrivileges, accessibleDemos) => {
    const { editGroupRequest, userGroup } = props;
    editGroupRequest({
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
    <GroupDialogBase
      title={"Edit Group"}
      stepTitles={["Edit group details", "Edit demo access"]}
      isLoading={isLoading}
      open={open}
      handleClose={closeDialog}
      handleSubmit={submitRequest}
      activeStep={activeStep}
      handleOpenStep={(index) => setActiveStep(index)}
      setGroupName={setGroupName}
      setPassword={setPassword}
      availableDemos={demos}
      initValues={group}
    />
  );
};
const mapStateToProps = (state) => {
  return {
    isLoading:
      state.group.isEditingGroup ||
      state.demos.isGettingDemos ||
      state.group.isGettingGroup,
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
