import React, { Component } from "react";

import { API_URL } from "../../constants/api";
import "./style/Login.css";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import { LoginAction, totalItem } from "../../redux/actions/AuthAction";
import { connect } from "react-redux";
import gambar from "./../../assets/login.png";
import SuccessSnack from "../../components/SuccessSnack";
import ErrorSnack from "../../components/ErrorSnackbar";
import ForgetPass from "./ForgetPass";

class Login extends React.Component {
  state = {
    showpassword: "password",
    username: "",
    password: "",
    is_login: false,
    successSnack: false,
    errorSnack: false,
    message: "",
    modalForget: false,
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
        this.setState({ successSnack: true, message: "Login Berhasil" });
        localStorage.setItem("token", res.headers["x-token-access"]);

        axios
          .get(`${API_URL}/transaction/get/total-item/${res.data.id}`)
          .then((resCart) => {
            this.props.totalItem(resCart.data);
          })
          .catch((error) => {
            console.log(error);
          });

        this.props.LoginAction(res.data);
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          errorSnack: true,
          message: err.response.data.message || "Server Error",
        });
      });
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ errorSnack: false, successSnack: false });
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
    if (this.props.isLogin) {
      return <Redirect to="/" />;
    }

    return (
      <div className="login-main-wrap">
        <div className="login-sub-wrap">
          <div className="login-left-image-wrap">
            <img src={gambar} width="100%" height="100%" />
          </div>
          <div className="login-right-form-wrap">
            <h2 className="regis-text">Masuk</h2>
            <div className="label-text">
              <h6>Username/Email</h6>
              <input
                type="text"
                className="form-control shadow-none text-input"
                placeholder="username"
                name="username"
                onChange={this.onInputChange}
                value={username}
              />
            </div>

            <div className="label-text">
              <div className="form-kata-sandi row">
                <h6>Kata sandi</h6>
                <div
                  className="link-lupa-password"
                  onClick={() => this.setState({ modalForget: true })}
                >
                  Lupa Password?
                </div>
              </div>

              <input
                type={showpassword}
                className="form-control shadow-none text-input-password"
                placeholder="Kata sandi"
                name="password"
                onChange={this.onInputChange}
                value={password}
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
              <button className="btn-login" onClick={this.onLoginCLick}>
                Masuk
              </button>
              <h6 className="sudah-punya-akun-text">Belum punya akun?</h6>
              <Link to="/register" className="link-daftar">
                Daftar
              </Link>
            </div>
          </div>
        </div>
        <SuccessSnack
          message={this.state.message}
          successSnack={this.state.successSnack}
          handleClose={this.handleClose}
        />
        <ErrorSnack
          message={this.state.message}
          errorSnack={this.state.errorSnack}
          handleClose={this.handleClose}
        />
        <ForgetPass
          open={this.state.modalForget}
          close={() => this.setState({ modalForget: false })}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLogin: state.auth.is_login,
  };
};

export default connect(mapStateToProps, { LoginAction, totalItem })(Login);
