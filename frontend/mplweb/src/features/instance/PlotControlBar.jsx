import React from "react";
import { Tooltip, Fab } from "@mui/material";
import {
  PowerSettingsNew,
  RestartAlt,
  SaveAs,
  Feedback,
} from "@mui/icons-material";

import styles from "./PlotControlBar.module.css";

const PlotControlBar = (props) => {
  const {
    disabled,
    handleTerminate,
    handleSave,
    handleComment,
    handleRestart,
  } = props;

  return (
    <div className={styles.root}>
      <Tooltip title="Terminate instance">
        <span>
          <Fab
            size="medium"
            color="primary"
            aria-label="add"
            onClick={handleTerminate}
            disabled={disabled}
            className={styles.fab}
          >
            <PowerSettingsNew />
          </Fab>
        </span>
      </Tooltip>
      <Tooltip title="Restart instance">
        <span>
          <Fab
            size="medium"
            color="primary"
            aria-label="add"
            onClick={handleRestart}
            disabled={disabled}
            className={styles.fab}
          >
            <RestartAlt />
          </Fab>
        </span>
      </Tooltip>
      <Tooltip title="Save current plot">
        <span>
          <Fab
            size="medium"
            color="primary"
            aria-label="add"
            onClick={handleSave}
            disabled={disabled}
            className={styles.fab}
          >
            <SaveAs />
          </Fab>
        </span>
      </Tooltip>
      <Tooltip title="Report issue/ Leave comment">
        <span>
          <Fab
            size="medium"
            color="primary"
            aria-label="add"
            onClick={handleComment}
            disabled={disabled}
            className={styles.fab}
          >
            <Feedback />
          </Fab>
        </span>
      </Tooltip>
    </div>
  );
};

export default PlotControlBar;
