import "./styles/header.css";
import asset from "./../assets/index";

const { logo, notif, cart } = asset;

function Header() {
  return (
    <div className="header-bar">
      <div className="container" style={{ height: "74px" }}>
        <div className="row d-flex align-items-center justify-content-between h-100">
          <div className="d-flex">
            <div style={{ marginRight: "57px" }}>
              <img src={logo} alt="" />
            </div>
            <div
              className="d-flex align-items-center"
              style={{ fontWeight: "600", fontSize: "14px" }}
            >
              <div>Kategori</div>
              <div className="mx-5">Produk</div>
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
            <div className="header-right ">
              <button className="header-masuk">Masuk</button>
            </div>
            <div>
              <button className="header-btn-daftar header-daftar-rectangle d-flex align-items-center justify-content-center">
                Daftar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
