import React from "react";
import { connect } from "react-redux";
import {
  Fab,
  Tooltip,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { uploadDemoRequest } from "../../slices/demosSlice";
import Dropzone from "./Dropzone";

const DemoUploadDialog = (props) => {
  const [open, setOpen] = React.useState(false);
  const [demoFile, setDemoFile] = React.useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const { uploadDemoRequest } = props;
    uploadDemoRequest({
      created_by: 1,
      title: "my cool demotitle",
      short_desc: "this is my short_desc",
      detail_desc: "this is my detail_desc",
      file: demoFile,
    });
    handleClose();
  };

  const { isUploadingDemo } = props;
  return (
    <div>
      <Tooltip title="Upload a demo">
        <Fab
          size="medium"
          color="primary"
          aria-label="add"
          onClick={handleClickOpen}
          style={{ float: "right", margin: "0 10px 5px 0" }}
          disabled={isUploadingDemo}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Upload demo</DialogTitle>
        <DialogContent>
          <Dropzone onChange={(files) => setDemoFile(files)} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            disabled={isUploadingDemo}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            disabled={isUploadingDemo}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    isUploadingDemo: state.demos.isUploadingDemo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    uploadDemoRequest: (file) => dispatch(uploadDemoRequest(file)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DemoUploadDialog);
