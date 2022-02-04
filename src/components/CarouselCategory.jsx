import React, { Component } from "react";
import Slider from "react-slick";

function CarouselCategory() {
  const settings = {
    infinite: false,
    speed: 700,
    slidesToScroll: 5,
    slidesToShow: 5,
  };
  return (
    <div>
      <Slider {...settings}>{children}</Slider>
    </div>
  );
}

export default CarouselCategory;
