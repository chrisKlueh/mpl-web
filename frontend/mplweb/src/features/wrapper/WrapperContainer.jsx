import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { Paper, Typography } from "@mui/material";

import Navbar from "./Navbar";

const WrapperContainer = (props) => {
  const { isLoggedIn, pageTitle } = props;

  return isLoggedIn ? (
    <Fragment>
      <Navbar />
      <Paper>
        <Typography variant={"h5"} component={"h5"} gutterBottom align="left">
          {pageTitle}
        </Typography>
        <div>{props.children}</div>
      </Paper>
    </Fragment>
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
