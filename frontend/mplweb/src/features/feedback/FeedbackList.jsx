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
import FeedbackDetails from "./FeedbackDetails";
// import { deleteFeedbackRequest } from "../../slices/demosSlice";
import { formatIsoDate } from "../../helpers/formatHelper";
import styles from "./FeedbackList.module.css";

const FeedbackList = (props) => {
  const [selectedListItem, setSelectedListItem] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isFeedbackDetailsOpen, setFeedbackDetailsOpen] = useState(false);

  const {
    isLoadingFeedback,
    listItems,
    // deleteFeedbackRequest
  } = props;
  console.log(listItems);
  const updateSelectedAndOpenDialog = (listItem, type) => {
    setSelectedListItem(listItem);
    switch (type) {
      case "DELETE":
        setDeleteDialogOpen(true);
        break;
      case "FEEDBACK_DETAILS":
        setFeedbackDetailsOpen(true);
        break;
      default:
        break;
    }
  };

  const handleDeleteFeedback = (id) => {
    // deleteFeedbackRequest(id);
    console.log(`deleting feedback ${id}`);
  };

  const truncateFeedbackDetails = (details) => {
    return details.length > 40 ? details.slice(0, 40) + "..." : details;
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
              onClick={() =>
                updateSelectedAndOpenDialog(listItem, "FEEDBACK_DETAILS")
              }
            >
              <ListItemAvatar>
                <Avatar>
                  {listItem.type === 1 ? <BugReport /> : <Chat />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={listItem.type === 1 ? "Bug Report" : "Comment"}
                className={styles.genericListItem}
              />
              <ListItemText
                primary={`Demo: ${listItem.demo}`}
                className={styles.genericListItem}
              />
              <ListItemText
                primary={truncateFeedbackDetails(listItem.details)}
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
                    onClick={() =>
                      updateSelectedAndOpenDialog(selectedListItem.id, "DELETE")
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
          <div>this is a placeholder cause nothing seems to be here</div>
        )}
      </List>
      <ConfirmationDialog
        title="Confirm feedback deletion"
        description="Do you really want to delete this feedback?"
        handleClose={() => setDeleteDialogOpen(false)}
        handleConfirm={() => handleDeleteFeedback(selectedListItem.id)}
        open={isDeleteDialogOpen}
      />
      <FeedbackDetails
        feedbackDetails={selectedListItem}
        handleClose={() => setFeedbackDetailsOpen(false)}
        open={isFeedbackDetailsOpen}
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
