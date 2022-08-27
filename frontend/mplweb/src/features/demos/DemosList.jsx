import React, { Fragment } from "react";
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

import ListRowSkeleton from "./ListRowSkeleton";

const DemosList = (props) => {
  const { isGettingDemos, listItems } = props;

  const createListItems = (listItemArray) => {
    if (isGettingDemos) {
      return <ListRowSkeleton rows={5} />;
    } else {
      return listItemArray.map((listItem) => {
        return (
          <Fragment>
            <ListItem button key={listItem.id}>
              <ListItemAvatar>
                <Avatar>
                  <Monitor />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={listItem.title}
                secondary={listItem.short_desc}
              />
              <ListItemText
                primary={listItem.created_at}
                secondary={"By " + listItem.created_by}
              />
              <ListItemSecondaryAction>
                <Tooltip title="Spawn instance">
                  <IconButton edge="end" aria-label="spawn">
                    <PlayArrow />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit demo">
                  <IconButton edge="end" aria-label="edit">
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete demo">
                  <IconButton edge="end" aria-label="delete">
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
    <div>
      <List dense={true}>
        {listItems.length > 0 ? (
          <div>
            <Divider />
            {createListItems(listItems)}
          </div>
        ) : (
          <div>this is a placeholder cause nothing seems to be here</div>
        )}
      </List>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DemosList);
