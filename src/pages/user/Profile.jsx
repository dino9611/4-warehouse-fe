import React from "react";
import Textbox from "../../components/Textbox";
import "./style/profile.css";

function Profile() {
  return (
    <div className="about-container">
      <h5 className="mb-5">Data Diri</h5>
      <div className="d-flex w-100 justify-content-between mb-4">
        <div className="w-100 mr-4">
          <Textbox label="Nama Depan" placeholder="Nama Depan" />
        </div>
        <div className="w-100">
          <Textbox label="Nama Belakang" placeholder="Nama Belakang" />
        </div>
      </div>
      <div className="mb-4">
        <Textbox label="Email" placeholder="Email" />
      </div>
      <div className="d-flex w-100 justify-content-between mb-4">
        <div className="w-100 mr-4">
          <Textbox label="Jenis Kelamin" placeholder="Jenis Kelamin" />
        </div>
        <div className="w-100">
          <Textbox label="Tanggal Lahir" placeholder="Tanggal Lahir" />
        </div>
      </div>
      <div>
        <Textbox label="Password" placeholder="Ubah Password" />
      </div>
    </div>
  );
}

export default Profile;
