import React from "react";
import "./styles/hamburger.css";
import images from "./../assets";
import { useState } from "react";
import { useLocation, Link, useHistory } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { API_URL } from "../constants/api";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logoutAction } from "../redux/actions";

function ModalHamburger({ open, close }) {
  const [dataCategory, setDataCategory] = useState([]);
  const [handleCategory, setHandleCategory] = useState(false);

  const dataUser = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    (async () => {
      try {
        let res = await axios.get(`${API_URL}/product/category`);

        setDataCategory(res.data);
      } catch (error) {}
    })();
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open]);

  // EVENT

  // ONCLICK MENU
  const onClickMenu = (el) => {
    if (el === "profile") {
      history.push("/profile");
    } else if (el === "history") {
      history.push("/profile/history");
    } else if (el === "address") {
      history.push("/profile/address");
    } else {
      localStorage.removeItem("token");
      dispatch(logoutAction());
      dispatch({ type: "TOTALNULL" });
      history.push("/");
    }

    close();

    return;
  };

  const renderContent = () => {
    return (
      <div
        className="d-flex flex-column w-100 mt-4"
        style={{ fontWeight: "600", fontSize: "0.875em" }}
      >
        <Link to="/products" className="text-link mb-3">
          <div
            className={`${
              location.pathname === "/products"
                ? "hamburger-location w-100"
                : null
            } d-flex align-items-center justify-content-between pl-2`}
            onClick={() => close()}
          >
            <div>Produk</div>
          </div>
        </Link>
        <div className="header-kategori pl-2">
          <button
            className="header-focus-category d-flex align-items-center justify-content-between w-100"
            onClick={() => setHandleCategory(!handleCategory)}
          >
            <div>Kategori</div>
            <div
              className={`${
                handleCategory
                  ? "ham-category-dd-active"
                  : "ham-category-dd-noactive"
              }`}
            >
              <img src={images.arrowdropdown} alt="dropdown" />
            </div>
          </button>

          <div
            className={`mt-3 ${
              handleCategory ? "ham-content-dd active" : "ham-content-dd"
            }`}
          >
            {dataCategory.map((el) => {
              return (
                <div
                  key={el.id}
                  style={{ fontSize: "0.75rem", fontWeight: "500" }}
                  className="ham-list-cat mb-3"
                >
                  {el.category}
                </div>
              );
            })}
          </div>
        </div>
        <div className="pl-2 mb-4">Promo</div>
      </div>
    );
  };

  // RENDER USER FALSE
  const renderUserFalse = () => {
    return (
      <div className="w-100 mb-4">
        <Link to="/register" className="text-link">
          <div className="mb-4">
            <button
              style={{
                backgroundColor: "transparent",
                border: "1px solid #b24629",
                borderRadius: "100px",
              }}
              className="w-100 fs14-600-red py-2"
              onClick={() => close()}
            >
              Daftar
            </button>
          </div>
        </Link>
        <Link to="/login" className="text-link">
          <div>
            <button
              style={{ backgroundColor: "transparent", border: "none" }}
              className="w-100 fs14-600-red"
              onClick={() => close()}
            >
              Masuk
            </button>
          </div>
        </Link>
      </div>
    );
  };

  // RENDER USER TRUE
  const renderUserTrue = () => {
    const arrMenu = [
      {
        to: "profile",
        icon: images.profpic,
        name: "Akun saya",
      },
      {
        to: "history",
        icon: images.history,
        name: "Pesanan saya",
      },
      {
        to: "address",
        icon: images.alamat,
        name: "Daftar alamat",
      },
      {
        to: "logout",
        icon: images.logout,
        name: "Logout",
      },
    ];

    return (
      <div className="mb-4 w-100">
        <div
          className="d-flex align-items-center p-2 mb-3"
          style={{
            backgroundColor: "#f4f4f4",
            borderRadius: "100px",
          }}
        >
          {dataUser.profile_picture ? (
            <div className="mr-3">
              <img
                src={`${API_URL}${dataUser.profile_picture}`}
                alt="profpic"
                style={{
                  width: "30px",
                  height: "30px",
                  objectFit: "cover",
                  borderRadius: "100%",
                }}
              />
            </div>
          ) : (
            <div
              className="d-flex align-items-center justify-content-center mr-3"
              style={{
                width: "30px",
                aspectRatio: "1",
                borderRadius: "100%",
                backgroundColor: "#FCB537",
              }}
            >
              <img
                src={images.profpic}
                alt="profpic"
                style={{ width: "24px", height: "24px" }}
              />
            </div>
          )}
          <div className="fs14-600-red">Hi, {dataUser.username}</div>
        </div>
        {arrMenu.map((el) => {
          return (
            <div
              className="ham-menu d-flex align-items-center p-2"
              onClick={() => onClickMenu(el.to)}
            >
              <div className="mr-3">
                <img src={el.icon} alt={el.name} />
              </div>
              <div className="fs12-400-gray">{el.name}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        height: "calc(100vh - 74px)",
        overflow: "auto",
      }}
      className={`${
        open ? "hamburger-active" : "hamburger"
      } position-absolute w-100`}
    >
      <div className="container w-100 h-100 ">
        <div className="row flex-column align-items-center justify-content-between pl-4 w-100 h-100">
          {renderContent()}
          {dataUser.is_login ? renderUserTrue() : renderUserFalse()}
        </div>
      </div>
    </div>
  );
}

export default ModalHamburger;
