import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Delete, Edit, Monitor, PlayArrow } from "@mui/icons-material";
import { connect } from "react-redux";

import styles from "./DemosList.module.css";
import DemoEditDialog from "./DemoEditDialog";
import LoadingDialog from "../general/LoadingDialog";
import ListRowSkeleton from "../general/ListRowSkeleton";
import ConfirmationDialog from "../general/ConfirmationDialog";
import Placeholder from "../general/Placeholder";
import {
  showDemoRequest,
  resetDemoState,
  deleteDemoRequest,
} from "../../slices/demoSlice";
import { showGroupsRequest, resetGroupsState } from "../../slices/groupsSlice";
import { spawnInstanceRequest } from "../../slices/instanceSlice";
import { formatIsoDate } from "../../helpers/formatHelper";
import { truncateString } from "../../helpers/listHelper";

const DemosList = (props) => {
  const [selectedId, setSelectedId] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  const navigate = useNavigate();
  const {
    isGettingDemos,
    listItems,
    maxLength,
    showDemoRequest,
    deleteDemoRequest,
    isSpawningInstance,
    isAdmin,
    resetDemoState,
    resetGroupsState,
    showGroupsRequest,
  } = props;

  const updateSelectedAndOpenDialog = (id, dialog) => {
    setSelectedId(id);
    switch (dialog) {
      case "DELETE":
        setDeleteDialogOpen(true);
        break;
      case "EDIT":
        showGroupsRequest();
        showDemoRequest(id);
        setEditDialogOpen(true);
        break;
      default:
        break;
    }
  };

  const handleSpawnInstance = (demoId) => {
    const { spawnInstanceRequest, userId } = props;
    setSelectedId(demoId);
    spawnInstanceRequest({ userId, demoId, navigate });
  };

  const handleDeleteDemo = (demoId) => {
    const { userId } = props;
    deleteDemoRequest({ user_id: userId, demo_id: demoId });
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    resetDemoState();
    resetGroupsState();
  };

  const createListItems = (listItemArray) => {
    if (isGettingDemos) {
      return (
        <ListRowSkeleton
          hasSecondaryText
          rows={maxLength}
          className={styles.skeleton}
        />
      );
    } else {
      return listItemArray.map((listItem) => {
        return (
          <Fragment key={listItem.id}>
            <ListItem button onClick={() => handleSpawnInstance(listItem.id)}>
              <ListItemAvatar>
                <Avatar>
                  <Monitor />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={listItem.title}
                secondary={truncateString(listItem.short_desc, 64)}
                className={styles.listItemTitle}
              />
              <ListItemText
                primary={formatIsoDate(listItem.created_at, true)}
                secondary={"By " + listItem.creator}
                className={styles.listItemDate}
              />
              <ListItemSecondaryAction>
                <Tooltip title="Spawn instance">
                  <IconButton
                    edge="end"
                    aria-label="spawn"
                    onClick={() => handleSpawnInstance(listItem.id)}
                  >
                    <PlayArrow />
                  </IconButton>
                </Tooltip>
                {isAdmin && (
                  <Tooltip title="Edit demo">
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
                )}
                {isAdmin && (
                  <Tooltip title="Delete demo">
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
                )}
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
          <Placeholder message={"Looks like there are no demos yet.."} />
        )}
      </List>
      <ConfirmationDialog
        title="Confirm demo deletion"
        description="Do you really want to delete this demo?"
        handleClose={() => setDeleteDialogOpen(false)}
        handleConfirm={() => handleDeleteDemo(selectedId)}
        open={isDeleteDialogOpen}
      />
      <DemoEditDialog
        id={selectedId}
        open={isEditDialogOpen}
        handleClose={handleCloseEditDialog}
      />
      <LoadingDialog open={isSpawningInstance} />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isSpawningInstance: state.instance.isSpawningInstance,
    userId: state.login.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteDemoRequest: (id) => dispatch(deleteDemoRequest(id)),
    showDemoRequest: (id) => dispatch(showDemoRequest(id)),
    showGroupsRequest: () => dispatch(showGroupsRequest()),
    spawnInstanceRequest: (payload) => dispatch(spawnInstanceRequest(payload)),
    resetDemoState: () => dispatch(resetDemoState()),
    resetGroupsState: () => dispatch(resetGroupsState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DemosList);
