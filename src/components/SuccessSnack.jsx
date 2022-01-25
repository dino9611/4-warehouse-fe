import React, { Component } from "react";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { SnackbarContent } from "@mui/material";
class SuccessSnack extends React.Component {
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
          horizontal: "center",
        }}
        autoHideDuration={3000}
        open={this.props.successSnack}
        onClose={this.props.handleClose}
      >
        <SnackbarContent
          style={{
            backgroundColor: "#43936c",
          }}
          message={this.props.message}
          action={this.action}
        />
      </Snackbar>
    );
  }
}

export default SuccessSnack;
