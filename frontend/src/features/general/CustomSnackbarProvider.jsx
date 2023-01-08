import React, { Component } from "react";
import { SnackbarProvider } from "notistack";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

const notistackRef = React.createRef();
const onClickDismiss = (key) => () => {
  notistackRef.current.closeSnackbar(key);
};

export default class CustomSnackbarProvider extends Component {
  render() {
    return (
      <SnackbarProvider
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        autoHideDuration={2500}
        ref={notistackRef}
        action={(key) => (
          <IconButton onClick={onClickDismiss(key)}>
            <Close />
          </IconButton>
        )}
      >
        {this.props.children}
      </SnackbarProvider>
    );
  }
}
