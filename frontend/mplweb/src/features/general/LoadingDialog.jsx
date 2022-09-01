import React from "react";
import { Dialog, DialogContent } from "@mui/material";

import LoadingFragment from "./LoadingFragment";

const ConfirmationDialog = (props) => {
  const { open } = props;

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <LoadingFragment message={"Spawning Instance"} />
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
