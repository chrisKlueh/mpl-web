import React from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { Paper, Typography, IconButton, Tooltip } from "@mui/material";
import { Refresh } from "@mui/icons-material";

import Navbar from "./Navbar";
import styles from "./WrapperContainer.module.css";

const WrapperContainer = (props) => {
  const {
    isLoggedIn,
    isAdmin,
    userName,
    pageTitle,
    handleRefresh,
    isRefreshing,
  } = props;

  return isLoggedIn ? (
    <div className={styles.root}>
      <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} userName={userName} />
      <Paper className={styles.paper}>
        <div className={styles.titleContainer}>
          <Typography
            variant={"h5"}
            component={"h5"}
            gutterBottom
            align="left"
            className={styles.pageTitle}
          >
            {pageTitle}
          </Typography>
          {handleRefresh && (
            <Tooltip title="Refresh list">
              <span>
                <IconButton
                  aria-label="refresh"
                  className={styles.refreshButton}
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <Refresh />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </div>
        <div className={styles.children}>{props.children}</div>
      </Paper>
    </div>
  ) : (
    <Navigate to={{ pathname: "/login" }} />
  );
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.login.isLoggedIn,
    isAdmin: state.login.isAdmin,
    userName: state.login.userName,
  };
};

export default connect(mapStateToProps, null)(WrapperContainer);
