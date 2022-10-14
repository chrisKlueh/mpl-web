import React from "react";
import { Tooltip, Fab } from "@mui/material";
import {
  PowerSettingsNew,
  RestartAlt,
  SaveAs,
  Feedback,
  SmartToy,
} from "@mui/icons-material";

import styles from "./PlotControlBar.module.css";

const PlotControlBar = (props) => {
  const {
    disabled,
    handleTerminate,
    handleSave,
    handleComment,
    handleRestart,
    handleOpenDebugMenu,
    isAdmin,
  } = props;

  return (
    <div className={styles.root}>
      {handleTerminate && (
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
      )}
      {handleRestart && (
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
      )}
      {handleSave && (
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
      )}
      {handleComment && (
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
      )}
      {isAdmin && handleOpenDebugMenu && (
        <Tooltip title="Send Automated Event">
          <span>
            <Fab
              size="medium"
              color="primary"
              aria-label="add"
              onClick={handleOpenDebugMenu}
              disabled={disabled}
              className={styles.fab}
            >
              <SmartToy />
            </Fab>
          </span>
        </Tooltip>
      )}
    </div>
  );
};

export default PlotControlBar;
