import { useEffect, useRef, useState } from "react";
import "./styles/header.css";
import { logoutAction } from "../redux/actions";

// Library react

import { Link, useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTransition, animated } from "react-spring";

// Komponen

import ClickOutside from "./../helpers/ClickOutside";
import Hamburger from "./Hamburger";
import { API_URL } from "../constants/api";
import asset from "./../assets/index";
import axios from "axios";

function Header() {
  const [dataCategory, setDataCategory] = useState([]); // State untuk menyimpan data produk dari database
  const [handlerCategory, setHandlerCategory] = useState(false); // State untuk kondisi dropdown category
  const [handlerProfile, setHandlerProfile] = useState(false); // State untuk kondisi dropdown profile

  const [handleHamburger, setHandleHamburger] = useState(false);

  // Use effect untuk get data list category

  useEffect(() => {
    (async () => {
      try {
        let resCategory = await axios.get(`${API_URL}/product/category`);

        setDataCategory(resCategory.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const location = useLocation(); // Uselocation untuk menentukan sedang berada di halaman yang mana

  // Ref target untuk close dropdown pada saat click outside

  const ref = useRef();
  const refProfile = useRef();

  // Selector redux

  const dataCart = useSelector((state) => state.cartReducer); // Data redux untuk cart detail
  const dataUser = useSelector((state) => state.auth); // Data redux untuk data user

  const dispatch = useDispatch();

  const history = useHistory();

  // Function click outside dropdown

  ClickOutside(ref, () => setHandlerCategory(false)); // Click outside untuk dropdown category
  ClickOutside(refProfile, () => setHandlerProfile(false)); // Click outside untuk dropdown profile

  // Transition dari library react spring

  const transition = useTransition(handlerCategory, {
    config: { mass: 1, tension: 2000, friction: 60, clamp: true },
    from: { x: 0, y: -10, opacity: 0, PointerEvent: "none" },
    enter: { x: 0, y: 0, opacity: 1, PointerEvent: "all" },
    leave: { x: 0, y: -10, opacity: 0, PointerEvent: "none" },
  });

  const transitionProfile = useTransition(handlerProfile, {
    config: { mass: 1, tension: 2000, friction: 60, clamp: true },
    from: { x: 0, y: -10, opacity: 0, PointerEvent: "none" },
    enter: { x: 0, y: 0, opacity: 1, PointerEvent: "all" },
    leave: { x: 0, y: -10, opacity: 0, PointerEvent: "none" },
  });

  // EVENT

  // Fungsi untuk menghitung jumlah barang yang ada pada keranjang kita

  const totalItemInCart = () => {
    return dataCart.cart
      .map((el, index) => {
        return el.qty;
      })
      .reduce((prev, curr) => prev + curr);
  };

  //function logout

  const onLogout = () => {
    localStorage.removeItem("token");
    dispatch(logoutAction());
    setHandlerProfile(false);
    dispatch({ type: "TOTALNULL" });
  };

  // PROTEKSI UNTUK KLIK ICON CART
  const onCLickIconCart = () => {
    if (dataUser.role_id !== 3) {
      history.push("/login");
    } else {
      history.push("/cart");
    }
  };

  // RENDERING

  // Render dropdown list category

  const renderDownCategory = () => {
    return transition((style, item) =>
      item ? (
        <animated.div
          style={style}
          className="header-down-category py-4 px-4 mt-3"
        >
          <div className="header-ddcategory-wrapper d-flex align-items-center justify-content-between w-100">
            {dataCategory.map((el, index) => {
              return (
                <button className="header-ddlist-category mr-4" key={el.id}>
                  {el.category}
                </button>
              );
            })}
          </div>
        </animated.div>
      ) : null
    );
  };

  // Render jika non user yang mengakses

  const renderLoginFalse = () => {
    return (
      <div className="d-none d-lg-flex align-items-center">
        <div className=" header-right ">
          <Link to="/login">
            <button className="header-masuk">Masuk</button>
          </Link>
        </div>
        <div>
          <Link to="/register">
            <button className="header-btn-daftar px-4 py-2">Daftar</button>
          </Link>
        </div>
      </div>
    );
  };

  // Render jika user sudah login

  const renderLoginTrue = () => {
    return (
      <button
        className="header-container-login d-none d-lg-flex align-items-center justify-content-between"
        onClick={() => setHandlerProfile(!handlerProfile)}
      >
        <div className="d-flex align-items-center">
          {dataUser.profile_picture ? (
            <img
              src={`${API_URL}${dataUser.profile_picture}`}
              alt="profpic"
              className="header-login-image mr-2"
            />
          ) : (
            <div className="header-nophoto d-flex align-items-center justify-content-center mr-2">
              <img src={asset.profpic} alt="profpic" />
            </div>
          )}

          <div className="header-profile-username">
            {`Hi, ${
              dataUser.username > 8
                ? dataUser.username.slice(0, 8) + "..."
                : dataUser.username
            }`}
          </div>
        </div>
        <div className="mr-2">
          <img src={asset.arrowdropdown} alt="prof-dd" />
        </div>
      </button>
    );
  };

  // Render dropdown jika user sudah login

  const renderDownProfile = () => {
    return transitionProfile((style, item) =>
      item ? (
        <animated.div
          style={style}
          className="header-down-profile-container p-2 mt-2"
        >
          <div className="d-flex flex-column justify-content-around h-100">
            <Link to="/profile" className="text-link">
              <div
                className="header-ddlist-wrapper d-flex align-items-center p-2"
                onClick={() => setHandlerProfile(false)}
              >
                <div className="mr-2">
                  <img src={asset.profpic} alt="profil" />
                </div>
                <div>Profil Saya</div>
              </div>
            </Link>
            <Link to="/profile/history" className="text-link">
              <div
                className="header-ddlist-wrapper d-flex align-items-center p-2"
                onClick={() => setHandlerProfile(false)}
              >
                <div className="mr-2">
                  <img src={asset.history} alt="history" />
                </div>
                <div>History Pesanan</div>
              </div>
            </Link>
            <Link to="/profile/address" className="text-link">
              <div
                className="header-ddlist-wrapper d-flex align-items-center p-2"
                onClick={() => setHandlerProfile(false)}
              >
                <div className="mr-2">
                  <img src={asset.alamat} alt="alamat" />
                </div>
                <div>Alamat</div>
              </div>
            </Link>
            <Link to="/" className="text-link">
              <div
                className="header-ddlist-wrapper d-flex align-items-center p-2 "
                onClick={onLogout}
              >
                <div className="mr-2">
                  <img src={asset.logout} alt="alamat" />
                </div>
                <div>Logout</div>
              </div>
            </Link>
          </div>
        </animated.div>
      ) : null
    );
  };

  // Render notif pada icon cart jika user menambahkan produk

  const renderNotifCart = () => {
    return dataCart.totalItem ? (
      dataCart.totalItem > 99 ? (
        <div className="header-notif-cart d-flex align-items-center justify-content-center">
          99+
        </div>
      ) : (
        <div className="header-notif-cart d-flex align-items-center justify-content-center">
          {dataCart.totalItem}
        </div>
      )
    ) : null;
  };

  // RETURN

  return (
    <div className="header-bar ">
      <div className="container" style={{ height: "74px" }}>
        <div className="row align-items-center justify-content-between h-100 pr-4 pr-lg-0">
          <div className="d-flex">
            <div style={{ marginRight: "57px" }}>
              <Link to="/">
                <img src={asset.logo} alt="logo" />
              </Link>
            </div>
            {location.pathname === "/checkout" ||
            location.pathname === "/checkout/payment" ? null : (
              <div
                className="d-none d-lg-flex align-items-center"
                style={{ fontWeight: "600", fontSize: "14px" }}
              >
                <Link to="/products" className="text-link">
                  <div style={{ position: "relative" }}>
                    <div>Produk</div>
                    {location.pathname === "/products" ? (
                      <div className="header-focus-border"></div>
                    ) : null}
                  </div>
                </Link>
                <div ref={ref} className="header-kategori mx-5">
                  <button
                    className="header-focus-category"
                    onClick={() => setHandlerCategory(!handlerCategory)}
                  >
                    Kategori
                  </button>
                  {renderDownCategory()}
                </div>
                <div>Promo</div>
              </div>
            )}
          </div>
          {location.pathname === "/checkout" ||
          location.pathname === "/checkout/payment" ? null : (
            <div className="d-flex align-items-center">
              <div className="header-right">
                <div onClick={onCLickIconCart}>
                  <img src={asset.cart} alt="cart-header" />
                  {renderNotifCart()}
                </div>
              </div>
              <div className="header-right">
                <img src={asset.notif} alt="notif-header" />
              </div>
              {dataUser.is_login ? (
                <div className="header-profil-wrapper" ref={refProfile}>
                  {renderLoginTrue()}
                  {renderDownProfile()}
                </div>
              ) : (
                renderLoginFalse()
              )}
              <div
                className="d-flex d-lg-none"
                onClick={() => setHandleHamburger(!handleHamburger)}
              >
                <img
                  src={handleHamburger ? asset.closehamburger : asset.hamburger}
                  alt="hamburger"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <Hamburger
        open={handleHamburger}
        close={() => setHandleHamburger(false)}
      />
    </div>
  );
}

export default Header;
