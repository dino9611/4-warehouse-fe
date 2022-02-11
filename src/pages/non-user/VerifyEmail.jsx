import React from "react";
import qs from "query-string";
import axios from "axios";
import { API_URL } from "../../constants/api";
import "./styles/VerifyEmail.css";
// import logo from "../../assets/logo.svg";
import verified from "../../assets/Verified.png";
import failed from "../../assets/components/Fetch-Fail.svg";
import loading from "../../assets/Loading.png";
import SuccessSnack from "../../components/SuccessSnack";
import ErrorSnack from "../../components/ErrorSnackbar";
import { Link } from "react-router-dom";

class VerifyEmail extends React.Component {
  state = {
    verifyCondition: 1,
    successSnack: false,
    errorSnack: false,
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ errorSnack: false, successSnack: false });
  };
  onSendEmailClick = () => {
    try {
      const { xtoken } = qs.parse(this.props.location.search);
      axios.get(`${API_URL}/auth/send-email`, {
        headers: { Authorization: `Bearer ${xtoken}` },
      });
      this.setState({
        successSnack: true,
        message: "Email Verifikasi telah Dikirim",
      });
    } catch (err) {
      console.log(err);
      this.setState({
        verifyCondition: 3,
        errorSnack: true,
        message: err.response.data.message || "Server Error",
      });
    }
  };

  // fetchdata = async ()=>{
  //   const { token } = qs.parse(this.props.location.search);
  //   console.log(token);
  // }

  async componentDidMount(props) {
    try {
      const { token } = qs.parse(this.props.location.search);
      console.log(token);
      const res = await axios.get(`${API_URL}/auth/verified`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);
      this.setState({ verifyCondition: 2 });
    } catch (err) {
      console.log(err);
      this.setState({
        verifyCondition: 3, //! Utk coba2, ganti ini
        errorSnack: true,
        message: err.response.data.message || "Server Error",
      });
    }
  }

  render() {
    const { verifyCondition } = this.state;
    if (verifyCondition === 1) {
      return (
        <div className="verif-ongoing">
          <img src={loading} height="10%" width="20%" />
          <h2>Sedang menunggu Verifikasi</h2>
        </div>
      );
    }
    if (verifyCondition === 2) {
      return (
        <div className="verif-berhasil">
          <img src={verified} height="320px" width="320px" />
          <h2>Verifikasi Berhasil</h2>
        </div>
      );
    }

    return (
      <div className="verif-failed">
        <img src={failed} height="320px" width="320px" />
        <h3>Verifikasi Gagal</h3>

        <div>
          <button onClick={this.onSendEmailClick} className="btn-send-email">
            Kirim Email Ulang
          </button>
          <Link to="/">
            <button className="btn-send-email" type="button">
              Homepage
            </button>
          </Link>
        </div>
        <div>
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
        </div>
      </div>
    );
  }
}

export default VerifyEmail;
