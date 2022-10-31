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

  return (
    <Formik
      initialValues={{
        group_name: initValues ? initValues.group_name : "",
        password: "",
        confirm_password: "",
      }}
      validate={(values) => validateAll(values)}
      onSubmit={(values, { resetForm }) => {
        handleSubmit(values.title, values.short_desc, values.detail_desc);
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
                /* value={groupName}
                onChange={(event) => setGroupName(event.target.value)} */
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
                /* value={password}
                onChange={(event) => setPassword(event.target.value)} */
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
                /* value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)} */
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
        </Form>
      )}
    </Formik>
  );
};

export default GroupDetailsForm;
