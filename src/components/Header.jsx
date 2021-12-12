import "./styles/header.css";
import asset from "./../assets/index";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { useTransition, animated } from "react-spring";
import ClickOutside from "./../helpers/ClickOutside";

const { logo, notif, cart, expanddown, profil, search } = asset;

function Header() {
  const [handlerCategory, setHandlerCategory] = useState(false);
  const [handlerProfile, setHandlerProfile] = useState(false);
  const [handleProduct, setHandleProduct] = useState(false);
  const ref = useRef();
  const refProfile = useRef();
  let username = "gangsarapasdasd";
  let login = true;

  ClickOutside(ref, () => setHandlerCategory(false));
  ClickOutside(refProfile, () => setHandlerProfile(false));

  const transition = useTransition(handlerCategory, {
    config: { mass: 1, tension: 500, friction: 60, clamp: true },
    from: { x: 0, y: -10, opacity: 0, PointerEvent: "none" },
    enter: { x: 0, y: 0, opacity: 1, PointerEvent: "all" },
    leave: { x: 0, y: -10, opacity: 0, PointerEvent: "none" },
  });

  const transitionProfile = useTransition(handlerProfile, {
    config: { mass: 1, tension: 500, friction: 60, clamp: true },
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
        <animated.div ref={ref} style={style} className="header-down-category">
          <div className="d-flex align-items-center justify-content-between w-100">
            {category.map((el, index) => {
              return <div key="index">{el}</div>;
            })}
          </div>
        </animated.div>
      ) : null
    );
  };

  const renderDownProfile = () => {
    return transitionProfile((style, item) =>
      item ? (
        <animated.div
          ref={refProfile}
          style={style}
          className="header-down-profile-container"
        >
          <div className="d-flex flex-column justify-content-around h-100">
            <div className="d-flex align-items-center">
              <div className="mr-2">
                <img src={profil} alt="profil" />
              </div>
              <Link to="/profile" className="text-link">
                <div>Profil Saya</div>
              </Link>
            </div>
            <div className="header-border-profil"></div>
            <div className="d-flex align-items-center">
              <div className="mr-2">
                <img src={cart} alt="history" />
              </div>
              <div>History Pesanan</div>
            </div>
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
          <img src={logo} alt="" className="header-login-image mr-2" />
          <div className="header-profile-username">
            Hi, {username.length > 8 ? username.slice(0, 8) + "..." : username}
          </div>
        </div>
        <div className="mr-2">
          <img src={asset.arrowdropdown} alt="" />
        </div>
      </button>
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
              <div className="header-kategori mx-5">
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
            <div className="header-right">
              <img src={cart} alt="" />
            </div>
            <div className="header-right">
              <img src={notif} alt="" />
            </div>
            {login ? (
              <div className="header-profil-wrapper">
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
