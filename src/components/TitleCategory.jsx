import React from "react";
import { useSelector } from "react-redux";
import "./styles/titleCategory.css";
import images from "./../assets";

function TitleCategory({ cat, bgColor, children, img, index, refCat }) {
  const carouselIndex = useSelector((state) => state.carouselReducer);

  return (
    <div
      className={`title-banner-category ${
        index > 0 && refCat === cat
          ? "title-banner-category-no-active"
          : "title-banner-category-active"
      }`}
      style={{ backgroundColor: bgColor }}
    >
      <div
        className={`d-flex flex-column align-items-center justify-content-around pr-5 pl-4 py-2 h-100  vector1`}
      >
        <img
          src={img}
          alt=""
          style={{
            width: "80px",
            aspectRatio: "1",
            objectFit: "cover",
            zIndex: "2",
          }}
        />
        <div
          style={{
            fontSize: "1.250em",
            fontWeight: "600",
            color: "#fff",
            textAlign: "center",
            zIndex: "2",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default TitleCategory;
