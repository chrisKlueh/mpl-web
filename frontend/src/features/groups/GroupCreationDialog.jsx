import React, { useState } from "react";
import { connect } from "react-redux";

import { showDemosRequest } from "../../slices/demosSlice";
import { createGroupRequest } from "../../slices/groupsSlice";
import GroupDialogBase from "./GroupDialogBase";

const GroupCreationDialog = (props) => {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [groupName, setGroupName] = useState("");
  const [password, setPassword] = useState("");

  const { isLoading, showDemosRequest, demos } = props;

  const resetStepper = () => setActiveStep(0);

  const closeDialog = () => {
    setOpen(false);
    resetStepper();
  };

  const handleOpenDialog = () => {
    showDemosRequest();
    setOpen(true);
  };

  const submitRequest = (hasAdminPrivileges, accessibleDemos) => {
    const { createGroupRequest, userGroup } = props;
    const reqParams = {
      groupId: userGroup,
      groupName: groupName,
      password: password,
      hasAdminPrivileges: hasAdminPrivileges,
      accessibleDemos: accessibleDemos,
    };
    createGroupRequest(reqParams);
    closeDialog();
  };

  return (
    <GroupDialogBase
      title={"Create Group"}
      stepTitles={["Provide group details", "Manage demo access"]}
      hasFab
      isLoading={isLoading}
      open={open}
      handleOpen={handleOpenDialog}
      handleClose={closeDialog}
      handleSubmit={submitRequest}
      activeStep={activeStep}
      handleOpenStep={(index) => setActiveStep(index)}
      setGroupName={setGroupName}
      setPassword={setPassword}
      availableDemos={demos}
    />
  );
};
const mapStateToProps = (state) => {
  return {
    isLoading: state.groups.isCreatingGroup || state.demos.isGettingDemos,
    userGroup: state.login.userId,
    demos: state.demos.demos,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createGroupRequest: (payload) => dispatch(createGroupRequest(payload)),
    showDemosRequest: () => dispatch(showDemosRequest()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupCreationDialog);
