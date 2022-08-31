import React, { useState } from "react";
import { connect } from "react-redux";

import { uploadDemoRequest } from "../../slices/demoSlice";
import DemoDialogBase from "./DemoDialogBase";

const DemoUploadDialog = (props) => {
  const [open, setOpen] = useState(false);
  const [demoFiles, setDemoFiles] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  const { isUploadingDemo } = props;

  const resetStepper = () => setActiveStep(0);

  const closeDialog = () => {
    setOpen(false);
    setDemoFiles([]);
    resetStepper();
  };

  const submitRequest = (title, short_desc, detail_desc) => {
    const { uploadDemoRequest } = props;
    uploadDemoRequest({
      //wegen mangelndem login-verfahren gibts aktuell keine userid zurück,
      //daher hier eine statische userid als temporäre lösung
      created_by: 12,
      title: title,
      short_desc: short_desc,
      detail_desc: detail_desc,
      file: demoFiles[0],
    });
    closeDialog();
  };

  return (
    <DemoDialogBase
      hasFab
      isLoading={isUploadingDemo}
      open={open}
      handleOpen={() => setOpen(true)}
      handleClose={closeDialog}
      handleSubmit={submitRequest}
      activeStep={activeStep}
      handleOpenStep={(index) => setActiveStep(index)}
      files={demoFiles}
      setFiles={(files) => setDemoFiles(files)}
    />
  );
};
const mapStateToProps = (state) => {
  return {
    isUploadingDemo: state.demos.isUploadingDemo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    uploadDemoRequest: (file) => dispatch(uploadDemoRequest(file)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DemoUploadDialog);
