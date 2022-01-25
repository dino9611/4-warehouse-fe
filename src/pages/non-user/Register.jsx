import React, { Component } from "react";
import TextField from "@mui/material/TextField";
import { API_URL } from "../../constants/api";
import "./styles/regis.css";
import axios from "axios";
import gambar from "./../../assets/register.png";
import { Link } from "react-router-dom";
import SuccessSnack from "../../components/SuccessSnack";
import ErrorSnack from "../../components/ErrorSnackbar";
import { debounce } from "throttle-debounce";

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
              username: "",
              email: "",
              password: "",
              confirm_password: "",
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

    return (
      <div className="login-main-wrap">
        <div className="login-sub-wrap">
          <div className="login-left-image-wrap">
            <img src={gambar} width="100%" height="100%" />
          </div>
          <div className="login-right-form-wrap">
            <h2 className="regis-text">Daftar</h2>
            <div className="label-text">
              <h6>Username</h6>
              <input
                type="text"
                className="form-control shadow-none text-input"
                placeholder="username"
                name="username"
                onChange={this.onInputChange}
                value={username}
                maxLength="45"
              />
            </div>
            <div className="label-text">
              <h6>Alamat email</h6>
              <input
                type="email"
                className="form-control shadow-none text-input"
                placeholder="email@local.com"
                name="email"
                onChange={this.onInputChange}
                value={email}
              />
            </div>
            <div className="label-text">
              <h6>Kata sandi</h6>
              <input
                type={showpassword}
                className="form-control shadow-none text-input"
                placeholder="Kata sandi"
                name="password"
                onChange={this.onInputChange}
                value={password}
              />
            </div>
            <div className="label-text">
              <h6>Konfirmasi Kata sandi</h6>
              <input
                type={showpassword}
                className="form-control shadow-none text-input"
                placeholder="Kata sandi"
                name="confirm_password"
                onChange={this.onInputChange}
                value={confirm_password}
              />
            </div>
            <div className="checkbox-form row">
              <input
                type="checkbox"
                className="checkbox-input"
                onChange={this.onCheckShow}
              />
              <h6 className="showpassword">Show Password</h6>
            </div>
            <div className="d-flex">
              <button
                className="btn-regis"
                onClick={debounce(350, this.onRegisClick)}
              >
                Daftar
              </button>
              <h6 className="sudah-punya-akun-text">Sudah punya akun?</h6>
              <Link to="/login" className="link-masuk">
                Masuk
              </Link>
            </div>
          </div>
        </div>
        <SuccessSnack
          // autoHideDuration={3000}
          message={this.state.message}
          successSnack={this.state.successSnack}
          handleClose={this.handleClose}
        />
        <ErrorSnack
          // autoHideDuration={3000}
          message={this.state.message}
          errorSnack={this.state.errorSnack}
          handleClose={this.handleClose}
        />
      </div>
    );
  }
}

export default Register;
