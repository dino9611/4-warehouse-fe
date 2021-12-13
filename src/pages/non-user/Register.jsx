import React, { Component } from "react";
import TextField from "@mui/material/TextField";
import { API_URL } from "../../constants/api";
import "./styles/regis.css";
import axios from "axios";
import gambar from "./../../assets/register.png";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { LoginAction } from "../../redux/actions/AuthAction";
import SuccessSnack from "../../components/SuccessSnack";
import ErrorSnack from "../../components/ErrorSnackbar";

class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    successSnack: false,
    errorSnack: false,
    message: "",
    showpassword: "password",
    islogin: false,
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

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ errorSnack: false, successSnack: false });
  };

  onRegisClick = () => {
    const { username, email, password, confirm_password } = this.state;
    if (username && password && email && confirm_password) {
      if (confirm_password === password) {
        axios
          .post(`${API_URL}/auth/register`, { username, email, password })
          .then((res) => {
            this.setState({
              successSnack: true,
              message:
                "Registrasi Berhasil, Silahkan Cek Email Anda untuk Verifikasi",
            });
          })
          .catch((err) => {
            console.log(err);
            this.setState({
              errorSnack: true,
              message: err.response.data.message || "Server Error",
            });
          });
      } else {
        this.setState({
          errorSnack: true,
          message: "Password tidak Cocok ",
        });
      }
    } else {
      this.setState({ errorSnack: "true", message: "Tolong isi Semua Input" });
    }
  };

  render() {
    const { username, email, password, confirm_password, showpassword } =
      this.state;
    if (this.props.isLogin) {
      return <Redirect to="/" />;
    }
    return (
      <div className="login-main-wrap">
        <div className="container login-sub-wrap">
          <div className="d-flex justify-content-between login-left-image-wrap">
            <div className="">
              {/* <img src={gambar} width="100%" height="84%" /> */}
              <h1>register</h1>
            </div>
            <div>
              <div className="regis-text">
                <h1>register</h1>
              </div>
            </div>
          </div>
          <div className="login-right-form-wrap"></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLogin: state.auth.isLogin,
  };
};

export default connect(mapStateToProps, { LoginAction })(Register);
