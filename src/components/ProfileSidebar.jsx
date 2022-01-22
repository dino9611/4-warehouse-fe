import React, { useState } from "react";
import "./styles/profileSidebar.css";

// Library

import {
  Link,
  Redirect,
  useLocation,
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// Komponen

import images from "./../assets";
import { API_URL } from "./../constants/api";
import { logoutAction } from "../redux/actions";

function ProfileSidebar() {
  let { url } = useRouteMatch(); // Use route match untuk nesting route

  const dataUser = useSelector((state) => state.auth); // Selector redux untuk get data user dari redux
  const location = useLocation(); // Get lokasi params sedang berada di mana
  let history = useHistory();

  const dispatch = useDispatch();

  // untuk logout
  const onLogout = () => {
    localStorage.removeItem("token");
    dispatch(logoutAction());
    history.push("/");
  };

  // Render photo profile dan username

  const renderProfpic = () => {
    return dataUser.profile_picture ? (
      <div className="mr-3">
        <img
          src={`${API_URL}${dataUser.profile_picture}`}
          alt="profpic"
          style={{
            width: "56px",
            height: "56px",
            objectFit: "cover",
            borderRadius: "100%",
          }}
        />
      </div>
    ) : (
      <div className="profile-sidebar-profpic d-flex align-items-center justify-content-center mr-3">
        <img
          src={images.profpic}
          alt="profpic"
          style={{ width: "32px", height: "32px" }}
        />
      </div>
    );
  };

  // Render menu profile pada sidebar

  const renderMenuProfile = () => {
    return (
      <div>
        <Link to="/profile" className="text-link">
          <button
            className={`profile-btn-menu d-flex align-items-center w-100 p-2 ${
              location.pathname === "/profile" ? "profile-btn-active" : null
            }`}
          >
            <img src={images.editProfile} alt="editprofile" className="mr-2" />
            <div>Atur akun</div>
          </button>
        </Link>
        <Link to={`${url}/history`} className="text-link">
          <button
            className={`profile-btn-menu d-flex align-items-center w-100 p-2 ${
              location.pathname === "/profile/history"
                ? "profile-btn-active"
                : null
            }`}
          >
            <img src={images.history} alt="editprofile" className="mr-2" />
            <div>Pesanan saya</div>
          </button>
        </Link>
        <Link to={`${url}/address`} className="text-link">
          <button
            className={`profile-btn-menu d-flex align-items-center w-100 p-2 ${
              location.pathname === "/profile/address"
                ? "profile-btn-active"
                : null
            }`}
          >
            <img src={images.alamat} alt="editprofile" className="mr-2" />
            <div>Daftar alamat</div>
          </button>
        </Link>
      </div>
    );
  };

  return (
    <div className="profile-sidebar-container pt-4 pb-2">
      <div className="d-flex align-items-center">
        <div className="profile-sidebar-ppusername d-flex align-items-center px-4">
          {renderProfpic()}
          <div className="profile-1em-500">{dataUser.username}</div>
        </div>
      </div>
      <div className="px-2 mt-4">
        <div className="profile-border mb-2"></div>
        {renderMenuProfile()}
        <div className="profile-border my-2"></div>
        <button
          onClick={onLogout}
          className="profile-btn-menu d-flex align-items-center w-100 p-2"
        >
          <img src={images.logout} alt="editprofile" className="mr-2" />
          <div>Logout</div>
        </button>
      </div>
    </div>
  );
}

export default ProfileSidebar;
