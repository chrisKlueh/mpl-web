import React from "react";
import { Paper, Grid, Typography } from "@mui/material";
import { Face, Fingerprint } from "@mui/icons-material";
import { connect } from "react-redux";
import { Formik, Form, Field } from "formik";
import { Button, LinearProgress } from "@mui/material";
import { TextField } from "formik-mui";

import { loginRequest } from "../../slices/loginSlice";
import { validateUsernameAndPasswords } from "./validationHelper";
import styles from "./LoginForm.module.css";

class LogInForm extends React.Component {
  handleLogin = (username, password) => {
    const { login } = this.props;
    if (username != null && password != null) {
      login(username, password);
    }
  };

  render() {
    const { isLoggingIn } = this.props;
    return (
      <Paper className={styles.paper}>
        <Typography
          variant="h4"
          component="h4"
          gutterBottom
          className={styles.title}
        >
          Login
        </Typography>
        <Formik
          initialValues={{
            username: "",
            password: "",
          }}
          validate={(values) =>
            validateUsernameAndPasswords(values, false, false)
          }
          onSubmit={(values, { setSubmitting, resetForm }) => {
            this.handleLogin(values.username, values.password);
            resetForm();
          }}
        >
          {({ submitForm }) => (
            <Form>
              <Grid container className={styles.grid}>
                <Grid item className={styles.icon}>
                  <Face />
                </Grid>
                <Grid item>
                  <Field
                    component={TextField}
                    name="username"
                    type="text"
                    label="Username"
                    placeholder="fdai1234"
                    disabled={isLoggingIn}
                  />
                </Grid>
              </Grid>
              <Grid container className={styles.grid}>
                <Grid item className={styles.icon}>
                  <Fingerprint />
                </Grid>
                <Grid item>
                  <Field
                    component={TextField}
                    type="password"
                    label="Password"
                    name="password"
                    disabled={isLoggingIn}
                  />
                </Grid>
              </Grid>
              <Grid container className={styles.login}>
                <Grid item>
                  <Button
                    variant="outlined"
                    color="primary"
                    className={styles.loginButton}
                    disabled={isLoggingIn}
                    onClick={submitForm}
                  >
                    Log In
                  </Button>
                </Grid>
              </Grid>
              {isLoggingIn && <LinearProgress />}
            </Form>
          )}
        </Formik>
      </Paper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggingIn: state.login.isLoggingIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (username, password) =>
      dispatch(loginRequest({ username, password })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LogInForm);
