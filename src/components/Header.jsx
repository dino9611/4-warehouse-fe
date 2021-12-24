import "./styles/header.css";
import asset from "./../assets/index";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useTransition, animated } from "react-spring";
import ClickOutside from "./../helpers/ClickOutside";
import { API_URL } from "../constants/api";
import Cart from "../pages/user/Cart";
import { useSelector } from "react-redux";
import thousandSeparator from "../helpers/ThousandSeparator";
import ButtonPrimary from "./ButtonPrimary";
import { Avatar } from "@mui/material";

const { logo, notif, cart, expanddown, profil, search } = asset;

function Header() {
  // const [dataCart, setDataCart] = useState([]);
  const [handlerProduct, setHandlerProduct] = useState(false);
  const [handlerCategory, setHandlerCategory] = useState(false);
  const [handlerProfile, setHandlerProfile] = useState(false);
  const [handleProduct, setHandleProduct] = useState(false);
  const [handelCart, setHandleCart] = useState(false);
  const ref = useRef();
  const refProfile = useRef();
  const refCart = useRef();
  let username = "gangsarapasdasd";
  let login = true;

  const dataCart = useSelector((state) => state.cartReducer);
  const dataProfile = useSelector((state) => state.ProfileReducer);

  ClickOutside(ref, () => setHandlerCategory(false));
  ClickOutside(refProfile, () => setHandlerProfile(false));
  ClickOutside(refCart, () => setHandleCart(false));

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

  const transitionCart = useTransition(handelCart, {
    config: { mass: 1, tension: 2000, friction: 60, clamp: true },
    from: { x: 0, y: -10, opacity: 0, PointerEvent: "none" },
    enter: { x: 0, y: 0, opacity: 1, PointerEvent: "all" },
    leave: { x: 0, y: -10, opacity: 0, PointerEvent: "none" },
  });

  const renderDownCategory = () => {
    const category = [
      "Kopi",
      "Teh",
      "Susu",
      "Coklat",
      "Rempah-rempah",
      "Sayur",
      "Buah",
      "Kacang",
    ];

    return transition((style, item) =>
      item ? (
        <animated.div style={style} className="header-down-category">
          <div className="d-flex align-items-center justify-content-between w-100">
            {category.map((el, index) => {
              return <div key="index">{el}</div>;
            })}
          </div>
        </animated.div>
      ) : null
    );
  };

  const totalItemInCart = () => {
    return dataCart.cart
      .map((el, index) => {
        return el.qty;
      })
      .reduce((prev, curr) => prev + curr);
  };

  const renderDownProfile = () => {
    return transitionProfile((style, item) =>
      item ? (
        <animated.div style={style} className="header-down-profile-container">
          <div className="d-flex flex-column justify-content-around h-100">
            <div className="d-flex align-items-center">
              <div className="mr-2">
                <img src={profil} alt="profil" />
              </div>
              <Link to="/profile" className="text-link">
                <div onClick={() => setHandlerProfile(false)}>Profil Saya</div>
              </Link>
            </div>
            <div className="header-border-profil"></div>
            <Link to="/profile/history" className="text-link">
              <div
                className="d-flex align-items-center"
                onClick={() => setHandlerProfile(false)}
              >
                <div className="mr-2">
                  <img src={cart} alt="history" />
                </div>
                <div>History Pesanan</div>
              </div>
            </Link>
            <div className="header-border-profil"></div>
            <div className="d-flex align-items-center">
              <div className="mr-2">
                <img src={search} alt="alamat" />
              </div>
              <div>Alamat</div>
            </div>
          </div>
        </animated.div>
      ) : null
    );
  };

  const renderLoginTrue = () => {
    return (
      <button
        className="header-container-login d-flex align-items-center justify-content-between"
        onClick={() => setHandlerProfile(!handlerProfile)}
      >
        <div className="d-flex align-items-center">
          <img
            src={
              dataProfile.profile_picture ? (
                `${API_URL}${dataProfile.profile_picture}`
              ) : (
                <div className="profile-photo">
                  <Avatar className="w-100 h-100 d-flex align-items-center justify-content-center">
                    {dataProfile.username.slice(0, 1).toUpperCase()}
                  </Avatar>
                </div>
              )
            }
            alt=""
            className="header-login-image mr-2"
          />
          <div className="header-profile-username">
            Hi,{" "}
            {dataProfile.username.length > 8
              ? dataProfile.username.slice(0, 8) + "..."
              : dataProfile.username}
          </div>
        </div>
        <div className="mr-2">
          <img src={asset.arrowdropdown} alt="" />
        </div>
      </button>
    );
  };

  const renderListProduct = () => {
    return dataCart.cart.map((el, index) => {
      return (
        <div key={index} className="d-flex align-items-center mb-3">
          <img
            src={`${API_URL}/${el.images[0]}`}
            alt=""
            className="header-dd-image mr-2"
          />
          <div>
            <div className="history-list-price">{`${
              el.qty
            } barang x Rp ${thousandSeparator(el.price)}`}</div>
            <div className="header-dd-nameprod">
              {el.name.length > 35
                ? el.name.charAt(0).toUpperCase() + el.name.slice(1, 35) + "..."
                : el.name.charAt(0).toUpperCase() + el.name.slice(1)}
            </div>
          </div>
        </div>
      );
    });
  };

  const renderDropdownCart = () => {
    return transitionCart((style, item) =>
      item ? (
        <animated.div style={style} className="header-dd-cart">
          <div className="header-dd-top d-flex align-items-center mb-2 py-3 px-3">
            <img src={asset.centangijo} alt="centang" />
            <div className="header-cart-title ml-2">
              Ditambahkan ke keranjang
            </div>
            <Link to="/cart">
              <button
                className="header-dd-seecart"
                onClick={() => setHandleCart(false)}
              >
                Lihat Keranjang
              </button>
            </Link>
          </div>
          <div className="header-dd-list px-3">{renderListProduct()}</div>
        </animated.div>
      ) : null
    );
  };

  return (
    <div className="header-bar">
      <div className="container" style={{ height: "74px" }}>
        <div className="row align-items-center justify-content-between h-100">
          <div className="d-flex">
            <div style={{ marginRight: "57px" }}>
              <Link to="/">
                <img src={logo} alt="" />
              </Link>
            </div>
            <div
              className="d-flex align-items-center"
              style={{ fontWeight: "600", fontSize: "14px" }}
            >
              <Link to="/products" className="text-link">
                <div style={{ position: "relative" }}>
                  <div className="" onClick={() => setHandleProduct(true)}>
                    Produk
                  </div>
                  {handleProduct ? (
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
          </div>
          <div className="d-flex align-items-center">
            <div className="header-right" ref={refCart}>
              <div onClick={() => setHandleCart(!handelCart)}>
                <img src={cart} alt="cart-header" />
                <div className="header-notif-cart d-flex align-items-center justify-content-center">
                  {dataCart.cart.length
                    ? totalItemInCart() > 99
                      ? "99+"
                      : totalItemInCart()
                    : null}
                </div>
              </div>
              {renderDropdownCart()}
            </div>
            <div className="header-right">
              <img src={notif} alt="notif-header" />
            </div>
            {login ? (
              <div className="header-profil-wrapper" ref={refProfile}>
                {renderLoginTrue()}
                {renderDownProfile()}
              </div>
            ) : (
              <>
                <div className="header-right ">
                  <button className="header-masuk">Masuk</button>
                </div>
                <div>
                  <button className="header-btn-daftar header-daftar-rectangle d-flex align-items-center justify-content-center">
                    Daftar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
