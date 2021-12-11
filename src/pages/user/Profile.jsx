import axios from "axios";
import React, { useEffect, useState } from "react";
import ButtonPrimary from "../../components/ButtonPrimary";
import Textbox from "../../components/Textbox";
import CalenderComp from "./../../components/CalenderComp";
import { API_URL } from "../../constants/api";
import "./style/profile.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

function Profile() {
  const dispatch = useDispatch();

  const [personalData, setPersonalData] = useState({});
  const [handleGender, setHandleGender] = useState(false);
  const [handleCalender, setHandleCalender] = useState(false);
  const [date, setDate] = useState("");
  const calenderData = useSelector((state) => state.ProfileReducer);

  useEffect(() => {
    (async () => {
      try {
        let res = await axios.get(`${API_URL}/profile/personal-data/2`);

        const date = new Date(`${res.data[0].date_of_birth}`);
        let formatDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

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
      date_of_birth: calenderData.chooseDate,
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
        <Textbox label="Password" placeholder="Ubah Password" />
      </div>
      <div className="mt-4 w-100 d-flex justify-content-end">
        <ButtonPrimary name="Simpan" onClick={onClickInputData} />
      </div>
    </div>
  );
}

export default Profile;
