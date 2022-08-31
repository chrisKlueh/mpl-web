import React, { useState } from "react";
import { connect } from "react-redux";

import { editDemoRequest } from "../../slices/demoSlice";
import DemoDialogBase from "./DemoDialogBase";

const DemoEditDialog = (props) => {
  const [demoFiles, setDemoFiles] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  const { id, open, handleClose, isLoading, demo } = props;
  const resetStepper = () => setActiveStep(0);

  const closeDialog = () => {
    handleClose();
    setDemoFiles([]);
    resetStepper();
  };

  const submitRequest = (title, short_desc, detail_desc) => {
    const { editDemoRequest } = props;
    editDemoRequest({
      //wegen mangelndem login-verfahren gibts aktuell keine userid zurück,
      //daher hier eine statische userid als temporäre lösung
      id: id,
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
      hasFab={false}
      isLoading={isLoading}
      open={open}
      handleClose={closeDialog}
      handleSubmit={submitRequest}
      activeStep={activeStep}
      handleOpenStep={(index) => setActiveStep(index)}
      files={demoFiles}
      setFiles={(files) => setDemoFiles(files)}
      initValues={demo}
    />
  );
};
const mapStateToProps = (state) => {
  return {
    isLoading: state.demo.isGettingDemo || state.demo.isUploadingDemo,
    demo: state.demo.demo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    editDemoRequest: (payload) => dispatch(editDemoRequest(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DemoEditDialog);
