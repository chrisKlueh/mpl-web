import React from "react";
import LoginForm from "./LoginForm";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";

const LoginContainer = (props) => {
  const { isLoggedIn } = props;
  return (
    <div>
      {isLoggedIn && <Navigate to={"/demos"} />}
      <LoginForm />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.login.isLoggedIn,
  };
};

export default connect(mapStateToProps, null)(LoginContainer);
