import React, { Component } from "react";
import TextField from "@mui/material/TextField";
import { API_URL } from "../../constants/api";
import "./styles/Register.css";
import axios from "axios";
import gambar from "./../../assets/register.jpg";
import { Link } from "react-router-dom";
import SnackbarMui from "../../components/Snackbar";

class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    openSnack: false,
    message: "",
  };
  onInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ openSnack: false });
  };

  onRegisClick = () => {
    const { username, email, password, confirm_password } = this.state;
    if (username && password && email) {
      if (confirm_password === password) {
        axios
          .post(`${API_URL}/auth/register`, { username, email, password })
          .then((res) => {
            alert("berhasil");
            this.setState({ openSnack: "true", message: "Login Success" });
          })
          .catch((err) => {
            console.log(err);
            this.setState({
              openSnack: true,
              message: err.response.data.message || "Server Error",
            });
          });
      } else {
        this.setState({
          openSnack: "true",
          message: "Password doesn't Match ",
        });
      }
    } else {
      this.setState({ openSnack: "true", message: "Please Fill in All Input" });
    }
  };

  render() {
    const { username, email, password, confirm_password } = this.state;
    return (
      <div className="d-flex">
        <div className="login-page d-flex">
          <div className="gambar">
            <img src={gambar} height="70%" width="150%" />
          </div>
          <div className="regis-form">
            <div className="regis-text">
              <h2>Register</h2>
            </div>
            <div className=" input-login d-flex flex-column">
              <div className="input">
                <TextField
                  fullWidth
                  value={username}
                  id="outlined-basic"
                  label="Username"
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
                  value={email}
                  id="outlined-basic"
                  label="Email"
                  onChange={this.onInputChange}
                  name="email"
                  type="email"
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
                  type="password"
                  autoComplete="current-password"
                  className="input-field"
                  color="warning"
                />
              </div>
              <div className="input">
                <TextField
                  fullWidth
                  value={confirm_password}
                  id="outlined-password-input"
                  label=" Confirm Password"
                  name="confirm_password"
                  onChange={this.onInputChange}
                  type="password"
                  autoComplete="current-password"
                  className="input-field"
                  color="warning"
                />
              </div>
              <div>
                <button
                  className="regis-button rounded "
                  onClick={this.onRegisClick}
                >
                  Register
                </button>
              </div>

              <div className="d-flex login-here">
                <h6 className="pt-1">Already Have an Account?</h6>
                <Link className="link" to="/login">
                  Login Here!
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

export default Register;
