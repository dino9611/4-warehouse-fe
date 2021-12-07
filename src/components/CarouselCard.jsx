import React, { useState } from "react";
import "./styles/carousel.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function CarouselProduct({ children }) {
  const [tes, setTes] = useState(null);

  const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "red" }}
        onClick={onClick}
      />
    );
  };

  const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          background: "green",
          position: "absolute",
          right: "50%",
        }}
        onClick={onClick}
      />
    );
  };

  const settings = {
    infinite: false,
    speed: 500,
    slidesToScroll: 4,
    slidesToShow: 4,
    beforeChange: (current, next) => {
      setTes(next);
    },
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    // arrows: false,
  };
  console.log(tes);
  return (
    <div>
      <Slider {...settings}>{children}</Slider>
    </div>
  );
}

export default CarouselProduct;
