import React from "react";
import { connect } from "react-redux";

import { editDemoRequest } from "../../slices/demoSlice";
import DemoDialogBase from "./DemoDialogBase";

const DemoEditDialog = (props) => {
  const { id, open, handleClose, isLoading, demo, groups, editDemoRequest } =
    props;

  return (
    <DemoDialogBase
      title={"Edit Demo"}
      stepTitles={[
        "Provide updated demo files",
        "Edit demo details",
        "Edit demo access",
      ]}
      hasFab={false}
      isLoading={isLoading}
      open={open}
      handleClose={handleClose}
      initValues={demo}
      id={id}
      availableGroups={groups}
      request={editDemoRequest}
    />
  );
};
const mapStateToProps = (state) => {
  return {
    isLoading:
      state.demo.isGettingDemo ||
      state.demo.isEditingDemo ||
      state.groups.isGettingGroups,
    demo: state.demo.demo,
    groups: state.groups.groups,
    userId: state.login.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    editDemoRequest: (payload) => dispatch(editDemoRequest(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DemoEditDialog);
