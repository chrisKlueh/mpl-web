import React from "react";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";

import LoginForm from "./LoginForm";
import Navbar from "../general/Navbar";

const LoginContainer = (props) => {
  const { isLoggedIn } = props;
  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        // backgroundImage: `url(${background})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center, center",
      }}
    >
      <Navbar isLoggedIn={isLoggedIn} />
      {isLoggedIn && <Navigate to={"/demos"} />}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          zIndex: 1,
          display: "flex",
        }}
      >
        <LoginForm />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.login.isLoggedIn,
  };
};

export default connect(mapStateToProps, null)(LoginContainer);
