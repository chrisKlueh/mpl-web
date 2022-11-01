import React from "react";
import { Grid, DialogActions, Button } from "@mui/material";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-mui";

import { validateAll } from "../../helpers/demoDetailsValidationHelper";
import styles from "./DemoDetailsForm.module.css";

const DemoDetailsForm = (props) => {
  const { handleSubmit, handleClose, initValues } = props;
  return (
    <Formik
      validateOnMount
      initialValues={{
        title: initValues ? initValues.title : "",
        short_desc: initValues ? initValues.short_desc : "",
        detail_desc: initValues ? initValues.detail_desc : "",
      }}
      validate={(values) => validateAll(values)}
      onSubmit={(values, { resetForm }) => {
        handleSubmit(values.title, values.short_desc, values.detail_desc);
        resetForm();
      }}
    >
      {({ submitForm, values, isValid }) => (
        <Form>
          <Grid container className={styles.container}>
            <Grid item>
              <Field
                className={styles.field}
                component={TextField}
                name="title"
                type="text"
                label="Demo title"
                placeholder="My demo title"
              />
            </Grid>
          </Grid>
          <Grid container className={styles.container}>
            <Grid item>
              <Field
                className={styles.field}
                component={TextField}
                name="short_desc"
                type="text"
                label="Short description"
                placeholder="This is my short description"
              />
            </Grid>
          </Grid>
          <Grid container className={styles.container}>
            <Grid item>
              <Field
                className={styles.field}
                component={TextField}
                name="detail_desc"
                type="text"
                label="Detailed description"
                placeholder="This is my detailed description"
                multiline={true}
                minRows={6}
              />
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button disabled={!isValid} onClick={submitForm} color="primary">
              {initValues ? "Update" : "Upload"}
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};

export default DemoDetailsForm;
