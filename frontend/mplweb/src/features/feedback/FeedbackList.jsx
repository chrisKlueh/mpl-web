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
import { Delete, BugReport, Chat } from "@mui/icons-material";
import { connect } from "react-redux";

import ListRowSkeleton from "../general/ListRowSkeleton";
import ConfirmationDialog from "../general/ConfirmationDialog";
// import { deleteFeedbackRequest } from "../../slices/demosSlice";
import { formatIsoDate } from "../../helpers/formatHelper";
import styles from "./FeedbackList.module.css";

const FeedbackList = (props) => {
  //selectedId wird später für eine ConfirmDialog-Component gebraucht!!
  const [selectedId, setSelectedId] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    isLoadingFeedback,
    listItems,
    // deleteFeedbackRequest
  } = props;

  const updateSelectedAndOpenDialog = (id) => {
    setSelectedId(id);
    setDeleteDialogOpen(true);
  };

  const handleShowFeedback = (id) => {
    setSelectedId(id);
    //todo: show feedback
    console.log("feedback details");
  };

  const handleDeleteFeedback = (id) => {
    // deleteFeedbackRequest(id);
    console.log(`deleting feedback ${id}`);
  };

  const createListItems = (listItemArray) => {
    if (isLoadingFeedback) {
      return <ListRowSkeleton rows={5} className={styles.skeleton} />;
    } else {
      return listItemArray.map((listItem) => {
        return (
          <Fragment>
            <ListItem
              button
              key={listItem.id}
              className={styles.listItem}
              onClick={() => handleShowFeedback(listItem.id)}
            >
              <ListItemAvatar>
                <Avatar>
                  {listItem.type === 1 ? <BugReport /> : <Chat />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={listItem.type === 1 ? "Bug" : "Comment"}
                className={styles.genericListItem}
              />
              <ListItemText
                primary={`Demo: ${listItem.demo}`}
                className={styles.genericListItem}
              />
              <ListItemText
                primary={listItem.details}
                className={styles.feedbackDetails}
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
                    onClick={() => updateSelectedAndOpenDialog(listItem.id)}
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
          <div>this is a placeholder cause nothing seems to be here</div>
        )}
      </List>
      <ConfirmationDialog
        title="Confirm feedback deletion"
        description="Do you really want to delete this feedback?"
        handleClose={() => setDeleteDialogOpen(false)}
        handleConfirm={() => handleDeleteFeedback(selectedId)}
        open={isDeleteDialogOpen}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    // deleteFeedbackRequest: (id) => dispatch(deleteFeedbackRequest(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackList);
