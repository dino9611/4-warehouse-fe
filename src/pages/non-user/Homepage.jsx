import React from "react";
import "./styles/homepage.css";
import Header from "../../components/Header";
import Carousel from "./../../components/Carousel";
import CardCategory from "../../components/CardCategory";
import images from "./../../assets";

const { buah, coklat, kacang, kopi, rempah, sayur, susu, teh } = images;

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
        <div className="row">
          <h4 className="homepage-text-category">
            Temukan produk dari kategori
          </h4>
        </div>
        <div className="row d-flex justify-content-between w-100 mt-3">
          <CardCategory img={kopi} name="Kopi" />
          <CardCategory img={teh} name="Teh" />
          <CardCategory img={susu} name="Susu" />
          <CardCategory img={coklat} name="Coklat" />
          <CardCategory img={rempah} name="Rempah" />
          <CardCategory img={sayur} name="Sayur" />
          <CardCategory img={buah} name="Buah" />
          <CardCategory img={kacang} name="Kacang" />
        </div>
      </div>
    </div>
  );
}

export default Homepage;
