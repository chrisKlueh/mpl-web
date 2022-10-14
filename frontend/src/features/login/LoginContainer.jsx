import React from "react";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";

import styles from "./LoginContainer.module.css";
import LoginForm from "./LoginForm";
import Navbar from "../general/Navbar";

const LoginContainer = (props) => {
  const { isLoggedIn } = props;
  return (
    <div className={styles.root}>
      <Navbar isLoggedIn={isLoggedIn} />
      {isLoggedIn && <Navigate to={"/demos"} />}
      <div className={styles.loginFormContainer}>
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
