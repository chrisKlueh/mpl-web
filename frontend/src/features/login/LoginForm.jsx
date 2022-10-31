import React from "react";
import { Paper, Grid, Typography } from "@mui/material";
import { connect } from "react-redux";
import { Formik, Form, Field } from "formik";
import { Button, LinearProgress } from "@mui/material";
import { TextField } from "formik-mui";

import { loginRequest } from "../../slices/loginSlice";
import { validateGroupNameAndPassword } from "../../helpers/loginValidationHelper";
import styles from "./LoginForm.module.css";

class LogInForm extends React.Component {
  handleLogin = (groupName, password) => {
    const { login } = this.props;
    login({ groupName, password });
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
            group_name: "",
            password: "",
          }}
          validate={(values) =>
            validateGroupNameAndPassword(values, false, false)
          }
          onSubmit={(values, { setSubmitting, resetForm }) => {
            this.handleLogin(values.group_name, values.password);
            resetForm();
          }}
        >
          {({ submitForm, values }) => (
            <Form>
              <Grid container className={styles.container}>
                <Grid item>
                  <Field
                    component={TextField}
                    name="group_name"
                    type="text"
                    label="Group name"
                    placeholder="MyGroup"
                    disabled={isLoggingIn}
                  />
                </Grid>
              </Grid>
              <Grid container className={styles.container}>
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
                    disabled={
                      isLoggingIn || !values.group_name || !values.password
                    }
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
    login: (payload) => dispatch(loginRequest(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LogInForm);
