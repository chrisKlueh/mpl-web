import React, { useState } from "react";
import { connect } from "react-redux";

import { uploadDemoRequest } from "../../slices/demoSlice";
import { showGroupsRequest, resetGroupsState } from "../../slices/groupsSlice";
import DemoDialogBase from "./DemoDialogBase";

const DemoUploadDialog = (props) => {
  const [open, setOpen] = useState(false);

  const {
    isLoading,
    uploadDemoRequest,
    showGroupsRequest,
    resetGroupsState,
    groups,
  } = props;

  const handleOpenDialog = () => {
    showGroupsRequest();
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    resetGroupsState();
  };

  return (
    <DemoDialogBase
      hasFab
      title={"Upload Demo"}
      stepTitles={[
        "Provide demo files",
        "Enter demo details",
        "Manage demo access",
      ]}
      isLoading={isLoading}
      open={open}
      handleOpen={handleOpenDialog}
      handleClose={handleCloseDialog}
      request={uploadDemoRequest}
      availableGroups={groups}
    />
  );
};
const mapStateToProps = (state) => {
  return {
    isLoading: state.demos.isUploadingDemo || state.groups.isGettingGroups,
    groups: state.groups.groups,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    uploadDemoRequest: (file) => dispatch(uploadDemoRequest(file)),
    showGroupsRequest: () => dispatch(showGroupsRequest()),
    resetGroupsState: () => dispatch(resetGroupsState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DemoUploadDialog);
