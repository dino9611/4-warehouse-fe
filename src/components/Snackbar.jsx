import React, { Component } from "react";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

class SnackbarMui extends React.Component {
  action = (
    <React.Fragment>
      {/* <Button color="secondary" size="small" onClick={this.handleClose}>
            UNDO
          </Button> */}
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={this.props.handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  render() {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={this.props.openSnack}
        autoHideDuration={2000}
        onClose={this.props.handleClose}
        message={this.props.message}
        action={this.action}
      />
    );
  }
}

export default SnackbarMui;
