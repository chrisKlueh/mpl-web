import React from "react";
import { Tooltip, Fab } from "@mui/material";
import { PowerSettingsNew, SaveAs, Feedback } from "@mui/icons-material";

import styles from "./PlotControlBar.module.css";

const PlotControlBar = (props) => {
  const { isLoading, handleTerminate, handleSave, handleComment } = props;

  return (
    <div className={styles.root}>
      <Tooltip title="Terminate instance">
        <Fab
          size="medium"
          color="primary"
          aria-label="add"
          onClick={handleTerminate}
          disabled={isLoading}
          className={styles.fab}
        >
          <PowerSettingsNew />
        </Fab>
      </Tooltip>
      <Tooltip title="Save current plot">
        <Fab
          size="medium"
          color="primary"
          aria-label="add"
          onClick={handleSave}
          disabled={isLoading}
          className={styles.fab}
        >
          <SaveAs />
        </Fab>
      </Tooltip>
      <Tooltip title="Report issue/ Leave comment">
        <Fab
          size="medium"
          color="primary"
          aria-label="add"
          onClick={handleComment}
          disabled={isLoading}
          className={styles.fab}
        >
          <Feedback />
        </Fab>
      </Tooltip>
    </div>
  );
};

export default PlotControlBar;
