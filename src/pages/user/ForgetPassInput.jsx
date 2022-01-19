import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ButtonPrimary from "../../components/ButtonPrimary";
import Textbox from "../../components/Textbox";
import { API_URL } from "../../constants/api";
import gambar from "./../../assets/login.png";
import "./style/forgetPass.css";
import queryString from "query-string";
import Admin404Img from "../../assets/components/404.svg";
import ForgetPass from "./ForgetPass";
import { useHistory } from "react-router-dom";
import { Spinner } from "reactstrap";

function ForgetPassInput(props) {
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [errorVerif, setErrorVerif] = useState(false);
  const [handleModal, setHandleModal] = useState(false);
  const [errorInput, setErrorInput] = useState(false);
  const [errorConfirm, setErrorConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idUser, setIdUser] = useState(null);

  const dataSnackbar = useSelector((state) => state.snackbarMessageReducer);
  const dispatch = useDispatch();
  const history = useHistory();

  let params = queryString.parse(props.location.search);

  useEffect(() => {
    (async () => {
      try {
        let res = await axios.get(`${API_URL}/auth/verify/forget-pass`, {
          headers: { Authorization: `Bearer ${params.token}` },
        });

        console.log("masuk sini");

        console.log(res.data.id);

        setIdUser(res.data.id);
      } catch (error) {
        setErrorVerif(true);

        dispatch({
          type: "SHOWSNACKBAR",
          payload: {
            status: "error",
            message: error.response.data.message,
          },
        });

        dataSnackbar.ref.current.showSnackbarMessage();
      }
    })();
  }, []);

  // ONCLICK CHANGE PASSWORD
  const onClickChangePass = async () => {
    try {
      let strengthReq = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
      );

      const cekPass = strengthReq.test(newPass);

      if (!newPass) {
        setErrorInput("Data harus terisi");
        return;
      }

      if (!cekPass) {
        setErrorInput("Minimal 8 karakter, terdapat simbol, huruf kapital");
        return;
      }

      setErrorInput(false);

      if (!confirmPass) {
        setErrorConfirm("Data harus terisi");
        return;
      }

      if (newPass !== confirmPass) {
        setErrorConfirm("Konfirmasi password tidak sesuai");
        return;
      }

      setErrorConfirm(false);

      setLoading(true);

      const dataPassword = {
        id: idUser,
        password: newPass,
      };

      let res = await axios.patch(
        `${API_URL}/auth/reset-password`,
        dataPassword
      );

      setLoading(false);

      dispatch({
        type: "SHOWSNACKBAR",
        payload: {
          status: "success",
          message: res.data.message,
        },
      });

      dataSnackbar.ref.current.showSnackbarMessage();

      history.push("/login");
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
    }
  };

  // RENDER ERROR PAGE
  const renderErrorPage = () => {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center w-100"
        style={{ height: "100vh" }}
      >
        <div>
          <img src={Admin404Img} alt="" />
        </div>
        <div className="my-3" style={{ fontWeight: "600", color: "#070707" }}>
          Aduh, link sudah kadaluwarsa! Klik disini untuk mengirim email lagi
        </div>
        <div
          style={{ fontWeight: "600", color: "#b24629", cursor: "pointer" }}
          onClick={() => setHandleModal(true)}
        >
          Kirim email
        </div>
      </div>
    );
  };

  // RENDER FORGET POASS
  const renderForgetPass = () => {
    return (
      <div
        className="forget-pass-wrapper my-5 d-flex"
        style={{ height: "auto" }}
      >
        <img
          src={gambar}
          alt=""
          style={{ objectFit: "cover", height: "100%", width: "50%" }}
        />
        <div className="d-flex flex-column align-items-center justify-content-center w-50">
          <div className="w-75">
            <div
              className="align-self-start mb-4"
              style={{
                fontSize: "1.750em",
                fontWeight: "600",
                color: "#070707",
              }}
            >
              Lupa password
            </div>
            <div className="mb-3">
              <Textbox
                placeholder="Masukkan password baru"
                label="Password baru"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                error={errorInput}
                errormsg={errorInput}
                type="password"
              />
            </div>
            <div className="mb-5">
              <Textbox
                placeholder="Masukkan konfirmasi password"
                label="Konfirmasi password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                error={errorConfirm}
                errormsg={errorConfirm}
                type="password"
              />
            </div>
            <ButtonPrimary
              width="w-50"
              onClick={onClickChangePass}
              disabled={!newPass || !confirmPass || loading ? true : false}
            >
              {loading ? (
                <Spinner color="light" size="sm">
                  Loading...
                </Spinner>
              ) : (
                "Ganti password"
              )}
            </ButtonPrimary>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container  ">
      {errorVerif ? renderErrorPage() : renderForgetPass()}
      <ForgetPass open={handleModal} close={() => setHandleModal(false)} />
    </div>
  );
}

export default ForgetPassInput;
