import React, { Fragment } from "react";
import { Grid, DialogActions, Button, Typography } from "@mui/material";
import { Formik, Form, Field } from "formik";
import { Select } from "formik-mui";

import styles from "./GroupAccessForm.module.css";
const GroupAccessForm = (props) => {
  const { handleSubmit, initValues, availableGroups, handleBack } = props;

  const getUserGroupsInitValues = (initValues) => {
    let userGroups = [];
    initValues.user_groups.map((group) => userGroups.push(group.id));
    return userGroups;
  };

  return (
    <Formik
      initialValues={{
        user_groups: initValues ? getUserGroupsInitValues(initValues) : "",
      }}
      onSubmit={(values, { resetForm }) => {
        handleSubmit(values.user_groups);
        resetForm();
      }}
    >
      {({ submitForm, values }) => (
        <Form>
          <Fragment>
            <Typography variant="body1">
              Select the groups that can access this demo.
            </Typography>
            <Typography variant="body1">
              Hold down the control key for multiselect.
            </Typography>
          </Fragment>
          <Grid container className={styles.multiselectContainer}>
            <Grid item>
              <Field
                className={styles.multiselect}
                component={Select}
                multiple
                native
                name="user_groups"
              >
                {availableGroups.map((group) => (
                  <option value={group.id}>{group.group_name}</option>
                ))}
              </Field>
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={handleBack} color="primary">
              Back
            </Button>
            <Button
              disabled={values.user_groups.length === 0}
              onClick={submitForm}
              color="primary"
            >
              {initValues ? "Update" : "Upload"}
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};

export default GroupAccessForm;
