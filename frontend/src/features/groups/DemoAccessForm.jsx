import React, { Fragment } from "react";
import { Grid, DialogActions, Button } from "@mui/material";
import { Formik, Form, Field } from "formik";
import { Switch, Select } from "formik-mui";

import styles from "./DemoAccessForm.module.css";
const DemoAccessForm = (props) => {
  const { handleSubmit, initValues, availableDemos, handleBack } = props;

  const getAccessibleDemosInitValues = (initValues) => {
    let accessibleDemos = [];
    initValues.accessible_demos.map((demo) => accessibleDemos.push(demo.id));
    return accessibleDemos;
  };

  return (
    <Formik
      initialValues={{
        has_admin_privileges: initValues ? initValues.is_admin : false,
        accessible_demos: initValues
          ? getAccessibleDemosInitValues(initValues)
          : "",
      }}
      onSubmit={(values, { resetForm }) => {
        handleSubmit(values.has_admin_privileges, values.accessible_demos);
        resetForm();
      }}
    >
      {({ submitForm, values }) => (
        <Form>
          <Grid container className={styles.container}>
            <Grid item>
              <label>
                <Field
                  className={styles.field}
                  component={Switch}
                  name="has_admin_privileges"
                  type="checkbox"
                />
                Admin privileges
              </label>
            </Grid>
          </Grid>
          {values.has_admin_privileges ? (
            <Fragment>
              <div>Admins can access every uploaded demo.</div>
              <div>Caution: Admins have full control over this app!</div>
            </Fragment>
          ) : (
            <Fragment>
              <div>Select the demos this group can access.</div>
              <div>Hold down the control key for multiselect.</div>
            </Fragment>
          )}
          {!values.has_admin_privileges && (
            <Grid container className={styles.container}>
              <Grid item>
                <Field
                  className={styles.field}
                  component={Select}
                  multiple
                  native
                  name="accessible_demos"
                >
                  {availableDemos.map((demo) => (
                    <option value={demo.id}>{demo.title}</option>
                  ))}
                </Field>
              </Grid>
            </Grid>
          )}
          <DialogActions>
            <Button onClick={handleBack} color="primary">
              Back
            </Button>
            <Button
              disabled={
                !values.has_admin_privileges &&
                values.accessible_demos.length === 0
              }
              onClick={submitForm}
              color="primary"
            >
              Create
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};

export default DemoAccessForm;
