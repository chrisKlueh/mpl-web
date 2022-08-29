import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { Paper, Typography } from "@mui/material";
import { styled } from "@mui/system";

import Navbar from "./Navbar";

const StyledPaper = styled(Paper)(() => ({
  width: "75%",
  height: "calc(100vh - 300px)",
  margin: "96px auto",
  paddingTop: "5px",
}));

const StyledTypography = styled(Typography)(() => ({
  margin: "0 0 0 10px",
}));

const StyledChildren = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  height: "calc(100vh - 382px)",
  justifyContent: "space-between",
}));

const WrapperContainer = (props) => {
  const { isLoggedIn, pageTitle } = props;

  return isLoggedIn ? (
    <Fragment>
      <Navbar isLoggedIn={isLoggedIn} />
      <StyledPaper>
        <StyledTypography
          variant={"h5"}
          component={"h5"}
          gutterBottom
          align="left"
        >
          {pageTitle}
        </StyledTypography>
        <StyledChildren>{props.children}</StyledChildren>
      </StyledPaper>
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
