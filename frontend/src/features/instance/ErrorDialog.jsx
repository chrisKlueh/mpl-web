import React, { Fragment } from "react";
import InfoDialogBase from "../general/InfoDialogBase";
import { DialogContentText } from "@mui/material";

import styles from "./ErrorDialog.module.css";
import {
  getErrorDialogTitle,
  getErrorDialogChildrenConfig,
  isBugreportAllowed,
} from "../../helpers/errorDialogHelper";

const ErrorDialog = (props) => {
  const { open, isAdmin, errorDetails, handleClose, handleConfirm } = props;

  const printTracebackAndClose = () => {
    if (
      isAdmin &&
      errorDetails &&
      errorDetails.generatedDetails &&
      errorDetails.errorType === "demo_error"
    ) {
      console.log(errorDetails.generatedDetails);
    }
    handleClose();
  };

  const generateChildren = (config) => (
    <Fragment>
      <DialogContentText id="alert-dialog-description">
        {`${config.description}${errorDetails !== null && isAdmin ? ":" : "."}`}
      </DialogContentText>
      {errorDetails.description && isAdmin && (
        <DialogContentText className={styles.errorDescription}>
          {errorDetails.description}
        </DialogContentText>
      )}
      {config.additionalDescription && (
        <DialogContentText>{config.additionalDescription}</DialogContentText>
      )}
      {config.additionalAdminDescription &&
        errorDetails.generatedDetails &&
        isAdmin && (
          <DialogContentText>
            {config.additionalAdminDescription}
          </DialogContentText>
        )}
      <DialogContentText>{config.consequence}</DialogContentText>
    </Fragment>
  );

  return (
    errorDetails !== null && (
      <InfoDialogBase
        title={getErrorDialogTitle(errorDetails.errorType)}
        handleClose={printTracebackAndClose}
        handleConfirm={() =>
          handleConfirm(isBugreportAllowed(errorDetails.errorType))
        }
        open={open}
        confirmString={
          errorDetails.errorType === "user_error" ? "Ok" : "Terminate now"
        }
        cancelAllowed={errorDetails.errorType === "demo_error"}
      >
        {generateChildren(getErrorDialogChildrenConfig(errorDetails.errorType))}
      </InfoDialogBase>
    )
  );
};

export default ErrorDialog;
