import React from "react";
import { Paper, Grid, Typography } from "@mui/material";
import { Face, Fingerprint } from "@mui/icons-material";
import { connect } from "react-redux";
import { Formik, Form, Field } from "formik";
import { Button, LinearProgress } from "@mui/material";
import { TextField } from "formik-mui";

import { loginRequest } from "../../slices/loginSlice";
import { validateUsernameAndPasswords } from "./validationHelper";

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
      <Paper
        sx={{
          margin: "auto auto",
        }}
      >
        <Typography
          variant="h4"
          component="h4"
          gutterBottom
          sx={{ paddingTop: "10px" }}
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
              <Grid
                container
                sx={{
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 10px",
                }}
              >
                <Grid item sx={{ margin: "0 10px 0 0" }}>
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
              <Grid
                container
                sx={{
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 10px",
                }}
              >
                <Grid item sx={{ margin: "0 10px 0 0" }}>
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
              <Grid
                container
                sx={{
                  marginTop: "10px",
                  justifyContent: "center",
                }}
              >
                <Grid item>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ textTransform: "none", marginBottom: "10px" }}
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
