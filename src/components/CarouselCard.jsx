import React, { useState, useRef } from "react";
import Slider from "react-slick";
import next from "./../assets/next.svg";
import prev from "./../assets/prev.svg";
import "./styles/carouselCard.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function CarouselCard({ children }) {
  const [newIndex, setNewIndex] = useState(null);
  const [oldIndex, setOldIndex] = useState(null);

  console.log(newIndex, oldIndex);
  const sliderRef = useRef();

  const renderArrow = () => {
    let nextGone = "";
    let prevGone = "";
    const currentIndex = newIndex - oldIndex;

    if (currentIndex < 4 && currentIndex > 0) {
      nextGone = " next-gone";
    } else if (!newIndex) {
      prevGone = " prev-gone";
    }

    return (
      <div className="slider-arrow">
        <button
          className={`arrow-btn prev` + prevGone}
          onClick={() => sliderRef.current.slickPrev()}
        >
          <img src={prev} alt="prevArrow" />
        </button>
        <button
          className={`arrow-btn next` + nextGone}
          onClick={() => sliderRef.current.slickNext()}
        >
          <img src={next} alt="nextArrow" />
        </button>
      </div>
    );
  };

  const settings = {
    infinite: false,
    arrows: false,
    speed: 500,
    slidesToScroll: 5.5,
    slidesToShow: 5.5,
    beforeChange: (oldIndex, newIndex) => {
      setNewIndex(newIndex);
      setOldIndex(oldIndex);
    },
  };

  return (
    <div>
      {renderArrow()}
      <Slider ref={sliderRef} {...settings} className="carousel-tes">
        {children}
      </Slider>
    </div>
  );
}

export default CarouselCard;
