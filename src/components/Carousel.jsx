import React, { useState } from "react";
import "./styles/carousel.css";
import Slider from "react-slick";
import img1 from "./../assets/1.jpeg";
import img2 from "./../assets/2.png";
import img3 from "./../assets/3.jpeg";
import img4 from "./../assets/4.jpeg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const images = [img1, img2, img3, img4, img2, img3, img4];

function Carousel() {
  const [imageIndex, setImageIndex] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    centerPadding: "0px",
    centerMode: true,
    arrows: false,
    touchMove: false,
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
  };

  return (
    <div>
      <Slider {...settings}>
        {images.map((el, idx) => {
          return (
            <div
              key={idx}
              className={idx === imageIndex ? "slide active-slide" : "slide"}
            >
              <img src={el} alt={el} className="carousel-img" />
            </div>
          );
        })}
      </Slider>
    </div>
  );
}

export default Carousel;
