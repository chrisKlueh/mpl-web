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
import { deleteDemoRequest } from "../../slices/demosSlice";
import { showDemoRequest } from "../../slices/demoSlice";
import { spawnInstanceRequest } from "../../slices/instanceSlice";
import { formatIsoDate } from "../../helpers/formatHelper";
import { truncateString } from "../../helpers/listHelper";

const DemosList = (props) => {
  //selectedId wird später für eine ConfirmDialog-Component gebraucht!!
  const [selectedId, setSelectedId] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  const navigate = useNavigate();
  const {
    isGettingDemos,
    listItems,
    showDemoRequest,
    deleteDemoRequest,
    isSpawningInstance,
    isAdmin,
  } = props;

  const updateSelectedAndOpenDialog = (id, dialog) => {
    setSelectedId(id);
    switch (dialog) {
      case "DELETE":
        setDeleteDialogOpen(true);
        break;
      case "EDIT":
        showDemoRequest(id);
        setEditDialogOpen(true);
        break;
      default:
        break;
    }
  };

  const handleSpawnInstance = (id) => {
    const { spawnInstanceRequest } = props;
    setSelectedId(id);
    spawnInstanceRequest({ id, navigate });
  };

  const handleDeleteDemo = (demoId) => {
    const { userId } = props;
    deleteDemoRequest({ user_id: userId, demo_id: demoId });
  };

  const createListItems = (listItemArray) => {
    if (isGettingDemos) {
      return <ListRowSkeleton rows={5} className={styles.skeleton} />;
    } else {
      return listItemArray.map((listItem) => {
        return (
          <Fragment key={listItem.id}>
            <ListItem
              button
              className={styles.listItem}
              onClick={() => handleSpawnInstance(listItem.id)}
            >
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
                secondary={"By " + listItem.name}
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
          <Placeholder />
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
        handleClose={() => setEditDialogOpen(false)}
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
    spawnInstanceRequest: (payload) => dispatch(spawnInstanceRequest(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DemosList);
