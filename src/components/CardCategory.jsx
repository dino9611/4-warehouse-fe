import React from "react";
import "./styles/cardCategory.css";

function CardCategory({ img, name }) {
  return (
    <div className="card-category-rectangle">
      <div className="d-flex flex-column justify-content-center align-items-center p-2 w-100 h-100">
        <div className="card-category-inner-circle">
          <div className="d-flex justify-content-center align-items-center h-100">
            <img
              src={img}
              alt=""
              width="75px"
              height="75px"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-center h-100">
          <div style={{ fontSize: "12px", fontWeight: "500" }}>{name}</div>
        </div>
      </div>
    </div>
  );
}

export default CardCategory;
