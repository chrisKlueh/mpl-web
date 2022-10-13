import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { Paper, Typography, IconButton, Tooltip } from "@mui/material";
import { Refresh } from "@mui/icons-material";

import Navbar from "./Navbar";
import styles from "./WrapperContainer.module.css";

const WrapperContainer = (props) => {
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(null);
  const {
    isLoggedIn,
    isAdmin,
    userName,
    pageTitle,
    handleRefresh,
    isRefreshing,
    autoRefresh,
  } = props;

  useEffect(() => {
    //equals componentDidMount
    if (autoRefresh && handleRefresh) {
      let interval = setInterval(() => {
        if (isLoggedIn) {
          handleRefresh();
        } else {
          clearInterval(interval);
        }
      }, autoRefresh * 1000);
      setAutoRefreshInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //return statement equals componentWillUnmount
    return () => {
      if (autoRefresh && handleRefresh && autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefreshInterval]);
  console.log(window.autoRefreshInterval);
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
