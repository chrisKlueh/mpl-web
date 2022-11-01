import React, { Fragment, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Avatar,
  ListItemAvatar,
  ListItemSecondaryAction,
  Tooltip,
} from "@mui/material";
import { Edit, Delete, Group, AdminPanelSettings } from "@mui/icons-material";
import { connect } from "react-redux";

import GroupEditDialog from "./GroupEditDialog";
import ListRowSkeleton from "../general/ListRowSkeleton";
import ConfirmationDialog from "../general/ConfirmationDialog";
/* import FeedbackDetails from "./FeedbackDetails"; */
import Placeholder from "../general/Placeholder";
import { formatIsoDate } from "../../helpers/formatHelper";
import { deleteGroupRequest } from "../../slices/groupSlice";
import { showDemosRequest } from "../../slices/demosSlice";
import { showGroupRequest } from "../../slices/groupSlice";
import { truncateString } from "../../helpers/listHelper";
import styles from "./GroupsList.module.css";
import { resetGroupState } from "../../slices/groupSlice";

const GroupsList = (props) => {
  const [selectedId, setSelectedId] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  const {
    isLoadingGroups,
    listItems,
    deleteGroupRequest,
    showDemosRequest,
    showGroupRequest,
    maxLength,
    resetGroupState,
  } = props;

  const updateSelectedAndOpenDialog = (id, type) => {
    setSelectedId(id);
    switch (type) {
      case "DELETE":
        setDeleteDialogOpen(true);
        break;
      case "EDIT":
        showDemosRequest();
        showGroupRequest(id);
        setEditDialogOpen(true);
        break;
      default:
        break;
    }
  };

  const handleDeleteGroup = (targetGroupId) => {
    const { groupId } = props;
    deleteGroupRequest({ group_id: groupId, target_group: targetGroupId });
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    resetGroupState();
  };

  const getDemoCount = (listItem) => {
    if (listItem.is_admin) {
      return "All demos";
    } else {
      return `${listItem.accessible_demos.length} demos`;
    }
  };

  const createListItems = (listItemArray) => {
    if (isLoadingGroups) {
      return <ListRowSkeleton rows={maxLength} className={styles.skeleton} />;
    } else {
      return listItemArray.map((listItem) => {
        return (
          <Fragment key={listItem.id}>
            <ListItem
              button
              onClick={() => updateSelectedAndOpenDialog(listItem.id, "EDIT")}
            >
              <ListItemAvatar>
                <Avatar>
                  {listItem.is_admin ? <AdminPanelSettings /> : <Group />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={listItem.is_admin ? "Admin" : "Student"}
                className={styles.genericListItem}
              />
              <ListItemText
                primary={truncateString(listItem.group_name, 25)}
                className={styles.groupName}
              />
              <ListItemText
                primary={getDemoCount(listItem)}
                className={styles.accessibleDemosCount}
              />
              <ListItemText
                primary={formatIsoDate(listItem.created_at, true)}
                className={styles.timestamp}
              />
              <ListItemSecondaryAction>
                <Tooltip title="Edit group">
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() =>
                      updateSelectedAndOpenDialog(listItem.id, "EDIT")
                    }
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete feedback">
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() =>
                      updateSelectedAndOpenDialog(listItem.id, "DELETE")
                    }
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </Fragment>
        );
      });
    }
  };

  return (
    <div className={styles.root}>
      <List dense={true} className={styles.list}>
        {listItems.length > 0 ? (
          <div>
            <Divider />
            {createListItems(listItems)}
          </div>
        ) : (
          <Placeholder message={"Looks like there are no groups yet.."} />
        )}
      </List>
      <ConfirmationDialog
        title="Confirm group deletion"
        description="Do you really want to delete this group?"
        handleClose={() => setDeleteDialogOpen(false)}
        handleConfirm={() => handleDeleteGroup(selectedId)}
        open={isDeleteDialogOpen}
      />
      <GroupEditDialog
        id={selectedId}
        open={isEditDialogOpen}
        handleClose={handleCloseEditDialog}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    groupId: state.login.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteGroupRequest: (id) => dispatch(deleteGroupRequest(id)),
    showGroupRequest: (id) => dispatch(showGroupRequest(id)),
    showDemosRequest: () => dispatch(showDemosRequest()),
    resetGroupState: () => dispatch(resetGroupState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupsList);
