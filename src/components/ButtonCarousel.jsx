import React from "react";
import "./styles/buttonCarousel.css";
import images from "./../assets";

function ButtonCarousel({ img }) {
  return (
    <button className="button-carousel">
      <img src={img} alt="" />
    </button>
  );
}

export default ButtonCarousel;
