import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { Paper, Typography } from "@mui/material";

import Navbar from "./Navbar";
import styles from "./WrapperContainer.module.css";

const WrapperContainer = (props) => {
  const { isLoggedIn, pageTitle } = props;

  return isLoggedIn ? (
    <div className={styles.root}>
      <Navbar isLoggedIn={isLoggedIn} />
      <Paper className={styles.paper}>
        <Typography
          variant={"h5"}
          component={"h5"}
          gutterBottom
          align="left"
          className={styles.pageTitle}
        >
          {pageTitle}
        </Typography>
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
  };
};

export default connect(mapStateToProps, null)(WrapperContainer);
