import React from "react";
import { Grid, DialogActions, Button } from "@mui/material";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-mui";

import { validateGroupNameAndPassword } from "../../helpers/loginValidationHelper";
import styles from "./GroupDetailsForm.module.css";

const GroupDetailsForm = (props) => {
  const { handleClose, handleNext, setGroupName, setPassword, initValues } =
    props;

  const handleNextStep = (values) => {
    setGroupName(values.group_name);
    setPassword(values.password);
    handleNext();
  };

  return (
    <Formik
      validateOnMount
      initialValues={{
        group_name: initValues ? initValues.group_name : "",
        password: "",
        confirm_password: "",
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
