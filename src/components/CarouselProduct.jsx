import React, { useState, useRef } from "react";
import Slider from "react-slick";
import next from "./../assets/next.svg";
import prev from "./../assets/prev.svg";
import "./styles/carouselProduct.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import images from "./../assets";

function CarouselProduct({ children, cat }) {
  const [newIndex, setNewIndex] = useState(null);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const mediaQuery = window.matchMedia("(max-width: 1024px)");

  const btnRef = useRef();

  const dispatch = useDispatch();

  const NextArrow = (props) => {
    const { onClick } = props;

    return (
      <div
        id="next-product"

        // className={`${
        //   isMouseOver ? "next-product-active" : "next-product-inactive"
        // }`}
      >
        <button
          onClick={onClick}
          className="carousel-product-btn d-flex align-items-center justify-content-center"
          value={cat}
          ref={btnRef}
        >
          <img src={images.btnright} alt="right" />
        </button>
      </div>
    );
  };

  const PrevArrow = (props) => {
    const { onClick } = props;

    return (
      <div
        id="prev-product"
        // className={`${
        //   isMouseOver
        //     ? newIndex === 0
        //       ? "prev-product-inactive"
        //       : "prev-product-active"
        //     : "prev-product-inactive"
        // }`}
      >
        <button
          onClick={onClick}
          className="carousel-product-btn d-flex align-items-center justify-content-center"
          value={cat}
          ref={btnRef}
        >
          <img src={images.btnleft} alt="left" />
        </button>
      </div>
    );
  };

  const settings = {
    infinite: false,
    speed: 700,
    slidesToScroll: 5,
    slidesToShow: 5,
    beforeChange: (oldIndex, newIndex) => {
      setNewIndex(newIndex);

      let type;
      let payload;

      if (cat === "carousel-susu") {
        type = "CHANGESUSU";
        payload = {
          indexSusu: newIndex,
          refSusu: btnRef.current.value,
        };
      } else if (cat === "carousel-buah") {
        type = "CHANGEBUAH";
        payload = {
          indexBuah: newIndex,
          refBuah: btnRef.current.value,
        };
      } else if (cat === "carousel-bumbu") {
        type = "CHANGEBUMBU";
        payload = {
          indexBumbu: newIndex,
          refBumbu: btnRef.current.value,
        };
      } else if (cat === "carousel-coklat") {
        type = "CHANGECOKLAT";
        payload = {
          indexCoklat: newIndex,
          refCoklat: btnRef.current.value,
        };
      }

      dispatch({ type, payload });
    },
    nextArrow: mediaQuery.matches ? (
      <button
        ref={btnRef}
        value={cat}
        style={{ opacity: "1", pointerEvents: "none" }}
      ></button>
    ) : (
      <NextArrow />
    ),
    prevArrow: mediaQuery.matches ? (
      <button
        ref={btnRef}
        value={cat}
        style={{ opacity: "1", pointerEvents: "none" }}
      ></button>
    ) : (
      <PrevArrow />
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
    ],
  };

  return (
    <div>
      <Slider {...settings} className="carousel-prod-resp pl-2 pl-md-0">
        {children}
      </Slider>
    </div>
  );
}

export default CarouselProduct;
