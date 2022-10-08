import React from "react";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";

import LoginForm from "./LoginForm";
import Navbar from "../general/Navbar";
import backgroundImage from "../../background.jpg";

const LoginContainer = (props) => {
  const { isLoggedIn } = props;
  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: "40% 5%",
      }}
    >
      <Navbar isLoggedIn={isLoggedIn} />
      {isLoggedIn && <Navigate to={"/demos"} />}
      <div
        style={{
          zIndex: 1,
          margin: "100px auto",
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
