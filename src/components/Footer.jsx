import React from "react";
import { useLocation } from "react-router-dom";
import images from "./../assets";
import "./styles/footerBottom.css";

const { footer, facebook, instagram, wa, call } = images;

function Footer() {
  const location = useLocation();

  if (
    location.pathname === "/checkout" ||
    location.pathname === "/checkout/payment"
  )
    return null;

  return (
    <div>
      <div
        className="mt-5"
        style={{
          height: "236px",
          backgroundColor: "#0a4d3c",
        }}
      >
        <div className="container h-100">
          <div className="row d-flex justify-content-between align-items-center h-100">
            <div
              className="d-flex justify-content-between"
              style={{ width: "70%" }}
            >
              <div className="d-flex flex-column" style={{ width: "201px" }}>
                <div className="homepage-footer-title">Kategori</div>
                <div className="homepage-footer-content d-flex justify-content-between w-100">
                  <div
                    className="d-flex flex-column"
                    style={{ lineHeight: "2" }}
                  >
                    <div>Kopi</div>
                    <div>Teh</div>
                    <div>Susu</div>
                    <div>Coklat</div>
                  </div>
                  <div
                    className="d-flex flex-column"
                    style={{ lineHeight: "2" }}
                  >
                    <div>Rempah-rempah</div>
                    <div>Sayur</div>
                    <div>Buah</div>
                    <div>Kacang</div>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column justify-content-between">
                <div className="homepage-footer-title">Hubungi kami</div>
                <div
                  className="homepage-footer-content d-flex flex-column h-100"
                  style={{ lineHeight: "2" }}
                >
                  <div>Bantuan pelanggan</div>
                  <div>Partnership</div>
                  <div>Pengiriman</div>
                </div>
              </div>
              <div className="d-flex flex-column justify-content-between">
                <div className="homepage-footer-title">Tentang kami</div>
                <div className="homepage-footer-content d-flex flex-column justify-content-between h-100">
                  <div className="mb-4">Kenapa belanja di The Local?</div>
                  <div className="d-flex flex-column">
                    <div className="homepage-footer-title mt-">Follow us</div>
                    <div>
                      <img src={instagram} alt="logo-insta" className="mr-2" />
                      <img src={facebook} alt="logo-face" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column">
                <div className="homepage-footer-title">Customer service</div>
                <div className="homepage-footer-content d-flex align-items-center mb-2">
                  <img src={call} alt="call" />
                  <div className="ml-1">(+62) 81845008877</div>
                </div>
                <div className="homepage-footer-content d-flex align-items-center">
                  <img src={wa} alt="call" />
                  <div className="ml-1">(+62) 81845003100</div>
                </div>
              </div>
            </div>
            <div>
              <img src={footer} alt="logo-footers" />
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: "28px", backgroundColor: "#fcb537" }}>
        <div className="container footer-bottom h-100">
          <div className="row d-flex justify-content-between align-items-center h-100">
            <div>&copy; 2021 PT. Local Indonesia. All rights reserverd.</div>
            <div className="d-flex">
              <div className="mr-5">Kebijakan privasi</div>
              <div>Syarat dan ketentuan</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
