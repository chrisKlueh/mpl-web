import React, { Fragment } from "react";
import { Grid, DialogActions, Button } from "@mui/material";
import { Formik, Form, Field } from "formik";
import { Switch, Select } from "formik-mui";

import styles from "./DemoAccessForm.module.css";
const DemoAccessForm = (props) => {
  const {
    handleSubmit,
    handleClose,
    initValues,
    setAccessibleDemos,
    setHasAdminPrivileges,
    availableDemos,
  } = props;

  /* const handleChangeMultiple = (event) => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setAccessibleDemos(value);
  };

  const handleChangeAdminPrivileges = (event) => {
    console.log(event.target.checked);
    setHasAdminPrivileges(event.target.checked);
  }; */

  return (
    <Formik
      initialValues={{
        has_admin_privileges: initValues
          ? initValues.hasAdminPrivileges
          : false,
        accessible_demos: initValues ? initValues.accessibleDemos : "",
      }}
      onSubmit={(values, { resetForm }) => {
        console.log(values);
        setHasAdminPrivileges(values.has_admin_privileges);
        setAccessibleDemos(values.accessible_demos);
        handleSubmit();
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
                  /* checked={hasAdminPrivileges}
                  onChange={handleChangeAdminPrivileges} */
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
                  /* value={accessibleDemos}
                  onChange={handleChangeMultiple} */
                >
                  {availableDemos.map((demo) => (
                    <option value={demo.id}>{demo.title}</option>
                  ))}
                </Field>
              </Grid>
            </Grid>
          )}
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
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
