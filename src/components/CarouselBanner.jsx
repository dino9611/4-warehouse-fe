import React, { useState } from "react";
import "./styles/carousel.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import imagesBanner from "./../assets";

const images = [
  imagesBanner.banner1,
  imagesBanner.banner2,
  imagesBanner.banner1,
  imagesBanner.banner3,
  imagesBanner.banner2,
  imagesBanner.banner3,
];

function Carousel() {
  const [imageIndex, setImageIndex] = useState(0);

  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <div id="next">
        <button
          onClick={onClick}
          className="carousel-btn d-flex align-items-center justify-content-center"
        >
          <img src={imagesBanner.btnright} alt="right" />
        </button>
      </div>
    );
  };

  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <div id="prev" className="d-flex ">
        <button
          onClick={onClick}
          className="carousel-btn d-flex align-items-center justify-content-center"
        >
          <img src={imagesBanner.btnleft} alt="left" />
        </button>
      </div>
    );
  };

  const renderCarousel = () => {
    return images.map((el, idx) => {
      return (
        <div
          key={idx}
          className="carousel-testing mt-4 d-flex align-items-center justify-content-center"
        >
          <div
            style={{ backgroundImage: `url(${el})` }}
            className={
              idx === imageIndex
                ? "slide active-slide carousel-content p-0 mb-4"
                : "slide carousel-content p-0 mb-4"
            }
          ></div>
        </div>
      );
    });
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    centerPadding: "0px",
    centerMode: true,
    arrows: true,
    touchMove: true,
    swipeToSlide: true,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease",
    beforeChange: (current, next) => {
      setImageIndex(next);
    },
    appendDots: (dots) => {
      return (
        <div>
          <ul style={{ margin: "auto" }}> {dots} </ul>
        </div>
      );
    },
    customPaging: (i) => (
      <div
        className={
          i === imageIndex ? "carousel-dots dots-active" : "carousel-dots"
        }
      ></div>
    ),
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="carousel-banner-wrapper d-flex align-items-center justify-content-center">
      <Slider
        {...settings}
        className="carousel-slider d-flex justify-content-center h-100"
      >
        {renderCarousel()}
      </Slider>
    </div>
  );
}

export default Carousel;
