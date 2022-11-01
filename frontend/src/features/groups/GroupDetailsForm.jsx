import React from "react";
import { Grid, DialogActions, Button } from "@mui/material";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-mui";

import { validateAll } from "../../helpers/groupDetailsValidationHelper";
import styles from "./GroupDetailsForm.module.css";

const GroupDetailsForm = (props) => {
  const {
    handleSubmit,
    handleClose,
    handleNext,
    setGroupName,
    setPassword,
    setConfirmPassword,
    initValues,
  } = props;

  const handleNextStep = (values) => {
    console.log(values);
    setGroupName(values.group_name);
    setPassword(values.password);
    setConfirmPassword(values.confirm_password);
    handleNext();
  };
  console.log(initValues);
  return (
    <Formik
      initialValues={{
        group_name: initValues ? initValues.group_name : "",
        password: "",
        confirm_password: "",
      }}
      validate={(values) => validateAll(values)}
      onSubmit={(values, { resetForm }) => {
        handleSubmit(
          values.group_name,
          values.password,
          values.confirm_password
        );
        resetForm();
      }}
    >
      {({ submitForm, values }) => (
        <Form>
          <Grid container className={styles.container}>
            <Grid item>
              <Field
                className={styles.field}
                component={TextField}
                name="group_name"
                type="text"
                label="Group name"
                placeholder="MyCoolGroup"
              />
            </Grid>
          </Grid>
          <Grid container className={styles.container}>
            <Grid item>
              <Field
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
              disabled={
                !values.group_name ||
                !values.password ||
                !values.confirm_password
              }
              onClick={() => handleNextStep(values)}
              color="primary"
            >
              Next
            </Button>
          </DialogActions>
          <div>{initValues.group_name}</div>
        </Form>
      )}
    </Formik>
  );
};

export default GroupDetailsForm;
