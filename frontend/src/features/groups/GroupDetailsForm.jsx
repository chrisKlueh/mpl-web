import React from "react";
import { Grid, DialogActions, Button } from "@mui/material";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-mui";

import { validateGroupNameAndPassword } from "../../helpers/loginValidationHelper";
import styles from "./GroupDetailsForm.module.css";

const GroupDetailsForm = (props) => {
  const {
    handleClose,
    handleNext,
    groupNameState,
    passwordState,
    confirmPasswordState,
    setGroupNameState,
    setPasswordState,
    setConfirmPasswordState,
    initValues,
  } = props;

  const handleNextStep = (values) => {
    setGroupNameState(values.group_name);
    setPasswordState(values.password);
    setConfirmPasswordState(values.confirm_password);
    handleNext();
  };

  return (
    <Formik
      validateOnMount
      initialValues={{
        group_name: initValues
          ? groupNameState
            ? groupNameState
            : initValues.group_name
          : "",
        password: initValues ? passwordState : "",
        confirm_password: initValues ? confirmPasswordState : "",
      }}
      validate={(values) => validateGroupNameAndPassword(values, true, true)}
    >
      {({ values, isValid }) => (
        <Form>
          <Grid container className={styles.container}>
            <Grid item>
              <Field
                className={styles.field}
                component={TextField}
                name="group_name"
                type="text"
                label="Group name"
                placeholder="MyGroupName"
              />
            </Grid>
          </Grid>
          <Grid container className={styles.container}>
            <Grid item>
              <Field
                className={styles.field}
                component={TextField}
                name="password"
                type="password"
                label="Password"
              />
            </Grid>
          </Grid>
          <Grid container className={styles.container}>
            <Grid item>
              <Field
                className={styles.field}
                component={TextField}
                name="confirm_password"
                type="password"
                label="Confirm password"
              />
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={!isValid}
              onClick={() => handleNextStep(values)}
              color="primary"
            >
              Next
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};

export default GroupDetailsForm;
