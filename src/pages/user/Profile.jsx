import React, { useEffect, useRef, useState } from "react";
import "./style/profile.css";
import axios from "axios";

// Component

import ButtonPrimary from "../../components/ButtonPrimary";
import Textbox from "../../components/Textbox";
import CalenderComp from "./../../components/CalenderComp";
import ClickOutside from "./../../components/ClickOutside";
import Modal from "../../components/Modal";
import { API_URL } from "../../constants/api";

// Import redux

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

//Transition

import { useTransition, animated } from "react-spring";

function Profile() {
  // Redux

  const dispatch = useDispatch();
  const calenderData = useSelector((state) => state.ProfileReducer);

  // Handle dan input untuk personal data

  const [personalData, setPersonalData] = useState({});
  const [handleGender, setHandleGender] = useState(false);
  const [handlePassword, setHandlePassword] = useState(false);
  const [handleEmail, setHandleEmail] = useState(false);
  const [dataPassword, setDataPassword] = useState({
    currentPass: "",
    newPass: "",
  });

  // Handle dan input untuk change password

  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [isPassTrue, setIsPassTrue] = useState(true);
  const [isPassFilled, setIsPassFilled] = useState(true);
  const [isPassMatch, setIsPassMatch] = useState(true);
  const [isPassCorrect, setIsPassCorrect] = useState(true);

  // Handle dan input untuk change email

  const [dataEmail, setDataEmail] = useState({
    password: "",
    email: "",
  });
  const [isDataFilled, setIsDataFilled] = useState(true);
  const [isPassValid, setIsPassValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);

  // Ref handle component

  const genderRef = useRef();
  const calenderRef = useRef();

  // Use effect untuk get data personal (Sementara)

  useEffect(() => {
    (async () => {
      try {
        let res = await axios.get(`${API_URL}/profile/personal-data/2`);

        const date = new Date(`${res.data[0].date_of_birth}`);
        let formatDate = `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}`;

        setPersonalData({ ...res.data[0], date_of_birth: formatDate });
        // dispatch({
        //   type: "PICKIMAGE",
        //   payload: {
        //     profile_picture: res.data[0].profile_picture,
        //     username: res.data[0].username,
        //   },
        // });
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

  // Transition gender

  const transition = useTransition(handleGender, {
    config: { mass: 1, tension: 2000, friction: 60, clamp: true },
    from: { x: 0, y: -10, opacity: 0, PointerEvent: "none" },
    enter: { x: 0, y: 0, opacity: 1, PointerEvent: "all" },
    leave: { x: 0, y: -10, opacity: 0, PointerEvent: "none" },
  });
  ClickOutside(genderRef, () => setHandleGender(false));

  // Transition Calender

  const transitionCalender = useTransition(calenderData.handleCalender, {
    config: { mass: 1, tension: 2000, friction: 60, clamp: true },
    from: { x: 0, y: -10, opacity: 0, PointerEvent: "none" },
    enter: { x: 0, y: 0, opacity: 1, PointerEvent: "all" },
    leave: { x: 0, y: -10, opacity: 0, PointerEvent: "none" },
  });
  ClickOutside(calenderRef, () => dispatch({ type: "CLOSECALENDER" }));

  // Submit data untuk disimpan ke dalam database

  const onClickInputData = async () => {
    const sendPersonalData = {
      ...personalData,
      date_of_birth: calenderData.chooseDate || personalData.date_of_birth,
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

  // Handle untuk memilih gender

  const onClickGender = (e) => {
    setPersonalData({ ...personalData, gender: e.target.innerHTML });
    setHandleGender(false);
  };

  // Render untuk dropdown gender

  const renderInputGender = () => {
    return transition((style, item) =>
      item ? (
        <animated.div
          style={style}
          className="profile-dropdown-gender w-100 d-flex flex-column justify-content-between"
        >
          <div className="profile-gender p-1" onClick={onClickGender}>
            Male
          </div>
          <div className="profile-dropdown-border w-100 my-2"></div>
          <div className="profile-gender p-1" onClick={onClickGender}>
            Female
          </div>
        </animated.div>
      ) : null
    );
  };

  // Render untuk change password

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
            error={
              (dataPassword.newPass || isPassFilled) && isPassCorrect ? null : 1
            }
            errormsg={
              !isPassCorrect
                ? "Password lama anda salah"
                : "Password harus diisi"
            }
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

  // Handle menutup dropdown password

  const handleClosePassword = () => {
    setHandlePassword(false);
    setDataPassword({
      currentPass: "",
      newPass: "",
    });
    setConfirmNewPass("");
    setIsPassFilled(true);
    setIsPassTrue(true);
    setIsPassCorrect(true);
  };

  // Handle untuk mengubah data password

  const onChangePassword = (e) => {
    setDataPassword({ ...dataPassword, [e.target.name]: e.target.value });
  };

  // Submit data ubah password

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
          `${API_URL}/profile/change-password/1`,
          dataPassword
        );
        console.log(res.data);
        if (!res.data.length) {
          console.log("error pass");
          setIsPassCorrect(false);
          return;
        }

        setHandlePassword(false);
        setDataPassword({
          currentPass: "",
          newPass: "",
        });
        setConfirmNewPass("");
        setIsPassFilled(true);
        setIsPassTrue(true);
        setIsPassCorrect(true);
      } else {
        setIsPassFilled(false);
        setIsPassTrue(true);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // Protection untuk password strength

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

  // Render modal email

  const renderEmail = () => {
    return (
      <div>
        <div className="mb-3 d-flex align-items-center justify-content-center">
          <h5>Ubah Email</h5>
        </div>
        <div>
          <Textbox
            type="password"
            label="Masukkan password Anda"
            placeholder="Password Anda"
            name="password"
            onChange={onChangeEmail}
            value={dataEmail.password}
            error={
              (dataEmail.password || isDataFilled) && isPassValid ? null : 1
            }
            errormsg={
              !isPassValid
                ? "Password yang anda masukkan salah"
                : "Password harus diisi"
            }
          />
        </div>
        <div className="my-3">
          <Textbox
            type="text"
            label="Masukkan email baru Anda"
            placeholder="Email Baru Anda"
            name="email"
            onChange={onChangeEmail}
            value={dataEmail.email}
            error={
              (dataEmail.password || isDataFilled) && isEmailValid ? null : 1
            }
            errormsg={
              !isEmailValid ? "Email tidak valid" : "Password harus diisi"
            }
          />
        </div>
        <div className="d-flex justify-content-end">
          <div className="mr-3">
            <ButtonPrimary onClick={onClickSaveEmail}>Simpan</ButtonPrimary>
          </div>
          <ButtonPrimary onClick={onCloseEmail}>Kembali</ButtonPrimary>
        </div>
      </div>
    );
  };

  // Handle untuk close modal email

  const onCloseEmail = () => {
    setDataEmail({
      password: "",
      email: "",
    });
    setHandleEmail(false);
    setIsEmailValid(true);
    setIsPassValid(true);
    setIsDataFilled(true);
  };

  // Mengubah data email

  const onChangeEmail = (e) => {
    setDataEmail({ ...dataEmail, [e.target.name]: e.target.value });
  };

  // Submit data email ke backend

  const onClickSaveEmail = async () => {
    try {
      if (!dataEmail.password && !dataEmail.email) {
        setIsDataFilled(false);
        return;
      }

      const regexEmail = new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$");
      if (regexEmail.test(dataEmail.email)) {
        setIsEmailValid(true);
      } else {
        setIsEmailValid(false);
        return;
      }

      let res = await axios.patch(
        `${API_URL}/profile/change-email/1`,
        dataEmail
      );

      if (!res.data.length) {
        setIsPassValid(false);
        return;
      }

      setHandleEmail(false);
      setIsPassValid(true);

      console.log("berhasil");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // RETURN

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
        <Textbox
          label="Email"
          placeholder="Email"
          disabled="disabled"
          backgroundColor="#fff"
          cursor="pointer"
          value={personalData.email}
          onClick={() => setHandleEmail(!handleEmail)}
        />
      </div>
      <div className="d-flex w-100 justify-content-between mb-4">
        <div
          ref={genderRef}
          className="w-100 mr-4"
          style={{ position: "relative" }}
        >
          <Textbox
            label="Jenis Kelamin"
            placeholder="Jenis Kelamin"
            name="gender"
            value={personalData.gender}
            disabled="disabled"
            backgroundColor="#fff"
            cursor="pointer"
            onClick={() => setHandleGender(!handleGender)}
          />
          {/* {handleGender ? renderInputGender() : null} */}
          {renderInputGender()}
        </div>
        <div
          ref={calenderRef}
          className="w-100"
          style={{ position: "relative" }}
        >
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
          {transitionCalender((style, item) =>
            item ? (
              <animated.div style={style} className="profile-dropdown-calender">
                <CalenderComp bornDate={`${personalData.date_of_birth}`} />
              </animated.div>
            ) : null
          )}
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
      {
        <div className="container-modal">
          <Modal open={handlePassword} close={handleClosePassword}>
            {renderChangePassword()}
          </Modal>
        </div>
      }
      <div className="container-modal">
        <Modal open={handleEmail} close={onCloseEmail}>
          {renderEmail()}
        </Modal>
      </div>
    </div>
  );
}

export default Profile;
