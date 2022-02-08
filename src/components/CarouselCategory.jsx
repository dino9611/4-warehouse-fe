import axios from "axios";
import React, { Component, useEffect, useState } from "react";
import Slider from "react-slick";
import { API_URL } from "../constants/api";
import images from "./../assets";
import CardCategory from "./CardCategory";
import SkeletonCardCategory from "./SkeletonCardCategory";

const { produk1, buah, coklat, kacang, kopi, rempah, sayur, susu, teh } =
  images;

const categoryImg = [kopi, teh, susu, coklat, rempah, sayur, buah, kacang];

function CarouselCategory() {
  const [dataCategory, setDataCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        let res = await axios.get(`${API_URL}/product/category`);

        setDataCategory(res.data);

        setLoading(false);
      } catch (error) {}
    })();
  }, []);

  const settings = {
    speed: 700,

    infinite: true,
    slidesToShow: 8,
    slidesToScroll: 1,
    touchMove: true,
    swipeToSlide: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 7,
          slidesToScroll: 1,
          initalSlide: 0,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initalSlide: 0,
        },
      },
    ],
  };

  return (
    <div>
      <Slider {...settings} className="carousel-cat-slider pl-4 pl-lg-0">
        {loading
          ? [1, 2, 3, 4, 5, 6, 7, 8].map((el) => (
              <div className="d-flex align-items-center justify-content-center px-1 py-2">
                <SkeletonCardCategory key={el} />
              </div>
            ))
          : dataCategory.map((el, index) => (
              <div className="d-flex align-items-center justify-content-center px-1 py-2">
                <CardCategory img={categoryImg[index]} name={el.category} />
              </div>
            ))}
      </Slider>
    </div>
  );
}

export default CarouselCategory;
