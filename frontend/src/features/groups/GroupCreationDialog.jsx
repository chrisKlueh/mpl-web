import React, { useState } from "react";
import { connect } from "react-redux";

import { showDemosRequest, resetDemosState } from "../../slices/demosSlice";
import { createGroupRequest } from "../../slices/groupSlice";
import GroupDialogBase from "./GroupDialogBase";

const GroupCreationDialog = (props) => {
  const [open, setOpen] = useState(false);

  const {
    isLoading,
    showDemosRequest,
    demos,
    createGroupRequest,
    resetDemosState,
  } = props;

  const handleOpenDialog = () => {
    showDemosRequest();
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    resetDemosState();
  };

  return (
    <GroupDialogBase
      hasFab
      title={"Create Group"}
      stepTitles={["Provide group details", "Manage demo access"]}
      isLoading={isLoading}
      open={open}
      handleOpen={handleOpenDialog}
      handleClose={handleCloseDialog}
      availableDemos={demos}
      request={createGroupRequest}
    />
  );
};
const mapStateToProps = (state) => {
  return {
    isLoading: state.groups.isCreatingGroup || state.demos.isGettingDemos,
    demos: state.demos.demos,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createGroupRequest: (payload) => dispatch(createGroupRequest(payload)),
    showDemosRequest: () => dispatch(showDemosRequest()),
    resetDemosState: () => dispatch(resetDemosState()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupCreationDialog);
