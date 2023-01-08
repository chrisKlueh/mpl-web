import React from "react";
import { connect } from "react-redux";

import { editGroupRequest } from "../../slices/groupSlice";
import GroupDialogBase from "./GroupDialogBase";

const GroupEditDialog = (props) => {
  const { isLoading, demos, open, group, id, handleClose, editGroupRequest } =
    props;

  return (
    <GroupDialogBase
      title={"Edit Group"}
      stepTitles={["Edit group details", "Edit demo access"]}
      isLoading={isLoading}
      open={open}
      handleClose={handleClose}
      availableDemos={demos}
      initValues={group}
      request={editGroupRequest}
      id={id}
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
