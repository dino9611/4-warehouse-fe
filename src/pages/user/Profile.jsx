import React, { useEffect, useRef, useState } from "react";
import "./style/profile.css";

// Component

import ButtonPrimary from "../../components/ButtonPrimary";
import CalenderComp from "./../../components/CalenderComp";
import ClickOutside from "./../../components/ClickOutside";
import Textbox from "../../components/Textbox";
import { API_URL } from "../../constants/api";
import Modal from "../../components/Modal";
import images from "./../../assets";

// Library

import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import qs from "query-string";
import axios from "axios";

//Transition

import { useTransition, animated } from "react-spring";
import { Spinner } from "reactstrap";

function Profile() {
  // Redux

  const dispatch = useDispatch(); // Memanggil fungsi dispatch redux
  const calenderData = useSelector((state) => state.ProfileReducer); // Mengambil data calender dari profile reducer
  const dataUser = useSelector((state) => state.auth); // Mengambil data auth user dari redux

  const location = useLocation(); // Use location untuk mengambil params dari sebuah url

  // Handle dan input untuk personal data

  const [initialData, setInitialData] = useState({}); // Reset data ketika tombol batal edit ditekan
  const [personalData, setPersonalData] = useState({}); // Personal data dari user
  const [handleGender, setHandleGender] = useState(false); // Handle untuk membuka dropdown gender
  const [handleEmail, setHandleEmail] = useState(false); // Handle untuk membuka dan menutup modal email
  const [handleUbahData, setHandleUbahData] = useState(false); // Handle untuk user edit personal data
  const [loading, setLoading] = useState(false); // Handle loading pada saat user submit data
  const [handlePassword, setHandlePassword] = useState(false);
  const [dataPassword, setDataPassword] = useState({
    currentPass: "",
    newPass: "",
  });

  // State ganti photo profile

  const [file, setFile] = useState(null);

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
        let res = await axios.get(
          `${API_URL}/profile/personal-data/${dataUser.id}`
        );

        const date = new Date(`${res.data[0].date_of_birth}`);
        let formatDateUser;

        if (res.data[0].date_of_birth) {
          formatDateUser = `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()}`;
        } else {
          formatDateUser = null;
        }

        setPersonalData({
          ...res.data[0],
          phone_number: res.data[0].phone_number.slice(3),
          date_of_birth: formatDateUser,
        });
        setInitialData({ ...res.data[0], date_of_birth: formatDateUser });

        dispatch({ type: "PICKDATE", payload: formatDateUser });
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

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

  // Handle untuk memilih gender

  const onClickGender = (e) => {
    setPersonalData({ ...personalData, gender: e.target.innerHTML });
    setHandleGender(false);
  };

  // Render untuk change password

  // const renderChangePassword = () => {
  //   return (
  //     <div>
  //       <div className="mb-3 d-flex align-items-center justify-content-center">
  //         <h5>Ubah Password</h5>
  //       </div>
  //       <div>
  //         <Textbox
  //           type="password"
  //           label="Masukkan password Anda saat ini"
  //           placeholder="Password Anda"
  //           name="currentPass"
  //           onChange={onChangePassword}
  //           value={dataPassword.currentPass}
  //           error={
  //             (dataPassword.newPass || isPassFilled) && isPassCorrect ? null : 1
  //           }
  //           errormsg={
  //             !isPassCorrect
  //               ? "Password lama anda salah"
  //               : "Password harus diisi"
  //           }
  //         />
  //       </div>
  //       <div className="my-3">
  //         <Textbox
  //           type="text"
  //           label="Masukkan password baru Anda"
  //           placeholder="Password Baru"
  //           name="newPass"
  //           onChange={onChangePassword}
  //           value={dataPassword.newPass}
  //           onBlur={onBlurPassword}
  //           error={
  //             (dataPassword.newPass || isPassFilled) && isPassTrue ? null : 1
  //           }
  //           errormsg={
  //             !isPassTrue
  //               ? "Password harus lebih dari 8 karakter"
  //               : "Password harus diisi"
  //           }
  //         />
  //       </div>
  //       <div className="mb-3">
  //         <Textbox
  //           type="password"
  //           label="Ketik ulang password baru Anda"
  //           placeholder="Password Baru"
  //           name="confirmNewPass"
  //           onChange={(e) => setConfirmNewPass(e.target.value)}
  //           value={confirmNewPass}
  //           error={(confirmNewPass || isPassFilled) && isPassMatch ? null : 1}
  //           errormsg={
  //             !isPassMatch ? "Password belum sesuai" : "Password harus diisi"
  //           }
  //         />
  //       </div>
  //       <div className="d-flex justify-content-end">
  //         <div className="mr-3">
  //           <ButtonPrimary onClick={onClickChangePassword}>
  //             Simpan
  //           </ButtonPrimary>
  //         </div>
  //         <ButtonPrimary onClick={handleClosePassword}>Kembali</ButtonPrimary>
  //       </div>
  //     </div>
  //   );
  // };

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

  // EVENT

  const onClickSimpanData = async () => {
    const sendPersonalData = {
      ...personalData,
      phone_number: `+62${personalData.phone_number}`,
      date_of_birth: calenderData.chooseDate || personalData.date_of_birth,
    };

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", file);
      formData.append("data", JSON.stringify(sendPersonalData));

      let res = await axios.post(
        `${API_URL}/profile/edit/personal-data/${dataUser.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch({ type: "EDITDATA", payload: res.data.message });

      alert("Berhasil input data");

      setLoading(false);
      setHandleUbahData(false);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // Onclick untuk menghapus foto

  const onClickHapusFoto = () => {
    setPersonalData({ ...personalData, profile_picture: null });
    setFile(null);
  };

  // Ubah personal data ke state

  const onChangeData = (e) => {
    setPersonalData({
      ...personalData,
      [e.target.name]: e.target.value,
    });
  };

  // RENDERING

  // Render tab profile

  const renderTab = () => {
    return (
      <div className="profile-tab mb-3">
        <Link to="/profile" className="text-link">
          <button
            className={`profile-list-tab pb-2 px-2 ${
              qs.parse(location.search).q === "change-password"
                ? null
                : "profile-tab-active"
            }`}
          >
            Data diri
          </button>
        </Link>
        <Link to="/profile?q=change-password">
          <button
            className={`profile-list-tab pb-2 px-2 ${
              qs.parse(location.search).q === "change-password"
                ? "profile-tab-active"
                : null
            }`}
          >
            Ganti password
          </button>
        </Link>
        <div className="profile-tab-border"></div>
      </div>
    );
  };

  // Render foto profil user

  const renderPhotoProfile = () => {
    return file || personalData.profile_picture ? (
      <div>
        <img
          src={
            file
              ? URL.createObjectURL(file)
              : `${API_URL}${personalData.profile_picture}`
          }
          alt="profpic"
          className="profile-userpp"
        />
      </div>
    ) : (
      <div className="profile-pp d-flex align-items-center justify-content-center">
        <img
          src={images.profpic}
          alt="profpic"
          style={{ width: "160px", height: "160px" }}
        />
      </div>
    );
  };

  // Render button untuk mengganti foto profil

  const renderBtnChangePhoto = () => {
    return (
      <div className="mt-4 w-100">
        <div className="d-flex align-items-center w-100">
          <label
            htmlFor="photo-profile"
            className={`d-flex align-items-center w-100 mr-2 ${
              handleUbahData
                ? "profile-btn-editpp profile-btn-edit-active"
                : "profile-btn-editpp-disabled"
            }`}
          >
            <img src={images.camera} alt="kamera" className="mr-1" />
            Pilih foto
          </label>
          <input
            type="file"
            id="photo-profile"
            style={{ display: "none" }}
            accept="image/png, image/jpeg"
            disabled={handleUbahData ? false : true}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            className="profile-btn-editpp d-flex align-items-center w-100 ml-2"
            disabled={
              (file || personalData.profile_picture) && handleUbahData
                ? false
                : true
            }
            onClick={onClickHapusFoto}
          >
            <img src={images.trashpolos} alt="hapus" className="mr-1" />
            Hapus foto
          </button>
        </div>
      </div>
    );
  };

  // Render data user first name, last name, dll

  const renderDataUser = () => {
    return (
      <div className="d-flex flex-column w-100">
        <div className="d-flex justify-content-between mb-3">
          <div className="flex-fill mr-3">
            <Textbox
              label="Nama depan"
              placeholder="Masukkan nama depan"
              name="first_name"
              onChange={onChangeData}
              value={personalData.first_name}
              disabled={!handleUbahData}
              backgroundColor="#fff"
              color={handleUbahData ? null : "#CACACA"}
            />
          </div>
          <div className="flex-fill">
            <Textbox
              label="Nama belakang"
              placeholder="Masukkan nama belakang"
              name="last_name"
              onChange={onChangeData}
              value={personalData.last_name}
              disabled={!handleUbahData}
              backgroundColor="#fff"
              color={handleUbahData ? null : "#CACACA"}
            />
          </div>
        </div>
        <div className="mb-3">
          <Textbox
            label="Username"
            name="username"
            disabled={true}
            backgroundColor="#fff"
            value={dataUser.username}
            color="#CACACA"
          />
        </div>
        <div className="mb-3">
          <Textbox
            label="Alamat email"
            placeholder="Email"
            disabled="disabled"
            backgroundColor="#fff"
            cursor="pointer"
            value={dataUser.email}
            onClick={() => setHandleEmail(!handleEmail)}
            color="#CACACA"
          />
        </div>
        <div className="d-flex justify-content-between mb-3">
          {renderGenderUser()}
          {renderDataBirthUser()}
        </div>
        <div className="mb-3 mr-3">{renderPhoneNumber()}</div>
        <div className="mt-3 ">
          {handleUbahData ? (
            renderBtnEdit()
          ) : (
            <ButtonPrimary width="px-5" onClick={() => setHandleUbahData(true)}>
              Ubah data
            </ButtonPrimary>
          )}
        </div>
      </div>
    );
  };

  // Render tanggal lahir dari user

  const renderDataBirthUser = () => {
    return (
      <div
        ref={calenderRef}
        className="flex-fill"
        style={{ position: "relative" }}
      >
        <Textbox
          cursor="pointer"
          disabled="disabled"
          name="date_of_birth"
          label="Tanggal lahir"
          backgroundColor="#fff"
          placeholder="Pilih tanggal lahir"
          onChange={onChangeData}
          onClick={
            handleUbahData ? () => dispatch({ type: "OPENCALENDER" }) : null
          }
          changeMessage={<img src={images.calendar} alt="calendar" />}
          value={calenderData.chooseDate || personalData.date_of_birth}
          color={handleUbahData ? null : "#CACACA"}
        />
        {transitionCalender((style, item) =>
          item ? (
            <animated.div
              style={style}
              className="profile-dropdown-calender w-100 pr-1 pl-1 py-1 pt-2"
            >
              <CalenderComp
                bornDate={`${
                  personalData.date_of_birth ||
                  calenderData.chooseDate ||
                  `${new Date().getFullYear()}-${
                    new Date().getMonth() + 1
                  }-${new Date().getDate()}`
                }`}
              />
            </animated.div>
          ) : null
        )}
      </div>
    );
  };

  // Render jenis kelamin user

  const renderGenderUser = () => {
    return (
      <div
        ref={genderRef}
        className="flex-fill mr-3"
        style={{ position: "relative" }}
      >
        <Textbox
          name="gender"
          cursor="pointer"
          disabled="disabled"
          label="Jenis kelamin"
          backgroundColor="#fff"
          placeholder="Pilih jenis kelamin"
          value={
            personalData.gender?.charAt(0).toUpperCase() +
              personalData.gender?.slice(1) || null
          }
          color={handleUbahData ? null : "#CACACA"}
          changeMessage={<img src={images.arrowdropdown} alt="dd" />}
          onClick={handleUbahData ? () => setHandleGender(!handleGender) : null}
        />
        {renderInputGender()}
      </div>
    );
  };

  // Render untuk dropdown gender

  const renderInputGender = () => {
    return transition((style, item) =>
      item ? (
        <animated.div
          style={style}
          className="profile-dropdown-gender d-flex flex-column justify-content-between w-100"
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

  // Render nomor handphone user

  const renderPhoneNumber = () => {
    return (
      <>
        <label htmlFor="phone-number" className="profile-fs14-600-black">
          Nomer ponsel
        </label>
        <div className="profile-phonenumber d-flex align-items-center w-50">
          <div className="profile-fs14-400-black mr-1">+62</div>
          <input
            type="number"
            id="phone-number"
            placeholder="Nomer ponsel"
            className="profile-phonenumber-input"
            disabled={!handleUbahData}
            name="phone_number"
            style={{ color: handleUbahData ? null : "#CACACA" }}
            value={personalData.phone_number}
            onChange={onChangeData}
          />
        </div>
      </>
    );
  };

  // Render button cancel dan simpan jika state ubah data menjadi true

  const renderBtnEdit = () => {
    return (
      <div>
        <button
          className="profile-btn-cancel profile-btn-width mr-4"
          onClick={() => setHandleUbahData(false)}
        >
          Batal
        </button>
        <ButtonPrimary
          width="profile-btn-width"
          onClick={onClickSimpanData}
          disabled={loading ? true : false}
        >
          {loading ? (
            <Spinner color="light" size="sm">
              Loading...
            </Spinner>
          ) : (
            "Simpan"
          )}
        </ButtonPrimary>
      </div>
    );
  };

  // Render keseluruhan untuk edit personal data

  const renderChangePersonalData = () => {
    return (
      <div className="d-flex">
        <div className="mr-4">
          <div className="profile-fs14-600-black mb-2">Foto Profil</div>
          {renderPhotoProfile()}
          {renderBtnChangePhoto()}
        </div>
        {renderDataUser()}
      </div>
    );
  };

  // Render untuk page ganti password

  const renderChangePassword = () => {
    return <div>asdasd</div>;
  };

  // RETURN

  return (
    <div>
      {renderTab()}
      {qs.parse(location.search).q === "change-password"
        ? renderChangePassword()
        : renderChangePersonalData()}
    </div>
  );
}

export default Profile;
