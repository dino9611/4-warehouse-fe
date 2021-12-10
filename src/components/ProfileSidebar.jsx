import React from "react";
import "./styles/profileSidebar.css";
import images from "./../assets";
import { Link, useRouteMatch } from "react-router-dom";

function ProfileSidebar() {
  let { url } = useRouteMatch();

  console.log(url);
  return (
    <>
      <div className="profile-sidebar-container mb-4">
        <div className="profile-photo-wrapper w-100 h-100 d-flex flex-column align-items-center justify-content-center">
          <div className="d-flex justify-content-center align-items-center w-100 h-100 mb-3">
            <img
              src={images.footer}
              alt="photo-profile"
              className="profile-photo"
            />
          </div>
          <div className="w-100 d-flex justify-content-center">
            <label htmlFor="photo-profile" className="photo-profile-btn">
              Pilih foto
            </label>
            <input type="file" id="photo-profile" style={{ display: "none" }} />
          </div>

          <div className="profile-username">gangsarap</div>
        </div>
      </div>
      <div className="profile-route-container w-100">
        <div className="profile-route-wrapper d-flex flex-column justify-content-around h-100">
          <Link to="/profile" className="text-link">
            <div className="d-flex align-items-center">
              <img src={images.profil} alt="" className="mr-3" />
              <div className="profile-route-name">Profil Saya</div>
            </div>
          </Link>
          <div className="profile-route-border"></div>
          <Link to={`${url}/history`} className="text-link">
            <div className="d-flex align-items-center">
              <img src={images.cart} alt="" className="mr-3" />
              <div className="profile-route-name">History Pesanan</div>
            </div>
          </Link>
          <div className="profile-route-border"></div>
          <Link to={`${url}/address`} className="text-link">
            <div className="d-flex align-items-center">
              <img src={images.search} alt="" className="mr-3" />
              <div className="profile-route-name">Daftar Alamat</div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

export default ProfileSidebar;
