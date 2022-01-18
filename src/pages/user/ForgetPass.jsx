import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import assets from "../../assets";
import ButtonPrimary from "../../components/ButtonPrimary";
import Modal from "../../components/Modal";
import { API_URL } from "../../constants/api";
import Textbox from "./../../components/Textbox";

function ForgetPass({ open, close }) {
  const [inputEmail, setInputEmail] = useState("");
  const [errorInput, setErrorInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const dataSnackbar = useSelector((state) => state.snackbarMessageReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!open) {
      setInputEmail("");
      setErrorInput(false);
    }
  }, [open]);

  // EVENT

  // ONCLICK KIRIM EMAIL
  const onClickKirimEmail = async () => {
    try {
      setLoading(true);

      await axios.patch(`${API_URL}/auth/check-email`, { email: inputEmail });

      setLoading(false);
      close();

      dispatch({
        type: "SHOWSNACKBAR",
        payload: {
          status: "success",
          message: "Berhasil kirim link ke email, cek segera emailmu!",
        },
      });

      dataSnackbar.ref.current.showSnackbarMessage();
    } catch (error) {
      setErrorInput(true);
    }
  };

  // RENDERING

  // RENDER TITLE FORGET PASS
  const renderHeaderModal = () => {
    return (
      <div className="d-flex align-items-center justify-content-between w-100 px-4 pt-4 pb-3">
        <div className="fs14-500-black">Lupa Password</div>
        <button
          style={{ border: "none", backgroundColor: "transparent" }}
          onClick={close}
        >
          <img src={assets.close} alt="" />
        </button>
      </div>
    );
  };

  // RENDER CONTENT FORGET PASSWORD
  const renderContentForget = () => {
    return (
      <div className="px-3 pb-4 mt-2 ">
        <div className="mb-3">
          <Textbox
            placeholder="Masukkan email"
            label="Email"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            error={errorInput ? true : false}
            errormsg="Email ini belum ter-register di sistem kami"
          />
        </div>
        <div
          className="mb-3"
          style={{ fontSize: "0.75em", fontWeight: "500", color: "#070707" }}
        >
          * Link lupa password akan dikirimkan ke email yang dimasukkan
        </div>
        {renderFooterModal()}
      </div>
    );
  };

  // RENDER FOOTER MODAL
  const renderFooterModal = () => {
    return (
      <div className="d-flex w-100 mt-4">
        <button
          className="w-50 mr-3"
          style={{
            border: "1px solid #b24629",
            backgroundColor: "transparent",
            borderRadius: "100px",
            fontSize: "0.875em",
            fontWeight: "600",
            color: "#b24629",
          }}
          onClick={close}
        >
          Batal
        </button>
        <ButtonPrimary width=" w-50" onClick={onClickKirimEmail}>
          Kirim email
        </ButtonPrimary>
      </div>
    );
  };

  // RENDER MODAL
  const renderModal = () => {
    return (
      <Modal open={open} close={close} classModal="forget-pass-modal p-0">
        {renderHeaderModal()}
        {renderContentForget()}
      </Modal>
    );
  };

  return <div>{renderModal()}</div>;
}

export default ForgetPass;
