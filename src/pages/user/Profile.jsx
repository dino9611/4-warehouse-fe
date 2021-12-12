import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import ButtonPrimary from "../../components/ButtonPrimary";
import Textbox from "../../components/Textbox";
import CalenderComp from "./../../components/CalenderComp";
import { API_URL } from "../../constants/api";
import "./style/profile.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Modal from "../../components/Modal";
import ClickOutside from "./../../components/ClickOutside";

function Profile() {
  const dispatch = useDispatch();

  const [personalData, setPersonalData] = useState({});
  const [handleGender, setHandleGender] = useState(false);
  const [handlePassword, setHandlePassword] = useState(false);
  const [dataPassword, setDataPassword] = useState({
    currentPass: "",
    newPass: "",
  });
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [isPassTrue, setIsPassTrue] = useState(true);
  const [isPassFilled, setIsPassFilled] = useState(true);
  const [isPassMatch, setIsPassMatch] = useState(true);
  const calenderData = useSelector((state) => state.ProfileReducer);

  // Kondisi Password !!!!!!!

  useEffect(() => {
    (async () => {
      try {
        let res = await axios.get(`${API_URL}/profile/personal-data/2`);

        const date = new Date(`${res.data[0].date_of_birth}`);
        let formatDate = `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}`;

        setPersonalData({ ...res.data[0], date_of_birth: formatDate });
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  // Ubah personal data ke state

  const onChangeData = (e) => {
    setPersonalData({
      ...personalData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit data untuk disimpan ke dalam database

  const onClickInputData = async () => {
    const sendPersonalData = {
      ...personalData,
      date_of_birth: personalData.date_of_birth || calenderData.chooseDate,
    };
    console.log(sendPersonalData);
    try {
      await axios.post(
        `${API_URL}/profile/edit/personal-data/2`,
        sendPersonalData
      );

      alert("Berhasil input data");
    } catch (error) {
      console.log(error);
    }
  };

  // Gender setting

  const handlerGender = () => {
    setHandleGender(!handleGender);
  };

  const onClickGender = (e) => {
    setPersonalData({ ...personalData, gender: e.target.innerHTML });
    setHandleGender(false);
  };

  const renderInputGender = () => {
    return (
      <div
        className={`profile-dropdown-gender w-100 d-flex flex-column justify-content-between`}
      >
        <div className="profile-gender p-1" onClick={onClickGender}>
          Male
        </div>
        <div className="profile-dropdown-border w-100 my-2"></div>
        <div className="profile-gender p-1" onClick={onClickGender}>
          Female
        </div>
      </div>
    );
  };

  // Ubah Password

  const renderChangePassword = () => {
    return (
      <div>
        <div className="mb-3 d-flex align-items-center justify-content-center">
          <h5>Ubah Password</h5>
        </div>
        <div>
          <Textbox
            type="password"
            label="Masukkan password Anda saat ini"
            placeholder="Password Anda"
            name="currentPass"
            onChange={onChangePassword}
            value={dataPassword.currentPass}
            error={dataPassword.currentPass ? null : isPassFilled ? null : 1}
            errormsg="Password harus diisi"
          />
        </div>
        <div className="my-3">
          <Textbox
            type="text"
            label="Masukkan password baru Anda"
            placeholder="Password Baru"
            name="newPass"
            onChange={onChangePassword}
            value={dataPassword.newPass}
            onBlur={onBlurPassword}
            error={
              (dataPassword.newPass || isPassFilled) && isPassTrue ? null : 1
            }
            errormsg={
              !isPassTrue
                ? "Password harus lebih dari 8 karakter"
                : "Password harus diisi"
            }
          />
        </div>
        <div className="mb-3">
          <Textbox
            type="password"
            label="Ketik ulang password baru Anda"
            placeholder="Password Baru"
            name="confirmNewPass"
            onChange={(e) => setConfirmNewPass(e.target.value)}
            value={confirmNewPass}
            error={(confirmNewPass || isPassFilled) && isPassMatch ? null : 1}
            errormsg={
              !isPassMatch ? "Password belum sesuai" : "Password harus diisi"
            }
          />
        </div>
        <div className="d-flex justify-content-end">
          <div className="mr-3">
            <ButtonPrimary onClick={onClickChangePassword}>
              Simpan
            </ButtonPrimary>
          </div>
          <ButtonPrimary onClick={handleClosePassword}>Kembali</ButtonPrimary>
        </div>
      </div>
    );
  };

  const handleClosePassword = () => {
    setHandlePassword(false);
    setDataPassword({
      currentPass: "",
      newPass: "",
    });
    setConfirmNewPass("");
    setIsPassFilled(true);
    setIsPassTrue(true);
  };

  const onChangePassword = (e) => {
    setDataPassword({ ...dataPassword, [e.target.name]: e.target.value });
  };

  const onClickChangePassword = async () => {
    try {
      if (dataPassword.newPass && dataPassword.currentPass && confirmNewPass) {
        if (dataPassword.newPass != confirmNewPass) {
          setIsPassMatch(false);
          return;
        }

        setIsPassMatch(true);
        let strongRegex = new RegExp(
          "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
        );

        if (!strongRegex.test(dataPassword.newPass)) {
          setIsPassTrue(false);
          return;
        } else {
          setIsPassTrue(true);
        }

        let res = await axios.patch(
          `${API_URL}/profile/change-password/2`,
          dataPassword
        );

        setHandlePassword(false);

        alert(res.data.message);
      } else {
        setIsPassFilled(false);
        setIsPassTrue(true);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const onBlurPassword = () => {
    let strongRegex = new RegExp(
      "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
    );

    if (!strongRegex.test(dataPassword.newPass)) {
      setIsPassTrue(false);
    } else {
      setIsPassTrue(true);
    }
  };

  return (
    <div className="about-container">
      <h5 className="mb-5">Data Diri</h5>
      <div className="d-flex w-100 justify-content-between mb-4">
        <div className="w-100 mr-4">
          <Textbox
            label="Nama Depan"
            placeholder="Nama Depan"
            name="first_name"
            onChange={onChangeData}
            value={personalData.first_name}
          />
        </div>
        <div className="w-100">
          <Textbox
            label="Nama Belakang"
            placeholder="Nama Belakang"
            name="last_name"
            onChange={onChangeData}
            value={personalData.last_name}
          />
        </div>
      </div>
      <div className="mb-4">
        <Textbox label="Email" placeholder="Email" />
      </div>
      <div className="d-flex w-100 justify-content-between mb-4">
        <div className="w-100 mr-4" style={{ position: "relative" }}>
          <Textbox
            label="Jenis Kelamin"
            placeholder="Jenis Kelamin"
            name="gender"
            value={personalData.gender}
            disabled="disabled"
            backgroundColor="#fff"
            cursor="pointer"
            onClick={handlerGender}
          />
          {handleGender ? renderInputGender() : null}
        </div>
        <div className="w-100" style={{ position: "relative" }}>
          <Textbox
            label="Tanggal Lahir"
            placeholder="Tanggal Lahir"
            name="date_of_birth"
            onChange={onChangeData}
            value={calenderData.chooseDate || personalData.date_of_birth}
            disabled="disabled"
            backgroundColor="#fff"
            cursor="pointer"
            onClick={() => dispatch({ type: "OPENCALENDER" })}
          />
          {calenderData.handleCalender ? (
            <div className="profile-dropdown-calender">
              <CalenderComp bornDate={`${personalData.date_of_birth}`} />
            </div>
          ) : null}
        </div>
      </div>
      <div>
        <Textbox
          label="Password"
          placeholder="Ubah Password"
          disabled="disabled"
          backgroundColor="#fff"
          cursor="pointer"
          onClick={() => setHandlePassword(!handlePassword)}
        />
      </div>
      <div className="mt-4 w-100 d-flex justify-content-end">
        <ButtonPrimary onClick={onClickInputData}>Simpan</ButtonPrimary>
      </div>
      <div className="profile-modal">
        <Modal open={handlePassword} close={handleClosePassword}>
          {renderChangePassword()}
        </Modal>
      </div>
    </div>
  );
}

export default Profile;
