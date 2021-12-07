import React from "react";
import "./styles/homepage.css";
import Header from "../../components/Header";
import Carousel from "./../../components/Carousel";

function Homepage() {
  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="homepage-carousel w-100">
        <div className="homepage-carousel-wrapper">
          <Carousel />
        </div>
      </div>
      <div className="container mt-4">
        <h4 className="homepage-text-category">Temukan produk dari kategori</h4>
      </div>
    </div>
  );
}

export default Homepage;
