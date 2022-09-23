import React from "react";
import { Grid, DialogActions, Button, MenuItem } from "@mui/material";
import { Formik, Form, Field } from "formik";
import { TextField, Select } from "formik-mui";

import { validateAll } from "../../helpers/feedbackValidationHelper";
import styles from "./FeedbackForm.module.css";

const FeedbackForm = (props) => {
  const { handleSubmit, handleClose } = props;
  return (
    <Formik
      initialValues={{
        feedbackType: "",
        feedback: "",
      }}
      validate={(values) => validateAll(values)}
      onSubmit={(values, { resetForm }) => {
        handleSubmit(values.feedbackType, values.feedback);
        resetForm();
      }}
    >
      {({ submitForm, values }) => (
        <Form className={styles.root}>
          <Grid container className={styles.container}>
            <Grid item>
              <Field
                className={styles.field}
                component={Select}
                name="feedbackType"
                type="text"
                label="Feedback type"
              >
                <MenuItem value={1}>Bug Report</MenuItem>
                <MenuItem value={2}>Comment</MenuItem>
              </Field>
            </Grid>
          </Grid>
          <Grid container className={styles.container}>
            <Grid item>
              <Field
                className={styles.field}
                component={TextField}
                name="feedback"
                type="text"
                label="Feedback"
                placeholder="Enter your feedback here"
                multiline={true}
                minRows={4}
              />
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={!values.feedback || !values.feedbackType}
              onClick={() => {
                submitForm();
                handleClose();
              }}
              color="primary"
            >
              Submit
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};

export default FeedbackForm;