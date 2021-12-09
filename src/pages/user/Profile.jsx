import React from "react";
import "./style/profile.css";
import images from "./../../assets";

function Profile() {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-3">
          <div className="profile-sidebar-container">
            <div className="profile-photo-wrapper w-100 h-100 d-flex flex-column align-items-center justify-content-center">
              <div className="profile-photo-circle d-flex justify-content-center align-items-center w-100 h-100 mb-3">
                <img
                  src={images.footer}
                  alt="photo-profile"
                  className="profile-photo"
                />
                <div className="profile-update-photo">asdasd</div>
              </div>

              <div className="profile-username">gangsarap</div>
            </div>
          </div>
        </div>
        <div className="col-9 ">asd</div>
      </div>
    </div>
  );
}

export default Profile;
