import React, { Component } from "react";
import TextField from "@mui/material/TextField";
import { API_URL } from "../../constants/api";
import "./styles/Login.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { LoginAction } from "../../redux/actions/AuthAction";
import { connect } from "react-redux";
import gambar from "./../../assets/kopi.jpg";
import SnackbarMui from "../../components/Snackbar";

class Login extends React.Component {
  state = {
    showpassword: "password",
    username: "",
    password: "",
    isLogin: false,
    openSnack: false,
    message: "",
  };

  onCheckShow = (e) => {
    if (e.target.checked) {
      this.setState({ showpassword: "text" });
    } else {
      this.setState({ showpassword: "password" });
    }
  };

  onInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onLoginCLick = () => {
    const { username, password } = this.state;
    axios
      .post(`${API_URL}/auth/login`, { username: username, password })
      .then((res) => {
        this.setState({ openSnack: true, message: "Login Success" });
        localStorage.setItem("token", res.headers["x-token-access"]);
        this.props.LoginAction(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          openSnack: true,
          message: err.response.data.message || "Server Error",
        });
      });
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ openSnack: false });
  };

  // action = (
  //   <React.Fragment>
  //     {/* <Button color="secondary" size="small" onClick={this.handleClose}>
  //       UNDO
  //     </Button> */}
  //     <IconButton
  //       size="small"
  //       aria-label="close"
  //       color="inherit"
  //       onClick={this.handleClose}
  //     >
  //       <CloseIcon fontSize="small" />
  //     </IconButton>
  //   </React.Fragment>
  // );
  render() {
    const { showpassword, username, password } = this.state;
    return (
      <div className=".page-auth d-flex flex-row">
        <div className="login-page d-flex flex-row">
          <div>
            <img src={gambar} height="50%" width="170%" />
          </div>
          <div className="login-form">
            <div className="login-text">
              <h2>Login</h2>
            </div>
            <div className=" input-login d-flex flex-column">
              {/* <h5 className="email">Email</h5> */}
              <div className="input">
                <TextField
                  fullWidth
                  value={username}
                  id="outlined-basic"
                  label="Username/Email"
                  onChange={this.onInputChange}
                  name="username"
                  type="text"
                  variant="outlined"
                  // className="input"
                  color="warning"
                />
              </div>
              <div className="input">
                <TextField
                  fullWidth
                  value={password}
                  id="outlined-password-input"
                  label="Password"
                  name="password"
                  onChange={this.onInputChange}
                  type={showpassword}
                  autoComplete="current-password"
                  className="input-field"
                  color="warning"
                />
              </div>
              <div className="mt-2 checkbox d-flex">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  onChange={this.onCheckShow}
                />
                <h6 className="showpassword">Show Password</h6>
              </div>
              <div>
                <button
                  className="login-button rounded "
                  onClick={this.onLoginCLick}
                >
                  Login
                </button>
              </div>

              <div className="d-flex signup">
                <h6 className="pt-1">No Account?</h6>
                <Link className="link" to="/register">
                  SignUp
                </Link>
              </div>
            </div>
          </div>
        </div>
        <SnackbarMui
          message={this.state.message}
          openSnack={this.state.openSnack}
          handleClose={this.handleClose}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLogin: state.auth.isLogin,
  };
};

export default connect(mapStateToProps, { LoginAction })(Login);
