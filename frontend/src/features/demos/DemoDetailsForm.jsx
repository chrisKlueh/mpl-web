import React from "react";
import { Grid, DialogActions, Button } from "@mui/material";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-mui";

import { validateAll } from "../../helpers/demoDetailsValidationHelper";
import styles from "./DemoDetailsForm.module.css";

const DemoDetailsForm = (props) => {
  const {
    initValues,
    demoTitleState,
    shortDescState,
    detailDescState,
    setDemoTitleState,
    setShortDescState,
    setDetailDescState,
    handleNext,
    handleBack,
  } = props;

  const saveValuesToLocalState = (values) => {
    setDemoTitleState(values.title);
    setShortDescState(values.short_desc);
    setDetailDescState(values.detail_desc);
  };

  const handleNextStep = (values) => {
    saveValuesToLocalState(values);
    handleNext();
  };

  const handlePreviousStep = (values) => {
    saveValuesToLocalState(values);
    handleBack();
  };

  return (
    <Formik
      validateOnMount
      initialValues={{
        title: demoTitleState
          ? demoTitleState
          : initValues
          ? initValues.title
          : demoTitleState,
        short_desc: shortDescState
          ? shortDescState
          : initValues
          ? initValues.short_desc
          : shortDescState,
        detail_desc: detailDescState
          ? detailDescState
          : initValues
          ? initValues.detail_desc
          : detailDescState,
      }}
      validate={(values) => validateAll(values)}
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
            <Button onClick={() => handlePreviousStep(values)} color="primary">
              Back
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

export default DemoDetailsForm;
