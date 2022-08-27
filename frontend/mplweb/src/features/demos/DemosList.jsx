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

import ListRowSkeleton from "../wrapper/ListRowSkeleton";
import ConfirmationDialog from "../wrapper/ConfirmationDialog";
import { deleteDemoRequest } from "../../slices/demosSlice";
import { formatIsoDate } from "../../helpers/formatHelper";

const DemosList = (props) => {
  //selectedId wird später für eine ConfirmDialog-Component gebraucht!!
  const [selectedId, setSelectedId] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const navigate = useNavigate();
  const { isGettingDemos, listItems, deleteDemoRequest } = props;

  const updateSelectedAndOpenDialog = (id) => {
    setSelectedId(id);
    setDeleteDialogOpen(true);
  };

  const handleSpawnInstance = (id) => {
    setSelectedId(id);
    //todo:
    //spawn instance request (liefert zu öffnende instance id zurück)
    navigate(`/instance/${1}`);
  };

  const handleDeleteDemo = (id) => {
    // setSelectedId(id);
    deleteDemoRequest(id);
  };

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
                primary={formatIsoDate(listItem.created_at, true)}
                secondary={"By " + listItem.created_by}
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
                <Tooltip title="Edit demo">
                  <IconButton edge="end" aria-label="edit">
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete demo">
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
      <ConfirmationDialog
        title="Confirm demo deletion"
        description="Do you really want to delete this demo?"
        handleClose={() => setDeleteDialogOpen(false)}
        handleConfirm={() => handleDeleteDemo(selectedId)}
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
    deleteDemoRequest: (id) => dispatch(deleteDemoRequest(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DemosList);
