import axios from "axios";
import React, { Component } from "react";
import { useState } from "react";
import { useEffect } from "react";
import Slider from "react-slick";
import { API_URL } from "../constants/api";
import CardProduct from "./CardProduct";
import SkeletonCardProduct from "./SkeletonCardProduct";

function CarouselHotItems() {
  const [dataHotItems, setDataHotItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        let resHotProduct = await axios.get(
          `${API_URL}/product/get/hot-product`
        );

        setDataHotItems(resHotProduct.data);

        setLoading(false);
      } catch (error) {}
    })();
  }, []);

  const settings = {
    speed: 700,
    slidesToShow: 5,
    slidesToScroll: 1,
    touchMove: true,
    swipeToSlide: true,
    arrows: false,
    infinite: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="col-sm p-0" style={{ overflow: "hidden" }}>
      <Slider {...settings} className="carousel-cat-slider">
        {loading
          ? [1, 2, 3, 4, 5, 6, 7, 8].map((el) => (
              <div className="d-flex align-items-center justify-content-center py-2">
                <SkeletonCardProduct key={el} />
              </div>
            ))
          : dataHotItems.map((el, index) => (
              <div className="d-flex align-items-center justify-content-center py-2">
                <CardProduct
                  key={index}
                  img={`${API_URL}/${el.images[0]}`}
                  category={el.category}
                  title={el.name}
                  price={el.price}
                  total_stock={parseInt(el.total_stock)}
                  data={el}
                />
              </div>
            ))}
      </Slider>
    </div>
  );
}

export default CarouselHotItems;
