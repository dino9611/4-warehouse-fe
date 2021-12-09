import "./styles/header.css";
import asset from "./../assets/index";
import { Link } from "react-router-dom";
import { useState } from "react";

const { logo, notif, cart, expanddown, profil, search } = asset;

function Header() {
  const [handlerCategory, setHandlerCategory] = useState(false);
  const [handlerProfile, setHandlerProfile] = useState(false);
  let username = "gangsarap";
  let login = true;

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
    return (
      <div className="header-down-category">
        <div className="d-flex align-items-center justify-content-between w-100">
          {category.map((el, index) => {
            return <div key="index">{el}</div>;
          })}
        </div>
      </div>
    );
  };

  const onClickDropdown = (e) => {
    console.log(e.target);
    const isDropdownButton = e.target.matches("[data-dropdown-button]");
    if (!isDropdownButton && e.target.closest("[data-dropdown]") != null)
      return;

    let currentDropdown;
    if (isDropdownButton) {
      currentDropdown = e.target.closest("[data-dropdown]");
      currentDropdown.classList.toggle("active");
    }

    document.querySelectorAll("[data-dropdown].active").forEach((dropdown) => {
      if (dropdown === currentDropdown) return;
      dropdown.classList.remove("active");
    });
  };

  const renderDownProfile = () => {
    return (
      <div className="header-down-profile-container">
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
      </div>
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
            {username.length > 8 ? username.slice(0, 8) + "..." : username}
          </div>
        </div>
        <div>
          <img src={expanddown} alt="" />
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
                <div>Produk</div>
              </Link>
              <div className="header-kategori mx-5">
                <button
                  className="header-focus-category"
                  onClick={() => setHandlerCategory(!handlerCategory)}
                >
                  Kategori
                </button>
                {handlerCategory ? (
                  <>
                    {renderDownCategory()}{" "}
                    <div className="header-focus-border"></div>
                  </>
                ) : null}
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
                {handlerProfile ? renderDownProfile() : null}
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
