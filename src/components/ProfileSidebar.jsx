import React, { useEffect, useState } from "react";
import "./styles/profileSidebar.css";
import images from "./../assets";
import { Link, useRouteMatch } from "react-router-dom";
import axios from "axios";
import { API_URL } from "./../constants/api";
import { useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";

function ProfileSidebar() {
  // Untuk url nesting route
  let { url } = useRouteMatch();
  const data = useSelector((state) => state.ProfileReducer);

  const [file, setFile] = useState(null);

  useEffect(() => {
    if (file) {
      (async () => {
        try {
          const formData = new FormData();
          formData.append("image", file);

          await axios.patch(`${API_URL}/profile/upload-photo/1`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          alert("berhasil");
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [file]);
  console.log(data);
  return (
    <>
      <div className="profile-sidebar-container mb-4">
        <div className="profile-photo-wrapper w-100 h-100 d-flex flex-column align-items-center justify-content-center">
          <div className="d-flex justify-content-center align-items-center w-100 h-100 mb-3">
            {file || data.profile_picture ? (
              <img
                src={
                  file
                    ? URL.createObjectURL(file)
                    : `${API_URL}${data.profile_picture}`
                }
                alt="photo-profile"
                className="profile-photo"
              />
            ) : (
              <div className="profile-photo">
                <Avatar className="w-100 h-100 d-flex align-items-center justify-content-center">
                  {data.username.slice(0, 1).toUpperCase()}
                </Avatar>
              </div>
            )}
          </div>
          <div className="w-100 d-flex justify-content-center">
            <label htmlFor="photo-profile" className="photo-profile-btn">
              Pilih foto
            </label>
            <input
              type="file"
              id="photo-profile"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <div className="profile-username">{data.username}</div>
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
