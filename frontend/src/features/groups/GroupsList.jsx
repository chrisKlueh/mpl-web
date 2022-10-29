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
import { Delete, Group, AdminPanelSettings } from "@mui/icons-material";
import { connect } from "react-redux";

import ListRowSkeleton from "../general/ListRowSkeleton";
import ConfirmationDialog from "../general/ConfirmationDialog";
/* import FeedbackDetails from "./FeedbackDetails"; */
import Placeholder from "../general/Placeholder";
import { formatIsoDate } from "../../helpers/formatHelper";
import { deleteGroupRequest } from "../../slices/groupsSlice";
import { truncateString } from "../../helpers/listHelper";
import styles from "./GroupsList.module.css";

const GroupsList = (props) => {
  const [selectedListItem, setSelectedListItem] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isFeedbackDetailsOpen, setFeedbackDetailsOpen] = useState(false);

  const { isLoadingGroups, listItems, deleteGroupRequest, maxLength } = props;

  const updateSelectedAndOpenDialog = (listItem, type) => {
    setSelectedListItem(listItem);
    switch (type) {
      case "DELETE":
        setDeleteDialogOpen(true);
        break;
      case "GROUP_DETAILS":
        setFeedbackDetailsOpen(true);
        break;
      default:
        break;
    }
  };

  const handleDeleteGroup = (targetGroupId) => {
    const { groupId } = props;
    console.log(targetGroupId, groupId);
    deleteGroupRequest({ group_id: groupId, target_group: targetGroupId });
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
              onClick={() =>
                updateSelectedAndOpenDialog(listItem, "GROUP_DETAILS")
              }
            >
              <ListItemAvatar>
                <Avatar>
                  {listItem.is_admin ? <AdminPanelSettings /> : <Group />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={listItem.is_admin ? "Admin" : "Student"}
                className={styles.demoTitle}
              />
              <ListItemText
                primary={listItem.group_name}
                className={styles.demoTitle}
              />
              <ListItemText
                primary={formatIsoDate(listItem.created_at, true)}
                className={styles.feedbackDate}
              />
              <ListItemSecondaryAction>
                <Tooltip title="Delete feedback">
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() =>
                      updateSelectedAndOpenDialog(listItem, "DELETE")
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
        handleConfirm={() => handleDeleteGroup(selectedListItem.id)}
        open={isDeleteDialogOpen}
      />
      {/* <FeedbackDetails
        feedbackDetails={selectedListItem}
        handleClose={() => setFeedbackDetailsOpen(false)}
        open={isFeedbackDetailsOpen}
      /> */}
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupsList);
